#!/usr/bin/env node
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AUTH_FILE = path.join(__dirname, 'auth.json');
const LOG_FILE = path.join(__dirname, 'eyecatch.log');
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');
const EYECATCH_DIR = path.join(__dirname, 'note-assets', 'eyecatch');

const DRY_RUN = process.env.DRY_RUN === 'true';
const LIMIT_KEY = process.env.ONLY_KEY || null;
const HEADLESS = process.env.HEADLESS !== 'false';

const log = (msg) => {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG_FILE, line + '\n');
};
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const shot = async (page, name) => {
  const file = path.join(SCREENSHOTS_DIR, `${Date.now()}-eyecatch-${name}.png`);
  await page.screenshot({ path: file, fullPage: false });
  log(`shot: ${file}`);
  return file;
};

// Map: article key → image file in EYECATCH_DIR
const targets = [
  { key: 'nf1bf95dabb07', img: 'nf1bf95dabb07.jpg', title: '民泊 代行 初回相談 無料 会社の選び方' },
  { key: 'n9aea3b0cd629', img: 'n9aea3b0cd629.jpg', title: '民泊に観葉植物を配置する4つのメリット' },
  { key: 'n4f791cacc1ee', img: 'n4f791cacc1ee.jpg', title: '民泊の稼働率が低い原因と改善方法' },
];

async function uploadOne(context, target) {
  const imgPath = path.join(EYECATCH_DIR, target.img);
  if (!fs.existsSync(imgPath)) throw new Error(`Image not found: ${imgPath}`);

  const page = await context.newPage();
  log(`[${target.key}] opening editor`);
  await page.goto(`https://note.com/notes/${target.key}/edit`, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle').catch(() => {});
  await sleep(2500);
  await shot(page, `${target.key}-01-before`);

  // Click the "画像を追加" button → triggers filechooser
  const addImgBtn = page.locator('button[aria-label="画像を追加"]').first();
  const hasAddBtn = await addImgBtn.count() > 0;

  if (!hasAddBtn) {
    log(`  eyecatch already saved in draft — skipping upload, going straight to publish`);
  } else {

  log(`  step 1: clicking 画像を追加`);
  await addImgBtn.click();
  await sleep(800);
  await shot(page, `${target.key}-02-submenu`);

  log(`  step 2: clicking 画像をアップロード`);
  const uploadOption = page.locator('text=画像をアップロード').first();
  if (await uploadOption.count() === 0) {
    log(`  ✗ "画像をアップロード" option not found`);
    await page.close();
    return { key: target.key, status: 'upload-option-not-found' };
  }
  const fcPromise = page.waitForEvent('filechooser', { timeout: 10000 });
  await uploadOption.click();
  const fc = await fcPromise.catch(() => null);
  if (!fc) {
    log(`  ✗ filechooser did not appear`);
    await shot(page, `${target.key}-02b-no-fc`);
    await page.close();
    return { key: target.key, status: 'no-filechooser' };
  }

  log(`  setting file: ${imgPath}`);
  await fc.setFiles(imgPath);
  await sleep(4000); // wait for upload + crop dialog
  await shot(page, `${target.key}-03-crop-dialog`);

  // Crop dialog opens — click "保存" to confirm
  log(`  clicking 保存 in crop dialog`);
  const saveCrop = page.locator('button:has-text("保存")').last();
  if (await saveCrop.count() === 0) {
    log(`  ✗ crop 保存 button not found`);
    await page.close();
    return { key: target.key, status: 'crop-save-not-found' };
  }
  await saveCrop.click();
  await sleep(3000); // wait for crop to apply
  await shot(page, `${target.key}-04-after-crop`);
  } // end of else (hasAddBtn)

  if (DRY_RUN) {
    log(`  [DRY] skipping publish, eyecatch saved in draft`);
    await page.close();
    return { key: target.key, status: 'dry-uploaded' };
  }

  // Click "公開に進む" → publish dialog
  log(`  clicking 公開に進む`);
  const publishBtn = page.locator('button:has-text("公開に進む")').first();
  if (await publishBtn.count() === 0) {
    log(`  ✗ 公開に進む not found`);
    await shot(page, `${target.key}-04-no-publish`);
    await page.close();
    return { key: target.key, status: 'no-publish-btn' };
  }
  await publishBtn.click();
  await sleep(2000);
  await shot(page, `${target.key}-04-publish-dialog`);

  // Inside publish dialog, click 更新する or 公開する
  const finalBtn = page.locator('button:has-text("更新する"), button:has-text("公開する"), button:has-text("投稿する")').last();
  if (await finalBtn.count() === 0) {
    log(`  ✗ no final publish button`);
    await shot(page, `${target.key}-05-no-final`);
    await page.close();
    return { key: target.key, status: 'no-final-btn' };
  }
  await finalBtn.click();
  await sleep(4000);
  await shot(page, `${target.key}-05-published`);

  await page.close();
  return { key: target.key, status: 'published' };
}

async function main() {
  const browser = await chromium.launch({ headless: HEADLESS, slowMo: 100 });
  if (!fs.existsSync(AUTH_FILE)) throw new Error('auth.json missing — run npm run login first');
  const context = await browser.newContext({ storageState: AUTH_FILE, viewport: { width: 1400, height: 1000 } });

  const list = LIMIT_KEY ? targets.filter(t => t.key === LIMIT_KEY) : targets;
  log(`processing ${list.length} articles (DRY_RUN=${DRY_RUN})`);

  const results = [];
  for (const t of list) {
    try {
      const r = await uploadOne(context, t);
      log(`  → ${r.status}`);
      results.push(r);
    } catch (e) {
      log(`  ✗ error: ${e.message}`);
      results.push({ key: t.key, status: 'error', error: e.message });
    }
    await sleep(3000);
  }

  log('=== summary ===');
  const counts = {};
  for (const r of results) counts[r.status] = (counts[r.status] ?? 0) + 1;
  for (const [s, c] of Object.entries(counts)) log(`  ${s}: ${c}`);
  fs.writeFileSync(path.join(__dirname, `eyecatch-results-${Date.now()}.json`), JSON.stringify(results, null, 2));

  await context.storageState({ path: AUTH_FILE });
  await browser.close();
}

main().catch((e) => { log('FATAL: ' + e.stack); process.exit(1); });
