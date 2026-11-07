import React, { useState } from 'react';
import { MANUAL_CHALLENGE_GRAPH } from '../../data/challengeData';
import { SVGGraph } from '../graph/SVGGraph';
import { DSU } from '../../algorithms/dsu.js';
import { loadProgress, saveProgress } from '../../utils/storage';

export function ManualMSTBuilder() {
  const { vertices, edges } = MANUAL_CHALLENGE_GRAPH;
  const n = vertices.length;

  const vMap = new Map();
  vertices.forEach((v, i) => vMap.set(v.id, i));

  const [selectedEdgeIds, setSelectedEdgeIds] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [completed, setCompleted] = useState(false);

  const currentDsu = new DSU(n);
  let currentCost = 0;
  const edgeStatuses = {};

  edges.forEach((e) => {
    if (selectedEdgeIds.includes(e.id)) {
      currentDsu.union(vMap.get(e.u), vMap.get(e.v));
      currentCost += e.weight;
      edgeStatuses[e.id] = 'accepted';
    } else {
      edgeStatuses[e.id] = 'unprocessed';
    }
  });

  const handleEdgeClick = (edge) => {
    if (completed) return;

    if (selectedEdgeIds.includes(edge.id)) {
      const updated = selectedEdgeIds.filter(id => id !== edge.id);
      setSelectedEdgeIds(updated);
      setFeedback({ type: 'info', msg: `Removed edge ${edge.u}-${edge.v} (weight: ${edge.weight}) from candidate MST set.` });
      return;
    }

    if (selectedEdgeIds.length >= n - 1) {
      setFeedback({
        type: 'error',
        msg: `A tree on ${n} vertices requires strictly ${n - 1} edges. You already have ${n - 1} edges selected.`
      });
      return;
    }

    // Check if adding this edge creates an instant cycle using DSU clone
    const testDsu = currentDsu.clone();
    const uIdx = vMap.get(edge.u);
    const vIdx = vMap.get(edge.v);
    const unionRes = testDsu.union(uIdx, vIdx);

    if (!unionRes.success) {
      setFeedback({
        type: 'error',
        msg: `Cycle Rejected! Vertices ${edge.u} and ${edge.v} already share canonical root ${unionRes.rootX}. Adding weight ${edge.weight} creates a loop.`
      });
      return;
    }

    const nextSelected = [...selectedEdgeIds, edge.id];
    setSelectedEdgeIds(nextSelected);

    if (nextSelected.length === n - 1) {
      // Check total cost against optimal MST cost
      const totalSelectedCost = edges
        .filter(e => nextSelected.includes(e.id))
        .reduce((sum, e) => sum + e.weight, 0);

      if (totalSelectedCost === MANUAL_CHALLENGE_GRAPH.expectedCost) {
        setCompleted(true);
        setFeedback({
          type: 'success',
          msg: `Challenge Mastered! You constructed the exact Minimum Spanning Tree with ${n - 1} edges and optimal cost ${totalSelectedCost}!`
        });

        const curSaved = loadProgress();
        saveProgress({
          ...curSaved,
          manualChallengeCompleted: true
        });
      } else {
        setFeedback({
          type: 'error',
          msg: `Valid Spanning Tree constructed with ${n - 1} edges, but cost ${totalSelectedCost} is higher than the minimal cost ${MANUAL_CHALLENGE_GRAPH.expectedCost}. Prioritize cheapest edges first!`
        });
      }
    } else {
      setFeedback({
        type: 'info',
        msg: `Accepted edge ${edge.u}-${edge.v} (weight: ${edge.weight}). No cycle detected. Pick ${n - 1 - nextSelected.length} more.`
      });
    }
  };

  const handleReset = () => {
    setSelectedEdgeIds([]);
    setFeedback(null);
    setCompleted(false);
  };

  return (
    <div className="bg-white dark:bg-[#1E211D] rounded-2xl border border-[#E4E3DC] dark:border-[#2D332C] p-6 sm:p-8 space-y-6 transition-colors">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#ECEBE5] dark:border-[#232822]">
        <div>
          <h3 className="font-heading font-semibold text-base text-[#252720] dark:text-[#EDECE6] flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#66765B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.45 1-1 1H7" />
              <path d="M14 14.66V17c0 .55.45 1 1 1h2" />
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
            </svg>
            Activity 1: Manual MST Builder (7 Vertices)
          </h3>
          <p className="text-xs text-[#77786F] dark:text-[#A6A79E] mt-0.5">
            Select edges in ascending order. Disjoint Set Union automatically validates cycle rejection in real time.
          </p>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-3 bg-[#EFEEE8] dark:bg-[#242823] px-4 py-2 rounded-xl border border-[#E4E3DC] dark:border-[#2D332C]">
          <div>
            <span className="text-[10px] text-[#77786F] dark:text-[#A6A79E] uppercase font-semibold block">Selected</span>
            <span className="text-xs font-semibold text-[#252720] dark:text-[#EDECE6] font-mono">
              {selectedEdgeIds.length} / {n - 1} Edges
            </span>
          </div>
          <div className="w-[1px] h-6 bg-[#E4E3DC] dark:border-[#2D332C]" />
          <div>
            <span className="text-[10px] text-[#77786F] dark:text-[#A6A79E] uppercase font-semibold block">Cost</span>
            <span className="text-sm font-semibold text-[#477B5C] dark:text-[#529E70] font-mono">{currentCost}</span>
          </div>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-white dark:bg-[#1E211D] hover:bg-[#E5E4DC] dark:hover:bg-[#2C3038] text-[#77786F] dark:text-[#A6A79E] border border-[#E4E3DC] dark:border-[#2D332C] ml-1 transition-colors"
            title="Reset Graph"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
          </button>
        </div>
      </div>

      {/* Dynamic Feedback Banner */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl border text-xs sm:text-sm flex items-start gap-2.5 ${
            feedback.type === 'success'
              ? 'bg-[#EBF0E8] dark:bg-[#232C21] border-[#C5D1C1] dark:border-[#265438] text-[#47533F] dark:text-[#8C9D81]'
              : feedback.type === 'error'
              ? 'bg-[#FAF0EF] dark:bg-[#2D1817] border-[#F0D5D3] dark:border-[#5E2825] text-[#B65E57] dark:text-[#F59690]'
              : 'bg-[#EFEEE8] dark:bg-[#242823] border-[#E4E3DC] dark:border-[#2D332C] text-[#252720] dark:text-[#EDECE6]'
          }`}
        >
          {feedback.type === 'success' ? (
            <span className="text-[#477B5C] dark:text-[#529E70] shrink-0 mt-0.5">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 8.5 6.5 12 13 4" />
              </svg>
            </span>
          ) : feedback.type === 'error' ? (
            <span className="text-[#B65E57] dark:text-[#D96A62] shrink-0 mt-0.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </span>
          ) : (
            <span className="text-[#66765B] dark:text-[#8C9D81] shrink-0 mt-0.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </span>
          )}
          <span className="leading-relaxed font-medium">{feedback.msg}</span>
        </div>
      )}

      {/* SVG Graph & Edge Candidate Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-2">
          <SVGGraph
            vertices={vertices}
            edges={edges}
            edgeStatuses={edgeStatuses}
            onEdgeClick={handleEdgeClick}
            isInteractive={true}
          />
          <div className="text-center text-[11px] text-[#77786F] dark:text-[#A6A79E]">
            Click any edge in the graph diagram or candidate list to toggle selection.
          </div>
        </div>

        {/* Candidate Edges Table */}
        <div className="lg:col-span-4 bg-[#EFEEE8] dark:bg-[#242823] rounded-2xl border border-[#E4E3DC] dark:border-[#2D332C] p-4 flex flex-col justify-between max-h-[420px]">
          <div className="text-xs font-heading font-semibold text-[#252720] dark:text-[#EDECE6] uppercase tracking-wider mb-2.5 pb-2 border-b border-[#E4E3DC] dark:border-[#2D332C]">
            Candidate Edges (Weight Sorted)
          </div>

          <div className="space-y-1.5 overflow-y-auto pr-1">
            {[...edges].sort((a, b) => a.weight - b.weight).map((e) => {
              const isSelected = selectedEdgeIds.includes(e.id);
              return (
                <button
                  key={e.id}
                  onClick={() => handleEdgeClick(e)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs border transition-colors ${
                    isSelected
                      ? 'bg-[#EBF0E8] dark:bg-[#232C21] border-[#C5D1C1] dark:border-[#265438] text-[#47533F] dark:text-[#8C9D81] font-semibold shadow-xs'
                      : 'bg-white dark:bg-[#1E211D] border-[#E4E3DC] dark:border-[#2D332C] hover:bg-[#FAF9F5] dark:hover:bg-[#2A2F27] text-[#252720] dark:text-[#EDECE6]'
                  }`}
                >
                  <span className="font-mono font-medium">{e.u} ↔ {e.v}</span>
                  <span className="font-mono font-medium">w: {e.weight}</span>
                  <span className="text-[10px] uppercase font-semibold">{isSelected ? '✓ In MST' : '+ Add'}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
