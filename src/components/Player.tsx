import React, { useEffect, useRef, useState } from 'react';
import { useAudio } from '../context/AudioContext';
import { Play, Pause, SkipForward, Volume2, Minimize2, Radio } from 'lucide-react';
import { Visualizer } from './Visualizer';

export const Player: React.FC = () => {
  const {
    currentCover,
    isPlaying,
    currentTime,
    duration,
    volume,
    showFullPlayer,
    setShowFullPlayer,
    togglePlay,
    seek,
    changeVolume,
    covers,
    playSong
  } = useAudio();

  const [visualizerType, setVisualizerType] = useState<'wave' | 'bars' | 'circular'>('circular');

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Sync video play/pause
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isPlaying, currentCover]);

  // Sync video time with audio time
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (Math.abs(video.currentTime - currentTime) > 0.35) {
      video.currentTime = currentTime;
    }
  }, [currentTime]);

  if (!showFullPlayer || !currentCover) return null;

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(parseFloat(e.target.value));
  };

  const handleNext = () => {
    const currentIndex = covers.findIndex((c) => c.id === currentCover.id);
    const nextIndex = (currentIndex + 1) % covers.length;
    playSong(covers[nextIndex]);
  };

  const handlePrev = () => {
    const currentIndex = covers.findIndex((c) => c.id === currentCover.id);
    const prevIndex = (currentIndex - 1 + covers.length) % covers.length;
    playSong(covers[prevIndex]);
  };

  return (
    <>
      <style>{`
        .full-player-overlay {
          position: fixed;
          inset: 0;
          z-index: 1100;
          background: rgba(5, 5, 8, 0.96);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          display: flex;
          flex-direction: column;
          animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        /* Particle Background Canvas in Player */
        .player-particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 2;
          opacity: 0.3;
        }

        .player-header {
          position: relative;
          z-index: 10;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 40px;
          border-bottom: 1px solid var(--border-glass);
        }

        .player-video-background {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
          opacity: 0.55;
        }

        .player-video-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(5, 5, 8, 0.45) 0%, rgba(5, 5, 8, 0.9) 100%);
          z-index: 1;
          pointer-events: none;
        }

        .player-header-title {
          font-family: var(--font-display);
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--text-dim);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .player-header-title span {
          color: var(--mood-primary);
        }
        .player-close-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border-glass);
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-fast);
        }
        .player-close-btn:hover {
          background: rgba(255,255,255,0.15);
          transform: scale(1.1);
        }

        .player-body {
          position: relative;
          z-index: 10;
          flex-grow: 1;
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 40px;
          padding: 40px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          overflow: hidden;
        }

        /* Left Side: Art, controls, visualizer */
        .player-left-pane {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 30px;
          overflow: hidden;
        }
        
        .visualizer-container {
          width: 280px;
          height: 280px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .large-album-art {
          width: 180px;
          height: 180px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 4rem;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5), 0 0 25px var(--mood-glow);
          position: absolute;
          z-index: 10;
          animation: ${isPlaying ? 'spin 20s linear infinite' : 'none'};
          border: 4px solid var(--border-glass);
        }

        .song-details-pane {
          text-align: center;
          width: 100%;
        }
        .large-song-title {
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: -0.5px;
          color: white;
          margin-bottom: 6px;
        }
        .large-song-artist {
          font-size: 1rem;
          color: var(--text-gray);
          margin-bottom: 20px;
        }

        /* Progress Slider Styling */
        .player-timeline-box {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .timeline-slider {
          -webkit-appearance: none;
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          outline: none;
          cursor: pointer;
        }
        .timeline-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 0 10px rgba(0,0,0,0.5);
          transition: transform 0.1s ease;
        }
        .timeline-slider::-webkit-slider-thumb:hover {
          transform: scale(1.3);
          background: var(--mood-primary);
        }
        .timeline-timer {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: var(--text-dim);
          font-family: var(--font-mono);
        }

        /* Control actions */
        .playback-controls-row {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-top: 10px;
        }
        .control-cycle-btn {
          color: var(--text-gray);
          background: transparent;
          border: none;
          cursor: pointer;
          transition: color 0.2s ease;
        }
        .control-cycle-btn:hover {
          color: white;
        }
        .main-play-pause-btn {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: white;
          color: black;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease;
          box-shadow: 0 8px 20px rgba(0,0,0,0.3);
        }
        .main-play-pause-btn:hover {
          transform: scale(1.08);
          box-shadow: 0 10px 25px var(--mood-glow);
        }

        .volume-control-row {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 60%;
          max-width: 200px;
          margin-top: 15px;
          color: var(--text-dim);
        }
        .volume-slider {
          -webkit-appearance: none;
          flex-grow: 1;
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          outline: none;
        }
        .volume-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: white;
        }

        /* Right Side: 3D Music Card */
        .player-right-pane {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          position: relative;
          border-left: 1px solid var(--border-glass);
          padding-left: 40px;
        }

        /* 3D Music Card Styles */
        .music-3d-card-wrapper {
          perspective: 1000px;
          width: 100%;
          height: 380px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .music-3d-card {
          width: 220px;
          height: 300px;
          position: relative;
          transform-style: preserve-3d;
          animation: float3D 6s ease-in-out infinite, rotate3D 15s linear infinite;
        }
        .card-face {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.05);
        }
        .card-front {
          transform: rotateY(0deg);
        }
        .card-back {
          transform: rotateY(180deg);
          background: rgba(255, 255, 255, 0.08);
          border-color: var(--mood-primary);
        }
        .music-3d-note {
          font-size: 6.5rem;
          filter: drop-shadow(0 0 20px var(--mood-glow));
          animation: pulseNote 2s ease-in-out infinite;
        }
        
        @keyframes float3D {
          0%, 100% { transform: translateY(0) rotateX(8deg); }
          50% { transform: translateY(-15px) rotateX(-8deg); }
        }
        @keyframes rotate3D {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        @keyframes pulseNote {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 20px var(--mood-glow)); }
          50% { transform: scale(1.1); filter: drop-shadow(0 0 35px var(--mood-glow)); }
        }

        /* Visualizer Selector Buttons */
        .visualizer-selector-row {
          display: flex;
          gap: 8px;
          margin-top: 15px;
        }
        .viz-btn {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          padding: 6px 12px;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border-glass);
          border-radius: 20px;
          cursor: pointer;
          color: var(--text-dim);
          transition: var(--transition-fast);
        }
        .viz-btn:hover, .viz-btn.active {
          color: white;
          border-color: var(--mood-primary);
          background: rgba(255,255,255,0.08);
        }

        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        @media (max-width: 991px) {
          .player-body {
            grid-template-columns: 1fr;
            grid-template-rows: auto 1fr;
            gap: 20px;
            padding: 20px;
            overflow-y: auto;
          }
          .player-right-pane {
            border-left: none;
            padding-left: 0;
            border-top: 1px solid var(--border-glass);
            padding-top: 20px;
            min-height: 350px;
          }
          .lyrics-scroller {
            padding: 40px 0;
          }
          .lyric-line {
            font-size: 1.35rem;
          }
          .player-header {
            padding: 16px 20px;
          }
        }
      `}</style>

      <div className="full-player-overlay">
        {/* Background Particles Simulation */}
        <canvas className="player-particles" />

        {/* Fullscreen Video Background */}
        {currentCover.videoUrl && (
          <video
            ref={videoRef}
            src={currentCover.videoUrl}
            muted
            loop
            autoPlay
            playsInline
            className="player-video-background"
          />
        )}
        <div className="player-video-overlay" />

        {/* Header */}
        <header className="player-header">
          <div className="player-header-title">
            <Radio size={14} className="neon-text-glow" /> 
            Now Playing Cover — <span>#{currentCover.mood}</span>
          </div>
          <button 
            className="player-close-btn"
            onClick={() => setShowFullPlayer(false)}
          >
            <Minimize2 size={18} />
          </button>
        </header>

        {/* Player Layout */}
        <div className="player-body">
          {/* Left Panel: Record & Audio Controllers */}
          <div className="player-left-pane">
            <div className="visualizer-container">
              {/* Spinning record cover art in the center */}
              <div 
                className="large-album-art"
                style={{ background: currentCover.coverImage }}
              >
                🎤
              </div>
              
              {/* Web Audio Canvas visualizer wrapped around the record */}
              <Visualizer type={visualizerType} />
            </div>

            {/* Song Text info */}
            <div className="song-details-pane">
              <h2 className="large-song-title">{currentCover.title}</h2>
              <p className="large-song-artist">Cover by Hak Yany</p>
              
              {/* Visualizer Type Selector */}
              <div className="visualizer-selector-row">
                <button 
                  className={`viz-btn ${visualizerType === 'circular' ? 'active' : ''}`}
                  onClick={() => setVisualizerType('circular')}
                >
                  Orb
                </button>
                <button 
                  className={`viz-btn ${visualizerType === 'wave' ? 'active' : ''}`}
                  onClick={() => setVisualizerType('wave')}
                >
                  Sine
                </button>
                <button 
                  className={`viz-btn ${visualizerType === 'bars' ? 'active' : ''}`}
                  onClick={() => setVisualizerType('bars')}
                >
                  Bars
                </button>
              </div>
            </div>

            {/* Timeline Progress Bar */}
            <div className="player-timeline-box">
              <input 
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleProgressChange}
                className="timeline-slider"
              />
              <div className="timeline-timer">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Control buttons */}
            <div className="playback-controls-row">
              <button className="control-cycle-btn" onClick={handlePrev}>
                <SkipForward size={22} style={{ transform: 'rotate(180deg)' }} />
              </button>
              
              <button 
                className="main-play-pause-btn"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <Pause size={28} fill="currentColor" />
                ) : (
                  <Play size={28} fill="currentColor" style={{ marginLeft: '4px' }} />
                )}
              </button>
              
              <button className="control-cycle-btn" onClick={handleNext}>
                <SkipForward size={22} />
              </button>
            </div>

            {/* Volume control */}
            <div className="volume-control-row">
              <Volume2 size={16} />
              <input 
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => changeVolume(parseFloat(e.target.value))}
                className="volume-slider"
              />
            </div>
          </div>

          {/* Right Panel: 3D Music Graphic */}
          <div className="player-right-pane 3d-music-pane">
            <div className="music-3d-card-wrapper">
              <div className="music-3d-card">
                <div className="card-face card-front">
                  <div className="music-3d-note">🎵</div>
                </div>
                <div className="card-face card-back">
                  <div className="music-3d-note">🎧</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
