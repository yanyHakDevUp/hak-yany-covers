import React, { useEffect, useState } from 'react';

interface Note {
  id: number;
  x: number;
  y: number;
  char: string;
  size: number;
  speed: number;
  freq: number;
  opacity: number;
}

const CHIME_PITCHES = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // C4, D4, E4, G4, A4, C5
const NOTE_CHARS = ['♫', '♪', '♩', '♬', '♭', '♮'];

export const FloatingNotes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    // Generate initial notes
    const initialNotes: Note[] = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight + window.innerHeight,
      char: NOTE_CHARS[Math.floor(Math.random() * NOTE_CHARS.length)],
      size: Math.random() * 20 + 12,
      speed: Math.random() * 0.8 + 0.3,
      freq: CHIME_PITCHES[Math.floor(Math.random() * CHIME_PITCHES.length)],
      opacity: Math.random() * 0.3 + 0.05
    }));
    setNotes(initialNotes);

    // Update notes positions loop
    let animationId: number;
    const update = () => {
      setNotes((prevNotes) =>
        prevNotes.map((note) => {
          let nextY = note.y - note.speed;
          let nextX = note.x + Math.sin(nextY / 30) * 0.4;
          
          // Recycle note when it floats off screen
          if (nextY < -50) {
            nextY = window.innerHeight + Math.random() * 100;
            nextX = Math.random() * window.innerWidth;
          }

          return { ...note, y: nextY, x: nextX };
        })
      );
      animationId = requestAnimationFrame(update);
    };

    animationId = requestAnimationFrame(update);

    // Handle screen resize
    const handleResize = () => {
      setNotes((prevNotes) =>
        prevNotes.map((note) => ({
          ...note,
          x: Math.random() * window.innerWidth
        }))
      );
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleNoteClick = (note: Note, event: React.MouseEvent) => {
    // Play chime sound using Web Audio API
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.freq, ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1000, ctx.currentTime);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.5);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.5);
    } catch (e) {
      // Audio blocked or not supported
    }

    // Add clickable splash ripple effect
    const ripple = document.createElement('div');
    ripple.className = 'note-ripple';
    ripple.style.left = `${event.clientX}px`;
    ripple.style.top = `${event.clientY}px`;
    ripple.style.setProperty('--ripple-color', 'var(--mood-primary)');
    document.body.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 1000);

    // Float this clicked note off screen faster
    setNotes((prevNotes) =>
      prevNotes.map((n) =>
        n.id === note.id
          ? { ...n, y: -100, speed: n.speed * 3 }
          : n
      )
    );
  };

  return (
    <>
      <style>{`
        .floating-notes-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }
        .interactive-note {
          position: absolute;
          cursor: pointer;
          pointer-events: auto;
          user-select: none;
          transition: transform 0.2s ease, opacity 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.4);
          text-shadow: 0 0 5px rgba(255, 255, 255, 0.1);
        }
        .interactive-note:hover {
          color: var(--mood-primary);
          text-shadow: 0 0 10px var(--mood-glow);
          transform: scale(1.4) rotate(15deg);
          opacity: 0.9 !important;
        }
        .note-ripple {
          position: fixed;
          width: 8px;
          height: 8px;
          background: transparent;
          border: 2px solid var(--ripple-color, #ff007f);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 9999;
          animation: noteRippleEffect 0.8s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
        }
        @keyframes noteRippleEffect {
          0% {
            width: 0;
            height: 0;
            opacity: 1;
          }
          100% {
            width: 80px;
            height: 80px;
            opacity: 0;
          }
        }
      `}</style>
      <div className="floating-notes-container">
        {notes.map((note) => (
          <div
            key={note.id}
            className="interactive-note"
            style={{
              left: `${note.x}px`,
              top: `${note.y}px`,
              fontSize: `${note.size}px`,
              opacity: note.opacity,
            }}
            onClick={(e) => handleNoteClick(note, e)}
          >
            {note.char}
          </div>
        ))}
      </div>
    </>
  );
};
