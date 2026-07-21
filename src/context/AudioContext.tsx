import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { Cover, Profile } from '../types';
import { defaultCovers } from '../data/defaultCovers';
import { defaultProfile } from '../data/defaultProfile';

interface AudioContextType {
  covers: Cover[];
  profile: Profile;
  currentCover: Cover | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  activeMood: 'happy' | 'sad' | 'midnight' | 'love' | 'all';
  showAdmin: boolean;
  showFullPlayer: boolean;
  analyserNode: AnalyserNode | null;
  playSong: (cover: Cover) => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  changeVolume: (vol: number) => void;
  setMood: (mood: 'happy' | 'sad' | 'midnight' | 'love' | 'all') => void;
  updateProfile: (profile: Profile) => void;
  addCover: (cover: Omit<Cover, 'id' | 'recordedDate'> & { recordedDate?: string }) => void;
  deleteCover: (id: string) => void;
  setShowAdmin: (show: boolean) => void;
  setShowFullPlayer: (show: boolean) => void;
  parsedLyrics: { time: number; text: string }[];
  currentLyricIndex: number;
  audioRef: React.RefObject<HTMLVideoElement | null>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [covers, setCovers] = useState<Cover[]>([]);
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [currentCover, setCurrentCover] = useState<Cover | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [activeMood, setMoodState] = useState<'happy' | 'sad' | 'midnight' | 'love' | 'all'>('all');
  const [showAdmin, setShowAdmin] = useState(false);
  const [showFullPlayer, setShowFullPlayer] = useState(false);
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);

  const audioRef = useRef<HTMLVideoElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  // Parse lyrics from LRC format
  const [parsedLyrics, setParsedLyrics] = useState<{ time: number; text: string }[]>([]);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(-1);

  // Initialize and load from local storage
  useEffect(() => {
    const currentVersion = 'v8';
    const storedVersion = localStorage.getItem('sing_db_version');

    if (storedVersion !== currentVersion) {
      localStorage.removeItem('sing_covers');
      localStorage.removeItem('sing_profile');
      localStorage.setItem('sing_db_version', currentVersion);
    }

    const storedCovers = localStorage.getItem('sing_covers');
    const storedProfile = localStorage.getItem('sing_profile');

    if (storedCovers) {
      setCovers(JSON.parse(storedCovers));
    } else {
      setCovers(defaultCovers);
      localStorage.setItem('sing_covers', JSON.stringify(defaultCovers));
    }

    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    } else {
      setProfile(defaultProfile);
      localStorage.setItem('sing_profile', JSON.stringify(defaultProfile));
    }

    // Set first song as default cover (paused)
    const initialCovers = storedCovers ? JSON.parse(storedCovers) : defaultCovers;
    if (initialCovers.length > 0) {
      setCurrentCover(initialCovers[0]);
    }

    // Create HTML5 Video Element (acts as our single audio/video source)
    const video = document.createElement('video');
    video.preload = 'auto';
    video.crossOrigin = 'anonymous'; // Enable CORS for visualizer
    video.playsInline = true;
    video.loop = true;
    video.className = 'hidden-video-element';
    document.body.appendChild(video);
    audioRef.current = video;

    return () => {
      video.pause();
      video.src = '';
      if (video.parentNode === document.body) {
        document.body.removeChild(video);
      }
    };
  }, []);

  // Update audio source when song changes
  useEffect(() => {
    if (!audioRef.current || !currentCover) return;

    const wasPlaying = isPlaying;
    audioRef.current.src = currentCover.audioUrl;
    audioRef.current.load();
    
    // Reset times
    setCurrentTime(0);
    setCurrentLyricIndex(-1);

    // Sync volume
    audioRef.current.volume = volume;

    if (wasPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setupWebAudio();
          })
          .catch((err) => {
            console.warn('Playback error, waiting for user interaction:', err);
            setIsPlaying(false);
          });
      }
    } else {
      setIsPlaying(false);
    }
  }, [currentCover]);

  // Setup event listeners for audio updates
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleDurationChange = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      setCurrentLyricIndex(-1);
      // Play next song in active category if available
      playNext();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [covers, activeMood, currentCover]);

  // Sync lyrics with current time
  useEffect(() => {
    if (!currentCover) {
      setParsedLyrics([]);
      setCurrentLyricIndex(-1);
      return;
    }

    const lines = currentCover.lyrics.split('\n');
    const parsed: { time: number; text: string }[] = [];
    const timeReg = /\[(\d{2}):(\d{2})\.(\d{2})\]/;

    lines.forEach((line) => {
      const match = timeReg.exec(line);
      if (match) {
        const minutes = parseInt(match[1], 10);
        const seconds = parseInt(match[2], 10);
        const milliseconds = parseInt(match[3], 10);
        const time = minutes * 60 + seconds + milliseconds / 100.0;
        const text = line.replace(timeReg, '').trim();
        parsed.push({ time, text });
      }
    });

    // Sort lyrics by time
    parsed.sort((a, b) => a.time - b.time);
    setParsedLyrics(parsed);
  }, [currentCover]);

  // Track the active lyric line
  useEffect(() => {
    if (parsedLyrics.length === 0) return;

    let activeIndex = -1;
    for (let i = 0; i < parsedLyrics.length; i++) {
      if (currentTime >= parsedLyrics[i].time) {
        activeIndex = i;
      } else {
        break;
      }
    }
    setCurrentLyricIndex(activeIndex);
  }, [currentTime, parsedLyrics]);

  const setupWebAudio = () => {
    const audio = audioRef.current;
    if (!audio || analyserRef.current) return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      
      const source = ctx.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(ctx.destination);

      audioContextRef.current = ctx;
      analyserRef.current = analyser;
      sourceRef.current = source;
      setAnalyserNode(analyser);
    } catch (e) {
      console.warn('Could not initialize Web Audio API. Using canvas simulation.', e);
    }
  };

  const playSong = (cover: Cover) => {
    setCurrentCover(cover);
    setIsPlaying(true);
    
    // Play audio
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play()
          .then(() => {
            setupWebAudio();
            // Resume context if suspended
            if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
              audioContextRef.current.resume();
            }
          })
          .catch((err) => {
            console.error('Play request failed:', err);
          });
      }
    }, 50);
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !currentCover) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play()
        .then(() => {
          setIsPlaying(true);
          setupWebAudio();
          if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
          }
        })
        .catch((err) => {
          console.error('Play request failed:', err);
        });
    }
  };

  const playNext = () => {
    const filtered = activeMood === 'all' 
      ? covers 
      : covers.filter(c => c.mood === activeMood);
    
    if (filtered.length === 0) return;
    
    const currentIndex = filtered.findIndex(c => c.id === currentCover?.id);
    const nextIndex = (currentIndex + 1) % filtered.length;
    playSong(filtered[nextIndex]);
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const changeVolume = (vol: number) => {
    const cleanVol = Math.max(0, Math.min(1, vol));
    setVolume(cleanVol);
    if (audioRef.current) {
      audioRef.current.volume = cleanVol;
    }
  };

  const setMood = (mood: 'happy' | 'sad' | 'midnight' | 'love' | 'all') => {
    setMoodState(mood);
  };

  const updateProfile = (newProfile: Profile) => {
    setProfile(newProfile);
    localStorage.setItem('sing_profile', JSON.stringify(newProfile));
  };

  const addCover = (newCover: Omit<Cover, 'id' | 'recordedDate'> & { recordedDate?: string }) => {
    const formattedCover: Cover = {
      ...newCover,
      id: newCover.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      recordedDate: newCover.recordedDate || new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' }),
    };

    const updated = [formattedCover, ...covers];
    setCovers(updated);
    localStorage.setItem('sing_covers', JSON.stringify(updated));
    setCurrentCover(formattedCover);
  };

  const deleteCover = (id: string) => {
    const updated = covers.filter(c => c.id !== id);
    setCovers(updated);
    localStorage.setItem('sing_covers', JSON.stringify(updated));
    if (currentCover?.id === id) {
      setCurrentCover(updated.length > 0 ? updated[0] : null);
      setIsPlaying(false);
    }
  };

  return (
    <AudioContext.Provider value={{
      covers,
      profile,
      currentCover,
      isPlaying,
      currentTime,
      duration,
      volume,
      activeMood,
      showAdmin,
      showFullPlayer,
      analyserNode,
      playSong,
      togglePlay,
      seek,
      changeVolume,
      setMood,
      updateProfile,
      addCover,
      deleteCover,
      setShowAdmin,
      setShowFullPlayer,
      parsedLyrics,
      currentLyricIndex,
      audioRef
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
