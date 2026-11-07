import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  Play,
  RotateCcw,
  Layers,
  Search,
  GitMerge,
  Zap,
} from "lucide-react";

/* ───────── colour palette for sets ───────── */
const SET_COLORS = [
  "#22d3ee", // cyan-400
  "#a78bfa", // violet-400
  "#f472b6", // pink-400
  "#34d399", // emerald-400
  "#fbbf24", // amber-400
  "#fb923c", // orange-400
  "#60a5fa", // blue-400
  "#e879f9", // fuchsia-400
];

/* ───────── helpers ───────── */
const initDSU = (n) => ({
  parent: Array.from({ length: n }, (_, i) => i),
  rank: Array(n).fill(0),
});

const findRoot = (parent, x) => {
  const path = [];
  let cur = x;
  while (parent[cur] !== cur) {
    path.push(cur);
    cur = parent[cur];
  }
  return { root: cur, path };
};

const dsuFind = (parent, x) => {
  if (parent[x] !== x) parent[x] = dsuFind(parent, parent[x]);
  return parent[x];
};

const dsuUnion = (parentArr, rankArr, a, b) => {
  const p = [...parentArr];
  const r = [...rankArr];
  let rA = dsuFind(p, a);
  let rB = dsuFind(p, b);
  if (rA === rB) return { parent: p, rank: r, merged: false };
  if (r[rA] < r[rB]) [rA, rB] = [rB, rA];
  p[rB] = rA;
  if (r[rA] === r[rB]) r[rA]++;
  return { parent: p, rank: r, merged: true };
};

/* ───────── animation variants ───────── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, type: "spring", stiffness: 120, damping: 18 },
  }),
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

/* ═══════════════════  SUB-STEP 1 — What is DSU?  ═══════════════════ */
function WhatIsDSU() {
  const N = 8;
  const positions = Array.from({ length: N }, (_, i) => ({
    x: 80 + i * 72,
    y: 100,
  }));

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      <motion.h3
        variants={fadeUp}
        className="text-2xl md:text-3xl font-bold text-white mb-3"
      >
        What is DSU?
      </motion.h3>
      <motion.p variants={fadeUp} className="text-gray-300 mb-8 max-w-2xl">
        <span className="text-cyan-400 font-semibold">Disjoint Set Union</span>{" "}
        (also called Union-Find) tracks which elements belong to the same group
        (set). Initially every element is its own set.
      </motion.p>

      {/* visual – 8 circles */}
      <motion.div
        variants={fadeUp}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6"
      >
        <p className="text-gray-400 text-sm mb-4 text-center">
          8 elements, each in its own set
        </p>
        <svg viewBox="0 0 660 200" className="w-full max-h-[200px]">
          {positions.map((pos, i) => (
            <motion.g
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.08, type: "spring", stiffness: 200 }}
            >
              {/* set boundary */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={38}
                fill="none"
                stroke={SET_COLORS[i]}
                strokeWidth={2}
                strokeDasharray="6 4"
                opacity={0.5}
              />
              {/* node */}
              <circle cx={pos.x} cy={pos.y} r={26} fill={SET_COLORS[i]} opacity={0.25} />
              <circle
                cx={pos.x}
                cy={pos.y}
                r={26}
                fill="none"
                stroke={SET_COLORS[i]}
                strokeWidth={2}
              />
              <text
                x={pos.x}
                y={pos.y + 6}
                textAnchor="middle"
                fill="white"
                fontSize={16}
                fontWeight="bold"
              >
                {i}
              </text>
            </motion.g>
          ))}
        </svg>
      </motion.div>

      {/* parent array */}
      <motion.div
        variants={fadeUp}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        <p className="text-gray-400 text-sm mb-3">
          <code className="text-cyan-400">parent[]</code> array — each element
          points to itself
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {Array.from({ length: N }, (_, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              custom={i}
              className="flex flex-col items-center bg-white/5 rounded-xl px-4 py-2 border border-white/10"
            >
              <span className="text-gray-500 text-xs">parent[{i}]</span>
              <span className="text-cyan-400 font-bold text-lg">{i}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════  SUB-STEP 2 — Find Operation  ═══════════════════ */
function FindOperation() {
  /* fixed tree:  0←1←3←6, 0←2, 0←4←5  */
  const parentArr = [0, 0, 0, 1, 0, 4, 3];
  const labels = [0, 1, 2, 3, 4, 5, 6];

  const treePos = {
    0: { x: 300, y: 40 },
    1: { x: 160, y: 130 },
    2: { x: 300, y: 130 },
    4: { x: 440, y: 130 },
    3: { x: 160, y: 220 },
    5: { x: 440, y: 220 },
    6: { x: 160, y: 310 },
  };

  const [selected, setSelected] = useState(null);
  const [pathNodes, setPathNodes] = useState([]);
  const [compressed, setCompressed] = useState(false);
  const [animStep, setAnimStep] = useState(-1);

  const handleClick = useCallback(
    (node) => {
      if (animStep >= 0) return;
      setSelected(node);
      setCompressed(false);
      const { root, path } = findRoot(parentArr, node);
      const full = [...path, root];
      setPathNodes(full);

      full.forEach((_, i) => {
        setTimeout(() => setAnimStep(i), 500 * (i + 1));
      });
      setTimeout(() => {
        setCompressed(true);
        setTimeout(() => setAnimStep(-1), 1200);
      }, 500 * (full.length + 1));
    },
    [animStep]
  );

  const getNodeColor = (id) => {
    if (pathNodes.length === 0) return "#94a3b8";
    const idx = pathNodes.indexOf(id);
    if (idx === -1) return "#334155";
    if (animStep >= idx) return idx === pathNodes.length - 1 ? "#34d399" : "#fbbf24";
    return "#94a3b8";
  };

  return (
    <motion.div
      className="w-full max-w-5xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      <motion.h3
        variants={fadeUp}
        className="text-2xl md:text-3xl font-bold text-white mb-3"
      >
        The Find Operation
      </motion.h3>
      <motion.p variants={fadeUp} className="text-gray-300 mb-6 max-w-2xl">
        Click any node to <span className="text-amber-400 font-semibold">find</span>{" "}
        its root and watch{" "}
        <span className="text-emerald-400 font-semibold">path compression</span> in
        action.
      </motion.p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* tree visualisation */}
        <motion.div
          variants={fadeUp}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4"
        >
          <svg viewBox="0 0 600 370" className="w-full">
            {/* edges */}
            {labels.map((id) => {
              const pId = parentArr[id];
              if (pId === id) return null;
              const from = treePos[id];
              const to = treePos[pId];

              /* compressed edge */}
            )}
            {labels.map((id) => {
              const pId = parentArr[id];
              if (pId === id) return null;
              const from = treePos[id];
              const to = treePos[pId];

              if (compressed && pathNodes.includes(id) && id !== 0) {
                const root = treePos[0];
                return (
                  <motion.line
                    key={`c-${id}`}
                    x1={from.x}
                    y1={from.y}
                    x2={root.x}
                    y2={root.y}
                    stroke="#34d399"
                    strokeWidth={2}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                );
              }

              return (
                <line
                  key={`e-${id}`}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={
                    pathNodes.includes(id) && pathNodes.includes(pId) && animStep >= pathNodes.indexOf(id)
                      ? "#fbbf24"
                      : "#475569"
                  }
                  strokeWidth={2}
                  opacity={compressed && pathNodes.includes(id) ? 0.2 : 1}
                />
              );
            })}

            {/* nodes */}
            {labels.map((id) => {
              const pos = treePos[id];
              return (
                <g
                  key={id}
                  onClick={() => handleClick(id)}
                  className="cursor-pointer"
                >
                  <motion.circle
                    cx={pos.x}
                    cy={pos.y}
                    r={24}
                    fill={getNodeColor(id)}
                    fillOpacity={0.3}
                    stroke={getNodeColor(id)}
                    strokeWidth={2}
                    whileHover={{ scale: 1.15 }}
                    animate={{
                      scale:
                        pathNodes.indexOf(id) === animStep ? [1, 1.3, 1] : 1,
                    }}
                    transition={{ duration: 0.4 }}
                  />
                  <text
                    x={pos.x}
                    y={pos.y + 5}
                    textAnchor="middle"
                    fill="white"
                    fontSize={14}
                    fontWeight="bold"
                    pointerEvents="none"
                  >
                    {id}
                  </text>
                </g>
              );
            })}
          </svg>
          {compressed && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-emerald-400 text-sm mt-2"
            >
              ✓ Path compressed — all nodes now point directly to root
            </motion.p>
          )}
        </motion.div>

        {/* pseudocode */}
        <motion.div
          variants={fadeUp}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 font-mono text-sm leading-relaxed"
        >
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-3 font-sans">
            Pseudocode
          </p>
          <pre className="text-gray-300 whitespace-pre-wrap">
            <span className="text-cyan-400 font-bold">find</span>(x):{"\n"}
            {"  "}
            <span className="text-gray-500">// path compression</span>
            {"\n"}
            {"  "}
            <span className="text-amber-400">if</span> parent[x] != x:{"\n"}
            {"    "}parent[x] ={" "}
            <span className="text-cyan-400">find</span>(parent[x]){"\n"}
            {"  "}
            <span className="text-amber-400">return</span> parent[x]
          </pre>

          {selected !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10"
            >
              <p className="text-gray-400 text-xs mb-2 font-sans">
                Trace for find({selected})
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {pathNodes.map((n, i) => (
                  <span key={i} className="flex items-center gap-1">
                    <motion.span
                      className={`px-2 py-1 rounded-lg text-sm font-bold ${
                        i === pathNodes.length - 1
                          ? "bg-emerald-400/20 text-emerald-400"
                          : animStep >= i
                          ? "bg-amber-400/20 text-amber-400"
                          : "bg-white/5 text-gray-500"
                      }`}
                      animate={animStep === i ? { scale: [1, 1.2, 1] } : {}}
                    >
                      {n}
                    </motion.span>
                    {i < pathNodes.length - 1 && (
                      <ChevronRight className="w-3 h-3 text-gray-600" />
                    )}
                  </span>
                ))}
              </div>
              {compressed && (
                <p className="text-emerald-400 text-xs mt-2">
                  Root = {pathNodes[pathNodes.length - 1]}
                </p>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════  SUB-STEP 3 — Union Operation  ═══════════════════ */
function UnionOperation() {
  const N = 6;
  const [dsu, setDsu] = useState(initDSU(N));
  const [unionA, setUnionA] = useState(0);
  const [unionB, setUnionB] = useState(1);
  const [lastResult, setLastResult] = useState(null);

  const getSet = useCallback(
    (parent) => {
      const sets = {};
      for (let i = 0; i < N; i++) {
        const root = dsuFind([...parent], i);
        if (!sets[root]) sets[root] = [];
        sets[root].push(i);
      }
      return sets;
    },
    [N]
  );

  const handleUnion = () => {
    const result = dsuUnion(dsu.parent, dsu.rank, unionA, unionB);
    setDsu({ parent: result.parent, rank: result.rank });
    setLastResult(
      result.merged
        ? `Merged set of ${unionA} and ${unionB}`
        : `${unionA} and ${unionB} already in same set`
    );
  };

  const handleReset = () => {
    setDsu(initDSU(N));
    setLastResult(null);
  };

  const sets = getSet(dsu.parent);
  const setEntries = Object.entries(sets);

  return (
    <motion.div
      className="w-full max-w-5xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      <motion.h3
        variants={fadeUp}
        className="text-2xl md:text-3xl font-bold text-white mb-3"
      >
        The Union Operation
      </motion.h3>
      <motion.p variants={fadeUp} className="text-gray-300 mb-6 max-w-2xl">
        Select two elements to <span className="text-cyan-400 font-semibold">union</span>{" "}
        their sets. Watch{" "}
        <span className="text-emerald-400 font-semibold">union by rank</span> keep
        the tree balanced.
      </motion.p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* interactive playground */}
        <motion.div
          variants={fadeUp}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          {/* set forest visualisation */}
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-4">
            Current Forest
          </p>
          <div className="flex flex-wrap gap-4 justify-center mb-6">
            {setEntries.map(([root, members], si) => (
              <motion.div
                key={root}
                layout
                className="flex flex-col items-center gap-2 p-3 rounded-xl border border-white/10 bg-white/5"
              >
                {/* root */}
                <motion.div
                  layout
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white border-2"
                  style={{
                    borderColor: SET_COLORS[si % SET_COLORS.length],
                    backgroundColor: SET_COLORS[si % SET_COLORS.length] + "33",
                  }}
                >
                  {root}
                </motion.div>
                {members.length > 1 && (
                  <div className="flex gap-1 flex-wrap justify-center">
                    {members
                      .filter((m) => String(m) !== String(root))
                      .map((m) => (
                        <motion.div
                          key={m}
                          layout
                          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white border"
                          style={{
                            borderColor: SET_COLORS[si % SET_COLORS.length],
                            backgroundColor:
                              SET_COLORS[si % SET_COLORS.length] + "22",
                          }}
                        >
                          {m}
                        </motion.div>
                      ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* controls */}
          <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
            <span className="text-gray-400 text-sm">Union(</span>
            <select
              value={unionA}
              onChange={(e) => setUnionA(Number(e.target.value))}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm"
            >
              {Array.from({ length: N }, (_, i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
            <span className="text-gray-400 text-sm">,</span>
            <select
              value={unionB}
              onChange={(e) => setUnionB(Number(e.target.value))}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm"
            >
              {Array.from({ length: N }, (_, i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
            <span className="text-gray-400 text-sm">)</span>
            <button
              onClick={handleUnion}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl px-5 py-2 font-semibold text-white text-sm transition-all"
            >
              Union
            </button>
            <button
              onClick={handleReset}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {lastResult && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-center text-sm ${
                lastResult.includes("Merged")
                  ? "text-emerald-400"
                  : "text-amber-400"
              }`}
            >
              {lastResult}
            </motion.p>
          )}

          {/* arrays */}
          <div className="mt-6 space-y-3">
            <div>
              <p className="text-gray-500 text-xs mb-1">parent[]</p>
              <div className="flex gap-1 justify-center">
                {dsu.parent.map((p, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center bg-white/5 rounded-lg px-3 py-1 border border-white/10"
                  >
                    <span className="text-gray-500 text-[10px]">{i}</span>
                    <span className="text-cyan-400 font-bold text-sm">{p}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">rank[]</p>
              <div className="flex gap-1 justify-center">
                {dsu.rank.map((r, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center bg-white/5 rounded-lg px-3 py-1 border border-white/10"
                  >
                    <span className="text-gray-500 text-[10px]">{i}</span>
                    <span className="text-amber-400 font-bold text-sm">{r}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* pseudocode */}
        <motion.div
          variants={fadeUp}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 font-mono text-sm leading-relaxed"
        >
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-3 font-sans">
            Pseudocode — Union by Rank
          </p>
          <pre className="text-gray-300 whitespace-pre-wrap">
            <span className="text-cyan-400 font-bold">union</span>(x, y):{"\n"}
            {"  "}rootX = <span className="text-cyan-400">find</span>(x){"\n"}
            {"  "}rootY = <span className="text-cyan-400">find</span>(y){"\n"}
            {"\n"}
            {"  "}
            <span className="text-amber-400">if</span> rootX == rootY:{" "}
            <span className="text-amber-400">return</span>
            {"\n"}
            {"\n"}
            {"  "}
            <span className="text-gray-500">// union by rank</span>
            {"\n"}
            {"  "}
            <span className="text-amber-400">if</span> rank[rootX] {"<"}{" "}
            rank[rootY]: swap{"\n"}
            {"  "}parent[rootY] = rootX{"\n"}
            {"  "}
            <span className="text-amber-400">if</span> rank[rootX] =={" "}
            rank[rootY]:{"\n"}
            {"    "}rank[rootX]++
          </pre>

          <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10 font-sans">
            <p className="text-gray-400 text-xs mb-2">How Union by Rank works</p>
            <ul className="text-gray-400 text-sm space-y-1 list-disc list-inside">
              <li>Each node has a <span className="text-amber-400">rank</span> (upper bound on height)</li>
              <li>Attach the <span className="text-rose-400">shorter</span> tree under the <span className="text-emerald-400">taller</span> tree</li>
              <li>Only increment rank when both trees are the same height</li>
              <li>Keeps tree depth ≤ O(log n)</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════  MAIN DSULearn SECTION  ═══════════════════ */
const SUB_STEPS = [
  { id: 0, label: "What is DSU?", icon: Layers },
  { id: 1, label: "Find Operation", icon: Search },
  { id: 2, label: "Union Operation", icon: GitMerge },
];

export default function DSULearn({ onNext, onPrev }) {
  const [step, setStep] = useState(0);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative">
      {/* section indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute top-6 right-6 text-gray-600 text-sm font-mono"
      >
        03 / 08
      </motion.div>

      {/* section title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-sm font-semibold mb-4">
          <Zap className="w-4 h-4" />
          Section 03
        </div>
        <h2 className="text-3xl md:text-5xl font-bold text-white">
          Disjoint Set Union{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            (DSU)
          </span>
        </h2>
      </motion.div>

      {/* sub-step tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex gap-2 mb-10 flex-wrap justify-center"
      >
        {SUB_STEPS.map((s) => {
          const Icon = s.icon;
          const active = step === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setStep(s.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                active
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10"
              }`}
            >
              <Icon className="w-4 h-4" />
              {s.label}
            </button>
          );
        })}
      </motion.div>

      {/* content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ type: "spring", stiffness: 150, damping: 20 }}
          className="w-full flex justify-center"
        >
          {step === 0 && <WhatIsDSU />}
          {step === 1 && <FindOperation />}
          {step === 2 && <UnionOperation />}
        </motion.div>
      </AnimatePresence>

      {/* nav buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex gap-4 mt-12"
      >
        <button
          onClick={step > 0 ? () => setStep(step - 1) : onPrev}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-semibold transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          {step > 0 ? "Previous" : "Back"}
        </button>
        <button
          onClick={step < 2 ? () => setStep(step + 1) : onNext}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl px-6 py-3 font-semibold text-white transition-all"
        >
          {step < 2 ? "Next" : "Continue"}
          <ChevronRight className="w-4 h-4" />
        </button>
      </motion.div>
    </section>
  );
}
