// test/indoor.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { indoorHtml } from '../src/templates/indoor.js';

const property = {
  id: 'x1', addressJa: '東京都品川区戸越3-4-18',
  addressRomaji: '3-4-18 Togoshi, Shinagawa-ku',
  wifiSsid: 'SEKAI-X1', wifiPassword: 'pw', checkoutTime: '11:00',
  houseManualUrl: 'https://m.example.com/x1',
};
const contacts = { associationPhone: '03-0000-0000', lineHours: '9:00-21:00', lineUrl: 'https://line.me/x' };
const qr = { line: 'data:image/png;base64,AAA', manual: 'data:image/png;base64,BBB', wifi: 'data:image/png;base64,CCC' };

test('indoor html contains emergency numbers and property data', () => {
  const html = indoorHtml({ property, contacts, logoSvg: '<svg></svg>', qr });
  assert.match(html, /110/);
  assert.match(html, /119/);
  assert.match(html, /03-0000-0000/);
  assert.match(html, /9:00-21:00/);
  assert.match(html, /東京都品川区戸越3-4-18/);
  assert.match(html, /SEKAI-X1/);
  assert.match(html, /11:00/);
  assert.match(html, /size:\s*A4/);
  assert.match(html, /data:image\/png;base64,CCC/);
});

test('indoor html does NOT mention kurasheed24 / seed24', () => {
  const html = indoorHtml({ property, contacts, logoSvg: '<svg></svg>', qr });
  assert.doesNotMatch(html, /seed24/i);
  assert.doesNotMatch(html, /くらし[ーし]ど/);
});

test('indoor html escapes ampersand in interpolated values', () => {
  const p = { ...property, addressJa: 'A&B ビル 3-4-18' };
  const html = indoorHtml({ property: p, contacts, logoSvg: '<svg></svg>', qr });
  assert.match(html, /A&amp;B ビル/);
  assert.doesNotMatch(html, /A&B ビル/);
});
