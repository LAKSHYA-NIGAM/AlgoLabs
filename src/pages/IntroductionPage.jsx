import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SVGGraph } from '../components/graph/SVGGraph';

export default function IntroductionPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('mst'); // 'all' | 'mst'

  // 6 metropolitan hubs (V = 6)
  const cityVertices = [
    { id: 'DEL', label: 'DEL', x: 280, y: 70 },
    { id: 'MUM', label: 'MUM', x: 110, y: 175 },
    { id: 'KOL', label: 'KOL', x: 450, y: 145 },
    { id: 'HYD', label: 'HYD', x: 260, y: 235 },
    { id: 'BLR', label: 'BLR', x: 150, y: 335 },
    { id: 'CHE', label: 'CHE', x: 380, y: 325 },
  ];

  // 9 candidate fiber-optic corridors (E = 9)
  const cityEdges = [
    { id: 'DEL-MUM', u: 'DEL', v: 'MUM', weight: 14 },
    { id: 'DEL-KOL', u: 'DEL', v: 'KOL', weight: 7 },
    { id: 'DEL-HYD', u: 'DEL', v: 'HYD', weight: 9 },
    { id: 'MUM-BLR', u: 'MUM', v: 'BLR', weight: 8 },
    { id: 'MUM-HYD', u: 'MUM', v: 'HYD', weight: 11 },
    { id: 'KOL-HYD', u: 'KOL', v: 'HYD', weight: 10 },
    { id: 'HYD-CHE', u: 'HYD', v: 'CHE', weight: 3 },
    { id: 'HYD-BLR', u: 'HYD', v: 'BLR', weight: 6 },
    { id: 'BLR-CHE', u: 'BLR', v: 'CHE', weight: 4 },
  ];

  // Mathematical MST: HYD-CHE (3), BLR-CHE (4), DEL-KOL (7), MUM-BLR (8), DEL-HYD (9) = Total 31
  // Rejected: HYD-BLR (cycle), KOL-HYD (cycle), MUM-HYD (cycle), DEL-MUM (cycle)
  const mstStatuses = {
    'HYD-CHE': 'accepted',
    'BLR-CHE': 'accepted',
    'DEL-KOL': 'accepted',
    'MUM-BLR': 'accepted',
    'DEL-HYD': 'accepted',
    'HYD-BLR': 'rejected',
    'KOL-HYD': 'rejected',
    'MUM-HYD': 'rejected',
    'DEL-MUM': 'rejected'
  };

  const currentStatuses = viewMode === 'mst' ? mstStatuses : {};

  return (
    <div className="w-full space-y-12 py-2">
      
      {/* 1. CHAPTER LABEL & 2. MAIN HEADING */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold text-[#66765B] dark:text-[#8C9D81] tracking-wider uppercase">
            Chapter 01 · Foundations
          </span>
          <span className="text-[#999A91] dark:text-[#7E8077] text-xs">·</span>
          <span className="text-xs text-[#77786F] dark:text-[#A6A79E]">
            45-Minute Interactive Masterclass
          </span>
        </div>

        <h1 className="font-heading text-3xl sm:text-4xl text-[#252720] dark:text-[#EDECE6] font-semibold tracking-tight leading-tight">
          Connecting Cities with Fiber Optics
        </h1>

        {/* 3. SHORT REAL-WORLD PROBLEM EXPLANATION */}
        <p className="text-base sm:text-lg text-[#77786F] dark:text-[#A6A79E] max-w-3xl leading-relaxed">
          Imagine a telecommunications consortium tasking you with linking 6 major Indian metropolitan hubs using high-speed fiber-optic lines. Laying underground cable costs millions per kilometer. We must connect every single city to the global network, but with zero wasteful loops and at the absolute minimum total expenditure.
        </p>
      </div>

      {/* 4. LEARNING OBJECTIVES */}
      <div className="p-6 rounded-2xl bg-[#EFEEE8] dark:bg-[#242823] border border-[#E4E3DC] dark:border-[#2D332C] space-y-4">
        <div className="text-xs font-heading font-semibold text-[#252720] dark:text-[#EDECE6] uppercase tracking-wider">
          What You Will Master in This Lesson
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#77786F] dark:text-[#A6A79E]">
          <div className="space-y-1.5">
            <span className="font-mono font-semibold text-[#66765B] dark:text-[#8C9D81] block text-sm">
              01 · Graph Models
            </span>
            <p className="leading-relaxed">
              Model physical systems with vertices ($V$) representing cities and weighted edges ($E$) representing trenching costs.
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="font-mono font-semibold text-[#66765B] dark:text-[#8C9D81] block text-sm">
              02 · The Tree Invariant
            </span>
            <p className="leading-relaxed">
              Prove why spanning any connected graph of $V$ nodes requires strictly $V - 1$ links with no redundant closed cycles.
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="font-mono font-semibold text-[#66765B] dark:text-[#8C9D81] block text-sm">
              03 · Kruskal’s Strategy
            </span>
            <p className="leading-relaxed">
              Execute Kruskal's greedy algorithm with Disjoint Set Union (DSU) to guarantee a globally minimal network in O(E log E) time.
            </p>
          </div>
        </div>
      </div>

      {/* 5. LARGE INTERACTIVE SIX-CITY GRAPH (MAIN VISUAL FOCUS) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-lg text-[#252720] dark:text-[#EDECE6] font-semibold">
              Metropolitan Fiber Network Backbone
            </h2>
            <p className="text-xs text-[#77786F] dark:text-[#A6A79E]">
              6 Data Centers ($V = 6$) · 9 Feasible Corridors ($E = 9$) · Edge weights in ₹ Millions
            </p>
          </div>

          {/* Interactive State Toggle Buttons */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-[#EFEEE8] dark:bg-[#242823] border border-[#E4E3DC] dark:border-[#2D332C] self-start sm:self-auto">
            <button
              onClick={() => setViewMode('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'all'
                  ? 'bg-white dark:bg-[#1E211D] text-[#252720] dark:text-[#EDECE6] shadow-xs font-semibold'
                  : 'text-[#77786F] dark:text-[#A6A79E] hover:text-[#252720] dark:hover:text-white'
              }`}
            >
              All 9 Candidate Links (Cost: ₹72M)
            </button>
            <button
              onClick={() => setViewMode('mst')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'mst'
                  ? 'bg-[#66765B] text-white shadow-xs font-semibold'
                  : 'text-[#77786F] dark:text-[#A6A79E] hover:text-[#252720] dark:hover:text-white'
              }`}
            >
              Optimal MST: 5 Links (Cost: ₹31M)
            </button>
          </div>
        </div>

        {/* Central Graph Visualizer */}
        <div className="w-full">
          <SVGGraph
            vertices={cityVertices}
            edges={cityEdges}
            edgeStatuses={currentStatuses}
            width={560}
            height={380}
          />
        </div>

        {/* Graph Status Pill Metrics */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-[#1E211D] border border-[#E4E3DC] dark:border-[#2D332C] text-xs">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${viewMode === 'mst' ? 'bg-[#66765B]' : 'bg-[#B58A43]'}`} />
            <span className="font-medium text-[#252720] dark:text-[#EDECE6]">
              {viewMode === 'mst' ? 'Optimal Minimum Spanning Tree' : 'Unoptimized Full Mesh Candidate Graph'}
            </span>
          </div>

          <div className="flex items-center gap-6 font-mono">
            <div>
              <span className="text-[#999A91] dark:text-[#7E8077]">Active Links: </span>
              <strong className="text-[#252720] dark:text-[#EDECE6]">{viewMode === 'mst' ? '5 of 9' : '9 of 9'}</strong>
            </div>
            <div>
              <span className="text-[#999A91] dark:text-[#7E8077]">Total Construction: </span>
              <strong className={viewMode === 'mst' ? 'text-[#477B5C] dark:text-[#529E70]' : 'text-[#B65E57] dark:text-[#D96A62]'}>
                ₹{viewMode === 'mst' ? '31' : '72'} Million
              </strong>
            </div>
            {viewMode === 'mst' && (
              <div className="hidden sm:block text-[#477B5C] dark:text-[#529E70] font-semibold">
                Savings: ₹41 Million (57% reduction)
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 6. THREE CONCISE SUPPORTING EXPLANATIONS */}
      <div className="space-y-4">
        <h3 className="font-heading text-lg text-[#252720] dark:text-[#EDECE6] font-semibold">
          The Three Golden Rules of Minimum Spanning Trees
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#1E211D] border border-[#E4E3DC] dark:border-[#2D332C] space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-[#EFEEE8] dark:bg-[#242823] text-[#66765B] dark:text-[#8C9D81] font-mono text-xs font-semibold flex items-center justify-center">
                1
              </span>
              <h4 className="font-heading font-semibold text-sm text-[#252720] dark:text-[#EDECE6]">
                The Greedy Choice
              </h4>
            </div>
            <p className="text-xs text-[#77786F] dark:text-[#A6A79E] leading-relaxed">
              Always inspect the cheapest available link first. Kruskal sorts all edges in ascending order of cost (O(E log E)) to evaluate candidates systematically.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#1E211D] border border-[#E4E3DC] dark:border-[#2D332C] space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-[#EFEEE8] dark:bg-[#242823] text-[#66765B] dark:text-[#8C9D81] font-mono text-xs font-semibold flex items-center justify-center">
                2
              </span>
              <h4 className="font-heading font-semibold text-sm text-[#252720] dark:text-[#EDECE6]">
                The Zero-Cycle Invariant
              </h4>
            </div>
            <p className="text-xs text-[#77786F] dark:text-[#A6A79E] leading-relaxed">
              If two cities are already connected via existing fiber, adding another link forms a closed loop. Kruskal uses Disjoint Set Union (DSU) to reject cycles in near $O(1)$ time.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#1E211D] border border-[#E4E3DC] dark:border-[#2D332C] space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-[#EFEEE8] dark:bg-[#242823] text-[#66765B] dark:text-[#8C9D81] font-mono text-xs font-semibold flex items-center justify-center">
                3
              </span>
              <h4 className="font-heading font-semibold text-sm text-[#252720] dark:text-[#EDECE6]">
                Strictly V - 1 Edges
              </h4>
            </div>
            <p className="text-xs text-[#77786F] dark:text-[#A6A79E] leading-relaxed">
              For any connected graph with $V$ vertices, a spanning tree requires strictly $V - 1$ edges. For our 6 cities, exactly 5 links form full connectivity; algorithm stops immediately.
            </p>
          </div>
        </div>
      </div>

      {/* 7. CLEAR START LEARNING / CONTINUE BUTTON */}
      <div className="pt-6 border-t border-[#ECEBE5] dark:border-[#232822] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-medium text-[#77786F] dark:text-[#A6A79E] block">
            Ready to dive into graph theory?
          </span>
          <span className="font-heading text-sm text-[#252720] dark:text-[#EDECE6] font-semibold">
            Module 02: Graph Terminology & Spanning Trees
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/visualizer')}
            className="px-4 py-2.5 rounded-xl text-xs font-medium bg-[#EFEEE8] dark:bg-[#242823] hover:bg-[#E7E6DF] dark:hover:bg-[#31372F] text-[#252720] dark:text-[#EDECE6] border border-[#E4E3DC] dark:border-[#2D332C] transition-all"
          >
            Jump to Simulation
          </button>

          <button
            onClick={() => navigate('/foundations')}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#66765B] hover:bg-[#58664E] shadow-xs transition-all hover:translate-x-0.5"
          >
            <span>Start Learning: Foundations</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

    </div>
  );
}
