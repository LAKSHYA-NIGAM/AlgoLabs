import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ComplexityPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full space-y-10 py-2">
      {/* Chapter Label & Main Heading */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold text-[#66765B] dark:text-[#8C9D81] tracking-wider uppercase">
            Chapter 06 · Analysis
          </span>
          <span className="text-[#999A91] dark:text-[#7E8077] text-xs">·</span>
          <span className="text-xs text-[#77786F] dark:text-[#A6A79E]">
            Asymptotic Runtime & Space Bounds
          </span>
        </div>

        <h1 className="font-heading text-3xl sm:text-4xl text-[#252720] dark:text-[#EDECE6] font-semibold tracking-tight leading-tight">
          Time & Space Complexity
        </h1>

        <p className="text-base text-[#77786F] dark:text-[#A6A79E] max-w-3xl leading-relaxed">
          Understanding the asymptotic bounds of Kruskal's algorithm and why edge sorting dominates runtime while Disjoint Set Union operations run in near-constant time.
        </p>
      </div>

      {/* 2 Main Columns: Time & Space Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Time Complexity Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#1E211D] border border-[#E4E3DC] dark:border-[#2D332C] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#ECEBE5] dark:border-[#232822]">
            <h3 className="font-heading font-semibold text-base text-[#252720] dark:text-[#EDECE6]">
              Time Complexity: O(E log E)
            </h3>
            <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-[#EBF0E8] dark:bg-[#232C21] text-[#47533F] dark:text-[#8C9D81]">
              Optimal for Sparse Graphs
            </span>
          </div>

          <div className="space-y-3 text-xs text-[#77786F] dark:text-[#A6A79E]">
            <div className="p-3.5 rounded-xl bg-[#EFEEE8] dark:bg-[#242823] border border-[#E4E3DC] dark:border-[#2D332C] space-y-1">
              <div className="font-heading font-semibold text-[#252720] dark:text-[#EDECE6] flex justify-between">
                <span>1. Sorting All Edges</span>
                <span className="font-mono text-[#66765B] dark:text-[#8C9D81]">O(E log E)</span>
              </div>
              <p className="leading-relaxed">
                Comparison-based sorting over $E$ edges using Dual-Pivot Quicksort / TimSort. This step is the computational bottleneck of the entire algorithm.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#EFEEE8] dark:bg-[#242823] border border-[#E4E3DC] dark:border-[#2D332C] space-y-1">
              <div className="font-heading font-semibold text-[#252720] dark:text-[#EDECE6] flex justify-between">
                <span>2. DSU Find & Union Operations</span>
                <span className="font-mono text-[#477B5C] dark:text-[#529E70]">O(E · α(V))</span>
              </div>
              <p className="leading-relaxed">
                At most $2E$ Find operations and $V - 1$ Union operations. Path compression combined with union by rank guarantees near $O(1)$ amortized time per call.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#EBF0E8] dark:bg-[#232C21] border border-[#C5D1C1] text-[#47533F] dark:text-[#8C9D81] leading-relaxed">
              <strong>Dominance Law:</strong> Because E ≤ V², log E ≤ 2 log V. Hence O(E log E) = O(E log V). The sorting phase strictly dominates the O(E · α(V)) DSU operations.
            </div>
          </div>
        </div>

        {/* Space Complexity Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#1E211D] border border-[#E4E3DC] dark:border-[#2D332C] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#ECEBE5] dark:border-[#232822]">
            <h3 className="font-heading font-semibold text-base text-[#252720] dark:text-[#EDECE6]">
              Space Complexity: O(V + E)
            </h3>
            <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-[#EFEEE8] dark:bg-[#242823] text-[#252720] dark:text-[#EDECE6]">
              Linear Scaling
            </span>
          </div>

          <div className="space-y-3 text-xs text-[#77786F] dark:text-[#A6A79E]">
            <div className="p-3.5 rounded-xl bg-[#EFEEE8] dark:bg-[#242823] border border-[#E4E3DC] dark:border-[#2D332C] space-y-1">
              <div className="font-heading font-semibold text-[#252720] dark:text-[#EDECE6] flex justify-between">
                <span>1. DSU Auxiliary Arrays</span>
                <span className="font-mono text-[#66765B] dark:text-[#8C9D81]">O(V)</span>
              </div>
              <p className="leading-relaxed">
                Allocates two contiguous integer arrays: <code>parent[V]</code> and <code>rank[V]</code>. Highly cache-friendly with zero dynamic node pointer overhead.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#EFEEE8] dark:bg-[#242823] border border-[#E4E3DC] dark:border-[#2D332C] space-y-1">
              <div className="font-heading font-semibold text-[#252720] dark:text-[#EDECE6] flex justify-between">
                <span>2. Edge List Storage</span>
                <span className="font-mono text-[#66765B] dark:text-[#8C9D81]">O(E)</span>
              </div>
              <p className="leading-relaxed">
                Stores the input edge records and the resulting <code>mstEdges</code> output list of strictly $V - 1$ selected links.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#EFEEE8] dark:bg-[#242823] border border-[#E4E3DC] dark:border-[#2D332C] text-[#252720] dark:text-[#EDECE6] leading-relaxed">
              <strong>Comparison with Prim's:</strong> Kruskal requires no adjacency matrix ($O(V^2)$ memory), enabling it to run efficiently on massive sparse graphs with millions of vertices.
            </div>
          </div>
        </div>
      </div>

      {/* Comparative Table: Kruskal vs Prim */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#1E211D] border border-[#E4E3DC] dark:border-[#2D332C] space-y-4">
        <h3 className="font-heading font-semibold text-base text-[#252720] dark:text-[#EDECE6]">
          Comparative Matrix: Kruskal vs. Prim
        </h3>

        <div className="overflow-x-auto rounded-xl border border-[#E4E3DC] dark:border-[#2D332C]">
          <table className="w-full text-center border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-[#EFEEE8] dark:bg-[#242823] text-[#77786F] dark:text-[#A6A79E] text-[11px] font-sans">
                <th className="p-3 text-left border-b border-[#E4E3DC] dark:border-[#2D332C]">Algorithm</th>
                <th className="p-3 border-b border-[#E4E3DC] dark:border-[#2D332C]">Time Complexity</th>
                <th className="p-3 border-b border-[#E4E3DC] dark:border-[#2D332C]">Space Complexity</th>
                <th className="p-3 text-left border-b border-[#E4E3DC] dark:border-[#2D332C]">Ideal Graph Type</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white dark:bg-[#1E211D]">
                <td className="p-3 text-left font-sans font-semibold text-[#66765B] dark:text-[#8C9D81] border-b border-[#ECEBE5] dark:border-[#232822]">
                  Kruskal's Algorithm
                </td>
                <td className="p-3 border-b border-[#ECEBE5] dark:border-[#232822] text-[#252720] dark:text-[#EDECE6]">
                  O(E log E)
                </td>
                <td className="p-3 border-b border-[#ECEBE5] dark:border-[#232822] text-[#252720] dark:text-[#EDECE6]">
                  O(V + E)
                </td>
                <td className="p-3 text-left font-sans text-[#77786F] dark:text-[#A6A79E] border-b border-[#ECEBE5] dark:border-[#232822]">
                  Sparse Graphs (E ≪ V²)
                </td>
              </tr>
              <tr className="bg-[#EFEEE8] dark:bg-[#242823]">
                <td className="p-3 text-left font-sans font-semibold text-[#252720] dark:text-[#EDECE6]">
                  Prim's (with Fibonacci Heap)
                </td>
                <td className="p-3 text-[#252720] dark:text-[#EDECE6]">
                  O(E + V log V)
                </td>
                <td className="p-3 text-[#252720] dark:text-[#EDECE6]">
                  O(V + E)
                </td>
                <td className="p-3 text-left font-sans text-[#77786F] dark:text-[#A6A79E]">
                  Dense Graphs (E ≈ V²)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* The Inverse Ackermann Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#1E211D] border border-[#E4E3DC] dark:border-[#2D332C] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#ECEBE5] dark:border-[#232822]">
          <div>
            <h3 className="font-heading font-semibold text-base text-[#252720] dark:text-[#EDECE6]">
              The Inverse Ackermann Function: α(n) ≤ 4
            </h3>
            <p className="text-xs text-[#77786F] dark:text-[#A6A79E]">
              Why DSU operations run in practical constant time for all conceivable inputs.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#E4E3DC] dark:border-[#2D332C]">
          <table className="w-full text-center border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-[#EFEEE8] dark:bg-[#242823] text-[#77786F] dark:text-[#A6A79E] text-[11px] font-sans">
                <th className="p-3 text-left border-b border-[#E4E3DC] dark:border-[#2D332C]">Input Size n</th>
                <th className="p-3 border-b border-[#E4E3DC] dark:border-[#2D332C]">Value of α(n)</th>
                <th className="p-3 text-left border-b border-[#E4E3DC] dark:border-[#2D332C]">Physical Benchmark</th>
              </tr>
            </thead>
            <tbody className="text-[#252720] dark:text-[#EDECE6]">
              <tr className="bg-white dark:bg-[#1E211D]">
                <td className="p-2.5 text-left border-b border-[#ECEBE5] dark:border-[#232822]">1</td>
                <td className="p-2.5 border-b border-[#ECEBE5] dark:border-[#232822] font-semibold">0</td>
                <td className="p-2.5 text-left font-sans text-[#77786F] dark:text-[#A6A79E] border-b border-[#ECEBE5] dark:border-[#232822]">Single vertex</td>
              </tr>
              <tr className="bg-[#EFEEE8] dark:bg-[#242823]">
                <td className="p-2.5 text-left border-b border-[#ECEBE5] dark:border-[#232822]">4</td>
                <td className="p-2.5 border-b border-[#ECEBE5] dark:border-[#232822] font-semibold">1</td>
                <td className="p-2.5 text-left font-sans text-[#77786F] dark:text-[#A6A79E] border-b border-[#ECEBE5] dark:border-[#232822]">Small network</td>
              </tr>
              <tr className="bg-white dark:bg-[#1E211D]">
                <td className="p-2.5 text-left border-b border-[#ECEBE5] dark:border-[#232822]">16</td>
                <td className="p-2.5 border-b border-[#ECEBE5] dark:border-[#232822] font-semibold">2</td>
                <td className="p-2.5 text-left font-sans text-[#77786F] dark:text-[#A6A79E] border-b border-[#ECEBE5] dark:border-[#232822]">Medium network</td>
              </tr>
              <tr className="bg-[#EFEEE8] dark:bg-[#242823]">
                <td className="p-2.5 text-left border-b border-[#ECEBE5] dark:border-[#232822]">65,536</td>
                <td className="p-2.5 border-b border-[#ECEBE5] dark:border-[#232822] font-semibold">3</td>
                <td className="p-2.5 text-left font-sans text-[#77786F] dark:text-[#A6A79E] border-b border-[#ECEBE5] dark:border-[#232822]">Enterprise graph</td>
              </tr>
              <tr className="bg-[#EBF0E8] dark:bg-[#232C21] text-[#47533F] dark:text-[#8C9D81]">
                <td className="p-2.5 text-left font-semibold">2^65536 &gt; 10^80 (Total Atoms in Universe)</td>
                <td className="p-2.5 font-bold">4</td>
                <td className="p-2.5 text-left font-sans">Cosmological upper bound</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="pt-6 border-t border-[#ECEBE5] dark:border-[#232822] flex items-center justify-between">
        <button
          onClick={() => navigate('/java-walkthrough')}
          className="text-xs text-[#77786F] dark:text-[#A6A79E] hover:text-[#252720] dark:hover:text-[#EDECE6] font-medium"
        >
          ← Back to Java Code
        </button>

        <button
          onClick={() => navigate('/quiz')}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#66765B] hover:bg-[#58664E] shadow-xs transition-all hover:translate-x-0.5"
        >
          <span>Proceed to Concept Quiz</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
