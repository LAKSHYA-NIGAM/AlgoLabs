import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  CheckCircle,
  Share2,
  RotateCcw,
  Layers,
  GitBranch,
  Clock,
  Sparkles,
} from 'lucide-react';

/* ---------- animated background particles ---------- */
function FloatingParticles() {
  const particles = Array.from({ length: 30 });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((_, i) => {
        const size = 3 + Math.random() * 4;
        const left = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = 6 + Math.random() * 8;
        const colors = [
          'bg-cyan-400/30',
          'bg-blue-400/30',
          'bg-emerald-400/20',
          'bg-amber-400/20',
          'bg-purple-400/20',
        ];
        return (
          <motion.div
            key={i}
            className={`absolute rounded-full ${colors[i % colors.length]}`}
            style={{
              width: size,
              height: size,
              left: `${left}%`,
              bottom: '-5%',
            }}
            animate={{
              y: [0, -window.innerHeight * 1.2],
              x: [0, (Math.random() - 0.5) * 100],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        );
      })}
    </div>
  );
}

/* ---------- animated check mark ---------- */
function AnimatedCheckmark() {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -20 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 15 }}
      className="relative mx-auto mb-6"
    >
      {/* outer glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
        initial={{ scale: 1, opacity: 0.5 }}
        animate={{ scale: 1.5, opacity: 0 }}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{ width: 112, height: 112, top: -8, left: -8 }}
      />
      <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25">
        <motion.div
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Trophy className="h-12 w-12 text-white" />
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ---------- summary cards data ---------- */
const summaryCards = [
  {
    icon: <Layers className="h-6 w-6 text-cyan-400" />,
    title: 'Disjoint Set Union',
    points: ['Find with path compression', 'Union by rank'],
    gradient: 'from-cyan-500/10 to-cyan-500/5',
    border: 'border-cyan-500/20',
  },
  {
    icon: <GitBranch className="h-6 w-6 text-emerald-400" />,
    title: "Kruskal's Algorithm",
    points: ['Greedy edge selection', 'Cycle detection with DSU'],
    gradient: 'from-emerald-500/10 to-emerald-500/5',
    border: 'border-emerald-500/20',
  },
  {
    icon: <Clock className="h-6 w-6 text-amber-400" />,
    title: 'Complexity',
    points: ['O(E log E) time', 'O(V + E) space'],
    gradient: 'from-amber-500/10 to-amber-500/5',
    border: 'border-amber-500/20',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.4 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } },
};

/* ========== main Completion component ========== */
export default function Completion({ quizScore = 0, challengeTime = 0, onRestart }) {
  /* simple confetti burst on mount */
  const [showConfetti, setShowConfetti] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(t);
  }, []);

  const scoreMsg =
    quizScore === 6
      ? 'Perfect quiz score!'
      : quizScore >= 4
      ? 'Great quiz performance!'
      : 'Keep practicing the quiz!';

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16 overflow-hidden">
      {/* animated bg */}
      <FloatingParticles />

      {/* confetti burst */}
      {showConfetti && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden z-10">
          {Array.from({ length: 50 }).map((_, i) => {
            const left = Math.random() * 100;
            const delay = Math.random() * 0.6;
            const dur = 2 + Math.random() * 2;
            const colors = [
              'bg-cyan-400',
              'bg-emerald-400',
              'bg-amber-400',
              'bg-blue-400',
              'bg-pink-400',
              'bg-purple-400',
              'bg-red-400',
            ];
            return (
              <motion.div
                key={i}
                className={`absolute h-2 w-2 rounded-sm ${colors[i % colors.length]}`}
                style={{ left: `${left}%`, top: '-2%' }}
                initial={{ y: 0, opacity: 1, rotate: 0 }}
                animate={{
                  y: '110vh',
                  opacity: [1, 1, 0],
                  rotate: Math.random() * 720 - 360,
                }}
                transition={{ duration: dur, delay, ease: 'easeIn' }}
              />
            );
          })}
        </div>
      )}

      {/* background blobs */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-cyan-500/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full bg-blue-500/5 blur-3xl" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-20 w-full max-w-2xl"
      >
        {/* checkmark / trophy */}
        <AnimatedCheckmark />

        {/* heading */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-3">
            Lesson{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Complete!
            </span>
          </h1>
          <p className="text-lg text-gray-400">
            You've mastered Kruskal's Algorithm &amp; DSU!
          </p>
        </motion.div>

        {/* learning summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {summaryCards.map((card) => (
            <motion.div
              key={card.title}
              variants={itemVariants}
              className={`bg-gradient-to-b ${card.gradient} backdrop-blur-xl border ${card.border} rounded-2xl p-5`}
            >
              <div className="mb-3">{card.icon}</div>
              <h3 className="text-white font-semibold text-sm mb-2">
                {card.title}
              </h3>
              <ul className="space-y-1">
                {card.points.map((pt) => (
                  <li
                    key={pt}
                    className="flex items-start gap-2 text-xs text-gray-400"
                  >
                    <CheckCircle className="h-3 w-3 mt-0.5 text-emerald-400 shrink-0" />
                    {pt}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* stats row */}
        <motion.div
          variants={itemVariants}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8"
        >
          <div className="grid grid-cols-2 gap-6">
            {/* quiz score */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-2">
                <Sparkles className="h-4 w-4 text-amber-400" />
                Quiz Score
              </div>
              <div className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {quizScore}/6
              </div>
              <p className="text-xs text-gray-500 mt-1">{scoreMsg}</p>
            </div>

            {/* challenge time */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-2">
                <Clock className="h-4 w-4 text-emerald-400" />
                Challenge Time
              </div>
              <div className="text-3xl font-extrabold bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
                {challengeTime}s
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {challengeTime < 60
                  ? 'Lightning fast!'
                  : challengeTime < 120
                  ? 'Great speed!'
                  : 'Well done!'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {}}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-6 py-3.5 font-semibold text-white transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            <Share2 className="h-4 w-4" />
            Share Your Achievement
          </button>
          <button
            onClick={onRestart}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 font-semibold text-gray-300 hover:bg-white/10 transition-all cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            Start Over
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
