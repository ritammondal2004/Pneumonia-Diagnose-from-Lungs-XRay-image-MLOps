/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PredictionCard from './components/PredictionCard';
import PredictionResultCard from './components/PredictionResult';
import HowItWorks from './components/HowItWorks';
import ModelDetails from './components/ModelDetails';
import HistorySection from './components/HistorySection';
import Footer from './components/Footer';
import { PredictionResult, HistoryItem } from './types';

export default function App() {
  const [currentResult, setCurrentResult] = useState<PredictionResult | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [currentFileName, setCurrentFileName] = useState<string>('');
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [triggerDemoCount, setTriggerDemoCount] = useState<number>(0);
  const [workspaceKey, setWorkspaceKey] = useState<number>(0);

  // Initialize and load log history from Local Storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('pneumovision_scans_history');
      if (stored) {
        setHistoryItems(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Failed to load scan histories from localStorage:', err);
    }
  }, []);

  // Utility to scroll smoothly to sections
  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Utility to resize and compress a preview image onto a tiny canvas to save LocalStorage quota
  const createThumbnailBase64 = (imageUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 96;
        canvas.height = 96;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Centered cover crop
          const size = Math.min(img.width, img.height);
          const sx = (img.width - size) / 2;
          const sy = (img.height - size) / 2;
          ctx.drawImage(img, sx, sy, size, size, 0, 0, 96, 96);
          
          // Highly compressed JPEG to keep size minimal
          resolve(canvas.toDataURL('image/jpeg', 0.6));
        } else {
          resolve(imageUrl);
        }
      };
      img.onerror = () => {
        resolve(imageUrl);
      };
      img.src = imageUrl;
    });
  };

  // Called when Prediction completes
  const handlePredictionComplete = async (
    result: PredictionResult,
    file: File,
    imageUrl: string
  ) => {
    setCurrentResult(result);
    setCurrentImageUrl(imageUrl);
    setCurrentFileName(file.name);

    // Compress the image to store a small high-efficiency thumbnail
    const thumbnail = await createThumbnailBase64(imageUrl);

    // Create a new history log entry
    const newItem: HistoryItem = {
      id: Math.random().toString(36).substring(2, 9),
      imageUrl: thumbnail,
      prediction: result.prediction,
      confidence: result.confidence,
      timestamp: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      fileName: file.name,
    };

    const updatedHistory = [newItem, ...historyItems];
    setHistoryItems(updatedHistory);
    
    try {
      localStorage.setItem('pneumovision_scans_history', JSON.stringify(updatedHistory));
    } catch (err) {
      console.error('LocalStorage persistence error (likely quota limit):', err);
    }

    // Smooth scroll down to result card with tiny delay
    setTimeout(() => {
      handleScrollToSection('results');
    }, 150);
  };

  // Re-inspect a historical log item (reloads it as active report)
  const handleReinspect = (item: HistoryItem) => {
    setCurrentResult({
      prediction: item.prediction,
      confidence: item.confidence,
    });
    setCurrentImageUrl(item.imageUrl);
    setCurrentFileName(item.fileName);

    setTimeout(() => {
      handleScrollToSection('results');
    }, 100);
  };

  // Clear all items in local history
  const handleClearHistory = () => {
    if (window.confirm('Are you absolutely sure you want to clear your local diagnostics history database? This action is irreversible.')) {
      setHistoryItems([]);
      try {
        localStorage.removeItem('pneumovision_scans_history');
      } catch (err) {
        console.error('Failed to purge localStorage database:', err);
      }
    }
  };

  // Delete a single item from the history list
  const handleRemoveItem = (id: string) => {
    const updated = historyItems.filter((item) => item.id !== id);
    setHistoryItems(updated);
    try {
      localStorage.setItem('pneumovision_scans_history', JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to update localStorage history log:', err);
    }
  };

  // Reset workspace results
  const handleReset = () => {
    setCurrentResult(null);
    setCurrentImageUrl(null);
    setCurrentFileName('');
    setWorkspaceKey((prev) => prev + 1);
    handleScrollToSection('workspace');
  };

  // Triggered when "Try Demo" is pressed
  const handleTriggerDemo = () => {
    setTriggerDemoCount((prev) => prev + 1);
    handleScrollToSection('workspace');
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-100 selection:text-blue-950">
      {/* Dynamic Header */}
      <Navbar onScrollToSection={handleScrollToSection} />

      {/* Hero section */}
      <Hero 
        onScrollToSection={handleScrollToSection} 
        onTriggerDemo={handleTriggerDemo} 
      />

      {/* Interactive Diagnostic Hub Workspace */}
      {!currentResult && (
        <PredictionCard 
          key={workspaceKey}
          onPredictionComplete={handlePredictionComplete} 
          triggerDemoSignal={triggerDemoCount} 
        />
      )}

      {/* Active Diagnostics Assessment Report */}
      {currentResult && currentImageUrl && (
        <PredictionResultCard
          result={currentResult}
          imageUrl={currentImageUrl}
          fileName={currentFileName}
          onReset={handleReset}
        />
      )}

      {/* Educational Walkthrough Pipeline */}
      <HowItWorks />

      {/* Model Technical Specifications */}
      <ModelDetails />

      {/* Saved Records Logs */}
      <HistorySection
        historyItems={historyItems}
        onClearHistory={handleClearHistory}
        onRemoveItem={handleRemoveItem}
        onReinspect={handleReinspect}
      />

      {/* Professional clinical footer and details */}
      <Footer />
    </div>
  );
}
