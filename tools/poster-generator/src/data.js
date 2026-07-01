// src/data.js
import { readFileSync } from 'node:fs';

// name = 外壁ステッカーに表示する物件名。addressJa より後に置き、既存テストの
// 「最初に欠落する必須フィールド= addressJa」の順序を保つ。
const REQUIRED = ['id', 'addressJa', 'addressRomaji', 'wifiSsid', 'wifiPassword', 'checkoutTime', 'houseManualUrl', 'name'];

export function loadProperties(path) {
  const props = JSON.parse(readFileSync(path, 'utf8'));
  if (!Array.isArray(props)) throw new Error('properties file must be a JSON array');
  for (const p of props) {
    for (const field of REQUIRED) {
      if (p[field] == null || p[field] === '') {
        throw new Error(`property ${p.id ?? '(no id)'}: missing required field: ${field}`);
      }
    }
  }
  return props;
}

export function loadContacts(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}
