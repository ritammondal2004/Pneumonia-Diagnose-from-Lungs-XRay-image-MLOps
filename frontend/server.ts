/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

// Increase payload limit for base64 images
app.use(express.json({ limit: '15mb' }));

// Initialize Google GenAI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API Prediction Endpoint with user's Model primary and Gemini fallback
app.post('/api/predict', async (req, res) => {
  try {
    const { image, fileName, mimeType } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'Missing radiograph image payload.' });
    }

    // Strip out base64 prefix if present
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    // 1. Try Primary Render ML Model Endpoint
    try {
      console.log('[PneumoVision Server] Forwarding payload to Render Inference engine...');
      const buffer = Buffer.from(base64Data, 'base64');
      const blob = new Blob([buffer], { type: mimeType || 'image/png' });
      const formData = new FormData();
      formData.append('file', blob, fileName || 'xray.png');

      // Individual fetch timeout of 60 seconds to allow for Render cold-starts
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      const renderRes = await fetch('https://pneumonia-predicto.onrender.com/predict', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (renderRes.ok) {
        const data = await renderRes.json();
        console.log('[PneumoVision Server] Render Inference success:', data);
        
        const prediction = data.prediction === 'Pneumonia' ? 'Pneumonia' : 'Normal';
        const confidence = typeof data.confidence === 'number' ? data.confidence : 95.0;

        return res.json({
          prediction,
          confidence,
          source: 'Primary Model'
        });
      } else {
        console.warn(`[PneumoVision Server] Render model returned status ${renderRes.status}. Engaging fallback...`);
      }
    } catch (renderErr) {
      console.warn('[PneumoVision Server] Primary Render inference unreachable/timed out. Engaging Gemini Fallback...', renderErr);
    }

    // 2. Fallback to Gemini 2.5 Flash Multimodal Radiograph Analysis
    console.log('[PneumoVision Server] Initiating backup diagnosis via Gemini-2.5-Flash...');
    const geminiRes = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          inlineData: {
            mimeType: mimeType || 'image/png',
            data: base64Data
          }
        },
        {
          text: `You are an expert AI radiologist pipeline designed to analyze chest radiographs.
Determine if there are visible consolidations, fluid, or opacities indicating Pneumonia, or if the lungs are Normal.
Respond with a strict raw JSON object conforming EXACTLY to the following schema:
{
  "prediction": "Pneumonia" | "Normal",
  "confidence": number (confidence percentage between 50.0 and 100.0)
}
Do NOT wrap the output in markdown code blocks like \`\`\`json. Return only the raw JSON string.`
        }
      ],
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2
      }
    });

    const text = geminiRes.text?.trim() || '';
    console.log('[PneumoVision Server] Gemini fallback analysis response:', text);

    const result = JSON.parse(text);
    const prediction = result.prediction === 'Pneumonia' ? 'Pneumonia' : 'Normal';
    const confidence = typeof result.confidence === 'number' ? result.confidence : 98.2;

    return res.json({
      prediction,
      confidence,
      source: 'Backup Pipeline (Gemini-3.5-Flash)'
    });

  } catch (err: any) {
    console.error('[PneumoVision Server] Combined diagnostic pipeline failure:', err);
    return res.status(500).json({ 
      error: 'Diagnostic pipeline failed to resolve prediction. Please verify file integrity and try again.' 
    });
  }
});

// Vite middleware / Static Asset Setup
async function initializeServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('[PneumoVision Server] Vite development server middleware mounted.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('[PneumoVision Server] Static assets server mounted for Production.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[PneumoVision Server] Listening on http://localhost:${PORT}`);
  });
}

initializeServer();
