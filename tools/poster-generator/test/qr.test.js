import { test } from 'node:test';
import assert from 'node:assert/strict';
import { qrDataUrl, wifiPayload } from '../src/qr.js';

test('wifiPayload builds WIFI string', () => {
  assert.equal(wifiPayload('SEKAI-X', 'pw123'), 'WIFI:T:WPA;S:SEKAI-X;P:pw123;;');
});

test('qrDataUrl returns a png data url', async () => {
  const url = await qrDataUrl('https://example.com');
  assert.match(url, /^data:image\/png;base64,/);
});
