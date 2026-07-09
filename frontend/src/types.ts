/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PredictionResult {
  prediction: 'Normal' | 'Pneumonia';
  confidence: number;
  source?: string;
}

export interface HistoryItem {
  id: string;
  imageUrl: string;
  prediction: 'Normal' | 'Pneumonia';
  confidence: number;
  timestamp: string;
  fileName: string;
  source?: string;
}

export interface DemoImage {
  id: string;
  name: string;
  type: 'Normal' | 'Pneumonia';
  description: string;
  canvasDrawer: (ctx: CanvasRenderingContext2D) => void;
}
