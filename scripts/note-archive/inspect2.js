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

const log = (m) => console.log(`[inspect2] ${m}`);
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const shot = async (name) => {
  const file = path.join(SCREENSHOTS_DIR, `inspect2-${Date.now()}-${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  log(`shot: ${file}`);
};
const dump = async (label) => {
  const items = await page.evaluate(() => {
    const all = [...document.querySelectorAll('button, a[href]')];
    return all.map(el => ({
      tag: el.tagName, text: (el.textContent||'').trim().slice(0, 60),
      aria: el.getAttribute('aria-label') || '', href: el.getAttribute('href') || '',
    })).filter(b => b.text || b.aria || (b.href && !b.href.startsWith('#')));
  });
  log(`=== ${label}: ${items.length} items ===`);
  for (const b of items.slice(0, 60)) {
    if (b.href && (b.href.includes('note') || b.href.startsWith('/'))) {
      log(`  [${b.tag}] "${b.text}" aria="${b.aria}" href="${b.href}"`);
    } else if (b.text && b.text.length < 30) {
      log(`  [${b.tag}] "${b.text}" aria="${b.aria}"`);
    }
  }
};

// 1. Public article page (logged in)
log('--- public article page ---');
await page.goto(`https://note.com/sekaistay/n/${TARGET_KEY}`, { waitUntil: 'domcontentloaded' });
await page.waitForLoadState('networkidle').catch(() => {});
await sleep(2500);
await shot('01-public-article');
await dump('public-article');

// 2. Profile page
log('--- profile page ---');
await page.goto('https://note.com/sekaistay', { waitUntil: 'domcontentloaded' });
await page.waitForLoadState('networkidle').catch(() => {});
await sleep(2500);
await shot('02-profile');
await dump('profile');

// 3. note.com home with logged-in user menu open
log('--- note.com home ---');
await page.goto('https://note.com/', { waitUntil: 'domcontentloaded' });
await page.waitForLoadState('networkidle').catch(() => {});
await sleep(2000);
// open user avatar menu
const avatar = page.locator('header img[alt*="sekai"], header [aria-label*="メニュー"], header button:has(img)').first();
if (await avatar.count() > 0) {
  await avatar.click().catch(() => {});
  await sleep(1000);
  await shot('03-home-user-menu');
  await dump('home-user-menu');
} else {
  log('avatar not found, dumping all header links');
  await shot('03-home-no-avatar');
  await dump('home-no-avatar');
}

// 4. Check the dashboard subpath - try common patterns
log('--- check more dashboard URLs ---');
const urls = [
  'https://note.com/notefes/dashboard',
  'https://note.com/dashboard',
  'https://note.com/settings/account',
  'https://note.com/settings',
];
for (const url of urls) {
  await page.goto(url, { waitUntil: 'domcontentloaded' }).catch(() => {});
  await sleep(1500);
  const final = page.url();
  log(`${url} → ${final}`);
}

await browser.close();
