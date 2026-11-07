/**
 * Complete, compilable Java Kruskal + DSU Implementation
 */
export const JAVA_SOURCE_CODE = `import java.util.*;

public class KruskalMST {

    // Edge representation implementing Comparable for sorting
    static class Edge implements Comparable<Edge> {
        int u, v, weight;

        public Edge(int u, int v, int weight) {
            this.u = u;
            this.v = v;
            this.weight = weight;
        }

        @Override
        public int compareTo(Edge other) {
            return Integer.compare(this.weight, other.weight);
        }
    }

    // Disjoint Set Union (DSU) with Path Compression & Union by Rank
    static class DSU {
        int[] parent;
        int[] rank;

        public DSU(int n) {
            parent = new int[n];
            rank = new int[n];
            for (int i = 0; i < n; i++) {
                parent[i] = i; // Every vertex initially points to itself
                rank[i] = 0;
            }
        }

        // Find with Path Compression: O(α(V)) amortized
        public int find(int x) {
            if (parent[x] != x) {
                parent[x] = find(parent[x]); // Flattens the tree directly to root
            }
            return parent[x];
        }

        // Union by Rank: attaches smaller rank tree under larger
        public boolean union(int x, int y) {
            int rootX = find(x);
            int rootY = find(y);

            // If roots match, endpoints already connected (cycle)
            if (rootX == rootY) {
                return false;
            }

            if (rank[rootX] < rank[rootY]) {
                parent[rootX] = rootY;
            } else if (rank[rootX] > rank[rootY]) {
                parent[rootY] = rootX;
            } else {
                parent[rootY] = rootX;
                rank[rootX]++;
            }
            return true;
        }
    }

    // Kruskal's Minimum Spanning Tree Algorithm
    public static int kruskalMST(int V, List<Edge> edges) {
        // Step 1: Sort all edges by non-decreasing weight: O(E log E)
        Collections.sort(edges);

        DSU dsu = new DSU(V);
        List<Edge> mstEdges = new ArrayList<>();
        int totalWeight = 0;

        // Step 2: Greedily pick edges that do not introduce cycles
        for (Edge edge : edges) {
            if (dsu.union(edge.u, edge.v)) {
                mstEdges.add(edge);
                totalWeight += edge.weight;

                // Step 3: V - 1 stopping condition
                if (mstEdges.size() == V - 1) {
                    break;
                }
            }
        }

        return totalWeight;
    }

    public static void main(String[] args) {
        // Vertex mapping: A=0, B=1, C=2, D=3, E=4 (V = 5)
        int V = 5;
        List<Edge> edges = new ArrayList<>();

        // Add 7 graph edges
        edges.add(new Edge(3, 4, 1)); // DE = 1
        edges.add(new Edge(1, 2, 2)); // BC = 2
        edges.add(new Edge(0, 2, 3)); // AC = 3
        edges.add(new Edge(0, 1, 4)); // AB = 4
        edges.add(new Edge(1, 3, 5)); // BD = 5
        edges.add(new Edge(2, 4, 6)); // CE = 6
        edges.add(new Edge(2, 3, 7)); // CD = 7

        int mstCost = kruskalMST(V, edges);
        System.out.println("Expected MST Total Cost: " + mstCost); // Output: 11
    }
}`;

/**
 * Step-by-step dry-run traces matching the default graph (A=0, B=1, C=2, D=3, E=4)
 */
export const JAVA_DRY_RUN_STEPS = [
  {
    step: 0,
    line: 68,
    description: 'Collections.sort(edges) completes. All 7 edges are arranged in non-decreasing order of weight.',
    vars: {
      V: 5,
      edgesCount: 7,
      mstCount: 0,
      totalWeight: 0,
      edge: 'None'
    },
    parent: [0, 1, 2, 3, 4],
    rank: [0, 0, 0, 0, 0],
    focusConcept: 'sorting'
  },
  {
    step: 1,
    line: 76,
    description: 'Process Edge #1: DE (u=3, v=4, weight=1). find(3)=3, find(4)=4. Different sets! union(3, 4) executes, parent[4]=3, totalWeight = 1.',
    vars: {
      u: '3 (D)',
      v: '4 (E)',
      weight: 1,
      rootU: '3 (D)',
      rootV: '4 (E)',
      isCycle: 'false',
      mstCount: 1,
      totalWeight: 1
    },
    parent: [0, 1, 2, 3, 3],
    rank: [0, 0, 0, 1, 0],
    focusConcept: 'union'
  },
  {
    step: 2,
    line: 76,
    description: 'Process Edge #2: BC (u=1, v=2, weight=2). find(1)=1, find(2)=2. Different sets! union(1, 2) executes, parent[2]=1, totalWeight = 1 + 2 = 3.',
    vars: {
      u: '1 (B)',
      v: '2 (C)',
      weight: 2,
      rootU: '1 (B)',
      rootV: '2 (C)',
      isCycle: 'false',
      mstCount: 2,
      totalWeight: 3
    },
    parent: [0, 1, 1, 3, 3],
    rank: [0, 1, 0, 1, 0],
    focusConcept: 'union'
  },
  {
    step: 3,
    line: 76,
    description: 'Process Edge #3: AC (u=0, v=2, weight=3). find(0)=0, find(2)=1. Different sets! union(0, 1) attaches root 0 under root 1. totalWeight = 3 + 3 = 6.',
    vars: {
      u: '0 (A)',
      v: '2 (C)',
      weight: 3,
      rootU: '0 (A)',
      rootV: '1 (B)',
      isCycle: 'false',
      mstCount: 3,
      totalWeight: 6
    },
    parent: [1, 1, 1, 3, 3],
    rank: [0, 1, 0, 1, 0],
    focusConcept: 'path_compression'
  },
  {
    step: 4,
    line: 50,
    description: 'Process Edge #4: AB (u=0, v=1, weight=4). find(0)=1, find(1)=1. rootX == rootY (both have root 1)! CYCLE DETECTED! union returns false. Edge AB rejected.',
    vars: {
      u: '0 (A)',
      v: '1 (B)',
      weight: 4,
      rootU: '1 (B)',
      rootV: '1 (B)',
      isCycle: 'true (REJECT)',
      mstCount: 3,
      totalWeight: 6
    },
    parent: [1, 1, 1, 3, 3],
    rank: [0, 1, 0, 1, 0],
    focusConcept: 'cycle_detection'
  },
  {
    step: 5,
    line: 76,
    description: 'Process Edge #5: BD (u=1, v=3, weight=5). find(1)=1, find(3)=3. Different sets! union(1, 3) executes. Both rank 1 -> parent[3]=1, rank[1]=2. totalWeight = 6 + 5 = 11.',
    vars: {
      u: '1 (B)',
      v: '3 (D)',
      weight: 5,
      rootU: '1 (B)',
      rootV: '3 (D)',
      isCycle: 'false',
      mstCount: 4,
      totalWeight: 11
    },
    parent: [1, 1, 1, 1, 3],
    rank: [0, 2, 0, 1, 0],
    focusConcept: 'union_by_rank'
  },
  {
    step: 6,
    line: 82,
    description: 'V - 1 Condition Reached: mstEdges.size() == 4 (V - 1 = 5 - 1 = 4). Loop terminates via break. Remaining edges (CE 6, CD 7) are skipped.',
    vars: {
      u: 'N/A',
      v: 'N/A',
      weight: 'N/A',
      rootU: 'N/A',
      rootV: 'N/A',
      isCycle: 'N/A',
      mstCount: 4,
      totalWeight: 11
    },
    parent: [1, 1, 1, 1, 3],
    rank: [0, 2, 0, 1, 0],
    focusConcept: 'stopping_condition'
  }
];
