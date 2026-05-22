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

const log = (m) => console.log(`[i5] ${m}`);
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const shot = async (name) => {
  const file = path.join(SCREENSHOTS_DIR, `i5-${Date.now()}-${name}.png`);
  await page.screenshot({ path: file, fullPage: false });
  log(`shot: ${file}`);
};

// Track XHR
page.on('request', req => {
  const url = req.url();
  if (url.includes('/api/') || url.includes('/notes/')) {
    log(`REQ ${req.method()} ${url}`);
  }
});

await page.goto('https://note.com/notes', { waitUntil: 'domcontentloaded' });
await page.waitForLoadState('networkidle').catch(() => {});
await sleep(2500);

// 1. Click the public status filter to see options
log('--- click 公開ステータス filter ---');
const statusFilter = page.locator('button:has-text("公開ステータス")').first();
if (await statusFilter.count() > 0) {
  await statusFilter.click();
  await sleep(800);
  await shot('01-status-filter-open');
  const statusOptions = await page.evaluate(() => {
    const all = [...document.querySelectorAll('label, [role="option"], li, button')];
    return all.filter(el => el.offsetParent !== null).map(el => ({
      tag: el.tagName, text: (el.textContent||'').trim().slice(0, 30),
    })).filter(b => b.text && /公開|下書き|限定|予約|全/.test(b.text)).slice(0, 15);
  });
  log('status options:');
  for (const o of statusOptions) log(`  [${o.tag}] "${o.text}"`);
  // close menu
  await page.keyboard.press('Escape');
  await sleep(500);
}

// 2. Check a checkbox on first article + observe toolbar
log('--- check first article ---');
const firstCheckbox = page.locator('input[type="checkbox"]').first();
const cbCount = await page.locator('input[type="checkbox"]').count();
log(`checkboxes on page: ${cbCount}`);

if (cbCount > 0) {
  await firstCheckbox.check().catch(() => {});
  await sleep(1000);
  await shot('02-checkbox-checked');
  // dump all visible buttons
  const visibleBtns = await page.evaluate(() => {
    const all = [...document.querySelectorAll('button')];
    return all.filter(b => b.offsetParent !== null && (b.textContent||'').trim()).map(b => ({
      text: (b.textContent||'').trim().slice(0, 40),
      aria: b.getAttribute('aria-label') || '',
    }));
  });
  log(`visible buttons with text after check:`);
  for (const b of visibleBtns.slice(0, 30)) log(`  "${b.text}" aria="${b.aria}"`);

  // Look specifically for an action menu near the toolbar (top area)
  const toolbarBtns = await page.evaluate(() => {
    const all = [...document.querySelectorAll('button')];
    return all.filter(b => {
      const r = b.getBoundingClientRect();
      return r.top < 250 && r.top > 50 && b.offsetParent !== null;
    }).map(b => ({
      text: (b.textContent||'').trim().slice(0, 40),
      cls: (b.className||'').slice(0, 60),
    }));
  });
  log(`top-toolbar buttons (y 50-250):`);
  for (const b of toolbarBtns) log(`  "${b.text}" cls="${b.cls}"`);
}

await browser.close();
