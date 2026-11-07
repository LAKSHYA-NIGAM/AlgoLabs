import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Zap,
  CheckCircle2,
  XCircle,
} from "lucide-react";

/* ───────── Graph data ───────── */
const NODES = [
  { id: "A", x: 300, y: 80 },
  { id: "B", x: 480, y: 180 },
  { id: "C", x: 480, y: 340 },
  { id: "D", x: 300, y: 440 },
  { id: "E", x: 120, y: 340 },
  { id: "F", x: 120, y: 180 },
];

const EDGES_SORTED = [
  { from: "E", to: "F", weight: 1 },
  { from: "A", to: "B", weight: 2 },
  { from: "C", to: "D", weight: 2 },
  { from: "B", to: "C", weight: 3 },
  { from: "D", to: "E", weight: 3 },
  { from: "A", to: "F", weight: 4 },
  { from: "B", to: "F", weight: 5 },
  { from: "C", to: "E", weight: 6 },
  { from: "B", to: "D", weight: 7 },
];

const NODE_ID_MAP = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5 };
const SET_COLORS = [
  "#22d3ee",
  "#a78bfa",
  "#f472b6",
  "#34d399",
  "#fbbf24",
  "#fb923c",
];

/* ───────── DSU helpers ───────── */
const initDSU = () => ({
  parent: [0, 1, 2, 3, 4, 5],
  rank: [0, 0, 0, 0, 0, 0],
});

const dsuFind = (p, x) => {
  while (p[x] !== x) x = p[x];
  return x;
};

const dsuUnion = (parent, rank, a, b) => {
  const p = [...parent];
  const r = [...rank];
  let rA = dsuFind(p, a);
  let rB = dsuFind(p, b);
  if (rA === rB) return { parent: p, rank: r, merged: false };
  if (r[rA] < r[rB]) [rA, rB] = [rB, rA];
  p[rB] = rA;
  if (r[rA] === r[rB]) r[rA]++;
  // path compression
  for (let i = 0; i < p.length; i++) p[i] = dsuFind(p, i);
  return { parent: p, rank: r, merged: true };
};

/* ───────── Pre-compute all steps ───────── */
function computeSteps() {
  const steps = [];
  let dsu = initDSU();
  const mstEdges = [];
  let mstWeight = 0;

  // Step 0: initial state — show sorted edges
  steps.push({
    type: "init",
    message: "All edges sorted by weight. Ready to begin Kruskal's algorithm.",
    edgeIndex: -1,
    edgeStates: EDGES_SORTED.map(() => "default"),
    dsu: { ...dsu },
    mstEdges: [],
    mstWeight: 0,
  });

  EDGES_SORTED.forEach((edge, i) => {
    const a = NODE_ID_MAP[edge.from];
    const b = NODE_ID_MAP[edge.to];
    const rootA = dsuFind(dsu.parent, a);
    const rootB = dsuFind(dsu.parent, b);
    const sameSet = rootA === rootB;

    // Build edge states up to this point
    const edgeStates = [...(steps[steps.length - 1].edgeStates)];
    edgeStates[i] = "considering";

    // Considering step
    steps.push({
      type: "considering",
      message: `Considering edge ${edge.from}-${edge.to} (weight ${edge.weight}). Checking if ${edge.from} and ${edge.to} are in the same set...`,
      edgeIndex: i,
      edgeStates: [...edgeStates],
      dsu: { parent: [...dsu.parent], rank: [...dsu.rank] },
      mstEdges: [...mstEdges],
      mstWeight,
    });

    if (!sameSet) {
      // Accept
      const result = dsuUnion(dsu.parent, dsu.rank, a, b);
      dsu = { parent: result.parent, rank: result.rank };
      mstEdges.push(i);
      mstWeight += edge.weight;

      const acceptStates = [...edgeStates];
      acceptStates[i] = "accepted";

      steps.push({
        type: "accepted",
        message: `✓ Edge ${edge.from}-${edge.to} (weight ${edge.weight}) ACCEPTED — different sets merged!`,
        edgeIndex: i,
        edgeStates: acceptStates,
        dsu: { parent: [...dsu.parent], rank: [...dsu.rank] },
        mstEdges: [...mstEdges],
        mstWeight,
      });
    } else {
      // Reject
      const rejectStates = [...edgeStates];
      rejectStates[i] = "rejected";

      steps.push({
        type: "rejected",
        message: `✗ Edge ${edge.from}-${edge.to} (weight ${edge.weight}) REJECTED — would create a cycle!`,
        edgeIndex: i,
        edgeStates: rejectStates,
        dsu: { parent: [...dsu.parent], rank: [...dsu.rank] },
        mstEdges: [...mstEdges],
        mstWeight,
      });
    }
  });

  // Final step
  steps.push({
    type: "done",
    message: `MST complete! Total weight = ${mstWeight}. The minimum spanning tree uses ${mstEdges.length} edges.`,
    edgeIndex: -1,
    edgeStates: steps[steps.length - 1].edgeStates,
    dsu: { parent: [...dsu.parent], rank: [...dsu.rank] },
    mstEdges: [...mstEdges],
    mstWeight,
  });

  return steps;
}

const ALL_STEPS = computeSteps();

/* ───────── helpers for rendering ───────── */
const getNodePos = (id) => NODES.find((n) => n.id === id);

const getSetColorForNode = (nodeId, parentArr) => {
  const idx = NODE_ID_MAP[nodeId];
  const root = dsuFind(parentArr, idx);
  return SET_COLORS[root % SET_COLORS.length];
};

/* ───────── Edge component ───────── */
function GraphEdge({ edge, state, index }) {
  const from = getNodePos(edge.from);
  const to = getNodePos(edge.to);
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;

  // Offset weight label to avoid overlap with line
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const offsetX = (-dy / len) * 16;
  const offsetY = (dx / len) * 16;

  let strokeColor = "#475569";
  let strokeWidth = 2;
  let opacity = 1;
  let dashArray = "none";
  let glowFilter = "";

  switch (state) {
    case "considering":
      strokeColor = "#fbbf24";
      strokeWidth = 3;
      break;
    case "accepted":
      strokeColor = "#34d399";
      strokeWidth = 3.5;
      glowFilter = "url(#greenGlow)";
      break;
    case "rejected":
      strokeColor = "#64748b";
      strokeWidth = 1.5;
      dashArray = "6 4";
      opacity = 0.4;
      break;
    default:
      strokeColor = "#64748b";
      break;
  }

  return (
    <g>
      <motion.line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={dashArray}
        opacity={opacity}
        filter={glowFilter}
        animate={{
          stroke: strokeColor,
          strokeWidth,
          opacity,
        }}
        transition={{ duration: 0.4 }}
      />
      {state === "considering" && (
        <motion.line
          x1={from.x}
          y1={from.y}
          x2={to.x}
          y2={to.y}
          stroke="#fbbf24"
          strokeWidth={6}
          opacity={0.2}
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
      {/* weight label */}
      <g transform={`translate(${mx + offsetX}, ${my + offsetY})`}>
        <rect
          x={-12}
          y={-10}
          width={24}
          height={20}
          rx={6}
          fill={
            state === "accepted"
              ? "#065f46"
              : state === "considering"
              ? "#78350f"
              : "#1e293b"
          }
          stroke={
            state === "accepted"
              ? "#34d399"
              : state === "considering"
              ? "#fbbf24"
              : "#475569"
          }
          strokeWidth={1}
          opacity={state === "rejected" ? 0.3 : 0.9}
        />
        <text
          textAnchor="middle"
          y={5}
          fill={
            state === "accepted"
              ? "#34d399"
              : state === "considering"
              ? "#fbbf24"
              : "#94a3b8"
          }
          fontSize={12}
          fontWeight="bold"
          opacity={state === "rejected" ? 0.3 : 1}
        >
          {edge.weight}
        </text>
      </g>
    </g>
  );
}

/* ───────── Node component ───────── */
function GraphNode({ node, color }) {
  return (
    <motion.g
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
    >
      {/* glow ring */}
      <circle
        cx={node.x}
        cy={node.y}
        r={28}
        fill={color}
        opacity={0.15}
      />
      <motion.circle
        cx={node.x}
        cy={node.y}
        r={22}
        fill={color}
        fillOpacity={0.25}
        stroke={color}
        strokeWidth={2.5}
        animate={{ fill: color + "40", stroke: color }}
        transition={{ duration: 0.5 }}
      />
      <text
        x={node.x}
        y={node.y + 5}
        textAnchor="middle"
        fill="white"
        fontSize={15}
        fontWeight="bold"
      >
        {node.id}
      </text>
    </motion.g>
  );
}

/* ═══════════════════  MAIN COMPONENT  ═══════════════════ */
export default function KruskalSimulation({ onNext, onPrev }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const autoRef = useRef(null);

  const step = ALL_STEPS[currentStep];

  // Auto-play
  useEffect(() => {
    if (autoPlay) {
      autoRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= ALL_STEPS.length - 1) {
            setAutoPlay(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1500);
    }
    return () => clearInterval(autoRef.current);
  }, [autoPlay]);

  const handlePrev = () => {
    setAutoPlay(false);
    setCurrentStep((p) => Math.max(0, p - 1));
  };

  const handleNext = () => {
    setAutoPlay(false);
    setCurrentStep((p) => Math.min(ALL_STEPS.length - 1, p + 1));
  };

  const handleReset = () => {
    setAutoPlay(false);
    setCurrentStep(0);
  };

  const toggleAutoPlay = () => setAutoPlay((p) => !p);

  /* collect current sets for the DSU panel */
  const getSets = () => {
    const sets = {};
    step.dsu.parent.forEach((_, i) => {
      const root = dsuFind(step.dsu.parent, i);
      if (!sets[root]) sets[root] = [];
      sets[root].push(i);
    });
    return sets;
  };
  const currentSets = getSets();
  const nodeNames = ["A", "B", "C", "D", "E", "F"];

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative">
      {/* section indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute top-6 right-6 text-gray-600 text-sm font-mono"
      >
        04 / 08
      </motion.div>

      {/* header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-sm font-semibold mb-4">
          <Zap className="w-4 h-4" />
          Section 04 — Interactive
        </div>
        <h2 className="text-3xl md:text-5xl font-bold text-white">
          Kruskal's{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Simulation
          </span>
        </h2>
      </motion.div>

      {/* main content grid */}
      <div className="w-full max-w-7xl grid lg:grid-cols-5 gap-6">
        {/* ─── LEFT: SVG Graph ─── */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4"
        >
          <svg viewBox="0 0 600 520" className="w-full">
            <defs>
              <filter id="greenGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* edges */}
            {EDGES_SORTED.map((edge, i) => (
              <GraphEdge
                key={`${edge.from}-${edge.to}`}
                edge={edge}
                state={step.edgeStates[i]}
                index={i}
              />
            ))}

            {/* nodes */}
            {NODES.map((node) => (
              <GraphNode
                key={node.id}
                node={node}
                color={getSetColorForNode(node.id, step.dsu.parent)}
              />
            ))}
          </svg>
        </motion.div>

        {/* ─── RIGHT: Info panels ─── */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 flex flex-col gap-4"
        >
          {/* Status message */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-2xl border backdrop-blur-xl ${
                step.type === "accepted"
                  ? "bg-emerald-400/10 border-emerald-400/20"
                  : step.type === "rejected"
                  ? "bg-rose-400/10 border-rose-400/20"
                  : step.type === "considering"
                  ? "bg-amber-400/10 border-amber-400/20"
                  : step.type === "done"
                  ? "bg-cyan-400/10 border-cyan-400/20"
                  : "bg-white/5 border-white/10"
              }`}
            >
              <div className="flex items-start gap-2">
                {step.type === "accepted" && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                )}
                {step.type === "rejected" && (
                  <XCircle className="w-5 h-5 text-rose-400 mt-0.5 shrink-0" />
                )}
                <p
                  className={`text-sm font-medium ${
                    step.type === "accepted"
                      ? "text-emerald-300"
                      : step.type === "rejected"
                      ? "text-rose-300"
                      : step.type === "considering"
                      ? "text-amber-300"
                      : "text-gray-300"
                  }`}
                >
                  {step.message}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Sorted edge list */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex-1 overflow-auto">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-3">
              Sorted Edges
            </p>
            <div className="space-y-1.5">
              {EDGES_SORTED.map((edge, i) => {
                const st = step.edgeStates[i];
                return (
                  <motion.div
                    key={i}
                    layout
                    className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-sm transition-all ${
                      st === "considering"
                        ? "bg-amber-400/15 border border-amber-400/30"
                        : st === "accepted"
                        ? "bg-emerald-400/10 border border-emerald-400/20"
                        : st === "rejected"
                        ? "bg-white/[0.02] border border-white/5 opacity-40"
                        : "bg-white/[0.03] border border-transparent"
                    }`}
                  >
                    <span
                      className={`font-mono ${
                        st === "considering"
                          ? "text-amber-400"
                          : st === "accepted"
                          ? "text-emerald-400"
                          : st === "rejected"
                          ? "text-gray-600 line-through"
                          : "text-gray-400"
                      }`}
                    >
                      {edge.from}—{edge.to}
                    </span>
                    <span
                      className={`font-bold ${
                        st === "considering"
                          ? "text-amber-400"
                          : st === "accepted"
                          ? "text-emerald-400"
                          : st === "rejected"
                          ? "text-gray-600"
                          : "text-gray-500"
                      }`}
                    >
                      {edge.weight}
                    </span>
                    {st === "accepted" && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                    {st === "rejected" && (
                      <XCircle className="w-4 h-4 text-gray-600" />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* DSU state */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-3">
              DSU Sets
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(currentSets).map(([root, members]) => (
                <motion.div
                  key={root + "-" + members.join("")}
                  layout
                  className="px-3 py-1.5 rounded-xl border flex items-center gap-1.5"
                  style={{
                    borderColor: SET_COLORS[root] + "60",
                    backgroundColor: SET_COLORS[root] + "15",
                  }}
                >
                  <span className="text-gray-500 text-xs">{"{"}</span>
                  {members.map((m, mi) => (
                    <span key={m}>
                      <span
                        className="font-bold text-sm"
                        style={{ color: SET_COLORS[root] }}
                      >
                        {nodeNames[m]}
                      </span>
                      {mi < members.length - 1 && (
                        <span className="text-gray-600 text-xs">, </span>
                      )}
                    </span>
                  ))}
                  <span className="text-gray-500 text-xs">{"}"}</span>
                </motion.div>
              ))}
            </div>

            {/* parent array compact */}
            <div className="mt-3 flex gap-1 justify-center">
              {step.dsu.parent.map((p, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center bg-white/5 rounded-lg px-2 py-1 border border-white/10"
                >
                  <span className="text-gray-600 text-[10px]">
                    {nodeNames[i]}
                  </span>
                  <span
                    className="font-bold text-xs"
                    style={{ color: SET_COLORS[p] }}
                  >
                    {nodeNames[p]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* MST edges & weight */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-400 text-xs uppercase tracking-wider">
                MST Edges
              </p>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-xs">Total weight:</span>
                <motion.span
                  key={step.mstWeight}
                  initial={{ scale: 1.4, color: "#34d399" }}
                  animate={{ scale: 1, color: "#34d399" }}
                  className="font-bold text-lg"
                >
                  {step.mstWeight}
                </motion.span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {step.mstEdges.length === 0 ? (
                <span className="text-gray-600 text-sm italic">
                  No edges yet
                </span>
              ) : (
                step.mstEdges.map((ei) => {
                  const e = EDGES_SORTED[ei];
                  return (
                    <motion.span
                      key={ei}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-sm font-semibold"
                    >
                      {e.from}—{e.to}
                      <span className="text-emerald-600 text-xs ml-1">
                        ({e.weight})
                      </span>
                    </motion.span>
                  );
                })
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ─── CONTROLS ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 flex items-center gap-3 flex-wrap justify-center"
      >
        <button
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <button
          onClick={toggleAutoPlay}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all ${
            autoPlay
              ? "bg-amber-400/20 border border-amber-400/30 text-amber-400"
              : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white"
          }`}
        >
          {autoPlay ? (
            <>
              <Pause className="w-4 h-4" /> Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4" /> Auto Play
            </>
          )}
        </button>

        <button
          onClick={handleNext}
          disabled={currentStep >= ALL_STEPS.length - 1}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          onClick={handleReset}
          className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 transition-all"
          title="Reset"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* step counter */}
        <span className="text-gray-600 text-sm font-mono ml-2">
          Step {currentStep + 1} / {ALL_STEPS.length}
        </span>
      </motion.div>

      {/* Progress bar */}
      <div className="w-full max-w-7xl mt-4">
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
            animate={{
              width: `${((currentStep + 1) / ALL_STEPS.length) * 100}%`,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* nav to other sections */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex gap-4 mt-8"
      >
        <button
          onClick={onPrev}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-semibold transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={onNext}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl px-6 py-3 font-semibold text-white transition-all"
        >
          Continue
          <ChevronRight className="w-4 h-4" />
        </button>
      </motion.div>
    </section>
  );
}
