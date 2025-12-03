import React, { useState, useEffect } from 'react';
import { FiArrowUp } from 'react-icons/fi';
import ChatBot from './ChatBot.jsx'; // Asegúrate de la ruta correcta

const FloatingControls = () => {
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [showChatHint, setShowChatHint] = useState(false);

  useEffect(() => {
    // Lógica del scroll aislada aquí
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setShowScrollToTop(window.scrollY > 400);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const showTimer = setTimeout(() => setShowChatHint(true), 3000);
    const hideTimer = setTimeout(() => setShowChatHint(false), 33000);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="floating-buttons-container">
      {/* ChatBot */}
      <div className="chat-wrapper">
        <div className={`chat-hint-bubble ${showChatHint ? 'visible' : ''}`}>
          Hola, ¿en qué puedo ayudarte? 👋
        </div>
        <ChatBot />
      </div>

      {/* Botón Subir */}
      <button
        className={`scroll-to-top-btn ${showScrollToTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Subir"
      >
        <FiArrowUp />
      </button>
    </div>
  );
};

export default React.memo(FloatingControls);