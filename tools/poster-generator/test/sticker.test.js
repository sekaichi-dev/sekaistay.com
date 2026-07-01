import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stickerHtml } from '../src/templates/sticker.js';

test('sticker html includes brand name and A5 page size', () => {
  const html = stickerHtml({ logoSvg: '<svg></svg>' });
  assert.match(html, /SEKAI STAY/);
  assert.match(html, /管理物件/);
  assert.match(html, /size:\s*A5/);
  assert.match(html, /<svg><\/svg>/);
});
