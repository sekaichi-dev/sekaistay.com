// src/data.js
import { readFileSync } from 'node:fs';

const REQUIRED = ['id', 'addressJa', 'addressRomaji', 'wifiSsid', 'wifiPassword', 'checkoutTime', 'houseManualUrl'];

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
