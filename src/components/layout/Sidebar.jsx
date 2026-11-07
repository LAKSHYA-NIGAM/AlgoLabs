import React from 'react';
import { NavLink } from 'react-router-dom';
import { LESSON_MODULES } from '../../data/curriculumModules';

export function Sidebar({ isOpen, onClose, visitedModules = new Set() }) {
  const content = (
    <div className="flex flex-col justify-between h-full p-4 space-y-4">
      <div className="space-y-3">
        {/* Editorial Section Header */}
        <div className="px-3 py-2 flex items-center justify-between border-b border-[#ECEBE5] dark:border-[#232822]">
          <span className="text-[11px] font-semibold text-[#77786F] dark:text-[#A6A79E] tracking-wider uppercase font-heading">
            Curriculum
          </span>
          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-[#EFEEE8] dark:bg-[#242823] text-[#77786F] dark:text-[#A6A79E]">
            45m total
          </span>
        </div>

        {/* Module Navigation List */}
        <nav className="space-y-1">
          {LESSON_MODULES.map((module) => {
            const isVisited = visitedModules.has(module.path) || (module.alias && visitedModules.has(module.alias));

            return (
              <NavLink
                key={module.path}
                to={module.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `group relative flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                    isActive
                      ? 'bg-[#EBF0E8] dark:bg-[#232C21] text-[#252720] dark:text-[#EDECE6] font-semibold shadow-xs border-l-2 border-[#66765B]'
                      : 'text-[#77786F] dark:text-[#A6A79E] hover:text-[#252720] dark:hover:text-[#EDECE6] hover:bg-[#EFEEE8] dark:hover:bg-[#242823]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Step Number in Monospace */}
                      <span className={`font-mono text-[11px] shrink-0 font-medium ${
                        isActive ? 'text-[#66765B] dark:text-[#8C9D81]' : 'text-[#999A91] dark:text-[#7E8077]'
                      }`}>
                        {module.number}
                      </span>

                      <div className="truncate">
                        <div className={`truncate leading-tight font-medium ${
                          isActive ? 'text-[#252720] dark:text-[#EDECE6] font-semibold' : 'text-[#252720] dark:text-[#EDECE6]'
                        }`}>
                          {module.title}
                        </div>
                        <div className="text-[10px] text-[#77786F] dark:text-[#A6A79E] truncate mt-0.5">
                          {module.subtitle}
                        </div>
                      </div>
                    </div>

                    {/* Completion / Active Dot Indicator */}
                    <div className="shrink-0 pl-1.5">
                      {isActive ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#66765B] inline-block" />
                      ) : isVisited ? (
                        /* Sage Checkmark Inline SVG */
                        <span className="w-4 h-4 rounded-full bg-[#EBF0E8] dark:bg-[#232C21] text-[#477B5C] dark:text-[#529E70] flex items-center justify-center">
                          <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 8.5 6.5 12 13 4" />
                          </svg>
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#999A91] dark:text-[#7E8077] font-mono">
                          ·
                        </span>
                      )}
                    </div>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Scholar Profile Capsule */}
      <div className="p-3 rounded-xl bg-[#EFEEE8] dark:bg-[#242823] border border-[#E4E3DC] dark:border-[#2D332C] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#66765B] text-white flex items-center justify-center font-heading font-semibold text-xs shadow-xs">
            LN
          </div>
          <div>
            <div className="text-xs font-semibold text-[#252720] dark:text-[#EDECE6] leading-tight">
              Lakshya Nigam
            </div>
            <div className="text-[10px] text-[#77786F] dark:text-[#A6A79E]">
              AlgoLab Scholar
            </div>
          </div>
        </div>
        <div className="w-2 h-2 rounded-full bg-[#477B5C] dark:bg-[#529E70]" title="Active session" />
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer (visible on < md) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={onClose}
            aria-hidden="true"
          />
          <aside className="relative w-[260px] max-w-[80vw] h-full bg-[#FFFFFF] dark:bg-[#1E211D] border-r border-[#E4E3DC] dark:border-[#2D332C] shadow-xl flex flex-col z-50">
            <div className="flex items-center justify-between p-3 border-b border-[#ECEBE5] dark:border-[#232822]">
              <span className="text-xs font-heading font-semibold text-[#252720] dark:text-[#EDECE6]">Curriculum</span>
              <button
                onClick={onClose}
                className="p-1 rounded-md text-[#77786F] hover:text-[#252720] dark:hover:text-white"
                aria-label="Close menu"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {content}
            </div>
          </aside>
        </div>
      )}

      {/* Desktop & Tablet Sticky Sidebar (visible on >= md) */}
      <aside className="hidden md:block w-[260px] shrink-0 sticky top-20 self-start bg-[#FFFFFF] dark:bg-[#1E211D] rounded-2xl border border-[#E4E3DC] dark:border-[#2D332C] shadow-xs transition-colors overflow-hidden">
        {content}
      </aside>
    </>
  );
}
