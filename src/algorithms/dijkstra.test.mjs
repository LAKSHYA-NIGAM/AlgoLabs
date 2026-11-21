import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { dijkstra, reconstructPath, MinPriorityQueue } from './dijkstra.js';

describe('Dijkstra Shortest Path Algorithm Tests', () => {
  test('MinPriorityQueue orders elements by ascending priority', () => {
    const pq = new MinPriorityQueue();
    pq.enqueue(10, 'C');
    pq.enqueue(2, 'A');
    pq.enqueue(5, 'B');

    assert.equal(pq.dequeue().value, 'A');
    assert.equal(pq.dequeue().value, 'B');
    assert.equal(pq.dequeue().value, 'C');
    assert.equal(pq.isEmpty(), true);
  });

  test('computes correct shortest distances on standard weighted graph', () => {
    const graph = {
      A: { B: 4, C: 2 },
      B: { A: 4, C: 1, D: 5 },
      C: { A: 2, B: 1, D: 8, E: 10 },
      D: { B: 5, C: 8, E: 2 },
      E: { C: 10, D: 2 }
    };

    const { distances, previous, steps } = dijkstra(graph, 'A');

    assert.equal(distances['A'], 0);
    assert.equal(distances['B'], 3); // A -> C (2) + C -> B (1) = 3
    assert.equal(distances['C'], 2);
    assert.equal(distances['D'], 8); // A -> C (2) + C -> B (1) + B -> D (5) = 8
    assert.equal(distances['E'], 10); // A -> C (2) + C -> B (1) + B -> D (5) + D -> E (2) = 10
    assert.ok(steps.length > 5, 'Should generate visualizer trace steps');
  });

  test('reconstructsPath correctly yields shortest path vertex sequence', () => {
    const graph = {
      S: { A: 1, B: 4 },
      A: { B: 2, C: 5 },
      B: { C: 1 },
      C: {}
    };

    const { previous } = dijkstra(graph, 'S');
    const path = reconstructPath(previous, 'C');
    assert.deepEqual(path, ['S', 'A', 'B', 'C']);
  });

  test('handles disconnected vertices with Infinity distance', () => {
    const graph = {
      X: { Y: 3 },
      Y: {},
      Z: {} // Disconnected
    };

    const { distances } = dijkstra(graph, 'X');
    assert.equal(distances['X'], 0);
    assert.equal(distances['Y'], 3);
    assert.equal(distances['Z'], Infinity);
  });

  test('throws error when invalid start node is supplied', () => {
    assert.throws(() => dijkstra({ A: {} }, 'UNKNOWN'), /Invalid graph/);
  });
});
