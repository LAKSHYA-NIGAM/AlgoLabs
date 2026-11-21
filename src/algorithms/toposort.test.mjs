import assert from 'node:assert';
import test from 'node:test';
import { topologicalSort } from './toposort.js';

test('topologicalSort: valid DAG with multiple dependencies', () => {
  // 0 -> 1, 0 -> 2, 1 -> 3, 2 -> 3
  const res = topologicalSort(4, [[0, 1], [0, 2], [1, 3], [2, 3]]);
  assert.strictEqual(res.hasCycle, false);
  assert.strictEqual(res.order.length, 4);
  assert.strictEqual(res.order[0], 0);
  assert.strictEqual(res.order[3], 3);
});

test('topologicalSort: cyclic graph detection', () => {
  // 0 -> 1 -> 2 -> 0 (cycle)
  const res = topologicalSort(3, [[0, 1], [1, 2], [2, 0]]);
  assert.strictEqual(res.hasCycle, true);
  assert.deepStrictEqual(res.order, []);
});

test('topologicalSort: disconnected nodes', () => {
  const res = topologicalSort(3, []);
  assert.strictEqual(res.hasCycle, false);
  assert.strictEqual(res.order.length, 3);
});

test('topologicalSort: invalid input boundaries', () => {
  const res = topologicalSort(0, []);
  assert.strictEqual(res.hasCycle, false);
  assert.deepStrictEqual(res.order, []);
});
