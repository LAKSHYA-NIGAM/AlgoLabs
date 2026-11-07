import React from 'react';

export function VisualizerControls({
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrev,
  onReset,
  speed,
  onSpeedChange,
  currentStep,
  totalSteps,
  onSeek
}) {
  const isStart = currentStep === 0;
  const isEnd = currentStep >= totalSteps - 1;

  return (
    <div className="bg-white dark:bg-[#1E211D] rounded-2xl border border-[#E4E3DC] dark:border-[#2D332C] p-5 shadow-xs space-y-4 transition-colors">
      {/* Timeline Scrubber */}
      <div className="flex items-center gap-4">
        <span className="text-xs font-mono text-[#77786F] dark:text-[#A6A79E] font-medium shrink-0">
          Step {currentStep} / {Math.max(0, totalSteps - 1)}
        </span>
        <input
          type="range"
          min="0"
          max={Math.max(0, totalSteps - 1)}
          value={currentStep}
          onChange={(e) => onSeek(parseInt(e.target.value, 10))}
          className="flex-1 h-1.5 bg-[#EFEEE8] dark:bg-[#242823] rounded-full appearance-none cursor-pointer accent-[#66765B]"
        />
      </div>

      {/* Primary Control Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        {/* Reset button pill */}
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#77786F] dark:text-[#A6A79E] hover:text-[#252720] dark:hover:text-white bg-[#EFEEE8] dark:bg-[#242823] hover:bg-[#E7E6DF] dark:hover:bg-[#31372F] border border-[#E4E3DC] dark:border-[#2D332C] transition-all"
          title="Reset to step 0"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
          <span>Reset</span>
        </button>

        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          {/* Step Back */}
          <button
            onClick={onPrev}
            disabled={isStart}
            className="p-2 rounded-lg bg-[#EFEEE8] dark:bg-[#242823] hover:bg-[#E7E6DF] dark:hover:bg-[#31372F] text-[#252720] dark:text-[#EDECE6] disabled:opacity-30 disabled:cursor-not-allowed border border-[#E4E3DC] dark:border-[#2D332C] transition-all"
            title="Step Back"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="19 20 9 12 19 4 19 20" />
              <line x1="5" y1="19" x2="5" y2="5" />
            </svg>
          </button>

          {/* Play / Pause */}
          <button
            onClick={isPlaying ? onPause : onPlay}
            disabled={isEnd && !isPlaying}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#66765B] hover:bg-[#58664E] text-white font-medium text-xs disabled:opacity-30 disabled:cursor-not-allowed shadow-xs transition-all hover:scale-102"
          >
            {isPlaying ? (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
                <span>Pause</span>
              </>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <span>{isStart ? 'Run Simulation' : isEnd ? 'Completed' : 'Play'}</span>
              </>
            )}
          </button>

          {/* Step Forward */}
          <button
            onClick={onNext}
            disabled={isEnd}
            className="p-2 rounded-lg bg-[#EFEEE8] dark:bg-[#242823] hover:bg-[#E7E6DF] dark:hover:bg-[#31372F] text-[#252720] dark:text-[#EDECE6] disabled:opacity-30 disabled:cursor-not-allowed border border-[#E4E3DC] dark:border-[#2D332C] transition-all"
            title="Step Next"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 4 15 12 5 20 5 4" />
              <line x1="19" y1="5" x2="19" y2="19" />
            </svg>
          </button>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-1 bg-[#EFEEE8] dark:bg-[#242823] p-1 rounded-xl border border-[#E4E3DC] dark:border-[#2D332C]">
          <span className="text-[11px] text-[#77786F] dark:text-[#A6A79E] px-2">Speed</span>
          {[0.5, 1, 2].map((s) => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium transition-all ${
                speed === s
                  ? 'bg-white dark:bg-[#1E211D] text-[#252720] dark:text-[#EDECE6] shadow-xs'
                  : 'text-[#77786F] dark:text-[#A6A79E] hover:text-[#252720] dark:hover:text-white'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
