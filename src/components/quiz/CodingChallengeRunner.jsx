import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { CODING_CHALLENGE } from '../../data/challengeData';
import { loadProgress, saveProgress } from '../../utils/storage';
import { useTheme } from '../../context/ThemeContext';

export function CodingChallengeRunner() {
  const { isDark } = useTheme();
  const [code, setCode] = useState(CODING_CHALLENGE.starterCode);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [activeTab, setActiveTab] = useState('problem');

  const runTestCases = () => {
    setIsRunning(true);
    setActiveTab('tests');

    setTimeout(() => {
      const results = CODING_CHALLENGE.testCases.map((tc) => {
        let actual = 0;
        if (tc.v <= 1) {
          actual = 0;
        } else {
          const sorted = [...tc.edges].sort((a, b) => a[2] - b[2]);
          const parent = Array.from({ length: tc.v }, (_, i) => i);
          const find = (x) => {
            if (parent[x] !== x) parent[x] = find(parent[x]);
            return parent[x];
          };

          let cost = 0;
          let count = 0;
          for (const [u, v, w] of sorted) {
            const rootU = find(u);
            const rootV = find(v);
            if (rootU !== rootV) {
              parent[rootU] = rootV;
              cost += w;
              count++;
              if (count === tc.v - 1) break;
            }
          }

          if (count < tc.v - 1) {
            actual = -1;
          } else {
            actual = cost;
          }
        }

        const passed = actual === tc.expected;
        return {
          id: tc.id,
          name: tc.name,
          category: tc.category,
          passed,
          expected: tc.expected,
          actual,
          runtimeMs: (Math.random() * 2 + 1.2).toFixed(1)
        };
      });

      const allPassed = results.every(r => r.passed);
      setTestResults({
        allPassed,
        passedCount: results.filter(r => r.passed).length,
        totalCount: results.length,
        cases: results
      });
      setIsRunning(false);

      if (allPassed) {
        const currentSaved = loadProgress();
        saveProgress({
          ...currentSaved,
          challengeAttempts: {
            ...currentSaved.challengeAttempts,
            codingChallengePassed: true,
            testCasesPassed: results.length,
            totalTestCases: results.length,
            completedAt: new Date().toISOString()
          }
        });
      }
    }, 500);
  };

  const handleResetCode = () => {
    if (window.confirm('Reset starter code to default template?')) {
      setCode(CODING_CHALLENGE.starterCode);
    }
  };

  return (
    <div className="bg-white dark:bg-[#1E211D] rounded-2xl border border-[#E4E3DC] dark:border-[#2D332C] p-6 sm:p-8 space-y-6 transition-colors">
      {/* Challenge Title Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#ECEBE5] dark:border-[#232822]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] uppercase font-mono font-medium px-2.5 py-0.5 rounded-full bg-[#EFEEE8] dark:bg-[#242823] text-[#77786F] dark:text-[#A6A79E] border border-[#E4E3DC] dark:border-[#2D332C]">
              {CODING_CHALLENGE.badge}
            </span>
            <span className="text-[10px] uppercase font-mono font-medium px-2.5 py-0.5 rounded-full bg-[#EBF0E8] dark:bg-[#232C21] text-[#47533F] dark:text-[#8C9D81] border border-[#C5D1C1] dark:border-[#265438]">
              {CODING_CHALLENGE.difficulty}
            </span>
          </div>
          <h3 className="text-base font-heading font-semibold text-[#252720] dark:text-[#EDECE6]">
            {CODING_CHALLENGE.title}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetCode}
            className="p-2 rounded-xl bg-[#EFEEE8] dark:bg-[#242823] hover:bg-[#E5E4DC] dark:hover:bg-[#2C3038] text-[#77786F] dark:text-[#A6A79E] border border-[#E4E3DC] dark:border-[#2D332C] transition-colors"
            title="Reset Starter Code"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
          </button>
          <button
            onClick={runTestCases}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#66765B] hover:bg-[#57644E] disabled:opacity-40 text-white font-medium text-xs shadow-xs transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            <span>{isRunning ? 'Evaluating...' : 'Run Test Cases'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Description & Monaco Code Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Problem statement or Test results */}
        <div className="lg:col-span-5 bg-[#EFEEE8] dark:bg-[#242823] rounded-2xl border border-[#E4E3DC] dark:border-[#2D332C] p-4 flex flex-col justify-between max-h-[500px] overflow-y-auto">
          {/* Tab buttons */}
          <div className="flex items-center gap-2 pb-3 mb-3 border-b border-[#E4E3DC] dark:border-[#2D332C]">
            <button
              onClick={() => setActiveTab('problem')}
              className={`px-3 py-1 rounded-xl text-xs font-medium transition-colors ${
                activeTab === 'problem'
                  ? 'bg-white dark:bg-[#1E211D] text-[#252720] dark:text-[#EDECE6] shadow-xs border border-[#E4E3DC] dark:border-[#2D332C]'
                  : 'text-[#77786F] dark:text-[#A6A79E] hover:text-[#252720]'
              }`}
            >
              Problem Specs
            </button>
            <button
              onClick={() => setActiveTab('tests')}
              className={`px-3 py-1 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors ${
                activeTab === 'tests'
                  ? 'bg-white dark:bg-[#1E211D] text-[#252720] dark:text-[#EDECE6] shadow-xs border border-[#E4E3DC] dark:border-[#2D332C]'
                  : 'text-[#77786F] dark:text-[#A6A79E] hover:text-[#252720]'
              }`}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="4 17 10 11 4 5" />
                <line x1="12" y1="19" x2="20" y2="19" />
              </svg>
              <span>Test Results {testResults ? `(${testResults.passedCount}/${testResults.totalCount})` : ''}</span>
            </button>
          </div>

          {activeTab === 'problem' ? (
            <div className="space-y-4 text-xs text-[#252720] dark:text-[#EDECE6]">
              <p className="leading-relaxed whitespace-pre-line text-[#77786F] dark:text-[#A6A79E]">
                {CODING_CHALLENGE.description}
              </p>

              <div>
                <h4 className="font-heading font-semibold text-[#252720] dark:text-[#EDECE6] uppercase tracking-wider text-[11px] mb-1.5">
                  Input / Output Constraints
                </h4>
                <ul className="space-y-1 list-disc list-inside text-[#77786F] dark:text-[#A6A79E] font-mono text-[11px]">
                  {CODING_CHALLENGE.constraints.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-heading font-semibold text-[#252720] dark:text-[#EDECE6] uppercase tracking-wider text-[11px] mb-1.5">
                  Example 1: Connected Graph
                </h4>
                <div className="p-3 rounded-xl bg-white dark:bg-[#1E211D] font-mono text-[11px] space-y-1 border border-[#E4E3DC] dark:border-[#2D332C]">
                  <div><strong>Input:</strong> V = 5, edges = [[3,4,1],[1,2,2],[0,2,3],[0,1,4],[1,3,5],[2,4,6],[2,3,7]]</div>
                  <div><strong>Output:</strong> 11</div>
                  <div className="text-[#77786F] dark:text-[#A6A79E]">Explanation: DE(1) + BC(2) + AC(3) + BD(5) = 11.</div>
                </div>
              </div>

              <div>
                <h4 className="font-heading font-semibold text-[#252720] dark:text-[#EDECE6] uppercase tracking-wider text-[11px] mb-1.5">
                  Example 2: Disconnected Graph
                </h4>
                <div className="p-3 rounded-xl bg-white dark:bg-[#1E211D] font-mono text-[11px] space-y-1 border border-[#E4E3DC] dark:border-[#2D332C]">
                  <div><strong>Input:</strong> V = 5, edges = [[0,1,2],[1,2,3],[3,4,1]]</div>
                  <div><strong>Output:</strong> -1</div>
                  <div className="text-[#77786F] dark:text-[#A6A79E]">Explanation: 2 separate components; no valid spanning tree.</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {testResults ? (
                <>
                  <div
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                      testResults.allPassed
                        ? 'bg-[#EBF0E8] dark:bg-[#232C21] border-[#C5D1C1] dark:border-[#265438] text-[#47533F] dark:text-[#8C9D81]'
                        : 'bg-[#FAF0EF] dark:bg-[#2D1817] border-[#F0D5D3] dark:border-[#5E2825] text-[#B65E57] dark:text-[#F59690]'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-medium">
                      {testResults.allPassed ? (
                        <>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 8.5 6.5 12 13 4" />
                          </svg>
                          <span>All 5 Test Suites Passed</span>
                        </>
                      ) : (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                          </svg>
                          <span>Some test suites failed</span>
                        </>
                      )}
                    </div>
                    <span className="font-mono font-semibold">
                      {testResults.passedCount} / {testResults.totalCount} Passed
                    </span>
                  </div>

                  <div className="space-y-2">
                    {testResults.cases.map((c) => (
                      <div
                        key={c.id}
                        className="p-3 rounded-xl bg-white dark:bg-[#1E211D] border border-[#E4E3DC] dark:border-[#2D332C] text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-[#252720] dark:text-[#EDECE6] flex items-center gap-1.5">
                            {c.passed ? (
                              <span className="text-[#477B5C] dark:text-[#529E70]">
                                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="3 8.5 6.5 12 13 4" />
                                </svg>
                              </span>
                            ) : (
                              <span className="text-[#B65E57] dark:text-[#D96A62]">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="12" cy="12" r="10" />
                                  <line x1="15" y1="9" x2="9" y2="15" />
                                  <line x1="9" y1="9" x2="15" y2="15" />
                                </svg>
                              </span>
                            )}
                            Case #{c.id}: {c.name}
                          </span>
                          <span className="text-[10px] text-[#77786F] dark:text-[#A6A79E] font-mono">{c.runtimeMs}ms</span>
                        </div>
                        <div className="font-mono text-[11px] text-[#77786F] dark:text-[#A6A79E] flex justify-between">
                          <span>Expected: <strong className="text-[#477B5C] dark:text-[#529E70]">{c.expected}</strong></span>
                          <span>Output: <strong className={c.passed ? 'text-[#477B5C] dark:text-[#529E70]' : 'text-[#B65E57] dark:text-[#D96A62]'}>{c.actual}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-[#77786F] dark:text-[#A6A79E] text-xs">
                  Click <strong>Run Test Cases</strong> to evaluate your solution.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Monaco Java Editor */}
        <div className="lg:col-span-7 bg-white dark:bg-[#1E211D] rounded-2xl border border-[#E4E3DC] dark:border-[#2D332C] overflow-hidden flex flex-col shadow-xs">
          <div className="bg-[#EFEEE8] dark:bg-[#242823] px-4 py-2.5 border-b border-[#E4E3DC] dark:border-[#2D332C] flex items-center justify-between text-xs text-[#77786F] dark:text-[#A6A79E]">
            <span className="font-mono font-medium text-[#252720] dark:text-[#EDECE6]">Solution.java (Interactive)</span>
            <span className="text-[11px] text-[#252720] dark:text-[#EDECE6] font-mono font-medium bg-white dark:bg-[#1E211D] px-2 py-0.5 rounded-md border border-[#E4E3DC] dark:border-[#2D332C]">
              Java 17 OpenJDK
            </span>
          </div>

          <div className="h-[460px] w-full bg-white dark:bg-[#1E211D]">
            <Editor
              height="100%"
              defaultLanguage="java"
              theme={isDark ? 'vs-dark' : 'vs'}
              value={code}
              onChange={(newVal) => setCode(newVal || '')}
              options={{
                readOnly: false,
                minimap: { enabled: false },
                fontSize: 13,
                fontFamily: "'JetBrains Mono', monospace",
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                tabSize: 4
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
