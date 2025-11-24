// src/components/ui/NotificationBell.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '/src/context/AuthContext';
import apiClient from '/src/services/apiClient';
import { 
  FiBell, 
  FiCheck, 
  FiClock, 
  FiAlertCircle,
  FiInfo,
  FiCheckCircle,
  FiXCircle
} from 'react-icons/fi';

// --- Estilos Ultra Modernos Unificados ---
const styles = {
  container: {
    position: 'relative',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  bellButton: {
    padding: '12px',
    borderRadius: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    color: '#b0b0b0',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(20px)',
  },
  bellButtonHover: {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    color: '#667eea',
    borderColor: 'rgba(102, 126, 234, 0.3)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.2)'
  },
  countBadge: {
    position: 'absolute',
    top: '6px',
    right: '6px',
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: 'white',
    borderRadius: '50%',
    padding: '2px 6px',
    fontSize: '0.7rem',
    fontWeight: '700',
    minWidth: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid #1a1a1a',
    lineHeight: 1,
    boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)'
  },
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 16px)',
    right: 0,
    width: '420px',
    backgroundColor: 'rgba(25, 25, 25, 0.95)',
    backdropFilter: 'blur(40px)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
    zIndex: 1002,
    overflow: 'hidden',
  },
  dropdownGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: 'linear-gradient(90deg, #667eea, #764ba2, #f093fb)',
    zIndex: 1
  },
  header: {
    padding: '20px 24px 16px 24px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(30, 30, 30, 0.8)',
  },
  headerTitle: {
    fontWeight: 700,
    fontSize: '1.2rem',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  markReadButton: {
    fontSize: '0.85rem',
    color: '#667eea',
    background: 'rgba(102, 126, 234, 0.1)',
    border: '1px solid rgba(102, 126, 234, 0.3)',
    cursor: 'pointer',
    padding: '8px 16px',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '600'
  },
  markReadButtonHover: {
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    transform: 'translateY(-1px)'
  },
  notificationList: {
    maxHeight: '400px',
    overflowY: 'auto',
    background: 'rgba(20, 20, 20, 0.6)',
  },
  notificationItem: {
    padding: '20px 24px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    textDecoration: 'none',
    display: 'block',
    color: 'inherit',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden'
  },
  notificationItemHover: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    transform: 'translateX(4px)'
  },
  notificationItemUnread: {
    backgroundColor: 'rgba(102, 126, 234, 0.05)',
    borderLeft: '3px solid #667eea',
  },
  notificationContent: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
  },
  notificationIcon: {
    flexShrink: 0,
    marginTop: '2px',
    background: 'rgba(102, 126, 234, 0.1)',
    borderRadius: '12px',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  notificationText: {
    flex: 1,
    minWidth: 0,
  },
  notificationTitle: {
    fontWeight: 600,
    fontSize: '0.95rem',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '6px'
  },
  unreadDot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#667eea',
    borderRadius: '50%',
    flexShrink: 0,
    boxShadow: '0 0 8px rgba(102, 126, 234, 0.6)'
  },
  notificationMessage: {
    fontSize: '0.9rem',
    color: '#b0b0b0',
    lineHeight: 1.5,
    marginBottom: '8px',
  },
  notificationTime: {
    fontSize: '0.8rem',
    color: '#888',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontWeight: '500'
  },
  emptyState: {
    padding: '60px 40px',
    textAlign: 'center',
    color: '#a0a0a0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    background: 'rgba(255, 255, 255, 0.02)',
  },
  footer: {
    padding: '20px 24px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    textAlign: 'center',
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
  },
  footerLink: {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: 'rgba(102, 126, 234, 0.1)',
    borderRadius: '12px',
    border: '1px solid rgba(102, 126, 234, 0.3)',
    transition: 'all 0.3s ease'
  },
  footerLinkHover: {
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    transform: 'translateY(-1px)'
  },
  loadingSpinner: {
    width: '24px',
    height: '24px',
    border: '2px solid rgba(255, 255, 255, 0.1)',
    borderTop: '2px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '40px auto'
  }
};

// Helper para formatear la fecha
const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return `hace ${Math.floor(interval)} años`;
  interval = seconds / 2592000;
  if (interval > 1) return `hace ${Math.floor(interval)} meses`;
  interval = seconds / 86400;
  if (interval > 1) return `hace ${Math.floor(interval)} días`;
  interval = seconds / 3600;
  if (interval > 1) return `hace ${Math.floor(interval)} horas`;
  interval = seconds / 60;
  if (interval > 1) return `hace ${Math.floor(interval)} minutos`;
  return `hace ${Math.floor(seconds)} segundos`;
};

// Helper para obtener icono según el tipo de notificación
const getNotificationIcon = (type) => {
  switch (type) {
    case 'success':
      return <FiCheckCircle size={16} color="#10b981" />;
    case 'warning':
      return <FiAlertCircle size={16} color="#f59e0b" />;
    case 'error':
      return <FiXCircle size={16} color="#ef4444" />;
    default:
      return <FiInfo size={16} color="#667eea" />;
  }
};

const NotificationBell = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hoverStates, setHoverStates] = useState({});
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data } = await apiClient.get('/notifications');
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (err) {
      console.error('Error al cargar notificaciones:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Opcional: Refrescar cada 1 minuto
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [user]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownRef]);

  const handleHover = (element, isHovering) => {
    setHoverStates(prev => ({ ...prev, [element]: isHovering }));
  };

  const handleBellClick = () => {
    setIsOpen(prev => !prev);
    // Si hay notificaciones no leídas, marcarlas al abrir
    if (!isOpen && unreadCount > 0) {
      markAllAsRead();
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiClient.post('/notifications/mark-read');
      setUnreadCount(0);
      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: true }))
      );
    } catch (err) {
      console.error('Error al marcar como leído:', err);
    }
  };

  return (
    <div style={styles.container} ref={dropdownRef}>
      <button
        style={{
          ...styles.bellButton,
          ...(hoverStates.bell ? styles.bellButtonHover : {}),
        }}
        onMouseEnter={() => handleHover('bell', true)}
        onMouseLeave={() => handleHover('bell', false)}
        onClick={handleBellClick}
        title="Notificaciones"
      >
        <FiBell size={20} />
        {unreadCount > 0 && (
          <span style={styles.countBadge}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div style={styles.dropdown}>
          <div style={styles.dropdownGlow} />
          <div style={styles.header}>
            <span style={styles.headerTitle}>
              <FiBell size={20} />
              Notificaciones
            </span>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead} 
                style={{
                  ...styles.markReadButton,
                  ...(hoverStates.markRead && styles.markReadButtonHover)
                }}
                onMouseEnter={() => handleHover('markRead', true)}
                onMouseLeave={() => handleHover('markRead', false)}
              >
                <FiCheck size={14} />
                Marcar como leídas
              </button>
            )}
          </div>
          <div style={styles.notificationList}>
            {isLoading ? (
              <div style={styles.loadingSpinner} />
            ) : notifications.length === 0 ? (
              <div style={styles.emptyState}>
                <FiBell size={32} color="#667eea" />
                <div>
                  <p style={{ margin: 0, fontSize: '1rem', fontWeight: '600', color: '#667eea' }}>
                    No tienes notificaciones
                  </p>
                  <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem' }}>
                    Te mantendremos informado cuando tengas novedades
                  </p>
                </div>
              </div>
            ) : (
              notifications.map((notif, index) => (
                <Link
                  key={notif.id}
                  to={notif.link_url || '#'}
                  style={{
                    ...styles.notificationItem,
                    ...(!notif.is_read ? styles.notificationItemUnread : {}),
                    ...(hoverStates[`notif-${index}`] && styles.notificationItemHover),
                  }}
                  onClick={() => setIsOpen(false)}
                  onMouseEnter={() => handleHover(`notif-${index}`, true)}
                  onMouseLeave={() => handleHover(`notif-${index}`, false)}
                >
                  <div style={styles.notificationContent}>
                    <div style={styles.notificationIcon}>
                      {getNotificationIcon(notif.type)}
                    </div>
                    <div style={styles.notificationText}>
                      <div style={styles.notificationTitle}>
                        {!notif.is_read && <span style={styles.unreadDot}></span>}
                        {notif.title}
                      </div>
                      <p style={styles.notificationMessage}>{notif.message}</p>
                      <p style={styles.notificationTime}>
                        <FiClock size={12} />
                        {timeAgo(notif.created_at)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
          {notifications.length > 0 && (
            <div style={styles.footer}>
              <Link 
                to="/usuario/notificaciones" 
                style={{
                  ...styles.footerLink,
                  ...(hoverStates.footerLink && styles.footerLinkHover)
                }} 
                onClick={() => setIsOpen(false)}
                onMouseEnter={() => handleHover('footerLink', true)}
                onMouseLeave={() => handleHover('footerLink', false)}
              >
                Ver todas las notificaciones
                <FiBell size={14} />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Estilos CSS para animaciones */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default NotificationBell;