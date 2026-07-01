import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PICTOGRAMS } from '../src/pictograms.js';
import { baseCss } from '../src/styles.js';

const RULE_KEYS = ['noise', 'trash', 'nosmoking', 'capacity', 'checkout', 'commonarea', 'equipment'];

test('all rule pictograms exist and are svg', () => {
  for (const k of RULE_KEYS) {
    assert.ok(PICTOGRAMS[k], `missing pictogram: ${k}`);
    assert.match(PICTOGRAMS[k], /<svg[\s\S]*<\/svg>/);
  }
});

test('baseCss exposes brand color tokens', () => {
  const css = baseCss();
  assert.match(css, /#167B81/i);
  assert.match(css, /Noto Sans JP/);
});
