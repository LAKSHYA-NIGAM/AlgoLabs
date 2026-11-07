import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DSU } from '../algorithms/dsu';

export default function DSUPage() {
  const navigate = useNavigate();
  const [dsu, setDsu] = useState(() => new DSU(6));
  const [unionU, setUnionU] = useState(0);
  const [unionV, setUnionV] = useState(1);
  const [actionLog, setActionLog] = useState([
    'Initialized DSU with 6 elements: {0}, {1}, {2}, {3}, {4}, {5}. Every element is its own canonical root.'
  ]);
  const [findTrace, setFindTrace] = useState(null);

  const handleUnion = () => {
    const copy = dsu.clone();
    const res = copy.union(unionU, unionV);
    setDsu(copy);

    if (res.success) {
      setActionLog(prev => [
        `Union(${unionU}, ${unionV}): Roots differ (root ${res.rootX} ≠ root ${res.rootY}). Attached root ${res.attached} under root ${res.newRoot}. Sets merged.`,
        ...prev
      ]);
    } else {
      setActionLog(prev => [
        `Union(${unionU}, ${unionV}): Cycle detected! Both elements already share canonical root ${res.rootX}.`,
        ...prev
      ]);
    }
  };

  const handleFind = (element) => {
    const path = [];
    const copy = dsu.clone();
    const root = copy.find(element, path);
    setDsu(copy);
    setFindTrace({ element, root, path });
    setActionLog(prev => [
      `Find(${element}): Path [${path.join(' → ')}] → Root ${root}. Path compressed directly to root.`,
      ...prev
    ]);
  };

  const handleReset = () => {
    setDsu(new DSU(6));
    setActionLog(['Reset DSU. All 6 elements are isolated singletons.']);
    setFindTrace(null);
  };

  const components = dsu.getComponents(6);

  return (
    <div className="w-full space-y-12 py-2">
      {/* Chapter Label & Main Heading */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold text-[#66765B] dark:text-[#8C9D81] tracking-wider uppercase">
            Chapter 03 · Data Structure
          </span>
          <span className="text-[#999A91] dark:text-[#7E8077] text-xs">·</span>
          <span className="text-xs text-[#77786F] dark:text-[#A6A79E]">
            Cycle Detection Engine
          </span>
        </div>

        <h1 className="font-heading text-3xl sm:text-4xl text-[#252720] dark:text-[#EDECE6] font-semibold tracking-tight leading-tight">
          Disjoint Set Union (DSU / Union-Find)
        </h1>

        <p className="text-base text-[#77786F] dark:text-[#A6A79E] max-w-3xl leading-relaxed">
          Disjoint Set Union tracks a partition of elements into non-overlapping subsets. It provides Kruskal’s algorithm with near $O(1)$ cycle checking using <strong>Path Compression</strong> and <strong>Union by Rank</strong>.
        </p>
      </div>

      {/* 4 Theoretical Core Explanations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: The Parent Array */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#1E211D] border border-[#E4E3DC] dark:border-[#2D332C] space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-[#EFEEE8] dark:bg-[#242823] text-[#66765B] dark:text-[#8C9D81] font-mono text-xs font-semibold flex items-center justify-center">
              1
            </span>
            <h3 className="font-heading font-semibold text-base text-[#252720] dark:text-[#EDECE6]">
              The Parent Array
            </h3>
          </div>
          <p className="text-xs text-[#77786F] dark:text-[#A6A79E] leading-relaxed">
            Each element $i$ stores an index <code>parent[i]</code>. Initially, each node points to itself (<code>parent[i] = i</code>), acting as its own <strong>canonical root</strong>.
          </p>
          <div className="p-3 rounded-xl bg-[#EFEEE8] dark:bg-[#242823] font-mono text-xs text-[#252720] dark:text-[#EDECE6]">
            parent[i] = i // 6 independent disjoint sets
          </div>
        </div>

        {/* Section 2: Find Operation */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#1E211D] border border-[#E4E3DC] dark:border-[#2D332C] space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-[#EFEEE8] dark:bg-[#242823] text-[#66765B] dark:text-[#8C9D81] font-mono text-xs font-semibold flex items-center justify-center">
              2
            </span>
            <h3 className="font-heading font-semibold text-base text-[#252720] dark:text-[#EDECE6]">
              The Find Operation
            </h3>
          </div>
          <p className="text-xs text-[#77786F] dark:text-[#A6A79E] leading-relaxed">
            <code>find(x)</code> traverses upward along parent pointers until reaching a node where <code>parent[root] == root</code>. If <code>find(u) == find(v)</code>, an edge between them introduces a cycle!
          </p>
          <div className="p-3 rounded-xl bg-[#EFEEE8] dark:bg-[#242823] font-mono text-xs text-[#252720] dark:text-[#EDECE6]">
            while (parent[x] != x) x = parent[x];
          </div>
        </div>

        {/* Section 3: Path Compression */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#1E211D] border border-[#E4E3DC] dark:border-[#2D332C] space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-[#EFEEE8] dark:bg-[#242823] text-[#66765B] dark:text-[#8C9D81] font-mono text-xs font-semibold flex items-center justify-center">
              3
            </span>
            <h3 className="font-heading font-semibold text-base text-[#252720] dark:text-[#EDECE6]">
              Path Compression Optimization
            </h3>
          </div>
          <p className="text-xs text-[#77786F] dark:text-[#A6A79E] leading-relaxed">
            During recursion, <code>parent[x] = find(parent[x])</code> repoints every node along the path directly to the representative root, flattening deep trees into a single level.
          </p>
          <div className="p-3 rounded-xl bg-[#EBF0E8] dark:bg-[#232C21] font-mono text-xs text-[#47533F] dark:text-[#8C9D81]">
            parent[x] = find(parent[x]); // Flattens depth
          </div>
        </div>

        {/* Section 4: Union by Rank */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#1E211D] border border-[#E4E3DC] dark:border-[#2D332C] space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-[#EFEEE8] dark:bg-[#242823] text-[#66765B] dark:text-[#8C9D81] font-mono text-xs font-semibold flex items-center justify-center">
              4
            </span>
            <h3 className="font-heading font-semibold text-base text-[#252720] dark:text-[#EDECE6]">
              Union by Rank
            </h3>
          </div>
          <p className="text-xs text-[#77786F] dark:text-[#A6A79E] leading-relaxed">
            <code>rank[x]</code> bounds the height of tree $x$. When joining two trees, we attach the shallower tree under the root of the deeper tree, preventing pathological linear degeneracies.
          </p>
          <div className="p-3 rounded-xl bg-[#EBF0E8] dark:bg-[#232C21] font-mono text-xs text-[#47533F] dark:text-[#8C9D81]">
            if (rank[rootX] &lt; rank[rootY]) parent[rootX] = rootY;
          </div>
        </div>
      </div>

      {/* Section 5: Interactive DSU Playground */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#ECEBE5] dark:border-[#232822]">
          <div>
            <h2 className="font-heading text-lg text-[#252720] dark:text-[#EDECE6] font-semibold">
              Section 5 · Interactive DSU Playground
            </h2>
            <p className="text-xs text-[#77786F] dark:text-[#A6A79E]">
              Perform live Find and Union operations. Inspect how parent pointers and connected components update.
            </p>
          </div>

          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#EFEEE8] dark:bg-[#242823] hover:bg-[#E7E6DF] dark:hover:bg-[#31372F] text-[#252720] dark:text-[#EDECE6] border border-[#E4E3DC] dark:border-[#2D332C] transition-all"
          >
            Reset to 6 Sets
          </button>
        </div>

        {/* Tabular Memory Array Display */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1E211D] border border-[#E4E3DC] dark:border-[#2D332C] space-y-3">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="font-heading text-[#252720] dark:text-[#EDECE6]">DSU Memory State Arrays (V = 6)</span>
            <span className="font-mono text-[#77786F] dark:text-[#A6A79E]">Space: O(V)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-[#EFEEE8] dark:bg-[#242823] text-[#77786F] dark:text-[#A6A79E] text-[11px]">
                  <th className="p-2.5 text-left border-b border-[#E4E3DC] dark:border-[#2D332C]">Array</th>
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <th key={i} className="p-2.5 border-b border-[#E4E3DC] dark:border-[#2D332C] text-[#252720] dark:text-[#EDECE6]">
                      Node {i}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2.5 text-left font-sans font-medium text-[#252720] dark:text-[#EDECE6] border-b border-[#ECEBE5] dark:border-[#232822]">
                    parent[i]
                  </td>
                  {dsu.parent.map((p, i) => {
                    const isRoot = p === i;
                    return (
                      <td
                        key={`parent-${i}`}
                        className={`p-2.5 border-b border-[#ECEBE5] dark:border-[#232822] font-semibold ${
                          isRoot
                            ? 'bg-[#EBF0E8] dark:bg-[#232C21] text-[#47533F] dark:text-[#8C9D81]'
                            : 'text-[#77786F] dark:text-[#A6A79E]'
                        }`}
                      >
                        {p}
                        {isRoot && <span className="text-[9px] block font-sans font-normal opacity-75">ROOT</span>}
                      </td>
                    );
                  })}
                </tr>

                <tr>
                  <td className="p-2.5 text-left font-sans font-medium text-[#77786F] dark:text-[#A6A79E]">
                    rank[i]
                  </td>
                  {dsu.rank.map((r, i) => (
                    <td key={`rank-${i}`} className="p-2.5 text-[#252720] dark:text-[#EDECE6]">
                      {r}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Controls: Find & Union */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Find Area */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#1E211D] border border-[#E4E3DC] dark:border-[#2D332C] space-y-3">
            <span className="text-xs font-heading font-semibold text-[#252720] dark:text-[#EDECE6] block">
              1. Execute Find(x)
            </span>
            <p className="text-xs text-[#77786F] dark:text-[#A6A79E]">
              Resolves canonical root and applies recursive path compression.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {[0, 1, 2, 3, 4, 5].map((x) => (
                <button
                  key={`find-${x}`}
                  onClick={() => handleFind(x)}
                  className="px-3 py-1.5 rounded-lg bg-[#EFEEE8] dark:bg-[#242823] hover:bg-[#E7E6DF] dark:hover:bg-[#31372F] text-[#252720] dark:text-[#EDECE6] border border-[#E4E3DC] dark:border-[#2D332C] text-xs font-mono font-medium transition-all"
                >
                  Find({x})
                </button>
              ))}
            </div>

            {findTrace && (
              <div className="p-3 rounded-xl bg-[#EFEEE8] dark:bg-[#242823] text-xs font-mono text-[#252720] dark:text-[#EDECE6]">
                Find({findTrace.element}): Path [{findTrace.path.join(' → ')}] → Root {findTrace.root}
              </div>
            )}
          </div>

          {/* Union Area */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#1E211D] border border-[#E4E3DC] dark:border-[#2D332C] space-y-3">
            <span className="text-xs font-heading font-semibold text-[#252720] dark:text-[#EDECE6] block">
              2. Execute Union(u, v)
            </span>
            <p className="text-xs text-[#77786F] dark:text-[#A6A79E]">
              Merges two components using Union by Rank.
            </p>

            <div className="flex items-center gap-3">
              <select
                value={unionU}
                onChange={(e) => setUnionU(Number(e.target.value))}
                className="px-3 py-1.5 rounded-lg bg-[#EFEEE8] dark:bg-[#242823] text-xs font-mono border border-[#E4E3DC] dark:border-[#2D332C] text-[#252720] dark:text-[#EDECE6]"
              >
                {[0, 1, 2, 3, 4, 5].map((n) => (
                  <option key={`u-${n}`} value={n}>Node {n}</option>
                ))}
              </select>

              <span className="text-xs font-mono text-[#77786F] dark:text-[#A6A79E]">and</span>

              <select
                value={unionV}
                onChange={(e) => setUnionV(Number(e.target.value))}
                className="px-3 py-1.5 rounded-lg bg-[#EFEEE8] dark:bg-[#242823] text-xs font-mono border border-[#E4E3DC] dark:border-[#2D332C] text-[#252720] dark:text-[#EDECE6]"
              >
                {[0, 1, 2, 3, 4, 5].map((n) => (
                  <option key={`v-${n}`} value={n}>Node {n}</option>
                ))}
              </select>

              <button
                onClick={handleUnion}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#66765B] hover:bg-[#58664E] transition-all"
              >
                Merge Sets
              </button>
            </div>
          </div>
        </div>

        {/* Connected Components Visual Display */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1E211D] border border-[#E4E3DC] dark:border-[#2D332C] space-y-3">
          <span className="text-xs font-heading font-semibold text-[#252720] dark:text-[#EDECE6] block">
            Connected Component Partitions ({Object.keys(components).length} Distinct Sets)
          </span>

          <div className="flex flex-wrap gap-3">
            {Object.entries(components).map(([root, members]) => (
              <div
                key={`comp-${root}`}
                className="p-3 rounded-xl bg-[#EFEEE8] dark:bg-[#242823] border border-[#E4E3DC] dark:border-[#2D332C] space-y-1"
              >
                <div className="text-[11px] font-mono text-[#77786F] dark:text-[#A6A79E]">
                  Canonical Root: <strong className="text-[#66765B] dark:text-[#8C9D81]">{root}</strong>
                </div>
                <div className="flex gap-1.5">
                  {members.map((m) => (
                    <span
                      key={`m-${m}`}
                      className="w-6 h-6 rounded-md bg-white dark:bg-[#1E211D] border border-[#E4E3DC] dark:border-[#2D332C] font-mono text-xs font-semibold flex items-center justify-center text-[#252720] dark:text-[#EDECE6]"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Console Event Log */}
        <div className="p-4 rounded-xl bg-[#EFEEE8] dark:bg-[#242823] border border-[#E4E3DC] dark:border-[#2D332C] space-y-2">
          <span className="text-[11px] font-mono font-semibold text-[#77786F] dark:text-[#A6A79E] block uppercase">
            DSU Event Execution Log
          </span>
          <div className="max-h-36 overflow-y-auto space-y-1 font-mono text-xs text-[#252720] dark:text-[#EDECE6]">
            {actionLog.map((log, i) => (
              <div key={i} className="leading-relaxed">
                <span className="text-[#999A91] dark:text-[#7E8077] mr-2">›</span>
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Footer CTA */}
      <div className="pt-6 border-t border-[#ECEBE5] dark:border-[#232822] flex items-center justify-between">
        <button
          onClick={() => navigate('/foundations')}
          className="text-xs text-[#77786F] dark:text-[#A6A79E] hover:text-[#252720] dark:hover:text-[#EDECE6] font-medium"
        >
          ← Back to Foundations
        </button>

        <button
          onClick={() => navigate('/visualizer')}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#66765B] hover:bg-[#58664E] shadow-xs transition-all hover:translate-x-0.5"
        >
          <span>Proceed to Kruskal Simulation</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
