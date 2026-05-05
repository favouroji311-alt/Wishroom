/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Stars } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect } from 'react';
import StarBackground from './components/StarBackground';
import VisionBoard from './components/VisionBoard';
import WishForm from './components/WishForm';
import { Wish } from './types';
import { wishService } from './services/wishService';
import { getSupabase } from './lib/supabase';

export default function App() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initial load
  useEffect(() => {
    async function loadData() {
      const isSupabaseConfigured = !!getSupabase();
      
      if (isSupabaseConfigured) {
        const data = await wishService.fetchWishes();
        setWishes(data);
      } else {
        // Fallback to localStorage
        const saved = localStorage.getItem('wishroom_data');
        if (saved) setWishes(JSON.parse(saved));
      }
      setIsLoading(false);
    }
    loadData();
  }, []);

  // Sync to local storage as safety backup
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('wishroom_data', JSON.stringify(wishes));
    }
  }, [wishes, isLoading]);

  const addWish = async (wishData: Omit<Wish, 'id' | 'isManifested' | 'createdAt'>) => {
    const isSupabaseConfigured = !!getSupabase();
    
    if (isSupabaseConfigured) {
      const newWish = await wishService.addWish(wishData);
      if (newWish) {
        setWishes([newWish, ...wishes]);
      }
    } else {
      // Local only logic
      const newWish: Wish = {
        ...wishData,
        id: Math.random().toString(36).substring(2, 9),
        isManifested: false,
        createdAt: Date.now(),
      };
      setWishes([newWish, ...wishes]);
    }
  };

  const updateProgress = async (id: string, progress: number) => {
    setWishes(wishes.map(w => w.id === id ? { ...w, progress } : w));
    
    const isSupabaseConfigured = !!getSupabase();
    if (isSupabaseConfigured) {
      await wishService.updateWish(id, { progress });
    }
  };

  const manifestWish = async (id: string) => {
    setWishes(wishes.map(w => w.id === id ? { ...w, isManifested: true, progress: 100 } : w));
    
    const isSupabaseConfigured = !!getSupabase();
    if (isSupabaseConfigured) {
      await wishService.updateWish(id, { isManifested: true, progress: 100 });
    }

    // Trigger celebration
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
  };

  const deleteWish = async (id: string) => {
    setWishes(wishes.filter(w => w.id !== id));
    
    const isSupabaseConfigured = !!getSupabase();
    if (isSupabaseConfigured) {
      await wishService.deleteWish(id);
    }
  };

  return (
    <div className="min-h-screen relative font-sans">
      <StarBackground />
      
      {/* Celebration Overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md pointer-events-none"
          >
            <div className="relative flex items-center justify-center">
              {/* Expanding Rings */}
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: [1, 4], opacity: [0, 0.15, 0] }}
                  transition={{ duration: 2.5, ease: "easeOut", repeat: 1 }}
                  className="absolute h-64 w-64 rounded-full border border-white/20"
                />
              ))}

              {/* Light Orbs */}
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                  animate={{ 
                    x: (Math.random() - 0.5) * 600, 
                    y: (Math.random() - 0.5) * 600, 
                    opacity: [0, 0.8, 0],
                    scale: [0, Math.random() * 2 + 1, 0]
                  }}
                  transition={{ duration: 3, ease: "easeOut" }}
                  className="absolute h-1 w-1 bg-white rounded-full shadow-[0_0_15px_white]"
                />
              ))}

              <motion.div
                initial={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }}
                animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="text-center relative z-10"
              >
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mb-8 flex justify-center"
                >
                  <Stars size={48} className="text-white/40" />
                </motion.div>
                <h2 className="font-display text-6xl md:text-8xl font-normal text-white tracking-widest drop-shadow-[0_0_50px_rgba(255,255,255,0.3)]">
                  Resonated.
                </h2>
                <p className="mt-8 text-slate-400 uppercase tracking-[0.8em] text-[10px] font-light italic">
                  Your vision has coalesced into reality
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="mx-auto max-w-7xl px-6 py-12 md:py-24 relative z-10">
        {/* Header */}
        <header className="mb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 rounded-full border border-white/5 bg-white/[0.02] px-5 py-2 text-[10px] font-light uppercase tracking-[0.4em] text-slate-500 mb-8 backdrop-blur-md"
          >
            <Stars size={12} className="text-slate-600" />
            <span>Harmonizing Existence</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-display text-7xl md:text-9xl tracking-tight text-white mb-8"
          >
            Wishroom
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mx-auto max-w-xl text-[15px] text-slate-400 leading-relaxed italic font-serif font-light opacity-60"
          >
            A contemplative space where intentions take form. 
            Quiet your mind, articulate your vision, and allow reality to coalesce around you.
          </motion.p>
        </header>

        {/* Wish of the Day Section */}
        {wishes.filter(w => !w.isManifested).length > 0 && (
          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-24 mx-auto max-w-2xl"
          >
            <div className="mb-6 flex items-center gap-4 justify-center">
              <div className="h-px w-8 bg-slate-800" />
              <h2 className="text-[9px] font-medium uppercase tracking-[0.4em] text-slate-600 italic">Alignment of the Day</h2>
              <div className="h-px w-8 bg-slate-800" />
            </div>
            {(() => {
              const activeOnes = wishes.filter(w => !w.isManifested);
              const seededIndex = new Date().getUTCDate() % activeOnes.length;
              const wishOfDay = activeOnes[seededIndex];
              return (
                <div className="text-center group cursor-default">
                  <h3 className="font-display text-3xl md:text-4xl text-slate-200 mb-3 group-hover:text-white transition-colors duration-1000">
                    "{wishOfDay.title}"
                  </h3>
                  <p className="text-subtle text-sm opacity-60 group-hover:opacity-100 transition-opacity duration-1000">
                    Breathe into this possibility. How does it feel to have already achieved it?
                  </p>
                </div>
              );
            })()}
          </motion.section>
        )}

        <WishForm onAdd={addWish} />
        
        <VisionBoard 
          wishes={wishes} 
          onUpdateProgress={updateProgress}
          onManifest={manifestWish}
          onDelete={deleteWish}
        />
      </main>

      {/* Footer Decoration */}
      <footer className="relative z-10 py-16 text-center text-slate-600 text-[9px] uppercase tracking-[0.5em] font-light italic">
        <div className="flex items-center justify-center gap-6 mb-4 opacity-30">
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-slate-800" />
          <span>Surrender to the Flow</span>
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-slate-800" />
        </div>
        &copy; {new Date().getFullYear()} Wishroom Intention Lab
      </footer>
    </div>
  );
}
