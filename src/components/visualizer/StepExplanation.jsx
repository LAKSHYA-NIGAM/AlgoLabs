import React from 'react';

export function StepExplanation({
  currentSnapshot,
  totalVertices = 5,
  mstEdges = [],
  totalCost = 0,
}) {
  if (!currentSnapshot) {
    return (
      <div className="bg-white dark:bg-[#1E211D] rounded-2xl border border-[#E4E3DC] dark:border-[#2D332C] p-6 text-center text-[#77786F] dark:text-[#A6A79E] text-xs">
        Click Run Simulation or Step Next to begin Kruskal analysis.
      </div>
    );
  }

  const { title, explanation, decision, representatives } = currentSnapshot;

  const isAccepted = decision === 'ACCEPTED';
  const isRejected = decision === 'REJECTED';
  const isConsider = decision === 'PENDING';

  return (
    <div className="bg-white dark:bg-[#1E211D] rounded-2xl border border-[#E4E3DC] dark:border-[#2D332C] p-5 shadow-xs space-y-3.5 transition-colors">
      {/* Top Banner: Status Tag & Live Counters */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#ECEBE5] dark:border-[#232822]">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 ${
              isAccepted
                ? 'bg-[#EBF0E8] dark:bg-[#232C21] text-[#47533F] dark:text-[#8C9D81]'
                : isRejected
                ? 'bg-[#FDF2F1] dark:bg-[#2D1D1C] text-[#8A3B35] dark:text-[#F59690]'
                : isConsider
                ? 'bg-[#FDF6E8] dark:bg-[#2F2618] text-[#8A6223] dark:text-[#C79A4D]'
                : 'bg-[#EFEEE8] dark:bg-[#242823] text-[#77786F] dark:text-[#A6A79E]'
            }`}
          >
            {isAccepted ? (
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 8.5 6.5 12 13 4" />
              </svg>
            ) : isRejected ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <span className="w-2 h-2 rounded-full bg-current" />
            )}
          </div>
          <div>
            <h3 className="font-heading font-semibold text-sm text-[#252720] dark:text-[#EDECE6] tracking-tight">{title}</h3>
            <span className="text-[11px] text-[#77786F] dark:text-[#A6A79E]">Algorithm decision rationale</span>
          </div>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-3 bg-[#EFEEE8] dark:bg-[#242823] px-3.5 py-1.5 rounded-xl border border-[#E4E3DC] dark:border-[#2D332C]">
          <div>
            <span className="text-[10px] text-[#77786F] dark:text-[#A6A79E] uppercase block font-medium">MST Links</span>
            <span className="text-xs font-semibold text-[#252720] dark:text-[#EDECE6] font-mono">
              {mstEdges.length} / {Math.max(0, totalVertices - 1)}
            </span>
          </div>
          <div className="w-px h-5 bg-[#E4E3DC] dark:border-[#2D332C]" />
          <div>
            <span className="text-[10px] text-[#77786F] dark:text-[#A6A79E] uppercase block font-medium">Total Cost</span>
            <span className="text-xs font-semibold text-[#66765B] dark:text-[#8C9D81] font-mono">
              {totalCost}
            </span>
          </div>
        </div>
      </div>

      {/* Narrative Explanation */}
      <p className="text-xs text-[#77786F] dark:text-[#A6A79E] leading-relaxed">
        {explanation}
      </p>

      {/* DSU Canonical Representatives Comparison Badge */}
      {representatives && (
        <div className="p-3 rounded-xl bg-[#EFEEE8] dark:bg-[#242823] border border-[#E4E3DC] dark:border-[#2D332C] flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-[#77786F] dark:text-[#A6A79E]">Roots:</span>
            <span>Find({representatives.u}) = <strong>{representatives.rootU}</strong></span>
            <span className="text-[#999A91] dark:text-[#7E8077]">vs</span>
            <span>Find({representatives.v}) = <strong>{representatives.rootV}</strong></span>
          </div>

          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
            representatives.rootU !== representatives.rootV
              ? 'bg-[#EBF0E8] dark:bg-[#232C21] text-[#47533F] dark:text-[#8C9D81]'
              : 'bg-[#FDF2F1] dark:bg-[#2D1D1C] text-[#8A3B35] dark:text-[#F59690]'
          }`}>
            {representatives.rootU !== representatives.rootV ? 'Different Sets → ACCEPT' : 'Same Set → REJECT (Cycle)'}
          </span>
        </div>
      )}
    </div>
  );
}
