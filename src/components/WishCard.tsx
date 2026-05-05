/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Calendar, CheckCircle, Sparkles, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';
import { Category, Wish } from '../types';

interface WishCardProps {
  wish: Wish;
  onUpdateProgress: (id: string, progress: number) => void;
  onManifest: (id: string) => void;
  onDelete: (id: string) => void;
}

const CATEGORY_ICONS: Record<Category, string> = {
  Career: '💼',
  Travel: '✈️',
  'Personal Growth': '🌱',
  Relationships: '💖',
  Abundance: '✨',
  Creative: '🎨',
};

const WishCard: React.FC<WishCardProps> = ({ wish, onUpdateProgress, onManifest, onDelete }) => {
  const glowOpacity = wish.progress / 100;
  
  return (
    <motion.div
      layout
      id={`wish-card-${wish.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      style={{
        boxShadow: wish.isManifested 
          ? '0 0 40px rgba(255, 255, 255, 0.08), inset 0 0 20px rgba(255, 255, 255, 0.02)' 
          : `0 0 ${wish.progress / 2.5}px rgba(129, 140, 248, ${glowOpacity * 0.2})`
      }}
      className={`group relative flex flex-col h-full overflow-hidden rounded-xl border transition-all duration-700 ${
        wish.isManifested 
          ? 'bg-slate-900/60 border-slate-700/50' 
          : 'bg-white/[0.01] border-white/5 hover:border-white/10'
      } backdrop-blur-[40px]`}
    >
      {/* Aesthetic Image Header */}
      {wish.imageUrl && (
        <div className="relative h-32 w-full overflow-hidden opacity-60 group-hover:opacity-100 transition-opacity duration-700">
          <img 
            src={wish.imageUrl} 
            className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" 
            alt={wish.title}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
        </div>
      )}

      <div className="p-6 flex flex-col flex-grow">
        {/* Manifested Badge */}
        {wish.isManifested && (
          <div className="absolute top-4 right-4 z-10 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[8px] font-medium uppercase tracking-[0.3em] text-white/40">
            Realized
          </div>
        )}

        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex flex-col gap-1.5">
            <h3 className="font-display text-lg font-normal tracking-wide text-slate-100 group-hover:text-white transition-colors">
              {wish.title}
            </h3>
            <span className="text-[9px] font-light uppercase tracking-[0.4em] text-slate-500 italic">
              {CATEGORY_ICONS[wish.category]} {wish.category}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="mb-6 flex-grow font-serif text-[13px] leading-relaxed text-slate-400 font-light italic line-clamp-3">
          {wish.description}
        </p>

        {/* Stats/Footer */}
        <div className="mt-auto space-y-5">
          {wish.target_date && (
            <div className="flex items-center gap-2 text-[10px] text-slate-600 font-light tracking-widest uppercase">
              <Calendar size={12} className="opacity-40" />
              <span>Divine Timing: {new Date(wish.target_date).toLocaleDateString()}</span>
            </div>
          )}

          {!wish.isManifested && (
            <div className="space-y-2">
              <div className="flex justify-between text-[8px] font-medium uppercase tracking-[0.4em] text-slate-600">
                <span className="italic">Alignment</span>
                <span>{Math.round(wish.progress)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={wish.progress}
                onChange={(e) => onUpdateProgress(wish.id, parseInt(e.target.value))}
                className="mt-1"
              />
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            {!wish.isManifested ? (
              <button
                onClick={() => onManifest(wish.id)}
                className="group/btn relative overflow-hidden flex items-center gap-2 rounded-md border border-white/5 bg-transparent px-3 py-1.5 text-[10px] font-medium tracking-[0.2em] text-slate-500 uppercase transition-all hover:border-indigo-400/30 hover:text-indigo-200"
              >
                <div className="absolute inset-0 -z-10 bg-indigo-500/0 group-hover/btn:bg-indigo-500/5 transition-colors" />
                <CheckCircle size={12} className="opacity-50" />
                Manifest
              </button>
            ) : (
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-light text-slate-400 italic">
                <Sparkles size={12} className="text-yellow-500/30" />
                In Presence
              </div>
            )}

            <button
              onClick={() => onDelete(wish.id)}
              className="rounded-full p-2 text-slate-700 transition-all hover:bg-white/5 hover:text-red-400/50"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Inner background wash */}
      <div 
        className="absolute inset-0 -z-10 bg-gradient-to-tr from-white/[0.01] to-transparent transition-opacity duration-1000" 
        style={{ opacity: glowOpacity * 0.5 }}
      />
    </motion.div>
  );
};

export default WishCard;
