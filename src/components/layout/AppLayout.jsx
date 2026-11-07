import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { LegalModal } from '../legal/LegalModal';
import { LESSON_MODULES } from '../../data/curriculumModules';
import { loadProgress, saveProgress, resetProgress } from '../../utils/storage';

export function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [progressState, setProgressState] = useState(loadProgress);
  const [legalModal, setLegalModal] = useState({ open: false, type: 'privacy' });
  const location = useLocation();
  const navigate = useNavigate();

  const currentModuleIndex = LESSON_MODULES.findIndex(
    m => m.path === location.pathname || (m.alias && m.alias === location.pathname)
  );

  useEffect(() => {
    if (location.pathname) {
      setProgressState(prev => {
        const visited = new Set(prev.visitedSections || []);
        visited.add(location.pathname);
        const percent = Math.min(100, Math.round((visited.size / LESSON_MODULES.length) * 100));
        const updated = {
          ...prev,
          visitedSections: Array.from(visited),
          currentSection: location.pathname,
          progressPercent: percent
        };
        saveProgress(updated);
        return updated;
      });
    }
  }, [location.pathname]);

  const handleReset = () => {
    if (window.confirm('Reset all lesson progress and quiz results?')) {
      const reset = resetProgress();
      setProgressState(reset);
      navigate('/');
    }
  };

  const prevModule = currentModuleIndex > 0 ? LESSON_MODULES[currentModuleIndex - 1] : null;
  const nextModule = currentModuleIndex < LESSON_MODULES.length - 1 ? LESSON_MODULES[currentModuleIndex + 1] : null;

  return (
    <div className="min-h-screen bg-[#F6F5F0] dark:bg-[#161815] text-[#252720] dark:text-[#EDECE6] flex flex-col font-sans transition-colors duration-200">
      {/* Accessibility Skip-to-Content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#66765B] focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-hidden"
      >
        Skip to main content
      </a>

      <Header
        progress={progressState.progressPercent || 0}
        onResetProgress={handleReset}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content Area (1100–1200px max width with generous whitespace) */}
      <div className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col md:flex-row gap-8 items-start">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          visitedModules={new Set(progressState.visitedSections || [])}
        />

        <main id="main-content" tabIndex="-1" className="flex-1 min-w-0 w-full flex flex-col gap-8 outline-hidden">
          {/* Main Content Router Outlet */}
          <div className="flex-1 w-full min-w-0">
            <Outlet context={{ progressState, setProgressState }} />
          </div>

          {/* Bottom Module Stepper Navigation */}
          {currentModuleIndex !== -1 && (
            <div className="pt-6 border-t border-[#E4E3DC] dark:border-[#2D332C] flex flex-wrap items-center justify-between gap-4">
              <div>
                {prevModule ? (
                  <button
                    onClick={() => navigate(prevModule.path)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-[#252720] dark:text-[#EDECE6] bg-[#EFEEE8] dark:bg-[#242823] hover:bg-[#E7E6DF] dark:hover:bg-[#31372F] border border-[#E4E3DC] dark:border-[#2D332C] transition-all"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                    <span>Previous: <span className="font-semibold">{prevModule.title}</span></span>
                  </button>
                ) : (
                  <span className="text-xs font-mono text-[#77786F] dark:text-[#A6A79E]">
                    Chapter 01 of 08
                  </span>
                )}
              </div>

              <div>
                {nextModule ? (
                  <button
                    onClick={() => navigate(nextModule.path)}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#66765B] hover:bg-[#58664E] shadow-xs transition-all hover:translate-x-0.5"
                  >
                    <span>Next: <strong>{nextModule.title}</strong></span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/introduction')}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#66765B] hover:bg-[#58664E] shadow-xs transition-all"
                  >
                    <span>Review from Start</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Educational Platform Footer with Legal Links */}
          <footer className="pt-4 pb-2 border-t border-[#ECEBE5] dark:border-[#232822] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#77786F] dark:text-[#A6A79E]">
            <div>
              <span>AlgoLab · Kruskal & DSU Masterclass · Scholar Lakshya Nigam</span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setLegalModal({ open: true, type: 'privacy' })}
                className="hover:text-[#252720] dark:hover:text-[#EDECE6] underline underline-offset-2 transition-colors"
              >
                Privacy Policy
              </button>
              <span>·</span>
              <button
                onClick={() => setLegalModal({ open: true, type: 'terms' })}
                className="hover:text-[#252720] dark:hover:text-[#EDECE6] underline underline-offset-2 transition-colors"
              >
                Terms of Service
              </button>
            </div>
          </footer>
        </main>
      </div>

      {/* Accessible Legal Information Modal */}
      <LegalModal
        isOpen={legalModal.open}
        type={legalModal.type}
        onClose={() => setLegalModal({ open: false, type: 'privacy' })}
      />
    </div>
  );
}
