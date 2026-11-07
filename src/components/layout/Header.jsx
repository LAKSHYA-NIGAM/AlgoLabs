import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

export function Header({ progress = 0, onResetProgress, toggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 bg-[#F6F5F0]/95 dark:bg-[#161815]/95 backdrop-blur-md border-b border-[#E4E3DC] dark:border-[#2D332C] transition-colors">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Hamburger (mobile < md) & AlgoLab Minimal Branding */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-lg text-[#252720] dark:text-[#EDECE6] hover:bg-[#EFEEE8] dark:hover:bg-[#242823] transition-colors"
            title="Toggle Navigation"
            aria-label="Toggle navigation menu"
          >
            {/* Inline Hamburger SVG */}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="5" x2="17" y2="5" />
              <line x1="3" y1="10" x2="17" y2="10" />
              <line x1="3" y1="15" x2="17" y2="15" />
            </svg>
          </button>

          <Link to="/" className="flex items-center gap-2.5 group">
            {/* Minimal Geometric Node Logo */}
            <div className="w-8 h-8 rounded-lg bg-[#66765B] text-white flex items-center justify-center font-bold text-sm tracking-tight transition-transform group-hover:scale-105">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="6" cy="6" r="3" />
                <circle cx="18" cy="18" r="3" />
                <circle cx="6" cy="18" r="3" />
                <line x1="6" y1="9" x2="6" y2="15" />
                <line x1="9" y1="6" x2="18" y2="15" />
              </svg>
            </div>
            <div>
              <span className="font-heading font-semibold text-base text-[#252720] dark:text-[#EDECE6] tracking-tight block leading-none">
                AlgoLab
              </span>
              <span className="text-[11px] text-[#77786F] dark:text-[#A6A79E] font-medium leading-none block mt-1">
                Kruskal & DSU
              </span>
            </div>
          </Link>
        </div>

        {/* Center / Right: Progress Indicator, Reset & Theme Toggle */}
        <div className="flex items-center gap-4 sm:gap-6">
          
          {/* Progress Indicator */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-[11px] font-medium text-[#77786F] dark:text-[#A6A79E] leading-none">
                Curriculum Progress
              </div>
              <div className="text-xs font-mono font-semibold text-[#252720] dark:text-[#EDECE6] mt-0.5">
                {progress}%
              </div>
            </div>

            {/* Subtle Progress Bar */}
            <div className="w-20 sm:w-28 h-2 rounded-full bg-[#EFEEE8] dark:bg-[#242823] overflow-hidden border border-[#E4E3DC] dark:border-[#2D332C]">
              <div
                className="h-full bg-[#66765B] rounded-full transition-all duration-300"
                style={{ width: `${Math.max(5, progress)}%` }}
              />
            </div>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-full border border-[#E4E3DC] dark:border-[#2D332C] bg-[#FFFFFF] dark:bg-[#1E211D] text-[#252720] dark:text-[#EDECE6] hover:bg-[#EFEEE8] dark:hover:bg-[#242823] flex items-center justify-center transition-colors"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            {isDark ? (
              /* Sun SVG */
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              /* Moon SVG */
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {/* Reset progress subtle text link */}
          {onResetProgress && (
            <button
              onClick={onResetProgress}
              className="text-xs text-[#77786F] dark:text-[#A6A79E] hover:text-[#B65E57] dark:hover:text-[#D96A62] hidden md:inline-block transition-colors"
              title="Reset progress to 0%"
            >
              Reset
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
