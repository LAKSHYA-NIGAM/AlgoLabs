import assert from 'node:assert';
import test from 'node:test';
import { computeLCS } from './lcs.js';

test('computeLCS: standard strings', () => {
  const res = computeLCS('ABCDE', 'ACE');
  assert.strictEqual(res.length, 3);
  assert.strictEqual(res.subsequence, 'ACE');
  assert.strictEqual(res.dpTable.length, 6);
  assert.strictEqual(res.dpTable[0].length, 4);
});

test('computeLCS: completely disjoint strings', () => {
  const res = computeLCS('XYZ', 'ABC');
  assert.strictEqual(res.length, 0);
  assert.strictEqual(res.subsequence, '');
});

test('computeLCS: identical strings', () => {
  const res = computeLCS('DYNAMIC', 'DYNAMIC');
  assert.strictEqual(res.length, 7);
  assert.strictEqual(res.subsequence, 'DYNAMIC');
});

test('computeLCS: empty string inputs', () => {
  const res = computeLCS('', 'ABC');
  assert.strictEqual(res.length, 0);
  assert.strictEqual(res.subsequence, '');

  const res2 = computeLCS(null, undefined);
  assert.strictEqual(res2.length, 0);
  assert.strictEqual(res2.subsequence, '');
});
