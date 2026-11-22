/**
 * Tests for DSU (Disjoint Set Union / Union-Find) data structure
 * Covers: construction, find, union, connected, path compression, getComponentCount, clone, getComponents
 */
import { DSU } from './dsu.js';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

describe('DSU - Constructor', () => {
  it('creates a DSU of given size with each element as its own parent', () => {
    const dsu = new DSU(5);
    assert.equal(dsu.size, 5);
    for (let i = 0; i < 5; i++) {
      assert.equal(dsu.parent[i], i);
      assert.equal(dsu.rank[i], 0);
    }
  });

  it('handles size 0 gracefully', () => {
    const dsu = new DSU(0);
    assert.equal(dsu.size, 0);
    assert.deepEqual(dsu.parent, []);
    assert.deepEqual(dsu.rank, []);
  });

  it('defaults to size 0 when no arg given', () => {
    const dsu = new DSU();
    assert.equal(dsu.size, 0);
  });

  it('handles non-integer input safely', () => {
    const dsu = new DSU('abc');
    assert.equal(dsu.size, 0);
  });
});

describe('DSU - find()', () => {
  it('returns the element itself when it is the root', () => {
    const dsu = new DSU(3);
    assert.equal(dsu.find(0), 0);
    assert.equal(dsu.find(2), 2);
  });

  it('returns -1 for out-of-bounds indices', () => {
    const dsu = new DSU(3);
    assert.equal(dsu.find(-1), -1);
    assert.equal(dsu.find(3), -1);
    assert.equal(dsu.find(100), -1);
  });

  it('records path history when provided', () => {
    const dsu = new DSU(5);
    dsu.union(0, 1);
    dsu.union(1, 2);
    const history = [];
    dsu.find(2, history);
    assert.ok(history.length > 0);
    assert.ok(history.includes(2));
  });
});

describe('DSU - union()', () => {
  it('merges two components and returns success=true', () => {
    const dsu = new DSU(4);
    const result = dsu.union(0, 1);
    assert.equal(result.success, true);
  });

  it('returns success=false when elements already in same set', () => {
    const dsu = new DSU(4);
    dsu.union(0, 1);
    const result = dsu.union(0, 1);
    assert.equal(result.success, false);
  });

  it('returns success=false for out-of-bounds inputs', () => {
    const dsu = new DSU(4);
    const result = dsu.union(-1, 2);
    assert.equal(result.success, false);
    assert.equal(result.rootX, -1);
  });

  it('union by rank: higher rank tree becomes root', () => {
    const dsu = new DSU(6);
    dsu.union(0, 1); // rank[0] becomes 1
    dsu.union(2, 3); // rank[2] becomes 1
    dsu.union(0, 2); // rank[0] > rank[2]? tie -> one becomes root
    // Both roots should now share the same representative
    assert.equal(dsu.connected(0, 3), true);
  });
});

describe('DSU - connected()', () => {
  it('returns false for unconnected elements', () => {
    const dsu = new DSU(5);
    assert.equal(dsu.connected(0, 4), false);
  });

  it('returns true after union', () => {
    const dsu = new DSU(5);
    dsu.union(1, 3);
    assert.equal(dsu.connected(1, 3), true);
  });

  it('returns false for out-of-bounds', () => {
    const dsu = new DSU(3);
    assert.equal(dsu.connected(-1, 0), false);
    assert.equal(dsu.connected(0, 10), false);
  });

  it('transitivity: a-b and b-c means a-c', () => {
    const dsu = new DSU(5);
    dsu.union(0, 1);
    dsu.union(1, 2);
    assert.equal(dsu.connected(0, 2), true);
  });
});

describe('DSU - getComponentCount()', () => {
  it('starts with n components', () => {
    const dsu = new DSU(5);
    assert.equal(dsu.getComponentCount(), 5);
  });

  it('decreases by 1 for each successful union', () => {
    const dsu = new DSU(5);
    dsu.union(0, 1);
    assert.equal(dsu.getComponentCount(), 4);
    dsu.union(1, 2);
    assert.equal(dsu.getComponentCount(), 3);
  });

  it('stays the same for redundant union', () => {
    const dsu = new DSU(3);
    dsu.union(0, 1);
    const before = dsu.getComponentCount();
    dsu.union(0, 1);
    assert.equal(dsu.getComponentCount(), before);
  });

  it('returns 0 for empty DSU', () => {
    const dsu = new DSU(0);
    assert.equal(dsu.getComponentCount(), 0);
  });
});

describe('DSU - clone()', () => {
  it('creates an independent deep copy', () => {
    const dsu = new DSU(4);
    dsu.union(0, 1);
    const clone = dsu.clone();
    clone.union(2, 3);
    // original should not be affected
    assert.equal(dsu.connected(2, 3), false);
    assert.equal(clone.connected(2, 3), true);
  });

  it('clone has same size', () => {
    const dsu = new DSU(7);
    const clone = dsu.clone();
    assert.equal(clone.size, 7);
  });
});

describe('DSU - getComponents()', () => {
  it('returns n singleton components initially', () => {
    const dsu = new DSU(3);
    const components = dsu.getComponents();
    assert.equal(Object.keys(components).length, 3);
  });

  it('groups merged elements under their root', () => {
    const dsu = new DSU(4);
    dsu.union(0, 1);
    dsu.union(2, 3);
    const components = dsu.getComponents();
    // Should have 2 groups of 2
    assert.equal(Object.keys(components).length, 2);
    const sizes = Object.values(components).map(g => g.length).sort();
    assert.deepEqual(sizes, [2, 2]);
  });
});
