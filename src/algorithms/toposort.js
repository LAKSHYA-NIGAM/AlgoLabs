/**
 * Topological Sort (Kahn's Algorithm) for Directed Acyclic Graphs (DAGs)
 * Computes node in-degrees, dependency resolution order, and detects cycles.
 */

export function topologicalSort(numNodes, edges) {
  if (!Number.isInteger(numNodes) || numNodes <= 0) {
    return { order: [], hasCycle: false, inDegrees: [] };
  }

  const inDegree = new Array(numNodes).fill(0);
  const adj = Array.from({ length: numNodes }, () => []);

  if (Array.isArray(edges)) {
    for (const edge of edges) {
      if (Array.isArray(edge) && edge.length >= 2) {
        const [u, v] = edge;
        if (u >= 0 && u < numNodes && v >= 0 && v < numNodes) {
          adj[u].push(v);
          inDegree[v]++;
        }
      }
    }
  }

  // Queue of nodes with zero in-degree
  const queue = [];
  for (let i = 0; i < numNodes; i++) {
    if (inDegree[i] === 0) {
      queue.push(i);
    }
  }

  const order = [];
  const initialInDegrees = [...inDegree];

  while (queue.length > 0) {
    const node = queue.shift();
    order.push(node);

    for (const neighbor of adj[node]) {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
      }
    }
  }

  const hasCycle = order.length !== numNodes;

  return {
    order: hasCycle ? [] : order,
    hasCycle,
    initialInDegrees,
    processedCount: order.length,
  };
}
