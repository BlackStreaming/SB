import React, { useState, useRef, useEffect } from 'react';
import { FiMessageSquare, FiX, FiSend, FiMinimize2, FiHelpCircle } from 'react-icons/fi';
import apiClient from '/src/services/apiClient.js';

const styles = {
  container: {
    position: 'relative', 
    fontFamily: "'Inter', sans-serif",
    zIndex: 1000,
  },
  toggleButton: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Gradiente mejorado
    color: 'white',
    border: 'none',
    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.5)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.3s ease, box-shadow 0.3s',
  },
  window: {
    position: 'absolute',
    bottom: '80px', 
    right: '0',
    width: '360px',
    height: '550px',
    backgroundColor: '#151515', // Fondo un poco más oscuro
    borderRadius: '20px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    border: '1px solid #333',
    animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)', // Animación más suave
    transformOrigin: 'bottom right',
  },
  header: {
    padding: '18px 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: '700',
    fontSize: '1.05rem',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
    zIndex: 10,
  },
  messagesArea: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    backgroundColor: '#0c0c0c',
    backgroundImage: 'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #0c0c0c 50%)',
    scrollbarWidth: 'thin',
    scrollbarColor: '#333 #0c0c0c',
  },
  inputArea: {
    padding: '16px',
    borderTop: '1px solid #2a2a2a',
    backgroundColor: '#151515',
    display: 'flex',
    gap: '12px',
    flexDirection: 'column', // Cambiado para incluir chips
  },
  inputRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    borderRadius: '24px',
    border: '1px solid #333',
    backgroundColor: '#252525',
    color: 'white',
    outline: 'none',
    fontSize: '0.95rem',
    transition: 'border-color 0.2s',
  },
  sendButton: {
    background: '#667eea',
    borderRadius: '50%',
    width: '44px',
    height: '44px',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.2s, background 0.2s',
    flexShrink: 0,
  },
  messageBubble: {
    maxWidth: '85%',
    padding: '12px 16px',
    borderRadius: '16px',
    fontSize: '0.95rem',
    lineHeight: '1.5',
    wordWrap: 'break-word',
    whiteSpace: 'pre-line',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#252525',
    color: '#e0e0e0',
    borderBottomLeftRadius: '4px',
    border: '1px solid #333',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#667eea', // Unificado con el tema
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    borderBottomRightRadius: '4px',
  },
  typing: {
    fontSize: '0.8rem',
    color: '#888',
    marginLeft: '14px',
    marginBottom: '8px',
    fontStyle: 'italic',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  // Estilos para las sugerencias (Chips)
  chipsContainer: {
    display: 'flex',
    gap: '8px',
    overflowX: 'auto',
    paddingBottom: '8px',
    scrollbarWidth: 'none', // Ocultar scrollbar
    msOverflowStyle: 'none',
  },
  chip: {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    border: '1px solid rgba(102, 126, 234, 0.3)',
    color: '#a3bffa',
    padding: '6px 12px',
    borderRadius: '16px',
    fontSize: '0.8rem',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s',
    fontWeight: '500',
  },
  headerBtn: {
    background: 'rgba(255,255,255,0.15)', 
    border: 'none', 
    color: 'white', 
    cursor: 'pointer', 
    padding: '6px', 
    borderRadius: '50%',
    display: 'flex', 
    alignItems: 'center',
    transition: 'background 0.2s',
  }
};

const SUGGESTIONS = [
  { label: '🚀 Activar Cuenta', text: 'Quiero activar mi cuenta' },
  { label: '💰 Recargar Saldo', text: 'Como recargar saldo' },
  { label: '📺 Precios', text: 'Precios de productos' },
  { label: '📦 Mis Pedidos', text: 'Ver mis pedidos' },
  { label: '🆘 Soporte', text: 'Ayuda con un problema' },
];

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: '¡Hola! 👋 Soy el asistente virtual de BlackStreaming.\n\nEstoy aquí para ayudarte a activar cuentas, recargar saldo o resolver dudas.', 
      sender: 'bot' 
    }
  ]);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 300);
    }
  }, [isOpen]);

  const toggleChat = () => setIsOpen(!isOpen);

  const formatMessage = (text) => {
    if (!text) return '';
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index} style={{ color: '#fff', fontWeight: '700' }}>{part}</strong>;
      }
      return part;
    });
  };

  const processMessage = async (textToSend) => {
    const userMsg = { id: Date.now(), text: textToSend, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await apiClient.post('/chat', { message: textToSend });
      const botResponse = response.data.reply;
      setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, sender: 'bot' }]);
    } catch (error) {
      console.error("Error en ChatBot:", error);
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: "⚠️ Lo siento, estoy teniendo problemas de conexión. Por favor intenta recargar la página.", 
        sender: 'bot' 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const text = input;
    setInput('');
    await processMessage(text);
  };

  const handleChipClick = (text) => {
    processMessage(text);
  };

  return (
    <div style={styles.container}>
      {isOpen && (
        <div style={styles.window} className="chat-window-anim">
          <div style={styles.header}>
            <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
              <FiHelpCircle size={22} />
              <span>Chat Bot BlackStreaming beta</span>
            </div>
            <button 
              onClick={toggleChat} 
              style={styles.headerBtn}
              className="hover-btn"
              aria-label="Minimizar chat"
            >
              <FiMinimize2 size={18} />
            </button>
          </div>

          <div style={styles.messagesArea}>
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                style={{
                  ...styles.messageBubble,
                  ...(msg.sender === 'bot' ? styles.botMessage : styles.userMessage)
                }}
              >
                {formatMessage(msg.text)}
              </div>
            ))}
            
            {isTyping && (
              <div style={styles.typing}>
                <span>Pensando</span>
                <span className="dot-anim">.</span><span className="dot-anim">.</span><span className="dot-anim">.</span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <div style={styles.inputArea}>
            {/* Chips de Sugerencias */}
            <div style={styles.chipsContainer} className="hide-scrollbar">
              {SUGGESTIONS.map((chip, idx) => (
                <button 
                  key={idx} 
                  style={styles.chip} 
                  onClick={() => handleChipClick(chip.text)}
                  className="chip-hover"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            <form style={styles.inputRow} onSubmit={handleSend}>
              <input 
                ref={inputRef}
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe aquí..." 
                style={styles.input}
                className="input-focus"
              />
              <button type="submit" style={styles.sendButton} disabled={!input.trim()} className="send-hover">
                <FiSend size={18} />
              </button>
            </form>
          </div>
        </div>
      )}

      <button 
        style={{
          ...styles.toggleButton,
          transform: isOpen ? 'rotate(90deg) scale(0.9)' : 'rotate(0deg) scale(1)',
          background: isOpen ? '#ff5252' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
        }} 
        onClick={toggleChat}
        aria-label={isOpen ? "Cerrar chat" : "Abrir chat"}
      >
        {isOpen ? <FiX size={28} /> : <FiMessageSquare size={28} />}
      </button>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .dot-anim { animation: blink 1.4s infinite both; }
        .dot-anim:nth-child(2) { animation-delay: 0.2s; }
        .dot-anim:nth-child(3) { animation-delay: 0.4s; }
        @keyframes blink { 0% { opacity: 0.2; } 20% { opacity: 1; } 100% { opacity: 0.2; } }
        
        /* Efectos Hover */
        .chip-hover:hover { background-color: rgba(102, 126, 234, 0.25) !important; border-color: #667eea !important; color: white !important; }
        .hover-btn:hover { background-color: rgba(255,255,255,0.3) !important; }
        .send-hover:hover { transform: scale(1.05); box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4); }
        .input-focus:focus { border-color: #667eea !important; background-color: #2a2a2a !important; }

        .hide-scrollbar::-webkit-scrollbar { display: none; }

        @media (max-width: 480px) {
          .chat-window-anim {
            width: calc(100vw - 32px) !important;
            height: 65vh !important;
            bottom: 85px !important;
            right: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ChatBot;
