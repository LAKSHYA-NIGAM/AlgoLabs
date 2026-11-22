import assert from 'node:assert';
import test from 'node:test';
import { solveKnapsack } from './knapsack.js';

test('solveKnapsack: standard classic knapsack problem', () => {
  const items = [
    { id: 'item1', weight: 1, value: 1 },
    { id: 'item2', weight: 3, value: 4 },
    { id: 'item3', weight: 4, value: 5 },
    { id: 'item4', weight: 5, value: 7 },
  ];
  const res = solveKnapsack(7, items);
  assert.strictEqual(res.maxValue, 9); // item2 (3, 4) + item3 (4, 5) = weight 7, value 9
  assert.strictEqual(res.totalWeight, 7);
  assert.strictEqual(res.selectedItems.length, 2);
  assert.strictEqual(res.selectedItems[0].id, 'item2');
  assert.strictEqual(res.selectedItems[1].id, 'item3');
});

test('solveKnapsack: capacity zero or negative', () => {
  const items = [{ id: 'item1', weight: 2, value: 10 }];
  const res = solveKnapsack(0, items);
  assert.strictEqual(res.maxValue, 0);
  assert.deepStrictEqual(res.selectedItems, []);
});

test('solveKnapsack: no items or invalid array', () => {
  const res = solveKnapsack(10, []);
  assert.strictEqual(res.maxValue, 0);
  assert.deepStrictEqual(res.selectedItems, []);
});

test('solveKnapsack: item exceeding capacity', () => {
  const items = [{ id: 'heavy', weight: 15, value: 100 }];
  const res = solveKnapsack(10, items);
  assert.strictEqual(res.maxValue, 0);
  assert.strictEqual(res.selectedItems.length, 0);
});
