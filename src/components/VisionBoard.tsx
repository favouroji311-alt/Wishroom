/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Calendar, LayoutGrid, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useState } from 'react';
import { Wish } from '../types';
import WishCard from './WishCard';

interface VisionBoardProps {
  wishes: Wish[];
  onUpdateProgress: (id: string, progress: number) => void;
  onManifest: (id: string) => void;
  onDelete: (id: string) => void;
}

const VisionBoard: React.FC<VisionBoardProps> = ({ wishes, onUpdateProgress, onManifest, onDelete }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');
  
  const activeWishes = wishes.filter(w => !w.isManifested);
  const archivedWishes = wishes.filter(w => w.isManifested);

  // For timeline view, sort by target date
  const timelineWishes = [...activeWishes].sort((a, b) => {
    if (!a.target_date) return 1;
    if (!b.target_date) return -1;
    return new Date(a.target_date).getTime() - new Date(b.target_date).getTime();
  });

  return (
    <div className="space-y-16 pb-20">
      {/* View Switcher */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-full border border-white/5 bg-white/[0.02] p-1 backdrop-blur-md">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-2 rounded-full px-5 py-2 text-[9px] font-medium uppercase tracking-[0.2em] transition-all ${
              viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-slate-600 hover:text-slate-300'
            }`}
          >
            <LayoutGrid size={12} />
            Vision Board
          </button>
          <button
            onClick={() => setViewMode('timeline')}
            className={`flex items-center gap-2 rounded-full px-5 py-2 text-[9px] font-medium uppercase tracking-[0.2em] transition-all ${
              viewMode === 'timeline' ? 'bg-white/10 text-white' : 'text-slate-600 hover:text-slate-300'
            }`}
          >
            <Calendar size={12} />
            Timeline
          </button>
        </div>
      </div>

      {/* Active Section */}
      <section>
        <div className="mb-8 flex items-center gap-4">
          <h2 className="text-[9px] font-medium uppercase tracking-[0.5em] text-slate-700 italic">Active Intentions</h2>
          <div className="h-px flex-grow bg-gradient-to-r from-slate-800 to-transparent" />
        </div>
        
        {activeWishes.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-white/[0.03] bg-white/[0.01] text-center">
            <p className="text-slate-700 italic font-serif text-lg tracking-wide">The canvas of your future is quiet...</p>
            <p className="text-slate-800 text-[8px] uppercase tracking-[0.4em] mt-3 font-light">Set an intention to begin</p>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {activeWishes.map((wish) => (
                    <WishCard
                      key={wish.id}
                      wish={wish}
                      onUpdateProgress={onUpdateProgress}
                      onManifest={onManifest}
                      onDelete={onDelete}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="relative space-y-12 pl-8 border-l border-white/5">
                <AnimatePresence mode="popLayout">
                  {timelineWishes.map((wish) => (
                    <div key={wish.id} className="relative">
                      <div className="absolute -left-10 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border border-white/10 bg-slate-900 shadow-[0_0_10px_rgba(255,255,255,0.05)]" />
                      <div className="max-w-xl">
                        <WishCard
                          wish={wish}
                          onUpdateProgress={onUpdateProgress}
                          onManifest={onManifest}
                          onDelete={onDelete}
                        />
                      </div>
                    </div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </>
        )}
      </section>

      {/* Archive Grid */}
      {archivedWishes.length > 0 && (
        <section>
          <div className="mb-8 flex items-center gap-4">
            <h2 className="text-[9px] font-medium uppercase tracking-[0.5em] text-slate-800 italic">Manifested Reality</h2>
            <div className="h-px flex-grow bg-gradient-to-r from-slate-900 to-transparent" />
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 opacity-40 hover:opacity-80 transition-opacity duration-1000">
            <AnimatePresence mode="popLayout">
              {archivedWishes.sort((a, b) => b.createdAt - a.createdAt).map((wish) => (
                <WishCard
                  key={wish.id}
                  wish={wish}
                  onUpdateProgress={onUpdateProgress}
                  onManifest={onManifest}
                  onDelete={onDelete}
                />
              ))}
            </AnimatePresence>
          </div>
        </section>
      )}
    </div>
  );
};

export default VisionBoard;
