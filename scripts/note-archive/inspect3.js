#!/usr/bin/env node
import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AUTH_FILE = path.join(__dirname, 'auth.json');
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ storageState: AUTH_FILE });
const page = await context.newPage();

const log = (m) => console.log(`[i3] ${m}`);
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const shot = async (name) => {
  const file = path.join(SCREENSHOTS_DIR, `i3-${Date.now()}-${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  log(`shot: ${file}`);
};

// 1. Open the notes management page
log('opening /notes management page');
await page.goto('https://note.com/notes', { waitUntil: 'domcontentloaded' });
await page.waitForLoadState('networkidle').catch(() => {});
await sleep(2500);

// Dump left nav
const nav = await page.evaluate(() => {
  const all = [...document.querySelectorAll('a, button')];
  return all.map(el => ({
    tag: el.tagName,
    text: (el.textContent || '').trim().slice(0, 40),
    aria: el.getAttribute('aria-label') || '',
    href: el.getAttribute('href') || '',
  })).filter(b => b.text && b.text.length < 30);
});
log(`=== /notes page links/buttons: ${nav.length} ===`);
for (const b of nav.slice(0, 80)) {
  log(`  [${b.tag}] "${b.text}" aria="${b.aria}" href="${b.href}"`);
}

// 2. Find a "..." menu on the first article
log('--- looking for kebab menus per article ---');
const kebabs = await page.locator('button[aria-label*="メニュー"], button[aria-label*="その他"], button:has(svg):not(:has(span))').count();
log(`possible kebab buttons: ${kebabs}`);

// Try clicking the first article's menu (commonly aria-label="メニュー" near each article card)
const firstKebab = page.locator('button[aria-label*="メニュー"]').first();
if (await firstKebab.count() > 0) {
  await firstKebab.click().catch(() => {});
  await sleep(800);
  await shot('01-kebab-open');
  const menuItems = await page.evaluate(() => {
    const all = [...document.querySelectorAll('[role="menuitem"], li button, li a, .menu button')];
    return all.map(el => ({ tag: el.tagName, text: (el.textContent||'').trim().slice(0,40), href: el.getAttribute('href')||'' }));
  });
  log(`=== menu items after kebab click: ===`);
  for (const m of menuItems.slice(0, 30)) {
    log(`  [${m.tag}] "${m.text}" href="${m.href}"`);
  }
} else {
  log('no kebab found, trying alternative selectors');
  await shot('01-no-kebab');
}

// 3. Check the "select mode" toggle button
log('--- looking for select mode ---');
const selectModeBtn = page.locator('button:has-text("選択モード"), button:has-text("選択")').first();
if (await selectModeBtn.count() > 0) {
  log(`select mode button: visible=${await selectModeBtn.isVisible()}`);
  await selectModeBtn.click().catch(() => {});
  await sleep(1000);
  await shot('02-select-mode');
  // Look for "下書きに戻す" or bulk action buttons
  const bulkActions = await page.evaluate(() => {
    const all = [...document.querySelectorAll('button')];
    return all.map(el => ({
      text: (el.textContent||'').trim().slice(0,40),
      visible: el.offsetParent !== null,
    })).filter(b => b.text && b.visible);
  });
  log(`=== buttons in select mode (visible only): ===`);
  for (const b of bulkActions.slice(0, 40)) {
    log(`  "${b.text}"`);
  }
}

await browser.close();
