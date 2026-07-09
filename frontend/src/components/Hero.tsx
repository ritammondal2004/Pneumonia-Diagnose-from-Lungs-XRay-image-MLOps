/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Upload, Play, ShieldCheck, Activity, Award, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  onScrollToSection: (sectionId: string) => void;
  onTriggerDemo: () => void;
}

export default function Hero({ onScrollToSection, onTriggerDemo }: HeroProps) {
  return (
    <section id="hero" className="relative pt-32 pb-20 bg-white overflow-hidden">
      {/* Light subtle backgrounds */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-blue-50/70 blur-[120px] -translate-y-12 translate-x-12" />
        <div className="absolute bottom-10 left-10 w-[400px] h-[400px] rounded-full bg-sky-50/50 blur-[100px]" />
        
        {/* Subtle grid pattern for a high-end medical software feel */}
        <div 
          className="absolute inset-0 opacity-[0.4]" 
          style={{
            backgroundImage: `radial-gradient(#e2e8f0 1.5px, transparent 1.5px)`,
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Text copy */}
          <div className="lg:col-span-7 text-left">
            {/* Clinical Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-mono font-semibold mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              ROBUSTXRAYNET DEEP LEARNING CORE
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1] font-sans"
            >
              AI Powered Chest X-Ray <br />
              <span className="text-blue-600">Pneumonia Detection</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 text-lg text-slate-600 max-w-2xl leading-relaxed font-sans"
            >
              Upload a chest X-ray image and receive an instant AI prediction with confidence score using our RobustXrayNet deep learning model. Designed for clinical pre-screening with maximum trust and safety.
            </motion.p>

            {/* Bullet list of clinical attributes */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-8 space-y-3.5"
            >
              <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                <span>Standardized 224×224 radiographic preprocessing matrix</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                <span>Binary pathology indexing (Normal vs Active Pneumonia)</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                <span>Instant diagnostic indicators in less than 2.5 seconds</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-10 flex flex-col sm:flex-row items-center gap-4"
            >
              <button
                onClick={() => onScrollToSection('workspace')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-600/10 hover:shadow-lg hover:shadow-blue-600/20 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Upload className="w-4.5 h-4.5" />
                Upload Radiograph
              </button>
              
              <button
                onClick={onTriggerDemo}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold border border-slate-200 shadow-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-slate-700 text-slate-700" />
                Try Live Demo
              </button>
            </motion.div>
          </div>

          {/* Right: Premium translucent glass card representing the supplied clinical X-ray pointing visual */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 hidden lg:block relative group"
          >
            {/* Ambient backlight glow */}
            <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-tr from-blue-500/10 to-sky-400/20 blur-xl opacity-75 group-hover:opacity-100 transition duration-1000" />

            {/* Glassmorphic Shell Card */}
            <div className="relative p-6 sm:p-7 rounded-[2rem] bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl overflow-hidden">
              
              {/* Clinical Header / HUD elements */}
              <div className="flex items-center justify-between mb-4 border-b border-slate-850 pb-3">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-sky-400/85">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                  CLINICAL SPECTROSCOPY VIEW
                </div>
              </div>

              {/* The Radiographic Chest Film Container */}
              <div className="relative aspect-[4/3] w-full rounded-2xl bg-[#090d16] border border-slate-800 p-5 flex flex-col items-center justify-center overflow-hidden shadow-inner">
                
                {/* 3D Grid Overlay */}
                <div className="absolute inset-0 opacity-[0.08]" style={{
                  backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)',
                  backgroundSize: '16px 16px'
                }} />

                {/* Chest X-ray SVG illustration representing high fidelity radiograph film */}
                <svg viewBox="0 0 160 120" className="w-full h-full text-slate-700 relative z-10" fill="none" stroke="currentColor" strokeWidth="1.2">
                  {/* Left Lung field (darker density - air) */}
                  <path d="M55,25 C35,25 30,42 30,72 C30,100 42,106 58,106 C60,106 63,103 63,100 L63,30 C63,27 58,25 55,25 Z" className="text-slate-950 fill-slate-950/90" />
                  {/* Right Lung field */}
                  <path d="M105,25 C125,25 130,42 130,72 C130,100 118,106 102,106 C100,106 97,103 97,100 L97,30 C97,27 102,25 105,25 Z" className="text-slate-950 fill-slate-950/90" />

                  {/* Spinal column vertebrae */}
                  <path d="M78,10 L82,10 L81,110 L79,110 Z" className="text-slate-600 fill-slate-850" strokeWidth="0.8" />
                  {/* Spine segment blocks */}
                  {[20, 28, 36, 44, 52, 60, 68, 76, 84, 92, 100].map((y, idx) => (
                    <rect key={idx} x="78" y={y} width="4" height="5" rx="1" className="text-slate-500 fill-slate-600/50" strokeWidth="0.5" />
                  ))}

                  {/* Diaphragm Curves */}
                  <path d="M25,108 Q55,102 75,108" className="text-slate-500" strokeWidth="1" />
                  <path d="M85,108 Q105,104 135,108" className="text-slate-500" strokeWidth="1" />

                  {/* Symmetrical Rib Cage lines */}
                  {[32, 44, 56, 68, 80, 92].map((y, idx) => {
                    const widthFactor = 1 - Math.pow((idx - 3) / 5, 2);
                    const rx = 35 * widthFactor;
                    return (
                      <g key={idx} className="text-slate-600/35">
                        {/* Left ribs */}
                        <path d={`M32,${y} Q${55 - rx * 0.4},${y + 4} 75,${y + 2}`} strokeWidth="0.8" />
                        {/* Right ribs */}
                        <path d={`M128,${y} Q${105 + rx * 0.4},${y + 4} 85,${y + 2}`} strokeWidth="0.8" />
                      </g>
                    );
                  })}

                  {/* Clavicles */}
                  <path d="M30,22 Q53,28 76,21" className="text-slate-500" strokeWidth="1.2" />
                  <path d="M130,22 Q107,28 84,21" className="text-slate-500" strokeWidth="1.2" />

                  {/* Heart Outline shadow */}
                  <path d="M74,58 Q85,76 102,72 Q110,65 92,48 Q82,45 74,58" className="text-slate-700/80 fill-slate-800/20" strokeWidth="1" />

                  {/* Bronchial vascular markers (radiating hilum lines) */}
                  <g className="text-slate-500/25">
                    <path d="M66,54 Q50,44 42,48 M66,54 Q48,58 38,64 M66,54 Q54,68 46,74" />
                    <path d="M94,54 Q110,44 118,48 M94,54 Q112,58 122,64 M94,54 Q106,68 114,74" />
                  </g>

                  {/* Suspicious Consolidation Cloud (Active Pneumonia base) */}
                  <circle cx="50" cy="74" r="14" className="text-white/10 fill-white/5 blur-[2px]" />
                  <circle cx="46" cy="72" r="8" className="text-white/15 fill-white/10 blur-[1px]" />
                  
                  {/* Glowing Targeting Crosshair over Consolidation Area */}
                  <g className="text-blue-500 animate-pulse">
                    <circle cx="48" cy="72" r="16" strokeDasharray="3,3" strokeWidth="1" />
                    <line x1="48" y1="52" x2="48" y2="92" strokeWidth="0.8" strokeDasharray="2,2" />
                    <line x1="28" y1="72" x2="68" y2="72" strokeWidth="0.8" strokeDasharray="2,2" />
                  </g>
                </svg>

                {/* Hand Pointer/Pen Overlaid (Doctor Pointing as in original image) */}
                <motion.div 
                  initial={{ x: 60, y: 60 }}
                  animate={{ 
                    x: [0, -6, 2, -1, 0],
                    y: [0, 4, -2, 1, 0]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 5, 
                    ease: "easeInOut",
                    repeatType: "reverse"
                  }}
                  className="absolute right-[20%] bottom-[12%] z-20 pointer-events-none"
                >
                  {/* Silver Pen pointing to the consolidation area */}
                  <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_10px_15px_rgba(0,0,0,0.6)]">
                    {/* Hand representation */}
                    <path d="M70,80 C60,80 50,70 45,62 L28,42 C24,38 20,32 23,28 C26,24 32,24 36,28 L52,48 L56,40 L78,60 Z" fill="#e2e8f0" opacity="0.1" />
                    {/* Metallic Silver pointer pen */}
                    <path d="M12,12 L50,50 L56,44 L18,6 Z" fill="url(#metal-gradient)" />
                    {/* Glowing golden pen tip */}
                    <circle cx="11" cy="11" r="3.5" fill="#f59e0b" className="animate-ping" />
                    <circle cx="11" cy="11" r="2" fill="#fbbf24" />
                    
                    <defs>
                      <linearGradient id="metal-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#94a3b8" />
                        <stop offset="50%" stopColor="#cbd5e1" />
                        <stop offset="100%" stopColor="#475569" />
                      </linearGradient>
                    </defs>
                  </svg>
                </motion.div>

                {/* Pulsing focal radar expanding from pointer contact */}
                <div className="absolute left-[26%] top-[56%] -translate-x-1/2 -translate-y-1/2 w-20 h-20 pointer-events-none">
                  <div className="absolute inset-0 rounded-full border-2 border-blue-500/40 animate-ping" style={{ animationDuration: '3s' }} />
                  <div className="absolute inset-4 rounded-full border border-sky-400/30 animate-ping" style={{ animationDuration: '2s' }} />
                </div>

                {/* Scanning line laser */}
                <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-sky-400 to-transparent opacity-60 shadow-[0_0_8px_rgba(56,189,248,0.5)] top-1/4 animate-[bounce_6s_infinite_ease-in-out]" />

                {/* Radiologist annotations overlay */}
                <div className="absolute bottom-4 left-4 font-mono text-[9px] font-bold text-slate-500 space-y-0.5">
                  <div>R: PEDIATRIC COHORT</div>
                  <div>PROJECTION: AP PORTABLE</div>
                  <div>MATRIX: 224x224 grayscale</div>
                </div>
                <div className="absolute top-4 right-4 font-mono text-[9px] font-bold text-slate-500">
                  SECURE DEV_HUB
                </div>
              </div>

              {/* HUD / Caption stats row */}
              <div className="mt-5 flex items-center justify-between">
                <div className="text-left">
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold">ACTIVE MODEL MATRIX</div>
                  <div className="text-xs font-bold text-slate-300 mt-0.5 font-sans">ROBUSTXRAYNET CLINICAL INTEGRITY</div>
                </div>
                <div className="px-3 py-1 rounded-lg bg-blue-950/80 border border-blue-900 text-sky-400 text-[10px] font-mono font-bold tracking-tight">
                  ACTIVE PNEUMONIA THRESHOLD
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
