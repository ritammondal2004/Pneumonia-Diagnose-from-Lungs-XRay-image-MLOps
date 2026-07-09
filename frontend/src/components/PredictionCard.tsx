/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileImage, Sparkles, RefreshCw, AlertTriangle, Play, CheckCircle, Search, Eye, Activity, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateXrayFile, drawChestXray } from '../utils/xrayGenerator';
import { PredictionResult } from '../types';

interface PredictionCardProps {
  key?: any;
  onPredictionComplete: (result: PredictionResult, file: File, imageUrl: string) => void;
  triggerDemoSignal: number;
}

export default function PredictionCard({ onPredictionComplete, triggerDemoSignal }: PredictionCardProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorState, setErrorState] = useState<'none' | 'waking_up' | 'invalid_file' | 'general_error'>('none');
  const [errorMsg, setErrorMsg] = useState('');
  const [highlightAnomalies, setHighlightAnomalies] = useState(false);
  const [activeDemoType, setActiveDemoType] = useState<'Normal' | 'Pneumonia' | null>(null);

  // Gemini-inspired AI scan effect states
  const [scanStatusIndex, setScanStatusIndex] = useState(0);
  const [retryAttempt, setRetryAttempt] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const SCAN_STATUSES = [
    "Initializing Model...",
    "Extracting Features...",
    "Analyzing Lung Fields...",
    "Detecting Abnormalities...",
    "Computing Confidence...",
    "Generating Diagnosis..."
  ];

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Interval timer for rotating scan statuses during inference
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnalyzing) {
      setScanStatusIndex(0);
      interval = setInterval(() => {
        setScanStatusIndex((prev) => (prev + 1) % SCAN_STATUSES.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  useEffect(() => {
    if (activeDemoType && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        drawChestXray(ctx, canvas.width, canvas.height, activeDemoType, highlightAnomalies);
      }
    }
  }, [highlightAnomalies, activeDemoType, previewUrl]);

  useEffect(() => {
    if (triggerDemoSignal > 0) {
      loadDemoScan('Pneumonia');
    }
  }, [triggerDemoSignal]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const validateAndProcessFile = (file: File) => {
    setErrorState('none');
    setErrorMsg('');
    setActiveDemoType(null);

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setErrorState('invalid_file');
      setErrorMsg('Invalid file format. Please upload a chest X-Ray in JPEG or PNG format.');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrorState('invalid_file');
      setErrorMsg('File is too large. Maximum size allowed is 8MB.');
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const loadDemoScan = async (type: 'Normal' | 'Pneumonia') => {
    setIsAnalyzing(false);
    setErrorState('none');
    setErrorMsg('');
    setActiveDemoType(type);

    const fileName = `demo_${type.toLowerCase()}_xray.jpg`;
    try {
      const file = await generateXrayFile(type, fileName);
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } catch (err) {
      console.error('Failed to generate demo x-ray:', err);
      setErrorState('general_error');
      setErrorMsg('Failed to initialize demo scan. Please try uploading a manual scan.');
    }
  };

  const analyzeXray = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setErrorState('none');
    setErrorMsg('');
    setRetryAttempt(1);
    setIsRetrying(false);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result as string;

      const makeRequest = async (attempt: number): Promise<void> => {
        try {
          setRetryAttempt(attempt);
          setIsRetrying(false);
          const controller = new AbortController();
          // Timeout after 65 seconds for each individual attempt (allowing for 60s server timeout)
          const timeoutId = setTimeout(() => controller.abort(), 65000);

          const response = await fetch('/api/predict', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              image: base64Data,
              fileName: selectedFile.name,
              mimeType: selectedFile.type,
            }),
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            throw new Error(`Server returned status: ${response.status}`);
          }

          const data = await response.json();
          
          if (typeof data.prediction !== 'string' || typeof data.confidence !== 'number') {
            throw new Error('Malformed server response format.');
          }

          const finalPrediction = data.prediction === 'Pneumonia' ? 'Pneumonia' : 'Normal';
          
          onPredictionComplete(
            {
              prediction: finalPrediction,
              confidence: data.confidence,
              source: data.source,
            },
            selectedFile,
            previewUrl || ''
          );
          
          setIsAnalyzing(false);
          setErrorState('none');
          setRetryAttempt(0);
          setIsRetrying(false);

        } catch (err: any) {
          console.warn(`[PneumoVision AI] Diagnostic Attempt ${attempt} failed:`, err);
          
          if (attempt < 4) {
            setIsRetrying(true);
            // Wait 6 seconds before retrying
            await new Promise((resolve) => setTimeout(resolve, 6000));
            await makeRequest(attempt + 1);
          } else {
            console.error('[PneumoVision AI] All model prediction retries failed.');
            setErrorState('general_error');
            setErrorMsg('The chest X-ray diagnostic service is currently offline or undergoing a cold-start. Please try again in a few moments.');
            setIsAnalyzing(false);
            setIsRetrying(false);
            setRetryAttempt(0);
          }
        }
      };

      await makeRequest(1);
    };

    reader.onerror = () => {
      setIsAnalyzing(false);
      setErrorState('general_error');
      setErrorMsg('Failed to process chest radiograph file. Please verify file integrity.');
    };

    reader.readAsDataURL(selectedFile);
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setErrorState('none');
    setErrorMsg('');
    setActiveDemoType(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <section id="workspace" className="py-24 bg-slate-50 border-t border-slate-100 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Diagnostics Workspace</h2>
          <p className="text-slate-500 mt-2.5 max-w-lg mx-auto text-sm leading-relaxed">
            Ingest radiographic scans into the pipeline or load standardized pediatric control samples to evaluate our diagnostic threshold maps.
          </p>
        </div>

        {/* Workspace Pure White Card with Subtle Apple Shadows */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-100 relative overflow-hidden">
          {/* Diagnostic Subheader bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
            <span className="text-[11px] font-bold tracking-wider font-mono text-slate-500 uppercase">
              IMAGING INGESTION HUB
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => loadDemoScan('Normal')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  activeDemoType === 'Normal'
                    ? 'bg-blue-50 border-blue-200 text-blue-600'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
                Demo: Healthy Lungs
              </button>
              <button
                type="button"
                onClick={() => loadDemoScan('Pneumonia')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  activeDemoType === 'Pneumonia'
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                Demo: Active Pneumonia
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
            {/* LEFT COLUMN: Input/Preview Area */}
            <div className="md:col-span-6 w-full">
              {!previewUrl ? (
                // Drag & Drop Box with extremely clean Mayo Clinic light styles
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 cursor-pointer relative group flex flex-col items-center justify-center min-h-[320px] ${
                    isDragActive
                      ? 'border-blue-500 bg-blue-50/40 shadow-inner'
                      : 'border-slate-200 bg-slate-50/50 hover:border-blue-300 hover:bg-blue-50/10'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleFileChange}
                  />

                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-150 flex items-center justify-center mb-5 shadow-sm group-hover:scale-105 group-hover:border-blue-200 transition-all duration-200">
                    <Upload className="w-6 h-6 text-slate-400 group-hover:text-blue-500 transition-colors" />
                  </div>

                  <h3 className="text-slate-800 font-semibold text-base">Upload Chest X-Ray</h3>
                  <p className="text-slate-500 text-xs mt-1.5 max-w-[200px] mx-auto leading-relaxed">
                    Drag & drop file here, or click to <span className="text-blue-600 font-semibold group-hover:underline">browse</span>
                  </p>
                  <span className="text-[9px] font-mono font-bold text-slate-400 mt-6 uppercase tracking-widest">
                    JPEG or PNG • Max 8 MB
                  </span>
                </div>
              ) : (
                // Interactive Preview Box
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 p-2.5 shadow-inner">
                  {/* Realtime diagnostic indicator badge */}
                  <div className="absolute top-5 left-5 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[10px] font-mono font-semibold text-slate-300">
                    <Search className="w-3 h-3 text-sky-400" />
                    INGESTION PREVIEW
                  </div>

                   {isAnalyzing ? (
                    // High-tech Gemini-inspired scanning effect during active inference
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#05080f] flex flex-col items-center justify-center">
                      {/* Underlay of chest X-ray styled with soft neon-blue filter */}
                      <div className="absolute inset-0 opacity-[0.16] select-none scale-[1.02]">
                        {activeDemoType ? (
                          <canvas
                            ref={canvasRef}
                            width={448}
                            height={448}
                            className="w-full h-full object-contain filter blur-[1.5px]"
                          />
                        ) : (
                          <img
                            src={previewUrl || ''}
                            alt="Ingesting radiograph"
                            className="w-full h-full object-contain filter blur-[1.5px]"
                            referrerPolicy="no-referrer"
                          />
                        )}
                      </div>

                      {/* 3D Spectroscopy grid overlay */}
                      <div className="absolute inset-0 opacity-[0.15]" style={{
                        backgroundImage: 'linear-gradient(#0ea5e9 1px, transparent 1px), linear-gradient(90deg, #0ea5e9 1px, transparent 1px)',
                        backgroundSize: '24px 24px'
                      }} />

                      {/* Rotating compass / HUD calibration circles */}
                      <div className="absolute inset-10 border border-sky-500/10 rounded-full flex items-center justify-center animate-[spin_12s_linear_infinite]">
                        <div className="w-11/12 h-11/12 border border-dashed border-sky-400/15 rounded-full" />
                      </div>

                      {/* Circular pulsing expansion waves */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 pointer-events-none">
                        <div className="absolute inset-0 rounded-full border-2 border-blue-500/35 animate-ping" style={{ animationDuration: '2.5s' }} />
                        <div className="absolute inset-8 rounded-full border border-sky-400/25 animate-ping" style={{ animationDuration: '1.8s' }} />
                        <div className="absolute inset-16 rounded-full bg-blue-500/5 border border-indigo-400/20 animate-pulse" />
                      </div>

                      {/* Corner Brackets */}
                      <div className="absolute inset-4 z-10 pointer-events-none">
                        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-sky-400 rounded-tl-md animate-pulse" />
                        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-sky-400 rounded-tr-md animate-pulse" />
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-sky-400 rounded-bl-md animate-pulse" />
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-sky-400 rounded-br-md animate-pulse" />
                      </div>

                      {/* Blue/Sky-blue laser scan line */}
                      <motion.div 
                        animate={{ 
                          top: ["5%", "95%", "5%"] 
                        }}
                        transition={{ 
                          repeat: Infinity, 
                          duration: 3.5, 
                          ease: "easeInOut" 
                        }}
                        className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-sky-400 to-transparent shadow-[0_0_12px_#38bdf8] z-20"
                      />

                      {/* Floating glowing micro-particles */}
                      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-45">
                        {[...Array(10)].map((_, i) => (
                          <div 
                            key={i} 
                            className="absolute bg-sky-400 rounded-full animate-pulse"
                            style={{
                              width: `${Math.random() * 3 + 2}px`,
                              height: `${Math.random() * 3 + 2}px`,
                              left: `${Math.random() * 90 + 5}%`,
                              top: `${Math.random() * 90 + 5}%`,
                              animationDelay: `${Math.random() * 1.5}s`,
                              animationDuration: `${Math.random() * 2 + 1}s`,
                            }}
                          />
                        ))}
                      </div>

                      {/* Active AI ticker core */}
                      <div className="relative z-20 text-center px-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-3.5 shadow-lg shadow-black/50">
                          <Activity className="w-5.5 h-5.5 text-sky-400 animate-pulse" />
                        </div>
                        <span className="text-[10px] font-mono font-bold text-sky-400 tracking-widest uppercase animate-pulse">
                          PNEUMOVISION CORE
                        </span>
                        <h4 className="text-sm font-sans font-bold text-slate-100 tracking-tight mt-1 animate-pulse">
                          {SCAN_STATUSES[scanStatusIndex]}
                        </h4>
                        <div className="flex items-center justify-center gap-1.5 mt-2.5">
                          <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" />
                          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                            {retryAttempt > 1 ? `RETRYING (WAKING UP SERVER)` : `FEATURE EXTRACTION CYCLE`}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : activeDemoType ? (
                    // Procedural X-ray representation
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-black">
                      <canvas
                        ref={canvasRef}
                        width={448}
                        height={448}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    // Regular uploaded image preview
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#070a13] flex items-center justify-center">
                      <img
                        src={previewUrl}
                        alt="Uploaded Chest X-ray Preview"
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  {/* Action row underneath image preview */}
                  <div className="flex items-center justify-between mt-3 px-1">
                    <button
                      type="button"
                      onClick={clearSelection}
                      className="text-xs text-slate-500 hover:text-rose-500 font-semibold transition-colors cursor-pointer"
                    >
                      Remove Scan
                    </button>

                    {activeDemoType && (
                      <button
                        type="button"
                        onClick={() => setHighlightAnomalies(!highlightAnomalies)}
                        className={`text-xs flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all border font-semibold ${
                          highlightAnomalies
                            ? 'bg-rose-50 border-rose-100 text-rose-600 shadow-sm'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        {highlightAnomalies ? 'Hide Pathology Marks' : 'Highlight Pathology'}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Diagnostic Controls & Alerts */}
            <div className="md:col-span-6 flex flex-col justify-center min-h-[300px]">
              {/* Ready to Analyze layout */}
              {!isAnalyzing && errorState === 'none' && (
                <div className="text-left">
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-mono font-medium mb-4">
                    <Sparkles className="w-3 h-3 text-blue-500" /> Pipeline Ready
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    {selectedFile ? 'Radiograph Preprocessed' : 'Load Pulmonary Scan'}
                  </h3>
                  
                  <p className="text-slate-500 text-sm mt-3 leading-relaxed">
                    {selectedFile 
                      ? `"${selectedFile.name}" has completed histogram standardization. RobustXrayNet is ready to extract thoracic feature maps and return classification scores.`
                      : 'Provide a custom chest X-ray photo/export or initialize one of our clinical demos. Our algorithms will automatically execute alignment and diagnostic evaluation.'
                    }
                  </p>

                  <div className="mt-8">
                    <button
                      type="button"
                      disabled={!selectedFile}
                      onClick={analyzeXray}
                      className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-200 ${
                        selectedFile
                          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/10 cursor-pointer'
                          : 'bg-slate-100 text-slate-400 border border-slate-150 cursor-not-allowed'
                      }`}
                    >
                      <Activity className="w-4.5 h-4.5" />
                      Analyze Chest X-Ray
                    </button>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {isAnalyzing && (
                <div className="text-left py-4">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-mono font-semibold mb-4 animate-pulse">
                    <Activity className="w-3.5 h-3.5 animate-spin" /> Neural Pipeline Engaged
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    Inference in Progress
                  </h3>
                  
                  <p className="text-slate-500 text-sm mt-3 leading-relaxed">
                    RobustXrayNet is processing the image matrix through residual blocks to extract deep feature representation maps.
                  </p>

                  {/* Realtime Retry/Status Console */}
                  <div className="mt-6 p-5 rounded-2xl bg-slate-50 border border-slate-200/80 font-mono text-xs text-slate-600 space-y-3 shadow-inner">
                    <div className="flex justify-between items-center pb-2.5 border-b border-slate-200">
                      <span className="font-bold text-slate-800">PIPELINE MONITOR</span>
                      <span className="text-blue-600 font-bold animate-pulse">ACTIVE</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Inference Model:</span>
                      <span className="font-bold text-slate-800">RobustXrayNet (ResNet)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Server Host:</span>
                      <span className="font-bold text-slate-800">Render (Free Tier)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Request Cycle:</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isRetrying ? 'bg-amber-100 text-amber-800 animate-pulse' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {isRetrying ? `RETRYING... (8s wait)` : `ATTEMPT ${retryAttempt} OF 6`}
                      </span>
                    </div>

                    {retryAttempt > 1 && (
                      <div className="text-[10px] text-amber-700 leading-relaxed pt-2.5 border-t border-slate-200 border-dashed space-y-1.5">
                        <p>
                          ⚠️ <strong>Server Cold-Start Active:</strong> The model is hosted on a Render Free Tier service which goes to sleep after inactivity. It requires 30–60 seconds to boot up.
                        </p>
                        <p className="font-semibold text-slate-500">
                          Automatic retry process is active. Please wait on this page.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* API Connection & Error Alerts */}
              {!isAnalyzing && errorState !== 'none' && (
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-left">
                  <div className="w-11 h-11 rounded-xl bg-rose-50 border border-rose-150 flex items-center justify-center mb-4">
                    <AlertTriangle className="w-5 h-5 text-rose-600" />
                  </div>

                  <h3 className="text-slate-900 font-bold text-base tracking-tight">
                    Evaluation Paused
                  </h3>

                  <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                    {errorMsg || 'A communications error occurred. Check your radiograph format and try again.'}
                  </p>

                  <div className="mt-6 flex gap-2.5">
                    <button
                      type="button"
                      onClick={analyzeXray}
                      className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Retry Analysis
                    </button>
                    <button
                      type="button"
                      onClick={clearSelection}
                      className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      Clear File
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
