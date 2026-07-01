// src/render.js
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

export async function htmlToPdf(html, outPath) {
  mkdirSync(dirname(outPath), { recursive: true });
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle' });
    await page.pdf({ path: outPath, printBackground: true, preferCSSPageSize: true });
  } finally {
    await browser.close();
  }
}
