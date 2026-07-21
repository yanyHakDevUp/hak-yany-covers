import React, { useEffect, useState } from 'react';
import { useAudio } from '../context/AudioContext';
import { Music, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { showAdmin, setShowAdmin, activeMood, profile } = useAudio();
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll spy to highlight active menu item
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = ['home', 'covers', 'about'];
      const scrollPosition = window.scrollY + 120; // offset for navbar height

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setShowAdmin(false); // Close admin when navigating to sections
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const offset = 80; // navbar height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  return (
    <>
      <style>{`
        .navbar-floating {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: 90%;
          max-width: 1100px;
          z-index: 1000;
          padding: 12px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 40px;
          transition: var(--transition-smooth);
        }
        .navbar-scrolled {
          background: rgba(10, 10, 18, 0.75);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid var(--border-glass);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 10px var(--mood-glow);
          top: 10px;
          padding: 10px 24px;
        }
        .navbar-logo {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.25rem;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          letter-spacing: -0.5px;
        }
        .navbar-logo span {
          font-size: 0.9rem;
          font-weight: 400;
          background: rgba(255, 255, 255, 0.08);
          padding: 4px 10px;
          border-radius: 20px;
          border: 1px solid var(--border-glass);
        }
        .navbar-links {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .nav-item {
          background: transparent;
          border: none;
          color: var(--text-gray);
          padding: 8px 16px;
          font-family: var(--font-sans);
          font-weight: 500;
          font-size: 0.95rem;
          cursor: pointer;
          border-radius: 20px;
          transition: var(--transition-fast);
          position: relative;
        }
        .nav-item:hover {
          color: var(--text-white);
        }
        .nav-item.active {
          color: var(--text-white);
          background: rgba(255, 255, 255, 0.06);
          box-shadow: inset 0 0 1px 1px var(--border-glass);
        }
        .nav-item.active::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--mood-primary);
          box-shadow: 0 0 8px var(--mood-primary);
        }
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .admin-toggle-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid var(--border-glass);
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-gray);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-fast);
        }
        .admin-toggle-btn:hover, .admin-toggle-btn.active {
          color: var(--mood-primary);
          border-color: var(--mood-primary);
          box-shadow: 0 0 10px var(--mood-glow);
          background: rgba(255, 255, 255, 0.1);
        }
        .menu-toggle-btn {
          display: none;
          background: transparent;
          border: none;
          color: white;
          cursor: pointer;
        }
        
        /* Mobile menu overlays */
        .mobile-nav-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: #0b0b0f;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          z-index: 1010;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 24px;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .mobile-nav-overlay.open {
          opacity: 1;
          pointer-events: auto;
        }
        .mobile-nav-link {
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-gray);
          background: transparent;
          border: none;
          cursor: pointer;
          transition: var(--transition-fast);
        }
        .mobile-nav-link:hover, .mobile-nav-link.active {
          color: white;
          transform: scale(1.1);
          text-shadow: 0 0 15px var(--mood-glow);
        }

        @media (max-width: 768px) {
          .navbar-links {
            display: none;
          }
          .menu-toggle-btn {
            display: block;
          }
          .navbar-floating {
            width: 95%;
            padding: 10px 16px;
          }
        }
      `}</style>

      <nav className={`navbar-floating ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="navbar-logo" onClick={() => scrollToSection('home')}>
          <Music size={20} className="grad-text" />
          {profile.name}
          <span>{activeMood !== 'all' ? activeMood : 'all moods'}</span>
        </div>

        <div className="navbar-links">
          <button 
            className={`nav-item ${activeSection === 'home' && !showAdmin ? 'active' : ''}`}
            onClick={() => scrollToSection('home')}
          >
            Home
          </button>
          <button 
            className={`nav-item ${activeSection === 'covers' && !showAdmin ? 'active' : ''}`}
            onClick={() => scrollToSection('covers')}
          >
            Covers
          </button>
          <button 
            className={`nav-item ${activeSection === 'about' && !showAdmin ? 'active' : ''}`}
            onClick={() => scrollToSection('about')}
          >
            About
          </button>
        </div>

        <div className="nav-actions">
          <button 
            className="menu-toggle-btn"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      <div className={`mobile-nav-overlay ${mobileMenuOpen ? 'open' : ''}`}>
        <button 
          style={{ position: 'absolute', top: '30px', right: '30px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <X size={32} />
        </button>
        
        <button 
          className={`mobile-nav-link ${activeSection === 'home' && !showAdmin ? 'active' : ''}`}
          onClick={() => scrollToSection('home')}
        >
          Home
        </button>
        <button 
          className={`mobile-nav-link ${activeSection === 'covers' && !showAdmin ? 'active' : ''}`}
          onClick={() => scrollToSection('covers')}
        >
          Covers
        </button>
        <button 
          className={`mobile-nav-link ${activeSection === 'about' && !showAdmin ? 'active' : ''}`}
          onClick={() => scrollToSection('about')}
        >
          About Me
        </button>
      </div>
    </>
  );
};
