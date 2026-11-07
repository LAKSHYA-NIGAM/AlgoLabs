import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  CircleDot,
  GitBranch,
  Trophy,
  Check,
  X,
  ChevronRight,
} from "lucide-react";

// ─── Graph Data ───────────────────────────────────────────────

const DEMO_NODES = [
  { id: "A", x: 150, y: 60, label: "A" },
  { id: "B", x: 50, y: 180, label: "B" },
  { id: "C", x: 250, y: 180, label: "C" },
  { id: "D", x: 100, y: 310, label: "D" },
  { id: "E", x: 220, y: 310, label: "E" },
];

const DEMO_EDGES = [
  { from: "A", to: "B", weight: 4 },
  { from: "A", to: "C", weight: 2 },
  { from: "B", to: "C", weight: 5 },
  { from: "B", to: "D", weight: 10 },
  { from: "C", to: "D", weight: 3 },
  { from: "C", to: "E", weight: 7 },
  { from: "D", to: "E", weight: 1 },
];

// Spanning tree 1 (non-optimal): A-B(4), B-C(5), C-D(3), D-E(1) = 13
const SPANNING_TREE_1 = [
  { from: "A", to: "B", weight: 4 },
  { from: "B", to: "C", weight: 5 },
  { from: "C", to: "D", weight: 3 },
  { from: "D", to: "E", weight: 1 },
];

// Spanning tree 2 (MST / optimal): A-C(2), C-D(3), D-E(1), A-B(4) = 10
const MST_EDGES = [
  { from: "A", to: "C", weight: 2 },
  { from: "C", to: "D", weight: 3 },
  { from: "D", to: "E", weight: 1 },
  { from: "A", to: "B", weight: 4 },
];

const nodeMap = Object.fromEntries(DEMO_NODES.map((n) => [n.id, n]));

function edgeKey(e) {
  return `${e.from}-${e.to}`;
}

function isInSet(edge, set) {
  return set.some(
    (s) =>
      (s.from === edge.from && s.to === edge.to) ||
      (s.from === edge.to && s.to === edge.from)
  );
}

// ─── Animation Variants ───────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 14 },
  },
};

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir < 0 ? 300 : -300, opacity: 0 }),
};

// ─── SVG Graph Component ──────────────────────────────────────

function GraphSVG({
  nodes = DEMO_NODES,
  edges = DEMO_EDGES,
  highlightEdges = [],
  dimNonHighlighted = false,
  highlightColor = "#22d3ee",
  showLabels = false,
  onNodeClick,
  selectedNode,
  interactiveNodes = false,
  annotationEdge = null,
}) {
  return (
    <svg viewBox="0 0 300 380" className="w-full h-auto max-h-[360px]">
      <defs>
        <filter id="graphGlow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Edges */}
      {edges.map((edge, i) => {
        const from = nodeMap[edge.from];
        const to = nodeMap[edge.to];
        const isHighlighted = isInSet(edge, highlightEdges);
        const dimmed = dimNonHighlighted && !isHighlighted;

        return (
          <g key={edgeKey(edge)}>
            <motion.line
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={
                isHighlighted
                  ? highlightColor
                  : dimmed
                  ? "rgba(100,116,139,0.2)"
                  : "rgba(100,116,139,0.45)"
              }
              strokeWidth={isHighlighted ? 3 : 1.5}
              strokeLinecap="round"
              filter={isHighlighted ? "url(#graphGlow)" : undefined}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                pathLength: { duration: 0.5, delay: 0.3 + i * 0.08 },
                opacity: { duration: 0.2, delay: 0.3 + i * 0.08 },
              }}
            />
            {/* Weight label */}
            <motion.g
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.08, duration: 0.25 }}
            >
              <rect
                x={(from.x + to.x) / 2 - 12}
                y={(from.y + to.y) / 2 - 9}
                width={24}
                height={18}
                rx={5}
                fill={
                  isHighlighted
                    ? "rgba(34,211,238,0.15)"
                    : "rgba(15,23,42,0.85)"
                }
                stroke={
                  isHighlighted
                    ? highlightColor
                    : dimmed
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(255,255,255,0.1)"
                }
                strokeWidth={0.8}
              />
              <text
                x={(from.x + to.x) / 2}
                y={(from.y + to.y) / 2 + 3.5}
                textAnchor="middle"
                fill={
                  isHighlighted
                    ? highlightColor
                    : dimmed
                    ? "#475569"
                    : "#94a3b8"
                }
                fontSize="10"
                fontWeight="700"
                fontFamily="monospace"
              >
                {edge.weight}
              </text>
            </motion.g>
          </g>
        );
      })}

      {/* Annotation for "Edge" and "Weight" labels */}
      {showLabels && annotationEdge && (() => {
        const ae = annotationEdge;
        const from = nodeMap[ae.from];
        const to = nodeMap[ae.to];
        const mx = (from.x + to.x) / 2;
        const my = (from.y + to.y) / 2;
        return (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            {/* "Edge" label */}
            <line
              x1={mx}
              y1={my - 22}
              x2={mx}
              y2={my - 40}
              stroke="#f59e0b"
              strokeWidth={1}
              strokeDasharray="3,2"
            />
            <text
              x={mx}
              y={my - 46}
              textAnchor="middle"
              fill="#f59e0b"
              fontSize="10"
              fontWeight="600"
            >
              Edge (weight={ae.weight})
            </text>
          </motion.g>
        );
      })()}

      {/* Nodes */}
      {nodes.map((node, i) => {
        const isSelected = selectedNode === node.id;
        return (
          <motion.g
            key={node.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 14,
              delay: 0.15 + i * 0.08,
            }}
            onClick={() => onNodeClick?.(node.id)}
            className={interactiveNodes ? "cursor-pointer" : ""}
          >
            {isSelected && (
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={24}
                fill="none"
                stroke="#34d399"
                strokeWidth={2}
                initial={{ scale: 0.8, opacity: 1 }}
                animate={{ scale: 1.4, opacity: 0 }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeOut" }}
              />
            )}
            <circle
              cx={node.x}
              cy={node.y}
              r={isSelected ? 20 : 17}
              fill={
                isSelected
                  ? "rgba(52,211,153,0.15)"
                  : "rgba(34,211,238,0.08)"
              }
              stroke={isSelected ? "#34d399" : "rgba(34,211,238,0.5)"}
              strokeWidth={isSelected ? 2.5 : 1.5}
              style={{ transition: "all 0.3s ease" }}
            />
            <circle
              cx={node.x}
              cy={node.y}
              r={4}
              fill={isSelected ? "#34d399" : "#22d3ee"}
            />
            <text
              x={node.x}
              y={node.y + 32}
              textAnchor="middle"
              fill={isSelected ? "#34d399" : "#cbd5e1"}
              fontSize="13"
              fontWeight="700"
            >
              {node.label}
            </text>

            {/* "Vertex" label for showLabels on first node */}
            {showLabels && i === 0 && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
              >
                <line
                  x1={node.x + 22}
                  y1={node.y - 10}
                  x2={node.x + 50}
                  y2={node.y - 30}
                  stroke="#a78bfa"
                  strokeWidth={1}
                  strokeDasharray="3,2"
                />
                <text
                  x={node.x + 53}
                  y={node.y - 33}
                  fill="#a78bfa"
                  fontSize="10"
                  fontWeight="600"
                >
                  Vertex
                </text>
              </motion.g>
            )}
          </motion.g>
        );
      })}
    </svg>
  );
}

// ─── Sub-concept Panels ───────────────────────────────────────

function WhatIsGraph() {
  return (
    <div className="flex flex-col lg:flex-row items-center gap-8 w-full">
      <div className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
        <GraphSVG
          showLabels
          annotationEdge={DEMO_EDGES[0]}
        />
      </div>
      <div className="flex-1 space-y-4 max-w-md">
        <h3 className="text-2xl font-bold text-white">What is a Graph?</h3>
        <p className="text-gray-300 text-sm leading-relaxed">
          A <span className="text-cyan-400 font-semibold">graph</span> is a
          collection of <span className="text-purple-400 font-semibold">vertices</span>{" "}
          (nodes) connected by{" "}
          <span className="text-amber-400 font-semibold">edges</span>. Each
          edge can have a <span className="text-amber-400 font-semibold">weight</span>{" "}
          representing cost, distance, or any metric.
        </p>
        <div className="space-y-2">
          {[
            {
              term: "Vertex (Node)",
              desc: "A point in the graph — like a city",
              color: "text-purple-400",
            },
            {
              term: "Edge",
              desc: "A connection between two vertices — like a cable",
              color: "text-amber-400",
            },
            {
              term: "Weight",
              desc: "A value on an edge — like the cable's cost",
              color: "text-cyan-400",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 flex items-start gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.12 }}
            >
              <span className={`${item.color} font-semibold text-sm min-w-[100px]`}>
                {item.term}
              </span>
              <span className="text-gray-400 text-sm">{item.desc}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WhatIsSpanningTree() {
  const [showTree, setShowTree] = useState(false);

  // Spanning tree: A-B, A-C, C-D, D-E (connects all 5 nodes with 4 edges)
  const spanningTreeEdges = [
    { from: "A", to: "B", weight: 4 },
    { from: "A", to: "C", weight: 2 },
    { from: "C", to: "D", weight: 3 },
    { from: "D", to: "E", weight: 1 },
  ];

  return (
    <div className="flex flex-col lg:flex-row items-center gap-8 w-full">
      <div className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 relative">
        <GraphSVG
          highlightEdges={showTree ? spanningTreeEdges : []}
          dimNonHighlighted={showTree}
          highlightColor="#34d399"
        />
        {/* Toggle button */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <button
            onClick={() => setShowTree(!showTree)}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
              showTree
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-white/10 text-gray-300 border border-white/10 hover:border-white/20"
            }`}
          >
            {showTree ? "✓ Showing Spanning Tree" : "Reveal Spanning Tree"}
          </button>
        </div>
      </div>
      <div className="flex-1 space-y-4 max-w-md">
        <h3 className="text-2xl font-bold text-white">
          What is a Spanning Tree?
        </h3>
        <p className="text-gray-300 text-sm leading-relaxed">
          A <span className="text-emerald-400 font-semibold">spanning tree</span>{" "}
          is a subset of edges that connects{" "}
          <span className="text-white font-semibold">all vertices</span> with{" "}
          <span className="text-white font-semibold">no cycles</span>, using
          exactly <span className="text-cyan-400 font-mono">V - 1</span> edges.
        </p>
        <div className="space-y-2">
          {[
            { rule: "Connects all vertices", icon: <Check className="w-4 h-4" /> },
            { rule: "Contains no cycles", icon: <Check className="w-4 h-4" /> },
            {
              rule: "Uses exactly V - 1 edges",
              icon: <Check className="w-4 h-4" />,
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-3 text-sm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.12 }}
            >
              <span className="text-emerald-400">{item.icon}</span>
              <span className="text-gray-300">{item.rule}</span>
            </motion.div>
          ))}
        </div>
        <motion.p
          className="text-xs text-gray-500 bg-white/5 rounded-xl px-4 py-3 border border-white/5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          For a graph with <span className="text-cyan-400">5 vertices</span>, a
          spanning tree has exactly{" "}
          <span className="text-cyan-400 font-mono">4 edges</span>. Click the
          button to visualize one!
        </motion.p>
      </div>
    </div>
  );
}

function WhatIsMST() {
  const [activeTree, setActiveTree] = useState(0);
  const totalWeight1 = SPANNING_TREE_1.reduce((s, e) => s + e.weight, 0);
  const totalWeight2 = MST_EDGES.reduce((s, e) => s + e.weight, 0);

  const trees = [
    { label: "Tree A", edges: SPANNING_TREE_1, total: totalWeight1, optimal: false },
    { label: "Tree B (MST)", edges: MST_EDGES, total: totalWeight2, optimal: true },
  ];

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="flex flex-col lg:flex-row items-center gap-8 w-full">
        <div className="flex-1 space-y-4 max-w-md order-2 lg:order-1">
          <h3 className="text-2xl font-bold text-white">
            What is a{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Minimum
            </span>{" "}
            Spanning Tree?
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            Among all possible spanning trees, the{" "}
            <span className="text-cyan-400 font-semibold">
              Minimum Spanning Tree (MST)
            </span>{" "}
            has the{" "}
            <span className="text-emerald-400 font-semibold">
              smallest total edge weight
            </span>
            . It&apos;s the cheapest way to keep everything connected.
          </p>

          {/* Tree comparison cards */}
          <div className="space-y-2">
            {trees.map((tree, i) => (
              <motion.button
                key={i}
                onClick={() => setActiveTree(i)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                  activeTree === i
                    ? tree.optimal
                      ? "bg-emerald-500/10 border-emerald-500/30"
                      : "bg-amber-500/10 border-amber-500/30"
                    : "bg-white/5 border-white/10 hover:border-white/20"
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.15 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-semibold ${
                        activeTree === i
                          ? tree.optimal
                            ? "text-emerald-400"
                            : "text-amber-400"
                          : "text-gray-400"
                      }`}
                    >
                      {tree.label}
                    </span>
                    {tree.optimal && activeTree === i && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                        OPTIMAL
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Total:</span>
                    <span
                      className={`font-mono font-bold text-sm ${
                        tree.optimal ? "text-emerald-400" : "text-amber-400"
                      }`}
                    >
                      {tree.total}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1 mt-1.5">
                  {tree.edges.map((e, j) => (
                    <span
                      key={j}
                      className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                        activeTree === i
                          ? tree.optimal
                            ? "bg-emerald-500/15 text-emerald-300"
                            : "bg-amber-500/15 text-amber-300"
                          : "bg-white/5 text-gray-500"
                      }`}
                    >
                      {e.from}-{e.to}({e.weight})
                    </span>
                  ))}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Graph */}
        <div className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 order-1 lg:order-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTree}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <GraphSVG
                highlightEdges={trees[activeTree].edges}
                dimNonHighlighted
                highlightColor={
                  trees[activeTree].optimal ? "#34d399" : "#f59e0b"
                }
              />
            </motion.div>
          </AnimatePresence>
          <p className="text-center text-xs text-gray-500 mt-2">
            Click the tree cards to compare
          </p>
        </div>
      </div>

      {/* Mini quiz */}
      <MiniQuiz />
    </div>
  );
}

// ─── Mini Quiz ────────────────────────────────────────────────

function MiniQuiz() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // In the MST, leaves are nodes with degree 1.
  // MST edges: A-C, C-D, D-E, A-B → leaves are B and E
  const leafNodes = ["B", "E"];

  const handleNodeClick = useCallback(
    (nodeId) => {
      setSelectedNode(nodeId);
      if (leafNodes.includes(nodeId)) {
        setFeedback("correct");
      } else {
        setFeedback("wrong");
      }
    },
    [leafNodes]
  );

  return (
    <motion.div
      className="w-full max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-600/20 flex items-center justify-center border border-cyan-500/30">
          <Trophy className="w-4 h-4 text-cyan-400" />
        </div>
        <span className="text-sm font-semibold text-white">Quick Challenge</span>
      </div>
      <p className="text-sm text-gray-300 mb-4">
        In the MST below, click a node that is a{" "}
        <span className="text-cyan-400 font-semibold">leaf</span> (connected by
        only one edge).
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="w-full max-w-[240px]">
          <GraphSVG
            highlightEdges={MST_EDGES}
            dimNonHighlighted
            highlightColor="#34d399"
            onNodeClick={handleNodeClick}
            selectedNode={selectedNode}
            interactiveNodes
          />
        </div>
        <AnimatePresence mode="wait">
          {feedback && (
            <motion.div
              key={feedback}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`flex items-center gap-3 px-5 py-3 rounded-xl border ${
                feedback === "correct"
                  ? "bg-emerald-500/10 border-emerald-500/30"
                  : "bg-rose-500/10 border-rose-500/30"
              }`}
            >
              {feedback === "correct" ? (
                <Check className="w-5 h-5 text-emerald-400" />
              ) : (
                <X className="w-5 h-5 text-rose-400" />
              )}
              <div>
                <p
                  className={`text-sm font-semibold ${
                    feedback === "correct" ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {feedback === "correct" ? "Correct!" : "Not quite!"}
                </p>
                <p className="text-xs text-gray-400">
                  {feedback === "correct"
                    ? `Node ${selectedNode} is a leaf — it has exactly 1 edge in the MST.`
                    : `Node ${selectedNode} has more than 1 edge. Try B or E!`}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Tab definitions ──────────────────────────────────────────

const TABS = [
  {
    id: "graph",
    label: "What is a Graph?",
    icon: <CircleDot className="w-4 h-4" />,
    component: WhatIsGraph,
  },
  {
    id: "spanning",
    label: "Spanning Tree",
    icon: <GitBranch className="w-4 h-4" />,
    component: WhatIsSpanningTree,
  },
  {
    id: "mst",
    label: "Minimum ST",
    icon: <Trophy className="w-4 h-4" />,
    component: WhatIsMST,
  },
];

// ─── Main Component ───────────────────────────────────────────

export default function Foundations({ onNext, onPrev }) {
  const [activeTab, setActiveTab] = useState(0);
  const [direction, setDirection] = useState(1);

  const goToTab = (index) => {
    setDirection(index > activeTab ? 1 : -1);
    setActiveTab(index);
  };

  const ActiveComponent = TABS[activeTab].component;

  return (
    <AnimatePresence mode="wait">
      <motion.section
        key="foundations"
        className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden"
        initial="hidden"
        animate="visible"
        exit={{ opacity: 0, y: -40, transition: { duration: 0.3 } }}
        variants={containerVariants}
      >
        {/* Section indicator */}
        <motion.div
          variants={itemVariants}
          className="absolute top-6 right-6 md:top-10 md:right-10"
        >
          <span className="text-sm font-mono text-gray-500">
            <span className="text-cyan-400 font-bold">02</span> / 08
          </span>
        </motion.div>

        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8 max-w-2xl">
          <motion.span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-5"
            variants={itemVariants}
          >
            Section 02 — Foundations
          </motion.span>
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold text-white mb-3 leading-tight"
            variants={itemVariants}
          >
            Graphs &{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              MST
            </span>
          </motion.h1>
          <motion.p
            className="text-gray-400 text-sm"
            variants={itemVariants}
          >
            Master the building blocks before diving into the algorithm.
          </motion.p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 mb-8"
        >
          {TABS.map((tab, i) => (
            <button
              key={tab.id}
              onClick={() => goToTab(i)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === i
                  ? "bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-400 border border-cyan-500/20"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
              {i < activeTab && (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              )}
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <motion.div
          variants={itemVariants}
          className="w-full max-w-5xl"
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeTab}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            >
              <ActiveComponent />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Stepper progress */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-2 mt-8"
        >
          {TABS.map((_, i) => (
            <button
              key={i}
              onClick={() => goToTab(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === activeTab
                  ? "w-8 bg-cyan-400"
                  : i < activeTab
                  ? "w-4 bg-emerald-400/50"
                  : "w-4 bg-white/10"
              }`}
            />
          ))}
        </motion.div>

        {/* Navigation */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-4 mt-8"
        >
          {onPrev && (
            <button
              onClick={onPrev}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-gray-400 border border-white/10 hover:border-white/20 hover:text-white transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}
          {activeTab < TABS.length - 1 ? (
            <button
              onClick={() => goToTab(activeTab + 1)}
              className="group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl px-8 py-3 font-semibold text-white transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40"
            >
              Next Concept
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <button
              onClick={onNext}
              className="group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl px-8 py-3 font-semibold text-white transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40"
            >
              Continue
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </motion.div>
      </motion.section>
    </AnimatePresence>
  );
}
