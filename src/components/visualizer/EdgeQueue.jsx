import React from 'react';

export function EdgeQueue({ sortedEdges = [], currentEdgeIndex = -1, edgeStatuses = {} }) {
  return (
    <div className="bg-white dark:bg-[#1E211D] rounded-2xl border border-[#E4E3DC] dark:border-[#2D332C] p-5 shadow-xs flex flex-col h-full transition-colors">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#ECEBE5] dark:border-[#232822]">
        <div>
          <h3 className="text-xs font-heading font-semibold uppercase tracking-wider text-[#252720] dark:text-[#EDECE6]">
            Sorted Edge Queue
          </h3>
          <p className="text-[11px] text-[#77786F] dark:text-[#A6A79E]">Ascending by weight: O(E log E)</p>
        </div>
        <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-[#EFEEE8] dark:bg-[#242823] text-[#252720] dark:text-[#EDECE6]">
          {sortedEdges.length} edges
        </span>
      </div>

      <div className="space-y-2 overflow-y-auto max-h-[300px] pr-1">
        {sortedEdges.map((edge, idx) => {
          const status = edgeStatuses[edge.id] || 'unprocessed';
          const isCurrent = idx === currentEdgeIndex;

          let cardStyle = 'bg-[#EFEEE8] dark:bg-[#242823] border-[#E4E3DC] dark:border-[#2D332C] text-[#252720] dark:text-[#EDECE6]';
          let badge = (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white dark:bg-[#1E211D] text-[#77786F] dark:text-[#A6A79E] border border-[#E4E3DC] dark:border-[#2D332C]">
              Queued
            </span>
          );

          if (isCurrent) {
            cardStyle = 'bg-[#FDF6E8] dark:bg-[#2F2618] border-[#E5C48A] text-[#8A6223] dark:text-[#C79A4D] font-medium shadow-xs';
            badge = (
              <span className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-white dark:bg-[#1E211D] text-[#8A6223] dark:text-[#C79A4D] border border-[#E5C48A]">
                Examining
              </span>
            );
          } else if (status === 'accepted') {
            cardStyle = 'bg-[#EBF0E8] dark:bg-[#232C21] border-[#C5D1C1] text-[#47533F] dark:text-[#8C9D81]';
            badge = (
              <span className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-white dark:bg-[#1E211D] text-[#477B5C] dark:text-[#529E70] border border-[#C5D1C1]">
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 8.5 6.5 12 13 4" />
                </svg>
                In MST
              </span>
            );
          } else if (status === 'rejected') {
            cardStyle = 'bg-[#FDF2F1] dark:bg-[#2D1D1C] border-[#EFC8C5] text-[#8A3B35] dark:text-[#F59690] opacity-80';
            badge = (
              <span className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-white dark:bg-[#1E211D] text-[#B65E57] dark:text-[#D96A62] border border-[#EFC8C5]">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                Cycle
              </span>
            );
          }

          return (
            <div
              key={edge.id || `${edge.u}-${edge.v}`}
              className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all ${cardStyle}`}
            >
              <div className="flex items-center gap-2">
                <span className="w-4 text-center font-mono text-[11px] text-[#999A91] dark:text-[#7E8077]">
                  {idx + 1}
                </span>
                <span className="font-mono font-semibold text-xs text-[#252720] dark:text-[#EDECE6]">
                  ({edge.u}, {edge.v})
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-semibold text-[#252720] dark:text-[#EDECE6]">
                  wt: {edge.weight}
                </span>
                {badge}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
