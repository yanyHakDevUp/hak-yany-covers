import React, { useState } from 'react';
import { useAudio } from '../context/AudioContext';
import { Lock, Save, Plus, Trash2, ShieldCheck, X } from 'lucide-react';
import type { Profile } from '../types';

export const AdminDashboard: React.FC = () => {
  const { 
    profile, 
    updateProfile, 
    covers, 
    addCover, 
    deleteCover, 
    showAdmin, 
    setShowAdmin 
  } = useAudio();

  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  // Profile forms
  const [profileForm, setProfileForm] = useState<Profile>({ ...profile });

  // Song form
  const [songTitle, setSongTitle] = useState('');
  const [songArtist, setSongArtist] = useState('');
  const [songAudio, setSongAudio] = useState('');
  const [songVideo, setSongVideo] = useState('');
  const [songMood, setSongMood] = useState<'happy' | 'sad' | 'midnight' | 'love'>('midnight');
  const [songMemory, setSongMemory] = useState('');
  const [songLyrics, setSongLyrics] = useState('');
  const [songGrad, setSongGrad] = useState('linear-gradient(135deg, #a020f0 0%, #ff007f 100%)');

  const presetGradients = [
    { label: 'Cyberpunk Neon', value: 'linear-gradient(135deg, #a020f0 0%, #ff007f 100%)' },
    { label: 'Happy Sun', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { label: 'Deep Ocean', value: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
    { label: 'Midnight Glow', value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { label: 'Romantic Rose', value: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)' }
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123' || password === 'admin') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect secret passcode. Try "admin123" 🔒');
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profileForm);
    alert('Profile updated successfully! Sparkles saved ✨');
  };

  const handleAddSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!songTitle || !songArtist) {
      alert('Please enter at least a song title and original artist.');
      return;
    }

    const defaultAudio = songAudio || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3';
    const formattedLyrics = songLyrics || '[00:00.00] 🎵 (Instrumental Intro)\n[00:05.00] Hummm, singing what I feel...\n[00:10.00] ✨ (Instrumental Outro)';

    addCover({
      title: songTitle,
      originalArtist: songArtist,
      audioUrl: defaultAudio,
      videoUrl: songVideo || undefined,
      coverImage: songGrad,
      lyrics: formattedLyrics,
      memory: songMemory || 'Recorded this cover with my heart full of feelings.',
      mood: songMood
    });

    // Reset Form
    setSongTitle('');
    setSongArtist('');
    setSongAudio('');
    setSongVideo('');
    setSongMemory('');
    setSongLyrics('');
    alert('Cover uploaded to your diary memory grid! 🎙️');
  };

  if (!showAdmin) return null;

  return (
    <>
      <style>{`
        .admin-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 1050;
          background: rgba(5,5,8,0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .admin-container {
          width: 100%;
          max-width: 900px;
          max-height: 85vh;
          overflow-y: auto;
          padding: 32px;
          position: relative;
          box-shadow: 0 20px 50px rgba(0,0,0,0.6), 0 0 20px var(--mood-glow);
        }
        .close-admin-btn {
          position: absolute;
          top: 24px;
          right: 24px;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border-glass);
          color: white;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-fast);
        }
        .close-admin-btn:hover {
          background: rgba(255,255,255,0.15);
        }
        
        /* Auth form styling */
        .auth-form {
          max-width: 360px;
          margin: 40px auto;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .auth-icon {
          width: 48px;
          height: 48px;
          color: var(--mood-primary);
          margin: 0 auto;
          filter: drop-shadow(0 0 8px var(--mood-glow));
        }

        /* Dashboard panels */
        .admin-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-top: 24px;
          text-align: left;
        }
        .admin-panel-title {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1.25rem;
          margin-bottom: 20px;
          color: white;
          display: flex;
          align-items: center;
          gap: 8px;
          border-bottom: 1px solid var(--border-glass);
          padding-bottom: 10px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 16px;
        }
        .form-label {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--text-dim);
          font-weight: 600;
        }
        .gradient-selector {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 4px;
        }
        .grad-bubble {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 2px solid transparent;
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        .grad-bubble:hover {
          transform: scale(1.15);
        }
        .grad-bubble.active {
          border-color: white;
          box-shadow: 0 0 8px rgba(255,255,255,0.6);
        }

        /* Manage list */
        .admin-song-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 14px;
          background: rgba(255,255,255,0.02);
          border: 1px solid var(--border-glass);
          border-radius: 8px;
          margin-bottom: 8px;
        }
        
        @media (max-width: 768px) {
          .admin-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="admin-modal-overlay">
        <div className="admin-container glass-panel custom-scroll">
          <button className="close-admin-btn" onClick={() => setShowAdmin(false)}>
            <X size={18} />
          </button>

          {!isAuthenticated ? (
            /* Login Lockscreen */
            <form onSubmit={handleLogin} className="auth-form">
              <Lock className="auth-icon" />
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>Admin Login</h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-gray)' }}>
                This dashboard allows editing the portfolio bio cards and adding covers. Enter the secret passcode to access.
              </p>
              <input
                type="password"
                placeholder="passcode (hint: admin123)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input"
                style={{ textAlign: 'center' }}
              />
              {authError && <div style={{ fontSize: '0.8rem', color: '#ff4b2b' }}>{authError}</div>}
              <button type="submit" className="glass-button" style={{ justifyContent: 'center' }}>
                Unlock Diary
              </button>
            </form>
          ) : (
            /* Main Dashboard */
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--mood-primary)', marginBottom: '10px' }}>
                <ShieldCheck size={24} />
                <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>Admin Diary Authorized</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, textAlign: 'left', fontSize: '2rem' }}>
                Portfolio <span className="grad-text">Editor</span>
              </h2>

              <div className="admin-grid">
                {/* Panel 1: Profile Customizer */}
                <form onSubmit={handleSaveProfile} className="glass-card" style={{ padding: '24px' }}>
                  <h3 className="admin-panel-title">
                    Update Profile Vibe
                  </h3>

                  <div className="form-group">
                    <span className="form-label">Artist Name</span>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="glass-input"
                    />
                  </div>

                  <div className="form-group">
                    <span className="form-label">Avatar Image URL</span>
                    <input
                      type="text"
                      value={profileForm.avatar}
                      onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
                      className="glass-input"
                    />
                  </div>

                  <div className="form-group">
                    <span className="form-label">Intro Bio Description</span>
                    <textarea
                      value={profileForm.introBio}
                      onChange={(e) => setProfileForm({ ...profileForm, introBio: e.target.value })}
                      className="glass-input custom-scroll"
                      rows={3}
                      style={{ resize: 'none' }}
                    />
                  </div>

                  <div className="form-group">
                    <span className="form-label">Favorite Artists (influences)</span>
                    <input
                      type="text"
                      value={profileForm.favArtist}
                      onChange={(e) => setProfileForm({ ...profileForm, favArtist: e.target.value })}
                      className="glass-input"
                    />
                  </div>

                  <div className="form-group">
                    <span className="form-label">Favorite Cover Song</span>
                    <input
                      type="text"
                      value={profileForm.favSong}
                      onChange={(e) => setProfileForm({ ...profileForm, favSong: e.target.value })}
                      className="glass-input"
                    />
                  </div>

                  <div className="form-group">
                    <span className="form-label">Current Vibe Mood</span>
                    <input
                      type="text"
                      value={profileForm.currentMood}
                      onChange={(e) => setProfileForm({ ...profileForm, currentMood: e.target.value })}
                      className="glass-input"
                    />
                  </div>

                  <div className="form-group">
                    <span className="form-label">My Ultimate Dream</span>
                    <input
                      type="text"
                      value={profileForm.myDream}
                      onChange={(e) => setProfileForm({ ...profileForm, myDream: e.target.value })}
                      className="glass-input"
                    />
                  </div>

                  <button type="submit" className="glass-button" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
                    <Save size={16} /> Save Bio Vibe
                  </button>
                </form>

                {/* Panel 2: Upload Cover & Song management */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                  {/* Part A: Add New Cover */}
                  <form onSubmit={handleAddSong} className="glass-card" style={{ padding: '24px' }}>
                    <h3 className="admin-panel-title">
                      Upload New Cover Memory
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div className="form-group">
                        <span className="form-label">Song Title</span>
                        <input
                          type="text"
                          placeholder="e.g. Perfect"
                          value={songTitle}
                          onChange={(e) => setSongTitle(e.target.value)}
                          className="glass-input"
                        />
                      </div>
                      <div className="form-group">
                        <span className="form-label">Original Artist</span>
                        <input
                          type="text"
                          placeholder="e.g. Ed Sheeran"
                          value={songArtist}
                          onChange={(e) => setSongArtist(e.target.value)}
                          className="glass-input"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <span className="form-label">Audio Stream MP3 URL</span>
                      <input
                        type="text"
                        placeholder="Leave blank for test preset loop"
                        value={songAudio}
                        onChange={(e) => setSongAudio(e.target.value)}
                        className="glass-input"
                      />
                    </div>

                    <div className="form-group">
                      <span className="form-label">Video Stream MP4/MOV URL (Optional)</span>
                      <input
                        type="text"
                        placeholder="e.g. /src/assets/videos/sing.mp4"
                        value={songVideo}
                        onChange={(e) => setSongVideo(e.target.value)}
                        className="glass-input"
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '12px' }}>
                      <div className="form-group">
                        <span className="form-label">Cover Neon Color Gradient</span>
                        <div className="gradient-selector">
                          {presetGradients.map((g, idx) => (
                            <div
                              key={idx}
                              className={`grad-bubble ${songGrad === g.value ? 'active' : ''}`}
                              style={{ background: g.value }}
                              onClick={() => setSongGrad(g.value)}
                              title={g.label}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="form-group">
                        <span className="form-label">Song Vibe Mood</span>
                        <select
                          value={songMood}
                          onChange={(e) => setSongMood(e.target.value as any)}
                          className="glass-input"
                          style={{ background: '#0a0a0f', border: '1px solid var(--border-glass)', cursor: 'pointer' }}
                        >
                          <option value="happy">☀️ Happy</option>
                          <option value="sad">🌧️ Sad</option>
                          <option value="midnight">🌙 Midnight</option>
                          <option value="love">❤️ Love</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <span className="form-label">Memory Journal Story</span>
                      <textarea
                        placeholder="💭 Recorded this song at midnight because..."
                        value={songMemory}
                        onChange={(e) => setSongMemory(e.target.value)}
                        className="glass-input custom-scroll"
                        rows={2}
                        style={{ resize: 'none' }}
                      />
                    </div>

                    <div className="form-group">
                      <span className="form-label">LRC Synced Lyrics</span>
                      <textarea
                        placeholder="[00:00.00] Intro\n[00:05.00] First lyric line\n[00:10.00] Second lyric line"
                        value={songLyrics}
                        onChange={(e) => setSongLyrics(e.target.value)}
                        className="glass-input custom-scroll"
                        rows={3}
                        style={{ resize: 'none', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}
                      />
                    </div>

                    <button type="submit" className="glass-button" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
                      <Plus size={16} /> Add Cover to Diary
                    </button>
                  </form>

                  {/* Part B: Manage Covers List */}
                  <div className="glass-card" style={{ padding: '24px', flexGrow: 1, maxHeight: '250px', overflowY: 'auto' }}>
                    <h3 className="admin-panel-title">
                      Manage Uploaded Tracks
                    </h3>
                    <div className="custom-scroll">
                      {covers.map((c) => (
                        <div key={c.id} className="admin-song-item">
                          <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'white' }}>{c.title}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>by {c.originalArtist}</div>
                          </div>
                          <button
                            className="admin-toggle-btn"
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete "${c.title}" cover?`)) {
                                deleteCover(c.id);
                              }
                            }}
                            style={{ color: '#ff4b2b', border: '1px solid rgba(255, 75, 43, 0.2)' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
