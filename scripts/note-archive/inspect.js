#!/usr/bin/env node
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AUTH_FILE = path.join(__dirname, 'auth.json');
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');

const TARGET_KEY = process.argv[2] || 'n2195fe6ca737';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ storageState: AUTH_FILE });
const page = await context.newPage();

const log = (m) => console.log(`[inspect] ${m}`);

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const shot = async (name) => {
  const file = path.join(SCREENSHOTS_DIR, `inspect-${Date.now()}-${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  log(`shot: ${file}`);
  return file;
};

const dumpButtons = async (label) => {
  const buttons = await page.evaluate(() => {
    const all = [...document.querySelectorAll('button, a[role="button"], [role="menuitem"]')];
    return all.map(el => ({
      tag: el.tagName,
      text: (el.textContent || '').trim().slice(0, 50),
      aria: el.getAttribute('aria-label'),
      href: el.getAttribute('href'),
      role: el.getAttribute('role'),
    })).filter(b => b.text || b.aria);
  });
  log(`=== ${label}: ${buttons.length} buttons/links ===`);
  for (const b of buttons.slice(0, 50)) {
    log(`  [${b.tag}] text="${b.text}" aria="${b.aria||''}" role="${b.role||''}" href="${b.href||''}"`);
  }
};

// 1. Open editor for target article
log(`opening editor for ${TARGET_KEY}`);
await page.goto(`https://note.com/notes/${TARGET_KEY}/edit`, { waitUntil: 'domcontentloaded' });
await page.waitForLoadState('networkidle').catch(() => {});
await sleep(2000);
await shot('01-editor-full');
await dumpButtons('editor-toplevel');

// 2. Click the "..." menu top right
const menuBtn = page.locator('button[aria-label="その他"]').first();
if (await menuBtn.count() > 0) {
  await menuBtn.click();
  await sleep(800);
  await shot('02-menu-open');
  await dumpButtons('menu-open');
}

// 3. Try the dashboard / my-notes management page
log('checking dashboard pages...');
const dashboardPaths = [
  'https://note.com/my/notes',
  'https://note.com/sekaistay/manage',
  'https://editor.note.com/notes',
  'https://note.com/notes',
];
for (const url of dashboardPaths) {
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });
    await page.waitForLoadState('networkidle').catch(() => {});
    await sleep(1500);
    const finalUrl = page.url();
    log(`tried ${url} → final ${finalUrl}`);
    await shot(`dashboard-${url.replace(/[^a-z0-9]/gi,'_').slice(-40)}`);
  } catch (e) {
    log(`failed ${url}: ${e.message}`);
  }
}

await browser.close();
