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

const log = (m) => console.log(`[i4] ${m}`);
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const shot = async (name) => {
  const file = path.join(SCREENSHOTS_DIR, `i4-${Date.now()}-${name}.png`);
  await page.screenshot({ path: file, fullPage: false });
  log(`shot: ${file}`);
};

await page.goto('https://note.com/notes', { waitUntil: 'domcontentloaded' });
await page.waitForLoadState('networkidle').catch(() => {});
await sleep(3000);
await shot('01-list-view');

// Find article list items
log('--- listing article rows ---');
const articleStructure = await page.evaluate(() => {
  // Try common patterns: data-content-id, role=listitem, articles list item
  const candidates = [
    ...document.querySelectorAll('[data-content-id]'),
    ...document.querySelectorAll('li'),
    ...document.querySelectorAll('[data-content-key]'),
    ...document.querySelectorAll('.note-card'),
    ...document.querySelectorAll('[class*="note"]'),
  ];
  const result = [];
  for (const el of candidates.slice(0, 5)) {
    const buttons = [...el.querySelectorAll('button')].map(b => ({
      text: (b.textContent||'').trim().slice(0, 20),
      aria: b.getAttribute('aria-label') || '',
      hasIcon: !!b.querySelector('svg, img'),
      cls: (b.className || '').slice(0, 60),
    }));
    result.push({
      tag: el.tagName,
      id: el.id,
      cls: (el.className || '').slice(0, 60),
      dataKey: el.getAttribute('data-content-key') || el.getAttribute('data-content-id') || '',
      btnCount: buttons.length,
      buttons: buttons.slice(0, 8),
    });
  }
  return result;
});
log(JSON.stringify(articleStructure, null, 2));

// Try clicking icon-only buttons in the article list area
log('--- attempting to find and click an icon-only menu button ---');
const iconButtons = await page.evaluate(() => {
  const all = [...document.querySelectorAll('button')];
  return all.map((b, idx) => ({
    idx,
    text: (b.textContent||'').trim(),
    aria: b.getAttribute('aria-label') || '',
    hasSvg: !!b.querySelector('svg'),
    visible: b.offsetParent !== null,
    rect: b.getBoundingClientRect(),
  })).filter(b => b.visible && b.hasSvg && !b.text && !b.aria).slice(0, 30);
});
log(`icon-only buttons: ${iconButtons.length}`);
for (const b of iconButtons.slice(0, 15)) {
  log(`  idx=${b.idx} rect=${JSON.stringify(b.rect)}`);
}

// Click the 5th icon-only button (skip the global header icons which are typically first 4)
if (iconButtons.length >= 5) {
  const targetIdx = iconButtons[4].idx;
  log(`clicking icon button #${targetIdx}`);
  await page.evaluate((i) => {
    const all = [...document.querySelectorAll('button')];
    all[i].scrollIntoView({ block: 'center' });
    all[i].click();
  }, targetIdx);
  await sleep(1000);
  await shot('02-after-icon-click');

  const visibleTexts = await page.evaluate(() => {
    const all = [...document.querySelectorAll('button, [role="menuitem"], a')];
    return all.filter(el => el.offsetParent !== null && (el.textContent||'').trim().length > 0).map(el => ({
      tag: el.tagName,
      text: (el.textContent||'').trim().slice(0, 50),
    })).filter(b => /下書き|公開|削除|非公開|編集|複製|統計|分析/.test(b.text));
  });
  log(`relevant visible items after click:`);
  for (const t of visibleTexts.slice(0, 20)) log(`  [${t.tag}] "${t.text}"`);
}

await browser.close();
