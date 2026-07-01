import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stickerHtml } from '../src/templates/sticker.js';

test('sticker html includes logo, 管理物件 label and A5 page size', () => {
  // ブランド名は画像ロゴ(SEKAI STAY ワードマーク)に含まれるため、
  // ここでは差し込んだロゴ markup と 管理物件 表示・A5 サイズを検証する。
  const html = stickerHtml({ logoSvg: '<img alt="SEKAI STAY">' });
  assert.match(html, /<img alt="SEKAI STAY">/);
  assert.match(html, /管理物件/);
  assert.match(html, /size:\s*A5/);
});
