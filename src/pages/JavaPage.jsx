import React from 'react';
import { useNavigate } from 'react-router-dom';
import { JavaCodeViewer } from '../components/code/JavaCodeViewer';

export default function JavaPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full space-y-8 py-2">
      {/* Chapter Label & Main Heading */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold text-[#66765B] dark:text-[#8C9D81] tracking-wider uppercase">
            Chapter 05 · Code
          </span>
          <span className="text-[#999A91] dark:text-[#7E8077] text-xs">·</span>
          <span className="text-xs text-[#77786F] dark:text-[#A6A79E]">
            Production Java Implementation
          </span>
        </div>

        <h1 className="font-heading text-3xl sm:text-4xl text-[#252720] dark:text-[#EDECE6] font-semibold tracking-tight leading-tight">
          Java Implementation & Execution Walkthrough
        </h1>

        <p className="text-base text-[#77786F] dark:text-[#A6A79E] max-w-3xl leading-relaxed">
          Inspect the complete Java implementation featuring the <code>Edge</code> comparable class, the <code>DSU</code> disjoint set union structure with recursive path compression, and the core <code>kruskalMST()</code> greedy loop.
        </p>
      </div>

      {/* Main Monaco Java Viewer & Stepper */}
      <JavaCodeViewer />

      {/* Navigation Footer */}
      <div className="pt-6 border-t border-[#ECEBE5] dark:border-[#232822] flex items-center justify-between">
        <button
          onClick={() => navigate('/visualizer')}
          className="text-xs text-[#77786F] dark:text-[#A6A79E] hover:text-[#252720] dark:hover:text-[#EDECE6] font-medium"
        >
          ← Back to Simulation
        </button>

        <button
          onClick={() => navigate('/complexity')}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#66765B] hover:bg-[#58664E] shadow-xs transition-all hover:translate-x-0.5"
        >
          <span>Proceed to Complexity Analysis</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
