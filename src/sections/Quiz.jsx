import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  ChevronRight,
  RotateCcw,
  Award,
  ChevronLeft,
  Sparkles,
} from 'lucide-react';

const questions = [
  {
    id: 1,
    question: 'What data structure does Kruskal\'s algorithm use to detect cycles?',
    options: ['Stack', 'Queue', 'Disjoint Set Union', 'Binary Search Tree'],
    correct: 2,
    explanation:
      'Kruskal\'s uses Disjoint Set Union (DSU) to efficiently detect whether adding an edge would create a cycle by checking if two vertices belong to the same set.',
  },
  {
    id: 2,
    question: 'What is the first step in Kruskal\'s algorithm?',
    options: [
      'Find the shortest path',
      'Sort all edges by weight',
      'Remove the heaviest edge',
      'Find connected components',
    ],
    correct: 1,
    explanation:
      'Kruskal\'s algorithm begins by sorting all edges in non-decreasing order of their weights, then greedily picks the smallest edge that doesn\'t form a cycle.',
  },
  {
    id: 3,
    question: 'In DSU with path compression, what does find(x) do after finding the root?',
    options: [
      'Deletes the node',
      'Creates a new set',
      'Points x directly to root',
      'Increases the rank',
    ],
    correct: 2,
    explanation:
      'Path compression flattens the tree by making every node on the path from x to the root point directly to the root, dramatically speeding up future queries.',
  },
  {
    id: 4,
    question: 'When should we REJECT an edge in Kruskal\'s algorithm?',
    options: [
      'When the weight is too high',
      'When the edge creates a cycle',
      'When the graph is complete',
      'When we\'ve visited all nodes',
    ],
    correct: 1,
    explanation:
      'An edge is rejected if both its endpoints already belong to the same connected component — adding it would create a cycle in the MST.',
  },
  {
    id: 5,
    question: 'What is the time complexity of Kruskal\'s algorithm?',
    options: ['O(V²)', 'O(E log E)', 'O(V log V)', 'O(E²)'],
    correct: 1,
    explanation:
      'The dominant cost is sorting all E edges, which takes O(E log E). The DSU operations are nearly O(1) amortized with path compression and union by rank.',
  },
  {
    id: 6,
    question: 'Union by rank in DSU ensures that:',
    options: [
      'All trees have the same depth',
      'The shorter tree is attached under the taller tree',
      'Elements are sorted',
      'No path compression is needed',
    ],
    correct: 1,
    explanation:
      'Union by rank always attaches the shorter tree under the root of the taller tree, keeping the overall tree shallow and operations fast.',
  },
];

/* ---------- tiny confetti particles ---------- */
function ConfettiBurst() {
  const particles = Array.from({ length: 24 });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((_, i) => {
        const angle = (i / particles.length) * 360;
        const distance = 60 + Math.random() * 80;
        const dx = Math.cos((angle * Math.PI) / 180) * distance;
        const dy = Math.sin((angle * Math.PI) / 180) * distance;
        const colors = [
          'bg-cyan-400',
          'bg-emerald-400',
          'bg-amber-400',
          'bg-blue-400',
          'bg-pink-400',
        ];
        return (
          <motion.div
            key={i}
            className={`absolute left-1/2 top-1/2 h-2 w-2 rounded-full ${colors[i % colors.length]}`}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: dx, y: dy, opacity: 0, scale: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        );
      })}
    </div>
  );
}

/* ---------- single option button ---------- */
function OptionButton({ text, index, state, onClick }) {
  const labels = ['A', 'B', 'C', 'D'];

  let classes =
    'relative flex items-center gap-3 rounded-xl border px-5 py-4 text-left font-medium transition-all duration-300 cursor-pointer';

  if (state === 'idle') {
    classes +=
      ' bg-white/5 border-white/10 text-gray-200 hover:bg-white/10 hover:border-cyan-500/40';
  } else if (state === 'correct') {
    classes += ' bg-emerald-500/20 border-emerald-400 text-emerald-300';
  } else if (state === 'wrong') {
    classes += ' bg-rose-500/20 border-rose-400 text-rose-300';
  } else if (state === 'reveal') {
    classes += ' bg-emerald-500/10 border-emerald-400/50 text-emerald-400';
  } else {
    classes += ' bg-white/5 border-white/5 text-gray-500 cursor-default';
  }

  return (
    <motion.button
      whileHover={state === 'idle' ? { scale: 1.02 } : {}}
      whileTap={state === 'idle' ? { scale: 0.98 } : {}}
      animate={state === 'wrong' ? { x: [0, -6, 6, -4, 4, 0] } : {}}
      transition={{ duration: 0.4 }}
      className={classes}
      onClick={state === 'idle' ? onClick : undefined}
      disabled={state !== 'idle'}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-sm font-bold">
        {labels[index]}
      </span>
      <span className="text-sm sm:text-base">{text}</span>
      {state === 'correct' && (
        <CheckCircle className="absolute right-4 h-5 w-5 text-emerald-400" />
      )}
      {state === 'wrong' && (
        <XCircle className="absolute right-4 h-5 w-5 text-rose-400" />
      )}
    </motion.button>
  );
}

/* ---------- results summary ---------- */
function ResultsSummary({ score, answers, onReview, onNext, onPrev }) {
  const pct = Math.round((score / questions.length) * 100);

  let message = '';
  if (pct === 100) message = 'Perfect score! You truly understand DSU & Kruskal\'s! 🏆';
  else if (pct >= 80) message = 'Great job! You have a solid understanding! 🎉';
  else if (pct >= 50) message = 'Good effort! Review the topics you missed. 💪';
  else message = 'Keep learning! Review the material and try again. 📚';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="w-full max-w-lg mx-auto"
    >
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center relative overflow-hidden">
        {/* decorative glow */}
        <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl" />

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
          className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600"
        >
          <Award className="h-12 w-12 text-white" />
        </motion.div>

        <h2 className="text-2xl font-bold text-white mb-1">Quiz Complete!</h2>

        <div className="my-6">
          <span className="text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            {score}/{questions.length}
          </span>
          <p className="mt-1 text-gray-400 text-sm">{pct}% correct</p>
        </div>

        <p className="text-gray-300 mb-8">{message}</p>

        <div className="flex flex-col gap-3">
          {score < questions.length && (
            <button
              onClick={onReview}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-gray-300 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              Review Mistakes
            </button>
          )}
          <button
            onClick={onNext}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-6 py-3 font-semibold text-white transition-all cursor-pointer"
          >
            Continue to Challenge
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* nav */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={onPrev}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous Section
        </button>
      </div>
    </motion.div>
  );
}

/* ========== main Quiz component ========== */
export default function Quiz({ onNext, onPrev, onScoreUpdate }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [quizDone, setQuizDone] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewList, setReviewList] = useState([]);
  const [reviewPos, setReviewPos] = useState(0);

  const score = answers.filter((a, i) => a === questions[i].correct).length;

  const handleSelect = useCallback(
    (optIndex) => {
      if (selectedIdx !== null) return;
      setSelectedIdx(optIndex);
      const newAnswers = [...answers];
      newAnswers[current] = optIndex;
      setAnswers(newAnswers);
      setShowResult(true);

      /* propagate score */
      if (onScoreUpdate) {
        const newScore = newAnswers.filter(
          (a, i) => a === questions[i].correct
        ).length;
        onScoreUpdate(newScore);
      }
    },
    [selectedIdx, answers, current, onScoreUpdate]
  );

  const handleNext = useCallback(() => {
    if (reviewMode) {
      if (reviewPos + 1 < reviewList.length) {
        setReviewPos(reviewPos + 1);
        setCurrent(reviewList[reviewPos + 1]);
        setSelectedIdx(answers[reviewList[reviewPos + 1]]);
        setShowResult(true);
      } else {
        setReviewMode(false);
        setQuizDone(true);
      }
      return;
    }
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setSelectedIdx(null);
      setShowResult(false);
    } else {
      setQuizDone(true);
    }
  }, [current, reviewMode, reviewPos, reviewList, answers]);

  const startReview = useCallback(() => {
    const mistakes = answers
      .map((a, i) => (a !== questions[i].correct ? i : -1))
      .filter((i) => i >= 0);
    setReviewList(mistakes);
    setReviewPos(0);
    setReviewMode(true);
    setQuizDone(false);
    setCurrent(mistakes[0]);
    setSelectedIdx(answers[mistakes[0]]);
    setShowResult(true);
  }, [answers]);

  const q = questions[current];

  const optionState = (optIndex) => {
    if (!showResult) return 'idle';
    if (optIndex === q.correct) return 'correct';
    if (optIndex === selectedIdx && selectedIdx !== q.correct) return 'wrong';
    if (showResult) return 'disabled';
    return 'idle';
  };

  const isCorrect = selectedIdx === q.correct;

  /* progress bar fraction */
  const progressWidth = reviewMode
    ? ((reviewPos + 1) / reviewList.length) * 100
    : ((current + 1) / questions.length) * 100;

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16 overflow-hidden">
      {/* background blobs */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-cyan-500/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-3xl" />

      {/* section indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 text-xs tracking-widest text-gray-500 uppercase"
      >
        07 / 08
      </motion.div>

      {/* heading */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl sm:text-4xl font-bold text-white mb-2 text-center"
      >
        Knowledge Check{' '}
        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Quiz
        </span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-gray-400 mb-10 text-center"
      >
        {reviewMode
          ? 'Reviewing your mistakes'
          : 'Test your understanding of DSU & Kruskal\'s algorithm'}
      </motion.p>

      <AnimatePresence mode="wait">
        {quizDone ? (
          <ResultsSummary
            key="results"
            score={score}
            answers={answers}
            onReview={startReview}
            onNext={onNext}
            onPrev={onPrev}
          />
        ) : (
          <motion.div
            key={`q-${current}`}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-full max-w-2xl"
          >
            {/* top bar: progress + score */}
            <div className="mb-6 flex items-center gap-4">
              <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressWidth}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold text-gray-400">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span className="text-amber-400">{score}</span>/{questions.length}
              </div>
            </div>

            {/* question card */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
              {/* confetti on correct */}
              {showResult && isCorrect && <ConfettiBurst />}

              {/* question number */}
              <span className="inline-block rounded-lg bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-400 mb-4">
                Question {current + 1} of {questions.length}
              </span>

              <h2 className="text-lg sm:text-xl font-semibold text-white mb-6 leading-relaxed">
                {q.question}
              </h2>

              {/* options 2×2 grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {q.options.map((opt, i) => (
                  <OptionButton
                    key={i}
                    text={opt}
                    index={i}
                    state={optionState(i)}
                    onClick={() => handleSelect(i)}
                  />
                ))}
              </div>

              {/* feedback */}
              <AnimatePresence>
                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`mt-6 rounded-xl p-4 text-sm leading-relaxed ${
                      isCorrect
                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
                        : 'bg-rose-500/10 border border-rose-500/20 text-rose-300'
                    }`}
                  >
                    <p className="font-bold mb-1">
                      {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
                    </p>
                    <p className="text-gray-400">{q.explanation}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* next button */}
              <AnimatePresence>
                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 flex justify-end"
                  >
                    <button
                      onClick={handleNext}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-6 py-3 font-semibold text-white transition-all cursor-pointer"
                    >
                      {(reviewMode
                        ? reviewPos + 1 >= reviewList.length
                        : current + 1 >= questions.length)
                        ? 'See Results'
                        : 'Next Question'}
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* bottom nav */}
            <div className="mt-6 flex justify-between">
              <button
                onClick={onPrev}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous Section
              </button>
              <button
                onClick={onNext}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
              >
                Skip to Challenge
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
