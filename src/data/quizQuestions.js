export const QUIZ_QUESTIONS = [
  {
    id: 1,
    concept: 'spanning_tree',
    conceptLabel: 'Spanning Tree Properties',
    question: 'What defines a Spanning Tree of an undirected, connected graph G = (V, E)?',
    options: [
      { id: 'A', text: 'A subgraph containing all vertices that forms a tree (connected with no cycles)' },
      { id: 'B', text: 'A subgraph containing all edges with the shortest path between every pair' },
      { id: 'C', text: 'A subgraph having the minimum number of vertices with maximum edge weights' },
      { id: 'D', text: 'Any bipartite subgraph of G that contains no odd cycles' }
    ],
    correctAnswer: 'A',
    explanation: 'A spanning tree is a subgraph that includes ALL vertices of the original graph and connects them without forming any cycles (i.e., it is a tree spanning all vertices).',
    wrongExplanations: {
      B: 'Shortest paths between all pairs is computed by Dijkstra or Floyd-Warshall; a spanning tree minimizes total tree weight, not pairwise shortest paths.',
      C: 'A spanning tree must contain ALL original vertices (V vertices), not a minimum subset of vertices.',
      D: 'Bipartiteness is unrelated to the definition of a spanning tree.'
    }
  },
  {
    id: 2,
    concept: 'edge_count',
    conceptLabel: 'V - 1 Edges Condition',
    question: 'How many edges does a Minimum Spanning Tree contain for a connected graph with V vertices?',
    options: [
      { id: 'A', text: 'V edges' },
      { id: 'B', text: 'V - 1 edges' },
      { id: 'C', text: 'V * (V - 1) / 2 edges' },
      { id: 'D', text: 'E - V + 1 edges' }
    ],
    correctAnswer: 'B',
    explanation: 'Any tree with V vertices has exactly V - 1 edges. Adding any edge introduces a cycle; removing any edge disconnects the graph.',
    wrongExplanations: {
      A: 'A graph with V vertices and V edges must contain at least one cycle.',
      C: 'V*(V-1)/2 is the maximum number of edges in a complete undirected simple graph K_V, not a tree.',
      D: 'E - V + 1 is the cyclomatic complexity (number of independent cycles) of a connected graph, not the number of tree edges.'
    }
  },
  {
    id: 3,
    concept: 'sorting_greedy',
    conceptLabel: 'Greedy Edge Sorting',
    question: 'Why does Kruskal\'s algorithm sort all edges in non-decreasing order of weight at the start?',
    options: [
      { id: 'A', text: 'To ensure all leaf vertices are processed first' },
      { id: 'B', text: 'To guarantee the greedy choice property by greedily picking the smallest available edge that connects distinct components' },
      { id: 'C', text: 'To allow binary search during cycle detection' },
      { id: 'D', text: 'Because DSU only accepts sorted inputs' }
    ],
    correctAnswer: 'B',
    explanation: 'Kruskal\'s uses the cut property and greedy strategy: by considering edges from lightest to heaviest, adding an edge between distinct components is guaranteed to be safe and part of an optimal MST.',
    wrongExplanations: {
      A: 'Kruskal\'s operates on edges globally regardless of node degree or leaf status.',
      C: 'Cycle detection is executed in nearly O(1) time using Disjoint Set Union (DSU), not binary search.',
      D: 'DSU functions identically with arbitrary input sequences; sorting is solely for the greedy algorithmic strategy.'
    }
  },
  {
    id: 4,
    concept: 'find_path_compression',
    conceptLabel: 'Find & Path Compression',
    question: 'What does Path Compression accomplish during the Find(x) operation in DSU?',
    options: [
      { id: 'A', text: 'It sorts the elements in the set numerically' },
      { id: 'B', text: 'It flattens the tree structure by pointing visited nodes directly to the root representative' },
      { id: 'C', text: 'It removes duplicate nodes from the disjoint set' },
      { id: 'D', text: 'It reduces the total number of sets in the forest' }
    ],
    correctAnswer: 'B',
    explanation: 'Path compression updates parent[x] = find(parent[x]) during recursion, flattening the tree so that subsequent find operations take nearly O(1) time.',
    wrongExplanations: {
      A: 'DSU structures maintain component partitions, not sorted keys.',
      C: 'Vertices in DSU are fixed and unique; no vertices are ever removed or duplicated.',
      D: 'The Union operation reduces the number of sets, not the Find operation.'
    }
  },
  {
    id: 5,
    concept: 'cycle_detection',
    conceptLabel: 'Cycle Detection & Rejection',
    question: 'When Kruskal\'s evaluates edge (u, v), under what exact condition must the edge be REJECTED?',
    options: [
      { id: 'A', text: 'When weight(u, v) is greater than the average edge weight' },
      { id: 'B', text: 'When Find(u) == Find(v), meaning u and v already belong to the same connected component' },
      { id: 'C', text: 'When the degree of vertex u or vertex v exceeds 2' },
      { id: 'D', text: 'When both u and v have rank 0 in DSU' }
    ],
    correctAnswer: 'B',
    explanation: 'If Find(u) equals Find(v), both endpoints already share a path in the current forest. Adding (u, v) would close a loop, creating a cycle. Hence, it must be rejected.',
    wrongExplanations: {
      A: 'Kruskal\'s accepts edges strictly based on cycle avoidance, not by comparison to any threshold weight.',
      C: 'MST vertices can have arbitrary degree (up to V-1, as in a star graph).',
      D: 'Two vertices of rank 0 in separate single-element sets are prime candidates to be united.'
    }
  },
  {
    id: 6,
    concept: 'union_by_rank',
    conceptLabel: 'Union by Rank',
    question: 'In Disjoint Set Union, what is the core purpose of "Union by Rank"?',
    options: [
      { id: 'A', text: 'To attach the root of the tree with smaller rank/height under the root of the tree with larger rank' },
      { id: 'B', text: 'To ensure all edge weights are positive integers' },
      { id: 'C', text: 'To count how many edges have been inspected so far' },
      { id: 'D', text: 'To randomize tree attachments for Monte Carlo guarantees' }
    ],
    correctAnswer: 'A',
    explanation: 'Union by rank keeps trees shallow by attaching shorter trees to taller trees, bounding the maximum tree height to O(log V) even without path compression.',
    wrongExplanations: {
      A: '',
      B: 'DSU operates on abstract partition sets and knows nothing about edge weights.',
      C: 'Rank measures tree depth upper bounds, not edge counters.',
      D: 'Union by rank is deterministic; randomized linking is known as randomized union-find.'
    }
  },
  {
    id: 7,
    concept: 'time_complexity',
    conceptLabel: 'Time Complexity Analysis',
    question: 'What is the overall time complexity of Kruskal\'s algorithm for a graph with V vertices and E edges?',
    options: [
      { id: 'A', text: 'O(V²)' },
      { id: 'B', text: 'O(E log E) or O(E log V)' },
      { id: 'C', text: 'O(V + E)' },
      { id: 'D', text: 'O(E² log V)' }
    ],
    correctAnswer: 'B',
    explanation: 'Sorting E edges takes O(E log E). Since E <= V², log E <= 2 log V, making O(E log E) = O(E log V). The DSU operations take O(E · α(V)), which is strictly dominated by sorting.',
    wrongExplanations: {
      A: 'O(V²) is typical of standard adjacency-matrix Prim\'s, not Kruskal\'s.',
      C: 'O(V + E) would require linear time sorting (e.g. counting sort for small bounded integer weights), but general comparison sorting requires O(E log E).',
      D: 'O(E² log V) is unnecessarily large; Kruskal only sorts edges once.'
    }
  },
  {
    id: 8,
    concept: 'space_complexity',
    conceptLabel: 'Auxiliary Space & Inverse Ackermann',
    question: 'What is the auxiliary space complexity of Kruskal\'s DSU, and what is the amortized cost per DSU operation with both optimizations?',
    options: [
      { id: 'A', text: 'Space: O(V) for parent and rank arrays; Amortized time per op: O(α(V))' },
      { id: 'B', text: 'Space: O(E²) for adjacency matrix; Amortized time per op: O(log V)' },
      { id: 'C', text: 'Space: O(1); Amortized time per op: O(V)' },
      { id: 'D', text: 'Space: O(V!); Amortized time per op: O(1)' }
    ],
    correctAnswer: 'A',
    explanation: 'DSU stores two arrays of size V (parent and rank), consuming O(V) auxiliary space. With both path compression and union by rank, each operation executes in amortized O(α(V)) time, where α is the extremely slow-growing Inverse Ackermann function (α(N) ≤ 4 for all practical universe-scale numbers).',
    wrongExplanations: {
      B: 'DSU does not require an adjacency matrix; it only requires size V arrays.',
      C: 'DSU cannot be implemented with O(1) space as it must track representatives for all V elements.',
      D: 'O(V!) is factorial space, completely incorrect for DSU.'
    }
  }
];
