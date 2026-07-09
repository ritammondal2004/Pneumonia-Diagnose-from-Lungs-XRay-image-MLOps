/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Github, Linkedin, Mail, ShieldAlert, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="bg-white border-t border-slate-100 py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start pb-10 border-b border-slate-100">
          {/* About Column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-900 tracking-tight">
                PneumoVision<span className="text-blue-600">AI</span>
              </span>
            </div>
            <p className="text-slate-500 text-xs mt-3 leading-relaxed font-medium">
              Advancing radiographic pre-screening pathways using high-performance Deep Convolutional Neural Networks. Engineered with clinical safety and speed as paramount ideals.
            </p>
          </div>

          {/* Developer Credits Column */}
          <div className="md:col-span-1">
            <h4 className="text-slate-400 text-[10px] font-bold tracking-widest font-mono uppercase mb-3">
              DEVELOPER CONTACT
            </h4>
            <span className="text-slate-900 text-sm font-bold block">Ritam Mondal</span>
            <p className="text-slate-500 text-xs mt-1 font-medium">ritamm134@gmail.com</p>
            
            <div className="flex gap-2.5 mt-4">
              <a
                href="https://github.com/ritammondal2004/Pneumonia-Diagnose-from-Lungs-XRay-image-MLOps"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8.5 h-8.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 flex items-center justify-center text-slate-500 hover:text-blue-600 transition-all duration-200"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/ritam-mondal-86a369287/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8.5 h-8.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 flex items-center justify-center text-slate-500 hover:text-blue-600 transition-all duration-200"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="mailto:ritamm134@gmail.com"
                className="w-8.5 h-8.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 flex items-center justify-center text-slate-500 hover:text-blue-600 transition-all duration-200"
                title="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Disclaimer Column */}
          <div className="md:col-span-1 p-5 rounded-2xl bg-amber-50/50 border border-amber-200 flex gap-3.5">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-amber-800 text-[10px] font-bold tracking-widest font-mono uppercase">
                CLINICAL DISCLAIMER
              </h4>
              <p className="text-slate-600 text-xs leading-relaxed mt-1.5 font-medium">
                PneumoVision AI is an algorithmic screening assistant designed for academic, educational, and research evaluation. It is NOT FDA-cleared and does not replace professional clinical radiological diagnosis, consultation, or treatment protocols.
              </p>
            </div>
          </div>
        </div>

        {/* Copyright row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-[9px] font-bold font-mono uppercase tracking-widest">
            &copy; {currentYear} PNEUMOVISION AI MEDICAL SUITE. ALL RIGHTS RESERVED.
          </p>
          <p className="text-slate-400 text-[10px] font-mono font-medium flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> by Ritam Mondal
          </p>
        </div>
      </div>
    </footer>
  );
}
