/**
 * LocalStorage management for student progress and telemetry
 */

const STORAGE_KEY = 'algolab_learning_state_v1';

export const INITIAL_STATE = {
  visitedSections: ['intro'],
  currentSection: 'intro',
  progressPercent: 0,
  quizAttempts: {
    total: 0,
    correct: 0,
    accuracy: 0,
    answers: {},
    weakConcepts: [],
    completed: false
  },
  challengeAttempts: {
    manualBuilderCompleted: false,
    manualBuilderAttempts: 0,
    manualBuilderBestCost: null,
    codingChallengePassed: false,
    testCasesPassed: 0,
    totalTestCases: 5,
    completedAt: null
  },
  visualizerStats: {
    customGraphsRun: 0,
    predictionsCorrect: 0,
    predictionsTotal: 0
  }
};

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_STATE;
    const parsed = JSON.parse(raw);
    return { ...INITIAL_STATE, ...parsed };
  } catch (e) {
    console.warn('Failed to load progress from localStorage:', e);
    return INITIAL_STATE;
  }
}

export function saveProgress(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save progress to localStorage:', e);
  }
}

export function resetProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return INITIAL_STATE;
  } catch (e) {
    console.warn('Failed to reset progress:', e);
    return INITIAL_STATE;
  }
}
