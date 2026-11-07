import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Clock,
  HardDrive,
  BarChart3,
  Zap,
  TrendingUp,
} from "lucide-react";

/* ─── Animated Counter ──────────────────────────────────────── */
function AnimatedCounter({ target, duration = 1.5, suffix = "", prefix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const increment = target / ((duration * 1000) / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ─── Animated Bar ──────────────────────────────────────────── */
function AnimatedBar({ label, value, maxValue, color, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const pct = (value / maxValue) * 100;

  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-gray-300 font-mono">{label}</span>
        <span className="text-gray-400 font-mono">{value.toLocaleString()}</span>
      </div>
      <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={inView ? { width: `${pct}%` } : { width: 0 }}
          transition={{ duration: 0.8, delay, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

/* ─── Comparison Table ──────────────────────────────────────── */
const COMPARISON = [
  {
    algo: "Kruskal's",
    time: "O(E log E)",
    space: "O(V + E)",
    bestFor: "Sparse graphs",
    highlight: true,
  },
  {
    algo: "Prim's",
    time: "O(E log V)",
    space: "O(V)",
    bestFor: "Dense graphs",
    highlight: false,
  },
  {
    algo: "Borůvka's",
    time: "O(E log V)",
    space: "O(V + E)",
    bestFor: "Parallel computing",
    highlight: false,
  },
];

/* ─── Main Component ────────────────────────────────────────── */
export default function Complexity({ onNext, onPrev }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <motion.div
        className="w-full max-w-6xl"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <p className="text-cyan-400 font-mono text-sm tracking-widest mb-2">
            06 / 08
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Time & Space{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Complexity
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Understand the efficiency of Kruskal's Algorithm and how it compares
            to alternatives
          </p>
        </motion.div>

        {/* ═══ TIME COMPLEXITY ═══ */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center gap-2 mb-5">
            <Clock className="w-5 h-5 text-cyan-400" />
            <h3 className="text-2xl font-bold text-white">Time Complexity</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1 — Sorting */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
                <h4 className="text-white font-semibold">Sorting Edges</h4>
              </div>
              <p className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-3 font-mono">
                O(E log E)
              </p>
              <p className="text-gray-400 text-sm mb-4">
                Dominates overall complexity. Comparison-based sort on all
                edges.
              </p>
              {/* Bar chart for different E values */}
              <div className="space-y-3">
                <AnimatedBar
                  label="E = 10"
                  value={Math.round(10 * Math.log2(10))}
                  maxValue={10000}
                  color="bg-gradient-to-r from-cyan-500 to-cyan-400"
                  delay={0.1}
                />
                <AnimatedBar
                  label="E = 100"
                  value={Math.round(100 * Math.log2(100))}
                  maxValue={10000}
                  color="bg-gradient-to-r from-blue-500 to-cyan-400"
                  delay={0.2}
                />
                <AnimatedBar
                  label="E = 1000"
                  value={Math.round(1000 * Math.log2(1000))}
                  maxValue={10000}
                  color="bg-gradient-to-r from-blue-600 to-blue-400"
                  delay={0.3}
                />
              </div>
            </motion.div>

            {/* Card 2 — DSU Operations */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
                <h4 className="text-white font-semibold">DSU Operations</h4>
              </div>
              <p className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent mb-3 font-mono">
                O(α(n)) ≈ O(1)
              </p>
              <p className="text-gray-400 text-sm mb-4">
                Nearly constant time per operation with path compression +
                union by rank.
              </p>
              {/* α(n) visual */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Inverse Ackermann α(n)
                </p>
                <div className="space-y-1.5">
                  {[
                    { n: "1", v: 0 },
                    { n: "2", v: 1 },
                    { n: "65,536", v: 3 },
                    { n: "2^65536", v: 4 },
                    { n: "Universe atoms", v: 4 },
                  ].map((row, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-400 font-mono text-xs">
                        n = {row.n}
                      </span>
                      <span className="text-emerald-400 font-bold font-mono">
                        α = {row.v}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-gray-500 text-xs mt-3 italic">
                  For all practical purposes, α(n) ≤ 4, so DSU operations are
                  essentially constant time.
                </p>
              </div>
            </motion.div>

            {/* Card 3 — Overall */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex flex-col"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold text-sm">
                  Σ
                </div>
                <h4 className="text-white font-semibold">Overall</h4>
              </div>
              <p className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent mb-3 font-mono">
                O(E log E)
              </p>
              <p className="text-gray-400 text-sm mb-5">
                Dominated by sorting. DSU adds near-zero overhead.
              </p>
              {/* Visual breakdown */}
              <div className="flex-1 flex flex-col justify-end">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-3 flex-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                    <span className="text-xs text-gray-400 w-20">
                      Sort: ~99%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-[4%] rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400" />
                    <span className="text-xs text-gray-400 w-20">
                      DSU: ~1%
                    </span>
                  </div>
                </div>
                <p className="text-gray-500 text-xs mt-3">
                  Sorting is the clear bottleneck — DSU contributes almost
                  nothing.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ═══ SPACE COMPLEXITY ═══ */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center gap-2 mb-5">
            <HardDrive className="w-5 h-5 text-blue-400" />
            <h3 className="text-2xl font-bold text-white">Space Complexity</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                label: "Graph Storage",
                value: "O(V + E)",
                desc: "Edge list storage for all vertices and edges",
                icon: <BarChart3 className="w-5 h-5" />,
                color: "from-cyan-400 to-blue-500",
              },
              {
                label: "DSU Arrays",
                value: "O(V)",
                desc: "parent[] and rank[] arrays — one entry per vertex",
                icon: <Zap className="w-5 h-5" />,
                color: "from-emerald-400 to-emerald-500",
              },
              {
                label: "Total",
                value: "O(V + E)",
                desc: "Graph storage dominates; DSU adds only linear space",
                icon: <TrendingUp className="w-5 h-5" />,
                color: "from-amber-400 to-amber-500",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex items-start gap-4"
              >
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white flex-shrink-0`}
                >
                  {item.icon}
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                    {item.label}
                  </p>
                  <p
                    className={`text-2xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent font-mono mb-1`}
                  >
                    {item.value}
                  </p>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ═══ COMPARISON TABLE ═══ */}
        <motion.div
          variants={itemVariants}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden mb-8"
        >
          <div className="px-5 py-4 border-b border-white/10 bg-white/5 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">
              Algorithm Comparison
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-5 py-3 text-gray-400 font-semibold">
                    Algorithm
                  </th>
                  <th className="text-left px-5 py-3 text-gray-400 font-semibold">
                    Time
                  </th>
                  <th className="text-left px-5 py-3 text-gray-400 font-semibold">
                    Space
                  </th>
                  <th className="text-left px-5 py-3 text-gray-400 font-semibold">
                    Best For
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i }}
                    className={`border-b border-white/5 ${
                      row.highlight
                        ? "bg-cyan-500/5"
                        : "hover:bg-white/5"
                    } transition-colors`}
                  >
                    <td className="px-5 py-3.5">
                      <span
                        className={`font-semibold ${
                          row.highlight ? "text-cyan-400" : "text-white"
                        }`}
                      >
                        {row.algo}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-amber-400">
                      {row.time}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-emerald-400">
                      {row.space}
                    </td>
                    <td className="px-5 py-3.5 text-gray-300">{row.bestFor}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* ═══ KEY INSIGHT ═══ */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-r from-amber-500/10 to-cyan-500/10 border border-amber-500/20 rounded-2xl p-6 mb-10"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-white flex-shrink-0">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-lg mb-1">
                Key Insight
              </h4>
              <p className="text-gray-300 leading-relaxed">
                Kruskal's is optimal for{" "}
                <span className="text-cyan-400 font-semibold">
                  sparse graphs
                </span>{" "}
                because its complexity depends on{" "}
                <span className="text-amber-400 font-semibold">edges</span>,
                and{" "}
                <span className="text-emerald-400 font-semibold">sorting</span>{" "}
                is its only bottleneck. The DSU operations add virtually no
                overhead thanks to path compression and union by rank.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Section Navigation */}
        <motion.div
          variants={itemVariants}
          className="flex justify-between items-center"
        >
          <button
            onClick={onPrev}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-gray-300 font-semibold transition-all"
          >
            <ChevronLeft className="w-5 h-5" /> Previous Section
          </button>
          <button
            onClick={onNext}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold transition-all"
          >
            Next Section <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
