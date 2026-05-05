/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import React from 'react';

const StarBackground: React.FC = () => {
  // Twinkling stars
  const stars = Array.from({ length: 60 }).map((_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    duration: 3 + Math.random() * 5,
    size: 0.5 + Math.random() * 1.5,
    delay: Math.random() * -10,
  }));

  // Drift particles
  const particles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    duration: 10 + Math.random() * 20,
    size: 0.5 + Math.random() * 1.5,
    delay: Math.random() * -20,
  }));

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#050608]">
      {/* Deep atmospheric layers */}
      <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-b from-[#0a0c10] via-slate-950 to-black" />
      
      {/* Soft, shifting glows */}
      <motion.div 
        animate={{ 
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] h-[120%] w-[120%] bg-[radial-gradient(circle_at_50%_0%,rgba(56,66,80,0.15)_0%,transparent_50%)]" 
      />
      
      <motion.div 
        animate={{ 
          opacity: [0.05, 0.15, 0.05],
          x: [0, 20, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-20%] right-[-10%] h-[150%] w-[150%] bg-[radial-gradient(circle_at_100%_100%,rgba(20,20,40,0.2)_0%,transparent_40%)]" 
      />

      {/* Twinkling Stars */}
      {stars.map((star) => (
        <motion.div
          key={`star-${star.id}`}
          className="absolute rounded-full bg-indigo-100 shadow-[0_0_8px_rgba(255,255,255,0.2)]"
          style={{
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
          animate={{
            opacity: [0.1, 0.5, 0.1],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Floating particles/dust */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-indigo-200/20"
          style={{
            top: p.top,
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
          }}
          animate={{
            y: [0, -100],
            opacity: [0, 0.3, 0],
            x: [0, Math.random() * 20 - 10],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        />
      ))}

      {/* Film grain noise effect (subtle) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/p6.png')]" />
    </div>
  );
};

export default StarBackground;
