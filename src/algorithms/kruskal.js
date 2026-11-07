import { DSU } from './dsu.js';

/**
 * Executes Kruskal's Minimum Spanning Tree Algorithm and generates
 * step-by-step immutable snapshots for visual replay.
 * 
 * @param {Array<{ id: string, label: string }>} vertices 
 * @param {Array<{ id: string, u: string, v: string, weight: number }>} edges 
 * @returns {{
 *   snapshots: Array<Object>,
 *   mstEdges: Array<Object>,
 *   totalCost: number,
 *   isSpanningTree: boolean,
 *   isForest: boolean,
 *   componentCount: number,
 *   sortedEdges: Array<Object>
 * }}
 */
export function generateKruskalSnapshots(vertices, edges) {
  const n = vertices.length;
  if (n === 0) {
    return {
      snapshots: [],
      mstEdges: [],
      totalCost: 0,
      isSpanningTree: false,
      isForest: false,
      componentCount: 0,
      sortedEdges: []
    };
  }

  // Create mapping from vertex id/label to index 0..n-1
  const vertexToIndex = new Map();
  const indexToVertex = new Map();
  vertices.forEach((v, idx) => {
    vertexToIndex.set(v.id || v.label, idx);
    indexToVertex.set(idx, v.label || v.id);
  });

  // Sort edges ascending by weight. If equal weights, sort deterministically by id
  const sortedEdges = [...edges].sort((a, b) => {
    if (a.weight !== b.weight) return a.weight - b.weight;
    return (a.id || '').localeCompare(b.id || '');
  });

  const dsu = new DSU(n);
  const snapshots = [];
  const mstEdges = [];
  let totalCost = 0;

  // Snapshot 0: Initial state before any edge is processed
  snapshots.push({
    stepIndex: 0,
    type: 'INIT',
    title: 'Initialize Kruskal Algorithm',
    explanation: `Graph contains ${n} vertices and ${edges.length} edges. Disjoint Set Union initialized with ${n} isolated sets. Edges sorted in non-decreasing order of weight.`,
    currentEdge: null,
    currentEdgeIndex: -1,
    edgeStatuses: {}, // edgeId -> 'unprocessed' | 'current' | 'accepted' | 'rejected'
    mstEdges: [],
    totalCost: 0,
    dsuState: {
      parent: [...dsu.parent],
      rank: [...dsu.rank],
      components: dsu.getComponents(n),
    },
    representatives: null,
    decision: 'INIT',
    codeLine: 24, // Sorting edges & initial setup
    prediction: null
  });

  // Keep track of cumulative edge statuses
  const edgeStatuses = {};
  sortedEdges.forEach(e => {
    edgeStatuses[e.id] = 'unprocessed';
  });

  // Process edges one by one
  for (let i = 0; i < sortedEdges.length; i++) {
    const edge = sortedEdges[i];
    const uIdx = vertexToIndex.get(edge.u);
    const vIdx = vertexToIndex.get(edge.v);

    if (uIdx === undefined || vIdx === undefined) {
      continue;
    }

    // Step A: Examine / Consider the edge
    const pathU = [];
    const pathV = [];
    // We peek roots first for the snapshot explanation
    const rootU = dsu.find(uIdx, pathU);
    const rootV = dsu.find(vIdx, pathV);
    const rootULabel = indexToVertex.get(rootU);
    const rootVLabel = indexToVertex.get(rootV);

    const isCycle = (rootU === rootV);

    // 1. Snapshot: Inspecting edge
    edgeStatuses[edge.id] = 'current';

    snapshots.push({
      stepIndex: snapshots.length,
      type: 'CONSIDER',
      title: `Inspect Edge ${edge.u}-${edge.v} (Weight: ${edge.weight})`,
      explanation: `Evaluating edge (${edge.u}, ${edge.v}) with weight ${edge.weight}. Running Find: vertex ${edge.u} belongs to component representative '${rootULabel}', vertex ${edge.v} belongs to representative '${rootVLabel}'.`,
      currentEdge: edge,
      currentEdgeIndex: i,
      edgeStatuses: { ...edgeStatuses },
      mstEdges: [...mstEdges],
      totalCost,
      dsuState: {
        parent: [...dsu.parent],
        rank: [...dsu.rank],
        components: dsu.getComponents(n),
      },
      representatives: {
        u: edge.u,
        v: edge.v,
        uIdx,
        vIdx,
        rootU,
        rootV,
        rootULabel,
        rootVLabel,
        isCycle
      },
      decision: 'PENDING',
      codeLine: 28, // edge evaluation in loop
      expectedAction: isCycle ? 'REJECT' : 'ACCEPT',
      predictionPrompt: `Will edge ${edge.u}-${edge.v} (weight ${edge.weight}) be accepted into the MST or rejected because it forms a cycle?`
    });

    // 2. Snapshot: Decision (Accept or Reject)
    if (!isCycle) {
      // Perform Union
      const unionResult = dsu.union(uIdx, vIdx);
      mstEdges.push(edge);
      totalCost += edge.weight;
      edgeStatuses[edge.id] = 'accepted';

      snapshots.push({
        stepIndex: snapshots.length,
        type: 'ACCEPT',
        title: `Accept Edge ${edge.u}-${edge.v} into MST`,
        explanation: `Find(${edge.u}) = ${rootULabel} ≠ Find(${edge.v}) = ${rootVLabel}. No cycle formed. Union performed (merged component ${rootULabel} and ${rootVLabel}). Edge added to MST. Current cost: ${totalCost}.`,
        currentEdge: edge,
        currentEdgeIndex: i,
        edgeStatuses: { ...edgeStatuses },
        mstEdges: [...mstEdges],
        totalCost,
        dsuState: {
          parent: [...dsu.parent],
          rank: [...dsu.rank],
          components: dsu.getComponents(n),
        },
        representatives: {
          u: edge.u,
          v: edge.v,
          rootU,
          rootV,
          rootULabel,
          rootVLabel,
          newRoot: unionResult.newRoot,
          attached: unionResult.attached,
          isCycle: false
        },
        decision: 'ACCEPTED',
        codeLine: 29 // union & add to mst
      });

      // Early stop check: If MST has n-1 edges, remaining edges would only form cycles
      if (mstEdges.length === n - 1 && i < sortedEdges.length - 1) {
        // Mark remaining edges as skipped/cycle-redundant
        for (let j = i + 1; j < sortedEdges.length; j++) {
          edgeStatuses[sortedEdges[j].id] = 'rejected';
        }

        snapshots.push({
          stepIndex: snapshots.length,
          type: 'EARLY_STOP',
          title: `MST Complete (${n - 1} Edges Reached)`,
          explanation: `A spanning tree on ${n} vertices requires exactly ${n - 1} edges. We have collected ${mstEdges.length} edges connecting all vertices. Remaining edges can be safely skipped as they would only form cycles.`,
          currentEdge: null,
          currentEdgeIndex: -1,
          edgeStatuses: { ...edgeStatuses },
          mstEdges: [...mstEdges],
          totalCost,
          dsuState: {
            parent: [...dsu.parent],
            rank: [...dsu.rank],
            components: dsu.getComponents(n),
          },
          representatives: null,
          decision: 'COMPLETE',
          codeLine: 32 // break early
        });
        break;
      }
    } else {
      // Cycle detected
      edgeStatuses[edge.id] = 'rejected';

      snapshots.push({
        stepIndex: snapshots.length,
        type: 'REJECT',
        title: `Reject Edge ${edge.u}-${edge.v} (Forms Cycle)`,
        explanation: `Find(${edge.u}) = ${rootULabel} == Find(${edge.v}) = ${rootVLabel}. Vertices ${edge.u} and ${edge.v} already belong to the same connected component. Adding this edge creates a cycle! Edge rejected.`,
        currentEdge: edge,
        currentEdgeIndex: i,
        edgeStatuses: { ...edgeStatuses },
        mstEdges: [...mstEdges],
        totalCost,
        dsuState: {
          parent: [...dsu.parent],
          rank: [...dsu.rank],
          components: dsu.getComponents(n),
        },
        representatives: {
          u: edge.u,
          v: edge.v,
          rootU,
          rootV,
          rootULabel,
          rootVLabel,
          isCycle: true
        },
        decision: 'REJECTED',
        codeLine: 28 // cycle condition
      });
    }
  }

  // Final check for connectivity
  const finalComponents = dsu.getComponents(n);
  const componentCount = Object.keys(finalComponents).length;
  const isSpanningTree = (mstEdges.length === n - 1) && (componentCount === 1);
  const isForest = (componentCount > 1);

  snapshots.push({
    stepIndex: snapshots.length,
    type: 'FINAL',
    title: isSpanningTree ? 'Minimum Spanning Tree Found!' : 'Minimum Spanning Forest',
    explanation: isSpanningTree
      ? `Successfully constructed MST with ${mstEdges.length} edges and total minimum weight of ${totalCost}. All ${n} vertices are connected with no cycles.`
      : `Graph is disconnected (${componentCount} separate components). Kruskal's algorithm identified a Minimum Spanning Forest of total weight ${totalCost}. A single connected MST is impossible because some vertices have no path between them.`,
    currentEdge: null,
    currentEdgeIndex: -1,
    edgeStatuses: { ...edgeStatuses },
    mstEdges: [...mstEdges],
    totalCost,
    dsuState: {
      parent: [...dsu.parent],
      rank: [...dsu.rank],
      components: finalComponents,
    },
    representatives: null,
    decision: isSpanningTree ? 'SUCCESS' : 'FOREST',
    codeLine: 36 // return mst
  });

  return {
    snapshots,
    mstEdges,
    totalCost,
    isSpanningTree,
    isForest,
    componentCount,
    sortedEdges
  };
}
