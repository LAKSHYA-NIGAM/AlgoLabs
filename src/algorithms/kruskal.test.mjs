/**
 * Tests for Kruskal's MST algorithm and step-by-step snapshot generator
 */
import { generateKruskalSnapshots } from './kruskal.js';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

// Helpers
function makeVertices(labels) {
  return labels.map(l => ({ id: l, label: l }));
}

function makeEdge(id, u, v, weight) {
  return { id, u, v, weight };
}

describe('generateKruskalSnapshots - empty / degenerate input', () => {
  it('returns empty result for empty vertices', () => {
    const result = generateKruskalSnapshots([], []);
    assert.equal(result.snapshots.length, 0);
    assert.equal(result.totalCost, 0);
    assert.equal(result.isSpanningTree, false);
    assert.equal(result.mstEdges.length, 0);
  });

  it('handles null/undefined inputs gracefully', () => {
    const result = generateKruskalSnapshots(null, undefined);
    assert.equal(result.snapshots.length, 0);
    assert.equal(result.totalCost, 0);
  });

  it('single vertex with no edges produces INIT + FINAL snapshots', () => {
    const result = generateKruskalSnapshots(makeVertices(['A']), []);
    assert.ok(result.snapshots.length >= 1);
    assert.equal(result.totalCost, 0);
    assert.equal(result.mstEdges.length, 0);
  });
});

describe('generateKruskalSnapshots - basic triangle graph', () => {
  // Triangle: A-B(1), B-C(2), A-C(3)
  // MST: A-B + B-C = cost 3
  const vertices = makeVertices(['A', 'B', 'C']);
  const edges = [
    makeEdge('e1', 'A', 'B', 1),
    makeEdge('e2', 'B', 'C', 2),
    makeEdge('e3', 'A', 'C', 3),
  ];

  it('finds the correct MST with 2 edges (n-1)', () => {
    const result = generateKruskalSnapshots(vertices, edges);
    assert.equal(result.isSpanningTree, true);
    assert.equal(result.mstEdges.length, 2);
    assert.equal(result.totalCost, 3);
  });

  it('sorts edges by weight (cheapest first)', () => {
    const result = generateKruskalSnapshots(vertices, edges);
    assert.equal(result.sortedEdges[0].weight, 1);
    assert.equal(result.sortedEdges[1].weight, 2);
  });

  it('produces INIT snapshot as first snapshot', () => {
    const result = generateKruskalSnapshots(vertices, edges);
    assert.equal(result.snapshots[0].type, 'INIT');
  });

  it('produces FINAL snapshot as last snapshot', () => {
    const result = generateKruskalSnapshots(vertices, edges);
    const last = result.snapshots[result.snapshots.length - 1];
    assert.equal(last.type, 'FINAL');
    assert.equal(last.decision, 'SUCCESS');
  });

  it('snapshot sequence includes CONSIDER, ACCEPT, REJECT types', () => {
    const result = generateKruskalSnapshots(vertices, edges);
    const types = result.snapshots.map(s => s.type);
    assert.ok(types.includes('CONSIDER'));
    assert.ok(types.includes('ACCEPT'));
    assert.ok(types.includes('REJECT'));
  });

  it('REJECT snapshot appears for the cycle-forming edge', () => {
    const result = generateKruskalSnapshots(vertices, edges);
    const rejectSnap = result.snapshots.find(s => s.type === 'REJECT');
    assert.ok(rejectSnap);
    assert.equal(rejectSnap.decision, 'REJECTED');
    assert.ok(rejectSnap.representatives.isCycle);
  });
});

describe('generateKruskalSnapshots - disconnected graph', () => {
  // A-B connected, C isolated → minimum spanning FOREST, not tree
  const vertices = makeVertices(['A', 'B', 'C']);
  const edges = [makeEdge('e1', 'A', 'B', 5)];

  it('detects disconnected graph as forest, not spanning tree', () => {
    const result = generateKruskalSnapshots(vertices, edges);
    assert.equal(result.isSpanningTree, false);
    assert.equal(result.isForest, true);
    assert.equal(result.componentCount, 2);
  });

  it('FINAL snapshot has FOREST decision', () => {
    const result = generateKruskalSnapshots(vertices, edges);
    const last = result.snapshots[result.snapshots.length - 1];
    assert.equal(last.type, 'FINAL');
    assert.equal(last.decision, 'FOREST');
  });
});

describe('generateKruskalSnapshots - 4-node complete graph', () => {
  const vertices = makeVertices(['A', 'B', 'C', 'D']);
  const edges = [
    makeEdge('e1', 'A', 'B', 1),
    makeEdge('e2', 'B', 'C', 4),
    makeEdge('e3', 'C', 'D', 2),
    makeEdge('e4', 'A', 'D', 3),
    makeEdge('e5', 'A', 'C', 5),
    makeEdge('e6', 'B', 'D', 6),
  ];

  it('MST has exactly n-1 = 3 edges', () => {
    const result = generateKruskalSnapshots(vertices, edges);
    assert.equal(result.mstEdges.length, 3);
    assert.equal(result.isSpanningTree, true);
  });

  it('total cost is minimal (1+2+3=6)', () => {
    const result = generateKruskalSnapshots(vertices, edges);
    assert.equal(result.totalCost, 6);
  });

  it('EARLY_STOP snapshot is generated when MST is complete before all edges processed', () => {
    const result = generateKruskalSnapshots(vertices, edges);
    const hasEarlyStop = result.snapshots.some(s => s.type === 'EARLY_STOP');
    assert.equal(hasEarlyStop, true);
  });

  it('snapshot stepIndex values are sequential starting from 0', () => {
    const result = generateKruskalSnapshots(vertices, edges);
    result.snapshots.forEach((s, i) => {
      assert.equal(s.stepIndex, i);
    });
  });

  it('each snapshot contains a dsuState with parent and rank', () => {
    const result = generateKruskalSnapshots(vertices, edges);
    result.snapshots.forEach(s => {
      assert.ok(Array.isArray(s.dsuState.parent));
      assert.ok(Array.isArray(s.dsuState.rank));
      assert.ok(typeof s.dsuState.components === 'object');
    });
  });
});

describe('generateKruskalSnapshots - edge with unknown vertex', () => {
  it('skips edges referencing vertices not in the vertex list', () => {
    const vertices = makeVertices(['A', 'B']);
    const edges = [
      makeEdge('e1', 'A', 'Z', 1), // Z is not in vertex list
      makeEdge('e2', 'A', 'B', 2),
    ];
    const result = generateKruskalSnapshots(vertices, edges);
    // Should still find MST with the valid edge
    assert.equal(result.mstEdges.length, 1);
    assert.equal(result.totalCost, 2);
  });
});
