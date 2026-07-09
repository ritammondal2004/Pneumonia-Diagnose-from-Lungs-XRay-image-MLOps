/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Renders a high-fidelity chest X-ray scan on a 2D canvas context.
 */
export function drawChestXray(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  type: 'Normal' | 'Pneumonia',
  highlightAnomalies: boolean = false
) {
  // Clear with a rich medical radiology black-blue background
  ctx.fillStyle = '#0a0d14';
  ctx.fillRect(0, 0, width, height);

  // Apply general diagnostic vignette/blur
  const cx = width / 2;
  const cy = height / 2;

  // Draw Thoracic Cavity Outline (The rib cage outer contour)
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(0.9, 0.95);

  // 1. Spine (Vertebral Column)
  const spineGrad = ctx.createLinearGradient(0, -height / 2, 0, height / 2);
  spineGrad.addColorStop(0, 'rgba(230, 235, 245, 0.9)');
  spineGrad.addColorStop(0.5, 'rgba(200, 210, 225, 0.85)');
  spineGrad.addColorStop(1, 'rgba(180, 190, 210, 0.9)');
  ctx.fillStyle = spineGrad;
  
  // Draw spinal cord vertebrae segments
  const segmentCount = 20;
  const segmentHeight = height / segmentCount;
  for (let i = 0; i < segmentCount; i++) {
    const y = -height / 2 + i * segmentHeight;
    const segW = 14 - (i * 0.15); // tapers slightly
    ctx.fillRect(-segW / 2, y + 1, segW, segmentHeight - 2);
    
    // Transverse processes (wings of vertebrae)
    ctx.fillStyle = 'rgba(210, 220, 235, 0.35)';
    ctx.fillRect(-segW - 3, y + segmentHeight / 2 - 1, (segW + 3) * 2, 2);
    ctx.fillStyle = spineGrad;
  }

  // 2. Diaphragm (Domes at the bottom of the chest)
  ctx.fillStyle = 'rgba(210, 220, 235, 0.8)';
  ctx.beginPath();
  // Left Dome (Anatomical Right - viewed on left of image)
  ctx.arc(-cx * 0.45, height * 0.32, cx * 0.5, Math.PI, 0, false);
  // Right Dome (Anatomical Left - viewed on right of image)
  ctx.arc(cx * 0.45, height * 0.36, cx * 0.48, Math.PI, 0, false);
  ctx.fill();

  // Dark background for lungs (air is black on X-ray)
  ctx.fillStyle = '#06080c';
  
  // Left lung lobe (Anatomical right)
  ctx.beginPath();
  ctx.ellipse(-cx * 0.4, -cy * 0.05, cx * 0.32, cy * 0.72, 0, 0, 2 * Math.PI);
  ctx.fill();

  // Right lung lobe (Anatomical left)
  ctx.beginPath();
  ctx.ellipse(cx * 0.4, -cy * 0.05, cx * 0.32, cy * 0.72, 0, 0, 2 * Math.PI);
  ctx.fill();

  // 3. Heart Silhouette (Mediastinal shadow)
  // Shifted anatomically to the left (right side of image)
  const heartGrad = ctx.createRadialGradient(-cx * 0.1, cy * 0.2, 5, -cx * 0.05, cy * 0.25, cx * 0.5);
  heartGrad.addColorStop(0, 'rgba(220, 225, 235, 0.9)');
  heartGrad.addColorStop(0.6, 'rgba(200, 205, 220, 0.75)');
  heartGrad.addColorStop(1, 'rgba(100, 110, 130, 0.0)');

  ctx.fillStyle = heartGrad;
  ctx.beginPath();
  ctx.ellipse(cx * 0.12, cy * 0.18, cx * 0.28, cy * 0.34, -Math.PI / 8, 0, 2 * Math.PI);
  ctx.fill();

  // 4. Clavicles (Collar bones at the top)
  ctx.strokeStyle = 'rgba(225, 230, 245, 0.8)';
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  
  // Left clavicle
  ctx.beginPath();
  ctx.moveTo(-cx * 0.8, -cy * 0.7);
  ctx.quadraticCurveTo(-cx * 0.4, -cy * 0.8, -10, -cy * 0.6);
  ctx.stroke();

  // Right clavicle
  ctx.beginPath();
  ctx.moveTo(cx * 0.8, -cy * 0.7);
  ctx.quadraticCurveTo(cx * 0.4, -cy * 0.8, 10, -cy * 0.6);
  ctx.stroke();

  // 5. Rib Cage (12 pairs of ribs)
  ctx.strokeStyle = 'rgba(220, 225, 240, 0.15)';
  ctx.lineWidth = 6;
  for (let i = 2; i < 12; i++) {
    const spacing = cy * 0.13;
    const yOffset = -cy * 0.6 + i * spacing;
    const ribWidthX = cx * 0.75 * (1 - Math.pow((i - 7) / 10, 2));

    // Left rib (curves forward)
    ctx.beginPath();
    ctx.ellipse(-cx * 0.4, yOffset, ribWidthX * 0.5, spacing * 0.9, -Math.PI / 18, Math.PI * 1.05, Math.PI * 1.95);
    ctx.stroke();

    // Right rib (curves forward)
    ctx.beginPath();
    ctx.ellipse(cx * 0.4, yOffset, ribWidthX * 0.5, spacing * 0.9, Math.PI / 18, Math.PI * 1.05, Math.PI * 1.95);
    ctx.stroke();
  }

  // 6. Bronchial Hilum Markings (vascular branching radiating from center)
  const drawVasculature = (originX: number, originY: number, direction: 1 | -1) => {
    ctx.strokeStyle = 'rgba(230, 235, 245, 0.18)';
    ctx.lineWidth = 1.5;
    const branch = (x: number, y: number, len: number, angle: number, depth: number) => {
      if (depth > 3) return;
      const endX = x + Math.cos(angle) * len;
      const endY = y + Math.sin(angle) * len;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      const nextLen = len * 0.7;
      branch(endX, endY, nextLen, angle + 0.25 * direction, depth + 1);
      branch(endX, endY, nextLen, angle - 0.25 * direction, depth + 1);
    };

    branch(originX, originY, cx * 0.2, (direction === 1 ? 0 : Math.PI) + (Math.PI / 12), 1);
    branch(originX, originY, cx * 0.15, (direction === 1 ? 0 : Math.PI) - (Math.PI / 6), 1);
  };

  drawVasculature(-cx * 0.12, -cy * 0.05, -1);
  drawVasculature(cx * 0.15, -cy * 0.05, 1);

  // 7. Pathology Overlay: Pneumonia (Infiltrates / Consolidation)
  if (type === 'Pneumonia') {
    // Add cloudy, diffuse alveolar consolidation in the lower-middle lung fields
    // Often bilateral or focal. Let's make a beautiful, realistic focal opacity in the right lung base (anatomical left)
    const opacityGrad = ctx.createRadialGradient(cx * 0.38, cy * 0.22, 10, cx * 0.4, cy * 0.24, cx * 0.28);
    opacityGrad.addColorStop(0, 'rgba(235, 240, 255, 0.65)'); // Consolidated core
    opacityGrad.addColorStop(0.4, 'rgba(215, 225, 245, 0.45)'); // Diffuse shadow
    opacityGrad.addColorStop(0.7, 'rgba(180, 195, 220, 0.22)'); // Ground glass opacity
    opacityGrad.addColorStop(1, 'rgba(180, 195, 220, 0)');

    ctx.fillStyle = opacityGrad;
    ctx.beginPath();
    ctx.ellipse(cx * 0.4, cy * 0.2, cx * 0.25, cy * 0.25, Math.PI / 12, 0, 2 * Math.PI);
    ctx.fill();

    // Minor patchy infiltrates on the opposite side to make it clinically interesting
    const opacityGrad2 = ctx.createRadialGradient(-cx * 0.32, -cy * 0.1, 5, -cx * 0.32, -cy * 0.1, cx * 0.18);
    opacityGrad2.addColorStop(0, 'rgba(220, 230, 245, 0.32)');
    opacityGrad2.addColorStop(0.6, 'rgba(200, 215, 235, 0.15)');
    opacityGrad2.addColorStop(1, 'rgba(200, 215, 235, 0)');
    
    ctx.fillStyle = opacityGrad2;
    ctx.beginPath();
    ctx.ellipse(-cx * 0.32, -cy * 0.1, cx * 0.18, cy * 0.18, -Math.PI / 6, 0, 2 * Math.PI);
    ctx.fill();

    // Highlight area with a high-tech glowing medical bounding circle if highlightAnomalies is active
    if (highlightAnomalies) {
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)'; // red accent
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      
      ctx.beginPath();
      ctx.ellipse(cx * 0.4, cy * 0.2, cx * 0.28, cy * 0.28, Math.PI / 12, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.setLineDash([]);

      // Label
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('CONSOLIDATION PATHOLOGY AREA', cx * 0.15, cy * 0.52);
    }
  } else if (highlightAnomalies) {
    // Normal case - healthy clear lung fields highlight
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.5)'; // green accent
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    
    // Clear lung circles
    ctx.beginPath();
    ctx.ellipse(-cx * 0.4, -cy * 0.05, cx * 0.22, cy * 0.52, 0, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(cx * 0.4, -cy * 0.05, cx * 0.22, cy * 0.52, 0, 0, 2 * Math.PI);
    ctx.stroke();
    
    ctx.setLineDash([]);
    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 10px monospace';
    ctx.fillText('CLEAR PATHOLOGY COHORT', -cx * 0.25, -cy * 0.65);
  }

  // Restore transform state
  ctx.restore();

  // Draw radiologist markings (labels e.g., "R", "AP", "PneumoVision AI")
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.font = '12px monospace';
  ctx.fillText('R', 20, 30); // Anatomical right side is on the left
  ctx.fillText('AP PORTABLE', 20, 50);
  ctx.fillText('PneumoVision Diagnostic Suite', width - 200, 30);
  
  // Date timestamp
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  ctx.fillText(dateStr, width - 200, 50);

  // Border frame
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  ctx.strokeRect(5, 5, width - 10, height - 10);
}

/**
 * Converts a Canvas rendering into a JPEG File object.
 */
export function generateXrayFile(type: 'Normal' | 'Pneumonia', fileName: string): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = 448; // Higher res for diagnostic feel
    canvas.height = 448;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    drawChestXray(ctx, canvas.width, canvas.height, type, false);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], fileName, { type: 'image/jpeg' });
          resolve(file);
        } else {
          reject(new Error('Canvas blob generation failed'));
        }
      },
      'image/jpeg',
      0.95
    );
  });
}
