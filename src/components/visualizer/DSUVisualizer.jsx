import React from 'react';

export function DSUVisualizer({ dsuState, vertices = [] }) {
  if (!dsuState || !dsuState.parent) return null;

  const { parent, rank, components } = dsuState;

  const indexToLabel = (idx) => {
    if (vertices[idx]) return vertices[idx].label || vertices[idx].id;
    return String.fromCharCode(65 + idx);
  };

  const componentList = Object.entries(components || {}).map(([rootIdx, members]) => {
    return {
      rootLabel: indexToLabel(parseInt(rootIdx, 10)),
      rootIndex: parseInt(rootIdx, 10),
      memberLabels: members.map(m => indexToLabel(m))
    };
  });

  return (
    <div className="bg-white dark:bg-[#1E211D] rounded-2xl border border-[#E4E3DC] dark:border-[#2D332C] p-5 shadow-xs space-y-4 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#ECEBE5] dark:border-[#232822]">
        <h3 className="text-xs font-heading font-semibold uppercase tracking-wider text-[#252720] dark:text-[#EDECE6]">
          DSU Internal State
        </h3>
        <span className="text-xs font-mono text-[#77786F] dark:text-[#A6A79E]">
          {componentList.length} Set{componentList.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Parent & Rank Arrays Table */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-medium text-[#77786F] dark:text-[#A6A79E]">
          <span>Parent & Rank Table</span>
          <span className="font-mono text-xs">O(V)</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#E4E3DC] dark:border-[#2D332C]">
          <table className="w-full text-center border-collapse text-xs">
            <thead>
              <tr className="bg-[#EFEEE8] dark:bg-[#242823] text-[#77786F] dark:text-[#A6A79E] text-[10px] uppercase font-mono">
                <th className="p-2 border-b border-[#E4E3DC] dark:border-[#2D332C]">Node</th>
                {parent.map((_, i) => (
                  <th key={`hdr-${i}`} className="p-2 border-b border-[#E4E3DC] dark:border-[#2D332C]">
                    <span className="font-semibold text-[#252720] dark:text-[#EDECE6]">{indexToLabel(i)}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Parent Row */}
              <tr className="bg-white dark:bg-[#1E211D] font-mono">
                <td className="p-2 border-b border-[#ECEBE5] dark:border-[#232822] text-[#77786F] dark:text-[#A6A79E] text-left pl-3 font-sans font-medium text-[11px]">
                  parent
                </td>
                {parent.map((p, i) => {
                  const isRoot = p === i;
                  return (
                    <td
                      key={`parent-${i}`}
                      className={`p-2 border-b border-[#ECEBE5] dark:border-[#232822] font-semibold ${
                        isRoot
                          ? 'bg-[#EBF0E8] dark:bg-[#232C21] text-[#47533F] dark:text-[#8C9D81]'
                          : 'text-[#77786F] dark:text-[#A6A79E]'
                      }`}
                    >
                      {indexToLabel(p)}
                    </td>
                  );
                })}
              </tr>

              {/* Rank Row */}
              <tr className="bg-[#EFEEE8] dark:bg-[#242823] font-mono text-[#77786F] dark:text-[#A6A79E]">
                <td className="p-2 text-left pl-3 font-sans font-medium text-[11px]">
                  rank
                </td>
                {rank.map((r, i) => (
                  <td key={`rank-${i}`} className="p-2">
                    {r}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Component Sets Pill Groups */}
      <div className="space-y-2 pt-1">
        <span className="text-[11px] font-heading font-medium text-[#77786F] dark:text-[#A6A79E] block">
          Current Disjoint Components
        </span>
        <div className="flex flex-wrap gap-2">
          {componentList.map((comp) => (
            <div
              key={`comp-card-${comp.rootIndex}`}
              className="px-3 py-1.5 rounded-lg bg-[#EFEEE8] dark:bg-[#242823] border border-[#E4E3DC] dark:border-[#2D332C] text-xs font-mono flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#66765B]" />
              <span className="text-[#77786F] dark:text-[#A6A79E] text-[10px]">Root {comp.rootLabel}:</span>
              <strong className="text-[#252720] dark:text-[#EDECE6] font-semibold">{'{' + comp.memberLabels.join(', ') + '}'}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
