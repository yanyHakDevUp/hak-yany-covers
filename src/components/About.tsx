import React from 'react';
import { useAudio } from '../context/AudioContext';
import { Music, Mic, Moon, Target } from 'lucide-react';

export const About: React.FC = () => {
  const { profile } = useAudio();

  return (
    <>
      <style>{`
        .about-section {
          padding: 80px 0;
          position: relative;
          background: linear-gradient(to bottom, transparent, rgba(10,10,18,0.4), transparent);
        }
        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          margin-top: 40px;
        }
        .story-panel {
          text-align: left;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .story-quote {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: 2.2rem;
          color: white;
          line-height: 1.3;
          margin-bottom: 2rem;
          position: relative;
          font-weight: 500;
        }
        .story-quote::before {
          content: '"';
          position: absolute;
          left: -24px;
          top: -10px;
          font-size: 5rem;
          color: var(--mood-primary);
          opacity: 0.2;
          font-family: var(--font-serif);
        }
        .story-text {
          color: var(--text-gray);
          line-height: 1.8;
          font-size: 1.05rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .vibe-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .vibe-card {
          padding: 24px;
          text-align: left;
          position: relative;
          overflow: hidden;
          min-height: 190px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-radius: 20px;
        }
        .vibe-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 100%);
          z-index: 0;
        }
        .vibe-icon-wrapper {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border-glass);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--mood-primary);
          margin-bottom: 16px;
          z-index: 1;
          transition: var(--transition-smooth);
        }
        .vibe-card:hover .vibe-icon-wrapper {
          background: var(--mood-gradient);
          color: white;
          transform: rotate(10deg) scale(1.1);
        }
        .vibe-card-title {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1.1rem;
          margin-bottom: 8px;
          z-index: 1;
          color: white;
        }
        .vibe-card-value {
          font-size: 0.9rem;
          color: var(--text-gray);
          line-height: 1.5;
          z-index: 1;
        }
        .vibe-card-tag {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--mood-primary);
          font-weight: 700;
          margin-top: 10px;
          z-index: 1;
        }

        @media (max-width: 991px) {
          .about-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .story-quote {
            font-size: 1.8rem;
          }
        }
        @media (max-width: 480px) {
          .vibe-grid {
            grid-template-columns: 1fr;
          }
          .vibe-card {
            min-height: auto;
          }
        }
      `}</style>

      <section id="about" className="about-section">
        <div className="container">
          <h2 className="section-title">
            Behind <span className="grad-text">The Voice</span>
          </h2>
          
          <div className="about-grid">
            <div className="story-panel">
              <div className="story-quote">
                "Honestly, I sing because yelling at my wall wasn't getting me any streams."
              </div>
              <div className="story-text">
                <p>
                  Welcome to my bedroom diary, aka my acoustic cave of feelings. Since I was a kid, singing has been my ultimate escape from reality (and from doing chores). Whenever life gets too chaotic, too quiet, or my neighbors are making too much noise, I just hit record.
                </p>
                <p>
                  Every cover here represents a moment in time—a specific mood, a late-night brainrot session, or a very emotional shower. I definitely don't aim for auto-tuned perfection; I aim for raw, uncut honesty (and hoping my mic doesn't catch my heavy breathing).
                </p>
                <p>
                  So thank you for stepping into my chaotic world and listening to my bedroom sessions. Grab your headphones, lock your door, and let's get emotional together. No judgment allowed!
                </p>
              </div>
            </div>

            <div className="vibe-grid">
              {/* Card 1: Favorite Songs */}
              <div className="vibe-card glass-card">
                <div className="vibe-icon-wrapper">
                  <Music size={20} />
                </div>
                <div>
                  <h3 className="vibe-card-title">Favorite Artists</h3>
                  <p className="vibe-card-value">{profile.favArtist}</p>
                  <div className="vibe-card-tag">Influences</div>
                </div>
              </div>

              {/* Card 2: Singing Style */}
              <div className="vibe-card glass-card">
                <div className="vibe-icon-wrapper">
                  <Mic size={20} />
                </div>
                <div>
                  <h3 className="vibe-card-title">Singing Style</h3>
                  <p className="vibe-card-value">{profile.singingStyle}</p>
                  <div className="vibe-card-tag">My Sound</div>
                </div>
              </div>

              {/* Card 3: My Mood */}
              <div className="vibe-card glass-card">
                <div className="vibe-icon-wrapper">
                  <Moon size={20} />
                </div>
                <div>
                  <h3 className="vibe-card-title">Current Mood</h3>
                  <p className="vibe-card-value">{profile.currentMood}</p>
                  <div className="vibe-card-tag">Right Now</div>
                </div>
              </div>

              {/* Card 4: My Dream */}
              <div className="vibe-card glass-card">
                <div className="vibe-icon-wrapper">
                  <Target size={20} />
                </div>
                <div>
                  <h3 className="vibe-card-title">My Dream</h3>
                  <p className="vibe-card-value">{profile.myDream}</p>
                  <div className="vibe-card-tag">Ambition</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
