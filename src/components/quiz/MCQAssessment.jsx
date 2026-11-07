import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../../data/quizQuestions';
import { saveProgress, loadProgress } from '../../utils/storage';

export function MCQAssessment({ onAssessmentComplete = null }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [weakConcepts, setWeakConcepts] = useState([]);
  const [quizFinished, setQuizFinished] = useState(false);

  const question = QUIZ_QUESTIONS[currentIdx];
  const totalQuestions = QUIZ_QUESTIONS.length;

  const handleSelectOption = (optId) => {
    if (isSubmitted) return;
    setSelectedOption(optId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOption || isSubmitted) return;

    const isCorrect = selectedOption === question.correctAnswer;
    const updatedAnswers = {
      ...userAnswers,
      [question.id]: {
        selected: selectedOption,
        isCorrect,
        concept: question.concept,
        conceptLabel: question.conceptLabel
      }
    };
    setUserAnswers(updatedAnswers);
    setIsSubmitted(true);

    if (!isCorrect) {
      if (!weakConcepts.includes(question.conceptLabel)) {
        setWeakConcepts(prev => [...prev, question.conceptLabel]);
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setQuizFinished(true);
    const correctCount = Object.values(userAnswers).filter(a => a.isCorrect).length;
    const accuracy = Math.round((correctCount / totalQuestions) * 100);

    const currentSaved = loadProgress();
    const updated = {
      ...currentSaved,
      quizResults: {
        total: totalQuestions,
        correct: correctCount,
        accuracy,
        weakConcepts
      }
    };
    saveProgress(updated);

    if (onAssessmentComplete) {
      onAssessmentComplete({ total: totalQuestions, correct: correctCount, accuracy, weakConcepts });
    }
  };

  const handleRetry = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setUserAnswers({});
    setWeakConcepts([]);
    setQuizFinished(false);
  };

  const correctCount = Object.values(userAnswers).filter(a => a.isCorrect).length;
  const accuracy = Math.round((correctCount / totalQuestions) * 100);

  if (quizFinished) {
    return (
      <div className="bg-white dark:bg-[#1E211D] rounded-2xl border border-[#E4E3DC] dark:border-[#2D332C] p-6 sm:p-8 space-y-6 text-center transition-colors">
        <div className="w-12 h-12 rounded-xl bg-[#EBF0E8] dark:bg-[#232C21] text-[#477B5C] dark:text-[#529E70] flex items-center justify-center mx-auto">
          {/* Trophy SVG */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.45 1-1 1H7" />
            <path d="M14 14.66V17c0 .55.45 1 1 1h2" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
          </svg>
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl font-heading font-semibold text-[#252720] dark:text-[#EDECE6]">
            Assessment Completed
          </h2>
          <p className="text-xs text-[#77786F] dark:text-[#A6A79E] max-w-md mx-auto leading-relaxed">
            You completed all {totalQuestions} conceptual questions covering Kruskal, DSU, path compression, and asymptotic complexity.
          </p>
        </div>

        {/* Score & Accuracy Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#EFEEE8] dark:bg-[#242823] border border-[#E4E3DC] dark:border-[#2D332C] text-center">
            <div className="text-[11px] font-heading font-semibold text-[#77786F] dark:text-[#A6A79E] uppercase tracking-wider">Score</div>
            <div className="text-2xl font-semibold text-[#252720] dark:text-[#EDECE6] mt-1 font-mono">
              {correctCount} / {totalQuestions}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#EFEEE8] dark:bg-[#242823] border border-[#E4E3DC] dark:border-[#2D332C] text-center">
            <div className="text-[11px] font-heading font-semibold text-[#77786F] dark:text-[#A6A79E] uppercase tracking-wider">Accuracy</div>
            <div className={`text-2xl font-semibold mt-1 font-mono ${accuracy >= 75 ? 'text-[#477B5C] dark:text-[#529E70]' : accuracy >= 50 ? 'text-[#B58A43]' : 'text-[#B65E57] dark:text-[#D96A62]'}`}>
              {accuracy}%
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#EFEEE8] dark:bg-[#242823] border border-[#E4E3DC] dark:border-[#2D332C] text-center">
            <div className="text-[11px] font-heading font-semibold text-[#77786F] dark:text-[#A6A79E] uppercase tracking-wider">Status</div>
            <div className="text-xs font-semibold text-[#252720] dark:text-[#EDECE6] mt-2">
              {accuracy >= 75 ? 'Mastery Achieved' : 'Review Recommended'}
            </div>
          </div>
        </div>

        {/* Weak concepts diagnostics */}
        {weakConcepts.length > 0 ? (
          <div className="p-4 rounded-xl bg-[#FAF0EF] dark:bg-[#2D1817] border border-[#F0D5D3] dark:border-[#5E2825] space-y-2 text-left">
            <div className="flex items-center gap-2 text-[#B65E57] dark:text-[#F59690] font-heading font-semibold text-xs">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>Recommended for Review:</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {weakConcepts.map((c) => (
                <span key={c} className="px-3 py-1 rounded-full bg-white dark:bg-[#1E211D] text-[#B65E57] dark:text-[#F59690] border border-[#F0D5D3] dark:border-[#5E2825] text-xs font-medium">
                  {c}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-[#EBF0E8] dark:bg-[#232C21] border border-[#C5D1C1] dark:border-[#265438] text-xs text-[#47533F] dark:text-[#8C9D81] flex items-center justify-center gap-2 font-medium">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 8.5 6.5 12 13 4" />
            </svg>
            <span>100% Accuracy! All DSU and Kruskal principles mastered without misconceptions.</span>
          </div>
        )}

        <div className="flex justify-center pt-2">
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#EFEEE8] dark:bg-[#242823] hover:bg-[#E5E4DC] dark:hover:bg-[#2C3038] text-[#252720] dark:text-[#EDECE6] border border-[#E4E3DC] dark:border-[#2D332C] text-xs font-medium transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
            <span>Retake Assessment</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1E211D] rounded-2xl border border-[#E4E3DC] dark:border-[#2D332C] p-6 sm:p-8 space-y-6 transition-colors">
      {/* Progress & Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#ECEBE5] dark:border-[#232822]">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-full bg-[#EFEEE8] dark:bg-[#242823] text-[#252720] dark:text-[#EDECE6] border border-[#E4E3DC] dark:border-[#2D332C]">
            Question {currentIdx + 1} of {totalQuestions}
          </span>
          <span className="text-xs text-[#77786F] dark:text-[#A6A79E]">
            Topic: <strong className="text-[#252720] dark:text-[#EDECE6]">{question.conceptLabel}</strong>
          </span>
        </div>

        {/* Progress dots */}
        <div className="flex items-center gap-1.5">
          {QUIZ_QUESTIONS.map((q, idx) => {
            const answered = userAnswers[q.id];
            let dotClass = 'bg-[#E4E3DC] dark:bg-[#2D332C]';
            if (idx === currentIdx) dotClass = 'bg-[#66765B] dark:text-[#8C9D81] ring-2 ring-[#EBF0E8] dark:ring-[#232C21]';
            else if (answered && answered.isCorrect) dotClass = 'bg-[#477B5C] dark:bg-[#529E70]';
            else if (answered && !answered.isCorrect) dotClass = 'bg-[#B65E57] dark:bg-[#D96A62]';

            return <div key={q.id} className={`w-2.5 h-2.5 rounded-full transition-all ${dotClass}`} />;
          })}
        </div>
      </div>

      {/* Question Prompt */}
      <div className="space-y-2">
        <h3 className="text-base sm:text-lg font-heading font-semibold text-[#252720] dark:text-[#EDECE6] leading-snug">
          {question.question}
        </h3>
      </div>

      {/* Options List */}
      <div className="space-y-3">
        {question.options.map((opt) => {
          const isSelected = selectedOption === opt.id;
          const isCorrectChoice = opt.id === question.correctAnswer;

          let btnClass = 'bg-[#EFEEE8] dark:bg-[#242823] border-[#E4E3DC] dark:border-[#2D332C] hover:bg-[#E5E4DC] dark:hover:bg-[#2C3038] text-[#252720] dark:text-[#EDECE6]';

          if (isSubmitted) {
            if (isCorrectChoice) {
              btnClass = 'bg-[#EBF0E8] dark:bg-[#232C21] border-[#C5D1C1] dark:border-[#265438] text-[#47533F] dark:text-[#8C9D81] font-medium';
            } else if (isSelected && !isCorrectChoice) {
              btnClass = 'bg-[#FAF0EF] dark:bg-[#2D1817] border-[#F0D5D3] dark:border-[#5E2825] text-[#B65E57] dark:text-[#F59690] font-medium';
            } else {
              btnClass = 'bg-[#EFEEE8] dark:bg-[#242823] border-[#E4E3DC] dark:border-[#2D332C] text-[#999A91] dark:text-[#7E8077] opacity-60';
            }
          } else if (isSelected) {
            btnClass = 'bg-white dark:bg-[#1E211D] border-[#66765B] shadow-xs text-[#252720] dark:text-[#EDECE6] font-medium ring-1 ring-[#66765B]';
          }

          return (
            <button
              key={opt.id}
              onClick={() => handleSelectOption(opt.id)}
              disabled={isSubmitted}
              className={`w-full text-left p-3.5 sm:p-4 rounded-xl border text-xs sm:text-sm flex items-start gap-3 transition-all ${btnClass}`}
            >
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono text-xs font-semibold shrink-0 mt-0.5 ${
                  isSubmitted && isCorrectChoice
                    ? 'bg-[#477B5C] dark:bg-[#529E70] text-white'
                    : isSubmitted && isSelected && !isCorrectChoice
                    ? 'bg-[#B65E57] dark:bg-[#D96A62] text-white'
                    : isSelected
                    ? 'bg-[#66765B] text-white'
                    : 'bg-white dark:bg-[#1E211D] text-[#77786F] dark:text-[#A6A79E] border border-[#E4E3DC] dark:border-[#2D332C]'
                }`}
              >
                {opt.id}
              </div>
              <div className="flex-1 leading-relaxed">{opt.text}</div>

              {isSubmitted && isCorrectChoice && (
                <span className="text-[#477B5C] dark:text-[#529E70] shrink-0 mt-0.5">
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 8.5 6.5 12 13 4" />
                  </svg>
                </span>
              )}
              {isSubmitted && isSelected && !isCorrectChoice && (
                <span className="text-[#B65E57] dark:text-[#D96A62] shrink-0 mt-0.5">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Answer Feedback & Misconception Explanations */}
      {isSubmitted && (
        <div className="space-y-2 pt-1">
          <div
            className={`p-4 rounded-xl border text-xs sm:text-sm leading-relaxed ${
              selectedOption === question.correctAnswer
                ? 'bg-[#EBF0E8] dark:bg-[#232C21] border-[#C5D1C1] dark:border-[#265438] text-[#47533F] dark:text-[#8C9D81]'
                : 'bg-[#FAF0EF] dark:bg-[#2D1817] border-[#F0D5D3] dark:border-[#5E2825] text-[#B65E57] dark:text-[#F59690]'
            }`}
          >
            <div className="font-heading font-semibold mb-1 flex items-center gap-2">
              {selectedOption === question.correctAnswer ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 8.5 6.5 12 13 4" />
                  </svg>
                  <span>Correct Answer</span>
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>Incorrect Choice</span>
                </>
              )}
            </div>
            <p className="text-xs leading-relaxed">{question.explanation}</p>

            {selectedOption !== question.correctAnswer && question.wrongExplanations?.[selectedOption] && (
              <div className="mt-2.5 pt-2.5 border-t border-[#F0D5D3] dark:border-[#5E2825] text-xs">
                <strong>Why option ({selectedOption}) is incorrect:</strong> {question.wrongExplanations[selectedOption]}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-[#ECEBE5] dark:border-[#232822]">
        <span className="text-xs text-[#77786F] dark:text-[#A6A79E]">
          {!isSubmitted ? 'Select an answer to submit.' : 'Review explanation and continue.'}
        </span>

        {!isSubmitted ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={!selectedOption}
            className="px-5 py-2 rounded-xl bg-[#66765B] hover:bg-[#57644E] disabled:opacity-40 text-white font-medium text-xs shadow-xs transition-colors"
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#66765B] hover:bg-[#57644E] text-white font-medium text-xs shadow-xs transition-colors"
          >
            <span>{currentIdx < totalQuestions - 1 ? 'Next Question' : 'View Summary'}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
