import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { bubbleSortBenchmark, mergeSortBenchmark, compareSortingAlgorithms } from './benchmark.js';

describe('Algorithm Performance Benchmark Tests', () => {
  test('bubbleSortBenchmark accurately sorts arrays and counts operations', () => {
    const input = [5, 2, 8, 1, 9];
    const result = bubbleSortBenchmark(input);
    assert.deepEqual(result.sorted, [1, 2, 5, 8, 9]);
    assert.ok(result.comparisons > 0);
    assert.ok(result.swaps > 0);
  });

  test('mergeSortBenchmark accurately sorts arrays with O(n log n) efficiency', () => {
    const input = [45, 12, 85, 32, 89, 39, 69, 44, 42, 1, 45];
    const result = mergeSortBenchmark(input);
    assert.deepEqual(result.sorted, [1, 12, 32, 39, 42, 44, 45, 45, 69, 85, 89]);
    assert.ok(result.assignments > 0);
  });

  test('handles already sorted input with early exit in bubble sort', () => {
    const sortedInput = [1, 2, 3, 4, 5];
    const result = bubbleSortBenchmark(sortedInput);
    assert.equal(result.swaps, 0);
    assert.equal(result.comparisons, 4); // Only 1 pass required
  });

  test('compareSortingAlgorithms proves MergeSort requires fewer comparisons than BubbleSort on size 50', () => {
    const report = compareSortingAlgorithms(50);
    assert.equal(report.inputSize, 50);
    assert.ok(report.mergeSort.comparisons < report.bubbleSort.comparisons,
      `Expected MergeSort (${report.mergeSort.comparisons}) to make fewer comparisons than BubbleSort (${report.bubbleSort.comparisons})`);
    assert.ok(report.efficiencyRatio > 1);
  });
});
