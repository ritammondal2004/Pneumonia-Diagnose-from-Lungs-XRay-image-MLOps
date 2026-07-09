/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Activity, Menu, X, Heart, Info, History, Github, Linkedin, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  onScrollToSection: (sectionId: string) => void;
}

export default function Navbar({ onScrollToSection }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { name: 'Home', id: 'hero', icon: ShieldCheck },
    { name: 'Analyze X-Ray', id: 'workspace', icon: Activity },
    { name: 'How it Works', id: 'how-it-works', icon: Heart },
    { name: 'About Model', id: 'model-details', icon: Info },
    { name: 'Scan History', id: 'history', icon: History },
  ];

  const handleLinkClick = (id: string) => {
    setIsMobileMenuOpen(false);
    onScrollToSection(id);
  };

  return (
    <header
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-sm py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 group text-left focus:outline-none cursor-pointer"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50 border border-blue-200/60 group-hover:bg-blue-100/60 transition-colors duration-300">
              <Activity className="w-4.5 h-4.5 text-blue-600" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 tracking-tight block">
                PneumoVision<span className="text-blue-600">AI</span>
              </span>
              <span className="text-[9px] text-slate-500 tracking-wider font-semibold uppercase block -mt-1">
                Medical Suite
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleLinkClick(item.id)}
                className="px-4 py-1.5 rounded-full text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-all duration-200 cursor-pointer"
              >
                {item.name}
              </button>
            ))}
            <div className="w-px h-4 bg-slate-200 mx-2" />
            <a
              href="https://github.com/ritammondal2004/Pneumonia-Diagnose-from-Lungs-XRay-image-MLOps"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all duration-200"
              title="GitHub"
            >
              <Github className="w-4.5 h-4.5" />
            </a>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleLinkClick(item.id)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors duration-200"
                  >
                    <Icon className="w-4 h-4 text-slate-400" />
                    {item.name}
                  </button>
                );
              })}
              <div className="border-t border-slate-100 my-4 pt-4 flex justify-around">
                <a
                  href="https://github.com/ritammondal2004/Pneumonia-Diagnose-from-Lungs-XRay-image-MLOps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900"
                >
                  <Github className="w-4 h-4" /> GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/ritam-mondal-86a369287/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900"
                >
                  <Linkedin className="w-4 h-4" /> LinkedIn
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
