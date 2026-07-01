// test/render.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { htmlToPdf } from '../src/render.js';
import { readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';

test('htmlToPdf writes a real pdf file', async () => {
  const out = join('out', 'test-render.pdf');
  await htmlToPdf('<!doctype html><html><body><h1>hi</h1></body></html>', out);
  const head = readFileSync(out).subarray(0, 5).toString('latin1');
  assert.equal(head, '%PDF-');
  rmSync(out, { force: true });
});
