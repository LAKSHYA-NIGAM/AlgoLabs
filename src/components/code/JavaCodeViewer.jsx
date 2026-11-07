import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { JAVA_SOURCE_CODE, JAVA_DRY_RUN_STEPS } from '../../data/javaCurriculumCode';
import { useTheme } from '../../context/ThemeContext';

export function JavaCodeViewer() {
  const { isDark } = useTheme();
  const [stepIndex, setStepIndex] = useState(0);
  const editorRef = useRef(null);
  const decorationsRef = useRef([]);

  const currentStep = JAVA_DRY_RUN_STEPS[stepIndex] || JAVA_DRY_RUN_STEPS[0];

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    highlightLine(currentStep.line);
  };

  const highlightLine = (lineNumber) => {
    if (!editorRef.current) return;
    const editor = editorRef.current;

    editor.revealLineInCenter(lineNumber);

    decorationsRef.current = editor.deltaDecorations(decorationsRef.current, [
      {
        range: {
          startLineNumber: lineNumber,
          startColumn: 1,
          endLineNumber: lineNumber,
          endColumn: 1
        },
        options: {
          isWholeLine: true,
          className: isDark ? 'bg-[#2E2715] border-l-4 border-[#C79A4D]' : 'bg-[#FDF6E8] border-l-4 border-[#B58A43]',
        }
      }
    ]);
  };

  useEffect(() => {
    if (editorRef.current) {
      highlightLine(currentStep.line);
    }
  }, [stepIndex, currentStep.line, isDark]);

  const handleNext = () => {
    if (stepIndex < JAVA_DRY_RUN_STEPS.length - 1) {
      setStepIndex(stepIndex + 1);
    }
  };

  const handlePrev = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  };

  const handleReset = () => {
    setStepIndex(0);
  };

  return (
    <div className="space-y-6">
      {/* Educational Notice Banner Card */}
      <div className="p-4 rounded-xl bg-[#EFEEE8] dark:bg-[#242823] border border-[#E4E3DC] dark:border-[#2D332C] text-xs text-[#252720] dark:text-[#EDECE6] flex items-start gap-3">
        <span className="w-5 h-5 rounded-md bg-[#66765B] text-white flex items-center justify-center font-mono font-bold text-[11px] shrink-0 mt-0.5">
          i
        </span>
        <div className="leading-relaxed">
          <strong className="text-[#252720] dark:text-[#EDECE6] font-semibold block mb-0.5">
            Client-Side Guided Execution Simulation
          </strong>
          This interactive dry-run demonstrates the algorithmic execution order of OpenJDK Java 17 bytecode. Active lines synchronize directly with stack variables and heap memory without requiring a server-side JVM.
        </div>
      </div>

      {/* Main Split Grid: Monaco Editor + Live Variables Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Monaco Editor Container (7 cols on lg) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#1E211D] rounded-2xl border border-[#E4E3DC] dark:border-[#2D332C] overflow-hidden flex flex-col shadow-xs transition-colors">
          <div className="bg-[#EFEEE8] dark:bg-[#242823] px-5 py-3 border-b border-[#E4E3DC] dark:border-[#2D332C] flex items-center justify-between text-xs text-[#77786F] dark:text-[#A6A79E]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#66765B]" />
              <span className="font-mono font-semibold text-[#252720] dark:text-[#EDECE6]">KruskalMST.java</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono">Line {currentStep.line}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white dark:bg-[#1E211D] text-[#252720] dark:text-[#EDECE6] border border-[#E4E3DC] dark:border-[#2D332C]">
                Java 17
              </span>
            </div>
          </div>

          <div className="h-[460px] w-full">
            <Editor
              height="100%"
              defaultLanguage="java"
              theme={isDark ? 'vs-dark' : 'vs'}
              value={JAVA_SOURCE_CODE}
              onMount={handleEditorDidMount}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 13,
                fontFamily: "'JetBrains Mono', monospace",
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                renderLineHighlight: 'all',
                folding: true,
                padding: { top: 14, bottom: 14 }
              }}
            />
          </div>
        </div>

        {/* Live Variables & DSU Arrays Watcher (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col">
          <div className="bg-white dark:bg-[#1E211D] rounded-2xl border border-[#E4E3DC] dark:border-[#2D332C] p-5 shadow-xs space-y-4 transition-colors">
            {/* Step Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#ECEBE5] dark:border-[#232822]">
              <div>
                <h4 className="text-xs font-heading font-semibold uppercase tracking-wider text-[#252720] dark:text-[#EDECE6]">
                  State & Variable Inspector
                </h4>
                <span className="text-[11px] text-[#77786F] dark:text-[#A6A79E]">Active execution context</span>
              </div>
              <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-[#EFEEE8] dark:bg-[#242823] text-[#252720] dark:text-[#EDECE6]">
                Step {stepIndex + 1} / {JAVA_DRY_RUN_STEPS.length}
              </span>
            </div>

            {/* Explanation of current line */}
            <div className="p-3.5 rounded-xl bg-[#EFEEE8] dark:bg-[#242823] text-xs text-[#252720] dark:text-[#EDECE6] leading-relaxed">
              {currentStep.description}
            </div>

            {/* Current Stack Frame Variables */}
            <div className="space-y-2">
              <span className="text-[11px] font-heading font-semibold text-[#77786F] dark:text-[#A6A79E] uppercase tracking-wider block">
                Local Variables
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {Object.entries(currentStep.variables || {}).map(([key, val]) => (
                  <div
                    key={key}
                    className="p-2 rounded-lg bg-[#EFEEE8] dark:bg-[#242823] border border-[#E4E3DC] dark:border-[#2D332C] flex items-center justify-between"
                  >
                    <span className="text-[#77786F] dark:text-[#A6A79E]">{key}:</span>
                    <strong className="text-[#252720] dark:text-[#EDECE6] font-semibold">{String(val)}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Parent Array Watch */}
            {currentStep.parent && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-heading font-semibold text-[#77786F] dark:text-[#A6A79E]">
                  <span className="uppercase tracking-wider">DSU parent[] Array</span>
                  <span className="font-mono text-[10px]">V = 5</span>
                </div>
                <div className="overflow-x-auto rounded-xl border border-[#E4E3DC] dark:border-[#2D332C]">
                  <table className="w-full text-center border-collapse text-xs font-mono">
                    <thead>
                      <tr className="bg-[#EFEEE8] dark:bg-[#242823] text-[#77786F] dark:text-[#A6A79E] text-[10px]">
                        <th className="p-1.5 border-b border-[#E4E3DC] dark:border-[#2D332C]">Node</th>
                        {['0', '1', '2', '3', '4'].map((l) => (
                          <th key={l} className="p-1.5 border-b border-[#E4E3DC] dark:border-[#2D332C] font-semibold text-[#252720] dark:text-[#EDECE6]">
                            {l}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white dark:bg-[#1E211D]">
                        <td className="p-1.5 font-sans font-medium text-[#77786F] dark:text-[#A6A79E] text-[10px]">parent</td>
                        {currentStep.parent.map((p, i) => (
                          <td
                            key={i}
                            className={`p-1.5 font-semibold ${
                              p === i
                                ? 'bg-[#EBF0E8] dark:bg-[#232C21] text-[#47533F] dark:text-[#8C9D81]'
                                : 'text-[#77786F] dark:text-[#A6A79E]'
                            }`}
                          >
                            {p}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Stepper Controls */}
            <div className="pt-2 flex items-center justify-between gap-3 border-t border-[#ECEBE5] dark:border-[#232822]">
              <button
                onClick={handleReset}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#EFEEE8] dark:bg-[#242823] hover:bg-[#E7E6DF] dark:hover:bg-[#31372F] text-[#252720] dark:text-[#EDECE6] border border-[#E4E3DC] dark:border-[#2D332C] transition-all"
              >
                Reset to Line 1
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  disabled={stepIndex === 0}
                  className="px-3 py-1.5 rounded-lg bg-[#EFEEE8] dark:bg-[#242823] hover:bg-[#E7E6DF] dark:hover:bg-[#31372F] text-[#252720] dark:text-[#EDECE6] disabled:opacity-30 disabled:cursor-not-allowed border border-[#E4E3DC] dark:border-[#2D332C] text-xs font-medium transition-all"
                  title="Previous Line"
                >
                  Previous Line
                </button>

                <button
                  onClick={handleNext}
                  disabled={stepIndex >= JAVA_DRY_RUN_STEPS.length - 1}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#66765B] hover:bg-[#58664E] disabled:opacity-30 disabled:cursor-not-allowed shadow-xs transition-all hover:translate-x-0.5"
                >
                  Step Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
