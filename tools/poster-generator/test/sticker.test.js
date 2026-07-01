import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stickerHtml } from '../src/templates/sticker.js';

test('sticker html shows property name, logo and A5 page size', () => {
  const html = stickerHtml({
    logoSvg: '<img alt="SEKAI STAY">',
    property: { name: 'SEKAI STAY 神南' },
  });
  assert.match(html, /<img alt="SEKAI STAY">/);
  assert.match(html, /SEKAI STAY 神南/);
  assert.doesNotMatch(html, /管理物件/);
  assert.match(html, /size:\s*A5/);
});

test('sticker html escapes ampersand in property name', () => {
  const html = stickerHtml({ logoSvg: '<img>', property: { name: 'A&B ハウス' } });
  assert.match(html, /A&amp;B ハウス/);
  assert.doesNotMatch(html, /A&B ハウス/);
});
