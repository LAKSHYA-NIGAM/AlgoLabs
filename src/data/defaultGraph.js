export const DEFAULT_VERTICES = [
  { id: 'A', label: 'A', x: 260, y: 70 },
  { id: 'B', label: 'B', x: 440, y: 160 },
  { id: 'C', label: 'C', x: 130, y: 200 },
  { id: 'D', label: 'D', x: 390, y: 350 },
  { id: 'E', label: 'E', x: 170, y: 360 },
];

export const DEFAULT_EDGES = [
  { id: 'DE', u: 'D', v: 'E', weight: 1 },
  { id: 'BC', u: 'B', v: 'C', weight: 2 },
  { id: 'AC', u: 'A', v: 'C', weight: 3 },
  { id: 'AB', u: 'A', v: 'B', weight: 4 },
  { id: 'BD', u: 'B', v: 'D', weight: 5 },
  { id: 'CE', u: 'C', v: 'E', weight: 6 },
  { id: 'CD', u: 'C', v: 'D', weight: 7 },
];

export const GRAPH_PRESETS = [
  {
    id: 'default',
    name: 'Default 5-Node Graph (Cost 11)',
    description: 'Standard curriculum graph featuring cycles, path compression, and union by rank.',
    vertices: DEFAULT_VERTICES,
    edges: DEFAULT_EDGES,
    expectedCost: 11,
    expectedEdges: ['DE', 'BC', 'AC', 'BD']
  },
  {
    id: 'disconnected',
    name: 'Disconnected Graph (Forest)',
    description: 'Two separate components (A-B-C and D-E). Demonstrates Minimum Spanning Forest.',
    vertices: DEFAULT_VERTICES,
    edges: [
      { id: 'AB', u: 'A', v: 'B', weight: 3 },
      { id: 'BC', u: 'B', v: 'C', weight: 2 },
      { id: 'AC', u: 'A', v: 'C', weight: 5 },
      { id: 'DE', u: 'D', v: 'E', weight: 4 },
    ],
    expectedCost: 9,
    isForest: true
  },
  {
    id: 'equal_weights',
    name: 'Equal Edge Weights',
    description: 'Multiple edges with equal weight. Tests deterministic tie-breaking.',
    vertices: [
      { id: 'A', label: 'A', x: 200, y: 100 },
      { id: 'B', label: 'B', x: 400, y: 100 },
      { id: 'C', label: 'C', x: 400, y: 300 },
      { id: 'D', label: 'D', x: 200, y: 300 },
    ],
    edges: [
      { id: 'AB', u: 'A', v: 'B', weight: 2 },
      { id: 'BC', u: 'B', v: 'C', weight: 2 },
      { id: 'CD', u: 'C', v: 'D', weight: 2 },
      { id: 'DA', u: 'D', v: 'A', weight: 2 },
      { id: 'AC', u: 'A', v: 'C', weight: 3 },
    ],
    expectedCost: 6,
    expectedEdges: ['AB', 'BC', 'CD']
  },
  {
    id: 'triangle_cycle',
    name: 'Triangle Cycle',
    description: 'Simple 3-node graph showing earliest cycle detection.',
    vertices: [
      { id: 'A', label: 'A', x: 280, y: 80 },
      { id: 'B', label: 'B', x: 420, y: 300 },
      { id: 'C', label: 'C', x: 140, y: 300 },
    ],
    edges: [
      { id: 'AB', u: 'A', v: 'B', weight: 4 },
      { id: 'BC', u: 'B', v: 'C', weight: 2 },
      { id: 'CA', u: 'C', v: 'A', weight: 5 },
    ],
    expectedCost: 6,
    expectedEdges: ['BC', 'AB']
  }
];
