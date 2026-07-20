import React from 'react';
import { useAudio } from '../context/AudioContext';
import { Play, Pause, Maximize2 } from 'lucide-react';

export const SpotifyWidget: React.FC = () => {
  const { currentCover, isPlaying, currentTime, duration, togglePlay, setShowFullPlayer } = useAudio();

  if (!currentCover) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <>
      <style>{`
        .spotify-widget {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 320px;
          padding: 12px;
          border-radius: 16px;
          z-index: 900;
          display: flex;
          flex-direction: column;
          gap: 10px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6), 0 0 10px var(--mood-glow);
          border: 1px solid var(--border-glass);
          cursor: pointer;
          transition: var(--transition-smooth);
        }
        .spotify-widget:hover {
          transform: translateY(-5px) scale(1.02);
          background: rgba(25, 25, 38, 0.9);
        }
        .widget-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .widget-left {
          display: flex;
          align-items: center;
          gap: 12px;
          overflow: hidden;
          flex-grow: 1;
        }
        .widget-art {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          flex-shrink: 0;
          animation: ${isPlaying ? 'spin 12s linear infinite' : 'none'};
        }
        .widget-info {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .widget-title {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 0.9rem;
          color: white;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .widget-artist {
          font-family: var(--font-sans);
          font-size: 0.75rem;
          color: var(--text-gray);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .widget-right {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .widget-play-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: white;
          color: black;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        .widget-play-btn:hover {
          transform: scale(1.1);
        }
        .widget-expand-btn {
          color: var(--text-gray);
          background: transparent;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          border-radius: 4px;
          transition: color 0.2s ease;
        }
        .widget-expand-btn:hover {
          color: white;
        }
        .widget-progress {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .widget-progress-track {
          width: 100%;
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          overflow: hidden;
        }
        .widget-progress-fill {
          height: 100%;
          background: #1db954; /* Spotify green */
          border-radius: 2px;
          transition: width 0.1s linear;
        }
        .widget-time {
          display: flex;
          justify-content: space-between;
          font-size: 0.65rem;
          color: var(--text-dim);
          font-family: var(--font-sans);
        }
        .spotify-connect-indicator {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #1db954;
          box-shadow: 0 0 8px #1db954;
          display: inline-block;
          animation: breathing 2s infinite ease-in-out;
        }

        @keyframes breathing {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.3); opacity: 1; }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 480px) {
          .spotify-widget {
            width: calc(100% - 40px);
            left: 20px;
            bottom: 20px;
            right: 20px;
          }
        }
      `}</style>
      <div 
        className="spotify-widget glass-panel"
        onClick={() => setShowFullPlayer(true)}
      >
        <div className="widget-content">
          <div className="widget-left">
            <div 
              className="widget-art" 
              style={{ background: currentCover.coverImage }}
            >
              🎤
            </div>
            <div className="widget-info">
              <div className="widget-title">
                {currentCover.title}
              </div>
              <div className="widget-artist">
                by {currentCover.originalArtist}
              </div>
            </div>
          </div>
          <div className="widget-right">
            <div className="spotify-connect-indicator" />
            <button 
              className="widget-play-btn"
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
            >
              {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
            </button>
            <button 
              className="widget-expand-btn"
              onClick={(e) => {
                e.stopPropagation();
                setShowFullPlayer(true);
              }}
            >
              <Maximize2 size={14} />
            </button>
          </div>
        </div>
        
        <div className="widget-progress">
          <div className="widget-progress-track">
            <div 
              className="widget-progress-fill" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="widget-time">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </>
  );
};
