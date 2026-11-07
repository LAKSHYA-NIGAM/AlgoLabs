/**
 * Data and Test Cases for the Interactive Activities and Coding Challenge
 */

// 1. Manual MST Builder Challenge Graph (7 nodes: P, Q, R, S, T, U, V)
export const MANUAL_CHALLENGE_GRAPH = {
  vertices: [
    { id: 'P', label: 'P', x: 260, y: 70 },
    { id: 'Q', label: 'Q', x: 420, y: 130 },
    { id: 'R', label: 'R', x: 460, y: 280 },
    { id: 'S', label: 'S', x: 360, y: 390 },
    { id: 'T', label: 'T', x: 160, y: 390 },
    { id: 'U', label: 'U', x: 60, y: 280 },
    { id: 'V', label: 'V', x: 100, y: 130 },
  ],
  edges: [
    { id: 'RS', u: 'R', v: 'S', weight: 2 },
    { id: 'PQ', u: 'P', v: 'Q', weight: 3 },
    { id: 'UV', u: 'U', v: 'V', weight: 3 },
    { id: 'ST', u: 'S', v: 'T', weight: 4 },
    { id: 'VP', u: 'V', v: 'P', weight: 4 },
    { id: 'QR', u: 'Q', v: 'R', weight: 5 },
    { id: 'US', u: 'U', v: 'S', weight: 5 },
    { id: 'TU', u: 'T', v: 'U', weight: 6 },
    { id: 'QV', u: 'Q', v: 'V', weight: 7 },
    { id: 'QS', u: 'Q', v: 'S', weight: 8 },
    { id: 'RT', u: 'R', v: 'T', weight: 9 },
    { id: 'PR', u: 'P', v: 'R', weight: 10 },
  ],
  expectedCost: 21
};

// 2. Coding Challenge Specs and Test Cases
export const CODING_CHALLENGE = {
  title: 'Java MST Solver: Kruskal + DSU Implementation',
  badge: 'LeetCode 1584 / CS Core',
  difficulty: 'Medium-Hard',
  timeLimit: '2.0 seconds',
  memoryLimit: '256 MB',
  description: `Given an integer \`V\` representing the number of vertices numbered \`0\` to \`V - 1\`, and a 2D integer array \`edges\` where \`edges[i] = [u, v, weight]\` represents an undirected weighted edge between vertex \`u\` and vertex \`v\` with weight \`weight\`.

Find the total weight of the **Minimum Spanning Tree (MST)** using Kruskal's algorithm with Disjoint Set Union (DSU). If the graph is disconnected and no spanning tree can connect all vertices, return \`-1\`.`,
  constraints: [
    '1 <= V <= 10^4',
    '0 <= edges.length <= 10^5',
    'edges[i].length == 3',
    '0 <= u, v < V',
    '-10^4 <= weight <= 10^4',
    'The graph may contain parallel edges or cycles, but no self-loops.'
  ],
  starterCode: `import java.util.*;

class Solution {
    // Disjoint Set Union with Path Compression and Union by Rank
    static class DSU {
        int[] parent;
        int[] rank;
        int components;

        public DSU(int n) {
            parent = new int[n];
            rank = new int[n];
            components = n;
            for (int i = 0; i < n; i++) {
                parent[i] = i;
            }
        }

        public int find(int x) {
            if (parent[x] != x) {
                parent[x] = find(parent[x]); // Path compression
            }
            return parent[x];
        }

        public boolean union(int x, int y) {
            int rootX = find(x);
            int rootY = find(y);
            if (rootX == rootY) return false; // Cycle detected

            if (rank[rootX] < rank[rootY]) {
                parent[rootX] = rootY;
            } else if (rank[rootX] > rank[rootY]) {
                parent[rootY] = rootX;
            } else {
                parent[rootY] = rootX;
                rank[rootX]++;
            }
            components--;
            return true;
        }
    }

    public int minimumSpanningTree(int V, int[][] edges) {
        // Step 1: Sort edges in non-decreasing order of weight
        Arrays.sort(edges, (a, b) -> Integer.compare(a[2], b[2]));

        DSU dsu = new DSU(V);
        int totalWeight = 0;
        int edgesAdded = 0;

        // Step 2: Iterate through sorted edges and apply greedy union
        for (int[] edge : edges) {
            int u = edge[0];
            int v = edge[1];
            int weight = edge[2];

            if (dsu.union(u, v)) {
                totalWeight += weight;
                edgesAdded++;
                if (edgesAdded == V - 1) break;
            }
        }

        // Step 3: Check if all vertices are connected
        if (V > 1 && edgesAdded < V - 1) {
            return -1; // Disconnected graph
        }

        return totalWeight;
    }
}`,
  testCases: [
    {
      id: 1,
      name: 'Default Curriculum 5-Node Graph',
      category: 'connected',
      v: 5,
      edges: [
        [3, 4, 1], // DE
        [1, 2, 2], // BC
        [0, 2, 3], // AC
        [0, 1, 4], // AB
        [1, 3, 5], // BD
        [2, 4, 6], // CE
        [2, 3, 7]  // CD
      ],
      expected: 11,
      explanation: 'Edges DE(1) + BC(2) + AC(3) + BD(5) = 11. Connects all 5 nodes with 4 edges.'
    },
    {
      id: 2,
      name: 'Graph with Multiple Cycles',
      category: 'cyclic',
      v: 4,
      edges: [
        [0, 1, 1],
        [1, 2, 2],
        [2, 3, 3],
        [3, 0, 4],
        [0, 2, 5],
        [1, 3, 6]
      ],
      expected: 6,
      explanation: 'Picks edges of weights 1, 2, 3. Edges 4, 5, 6 form cycles and are rejected. Total = 6.'
    },
    {
      id: 3,
      name: 'Disconnected Graph (Forest)',
      category: 'disconnected',
      v: 5,
      edges: [
        [0, 1, 2],
        [1, 2, 3],
        [3, 4, 1]
      ],
      expected: -1,
      explanation: 'Components {0,1,2} and {3,4} cannot be connected; returns -1 indicating no valid spanning tree.'
    },
    {
      id: 4,
      name: 'Single Vertex Edge Case (V=1)',
      category: 'edge_case',
      v: 1,
      edges: [],
      expected: 0,
      explanation: 'A graph with 1 vertex needs 0 edges. Total MST weight is 0.'
    },
    {
      id: 5,
      name: 'Negative Edge Weights',
      category: 'negative_weights',
      v: 4,
      edges: [
        [0, 1, -5],
        [1, 2, -2],
        [2, 3, 1],
        [3, 0, 4],
        [0, 2, 3]
      ],
      expected: -6,
      explanation: 'Kruskal works seamlessly with negative weights: (-5) + (-2) + (1) = -6.'
    }
  ]
};
