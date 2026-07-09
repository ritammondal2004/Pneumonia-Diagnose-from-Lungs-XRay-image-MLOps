/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Calendar, Trash2, FileImage, ShieldAlert, CheckCircle, Database, Search, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HistoryItem } from '../types';

interface HistorySectionProps {
  historyItems: HistoryItem[];
  onClearHistory: () => void;
  onRemoveItem: (id: string) => void;
  onReinspect: (item: HistoryItem) => void;
}

export default function HistorySection({
  historyItems,
  onClearHistory,
  onRemoveItem,
  onReinspect,
}: HistorySectionProps) {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredItems = historyItems.filter(
    (item) =>
      item.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.prediction.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="history" className="py-24 bg-white border-t border-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
          <div>
            <h2 id="history-title" className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <Database className="w-7 h-7 text-blue-600" />
              Patient Scan History
            </h2>
            <p className="text-slate-500 mt-1.5 text-sm leading-relaxed">
              Locally persisted assessment logs. Data remains strictly on your device for absolute patient privacy.
            </p>
          </div>

          {historyItems.length > 0 && (
            <button
              onClick={onClearHistory}
              className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Purge History
            </button>
          )}
        </div>


        {/* Database Search & Stats */}
        {historyItems.length > 0 && (
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            {/* Search Input */}
            <div className="sm:col-span-2 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search scans by file name or diagnostic prediction..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-400 text-slate-800 text-xs outline-none transition-all font-medium placeholder:text-slate-400"
              />
            </div>

            {/* Diagnostic stats */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-250 flex justify-between items-center text-xs font-semibold font-mono">
              <span className="text-slate-500">Total Assessments:</span>
              <span className="text-blue-600">{historyItems.length} records</span>
            </div>
          </div>
        )}

        {/* Scan Log List */}
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl shadow-slate-100">
          {filteredItems.length === 0 ? (
            <div className="text-center py-20 px-4">
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto mb-4">
                <FileImage className="w-6 h-6 text-slate-400" />
              </div>
              <h4 className="text-slate-950 font-bold text-base">No assessment logs found</h4>
              <p className="text-slate-500 text-xs max-w-sm mx-auto mt-1.5 leading-relaxed">
                {searchQuery 
                  ? 'No scan records match your active query. Refine keywords to try searching again.'
                  : 'Assessments generated via the Diagnostics Workspace will appear here with instant local indexing.'
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 max-h-[480px] overflow-y-auto">
              <AnimatePresence initial={false}>
                {filteredItems.map((item) => {
                  const isPneumonia = item.prediction === 'Pneumonia';
                  const confVal = item.confidence > 1 ? item.confidence : item.confidence * 100;

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.15 }}
                      className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors group"
                    >
                      {/* Image & Diagnosis Info */}
                      <div className="flex items-center gap-4">
                        {/* Compact thumbnail cached locally */}
                        <div className="w-12 h-12 rounded-lg bg-slate-950 border border-slate-200 shrink-0 overflow-hidden relative p-1">
                          <img
                            src={item.imageUrl}
                            alt="Scan log thumbnail"
                            className="w-full h-full object-contain rounded"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-slate-900 font-bold text-xs max-w-[140px] sm:max-w-[220px] truncate block" title={item.fileName}>
                              {item.fileName}
                            </span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono font-medium">
                              <Calendar className="w-3 h-3" />
                              {item.timestamp}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 mt-1.5">
                            {isPneumonia ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 border border-rose-100 text-[10px] font-bold text-rose-600">
                                <ShieldAlert className="w-3 h-3" />
                                Pneumonia
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-100 text-[10px] font-bold text-emerald-600">
                                <CheckCircle className="w-3 h-3" />
                                Normal
                              </span>
                            )}
                            
                            <span className="text-[10px] font-mono text-slate-500 font-medium">
                              Confidence: <strong className={isPneumonia ? 'text-rose-600' : 'text-emerald-600'}>{confVal.toFixed(1)}%</strong>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Row */}
                      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                        <button
                          onClick={() => onReinspect(item)}
                          className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-slate-700 hover:text-blue-600 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                        >
                          Reinspect
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                        
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                          title="Purge assessment record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
