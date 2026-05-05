/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Plus, X, Search, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState } from 'react';
import { Category, Wish } from '../types';
import { imageSearchService, UnsplashImage } from '../services/imageSearchService';

interface WishFormProps {
  onAdd: (wish: Omit<Wish, 'id' | 'isManifested' | 'createdAt'>) => void;
}

const CATEGORIES: Category[] = ['Career', 'Travel', 'Personal Growth', 'Relationships', 'Abundance', 'Creative'];

const AESTHETIC_IMAGES = [
  'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?auto=format&fit=crop&w=400&q=80', // Mountains
  'https://images.unsplash.com/photo-1518173946687-a4c8a9b749f5?auto=format&fit=crop&w=400&q=80', // Forest/Mist
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80', // Ocean
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80', // Foggy Peaks
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&q=80', // Stars
  'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=400&q=80', // Sunrise
];

const WishForm: React.FC<WishFormProps> = ({ onAdd }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('Abundance');
  const [targetDate, setTargetDate] = useState('');
  const [imageUrl, setImageUrl] = useState(AESTHETIC_IMAGES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UnsplashImage[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    const results = await imageSearchService.searchImages(searchQuery);
    setSearchResults(results);
    setIsSearching(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    onAdd({
      title,
      description,
      category,
      target_date: targetDate,
      progress: 0,
      imageUrl,
    });

    setTitle('');
    setDescription('');
    setCategory('Abundance');
    setTargetDate('');
    setImageUrl(AESTHETIC_IMAGES[0]);
    setIsOpen(false);
  };

  return (
    <div className="mb-12">
      <AnimatePresence>
        {!isOpen ? (
          <motion.div className="flex justify-center">
            <motion.button
              id="open-wish-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => setIsOpen(true)}
              className="group relative flex items-center gap-2 overflow-hidden rounded-full border border-white/10 bg-white/[0.02] px-8 py-3.5 text-slate-400 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white"
            >
              <Plus size={18} className="transition-transform group-hover:rotate-90" />
              <span className="font-light tracking-[0.3em] uppercase text-[10px]">Whisper your intention</span>
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-10 shadow-2xl backdrop-blur-3xl"
          >
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-normal tracking-tight text-slate-100 font-display">Divine Intention</h2>
                <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500 mt-1 font-light italic">Clarify your vision for the universe</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-slate-600 transition-colors hover:bg-white/5 hover:text-slate-300"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Image Picker */}
              <div className="space-y-4">
                <label className="text-[10px] font-medium uppercase tracking-[0.3em] text-slate-600 italic">Visual frequency</label>
                
                {/* Existing curated list */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {AESTHETIC_IMAGES.map((img) => (
                    <button
                      key={img}
                      type="button"
                      onClick={() => setImageUrl(img)}
                      className={`relative h-12 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all ${
                        imageUrl === img ? 'border-white' : 'border-transparent opacity-40 grayscale hover:opacity-100 hover:grayscale-0'
                      }`}
                    >
                      <img src={img} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>

                {/* Search Unsplash */}
                <div className="space-y-3 pt-2">
                  <div className="flex gap-2">
                    <div className="relative flex-grow">
                      <input
                        type="text"
                        placeholder="Search Unsplash for a symbol..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch(e as any))}
                        className="w-full rounded-lg border border-white/5 bg-white/[0.02] px-4 py-2 pl-10 text-xs text-slate-300 outline-none focus:border-slate-500/30 font-light"
                      />
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                    </div>
                    <button
                      type="button"
                      onClick={handleSearch}
                      disabled={isSearching}
                      className="rounded-lg border border-white/5 bg-white/5 px-4 py-2 text-[10px] font-medium tracking-widest text-slate-400 uppercase hover:bg-white/10 hover:text-white disabled:opacity-50"
                    >
                      {isSearching ? <Loader2 size={14} className="animate-spin" /> : 'Search'}
                    </button>
                  </div>

                  {searchResults.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                      {searchResults.map((img) => (
                        <button
                          key={img.id}
                          type="button"
                          onClick={() => setImageUrl(img.urls.regular)}
                          className={`relative h-12 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all ${
                            imageUrl === img.urls.regular ? 'border-white' : 'border-transparent opacity-40 grayscale hover:opacity-100 hover:grayscale-0'
                          }`}
                        >
                          <img src={img.urls.small} className="h-full w-full object-cover" alt={img.alt_description} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-medium uppercase tracking-[0.3em] text-slate-600 italic">Call it into being</label>
                <input
                  autoFocus
                  id="wish-title"
                  type="text"
                  placeholder="The resonance of your goal..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-transparent text-2xl font-light text-slate-200 outline-none placeholder:text-slate-700 font-display"
                />
                <div className="h-px w-full bg-gradient-to-r from-slate-800 via-slate-700 to-transparent" />
              </div>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="space-y-3">
                  <label className="text-[10px] font-medium uppercase tracking-[0.3em] text-slate-600 italic">Sphere of Influence</label>
                  <select
                    id="wish-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full appearance-none rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3 text-sm text-slate-300 outline-none focus:border-slate-500/30 font-light"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="bg-[#0a0c10]">{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-medium uppercase tracking-[0.3em] text-slate-600 italic">Temporal Anchor</label>
                  <input
                    id="wish-date"
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3 text-sm text-slate-300 outline-none focus:border-slate-500/30 font-light color-scheme-dark"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-medium uppercase tracking-[0.3em] text-slate-600 italic">Sensory Detail</label>
                <textarea
                  id="wish-description"
                  rows={3}
                  placeholder="Describe the feeling of its arrival..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3 text-sm text-slate-300 outline-none focus:border-slate-500/30 placeholder:text-slate-700 font-serif font-light italic"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg border border-white/10 bg-white/5 py-4 text-xs font-semibold uppercase tracking-[0.5em] text-slate-300 transition-all hover:bg-white/10 hover:text-white hover:border-white/20 active:scale-[0.99]"
              >
                Release Intention
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WishForm;
