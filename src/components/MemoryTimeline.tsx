import React from 'react';
import { useAudio } from '../context/AudioContext';
import { Calendar } from 'lucide-react';

export const MemoryTimeline: React.FC = () => {
  const { covers, playSong } = useAudio();

  // Sort covers chronologically or use standard sorted records
  // For polaroid aesthetics, we can display them with interesting offsets and rotations
  const polaroidRotations = ['rotate-1', 'rotate-neg-2', 'rotate-2', 'rotate-neg-1'];

  return (
    <>
      <style>{`
        .memories-section {
          padding: 80px 0;
          position: relative;
          background: linear-gradient(to bottom, transparent, rgba(5,5,8,0.6));
        }
        .memories-intro {
          max-width: 600px;
          margin: 0 auto 50px;
          text-align: center;
        }
        .memories-intro p {
          color: var(--text-gray);
          line-height: 1.6;
        }
        .timeline-container {
          position: relative;
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px 0;
        }
        /* Vertical center line */
        .timeline-line {
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(to bottom, transparent, var(--mood-primary), var(--mood-secondary), transparent);
          transform: translateX(-50%);
        }
        .timeline-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 60px;
          width: 100%;
          position: relative;
        }
        .timeline-item:nth-child(even) {
          flex-direction: row-reverse;
        }
        .timeline-badge {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--bg-dark);
          border: 3px solid var(--mood-primary);
          z-index: 5;
          box-shadow: 0 0 10px var(--mood-glow);
        }
        .timeline-panel {
          width: 45%;
          position: relative;
        }
        
        /* Gen Z Polaroid Scrapbook Styling */
        .polaroid-frame {
          background: #ffffff;
          padding: 16px 16px 28px 16px;
          border-radius: 4px;
          box-shadow: 0 15px 35px rgba(0,0,0,0.4), 0 5px 15px rgba(0,0,0,0.2);
          transition: var(--transition-smooth);
          cursor: pointer;
          color: #121214;
        }
        .polaroid-frame:hover {
          transform: scale(1.03) translateY(-8px) !important;
          box-shadow: 0 25px 45px rgba(0,0,0,0.5), 0 0 20px var(--mood-glow);
        }
        .polaroid-img-box {
          height: 200px;
          width: 100%;
          background: #1e1e24;
          border-radius: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        .polaroid-img-placeholder {
          font-size: 2.5rem;
          opacity: 0.8;
          transition: transform 0.4s ease;
        }
        .polaroid-frame:hover .polaroid-img-placeholder {
          transform: scale(1.15) rotate(5deg);
        }
        .polaroid-caption {
          margin-top: 16px;
          text-align: left;
        }
        .polaroid-date {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: 0.8rem;
          color: #707080;
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 8px;
        }
        .polaroid-title {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.15rem;
          color: #0c0c0e;
          letter-spacing: -0.5px;
          margin-bottom: 6px;
          line-height: 1.2;
        }
        .polaroid-commentary {
          font-family: var(--font-sans);
          font-size: 0.82rem;
          line-height: 1.5;
          color: #4a4a58;
        }
        .polaroid-tape {
          position: absolute;
          top: -15px;
          left: 50%;
          transform: translateX(-50%) rotate(-4deg);
          width: 100px;
          height: 30px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(2px);
          border-left: 1px dashed rgba(255,255,255,0.2);
          border-right: 1px dashed rgba(255,255,255,0.2);
          z-index: 10;
        }
        
        /* Rotations */
        .rotate-1 { transform: rotate(1.5deg); }
        .rotate-2 { transform: rotate(3deg); }
        .rotate-neg-1 { transform: rotate(-1.5deg); }
        .rotate-neg-2 { transform: rotate(-3deg); }

        @media (max-width: 768px) {
          .timeline-line {
            left: 20px;
          }
          .timeline-badge {
            left: 20px;
          }
          .timeline-item {
            flex-direction: column !important;
            align-items: flex-start;
            margin-bottom: 40px;
          }
          .timeline-panel {
            width: calc(100% - 40px);
            margin-left: 40px;
          }
          .polaroid-tape {
            left: 40px;
            transform: rotate(-3deg);
          }
        }
      `}</style>

      <section id="memories" className="memories-section">
        <div className="container">
          <div className="memories-intro">
            <h2 className="section-title" style={{ textAlign: 'center' }}>
              Music <span className="grad-text">Diary & Memories</span>
            </h2>
            <p>
              Every song carries a piece of my heart and a moment in time. Here is the scrapbook of my musical growth, feelings, and late-night recordings.
            </p>
          </div>

          <div className="timeline-container">
            <div className="timeline-line" />
            
            {covers.map((cover, index) => {
              const rotation = polaroidRotations[index % polaroidRotations.length];
              
              return (
                <div key={cover.id} className="timeline-item">
                  <div className="timeline-badge" />
                  
                  <div className="timeline-panel">
                    <div className="polaroid-tape" />
                    <div 
                      className={`polaroid-frame ${rotation}`}
                      onClick={() => playSong(cover)}
                      title="Click to play this cover memory"
                    >
                      {/* Polaroid Art Box */}
                      <div 
                        className="polaroid-img-box"
                        style={{ background: cover.coverImage }}
                      >
                        <div className="polaroid-img-placeholder">
                          {cover.mood === 'happy' ? '☀️' : cover.mood === 'sad' ? '🌧️' : cover.mood === 'love' ? '❤️' : '🌙'}
                        </div>
                      </div>

                      {/* Polaroid Caption */}
                      <div className="polaroid-caption">
                        <div className="polaroid-date">
                          <Calendar size={12} />
                          Recorded: {cover.recordedDate}
                        </div>
                        <h3 className="polaroid-title">
                          "{cover.title}" 
                          <span style={{ fontSize: '0.8rem', fontWeight: '400', fontStyle: 'italic', color: '#777' }}> (orig. {cover.originalArtist})</span>
                        </h3>
                        <p className="polaroid-commentary">
                          {cover.memory}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};
