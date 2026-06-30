// test/data.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadProperties, loadContacts } from '../src/data.js';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

test('loadProperties returns parsed properties', () => {
  const props = loadProperties(join(root, 'properties.sample.json'));
  assert.equal(props.length, 1);
  assert.equal(props[0].id, 'shinagawa-101');
  assert.equal(props[0].checkoutTime, '11:00');
});

test('loadProperties throws on missing required field', () => {
  assert.throws(
    () => loadProperties(join(root, 'test', 'fixtures', 'bad.json')),
    /missing required field: addressJa/
  );
});

test('loadContacts returns contacts object', () => {
  const c = loadContacts(join(root, 'config', 'contacts.json'));
  assert.ok('associationPhone' in c);
  assert.ok('lineUrl' in c);
});
