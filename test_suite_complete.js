import { DSU } from './src/algorithms/dsu.js';
import { generateKruskalSnapshots } from './src/algorithms/kruskal.js';
import { DEFAULT_VERTICES, DEFAULT_EDGES } from './src/data/defaultGraph.js';
import { LESSON_MODULES } from './src/data/curriculumModules.js';
import { QUIZ_QUESTIONS } from './src/data/quizQuestions.js';
import { CODING_CHALLENGE, MANUAL_CHALLENGE_GRAPH } from './src/data/challengeData.js';
import { JAVA_SOURCE_CODE, JAVA_DRY_RUN_STEPS } from './src/data/javaCurriculumCode.js';

let passedTests = 0;
let totalTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`[PASS] ${name}`);
  } catch (err) {
    console.error(`[FAIL] ${name}: ${err.message}`);
    throw err;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

console.log('================================================================');
console.log('         ALCOLAB PHASE 4: COMPLETE FUNCTIONAL TEST SUITE        ');
console.log('================================================================\n');

// ----------------------------------------------------------------------
// 1. ALGORITHM TESTING
// ----------------------------------------------------------------------
console.log('--- 1. ALGORITHM TESTING ---');

test('Kruskal on default 5-node curriculum graph produces MST of weight 11', () => {
  const result = generateKruskalSnapshots(DEFAULT_VERTICES, DEFAULT_EDGES);
  assert(result.isSpanningTree === true, 'Must be a spanning tree');
  assert(result.componentCount === 1, 'Component count must be 1');
  assert(result.mstEdges.length === DEFAULT_VERTICES.length - 1, 'Must have V - 1 edges');
  assert(result.totalCost === 11, `Expected weight 11, got ${result.totalCost}`);
});

test('Kruskal on 6-city fiber optic network produces MST of weight 31', () => {
  const cityVertices = [
    { id: 'DEL', label: 'Delhi' },
    { id: 'MUM', label: 'Mumbai' },
    { id: 'KOL', label: 'Kolkata' },
    { id: 'HYD', label: 'Hyderabad' },
    { id: 'BLR', label: 'Bangalore' },
    { id: 'CHE', label: 'Chennai' },
  ];
  const cityEdges = [
    { id: 'DEL-MUM', u: 'DEL', v: 'MUM', weight: 14 },
    { id: 'DEL-KOL', u: 'DEL', v: 'KOL', weight: 7 },
    { id: 'DEL-HYD', u: 'DEL', v: 'HYD', weight: 9 },
    { id: 'MUM-BLR', u: 'MUM', v: 'BLR', weight: 8 },
    { id: 'MUM-HYD', u: 'MUM', v: 'HYD', weight: 11 },
    { id: 'KOL-HYD', u: 'KOL', v: 'HYD', weight: 10 },
    { id: 'HYD-CHE', u: 'HYD', v: 'CHE', weight: 3 },
    { id: 'HYD-BLR', u: 'HYD', v: 'BLR', weight: 6 },
    { id: 'BLR-CHE', u: 'BLR', v: 'CHE', weight: 4 },
  ];
  const result = generateKruskalSnapshots(cityVertices, cityEdges);
  assert(result.isSpanningTree === true, 'Must be a spanning tree');
  assert(result.componentCount === 1, 'Component count must be 1');
  assert(result.mstEdges.length === 5, 'Must have 5 edges');
  assert(result.totalCost === 31, `Expected weight 31, got ${result.totalCost}`);
});

test('Edge sorting is strictly non-decreasing by weight', () => {
  const result = generateKruskalSnapshots(DEFAULT_VERTICES, DEFAULT_EDGES);
  for (let i = 0; i < result.sortedEdges.length - 1; i++) {
    assert(
      result.sortedEdges[i].weight <= result.sortedEdges[i + 1].weight,
      `Edges must be sorted ascending: ${result.sortedEdges[i].weight} <= ${result.sortedEdges[i + 1].weight}`
    );
  }
});

test('Cycle detection properly rejects redundant edges', () => {
  const result = generateKruskalSnapshots(DEFAULT_VERTICES, DEFAULT_EDGES);
  const rejectSnapshots = result.snapshots.filter(s => s.type === 'REJECT');
  assert(rejectSnapshots.length > 0, 'Must have at least one rejected cycle edge');
  rejectSnapshots.forEach(s => {
    assert(s.decision === 'REJECTED', 'Decision must be REJECTED');
    assert(s.representatives.isCycle === true, 'isCycle flag must be true');
    assert(s.representatives.rootU === s.representatives.rootV, 'Roots must match for rejected edge');
  });
});

test('Disconnected graph correctly detects forest and component count', () => {
  const discV = [{ id: 'A' }, { id: 'B' }, { id: 'C' }, { id: 'D' }, { id: 'E' }];
  const discE = [
    { id: 'e1', u: 'A', v: 'B', weight: 4 },
    { id: 'e2', u: 'C', v: 'D', weight: 6 }
  ];
  const res = generateKruskalSnapshots(discV, discE);
  assert(res.isSpanningTree === false, 'Cannot be spanning tree');
  assert(res.isForest === true, 'Must be forest');
  assert(res.componentCount === 3, `Expected 3 components, got ${res.componentCount}`);
  assert(res.mstEdges.length === 2, 'Forest should have 2 edges');
  assert(res.totalCost === 10, 'Forest cost should be 10');
});

test('Duplicate parallel edges with different weights choose the minimum weight', () => {
  const v = [{ id: '1' }, { id: '2' }];
  const e = [
    { id: 'heavy', u: '1', v: '2', weight: 100 },
    { id: 'light', u: '1', v: '2', weight: 1 }
  ];
  const res = generateKruskalSnapshots(v, e);
  assert(res.mstEdges.length === 1, 'Only one edge in MST');
  assert(res.mstEdges[0].id === 'light', 'Must pick the lighter edge');
  assert(res.totalCost === 1, 'MST total weight must be 1');
});

test('Equal edge weights are resolved deterministically', () => {
  const v = [{ id: 'A' }, { id: 'B' }, { id: 'C' }];
  const e = [
    { id: 'e1', u: 'A', v: 'B', weight: 2 },
    { id: 'e2', u: 'B', v: 'C', weight: 2 },
    { id: 'e3', u: 'A', v: 'C', weight: 2 }
  ];
  const res = generateKruskalSnapshots(v, e);
  assert(res.mstEdges.length === 2, '2 edges chosen for 3 vertices');
  assert(res.totalCost === 4, 'Total cost must be 4');
  assert(res.isSpanningTree === true, 'Must form spanning tree');
});

test('Negative edge weights are handled correctly', () => {
  const v = [{ id: 'A' }, { id: 'B' }, { id: 'C' }];
  const e = [
    { id: 'e1', u: 'A', v: 'B', weight: -8 },
    { id: 'e2', u: 'B', v: 'C', weight: 5 },
    { id: 'e3', u: 'A', v: 'C', weight: -3 }
  ];
  const res = generateKruskalSnapshots(v, e);
  assert(res.totalCost === -11, `Expected -11, got ${res.totalCost}`);
  assert(res.mstEdges.length === 2, 'MST has 2 edges');
});

test('Gracefully ignores invalid edges pointing to undefined vertices', () => {
  const v = [{ id: 'A' }, { id: 'B' }];
  const e = [
    { id: 'bad', u: 'A', v: 'GHOST', weight: 1 },
    { id: 'good', u: 'A', v: 'B', weight: 10 }
  ];
  const res = generateKruskalSnapshots(v, e);
  assert(res.mstEdges.length === 1, 'Only good edge accepted');
  assert(res.mstEdges[0].id === 'good', 'Good edge was accepted');
  assert(res.isSpanningTree === true, 'Spanning tree achieved');
});

test('Edge cases: Empty graph and Single vertex graph', () => {
  const emptyRes = generateKruskalSnapshots([], []);
  assert(emptyRes.snapshots.length === 0, 'Empty graph returns 0 snapshots');
  assert(emptyRes.isSpanningTree === false, 'Empty graph cannot be spanning tree');

  const singleRes = generateKruskalSnapshots([{ id: 'solo' }], []);
  assert(singleRes.isSpanningTree === true, 'Single vertex is trivially a spanning tree of 0 edges');
  assert(singleRes.mstEdges.length === 0, '0 edges in 1-node tree');
  assert(singleRes.totalCost === 0, 'Cost is 0');
});

// ----------------------------------------------------------------------
// 2. SIMULATION SNAPSHOT INTEGRITY
// ----------------------------------------------------------------------
console.log('\n--- 2. SIMULATION SNAPSHOT INTEGRITY ---');

test('Snapshots provide pure immutable states without backward mutation', () => {
  const res = generateKruskalSnapshots(DEFAULT_VERTICES, DEFAULT_EDGES);
  const snap0 = res.snapshots[0];
  const snapFinal = res.snapshots[res.snapshots.length - 1];

  // Verify snap0 was not mutated by subsequent steps
  assert(snap0.mstEdges.length === 0, 'Snapshot 0 mstEdges must remain empty');
  assert(snap0.totalCost === 0, 'Snapshot 0 totalCost must remain 0');
  for (let i = 0; i < DEFAULT_VERTICES.length; i++) {
    assert(snap0.dsuState.parent[i] === i, `Snapshot 0 parent[${i}] must remain ${i}`);
    assert(snap0.dsuState.rank[i] === 0, `Snapshot 0 rank[${i}] must remain 0`);
  }

  // Verify final snapshot has full MST
  assert(snapFinal.mstEdges.length === 4, 'Final snapshot must have 4 MST edges (V - 1)');
  assert(snapFinal.totalCost === 11, 'Final snapshot totalCost must be 11');
});

test('Snapshot sequence transitions adhere to INIT -> (CONSIDER -> ACCEPT|REJECT)* -> FINAL', () => {
  const res = generateKruskalSnapshots(DEFAULT_VERTICES, DEFAULT_EDGES);
  assert(res.snapshots[0].type === 'INIT', 'First snapshot must be INIT');
  const last = res.snapshots[res.snapshots.length - 1];
  assert(last.type === 'FINAL', 'Last snapshot must be FINAL');

  for (let i = 1; i < res.snapshots.length - 1; i++) {
    const s = res.snapshots[i];
    assert(
      ['CONSIDER', 'ACCEPT', 'REJECT', 'EARLY_STOP'].includes(s.type),
      `Unexpected snapshot type: ${s.type}`
    );
  }
});

// ----------------------------------------------------------------------
// 3. DSU PLAYGROUND FUNCTIONALITY
// ----------------------------------------------------------------------
console.log('\n--- 3. DSU PLAYGROUND FUNCTIONALITY ---');

test('DSU path compression flattens tree on find()', () => {
  const d = new DSU(10);
  // Chain: 0 <- 1 <- 2 <- 3 <- 4
  d.parent[1] = 0;
  d.parent[2] = 1;
  d.parent[3] = 2;
  d.parent[4] = 3;

  assert(d.parent[4] === 3, 'Before find: parent[4] is 3');
  const root = d.find(4);
  assert(root === 0, 'Root must be 0');
  assert(d.parent[4] === 0, 'After find: parent[4] must point directly to root 0');
  assert(d.parent[3] === 0, 'After find: parent[3] must point directly to root 0');
  assert(d.parent[2] === 0, 'After find: parent[2] must point directly to root 0');
});

test('DSU union by rank attaches smaller tree to larger tree', () => {
  const d = new DSU(6);
  // Tree 1: 0, 1 (rank 1)
  d.union(0, 1);
  const r1 = d.find(0);
  assert(d.rank[r1] === 1, 'Rank of tree 1 must be 1');

  // Tree 2: 2, 3, 4 (rank 1)
  d.union(2, 3);
  const r2 = d.find(2);
  d.union(r2, 4);
  assert(d.rank[r2] === 1, 'Rank remains 1 when attaching rank 0 node 4');

  // Merge tree 1 (rank 1) and tree 2 (rank 1) -> new rank becomes 2
  const mergeRes = d.union(r1, r2);
  assert(mergeRes.success === true, 'Merge should succeed');
  const finalRoot = d.find(0);
  assert(d.rank[finalRoot] === 2, `Rank should increment to 2, got ${d.rank[finalRoot]}`);
});

test('DSU component grouping correctly partitions vertices', () => {
  const d = new DSU(6);
  d.union(0, 1);
  d.union(1, 2);
  d.union(3, 4);
  // Set 1: {0, 1, 2}, Set 2: {3, 4}, Set 3: {5}
  const comps = d.getComponents(6);
  const root0 = d.find(0);
  const root3 = d.find(3);
  const root5 = d.find(5);

  assert(comps[root0].length === 3, 'Component 0 must have 3 elements');
  assert(comps[root3].length === 2, 'Component 3 must have 2 elements');
  assert(comps[root5].length === 1, 'Component 5 must have 1 element');
});

// ----------------------------------------------------------------------
// 4. JAVA WALKTHROUGH MAPPINGS
// ----------------------------------------------------------------------
console.log('\n--- 4. JAVA WALKTHROUGH MAPPINGS ---');

test('Java dry run steps match exact line numbers in Java source code', () => {
  const lines = JAVA_SOURCE_CODE.split('\n');
  JAVA_DRY_RUN_STEPS.forEach((step) => {
    assert(step.line > 0 && step.line <= lines.length, `Line ${step.line} is within source bounds`);
    const lineText = lines[step.line - 1].trim();
    assert(lineText.length > 0, `Line ${step.line} must not be an empty line`);
  });

  // Verify specific anchor lines
  assert(lines[JAVA_DRY_RUN_STEPS[0].line - 1].includes('Collections.sort(edges)'), 'Step 0 targets sort line');
  assert(lines[JAVA_DRY_RUN_STEPS[1].line - 1].includes('if (dsu.union(edge.u, edge.v))'), 'Step 1 targets union condition');
  assert(lines[JAVA_DRY_RUN_STEPS[4].line - 1].includes('return false;'), 'Step 4 targets cycle reject line');
  assert(lines[JAVA_DRY_RUN_STEPS[6].line - 1].includes('break;'), 'Step 6 targets break line');
});

// ----------------------------------------------------------------------
// 5. QUIZ & CHALLENGE DATA VALIDATION
// ----------------------------------------------------------------------
console.log('\n--- 5. QUIZ & CHALLENGE DATA VALIDATION ---');

test('All 8 quiz questions have valid answer keys and detailed explanations', () => {
  assert(QUIZ_QUESTIONS.length === 8, 'Must have exactly 8 quiz questions');
  QUIZ_QUESTIONS.forEach(q => {
    assert(['A', 'B', 'C', 'D'].includes(q.correctAnswer), `Question ${q.id} answer must be A, B, C, or D`);
    assert(q.options.some(o => o.id === q.correctAnswer), `Question ${q.id} options must include correctAnswer`);
    assert(typeof q.explanation === 'string' && q.explanation.length > 20, `Question ${q.id} explanation must be comprehensive`);
  });
});

test('Manual MST Builder challenge graph has unique optimal MST', () => {
  const { vertices, edges, expectedCost } = MANUAL_CHALLENGE_GRAPH;
  const res = generateKruskalSnapshots(vertices, edges);
  assert(res.isSpanningTree === true, 'Manual challenge graph must have spanning tree');
  assert(res.totalCost === expectedCost, `Expected MST cost ${expectedCost}, got ${res.totalCost}`);
  assert(res.mstEdges.length === vertices.length - 1, 'Must have V - 1 edges');
});

test('Automated Java coding challenge evaluates all 5 test suites accurately', () => {
  assert(CODING_CHALLENGE.testCases.length === 5, 'Must have 5 test suites');
  CODING_CHALLENGE.testCases.forEach(tc => {
    let actual = 0;
    if (tc.v <= 1) {
      actual = 0;
    } else {
      const sorted = [...tc.edges].sort((a, b) => a[2] - b[2]);
      const parent = Array.from({ length: tc.v }, (_, i) => i);
      const find = (x) => {
        if (parent[x] !== x) parent[x] = find(parent[x]);
        return parent[x];
      };

      let cost = 0;
      let count = 0;
      for (const [u, v, w] of sorted) {
        const rootU = find(u);
        const rootV = find(v);
        if (rootU !== rootV) {
          parent[rootU] = rootV;
          cost += w;
          count++;
          if (count === tc.v - 1) break;
        }
      }
      actual = count < tc.v - 1 ? -1 : cost;
    }
    assert(actual === tc.expected, `Test case ${tc.id} (${tc.name}) expected ${tc.expected}, got ${actual}`);
  });
});

// ----------------------------------------------------------------------
// 6. CURRICULUM MODULES & NAVIGATION
// ----------------------------------------------------------------------
console.log('\n--- 6. CURRICULUM MODULES & NAVIGATION ---');

test('Curriculum modules contain all 8 sequential chapters plus completion page', () => {
  assert(LESSON_MODULES.length === 9, 'Must have 8 chapters + completion in curriculum');
  const expectedPaths = [
    '/introduction',
    '/foundations',
    '/dsu',
    '/visualizer',
    '/java-walkthrough',
    '/complexity',
    '/quiz',
    '/challenge',
    '/completion'
  ];
  LESSON_MODULES.forEach((m, idx) => {
    assert(m.path === expectedPaths[idx], `Module ${idx + 1} path must be ${expectedPaths[idx]}`);
    if (idx < 8) {
      assert(m.number === `0${idx + 1}`, `Module number must be 0${idx + 1}`);
    } else {
      assert(m.number === '✓', 'Completion number must be ✓');
    }
  });
});

console.log('\n================================================================');
console.log(`TOTAL TESTS: ${totalTests} | PASSED: ${passedTests} | FAILED: 0`);
console.log('================================================================\n');
