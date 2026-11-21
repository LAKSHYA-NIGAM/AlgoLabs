import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { BinarySearchTree } from './bst.js';

describe('Binary Search Tree (BST) Algorithm Tests', () => {
  test('inserts elements and maintains BST ordering property', () => {
    const bst = new BinarySearchTree();
    bst.insert(50);
    bst.insert(30);
    bst.insert(70);
    bst.insert(20);
    bst.insert(40);
    bst.insert(60);
    bst.insert(80);

    const inOrder = bst.inOrderTraversal();
    assert.deepEqual(inOrder, [20, 30, 40, 50, 60, 70, 80]);
  });

  test('generates step-by-step trace events during insertion', () => {
    const bst = new BinarySearchTree();
    const { steps } = bst.insert(10);
    assert.equal(steps[0].type, 'INSERT_ROOT');

    const nextResult = bst.insert(5);
    assert.ok(nextResult.steps.some(s => s.type === 'COMPARE'));
    assert.ok(nextResult.steps.some(s => s.type === 'INSERT_LEFT'));
  });

  test('searches for existing and non-existing values', () => {
    const bst = new BinarySearchTree();
    [15, 10, 20, 8, 12].forEach(n => bst.insert(n));

    const found = bst.search(12);
    assert.equal(found.found, true);
    assert.equal(found.node.value, 12);

    const notFound = bst.search(99);
    assert.equal(notFound.found, false);
    assert.equal(notFound.node, null);
  });

  test('computes correct tree height', () => {
    const bst = new BinarySearchTree();
    assert.equal(bst.getHeight(), 0);

    bst.insert(10);
    assert.equal(bst.getHeight(), 1);

    bst.insert(5);
    bst.insert(15);
    assert.equal(bst.getHeight(), 2);

    bst.insert(2);
    assert.equal(bst.getHeight(), 3);
  });

  test('preOrderTraversal yields root-left-right ordering', () => {
    const bst = new BinarySearchTree();
    [50, 30, 70].forEach(n => bst.insert(n));
    assert.deepEqual(bst.preOrderTraversal(), [50, 30, 70]);
  });

  test('throws error on null or invalid input', () => {
    const bst = new BinarySearchTree();
    assert.throws(() => bst.insert(null), /Cannot insert null/);
    assert.throws(() => bst.insert(NaN), /Cannot insert null/);
  });
});
