import React, { useState } from 'react';
import { GRAPH_PRESETS } from '../../data/defaultGraph';

export function CustomGraphEditor({
  vertices,
  edges,
  onApplyGraph,
  onSelectPreset,
}) {
  const [localVertices, setLocalVertices] = useState(vertices);
  const [localEdges, setLocalEdges] = useState(edges);
  const [newEdgeU, setNewEdgeU] = useState('');
  const [newEdgeV, setNewEdgeV] = useState('');
  const [newEdgeWeight, setNewEdgeWeight] = useState(3);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAddVertex = () => {
    if (localVertices.length >= 8) {
      setErrorMsg('Maximum 8 vertices allowed for optimal layout.');
      return;
    }
    const nextChar = String.fromCharCode(65 + localVertices.length);
    const angle = (localVertices.length * (2 * Math.PI)) / 7;
    const centerX = 280;
    const centerY = 200;
    const radius = 130;
    const newX = Math.round(centerX + radius * Math.cos(angle));
    const newY = Math.round(centerY + radius * Math.sin(angle));

    const updated = [...localVertices, { id: nextChar, label: nextChar, x: newX, y: newY }];
    setLocalVertices(updated);
    setErrorMsg('');
  };

  const handleRemoveVertex = (vertexId) => {
    if (localVertices.length <= 2) {
      setErrorMsg('Minimum 2 vertices required.');
      return;
    }
    const updatedV = localVertices.filter(v => v.id !== vertexId);
    const updatedE = localEdges.filter(e => e.u !== vertexId && e.v !== vertexId);
    setLocalVertices(updatedV);
    setLocalEdges(updatedE);
    setErrorMsg('');
  };

  const handleAddEdge = () => {
    if (!newEdgeU || !newEdgeV) {
      setErrorMsg('Please select both endpoints u and v.');
      return;
    }
    if (newEdgeU === newEdgeV) {
      setErrorMsg('Self-loops are not permitted in simple graphs.');
      return;
    }
    const exists = localEdges.some(
      e => (e.u === newEdgeU && e.v === newEdgeV) || (e.u === newEdgeV && e.v === newEdgeU)
    );
    if (exists) {
      setErrorMsg(`Edge between ${newEdgeU} and ${newEdgeV} already exists.`);
      return;
    }

    const id = `${newEdgeU}${newEdgeV}`;
    const newEdge = {
      id,
      u: newEdgeU,
      v: newEdgeV,
      weight: parseInt(newEdgeWeight, 10) || 1
    };

    setLocalEdges([...localEdges, newEdge]);
    setErrorMsg('');
  };

  const handleRemoveEdge = (edgeId) => {
    setLocalEdges(localEdges.filter(e => e.id !== edgeId));
  };

  const handleUpdateWeight = (edgeId, weight) => {
    const val = parseInt(weight, 10) || 1;
    setLocalEdges(localEdges.map(e => (e.id === edgeId ? { ...e, weight: val } : e)));
  };

  const handleApply = () => {
    if (localVertices.length < 2) {
      setErrorMsg('Graph must contain at least 2 vertices.');
      return;
    }
    onApplyGraph(localVertices, localEdges);
  };

  return (
    <div className="bg-white dark:bg-[#1E211D] rounded-2xl border border-[#E4E3DC] dark:border-[#2D332C] p-5 shadow-xs space-y-4 transition-colors">
      {/* Header & Presets */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#ECEBE5] dark:border-[#232822]">
        <div>
          <h3 className="text-xs font-heading font-semibold text-[#252720] dark:text-[#EDECE6] uppercase tracking-wider">
            Custom Topology & Presets
          </h3>
          <p className="text-[11px] text-[#77786F] dark:text-[#A6A79E]">
            Add custom vertices/edges or load pre-built graph configurations.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#77786F] dark:text-[#A6A79E]">Preset:</span>
          <select
            onChange={(e) => {
              const preset = GRAPH_PRESETS.find(p => p.id === e.target.value);
              if (preset) {
                setLocalVertices(preset.vertices);
                setLocalEdges(preset.edges);
                onSelectPreset(preset);
              }
            }}
            className="text-xs bg-[#EFEEE8] dark:bg-[#242823] border border-[#E4E3DC] dark:border-[#2D332C] rounded-lg px-2.5 py-1 text-[#252720] dark:text-[#EDECE6] font-medium focus:outline-none"
          >
            {GRAPH_PRESETS.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {errorMsg && (
        <div className="p-2.5 rounded-xl bg-[#FDF2F1] dark:bg-[#2D1D1C] border border-[#EFC8C5] text-xs text-[#8A3B35] dark:text-[#F59690] flex items-center gap-2">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Vertices Manager */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-heading font-semibold text-[#252720] dark:text-[#EDECE6]">
            Vertices ({localVertices.length})
          </span>
          <button
            onClick={handleAddVertex}
            className="flex items-center gap-1 text-[11px] font-medium text-[#252720] dark:text-[#EDECE6] bg-[#EFEEE8] dark:bg-[#242823] hover:bg-[#E7E6DF] dark:hover:bg-[#31372F] border border-[#E4E3DC] dark:border-[#2D332C] px-2.5 py-1 rounded-lg transition-colors"
          >
            + Add Vertex
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {localVertices.map((v) => (
            <div
              key={v.id}
              className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#EFEEE8] dark:bg-[#242823] border border-[#E4E3DC] dark:border-[#2D332C] text-xs font-mono font-semibold text-[#252720] dark:text-[#EDECE6]"
            >
              <span>{v.label}</span>
              <button
                onClick={() => handleRemoveVertex(v.id)}
                className="text-[#999A91] hover:text-[#B65E57] transition-colors"
                title="Remove vertex"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Edges Manager */}
      <div>
        <div className="text-xs font-heading font-semibold text-[#252720] dark:text-[#EDECE6] mb-2">
          Edges ({localEdges.length})
        </div>

        {/* Add edge inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-3 bg-[#EFEEE8] dark:bg-[#242823] p-3 rounded-xl border border-[#E4E3DC] dark:border-[#2D332C]">
          <div>
            <label className="text-[10px] text-[#77786F] dark:text-[#A6A79E] block mb-1">From Node (u)</label>
            <select
              value={newEdgeU}
              onChange={(e) => setNewEdgeU(e.target.value)}
              className="w-full text-xs bg-white dark:bg-[#1E211D] border border-[#E4E3DC] dark:border-[#2D332C] rounded-lg p-1.5 text-[#252720] dark:text-[#EDECE6]"
            >
              <option value="">Select u</option>
              {localVertices.map(v => (
                <option key={`u-${v.id}`} value={v.id}>{v.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] text-[#77786F] dark:text-[#A6A79E] block mb-1">To Node (v)</label>
            <select
              value={newEdgeV}
              onChange={(e) => setNewEdgeV(e.target.value)}
              className="w-full text-xs bg-white dark:bg-[#1E211D] border border-[#E4E3DC] dark:border-[#2D332C] rounded-lg p-1.5 text-[#252720] dark:text-[#EDECE6]"
            >
              <option value="">Select v</option>
              {localVertices.map(v => (
                <option key={`v-${v.id}`} value={v.id}>{v.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] text-[#77786F] dark:text-[#A6A79E] block mb-1">Weight</label>
            <input
              type="number"
              value={newEdgeWeight}
              onChange={(e) => setNewEdgeWeight(e.target.value)}
              className="w-full text-xs bg-white dark:bg-[#1E211D] border border-[#E4E3DC] dark:border-[#2D332C] rounded-lg p-1.5 text-[#252720] dark:text-[#EDECE6] font-mono"
              placeholder="e.g. 5"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleAddEdge}
              className="w-full flex items-center justify-center gap-1 bg-[#66765B] hover:bg-[#58664E] text-white text-xs font-semibold p-1.5 rounded-lg transition-all"
            >
              Add Edge
            </button>
          </div>
        </div>

        {/* Existing Edges Table */}
        <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
          {localEdges.map((e) => (
            <div
              key={e.id}
              className="flex items-center justify-between p-2 rounded-lg bg-[#EFEEE8] dark:bg-[#242823] border border-[#E4E3DC] dark:border-[#2D332C] text-xs font-medium"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono font-semibold text-[#252720] dark:text-[#EDECE6]">{e.u} ↔ {e.v}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#77786F] dark:text-[#A6A79E]">wt:</span>
                <input
                  type="number"
                  value={e.weight}
                  onChange={(ev) => handleUpdateWeight(e.id, ev.target.value)}
                  className="w-12 text-center bg-white dark:bg-[#1E211D] border border-[#E4E3DC] dark:border-[#2D332C] rounded px-1 py-0.5 text-[#252720] dark:text-[#EDECE6] font-mono text-xs"
                />
                <button
                  onClick={() => handleRemoveEdge(e.id)}
                  className="text-[#999A91] hover:text-[#B65E57] p-1"
                  title="Delete edge"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Apply Button */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={handleApply}
          className="px-5 py-2 rounded-xl bg-[#66765B] hover:bg-[#58664E] text-white font-semibold text-xs shadow-xs transition-all hover:translate-x-0.5"
        >
          Apply Graph & Re-run Simulation
        </button>
      </div>
    </div>
  );
}
