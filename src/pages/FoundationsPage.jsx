import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SVGGraph } from '../components/graph/SVGGraph';

export default function FoundationsPage() {
  const navigate = useNavigate();
  const [activeStage, setActiveStage] = useState('mst'); // 'graph' | 'weighted' | 'cycles' | 'tree' | 'mst'
  const [leafQuizAnswered, setLeafQuizAnswered] = useState(false);
  const [selectedLeaf, setSelectedLeaf] = useState(null);

  // 5-node educational sample graph
  const sampleNodes = [
    { id: 'A', label: 'A', x: 180, y: 90 },
    { id: 'B', label: 'B', x: 380, y: 90 },
    { id: 'C', label: 'C', x: 430, y: 280 },
    { id: 'D', label: 'D', x: 280, y: 350 },
    { id: 'E', label: 'E', x: 130, y: 280 },
  ];

  const fullEdges = [
    { id: 'AB', u: 'A', v: 'B', weight: 4 },
    { id: 'BC', u: 'B', v: 'C', weight: 2 },
    { id: 'CD', u: 'C', v: 'D', weight: 5 },
    { id: 'DE', u: 'D', v: 'E', weight: 1 },
    { id: 'EA', u: 'E', v: 'A', weight: 6 },
    { id: 'BD', u: 'B', v: 'D', weight: 3 },
    { id: 'AD', u: 'A', v: 'D', weight: 7 },
  ];

  const getEdgeStatuses = () => {
    switch (activeStage) {
      case 'graph':
      case 'weighted':
        return {};
      case 'cycles':
        return {
          AB: 'current',
          BD: 'current',
          AD: 'current',
          BC: 'unprocessed',
          CD: 'unprocessed',
          DE: 'unprocessed',
          EA: 'unprocessed'
        };
      case 'tree':
        return {
          AB: 'accepted',
          BC: 'accepted',
          CD: 'accepted',
          DE: 'accepted',
          EA: 'rejected',
          BD: 'rejected',
          AD: 'rejected'
        };
      case 'mst':
      default:
        return {
          DE: 'accepted',
          BC: 'accepted',
          BD: 'accepted',
          AB: 'accepted',
          CD: 'rejected',
          EA: 'rejected',
          AD: 'rejected'
        };
    }
  };

  const handleLeafClick = (node) => {
    setSelectedLeaf(node.id);
    setLeafQuizAnswered(true);
  };

  const isLeafCorrect = selectedLeaf === 'A' || selectedLeaf === 'C' || selectedLeaf === 'E';

  return (
    <div className="w-full space-y-10 py-2">
      {/* Chapter Label & Main Heading */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold text-[#66765B] dark:text-[#8C9D81] tracking-wider uppercase">
            Chapter 02 · Theory
          </span>
          <span className="text-[#999A91] dark:text-[#7E8077] text-xs">·</span>
          <span className="text-xs text-[#77786F] dark:text-[#A6A79E]">
            Graph Terminology & Spanning Trees
          </span>
        </div>

        <h1 className="font-heading text-3xl sm:text-4xl text-[#252720] dark:text-[#EDECE6] font-semibold tracking-tight leading-tight">
          Graph Fundamentals & Trees
        </h1>

        <p className="text-base text-[#77786F] dark:text-[#A6A79E] max-w-3xl leading-relaxed">
          Before analyzing greedy edge selection, we must formalize the mathematical definitions of <strong>Vertices</strong>, <strong>Edges</strong>, <strong>Cycles</strong>, and what distinguishes an ordinary tree from a <strong>Minimum Spanning Tree</strong>.
        </p>
      </div>

      {/* Progressive Concept Stepper */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-[#EFEEE8] dark:bg-[#242823] border border-[#E4E3DC] dark:border-[#2D332C]">
        {[
          { id: 'graph', label: '1. Vertices & Edges' },
          { id: 'weighted', label: '2. Weights & Connectivity' },
          { id: 'cycles', label: '3. Cycles vs Trees' },
          { id: 'tree', label: '4. Spanning Tree (Cost: 12)' },
          { id: 'mst', label: '5. Minimum Spanning Tree (Cost: 10)' },
        ].map((stage) => (
          <button
            key={stage.id}
            onClick={() => setActiveStage(stage.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeStage === stage.id
                ? 'bg-[#66765B] text-white font-semibold shadow-xs'
                : 'text-[#77786F] dark:text-[#A6A79E] hover:text-[#252720] dark:hover:text-[#EDECE6]'
            }`}
          >
            {stage.label}
          </button>
        ))}
      </div>

      {/* Main Graph & Concept Card Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive SVG Graph */}
        <div className="lg:col-span-7 space-y-3">
          <SVGGraph
            vertices={sampleNodes}
            edges={fullEdges}
            edgeStatuses={getEdgeStatuses()}
            onNodeClick={handleLeafClick}
            isInteractive={true}
            width={560}
            height={390}
          />
          <div className="text-center text-xs text-[#77786F] dark:text-[#A6A79E]">
            Click any vertex (A, B, C, D, E) on the graph to test the leaf node check below.
          </div>
        </div>

        {/* Right: Step Explanation Card */}
        <div className="lg:col-span-5 space-y-5">
          {activeStage === 'graph' && (
            <div className="p-6 rounded-2xl bg-white dark:bg-[#1E211D] border border-[#E4E3DC] dark:border-[#2D332C] space-y-3">
              <span className="font-mono text-xs text-[#66765B] dark:text-[#8C9D81] font-semibold block uppercase">
                Concept 01 · G = (V, E)
              </span>
              <h3 className="font-heading font-semibold text-base text-[#252720] dark:text-[#EDECE6]">
                Vertices and Edges
              </h3>
              <p className="text-xs text-[#77786F] dark:text-[#A6A79E] leading-relaxed">
                A graph $G = (V, E)$ consists of a set of <strong>Vertices</strong> ($|V| = 5$: A, B, C, D, E) and a set of <strong>Edges</strong> ($|E| = 7$). In an undirected graph, an edge $(u, v)$ represents a bidirectional channel between node $u$ and node $v$.
              </p>
              <div className="p-3 rounded-xl bg-[#EFEEE8] dark:bg-[#242823] font-mono text-xs text-[#252720] dark:text-[#EDECE6]">
                V = {'{A, B, C, D, E}'} · |E| = 7
              </div>
            </div>
          )}

          {activeStage === 'weighted' && (
            <div className="p-6 rounded-2xl bg-white dark:bg-[#1E211D] border border-[#E4E3DC] dark:border-[#2D332C] space-y-3">
              <span className="font-mono text-xs text-[#66765B] dark:text-[#8C9D81] font-semibold block uppercase">
                Concept 02 · Edge Weights
              </span>
              <h3 className="font-heading font-semibold text-base text-[#252720] dark:text-[#EDECE6]">
                Weighted & Connected Graphs
              </h3>
              <p className="text-xs text-[#77786F] dark:text-[#A6A79E] leading-relaxed">
                Each edge carries a numerical <strong>Weight</strong> ($w(e)$) representing distance, latency, or monetary cost. A graph is <strong>connected</strong> if there exists at least one continuous path between every pair of vertices.
              </p>
              <div className="p-3 rounded-xl bg-[#EFEEE8] dark:bg-[#242823] font-mono text-xs text-[#252720] dark:text-[#EDECE6]">
                Weight range: w(D, E) = 1 to w(A, D) = 7
              </div>
            </div>
          )}

          {activeStage === 'cycles' && (
            <div className="p-6 rounded-2xl bg-white dark:bg-[#1E211D] border border-[#E4E3DC] dark:border-[#2D332C] space-y-3">
              <span className="font-mono text-xs text-[#B58A43] font-semibold block uppercase">
                Concept 03 · Loop Prevention
              </span>
              <h3 className="font-heading font-semibold text-base text-[#252720] dark:text-[#EDECE6]">
                Cycles vs. Trees
              </h3>
              <p className="text-xs text-[#77786F] dark:text-[#A6A79E] leading-relaxed">
                A <strong>cycle</strong> is a path that starts and ends at the exact same vertex without repeating edges. For example, the highlighted path <code>A → B → D → A</code> is a closed cycle of cost $4 + 3 + 7 = 14$. A <strong>tree</strong> is defined as a connected graph that contains <strong>zero cycles</strong>.
              </p>
              <div className="p-3 rounded-xl bg-[#FDF6E8] dark:bg-[#2F2618] border border-[#E5C48A] text-xs text-[#8A6223] dark:text-[#C79A4D] font-medium">
                Invariant: Adding any edge to a tree creates strictly one cycle.
              </div>
            </div>
          )}

          {activeStage === 'tree' && (
            <div className="p-6 rounded-2xl bg-white dark:bg-[#1E211D] border border-[#E4E3DC] dark:border-[#2D332C] space-y-3">
              <span className="font-mono text-xs text-[#77786F] dark:text-[#A6A79E] font-semibold block uppercase">
                Concept 04 · Spanning Property
              </span>
              <h3 className="font-heading font-semibold text-base text-[#252720] dark:text-[#EDECE6]">
                What is a Spanning Tree?
              </h3>
              <p className="text-xs text-[#77786F] dark:text-[#A6A79E] leading-relaxed">
                A subgraph $T$ of $G$ is a <strong>spanning tree</strong> if it includes all $V$ vertices, connects them all together, and uses strictly <strong>$V - 1$ edges</strong> with zero cycles.
              </p>
              <div className="p-3 rounded-xl bg-[#EFEEE8] dark:bg-[#242823] font-mono text-xs text-[#252720] dark:text-[#EDECE6]">
                Edges: AB(4) + BC(2) + CD(5) + DE(1) = Total Cost 12
              </div>
            </div>
          )}

          {activeStage === 'mst' && (
            <div className="p-6 rounded-2xl bg-white dark:bg-[#1E211D] border border-[#E4E3DC] dark:border-[#2D332C] space-y-3">
              <span className="font-mono text-xs text-[#66765B] dark:text-[#8C9D81] font-semibold block uppercase">
                Concept 05 · The Optimum
              </span>
              <h3 className="font-heading font-semibold text-base text-[#252720] dark:text-[#EDECE6]">
                The Minimum Spanning Tree
              </h3>
              <p className="text-xs text-[#77786F] dark:text-[#A6A79E] leading-relaxed">
                Among all possible spanning trees, the <strong>Minimum Spanning Tree</strong> minimizes the sum of all edge weights: ∑ w(e). For this graph, the optimal edges are DE(1), BC(2), BD(3), and AB(4).
              </p>
              <div className="p-3 rounded-xl bg-[#EBF0E8] dark:bg-[#232C21] font-mono text-xs text-[#47533F] dark:text-[#8C9D81] font-semibold">
                MST Cost: 1 + 2 + 3 + 4 = 10 (Optimal)
              </div>
            </div>
          )}

          {/* Interactive Leaf Node Verification */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#1E211D] border border-[#E4E3DC] dark:border-[#2D332C] space-y-2.5">
            <div className="text-xs font-heading font-semibold text-[#252720] dark:text-[#EDECE6] uppercase tracking-wider">
              Interactive Check: Identify a Leaf Node
            </div>
            <p className="text-xs text-[#77786F] dark:text-[#A6A79E] leading-relaxed">
              A leaf node in a tree has a degree of 1 (connected by exactly one edge in the MST). Click on any node on the graph to test your intuition.
            </p>

            {leafQuizAnswered && (
              <div
                className={`p-3 rounded-xl border text-xs font-medium ${
                  isLeafCorrect
                    ? 'bg-[#EBF0E8] dark:bg-[#232C21] border-[#C5D1C1] text-[#47533F] dark:text-[#8C9D81]'
                    : 'bg-[#FDF2F1] dark:bg-[#2D1D1C] border-[#EFC8C5] text-[#8A3B35] dark:text-[#F59690]'
                }`}
              >
                {isLeafCorrect
                  ? `✓ Correct! Vertex ${selectedLeaf} has degree = 1 in this MST.`
                  : `✗ Vertex ${selectedLeaf} has degree > 1 in this tree.`}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Footer CTA */}
      <div className="pt-6 border-t border-[#ECEBE5] dark:border-[#232822] flex items-center justify-between">
        <button
          onClick={() => navigate('/introduction')}
          className="text-xs text-[#77786F] dark:text-[#A6A79E] hover:text-[#252720] dark:hover:text-[#EDECE6] font-medium"
        >
          ← Back to Introduction
        </button>

        <button
          onClick={() => navigate('/dsu')}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#66765B] hover:bg-[#58664E] shadow-xs transition-all hover:translate-x-0.5"
        >
          <span>Continue to DSU Engine</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
