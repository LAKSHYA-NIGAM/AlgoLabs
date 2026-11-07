import React, { useState, useEffect } from 'react';

export function PredictionCard({
  snapshot,
  onPredictionMade = null
}) {
  const [userGuess, setUserGuess] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  useEffect(() => {
    setUserGuess(null);
    setHasAnswered(false);
  }, [snapshot?.stepIndex]);

  if (!snapshot || snapshot.type !== 'CONSIDER' || !snapshot.currentEdge) {
    return null;
  }

  const { currentEdge, expectedAction, representatives } = snapshot;

  const handleGuess = (guess) => {
    setUserGuess(guess);
    setHasAnswered(true);
    const isCorrect = guess === expectedAction;
    if (onPredictionMade) {
      onPredictionMade(isCorrect);
    }
  };

  const isCorrect = userGuess === expectedAction;

  return (
    <div className="bg-white dark:bg-[#1E211D] rounded-2xl border border-[#E4E3DC] dark:border-[#2D332C] p-5 shadow-xs space-y-3 transition-colors">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-heading font-semibold uppercase tracking-wider text-[#252720] dark:text-[#EDECE6]">
          Active Learner Prediction
        </h4>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EFEEE8] dark:bg-[#242823] text-[#252720] dark:text-[#EDECE6]">
          Edge ({currentEdge.u}, {currentEdge.v}) · wt: {currentEdge.weight}
        </span>
      </div>

      <p className="text-xs text-[#77786F] dark:text-[#A6A79E] leading-relaxed">
        Will edge <strong>({currentEdge.u}, {currentEdge.v})</strong> be accepted into the MST or rejected as a cycle?
      </p>

      {!hasAnswered ? (
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={() => handleGuess('ACCEPT')}
            className="flex-1 py-2 px-3 rounded-xl bg-[#EBF0E8] dark:bg-[#232C21] hover:bg-[#DCE7D7] dark:hover:bg-[#2D382B] text-[#47533F] dark:text-[#8C9D81] border border-[#C5D1C1] text-xs font-medium transition-all"
          >
            Accept (Different Sets)
          </button>
          <button
            onClick={() => handleGuess('REJECT')}
            className="flex-1 py-2 px-3 rounded-xl bg-[#FDF2F1] dark:bg-[#2D1D1C] hover:bg-[#FAE2E0] dark:hover:bg-[#3D2524] text-[#8A3B35] dark:text-[#F59690] border border-[#EFC8C5] text-xs font-medium transition-all"
          >
            Reject (Same Set)
          </button>
        </div>
      ) : (
        <div
          className={`p-3 rounded-xl text-xs font-medium border ${
            isCorrect
              ? 'bg-[#EBF0E8] dark:bg-[#232C21] border-[#C5D1C1] text-[#47533F] dark:text-[#8C9D81]'
              : 'bg-[#FDF2F1] dark:bg-[#2D1D1C] border-[#EFC8C5] text-[#8A3B35] dark:text-[#F59690]'
          }`}
        >
          {isCorrect
            ? `✓ Correct! Find(${currentEdge.u}) = ${representatives?.rootU} and Find(${currentEdge.v}) = ${representatives?.rootV}.`
            : `✗ Incorrect! This edge connects roots ${representatives?.rootU} and ${representatives?.rootV}.`}
        </div>
      )}
    </div>
  );
}
