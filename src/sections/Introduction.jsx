import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Network, Zap, TrendingDown, Cable } from "lucide-react";

const CITIES = [
  { id: "mumbai", label: "Mumbai", x: 100, y: 200 },
  { id: "delhi", label: "Delhi", x: 300, y: 80 },
  { id: "bangalore", label: "Bangalore", x: 150, y: 380 },
  { id: "chennai", label: "Chennai", x: 350, y: 350 },
  { id: "kolkata", label: "Kolkata", x: 450, y: 150 },
  { id: "hyderabad", label: "Hyderabad", x: 280, y: 250 },
];

const EDGES = [
  { from: "mumbai", to: "delhi", weight: 14 },
  { from: "mumbai", to: "bangalore", weight: 8 },
  { from: "delhi", to: "kolkata", weight: 7 },
  { from: "bangalore", to: "chennai", weight: 4 },
  { from: "bangalore", to: "hyderabad", weight: 6 },
  { from: "chennai", to: "hyderabad", weight: 3 },
  { from: "delhi", to: "hyderabad", weight: 9 },
  { from: "kolkata", to: "hyderabad", weight: 10 },
  { from: "mumbai", to: "hyderabad", weight: 11 },
];

const cityMap = Object.fromEntries(CITIES.map((c) => [c.id, c]));

function getEdgeCoords(edge) {
  const from = cityMap[edge.from];
  const to = cityMap[edge.to];
  return { x1: from.x, y1: from.y, x2: to.x, y2: to.y };
}

function getMidpoint(edge) {
  const { x1, y1, x2, y2 } = getEdgeCoords(edge);
  return { mx: (x1 + x2) / 2, my: (y1 + y2) / 2 };
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 14 },
  },
};

const edgeVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: {
        type: "spring",
        stiffness: 40,
        damping: 20,
        delay: 0.8 + i * 0.25,
      },
      opacity: { duration: 0.3, delay: 0.8 + i * 0.25 },
    },
  }),
};

const nodeVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: (i) => ({
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
      delay: 0.3 + i * 0.1,
    },
  }),
};

const weightVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      delay: 1.1 + i * 0.25,
    },
  }),
};

function CityGraph() {
  const [hoveredEdge, setHoveredEdge] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);

  return (
    <motion.div
      className="relative w-full max-w-[580px] mx-auto"
      initial="hidden"
      animate="visible"
    >
      <svg viewBox="0 0 560 460" className="w-full h-auto">
        {/* Glow filter */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="nodeGlow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Edges */}
        {EDGES.map((edge, i) => {
          const { x1, y1, x2, y2 } = getEdgeCoords(edge);
          const isHovered = hoveredEdge === i;
          return (
            <g key={`edge-${i}`}>
              <motion.line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isHovered ? "#22d3ee" : "url(#edgeGrad)"}
                strokeWidth={isHovered ? 3 : 1.5}
                strokeLinecap="round"
                filter={isHovered ? "url(#glow)" : undefined}
                custom={i}
                variants={edgeVariants}
                onMouseEnter={() => setHoveredEdge(i)}
                onMouseLeave={() => setHoveredEdge(null)}
                className="cursor-pointer"
              />
            </g>
          );
        })}

        {/* Weight labels */}
        {EDGES.map((edge, i) => {
          const { mx, my } = getMidpoint(edge);
          const isHovered = hoveredEdge === i;
          return (
            <motion.g
              key={`weight-${i}`}
              custom={i}
              variants={weightVariants}
              onMouseEnter={() => setHoveredEdge(i)}
              onMouseLeave={() => setHoveredEdge(null)}
              className="cursor-pointer"
            >
              <rect
                x={mx - 14}
                y={my - 10}
                width={28}
                height={20}
                rx={6}
                fill={isHovered ? "rgba(34,211,238,0.25)" : "rgba(15,23,42,0.8)"}
                stroke={isHovered ? "#22d3ee" : "rgba(255,255,255,0.15)"}
                strokeWidth={1}
              />
              <text
                x={mx}
                y={my + 4}
                textAnchor="middle"
                fill={isHovered ? "#22d3ee" : "#94a3b8"}
                fontSize="11"
                fontWeight="600"
                fontFamily="monospace"
              >
                {edge.weight}
              </text>
            </motion.g>
          );
        })}

        {/* City nodes */}
        {CITIES.map((city, i) => {
          const isHovered = hoveredNode === city.id;
          return (
            <motion.g
              key={city.id}
              custom={i}
              variants={nodeVariants}
              onMouseEnter={() => setHoveredNode(city.id)}
              onMouseLeave={() => setHoveredNode(null)}
              className="cursor-pointer"
            >
              {/* Outer pulse ring */}
              {isHovered && (
                <motion.circle
                  cx={city.x}
                  cy={city.y}
                  r={28}
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth={1}
                  initial={{ scale: 0.8, opacity: 0.8 }}
                  animate={{ scale: 1.3, opacity: 0 }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
              )}
              {/* Glow circle */}
              <circle
                cx={city.x}
                cy={city.y}
                r={isHovered ? 22 : 18}
                fill={
                  isHovered
                    ? "rgba(34,211,238,0.15)"
                    : "rgba(34,211,238,0.05)"
                }
                stroke={isHovered ? "#22d3ee" : "rgba(34,211,238,0.4)"}
                strokeWidth={isHovered ? 2.5 : 1.5}
                filter={isHovered ? "url(#nodeGlow)" : undefined}
                style={{ transition: "all 0.3s ease" }}
              />
              {/* Inner dot */}
              <circle
                cx={city.x}
                cy={city.y}
                r={5}
                fill="#22d3ee"
                style={{ transition: "all 0.3s ease" }}
              />
              {/* City label */}
              <text
                x={city.x}
                y={city.y + 34}
                textAnchor="middle"
                fill={isHovered ? "#f1f5f9" : "#cbd5e1"}
                fontSize="12"
                fontWeight="600"
              >
                {city.label}
              </text>
            </motion.g>
          );
        })}
      </svg>
    </motion.div>
  );
}

function WhyKruskalCard() {
  const reasons = [
    {
      icon: <TrendingDown className="w-5 h-5" />,
      title: "Optimal Cost",
      desc: "Guarantees the minimum total connection cost",
    },
    {
      icon: <Network className="w-5 h-5" />,
      title: "Full Connectivity",
      desc: "Ensures every city is reachable from any other",
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Efficient",
      desc: "Runs in O(E log E) time with DSU optimization",
    },
  ];

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 max-w-md w-full"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-600/20 flex items-center justify-center border border-cyan-500/30">
          <Cable className="w-5 h-5 text-cyan-400" />
        </div>
        <h3 className="text-lg font-bold text-white">
          Why Kruskal&apos;s Algorithm?
        </h3>
      </div>
      <div className="space-y-3">
        {reasons.map((r, i) => (
          <motion.div
            key={i}
            className="flex items-start gap-3 group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.8 + i * 0.15, type: "spring", stiffness: 100 }}
          >
            <div className="mt-0.5 text-cyan-400 group-hover:text-emerald-400 transition-colors">
              {r.icon}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{r.title}</p>
              <p className="text-xs text-gray-400">{r.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default function Introduction({ onNext, onPrev }) {
  return (
    <AnimatePresence mode="wait">
      <motion.section
        key="introduction"
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
            <span className="text-cyan-400 font-bold">01</span> / 08
          </span>
        </motion.div>

        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-10 max-w-2xl">
          <motion.span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-5"
            variants={itemVariants}
          >
            Section 01 — Introduction
          </motion.span>
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight"
            variants={itemVariants}
          >
            The{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Problem
            </span>
          </motion.h1>
          <motion.p
            className="text-gray-300 text-base md:text-lg leading-relaxed"
            variants={itemVariants}
          >
            Imagine you&apos;re a network engineer connecting cities with fiber
            optic cables. Each cable has a cost. You need to connect{" "}
            <span className="text-cyan-400 font-semibold">ALL</span> cities
            with the{" "}
            <span className="text-emerald-400 font-semibold">MINIMUM</span>{" "}
            total cost.
          </motion.p>
        </motion.div>

        {/* Main content row */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col lg:flex-row items-center gap-8 w-full max-w-5xl"
        >
          {/* Graph visualization */}
          <div className="flex-1 w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="ml-2 text-xs text-gray-500 font-mono">
                network_topology.svg
              </span>
            </div>
            <CityGraph />
            <p className="text-center text-xs text-gray-500 mt-3">
              Hover over nodes and edges to explore the network
            </p>
          </div>

          {/* Why Kruskal card */}
          <div className="flex flex-col gap-5 items-center lg:items-start">
            <WhyKruskalCard />

            {/* Cost callout */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 max-w-md w-full"
            >
              <p className="text-sm text-gray-300 leading-relaxed">
                With <span className="text-cyan-400 font-semibold">6 cities</span> and{" "}
                <span className="text-cyan-400 font-semibold">9 possible cables</span>,
                finding the cheapest network by brute force means checking{" "}
                <span className="text-amber-400 font-mono font-bold">thousands</span> of
                combinations. Kruskal&apos;s solves it elegantly.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-4 mt-12"
        >
          {onPrev && (
            <button
              onClick={onPrev}
              className="px-6 py-3 rounded-xl font-semibold text-gray-400 border border-white/10 hover:border-white/20 hover:text-white transition-all"
            >
              ← Back
            </button>
          )}
          <button
            onClick={onNext}
            className="group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl px-8 py-3 font-semibold text-white transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40"
          >
            Begin Journey
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </motion.section>
    </AnimatePresence>
  );
}
