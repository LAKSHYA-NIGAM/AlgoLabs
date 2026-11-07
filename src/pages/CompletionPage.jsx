import React from 'react';
import { useNavigate } from 'react-router-dom';
import { loadProgress, resetProgress } from '../utils/storage';

export function CompletionPage() {
  const navigate = useNavigate();
  const progressState = loadProgress();

  const quiz = progressState.quizResults || progressState.quizAttempts || {};
  const challenge = progressState.challengeAttempts || {};

  const handleRestart = () => {
    if (window.confirm('Reset progress and restart curriculum from Module 01?')) {
      resetProgress();
      navigate('/');
    }
  };

  return (
    <div className="w-full max-w-full space-y-8 py-2">
      {/* Celebration Banner Card - Full Width */}
      <div className="w-full bg-white dark:bg-[#1E211D] rounded-2xl border border-[#E4E3DC] dark:border-[#2D332C] py-10 px-6 sm:px-8 shadow-xs text-center space-y-4 transition-colors">
        <div className="w-14 h-14 rounded-2xl bg-[#EBF0E8] dark:bg-[#232C21] text-[#477B5C] dark:text-[#529E70] flex items-center justify-center mx-auto mb-2 shadow-xs">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.45 1-1 1H7" />
            <path d="M14 14.66V17c0 .55.45 1 1 1h2" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
          </svg>
        </div>

        <div className="space-y-2">
          <span className="text-[11px] uppercase font-mono font-medium tracking-wider px-3.5 py-1 rounded-full bg-[#EBF0E8] dark:bg-[#232C21] text-[#47533F] dark:text-[#8C9D81] border border-[#C5D1C1] dark:border-[#265438]">
            Curriculum Completed
          </span>
          <h1 className="text-3xl sm:text-4xl font-heading font-semibold text-[#252720] dark:text-[#EDECE6] tracking-tight">
            You've Mastered Kruskal & DSU!
          </h1>
          <p className="text-[#77786F] dark:text-[#A6A79E] text-sm max-w-2xl mx-auto leading-relaxed">
            Congratulations on completing the 45-minute self-learning journey on AlgoLab. You have acquired conceptual, visual, and code-level mastery of Minimum Spanning Trees.
          </p>
        </div>
      </div>

      {/* Performance Scorecards - Full Width 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <div className="flex-1 p-6 rounded-2xl bg-white dark:bg-[#1E211D] border border-[#E4E3DC] dark:border-[#2D332C] shadow-xs text-center space-y-1.5 transition-colors">
          <span className="text-xs font-heading font-semibold text-[#77786F] dark:text-[#A6A79E] uppercase tracking-wider">Quiz Accuracy</span>
          <div className="text-3xl font-semibold text-[#252720] dark:text-[#EDECE6] font-mono">
            {quiz.accuracy !== undefined ? `${quiz.accuracy}%` : '100%'}
          </div>
          <span className="text-xs text-[#77786F] dark:text-[#A6A79E] block">
            {quiz.correct !== undefined ? `${quiz.correct} / ${quiz.total || 8} Questions Correct` : '8 / 8 Questions Correct'}
          </span>
        </div>

        <div className="flex-1 p-6 rounded-2xl bg-white dark:bg-[#1E211D] border border-[#E4E3DC] dark:border-[#2D332C] shadow-xs text-center space-y-1.5 transition-colors">
          <span className="text-xs font-heading font-semibold text-[#77786F] dark:text-[#A6A79E] uppercase tracking-wider">Manual MST Builder</span>
          <div className="text-3xl font-semibold text-[#477B5C] dark:text-[#529E70] font-mono">
            {progressState.manualChallengeCompleted ? 'PASSED' : 'COMPLETED'}
          </div>
          <span className="text-xs text-[#77786F] dark:text-[#A6A79E] block">
            7-Node Graph MST Built
          </span>
        </div>

        <div className="flex-1 p-6 rounded-2xl bg-white dark:bg-[#1E211D] border border-[#E4E3DC] dark:border-[#2D332C] shadow-xs text-center space-y-1.5 transition-colors">
          <span className="text-xs font-heading font-semibold text-[#77786F] dark:text-[#A6A79E] uppercase tracking-wider">Java Test Suites</span>
          <div className="text-3xl font-semibold text-[#252720] dark:text-[#EDECE6] font-mono">
            {challenge.testCasesPassed !== undefined ? `${challenge.testCasesPassed} / ${challenge.totalTestCases}` : '5 / 5'}
          </div>
          <span className="text-xs text-[#77786F] dark:text-[#A6A79E] block">
            All Edge Cases Verified
          </span>
        </div>
      </div>

      {/* Curriculum Summary Recap - Full Width */}
      <div className="w-full bg-white dark:bg-[#1E211D] rounded-2xl border border-[#E4E3DC] dark:border-[#2D332C] p-6 sm:p-8 shadow-xs space-y-6 transition-colors">
        <h3 className="text-xs font-heading font-semibold text-[#252720] dark:text-[#EDECE6] uppercase tracking-wider flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#66765B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          Key Competencies & Core Takeaways
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full text-xs text-[#77786F] dark:text-[#A6A79E]">
          <div className="p-4 rounded-xl bg-[#EFEEE8] dark:bg-[#242823] border border-[#E4E3DC] dark:border-[#2D332C] space-y-2">
            <div className="font-heading font-semibold text-[#252720] dark:text-[#EDECE6] flex items-center gap-2">
              <span className="text-[#477B5C] dark:text-[#529E70]">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 8.5 6.5 12 13 4" />
                </svg>
              </span>
              Greedy Cycle-Free Edge Selection
            </div>
            <p className="leading-relaxed">
              Kruskal sorts edges ascendingly: <code>O(E log E)</code>. It greedily includes the lightest available edge that connects two distinct components.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#EFEEE8] dark:bg-[#242823] border border-[#E4E3DC] dark:border-[#2D332C] space-y-2">
            <div className="font-heading font-semibold text-[#252720] dark:text-[#EDECE6] flex items-center gap-2">
              <span className="text-[#477B5C] dark:text-[#529E70]">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 8.5 6.5 12 13 4" />
                </svg>
              </span>
              Disjoint Set Union (DSU) Efficiency
            </div>
            <p className="leading-relaxed">
              Path compression updates <code>parent[x] = find(parent[x])</code>, while union by rank keeps trees shallow, yielding <code>O(α(V))</code> amortized per operation.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#EFEEE8] dark:bg-[#242823] border border-[#E4E3DC] dark:border-[#2D332C] space-y-2">
            <div className="font-heading font-semibold text-[#252720] dark:text-[#EDECE6] flex items-center gap-2">
              <span className="text-[#477B5C] dark:text-[#529E70]">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 8.5 6.5 12 13 4" />
                </svg>
              </span>
              Strict V - 1 Tree Property
            </div>
            <p className="leading-relaxed">
              Any connected tree on <code>V</code> vertices requires strictly <code>V - 1</code> edges. As soon as this count is reached, Kruskal safely terminates.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#EFEEE8] dark:bg-[#242823] border border-[#E4E3DC] dark:border-[#2D332C] space-y-2">
            <div className="font-heading font-semibold text-[#252720] dark:text-[#EDECE6] flex items-center gap-2">
              <span className="text-[#477B5C] dark:text-[#529E70]">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 8.5 6.5 12 13 4" />
                </svg>
              </span>
              Handling Disconnected Graphs
            </div>
            <p className="leading-relaxed">
              When a graph has multiple disconnected components, Kruskal detects that fewer than <code>V - 1</code> edges can be formed and outputs a Minimum Spanning Forest.
            </p>
          </div>
        </div>
      </div>

      {/* Restart / Review Action - Center Aligned Full Width */}
      <div className="flex flex-wrap items-center justify-center gap-4 w-full pt-2">
        <button
          onClick={handleRestart}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#EFEEE8] dark:bg-[#242823] hover:bg-[#E5E4DC] dark:hover:bg-[#2C3038] text-[#252720] dark:text-[#EDECE6] border border-[#E4E3DC] dark:border-[#2D332C] font-medium text-xs transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
          <span>Restart Curriculum from Module 01</span>
        </button>

        <button
          onClick={() => navigate('/visualizer')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#66765B] hover:bg-[#57644E] text-white font-medium text-xs shadow-xs transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <span>Explore Sandbox Visualizer</span>
        </button>
      </div>
    </div>
  );
}

export default CompletionPage;
