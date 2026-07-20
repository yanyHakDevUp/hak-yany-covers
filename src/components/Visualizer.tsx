import React, { useEffect, useRef } from 'react';
import { useAudio } from '../context/AudioContext';

interface VisualizerProps {
  type?: 'bars' | 'wave' | 'circular';
}

export const Visualizer: React.FC<VisualizerProps> = ({ type = 'wave' }) => {
  const { analyserNode, isPlaying, activeMood } = useAudio();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const phaseRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Get color based on mood
    const getMoodColor = () => {
      const root = document.documentElement;
      return getComputedStyle(root).getPropertyValue('--mood-primary').trim() || '#a020f0';
    };

    const getMoodSecondary = () => {
      const root = document.documentElement;
      return getComputedStyle(root).getPropertyValue('--mood-secondary').trim() || '#ff007f';
    };

    // Draw loop
    let bufferLength = analyserNode ? analyserNode.frequencyBinCount : 64;
    let dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;

      // Clear canvas
      ctx.clearRect(0, 0, w, h);

      const moodPrimary = getMoodColor();
      const moodSecondary = getMoodSecondary();

      // Check if we have active Web Audio data
      let hasRealAudio = false;
      if (analyserNode && isPlaying) {
        analyserNode.getByteFrequencyData(dataArray);
        // Verify we actually have dynamic signal values (not all 0s due to CORS)
        const sum = dataArray.reduce((acc, val) => acc + val, 0);
        if (sum > 10) {
          hasRealAudio = true;
        }
      }

      if (hasRealAudio) {
        // --- REAL WEB AUDIO RENDERING ---
        if (type === 'bars') {
          const barWidth = (w / bufferLength) * 1.5;
          let barHeight;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            barHeight = (dataArray[i] / 255) * h * 0.8;

            const grad = ctx.createLinearGradient(x, h, x, h - barHeight);
            grad.addColorStop(0, moodSecondary);
            grad.addColorStop(1, moodPrimary);

            ctx.fillStyle = grad;
            ctx.shadowBlur = 10;
            ctx.shadowColor = moodPrimary;

            ctx.fillRect(x, h - barHeight, barWidth - 2, barHeight);
            x += barWidth;
          }
        } else if (type === 'circular') {
          const centerX = w / 2;
          const centerY = h / 2;
          const radius = Math.min(w, h) * 0.25;

          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
          ctx.lineWidth = 2;
          ctx.stroke();

          for (let i = 0; i < bufferLength; i++) {
            const angle = (i / bufferLength) * Math.PI * 2;
            const amp = (dataArray[i] / 255) * 45;
            const x1 = centerX + Math.cos(angle) * radius;
            const y1 = centerY + Math.sin(angle) * radius;
            const x2 = centerX + Math.cos(angle) * (radius + amp);
            const y2 = centerY + Math.sin(angle) * (radius + amp);

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = i % 2 === 0 ? moodPrimary : moodSecondary;
            ctx.lineWidth = 3;
            ctx.shadowBlur = 12;
            ctx.shadowColor = moodPrimary;
            ctx.stroke();
          }
        } else {
          // 'wave' layout
          ctx.beginPath();
          ctx.moveTo(0, h / 2);

          const sliceWidth = w / bufferLength;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            const y = (v * h) / 2;

            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }

            x += sliceWidth;
          }

          ctx.lineTo(w, h / 2);
          ctx.strokeStyle = moodPrimary;
          ctx.lineWidth = 3;
          ctx.shadowBlur = 15;
          ctx.shadowColor = moodPrimary;
          ctx.stroke();
        }
      } else {
        // --- SIMULATED/FALLBACK WAVE RENDERING ---
        phaseRef.current += isPlaying ? 0.06 : 0.01;
        const phase = phaseRef.current;

        ctx.lineWidth = 2.5;
        ctx.shadowBlur = 12;
        ctx.shadowColor = moodPrimary;

        // Draw three overlapping sine waves with different frequencies and speeds
        const waveCount = 3;
        for (let j = 0; j < waveCount; j++) {
          ctx.beginPath();
          
          ctx.strokeStyle = j === 0 ? moodPrimary : j === 1 ? moodSecondary : 'rgba(255, 255, 255, 0.4)';
          ctx.lineWidth = j === 0 ? 3 : 1.5;

          const amplitude = isPlaying ? (20 - j * 4) : (3 - j * 0.5);
          const speedFactor = j * 0.5 + 1.0;

          for (let x = 0; x < w; x++) {
            const angle = (x / w) * Math.PI * 4 + phase * speedFactor;
            // Dampen amplitudes at boundaries
            const boundaryDampen = Math.sin((x / w) * Math.PI);
            const y = h / 2 + Math.sin(angle) * amplitude * boundaryDampen;

            if (x === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.stroke();
        }
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyserNode, type, isPlaying, activeMood]);

  return (
    <div className="visualizer-wrapper">
      <style>{`
        .visualizer-wrapper {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .visualizer-canvas {
          width: 100%;
          height: 100%;
          display: block;
        }
      `}</style>
      <canvas ref={canvasRef} className="visualizer-canvas" />
    </div>
  );
};
