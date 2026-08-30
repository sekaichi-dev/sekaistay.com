#!/usr/bin/env node
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AUTH_FILE = path.join(__dirname, 'auth.json');
const LOG_FILE = path.join(__dirname, 'archive.log');
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');
const CULL_FILE = path.join(__dirname, 'cull-keys.txt');

const DRY_RUN = process.env.DRY_RUN === 'true';
const LOGIN_ONLY = process.argv.includes('--login-only');
const LIMIT = Number(process.env.LIMIT ?? (DRY_RUN ? 1 : 0));
const DELAY_MS = Number(process.env.DELAY_MS ?? 3000);
const HEADLESS = process.env.HEADLESS !== 'false';

if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR);

const log = (msg) => {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG_FILE, line + '\n');
};
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const shot = async (page, name) => {
  const file = path.join(SCREENSHOTS_DIR, `${Date.now()}-${name}.png`);
  await page.screenshot({ path: file, fullPage: false });
  return file;
};

async function login(context) {
  const { NOTE_EMAIL, NOTE_PASSWORD } = process.env;
  if (!NOTE_EMAIL || !NOTE_PASSWORD) throw new Error('NOTE_EMAIL / NOTE_PASSWORD required in .env');
  const page = await context.newPage();
  log('logging in...');
  await page.goto('https://note.com/login', { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle').catch(() => {});
  const emailInput = page.locator('input[placeholder*="mail"], input[placeholder*="note ID"]').first();
  const passwordInput = page.locator('input[type="password"]').first();
  await emailInput.waitFor({ timeout: 15000 });
  await emailInput.fill(NOTE_EMAIL);
  await passwordInput.fill(NOTE_PASSWORD);
  await Promise.all([
    page.waitForURL((url) => !url.toString().includes('/login'), { timeout: 30000 }),
    page.locator('button:has-text("ログイン")').first().click(),
  ]);
  await context.storageState({ path: AUTH_FILE });
  log('login OK, auth.json saved');
  await page.close();
}

// Get all published article keys via internal API
async function fetchAllPublishedKeys(context) {
  const page = await context.newPage();
  await page.goto('https://note.com/notes?status=published', { waitUntil: 'domcontentloaded' });
  await sleep(1500);

  const allKeys = [];
  let pageNum = 1;
  while (true) {
    const res = await page.evaluate(async (p) => {
      const r = await fetch(`/api/v2/note_list/contents?page=${p}&status=published`, {
        credentials: 'include',
      });
      return await r.json();
    }, pageNum);
    const items = res?.data?.contents ?? [];
    if (items.length === 0) break;
    for (const c of items) allKeys.push({ key: c.key, name: c.name, publishAt: c.publishAt, status: c.status });
    log(`  fetched page ${pageNum}: +${items.length} (total ${allKeys.length})`);
    if (res?.data?.isLastPage) break;
    pageNum++;
    await sleep(300);
  }
  await page.close();
  return allKeys;
}

async function archiveByKey(context, key, articleInfo) {
  const page = await context.newPage();
  // /notes?status=published & search by content key — but the list view doesn't directly accept a key filter.
  // Instead: navigate to /notes?status=published, scroll/paginate until target row is visible, then click its menu.
  // Simpler: use the API to position to the page containing the key.
  // Even simpler: open /notes page and just click the article card's more button directly via attribute selector.
  await page.goto('https://note.com/notes?status=published', { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle').catch(() => {});
  await sleep(1500);

  // The article list uses URL keys. Find the row containing /n/<key> and click its associated "..." menu.
  // Article rows: locate the link to /sekaistay/n/<key>, then walk up to its parent .o-articleList__item.
  const targetRow = page.locator(`a[href*="/sekaistay/n/${key}"], a[href*="/n/${key}"]`).first();
  let needsScroll = await targetRow.count() === 0;

  if (needsScroll) {
    // Scroll the list until the target appears. The list seems to lazy-load.
    log(`  ${key}: not on first page, scrolling...`);
    for (let i = 0; i < 80 && needsScroll; i++) {
      await page.mouse.wheel(0, 800);
      await sleep(400);
      needsScroll = await targetRow.count() === 0;
    }
    if (needsScroll) {
      log(`  ✗ ${key}: not found after scrolling`);
      await page.close();
      return { key, status: 'not-found-after-scroll' };
    }
  }

  await targetRow.scrollIntoViewIfNeeded();
  await sleep(300);

  // Walk up from the link to find the parent article-list-item, then locate the "..." button within
  const moreBtn = page.locator(`xpath=//a[contains(@href,'/n/${key}')]/ancestor::li[1]//button[contains(@class,'o-articleList__more') or contains(@class,'a-icon--more')]`).first();

  if (await moreBtn.count() === 0) {
    log(`  ✗ ${key}: more button not found on row`);
    await shot(page, `nomore-${key}`);
    await page.close();
    return { key, status: 'more-not-found' };
  }

  await moreBtn.click({ force: true });
  await sleep(800);

  const draftBtn = page.locator('button.m-basicBalloonList__button:has-text("下書きに戻す")').first();
  if (await draftBtn.count() === 0) {
    log(`  ✗ ${key}: draft button not in popup`);
    await shot(page, `nodraft-${key}`);
    await page.close();
    return { key, status: 'draft-btn-not-found' };
  }

  if (DRY_RUN) {
    log(`  [DRY] would click 下書きに戻す for ${key}`);
    await shot(page, `dry-${key}`);
    await page.close();
    return { key, status: 'dry-ok' };
  }

  await draftBtn.click();
  await sleep(1500);

  // Confirm dialog (might appear)
  const confirmBtn = page.locator('button:has-text("下書きに戻す"):not(.m-basicBalloonList__button), button:has-text("OK")').first();
  if (await confirmBtn.count() > 0 && await confirmBtn.isVisible().catch(() => false)) {
    await confirmBtn.click();
    await sleep(1500);
  }

  await page.close();
  return { key, status: 'archived' };
}

async function main() {
  const browser = await chromium.launch({ headless: HEADLESS, slowMo: 50 });
  const ctxOptions = fs.existsSync(AUTH_FILE) ? { storageState: AUTH_FILE } : {};
  if (ctxOptions.storageState) log('reusing existing auth.json');
  const context = await browser.newContext({ ...ctxOptions, viewport: { width: 1400, height: 900 } });

  if (!fs.existsSync(AUTH_FILE)) await login(context);
  if (LOGIN_ONLY) { await browser.close(); return; }

  // Optionally cross-check with note's actual published list
  if (process.env.VERIFY === 'true') {
    log('verifying against note published list...');
    const remote = await fetchAllPublishedKeys(context);
    log(`note reports ${remote.length} published articles`);
    fs.writeFileSync(path.join(__dirname, 'remote-published.json'), JSON.stringify(remote, null, 2));
  }

  const keys = fs.readFileSync(CULL_FILE, 'utf8').split('\n').map(s => s.trim()).filter(Boolean);
  const target = LIMIT > 0 ? keys.slice(0, LIMIT) : keys;
  log(`will process ${target.length} / ${keys.length} articles (DRY_RUN=${DRY_RUN})`);

  const results = [];
  for (let i = 0; i < target.length; i++) {
    const key = target[i];
    log(`[${i + 1}/${target.length}] ${key}`);
    try {
      const r = await archiveByKey(context, key);
      log(`  → ${r.status}`);
      results.push(r);
    } catch (e) {
      log(`  ✗ error: ${e.message}`);
      results.push({ key, status: 'error', error: e.message });
    }
    if (i < target.length - 1) await sleep(DELAY_MS);
  }

  const counts = {};
  for (const r of results) counts[r.status] = (counts[r.status] ?? 0) + 1;
  log('=== summary ===');
  for (const [s, c] of Object.entries(counts)) log(`  ${s}: ${c}`);

  fs.writeFileSync(path.join(__dirname, `results-${Date.now()}.json`), JSON.stringify(results, null, 2));
  await context.storageState({ path: AUTH_FILE });
  await browser.close();
}

main().catch((e) => { log('FATAL: ' + e.stack); process.exit(1); });
