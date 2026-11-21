/**
 * Dijkstra's Shortest Path Algorithm
 * Computes shortest distances from a start vertex to all other vertices in a weighted graph.
 * Produces step-by-step trace frames for the AlgoLabs visualizer.
 */

export class MinPriorityQueue {
  constructor() {
    this.elements = [];
  }

  enqueue(priority, value) {
    this.elements.push({ priority, value });
    this.elements.sort((a, b) => a.priority - b.priority);
  }

  dequeue() {
    return this.elements.shift();
  }

  isEmpty() {
    return this.elements.length === 0;
  }
}

export function dijkstra(graph, startNode) {
  if (!graph || typeof graph !== 'object' || !(startNode in graph)) {
    throw new Error('Invalid graph or start node provided');
  }

  const distances = {};
  const previous = {};
  const visited = new Set();
  const pq = new MinPriorityQueue();
  const steps = [];

  for (const node of Object.keys(graph)) {
    distances[node] = Infinity;
    previous[node] = null;
  }
  distances[startNode] = 0;
  pq.enqueue(0, startNode);

  steps.push({
    type: 'INIT',
    currentNode: startNode,
    distances: { ...distances },
    visited: Array.from(visited),
    description: `Initialized distances. Start node ${startNode} set to 0, all others Infinity.`
  });

  while (!pq.isEmpty()) {
    const { priority: currentDist, value: currentNode } = pq.dequeue();

    if (visited.has(currentNode)) continue;
    visited.add(currentNode);

    steps.push({
      type: 'VISIT_NODE',
      currentNode,
      currentDist,
      distances: { ...distances },
      visited: Array.from(visited),
      description: `Visited node ${currentNode} with finalized shortest distance ${currentDist}.`
    });

    const neighbors = graph[currentNode] || {};
    for (const [neighbor, weight] of Object.entries(neighbors)) {
      if (visited.has(neighbor)) continue;

      const newDist = currentDist + weight;
      if (newDist < distances[neighbor]) {
        distances[neighbor] = newDist;
        previous[neighbor] = currentNode;
        pq.enqueue(newDist, neighbor);

        steps.push({
          type: 'UPDATE_NEIGHBOR',
          currentNode,
          neighbor,
          newDist,
          distances: { ...distances },
          visited: Array.from(visited),
          description: `Relaxed edge (${currentNode} -> ${neighbor}): new shorter distance is ${newDist}.`
        });
      }
    }
  }

  return { distances, previous, steps };
}

export function reconstructPath(previous, targetNode) {
  const path = [];
  let curr = targetNode;
  while (curr !== null && curr !== undefined) {
    path.unshift(curr);
    curr = previous[curr];
  }
  return path.length > 0 ? path : [];
}
