import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ManualMSTBuilder } from '../components/quiz/ManualMSTBuilder';
import { CodingChallengeRunner } from '../components/quiz/CodingChallengeRunner';

export default function ChallengePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('builder');

  return (
    <div className="w-full space-y-10 py-2">
      {/* Chapter Label & Main Heading */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold text-[#66765B] dark:text-[#8C9D81] tracking-wider uppercase">
            Chapter 08 · Practical Challenge
          </span>
          <span className="text-[#999A91] dark:text-[#7E8077] text-xs">·</span>
          <span className="text-xs text-[#77786F] dark:text-[#A6A79E]">
            Hands-on Application
          </span>
        </div>

        <h1 className="font-heading text-3xl sm:text-4xl text-[#252720] dark:text-[#EDECE6] font-semibold tracking-tight leading-tight">
          Apply Your Learning: Builder & Code Challenge
        </h1>

        <p className="text-base text-[#77786F] dark:text-[#A6A79E] max-w-3xl leading-relaxed">
          Prove your mastery through two practical assessments: manually construct an MST on a 7-node network with real DSU validation, then evaluate your Java Kruskal MST solver across 5 test suites.
        </p>

        {/* Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => setActiveTab('builder')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-colors ${
              activeTab === 'builder'
                ? 'bg-[#66765B] text-white shadow-xs'
                : 'bg-[#EFEEE8] dark:bg-[#242823] text-[#77786F] dark:text-[#A6A79E] hover:text-[#252720] dark:hover:text-white border border-[#E4E3DC] dark:border-[#2D332C]'
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            <span>Activity 1: Manual MST Builder</span>
          </button>

          <button
            onClick={() => setActiveTab('coder')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-colors ${
              activeTab === 'coder'
                ? 'bg-[#66765B] text-white shadow-xs'
                : 'bg-[#EFEEE8] dark:bg-[#242823] text-[#77786F] dark:text-[#A6A79E] hover:text-[#252720] dark:hover:text-white border border-[#E4E3DC] dark:border-[#2D332C]'
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
            <span>Activity 2: Java Coding Challenge & Test Runner</span>
          </button>
        </div>
      </div>

      {activeTab === 'builder' ? (
        <ManualMSTBuilder />
      ) : (
        <CodingChallengeRunner />
      )}

      <div className="flex justify-end pt-4">
        <button
          onClick={() => navigate('/completion')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#66765B] hover:bg-[#57644E] text-white font-medium text-xs shadow-xs transition-colors"
        >
          <span>Complete Curriculum & View Certificate</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
    </div>
  );
}
