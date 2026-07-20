import React from 'react';
import { useAudio } from '../context/AudioContext';
import { Play, User, Sparkles, Heart } from 'lucide-react';
import { Visualizer } from './Visualizer';

export const Hero: React.FC = () => {
  const { profile, covers, playSong } = useAudio();

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Find the cover for currently favorite song if available
  const favCover = covers.find(
    (c) => c.title.toLowerCase() === profile.favSong.toLowerCase()
  ) || covers[0];

  return (
    <>
      <style>{`
        .hero-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          position: relative;
          padding-top: 100px;
          overflow: hidden;
        }
        .hero-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 40px;
          align-items: center;
          width: 100%;
        }
        .hero-content {
          z-index: 10;
          text-align: left;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border-glass);
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--mood-primary);
          margin-bottom: 24px;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .hero-title {
          font-family: var(--font-display);
          font-size: clamp(3rem, 5vw, 4.5rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -2px;
          margin-bottom: 20px;
        }
        .hero-desc {
          font-size: clamp(1rem, 2vw, 1.2rem);
          color: var(--text-gray);
          line-height: 1.6;
          margin-bottom: 36px;
          max-width: 540px;
        }
        .hero-buttons {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 48px;
        }
        .hero-visuals {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 5;
        }
        .profile-card-glow {
          position: relative;
          width: 320px;
          height: 380px;
          border-radius: 24px;
          padding: 4px;
          background: var(--mood-gradient);
          box-shadow: 0 20px 50px rgba(0,0,0,0.5), 0 0 25px var(--mood-glow);
          animation: float 6s ease-in-out infinite;
        }
        .profile-img-container {
          width: 100%;
          height: 100%;
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          background: #111;
        }
        .profile-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s ease;
        }
        .profile-card-glow:hover .profile-img {
          transform: scale(1.08);
        }
        .profile-overlay-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(7,7,10,0.9) 0%, rgba(7,7,10,0.2) 60%, transparent 100%);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 24px;
          text-align: left;
        }
        .profile-name {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 4px;
        }
        .profile-vibe {
          font-size: 0.85rem;
          color: var(--mood-primary);
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* Spotify Live status widget */
        .spotify-live-widget {
          margin-top: 20px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 16px;
          max-width: 480px;
          cursor: pointer;
        }
        .fav-album-art {
          width: 56px;
          height: 56px;
          border-radius: 8px;
          background: var(--mood-gradient);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          position: relative;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }
        .pulse-ring {
          position: absolute;
          inset: -4px;
          border-radius: 12px;
          border: 1px solid var(--mood-primary);
          animation: pulseGlow 2s infinite ease-out;
        }
        .widget-text-container {
          text-align: left;
          flex-grow: 1;
        }
        .widget-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--text-dim);
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .widget-song-title {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1.05rem;
          color: white;
        }
        .widget-song-artist {
          font-size: 0.8rem;
          color: var(--text-gray);
        }

        /* Waveform simulation on hero */
        .hero-waveform-container {
          width: 100%;
          height: 60px;
          margin-top: 10px;
          opacity: 0.7;
        }

        @keyframes pulseGlow {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.2); opacity: 0; }
        }

        @media (max-width: 991px) {
          .hero-grid {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 48px;
          }
          .hero-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .hero-desc {
            margin-left: auto;
            margin-right: auto;
          }
          .hero-buttons {
            justify-content: center;
          }
          .spotify-live-widget {
            margin-left: auto;
            margin-right: auto;
          }
        }
      `}</style>
      
      <section id="home" className="hero-section">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <div className="hero-badge">
                <Sparkles size={12} />
                Gen Z Artist Portfolio
              </div>
              <h1 className="hero-title">
                Hi, I'm <span className="grad-text">{profile.name}</span> 🎤 <br />
                I sing what I <span className="neon-text-glow">feel.</span>
              </h1>
              <p className="hero-desc">
                {profile.introBio}
              </p>
              
              <div className="hero-buttons">
                <button 
                  className="glass-button"
                  onClick={() => handleScrollTo('covers')}
                >
                  <Play size={16} fill="currentColor" /> Listen to My Covers
                </button>
                <button 
                  className="glass-button-secondary"
                  onClick={() => handleScrollTo('about')}
                >
                  <User size={16} /> About Me
                </button>
              </div>

              {/* Current favorite song widget */}
              {favCover && (
                <div 
                  className="spotify-live-widget glass-card"
                  onClick={() => playSong(favCover)}
                  title="Click to play my favorite song!"
                >
                  <div className="fav-album-art" style={{ background: favCover.coverImage }}>
                    <div className="pulse-ring" />
                    🎧
                  </div>
                  <div className="widget-text-container">
                    <div className="widget-label">
                      <Heart size={10} fill="var(--mood-primary)" color="transparent" /> Current favorite song
                    </div>
                    <div className="widget-song-title">{favCover.title}</div>
                    <div className="widget-song-artist">Originally by {favCover.originalArtist}</div>
                    <div className="hero-waveform-container">
                      <Visualizer type="wave" />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="hero-visuals">
              <div className="profile-card-glow">
                <div className="profile-img-container">
                  <img 
                    src={profile.avatar} 
                    alt={profile.name} 
                    className="profile-img" 
                  />
                  <div className="profile-overlay-gradient">
                    <div className="profile-name">{profile.name}</div>
                    <div className="profile-vibe">
                      <span>🎧</span> {profile.singingStyle.split('/')[0].trim()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
