import React from 'react';
import { useAudio } from '../context/AudioContext';
import { Play, Pause, Calendar, Music, Music4 } from 'lucide-react';
import type { Cover } from '../types';

export const Covers: React.FC = () => {
  const { covers, currentCover, isPlaying, playSong, togglePlay, activeMood, setMood } = useAudio();

  const moodsList: { id: 'all' | 'happy' | 'sad' | 'midnight' | 'love'; label: string }[] = [
    { id: 'all', label: 'All covers' },
    { id: 'happy', label: 'Happy vibe' },
    { id: 'sad', label: 'Sad vibe' },
    { id: 'midnight', label: 'Midnight vibe' },
    { id: 'love', label: 'Love vibe' }
  ];

  const filteredCovers = activeMood === 'all' 
    ? covers 
    : covers.filter(c => c.mood === activeMood);

  const handlePlayClick = (cover: Cover, e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentCover?.id === cover.id) {
      togglePlay();
    } else {
      playSong(cover);
    }
  };

  return (
    <>
      <style>{`
        .covers-section {
          padding: 80px 0;
          position: relative;
        }
        .mood-selector {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 40px;
          flex-wrap: wrap;
        }
        .mood-btn {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-glass);
          color: var(--text-gray);
          padding: 10px 20px;
          border-radius: 30px;
          cursor: pointer;
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: var(--transition-smooth);
        }
        .mood-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
        }
        .mood-dot-happy { background: #d4af37; }
        .mood-dot-sad { background: #5f9ea0; }
        .mood-dot-love { background: #a83c54; }
        .mood-dot-midnight { background: #5352ed; }
        .mood-btn:hover {
          color: white;
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255,255,255,0.2);
          transform: translateY(-2px);
        }
        .mood-btn.active {
          color: white;
          background: var(--mood-gradient);
          border-color: transparent;
          box-shadow: 0 8px 20px var(--mood-glow);
        }
        .covers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 30px;
          margin-top: 20px;
        }
        .cover-card {
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          cursor: pointer;
          display: flex;
          flex-direction: column;
        }
        .cover-art-wrapper {
          height: 180px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          color: white;
        }
        .cover-art-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(15,15,25,0.95) 0%, rgba(15,15,25,0.2) 70%, transparent 100%);
          z-index: 1;
        }
        .play-overlay-btn {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: var(--mood-gradient);
          color: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 2;
          box-shadow: 0 8px 20px var(--mood-glow);
          opacity: 0.9;
          transform: scale(1);
          transition: var(--transition-smooth);
        }
        .cover-card:hover .play-overlay-btn {
          transform: scale(1.1);
          opacity: 1;
          box-shadow: 0 10px 25px var(--mood-glow);
        }
        .cover-info {
          padding: 24px;
          text-align: left;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: rgba(15, 15, 25, 0.85);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          z-index: 2;
        }
        .cover-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .cover-mood-tag {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--mood-primary);
        }
        .cover-date {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          color: var(--text-dim);
        }
        .cover-title {
          font-family: var(--font-display);
          font-size: 1.35rem;
          font-weight: 700;
          color: white;
          margin-bottom: 4px;
        }
        .cover-artist {
          font-size: 0.85rem;
          color: var(--text-gray);
          margin-bottom: 16px;
        }
        .cover-story-preview {
          font-size: 0.88rem;
          line-height: 1.6;
          color: var(--text-gray);
          margin-bottom: 20px;
          border-left: 2px solid rgba(255,255,255,0.05);
          padding-left: 12px;
          font-style: italic;
        }
        .cover-card-actions {
          display: flex;
          gap: 12px;
          border-top: 1px solid var(--border-glass);
          padding-top: 16px;
          margin-top: auto;
        }
        .action-icon-btn {
          flex: 1;
          padding: 10px;
          border-radius: 10px;
          border: 1px solid var(--border-glass);
          background: rgba(255,255,255,0.03);
          color: var(--text-gray);
          font-size: 0.8rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          cursor: pointer;
          transition: var(--transition-fast);
        }
        .action-icon-btn:hover {
          color: white;
          border-color: rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.08);
        }
        .action-icon-btn.active {
          color: var(--mood-primary);
          border-color: var(--mood-primary);
          background: rgba(255,255,255,0.05);
        }
        .expanded-lyrics-container {
          background: rgba(5, 5, 8, 0.95);
          border-top: 1px solid var(--border-glass);
          padding: 20px;
          max-height: 250px;
          overflow-y: auto;
          text-align: center;
          font-size: 0.85rem;
          color: var(--text-gray);
          line-height: 1.8;
          z-index: 2;
        }
        .lyric-preview-line {
          margin-bottom: 6px;
        }
        
        /* Audio playing waves on card */
        .card-playing-indicator {
          display: flex;
          align-items: flex-end;
          gap: 3px;
          height: 14px;
        }
        .playing-bar {
          width: 2px;
          height: 100%;
          background: var(--mood-primary);
          animation: danceBar 0.8s ease infinite alternate;
        }
        .playing-bar:nth-child(2) { animation-delay: 0.2s; }
        .playing-bar:nth-child(3) { animation-delay: 0.4s; }

        @keyframes danceBar {
          0% { height: 30%; }
          100% { height: 100%; }
        }

        .no-results {
          grid-column: 1 / -1;
          padding: 60px;
          text-align: center;
          color: var(--text-dim);
          font-size: 1.1rem;
        }
      `}</style>

      <section id="covers" className="covers-section">
        <div className="container">
          <h2 className="section-title">
            My <span className="grad-text">Voice Covers</span>
          </h2>

          <div className="mood-selector">
            {moodsList.map((m) => (
              <button
                key={m.id}
                className={`mood-btn ${activeMood === m.id ? 'active' : ''}`}
                onClick={() => setMood(m.id)}
              >
                {m.id !== 'all' && (
                  <span className={`mood-dot mood-dot-${m.id}`} />
                )}
                {m.label}
              </button>
            ))}
          </div>

          {/* Songs Grid */}
          <div className="covers-grid">
            {filteredCovers.length > 0 ? (
              filteredCovers.map((cover) => {
                const isCurrent = currentCover?.id === cover.id;
                const isCardPlaying = isCurrent && isPlaying;

                return (
                  <div
                    key={cover.id}
                    className="cover-card glass-card"
                    onClick={(e) => handlePlayClick(cover, e)}
                  >
                    {/* Cover Art Box */}
                    <div
                      className="cover-art-wrapper"
                      style={{ background: cover.coverImage }}
                    >
                      <Music size={40} style={{ opacity: 0.15, zIndex: 1 }} />
                      <div className="cover-art-overlay" />
                      <button
                        className="play-overlay-btn"
                        onClick={(e) => handlePlayClick(cover, e)}
                      >
                        {isCardPlaying ? (
                          <Pause size={24} fill="currentColor" />
                        ) : (
                          <Play size={24} fill="currentColor" style={{ marginLeft: '4px' }} />
                        )}
                      </button>
                    </div>

                    {/* Card Body */}
                    <div className="cover-info">
                      <div className="cover-meta">
                        <span className="cover-mood-tag">#{cover.mood}</span>
                        <div className="cover-date">
                          <Calendar size={12} />
                          {cover.recordedDate}
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 className="cover-title">{cover.title}</h3>
                        {isCardPlaying && (
                          <div className="card-playing-indicator">
                            <div className="playing-bar" />
                            <div className="playing-bar" />
                            <div className="playing-bar" />
                          </div>
                        )}
                      </div>
                      <div className="cover-artist">Cover by Hak Yany</div>
                      
                      <p className="cover-story-preview">
                        {cover.memory}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="no-results glass-card">
                <Music4 size={32} style={{ marginBottom: '12px', opacity: 0.3 }} />
                <p>No covers found matching the #{activeMood} mood.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};
