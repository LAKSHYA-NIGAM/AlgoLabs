import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKruskalVisualizer } from '../hooks/useKruskalVisualizer';
import { SVGGraph } from '../components/graph/SVGGraph';
import { EdgeQueue } from '../components/visualizer/EdgeQueue';
import { DSUVisualizer } from '../components/visualizer/DSUVisualizer';
import { StepExplanation } from '../components/visualizer/StepExplanation';
import { VisualizerControls } from '../components/visualizer/VisualizerControls';
import { PredictionCard } from '../components/visualizer/PredictionCard';
import { CustomGraphEditor } from '../components/visualizer/CustomGraphEditor';
import { loadProgress, saveProgress } from '../utils/storage';

export default function VisualizerPage() {
  const navigate = useNavigate();
  const [showEditor, setShowEditor] = useState(false);

  const {
    vertices,
    edges,
    currentStep,
    totalSteps,
    currentSnapshot,
    simulationData,
    isPlaying,
    speed,
    setSpeed,
    handlePlay,
    handlePause,
    handleNext,
    handlePrev,
    handleReset,
    handleSeek,
    setCustomGraph
  } = useKruskalVisualizer();

  const handlePredictionMade = (isCorrect) => {
    const saved = loadProgress();
    const updated = {
      ...saved,
      visualizerStats: {
        ...saved.visualizerStats,
        predictionsTotal: (saved.visualizerStats?.predictionsTotal || 0) + 1,
        predictionsCorrect: (saved.visualizerStats?.predictionsCorrect || 0) + (isCorrect ? 1 : 0)
      }
    };
    saveProgress(updated);
  };

  const handleApplyCustomGraph = (newV, newE) => {
    setCustomGraph(newV, newE);
    setShowEditor(false);
  };

  const handleSelectPreset = (preset) => {
    setCustomGraph(preset.vertices, preset.edges);
    setShowEditor(false);
  };

  return (
    <div className="w-full space-y-5 py-1">
      {/* Chapter Label & Main Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-[#66765B] dark:text-[#8C9D81] tracking-wider uppercase">
              Chapter 04 · Simulation
            </span>
            <span className="text-[#999A91] dark:text-[#7E8077] text-xs">·</span>
            <span className="text-xs text-[#77786F] dark:text-[#A6A79E]">
              Interactive Kruskal Visualizer
            </span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl text-[#252720] dark:text-[#EDECE6] font-semibold tracking-tight leading-tight">
            Kruskal Simulation Workspace
          </h1>

          <p className="text-xs sm:text-sm text-[#77786F] dark:text-[#A6A79E] max-w-2xl leading-relaxed">
            Step through greedy edge evaluation. Observe how the DSU prevents cycles and constructs the globally optimal Minimum Spanning Tree.
          </p>
        </div>

        {/* Toggle Custom Graph Editor Button */}
        <button
          onClick={() => setShowEditor(!showEditor)}
          className="self-start sm:self-center px-3.5 py-1.5 rounded-xl bg-[#EFEEE8] dark:bg-[#242823] hover:bg-[#E7E6DF] dark:hover:bg-[#31372F] text-[#252720] dark:text-[#EDECE6] border border-[#E4E3DC] dark:border-[#2D332C] text-xs font-medium transition-colors shrink-0"
        >
          {showEditor ? 'Hide Custom Editor' : 'Custom Graph & Presets'}
        </button>
      </div>

      {/* Expandable Custom Graph Editor Panel */}
      {showEditor && (
        <CustomGraphEditor
          vertices={vertices}
          edges={edges}
          onApplyGraph={handleApplyCustomGraph}
          onSelectPreset={handleSelectPreset}
        />
      )}

      {/* Disconnected Graph Alert */}
      {simulationData.isForest && (
        <div className="p-3.5 rounded-xl bg-[#FDF6E8] dark:bg-[#2F2618] border border-[#E5C48A] text-xs text-[#8A6223] dark:text-[#C79A4D]">
          <strong className="block font-semibold mb-0.5">Spanning Forest Active</strong>
          The graph contains {simulationData.componentCount} disconnected components. Kruskal will construct a Minimum Spanning Forest across individual components.
        </div>
      )}

      {/* Main Simulation Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left / Main Simulation Column (7 cols on lg) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          {/* Main Visualizer Graph Canvas (Constrained height, no empty vertical void) */}
          <div className="space-y-2">
            <SVGGraph
              vertices={vertices}
              edges={edges}
              edgeStatuses={currentSnapshot.edgeStatuses}
              currentEdge={currentSnapshot.currentEdge}
              width={540}
              height={380}
            />

            {/* Visual Legend */}
            <div className="bg-white dark:bg-[#1E211D] rounded-xl border border-[#E4E3DC] dark:border-[#2D332C] px-3 py-2 grid grid-cols-4 gap-1 text-[11px] text-center font-medium text-[#77786F] dark:text-[#A6A79E]">
              <div className="flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#D2CCC0] dark:bg-[#4E564C] inline-block" />
                <span>Queued</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 text-[#8A6223] dark:text-[#C79A4D]">
                <span className="w-2 h-2 rounded-full bg-[#B58A43] inline-block" />
                <span>Examining</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 text-[#47533F] dark:text-[#8C9D81]">
                <span className="w-2 h-2 rounded-full bg-[#66765B] inline-block" />
                <span>In MST</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 text-[#8A3B35] dark:text-[#F59690]">
                <span className="w-2 h-2 rounded-full bg-[#B65E57] inline-block" />
                <span>Cycle</span>
              </div>
            </div>
          </div>

          {/* Simulation Player Bar (Pulled directly up beneath the graph canvas) */}
          <VisualizerControls
            isPlaying={isPlaying}
            onPlay={handlePlay}
            onPause={handlePause}
            onNext={handleNext}
            onPrev={handlePrev}
            onReset={handleReset}
            speed={speed}
            onSpeedChange={setSpeed}
            currentStep={currentStep}
            totalSteps={totalSteps}
            onSeek={handleSeek}
          />

          {/* Decision Rationale */}
          <StepExplanation
            currentSnapshot={currentSnapshot}
            totalVertices={vertices.length}
            mstEdges={currentSnapshot.mstEdges}
            totalCost={currentSnapshot.totalCost}
          />

          {/* Active Learner Prediction (rendered when examining an edge) */}
          <PredictionCard
            snapshot={currentSnapshot}
            onPredictionMade={handlePredictionMade}
          />
        </div>

        {/* Right / State & Queue Column (5 cols on lg) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <EdgeQueue
            sortedEdges={simulationData.sortedEdges}
            currentEdgeIndex={currentSnapshot.currentEdgeIndex}
            edgeStatuses={currentSnapshot.edgeStatuses}
          />

          <DSUVisualizer
            dsuState={currentSnapshot.dsuState}
            vertices={vertices}
          />
        </div>
      </div>

      {/* Navigation footer */}
      <div className="pt-4 border-t border-[#ECEBE5] dark:border-[#232822] flex items-center justify-between">
        <button
          onClick={() => navigate('/dsu')}
          className="text-xs text-[#77786F] dark:text-[#A6A79E] hover:text-[#252720] dark:hover:text-[#EDECE6] font-medium transition-colors"
        >
          ← Back to DSU Engine
        </button>

        <button
          onClick={() => navigate('/java-walkthrough')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#66765B] hover:bg-[#58664E] shadow-xs transition-all hover:translate-x-0.5"
        >
          <span>Proceed to Java Implementation</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
