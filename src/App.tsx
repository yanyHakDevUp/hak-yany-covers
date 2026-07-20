import React, { useState, useEffect, useRef } from 'react';
import { AudioProvider, useAudio } from './context/AudioContext';
import { Loader } from './components/Loader';
import { Navbar } from './components/Navbar';
import { FloatingNotes } from './components/FloatingNotes';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Covers } from './components/Covers';
import { SpotifyWidget } from './components/SpotifyWidget';
import { Player } from './components/Player';
import { AdminDashboard } from './components/AdminDashboard';
import { Mail, Heart, Sparkles } from 'lucide-react';
import './App.css';

const AppContent: React.FC = () => {
  const { currentCover, profile } = useAudio();
  const [loading, setLoading] = useState(true);
  const [easterEggActive, setEasterEggActive] = useState(false);
  const keysPressed = useRef<string[]>([]);

  // Keyboard Easter egg listener for spelling "yany"
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.push(e.key.toLowerCase());
      if (keysPressed.current.length > 4) {
        keysPressed.current.shift();
      }
      
      const word = keysPressed.current.join('');
      if (word === 'yany') {
        setEasterEggActive(true);
        playEasterMelody();
        setTimeout(() => setEasterEggActive(false), 5000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const playEasterMelody = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      // Arpeggiated C major 9 chord
      const notes = [261.63, 329.63, 392.00, 493.88, 587.33, 783.99]; // C4, E4, G4, B4, D5, G5
      
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = 'triangle'; // Warmer hum tone
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);

        gain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.12 + 1.2);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 1.2);
      });
    } catch (e) {
      // Audio context blocked
    }
  };

  if (loading) {
    return <Loader onComplete={() => setLoading(false)} />;
  }

  return (
    <div 
      className="app-container" 
      data-theme={currentCover ? currentCover.mood : 'all'}
    >
      {/* Decorative Interactive Floating Notes */}
      <FloatingNotes />

      {/* Spied Glassmorphic Sticky Header */}
      <Navbar />

      {/* Main Sections */}
      <main>
        {/* Intro Hero Section */}
        <Hero />

        {/* About Diary Section */}
        <About />

        {/* Covers Grid Section */}
        <Covers />
      </main>

      {/* Socials / Let's Connect Footer */}
      <footer className="footer-section">
        <div className="container">
          <div className="footer-content">
            <h2 className="footer-title">
              Let's <span className="grad-text">Connect 💌</span>
            </h2>
            
            <p className="footer-subtitle" style={{ maxWidth: '600px', margin: '0 auto 24px auto', fontSize: '0.95rem', color: 'var(--text-gray)', lineHeight: '1.6' }}>
              I am not a singer but I can sing. You can hire me haha, or contact me for coding and software development! XD
            </p>
            
            <div className="social-links-row">
              <a href={profile.tiktok} target="_blank" rel="noopener noreferrer" className="social-pill">
                <span className="social-icon">🎵</span> TikTok
              </a>
              <a href={profile.instagram} target="_blank" rel="noopener noreferrer" className="social-pill">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="social-icon"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg> Instagram
              </a>
              <a href={profile.youtube} target="_blank" rel="noopener noreferrer" className="social-pill">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="social-icon"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/><polygon points="10 15 15 12 10 9"/></svg> YouTube
              </a>
              <a href={`mailto:${profile.email}`} className="social-pill">
                <Mail size={18} className="social-icon" /> Email
              </a>
            </div>

            <div className="footer-credits">
              <p>Made with <Heart size={12} fill="var(--mood-primary)" color="transparent" style={{ display: 'inline-block', verticalAlign: 'middle', margin: '0 4px' }} /> by {profile.name} © {new Date().getFullYear()}</p>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.7rem', marginTop: '6px' }}>Try typing "yany" on your keyboard for a hidden diary melody! 🔑</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Mini Widget on Desktop/Mobile */}
      <SpotifyWidget />

      {/* Screen Player Synced Lyrics & Custom Visualizer */}
      <Player />

      {/* simulated settings profile admin dashboard */}
      <AdminDashboard />

      {/* Secret Easter Egg UI Notification */}
      {easterEggActive && (
        <div className="easter-egg-notification">
          <Sparkles size={18} style={{ color: 'gold' }} />
          <div>
            <strong style={{ display: 'block', fontSize: '0.85rem' }}>Yany's Secret Chord Unlocked 🔑</strong>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-gray)' }}>You played the hidden melody. Welcome to my diary.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AudioProvider>
      <AppContent />
    </AudioProvider>
  );
}
