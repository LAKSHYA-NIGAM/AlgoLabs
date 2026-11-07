import React from 'react';

export function LegalModal({ isOpen, type, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#1E211D] rounded-2xl border border-[#E4E3DC] dark:border-[#2D332C] p-6 sm:p-8 shadow-xl space-y-5 max-h-[85vh] overflow-y-auto text-left z-10 transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-[#ECEBE5] dark:border-[#232822]">
          <div>
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#B58A43] bg-[#FAF4E8] dark:bg-[#2C2415] px-2 py-0.5 rounded-md border border-[#EEDFBE] dark:border-[#42361D] inline-block mb-1">
              DRAFT FOR REVIEW
            </span>
            <h2 className="font-heading text-lg font-semibold text-[#252720] dark:text-[#EDECE6]">
              {type === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#77786F] hover:text-[#252720] dark:hover:text-white hover:bg-[#EFEEE8] dark:hover:bg-[#242823] transition-colors"
            aria-label="Close dialog"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {type === 'privacy' ? (
          <div className="space-y-4 text-xs text-[#77786F] dark:text-[#A6A79E] leading-relaxed">
            <div>
              <h3 className="font-heading font-semibold text-xs text-[#252720] dark:text-[#EDECE6] uppercase tracking-wider mb-1">
                1. Data Storage & Local Persistence
              </h3>
              <p>
                AlgoLab is designed with a strict privacy-first architecture. All student activity—including chapter completion, interactive simulation checkpoints, quiz answers, and challenge test results—is stored <strong>exclusively in your browser's client-side LocalStorage</strong> (under key <code>algolab_learning_state_v1</code>).
              </p>
            </div>

            <div>
              <h3 className="font-heading font-semibold text-xs text-[#252720] dark:text-[#EDECE6] uppercase tracking-wider mb-1">
                2. No Tracking or Remote Transmission
              </h3>
              <p>
                We do not use advertising cookies, remote telemetry SDKs, or third-party behavioral trackers. No algorithmic input, graph topology, or code written in the Monaco editor is transmitted across external networks.
              </p>
            </div>

            <div>
              <h3 className="font-heading font-semibold text-xs text-[#252720] dark:text-[#EDECE6] uppercase tracking-wider mb-1">
                3. Data Deletion
              </h3>
              <p>
                You can delete all stored learning records at any time by clicking the <strong>Reset</strong> button located in the top navigation header or by clearing your browser cache.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#EFEEE8] dark:bg-[#242823] text-[11px] text-[#77786F] dark:text-[#A6A79E]">
              <em>Note: This policy document is a draft for review and reflects the actual runtime architecture of this educational build.</em>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-xs text-[#77786F] dark:text-[#A6A79E] leading-relaxed">
            <div>
              <h3 className="font-heading font-semibold text-xs text-[#252720] dark:text-[#EDECE6] uppercase tracking-wider mb-1">
                1. Educational Use Only
              </h3>
              <p>
                AlgoLab is an open educational platform developed for computer science students, educators, and software engineers learning Minimum Spanning Tree algorithms and Disjoint Set Union data structures.
              </p>
            </div>

            <div>
              <h3 className="font-heading font-semibold text-xs text-[#252720] dark:text-[#EDECE6] uppercase tracking-wider mb-1">
                2. Code & Intellectual Property
              </h3>
              <p>
                The interactive visualizations, curriculum materials, and Java implementation templates are provided for self-study and educational evaluation. Simulation logic and source references are provided as-is without commercial warranties.
              </p>
            </div>

            <div>
              <h3 className="font-heading font-semibold text-xs text-[#252720] dark:text-[#EDECE6] uppercase tracking-wider mb-1">
                3. Attribution
              </h3>
              <p>
                Platform created by <strong>Lakshya Nigam</strong> as an algorithmic masterclass demonstrate greedy graph optimization.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#EFEEE8] dark:bg-[#242823] text-[11px] text-[#77786F] dark:text-[#A6A79E]">
              <em>Note: This terms agreement is a draft for review intended for academic and hiring demonstration.</em>
            </div>
          </div>
        )}

        <div className="pt-3 border-t border-[#ECEBE5] dark:border-[#232822] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#66765B] hover:bg-[#57644E] text-white text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
