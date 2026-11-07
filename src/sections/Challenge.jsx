import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Trophy,
  Clock,
  Zap,
  BarChart3,
} from 'lucide-react';

/* ---------- graph data ---------- */
const NODES = [
  { id: 'P', x: 300, y: 60, label: 'P' },
  { id: 'Q', x: 500, y: 140, label: 'Q' },
  { id: 'R', x: 540, y: 320, label: 'R' },
  { id: 'S', x: 400, y: 440, label: 'S' },
  { id: 'T', x: 200, y: 440, label: 'T' },
  { id: 'U', x: 60, y: 320, label: 'U' },
  { id: 'V', x: 100, y: 140, label: 'V' },
];

const EDGES = [
  { from: 'P', to: 'Q', weight: 3 },
  { from: 'Q', to: 'R', weight: 5 },
  { from: 'R', to: 'S', weight: 2 },
  { from: 'S', to: 'T', weight: 4 },
  { from: 'T', to: 'U', weight: 6 },
  { from: 'U', to: 'V', weight: 3 },
  { from: 'V', to: 'P', weight: 4 },
  { from: 'Q', to: 'V', weight: 7 },
  { from: 'Q', to: 'S', weight: 8 },
  { from: 'R', to: 'T', weight: 9 },
  { from: 'P', to: 'R', weight: 10 },
  { from: 'U', to: 'S', weight: 5 },
];

/* sorted edges for Kruskal's */
const sortedEdges = [...EDGES].sort((a, b) => a.weight - b.weight);

/* ---------- DSU helper ---------- */
function createDSU(nodes) {
  const parent = {};
  const rank = {};
  nodes.forEach((n) => {
    parent[n.id] = n.id;
    rank[n.id] = 0;
  });
  return { parent, rank };
}

function find(parent, x) {
  while (parent[x] !== x) {
    parent[x] = parent[parent[x]];
    x = parent[x];
  }
  return x;
}

function union(parent, rank, a, b) {
  const ra = find(parent, a);
  const rb = find(parent, b);
  if (ra === rb) return false;
  if (rank[ra] < rank[rb]) parent[ra] = rb;
  else if (rank[ra] > rank[rb]) parent[rb] = ra;
  else {
    parent[rb] = ra;
    rank[ra]++;
  }
  return true;
}

/* pre-compute the correct answer sequence */
function computeCorrectSequence() {
  const dsu = createDSU(NODES);
  return sortedEdges.map((edge) => {
    const canUnion = union(dsu.parent, dsu.rank, edge.from, edge.to);
    return { ...edge, shouldAdd: canUnion };
  });
}

const correctSequence = computeCorrectSequence();
const totalMSTWeight = correctSequence
  .filter((e) => e.shouldAdd)
  .reduce((s, e) => s + e.weight, 0);

/* ---------- SVG graph ---------- */
function GraphVisualization({ mstEdges, rejectedEdges, currentEdge }) {
  const nodeMap = {};
  NODES.forEach((n) => (nodeMap[n.id] = n));

  const edgeStatus = (from, to) => {
    const key = `${from}-${to}`;
    const keyR = `${to}-${from}`;
    if (mstEdges.has(key) || mstEdges.has(keyR)) return 'mst';
    if (rejectedEdges.has(key) || rejectedEdges.has(keyR)) return 'rejected';
    if (
      currentEdge &&
      ((currentEdge.from === from && currentEdge.to === to) ||
        (currentEdge.from === to && currentEdge.to === from))
    )
      return 'current';
    return 'idle';
  };

  return (
    <svg viewBox="-10 -10 620 520" className="w-full h-full">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* edges */}
      {EDGES.map((edge) => {
        const a = nodeMap[edge.from];
        const b = nodeMap[edge.to];
        const status = edgeStatus(edge.from, edge.to);
        const mx = (a.x + b.x) / 2;
        const my = (a.y + b.y) / 2;

        let strokeColor = 'rgba(255,255,255,0.12)';
        let strokeWidth = 2;
        let opacity = 1;

        if (status === 'mst') {
          strokeColor = '#34d399';
          strokeWidth = 3;
        } else if (status === 'rejected') {
          strokeColor = 'rgba(255,255,255,0.06)';
          opacity = 0.4;
        } else if (status === 'current') {
          strokeColor = '#facc15';
          strokeWidth = 3;
        }

        return (
          <g key={`${edge.from}-${edge.to}`}>
            <motion.line
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              opacity={opacity}
              strokeLinecap="round"
              animate={{ stroke: strokeColor, strokeWidth, opacity }}
              transition={{ duration: 0.4 }}
              filter={status === 'current' ? 'url(#glow)' : undefined}
            />
            <rect
              x={mx - 12}
              y={my - 10}
              width={24}
              height={20}
              rx={6}
              fill={
                status === 'mst'
                  ? 'rgba(52,211,153,0.15)'
                  : status === 'current'
                  ? 'rgba(250,204,21,0.15)'
                  : 'rgba(0,0,0,0.5)'
              }
              opacity={status === 'rejected' ? 0.3 : 1}
            />
            <text
              x={mx}
              y={my + 4}
              textAnchor="middle"
              className="text-xs font-bold"
              fill={
                status === 'mst'
                  ? '#34d399'
                  : status === 'current'
                  ? '#facc15'
                  : status === 'rejected'
                  ? '#555'
                  : '#9ca3af'
              }
            >
              {edge.weight}
            </text>
          </g>
        );
      })}

      {/* nodes */}
      {NODES.map((node) => (
        <g key={node.id}>
          <circle
            cx={node.x}
            cy={node.y}
            r={24}
            fill="rgba(6,182,212,0.1)"
            stroke="rgba(6,182,212,0.4)"
            strokeWidth={2}
          />
          <text
            x={node.x}
            y={node.y + 5}
            textAnchor="middle"
            className="text-sm font-bold"
            fill="#e5e7eb"
          >
            {node.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ---------- celebration ---------- */
function Celebration({ weight, time, onNext }) {
  const particles = Array.from({ length: 40 });
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      {/* confetti */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {particles.map((_, i) => {
          const left = Math.random() * 100;
          const delay = Math.random() * 0.5;
          const colors = [
            'bg-cyan-400',
            'bg-emerald-400',
            'bg-amber-400',
            'bg-blue-400',
            'bg-pink-400',
            'bg-purple-400',
          ];
          return (
            <motion.div
              key={i}
              className={`absolute h-2 w-2 rounded-full ${colors[i % colors.length]}`}
              style={{ left: `${left}%`, top: '-5%' }}
              initial={{ y: 0, opacity: 1, rotate: 0 }}
              animate={{
                y: '120vh',
                opacity: [1, 1, 0],
                rotate: Math.random() * 720,
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay,
                ease: 'easeIn',
              }}
            />
          );
        })}
      </div>

      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 sm:p-10 text-center max-w-md mx-4"
      >
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
          className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600"
        >
          <Trophy className="h-10 w-10 text-white" />
        </motion.div>

        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          🎉 Congratulations!
        </h2>
        <p className="text-gray-300 mb-6">
          You built the MST with total weight{' '}
          <span className="font-bold text-emerald-400">{weight}</span>!
        </p>

        <div className="flex items-center justify-center gap-6 mb-6 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-cyan-400" />
            <span>{time}s</span>
          </div>
          <div className="flex items-center gap-1">
            <BarChart3 className="h-4 w-4 text-emerald-400" />
            <span>Weight {weight}</span>
          </div>
        </div>

        <button
          onClick={onNext}
          className="flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-6 py-3 font-semibold text-white transition-all cursor-pointer"
        >
          Continue
          <ChevronRight className="h-4 w-4" />
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ========== main Challenge component ========== */
export default function Challenge({ onNext, onPrev, onChallengeComplete }) {
  const [step, setStep] = useState(0); // index in sortedEdges
  const [mstEdges, setMstEdges] = useState(new Set());
  const [rejectedEdges, setRejectedEdges] = useState(new Set());
  const [mstCount, setMstCount] = useState(0);
  const [currentWeight, setCurrentWeight] = useState(0);
  const [feedback, setFeedback] = useState(null); // { type: 'correct'|'wrong', msg }
  const [done, setDone] = useState(false);
  const [startTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);

  // DSU state
  const dsuRef = useRef(createDSU(NODES));

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsed(Math.round((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [startTime]);

  const currentEdge = step < sortedEdges.length ? sortedEdges[step] : null;
  const expected = step < correctSequence.length ? correctSequence[step] : null;

  const handleDecision = useCallback(
    (userAdds) => {
      if (!expected || done) return;

      const isCorrect = userAdds === expected.shouldAdd;

      if (!isCorrect) {
        setFeedback({
          type: 'wrong',
          msg: userAdds
            ? `${expected.from}-${expected.to} creates a cycle! It should be rejected.`
            : `${expected.from}-${expected.to} doesn't create a cycle — it should be added to the MST.`,
        });
        setTimeout(() => setFeedback(null), 2500);
        return;
      }

      const key = `${expected.from}-${expected.to}`;

      if (userAdds) {
        // actually union
        union(dsuRef.current.parent, dsuRef.current.rank, expected.from, expected.to);
        setMstEdges((prev) => new Set(prev).add(key));
        setMstCount((c) => c + 1);
        setCurrentWeight((w) => w + expected.weight);
        setFeedback({ type: 'correct', msg: `Edge ${key} (weight ${expected.weight}) added to MST!` });
      } else {
        setRejectedEdges((prev) => new Set(prev).add(key));
        setFeedback({ type: 'correct', msg: `Edge ${key} correctly rejected — it would create a cycle.` });
      }

      const newMstCount = userAdds ? mstCount + 1 : mstCount;

      if (newMstCount === NODES.length - 1) {
        // MST complete
        clearInterval(timerRef.current);
        const finalTime = Math.round((Date.now() - startTime) / 1000);
        setElapsed(finalTime);
        setTimeout(() => {
          setDone(true);
          if (onChallengeComplete) onChallengeComplete(finalTime);
        }, 800);
      }

      setTimeout(() => setFeedback(null), 1800);
      setStep((s) => s + 1);
    },
    [expected, done, mstCount, startTime, onChallengeComplete]
  );

  const progressPct = (step / sortedEdges.length) * 100;

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16 overflow-hidden">
      {/* background */}
      <div className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 -left-40 h-[500px] w-[500px] rounded-full bg-cyan-500/5 blur-3xl" />

      {/* section indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 text-xs tracking-widest text-gray-500 uppercase"
      >
        08 / 08
      </motion.div>

      {/* heading */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl sm:text-4xl font-bold text-white mb-2 text-center"
      >
        Build Your Own{' '}
        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          MST
        </span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-gray-400 mb-8 text-center max-w-lg"
      >
        Select edges in Kruskal's order. For each edge, decide: add to MST or reject.
      </motion.p>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-6 relative">
        {/* ---- left: graph ---- */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 relative"
        >
          <GraphVisualization
            mstEdges={mstEdges}
            rejectedEdges={rejectedEdges}
            currentEdge={currentEdge}
          />

          {/* celebration overlay */}
          <AnimatePresence>
            {done && (
              <Celebration
                weight={currentWeight}
                time={elapsed}
                onNext={onNext}
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* ---- right: controls ---- */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-80 flex flex-col gap-4"
        >
          {/* stats */}
          <div className="grid grid-cols-3 gap-2">
            {[
              {
                icon: <Zap className="h-4 w-4 text-emerald-400" />,
                label: 'Edges',
                value: `${mstCount}/6`,
              },
              {
                icon: <BarChart3 className="h-4 w-4 text-cyan-400" />,
                label: 'Weight',
                value: currentWeight,
              },
              {
                icon: <Clock className="h-4 w-4 text-amber-400" />,
                label: 'Time',
                value: `${elapsed}s`,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-3 text-center"
              >
                <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-1">
                  {stat.icon}
                  {stat.label}
                </div>
                <div className="text-lg font-bold text-white">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* progress */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-3">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Progress</span>
              <span>{step}/{sortedEdges.length}</span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* current edge decision */}
          {currentEdge && !done && (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5"
            >
              <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">
                Current Edge
              </p>
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-2xl font-bold text-white">
                  {currentEdge.from}—{currentEdge.to}
                </span>
                <span className="rounded-lg bg-amber-500/10 px-3 py-1 text-amber-400 text-sm font-bold">
                  w={currentEdge.weight}
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleDecision(true)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 px-4 py-3 font-semibold text-emerald-400 hover:bg-emerald-500/30 transition-all cursor-pointer"
                >
                  <Check className="h-4 w-4" />
                  Add to MST
                </button>
                <button
                  onClick={() => handleDecision(false)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-rose-500/20 border border-rose-500/30 px-4 py-3 font-semibold text-rose-400 hover:bg-rose-500/30 transition-all cursor-pointer"
                >
                  <X className="h-4 w-4" />
                  Reject
                </button>
              </div>
            </motion.div>
          )}

          {/* feedback */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`rounded-xl p-4 text-sm ${
                  feedback.type === 'correct'
                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
                    : 'bg-rose-500/10 border border-rose-500/20 text-rose-300'
                }`}
              >
                <p className="font-semibold mb-1">
                  {feedback.type === 'correct' ? '✓ Correct!' : '✗ Wrong!'}
                </p>
                <p className="text-gray-400 text-xs">{feedback.msg}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* sorted edge list */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex-1 overflow-y-auto max-h-60">
            <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider">
              Sorted Edges
            </p>
            <div className="space-y-1">
              {sortedEdges.map((edge, i) => {
                const key = `${edge.from}-${edge.to}`;
                const isMST = mstEdges.has(key);
                const isRejected = rejectedEdges.has(key);
                const isCurrent = i === step && !done;

                let cls = 'flex items-center justify-between px-3 py-1.5 rounded-lg text-sm ';
                if (isMST) cls += 'bg-emerald-500/10 text-emerald-400';
                else if (isRejected) cls += 'bg-white/[0.02] text-gray-600 line-through';
                else if (isCurrent) cls += 'bg-amber-500/10 text-amber-400 font-semibold';
                else if (i < step) cls += 'text-gray-600';
                else cls += 'text-gray-400';

                return (
                  <div key={key} className={cls}>
                    <span>
                      {edge.from}–{edge.to}
                    </span>
                    <span className="font-mono">{edge.weight}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      {/* bottom nav */}
      <div className="mt-8 flex gap-6">
        <button
          onClick={onPrev}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Quiz
        </button>
        {done && (
          <button
            onClick={onNext}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
          >
            View Completion
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </section>
  );
}
