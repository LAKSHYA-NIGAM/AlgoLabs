import assert from 'node:assert';
import test from 'node:test';
import { Trie } from './trie.js';

test('Trie: insert and exact search', () => {
  const trie = new Trie();
  trie.insert('apple');
  trie.insert('app');

  assert.strictEqual(trie.search('apple'), true);
  assert.strictEqual(trie.search('app'), true);
  assert.strictEqual(trie.search('appl'), false);
  assert.strictEqual(trie.search('banana'), false);
  assert.strictEqual(trie.wordCount, 2);
});

test('Trie: startsWith prefix querying', () => {
  const trie = new Trie();
  trie.insert('algorithm');
  trie.insert('algebra');

  assert.strictEqual(trie.startsWith('alg'), true);
  assert.strictEqual(trie.startsWith('algo'), true);
  assert.strictEqual(trie.startsWith('alt'), false);
});

test('Trie: autocomplete ranked by frequency', () => {
  const trie = new Trie();
  trie.insert('binary', 10);
  trie.insert('binomial', 50);
  trie.insert('bind', 5);

  const completions = trie.autocomplete('bin');
  assert.strictEqual(completions.length, 3);
  assert.strictEqual(completions[0].word, 'binomial'); // Highest frequency
  assert.strictEqual(completions[1].word, 'binary');
  assert.strictEqual(completions[2].word, 'bind');
});

test('Trie: handles empty, null and boundary edge cases', () => {
  const trie = new Trie();
  assert.strictEqual(trie.insert(''), false);
  assert.strictEqual(trie.insert(null), false);
  assert.strictEqual(trie.search(null), false);
  assert.deepStrictEqual(trie.autocomplete('none'), []);
});
