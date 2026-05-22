#!/usr/bin/env node
import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AUTH_FILE = path.join(__dirname, 'auth.json');
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ storageState: AUTH_FILE, viewport: { width: 1400, height: 900 } });
const page = await context.newPage();

const log = (m) => console.log(`[i6] ${m}`);
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const shot = async (name) => {
  const file = path.join(SCREENSHOTS_DIR, `i6-${Date.now()}-${name}.png`);
  await page.screenshot({ path: file, fullPage: false });
  log(`shot: ${file}`);
};

// monitor network
page.on('request', req => {
  const url = req.url();
  if (url.includes('/api/') && !url.includes('/trackings/')) {
    log(`REQ ${req.method()} ${url}`);
  }
});
page.on('response', async (res) => {
  const url = res.url();
  if (url.match(/api.*notes.*\/(status|publish|draft)/i) && res.request().method() !== 'GET') {
    log(`RES ${res.status()} ${res.request().method()} ${url}`);
  }
});

await page.goto('https://note.com/notes?status=published', { waitUntil: 'domcontentloaded' });
await page.waitForLoadState('networkidle').catch(() => {});
await sleep(2500);
await shot('00-init');

// 1. Click the first article's "..." menu
log('--- clicking first o-articleList__more ---');
const moreBtns = page.locator('.o-articleList__more');
const count = await moreBtns.count();
log(`o-articleList__more count: ${count}`);

if (count === 0) {
  log('no o-articleList__more found, trying alternatives');
  // Search for elements with the more icon
  const found = await page.evaluate(() => {
    const all = [...document.querySelectorAll('[class*="more"]')];
    return all.slice(0, 20).map(el => ({ tag: el.tagName, cls: el.className }));
  });
  log(JSON.stringify(found, null, 2));
  await browser.close();
  process.exit(0);
}

// click the first one
await moreBtns.first().scrollIntoViewIfNeeded();
await moreBtns.first().click({ force: true }).catch(() => {});
await sleep(1000);
await shot('01-menu-open');

const menuItems = await page.evaluate(() => {
  const all = [...document.querySelectorAll('button, [role="menuitem"], a')];
  return all.filter(el => el.offsetParent !== null).map(el => ({
    tag: el.tagName,
    text: (el.textContent||'').trim(),
    href: el.getAttribute('href') || '',
    cls: (el.className||'').slice(0, 80),
  })).filter(b => b.text && b.text.length < 30 && /下書き|公開|削除|非公開|編集|複製|統計|分析|限定|予約/.test(b.text));
});
log(`menu items related to article actions:`);
for (const m of menuItems) log(`  [${m.tag}] "${m.text}" cls="${m.cls}" href="${m.href}"`);

// All visible items in popup region
const popupItems = await page.evaluate(() => {
  const all = [...document.querySelectorAll('button, [role="menuitem"], a, li')];
  return all.filter(el => el.offsetParent !== null && (el.textContent||'').trim().length > 0 && (el.textContent||'').trim().length < 30).map(el => ({
    tag: el.tagName,
    text: (el.textContent||'').trim(),
    cls: (el.className||'').slice(0, 60),
  }));
});
log(`all visible short items (last 30):`);
for (const m of popupItems.slice(-30)) log(`  [${m.tag}] "${m.text}" cls="${m.cls}"`);

await browser.close();
