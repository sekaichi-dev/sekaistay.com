// test/generate.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateAll } from '../src/generate.js';
import { existsSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const repo = join(root, '..', '..');

test('generateAll produces sticker + one indoor pdf', async () => {
  const outDir = join(root, 'out', 'e2e');
  rmSync(outDir, { recursive: true, force: true });
  const pdfs = await generateAll({
    propertiesPath: join(root, 'properties.sample.json'),
    contactsPath: join(root, 'config', 'contacts.json'),
    logoPath: join(repo, 'public', 'images', 'switch', 'logo-full.png'),
    outDir,
  });
  assert.ok(pdfs.some((p) => p.includes('sticker')));
  assert.ok(pdfs.some((p) => p.includes('shinagawa-101')));
  for (const p of pdfs) assert.ok(existsSync(p), `missing ${p}`);
  rmSync(outDir, { recursive: true, force: true });
});
