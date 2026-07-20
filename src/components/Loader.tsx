import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

interface LoaderProps {
  onComplete: () => void;
}

export const Loader: React.FC<LoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Loading my emotions...');
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const statuses = [
      'Tuning the vocal cords...',
      'Warming up the microphone...',
      'Syncing heartbeat to lyrics...',
      'Loading midnight recordings...',
      'Just a few more feelings...'
    ];

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => setFade(true), 400);
          setTimeout(onComplete, 900);
          return 100;
        }
        
        // Randomly update status text
        if (prev > 0 && prev % 25 === 0) {
          const nextStatus = statuses[Math.floor(prev / 25) - 1] || 'Loading...';
          setStatusText(nextStatus);
        }
        
        return prev + 1;
      });
    }, 25);

    return () => clearInterval(progressInterval);
  }, [onComplete]);

  return (
    <div className={`loader-container ${fade ? 'fade-out' : ''}`}>
      <style>{`
        .loader-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: #050508;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          transition: opacity 0.5s ease;
        }
        .loader-container.fade-out {
          opacity: 0;
          pointer-events: none;
        }
        .heart-glow {
          color: var(--mood-primary, #ff007f);
          animation: heartbeat 1.4s ease-in-out infinite;
          width: 64px;
          height: 64px;
          margin-bottom: 2rem;
        }
        .loader-text {
          font-family: var(--font-display, sans-serif);
          font-size: 1.5rem;
          font-weight: 600;
          letter-spacing: 1px;
          margin-bottom: 1rem;
          height: 2rem;
          color: white;
          text-align: center;
        }
        .progress-bar-container {
          width: 250px;
          height: 4px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          overflow: hidden;
          position: relative;
        }
        .progress-bar-fill {
          height: 100%;
          background: var(--mood-gradient, linear-gradient(to right, #a020f0, #ff007f));
          transition: width 0.1s ease;
        }
        .progress-percentage {
          font-family: var(--font-sans, sans-serif);
          font-size: 0.8rem;
          color: var(--text-dim, #70708f);
          margin-top: 0.5rem;
          font-weight: 500;
        }
      `}</style>
      <Heart className="heart-glow" />
      <div className="loader-text neon-text-glow">{statusText}</div>
      <div className="progress-bar-container">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="progress-percentage">{progress}% completed</div>
    </div>
  );
};
