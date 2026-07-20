#!/usr/bin/env node
import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AUTH_FILE = path.join(__dirname, 'auth.json');
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');

const KEY = process.argv[2] || 'nf1bf95dabb07';
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ storageState: AUTH_FILE, viewport: { width: 1400, height: 1000 } });
const page = await context.newPage();
const log = (m) => console.log(`[eye] ${m}`);
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const shot = async (name) => {
  const file = path.join(SCREENSHOTS_DIR, `eye-${Date.now()}-${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  log(`shot: ${file}`);
};

log(`opening editor for ${KEY}`);
await page.goto(`https://note.com/notes/${KEY}/edit`, { waitUntil: 'domcontentloaded' });
await page.waitForLoadState('networkidle').catch(() => {});
await sleep(2500);
await shot('01-editor');

// Look for the eyecatch / 見出し画像 area
// In note editor, the eyecatch is typically set via the "画像を追加" button at the very top
// OR through the publish settings dialog
log('--- looking for image-add buttons near top ---');
const imageButtons = await page.evaluate(() => {
  const all = [...document.querySelectorAll('button')];
  return all.filter(b => {
    const aria = b.getAttribute('aria-label') || '';
    const text = (b.textContent || '').trim();
    return /画像|eyecatch|見出し|サムネ|cover/i.test(aria + text);
  }).map(b => ({
    text: (b.textContent || '').trim().slice(0, 30),
    aria: b.getAttribute('aria-label') || '',
    rect: b.getBoundingClientRect(),
  }));
});
log(`image-related buttons:`);
for (const b of imageButtons) log(`  "${b.text}" aria="${b.aria}" rect=${JSON.stringify(b.rect)}`);

// File inputs (hidden file inputs for upload)
const fileInputs = await page.evaluate(() => {
  const all = [...document.querySelectorAll('input[type="file"]')];
  return all.map(el => ({
    accept: el.getAttribute('accept') || '',
    name: el.getAttribute('name') || '',
    id: el.getAttribute('id') || '',
    visible: el.offsetParent !== null,
  }));
});
log(`file inputs found: ${fileInputs.length}`);
for (const f of fileInputs) log(`  accept="${f.accept}" name="${f.name}" id="${f.id}" visible=${f.visible}`);

// Try clicking the 公開に進む to see if eyecatch is in the publish dialog
log('--- clicking 公開に進む ---');
const publishBtn = page.locator('button:has-text("公開に進む")').first();
if (await publishBtn.count() > 0) {
  await publishBtn.click().catch(() => {});
  await sleep(1500);
  await shot('02-publish-dialog');

  // Re-check buttons and file inputs in dialog
  const dialogStuff = await page.evaluate(() => {
    const all = [...document.querySelectorAll('button, input[type="file"]')];
    return all.filter(el => el.offsetParent !== null).map(el => {
      if (el.tagName === 'INPUT') {
        return { tag: 'FILE', accept: el.getAttribute('accept') || '', name: el.getAttribute('name') || '' };
      }
      return {
        tag: 'BTN',
        text: (el.textContent || '').trim().slice(0, 30),
        aria: el.getAttribute('aria-label') || '',
      };
    });
  });
  log(`elements after publish dialog open:`);
  for (const e of dialogStuff.slice(-30)) log(`  ${JSON.stringify(e)}`);
}

await browser.close();
