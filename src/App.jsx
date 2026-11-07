import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AppLayout } from './components/layout/AppLayout';
import IntroductionPage from './pages/IntroductionPage';
import FoundationsPage from './pages/FoundationsPage';
import DSUPage from './pages/DSUPage';
import VisualizerPage from './pages/VisualizerPage';
import JavaPage from './pages/JavaPage';
import ComplexityPage from './pages/ComplexityPage';
import QuizPage from './pages/QuizPage';
import ChallengePage from './pages/ChallengePage';
import CompletionPage from './pages/CompletionPage';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<IntroductionPage />} />
            <Route path="/introduction" element={<IntroductionPage />} />
            <Route path="/foundations" element={<FoundationsPage />} />
            <Route path="/dsu" element={<DSUPage />} />
            <Route path="/visualizer" element={<VisualizerPage />} />
            <Route path="/java-walkthrough" element={<JavaPage />} />
            <Route path="/complexity" element={<ComplexityPage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/challenge" element={<ChallengePage />} />
            <Route path="/completion" element={<CompletionPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
