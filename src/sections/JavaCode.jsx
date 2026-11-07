import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Code2,
  Footprints,
} from "lucide-react";
import Editor from "@monaco-editor/react";

const JAVA_CODE = `import java.util.*;

class KruskalMST {
    static int[] parent, rank;
    
    static int find(int x) {
        if (parent[x] != x)
            parent[x] = find(parent[x]); // Path compression
        return parent[x];
    }
    
    static boolean union(int x, int y) {
        int rootX = find(x), rootY = find(y);
        if (rootX == rootY) return false; // Same set - cycle!
        if (rank[rootX] < rank[rootY]) { int t = rootX; rootX = rootY; rootY = t; }
        parent[rootY] = rootX; // Union by rank
        if (rank[rootX] == rank[rootY]) rank[rootX]++;
        return true;
    }
    
    static List<int[]> kruskal(int n, int[][] edges) {
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
        
        // Sort edges by weight
        Arrays.sort(edges, (a, b) -> a[2] - b[2]);
        
        List<int[]> mst = new ArrayList<>();
        int totalWeight = 0;
        
        for (int[] edge : edges) {
            int u = edge[0], v = edge[1], w = edge[2];
            if (union(u, v)) {       // If no cycle
                mst.add(edge);        // Add to MST
                totalWeight += w;
                if (mst.size() == n - 1) break;
            }
        }
        
        System.out.println("MST Weight: " + totalWeight);
        return mst;
    }
    
    public static void main(String[] args) {
        int n = 6; // vertices: 0=A, 1=B, 2=C, 3=D, 4=E, 5=F
        int[][] edges = {
            {4,5,1}, {0,1,2}, {2,3,2}, {1,2,3},
            {3,4,3}, {0,5,4}, {1,5,5}, {2,4,6}, {1,3,7}
        };
        kruskal(n, edges);
    }
}`;

const LABEL_MAP = { 0: "A", 1: "B", 2: "C", 3: "D", 4: "E", 5: "F" };

// Pre-computed dry run steps for the given graph
// Sorted edges: E-F:1, A-B:2, C-D:2, B-C:3, D-E:3, A-F:4, B-F:5, C-E:6, B-D:7
const DRY_RUN_STEPS = (() => {
  const edges = [
    [4, 5, 1],
    [0, 1, 2],
    [2, 3, 2],
    [1, 2, 3],
    [3, 4, 3],
    [0, 5, 4],
    [1, 5, 5],
    [2, 4, 6],
    [1, 3, 7],
  ];

  const parent = [0, 1, 2, 3, 4, 5];
  const rank = [0, 0, 0, 0, 0, 0];
  const mstEdges = [];
  let totalWeight = 0;

  function find(x) {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }

  const steps = [
    {
      title: "Initialization",
      description: "Initialize parent[] and rank[] arrays. Sort edges by weight.",
      edge: null,
      findCalls: [],
      unionResult: null,
      parent: [...parent],
      rank: [...rank],
      mstEdges: [],
      totalWeight: 0,
      highlightLines: [23, 24, 25, 28],
      accepted: null,
    },
  ];

  for (const [u, v, w] of edges) {
    const findU = find(u);
    const findV = find(v);
    const sameSet = findU === findV;

    if (!sameSet) {
      if (rank[findU] < rank[findV]) {
        parent[findU] = findV;
      } else if (rank[findU] > rank[findV]) {
        parent[findV] = findU;
      } else {
        parent[findV] = findU;
        rank[findU]++;
      }
      mstEdges.push([u, v, w]);
      totalWeight += w;
    }

    steps.push({
      title: `Edge ${LABEL_MAP[u]}-${LABEL_MAP[v]} (weight ${w})`,
      description: sameSet
        ? `find(${LABEL_MAP[u]})=${LABEL_MAP[findU]}, find(${LABEL_MAP[v]})=${LABEL_MAP[findV]} → Same set! Skip (would create cycle).`
        : `find(${LABEL_MAP[u]})=${LABEL_MAP[findU]}, find(${LABEL_MAP[v]})=${LABEL_MAP[findV]} → Different sets! Union & add to MST.`,
      edge: [u, v, w],
      findCalls: [
        { arg: LABEL_MAP[u], result: LABEL_MAP[findU] },
        { arg: LABEL_MAP[v], result: LABEL_MAP[findV] },
      ],
      unionResult: !sameSet,
      parent: [...parent],
      rank: [...rank],
      mstEdges: mstEdges.map((e) => [...e]),
      totalWeight,
      highlightLines: sameSet ? [34, 35, 13] : [34, 35, 36, 37, 38],
      accepted: !sameSet,
    });

    if (mstEdges.length === 5) break;
  }

  return steps;
})();

export default function JavaCode({ onNext, onPrev }) {
  const [currentStep, setCurrentStep] = useState(0);
  const editorRef = useRef(null);
  const decorationsRef = useRef([]);

  const step = DRY_RUN_STEPS[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === DRY_RUN_STEPS.length - 1;

  const highlightLines = useCallback(
    (editor) => {
      if (!editor) return;
      const lines = step.highlightLines || [];
      const newDecorations = lines.map((line) => ({
        range: {
          startLineNumber: line,
          startColumn: 1,
          endLineNumber: line,
          endColumn: 1,
        },
        options: {
          isWholeLine: true,
          className: "highlighted-line",
          linesDecorationsClassName: "highlighted-line-gutter",
        },
      }));
      decorationsRef.current = editor.deltaDecorations(
        decorationsRef.current,
        newDecorations
      );
    },
    [step]
  );

  const handleEditorMount = (editor) => {
    editorRef.current = editor;
    highlightLines(editor);
  };

  const goToStep = (idx) => {
    setCurrentStep(idx);
    setTimeout(() => {
      if (editorRef.current) {
        const lines = DRY_RUN_STEPS[idx].highlightLines || [];
        const newDecorations = lines.map((line) => ({
          range: {
            startLineNumber: line,
            startColumn: 1,
            endLineNumber: line,
            endColumn: 1,
          },
          options: {
            isWholeLine: true,
            className: "highlighted-line",
            linesDecorationsClassName: "highlighted-line-gutter",
          },
        }));
        decorationsRef.current = editorRef.current.deltaDecorations(
          decorationsRef.current,
          newDecorations
        );
        if (lines.length > 0) {
          editorRef.current.revealLineInCenter(lines[0]);
        }
      }
    }, 50);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <motion.div
        className="w-full max-w-7xl"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-10">
          <p className="text-cyan-400 font-mono text-sm tracking-widest mb-2">
            05 / 08
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Java Implementation{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              & Dry Run
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Trace through the complete Kruskal's Algorithm implementation
            step-by-step
          </p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Code Editor Panel */}
          <motion.div
            variants={itemVariants}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-semibold text-white">
                KruskalMST.java
              </span>
              <div className="ml-auto flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/70" />
                <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
              </div>
            </div>
            <Editor
              height="460px"
              language="java"
              theme="vs-dark"
              value={JAVA_CODE}
              onMount={handleEditorMount}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 14,
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                renderLineHighlight: "none",
                contextmenu: false,
                overviewRulerBorder: false,
                hideCursorInOverviewRuler: true,
                scrollbar: {
                  vertical: "auto",
                  horizontal: "auto",
                  verticalScrollbarSize: 8,
                },
                padding: { top: 12 },
              }}
            />
          </motion.div>

          {/* Dry Run Panel */}
          <motion.div
            variants={itemVariants}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col"
          >
            {/* Stepper Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
              <Footprints className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-semibold text-white">
                Dry Run — Step {currentStep} / {DRY_RUN_STEPS.length - 1}
              </span>
            </div>

            {/* Step Timeline */}
            <div className="px-4 pt-4 pb-2">
              <div className="flex items-center gap-1 overflow-x-auto pb-2">
                {DRY_RUN_STEPS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => goToStep(i)}
                    className={`flex-shrink-0 w-8 h-8 rounded-lg text-xs font-bold transition-all duration-200 border ${
                      i === currentStep
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 border-cyan-400/50 text-white scale-110"
                        : i < currentStep
                        ? s.accepted === true
                          ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                          : s.accepted === false
                          ? "bg-rose-500/20 border-rose-500/30 text-rose-400"
                          : "bg-white/10 border-white/10 text-gray-400"
                        : "bg-white/5 border-white/10 text-gray-500 hover:bg-white/10"
                    }`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div className="flex-1 px-4 pb-4 overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Step Title */}
                  <div className="flex items-center gap-2 mb-3">
                    {step.accepted === true && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    )}
                    {step.accepted === false && (
                      <XCircle className="w-5 h-5 text-rose-400" />
                    )}
                    {step.accepted === null && (
                      <Play className="w-5 h-5 text-cyan-400" />
                    )}
                    <h3 className="text-lg font-bold text-white">
                      {step.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Find Calls */}
                  {step.findCalls.length > 0 && (
                    <div className="mb-4 space-y-2">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Find Calls
                      </p>
                      <div className="flex gap-3">
                        {step.findCalls.map((fc, i) => (
                          <div
                            key={i}
                            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-mono text-sm"
                          >
                            <span className="text-cyan-400">find</span>
                            <span className="text-gray-400">(</span>
                            <span className="text-amber-400">{fc.arg}</span>
                            <span className="text-gray-400">)</span>
                            <span className="text-gray-500"> → </span>
                            <span className="text-emerald-400">{fc.result}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Union Result */}
                  {step.unionResult !== null && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Union Result
                      </p>
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold ${
                          step.unionResult
                            ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                            : "bg-rose-500/15 border border-rose-500/30 text-rose-400"
                        }`}
                      >
                        {step.unionResult ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" /> Merged — Edge
                            added to MST
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4" /> Rejected — Would
                            create cycle
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Arrays */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        parent[]
                      </p>
                      <div className="flex gap-1">
                        {step.parent.map((val, i) => (
                          <div
                            key={i}
                            className="flex flex-col items-center bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 min-w-[40px]"
                          >
                            <span className="text-[10px] text-gray-500">
                              {LABEL_MAP[i]}
                            </span>
                            <span className="text-sm font-bold text-cyan-400 font-mono">
                              {LABEL_MAP[val]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        rank[]
                      </p>
                      <div className="flex gap-1">
                        {step.rank.map((val, i) => (
                          <div
                            key={i}
                            className="flex flex-col items-center bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 min-w-[40px]"
                          >
                            <span className="text-[10px] text-gray-500">
                              {LABEL_MAP[i]}
                            </span>
                            <span className="text-sm font-bold text-amber-400 font-mono">
                              {val}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* MST Edges so far */}
                  {step.mstEdges.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        MST Edges ({step.mstEdges.length}) — Weight:{" "}
                        {step.totalWeight}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {step.mstEdges.map((e, i) => (
                          <span
                            key={i}
                            className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-2 py-1 rounded-lg text-xs font-mono"
                          >
                            {LABEL_MAP[e[0]]}-{LABEL_MAP[e[1]]}:{e[2]}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Summary Card at last step */}
                  {isLast && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                      className="mt-5 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 rounded-2xl p-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <h4 className="text-white font-bold">
                          MST Complete!
                        </h4>
                      </div>
                      <p className="text-gray-300 text-sm">
                        Total MST Weight:{" "}
                        <span className="text-emerald-400 font-bold text-lg">
                          {step.totalWeight}
                        </span>
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        {step.mstEdges.length} edges selected out of 9 total
                        edges
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Step Navigation */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-white/10 bg-white/5">
              <button
                onClick={() => goToStep(Math.max(0, currentStep - 1))}
                disabled={isFirst}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-white/10 hover:bg-white/15 text-gray-300"
              >
                <ChevronLeft className="w-4 h-4" /> Previous Step
              </button>
              <button
                onClick={() => goToStep(0)}
                className="p-2 rounded-xl text-gray-500 hover:text-cyan-400 hover:bg-white/10 transition-all"
                title="Reset"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  goToStep(
                    Math.min(DRY_RUN_STEPS.length - 1, currentStep + 1)
                  )
                }
                disabled={isLast}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white"
              >
                Next Step <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Section Navigation */}
        <motion.div
          variants={itemVariants}
          className="flex justify-between items-center mt-10"
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

      {/* Monaco highlight styles injected via a style tag */}
      <style>{`
        .highlighted-line {
          background: rgba(34, 211, 238, 0.08) !important;
          border-left: 3px solid rgba(34, 211, 238, 0.6) !important;
        }
        .highlighted-line-gutter {
          background: rgba(34, 211, 238, 0.3) !important;
          width: 3px !important;
          margin-left: 3px;
        }
      `}</style>
    </section>
  );
}
