import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MCQAssessment } from '../components/quiz/MCQAssessment';

export default function QuizPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full space-y-10 py-2">
      {/* Chapter Label & Main Heading */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold text-[#66765B] dark:text-[#8C9D81] tracking-wider uppercase">
            Chapter 07 · Assessment
          </span>
          <span className="text-[#999A91] dark:text-[#7E8077] text-xs">·</span>
          <span className="text-xs text-[#77786F] dark:text-[#A6A79E]">
            Knowledge Verification
          </span>
        </div>

        <h1 className="font-heading text-3xl sm:text-4xl text-[#252720] dark:text-[#EDECE6] font-semibold tracking-tight leading-tight">
          Conceptual Knowledge Assessment
        </h1>

        <p className="text-base text-[#77786F] dark:text-[#A6A79E] max-w-3xl leading-relaxed">
          Test your mastery across 8 conceptual topics including spanning tree constraints, DSU path compression, union by rank, cycle detection, and asymptotic runtime.
        </p>
      </div>

      <MCQAssessment />

      <div className="flex justify-end pt-4">
        <button
          onClick={() => navigate('/challenge')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#66765B] hover:bg-[#57644E] text-white font-medium text-xs shadow-xs transition-colors"
        >
          <span>Proceed to Hands-on Challenge</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
    </div>
  );
}
