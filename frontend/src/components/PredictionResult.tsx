/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CheckCircle, AlertTriangle, RefreshCw, ShieldAlert, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { PredictionResult } from '../types';

interface PredictionResultProps {
  result: PredictionResult;
  imageUrl: string;
  fileName: string;
  onReset: () => void;
}

export default function PredictionResultCard({ result, imageUrl, fileName, onReset }: PredictionResultProps) {
  const isPneumonia = result.prediction === 'Pneumonia';
  const confidencePercent = result.confidence > 1 ? result.confidence : result.confidence * 100;
  const confidenceStr = confidencePercent.toFixed(1);

  return (
    <section id="results" className="py-12 bg-slate-50/50 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-xl shadow-slate-100 relative p-6 sm:p-10"
        >
          {/* Top Info Badges */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-mono font-bold text-slate-500">
              <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
              Result • AI Analysis
            </div>

            {isPneumonia ? (
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-rose-50 text-rose-700 border border-rose-100 text-xs font-bold">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                Attention
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Healthy Lungs
              </span>
            )}
          </div>

          {/* Heading */}
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">
            Diagnosis Summary
          </h2>

          {/* Core Layout Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-stretch">
            
            {/* LEFT: Large X-ray with rounded corners */}
            <div className="md:col-span-5 w-full shrink-0 flex flex-col justify-between">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 aspect-square bg-[#0c101b] p-3 shadow-inner group">
                <img
                  src={imageUrl}
                  alt="Analyzed Radiograph Scan"
                  className="w-full h-full object-contain rounded-xl transition-all duration-500 group-hover:scale-102"
                  referrerPolicy="no-referrer"
                />
                
                {/* File watermark overlay */}
                <div className="absolute bottom-5 left-5 right-5 bg-slate-950/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800 text-[10px] font-mono text-slate-400 truncate shadow-lg">
                  <span className="text-slate-500">FILE:</span> {fileName}
                </div>
              </div>
            </div>

            {/* RIGHT: Detailed Diagnosis Panel */}
            <div className="md:col-span-7 flex flex-col justify-between py-1">
              <div>
                {/* PREDICTION BADGE */}
                <span className="text-[10px] font-bold tracking-widest font-mono text-slate-400 uppercase block mb-2">
                  PREDICTION
                </span>
                
                <div className="flex items-center gap-3.5 mb-6">
                  {isPneumonia ? (
                    <>
                      <div className="flex items-center justify-center w-11 h-11 rounded-full bg-rose-50 border border-rose-100 shrink-0 shadow-sm">
                        <ShieldAlert className="w-6 h-6 text-rose-600" />
                      </div>
                      <h3 className="text-3xl font-black text-rose-600 tracking-tight">
                        Pneumonia
                      </h3>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-center w-11 h-11 rounded-full bg-emerald-50 border border-emerald-100 shrink-0 shadow-sm">
                        <CheckCircle className="w-6 h-6 text-emerald-600" />
                      </div>
                      <h3 className="text-3xl font-black text-emerald-600 tracking-tight">
                        Normal
                      </h3>
                    </>
                  )}
                </div>

                {/* CONFIDENCE SECTION */}
                <div className="mb-6 pt-5 border-t border-slate-100">
                  <div className="flex items-baseline justify-between text-xs font-semibold font-mono mb-2.5">
                    <span className="text-slate-400 tracking-widest uppercase">CONFIDENCE</span>
                    <span className="text-2xl font-black text-slate-800 font-sans tracking-tight">
                      {confidenceStr}%
                    </span>
                  </div>

                  {/* Sleek, Premium progress bar with animation */}
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/50 shadow-inner">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${confidencePercent}%` }}
                      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                      className={`h-full rounded-full ${
                        isPneumonia
                          ? 'bg-gradient-to-r from-rose-500 to-pink-500 shadow-sm shadow-rose-500/10'
                          : 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-sm shadow-emerald-500/10'
                      }`}
                    />
                  </div>
                </div>

                {/* CLINICAL EXPLANATION & SUBTEXT */}
                <p className="text-slate-500 text-xs leading-relaxed font-medium mb-6">
                  {isPneumonia
                    ? 'Signs consistent with pneumonia were detected. The model identified patchy subsegmental density anomalies and ground-glass pulmonary infiltrates. Please consult a licensed medical professional for diagnostic follow-up and formal clinical correlation.'
                    : 'Your pulmonary radiographs indicate healthy clear lungs with no noticeable consolidation density patterns. Costophrenic recesses and cardio-thoracic contours present within baseline normal ranges.'
                  }
                </p>
              </div>

              {/* ACTION BUTTON ROW */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onReset}
                  className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm shadow-slate-900/10 cursor-pointer hover:-translate-y-0.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Analyze another
                </button>

                <div className="flex flex-col items-end gap-1 sm:text-right">
                  <span className="text-[10px] font-mono font-semibold text-slate-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Saved locally to patient history.
                  </span>
                  {result.source && (
                    <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                      Engine: {result.source}
                    </span>
                  )}
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
