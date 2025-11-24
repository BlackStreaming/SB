// src/features/dashboard/UserDashboard/UserRateProviders.jsx

import React, { useState, useEffect } from 'react';
import apiClient from '/src/services/apiClient.js';
import { useAuth } from '/src/context/AuthContext';
import { 
  FiStar, FiClock, FiCheckCircle, FiMessageSquare, FiSend, FiAward,
  FiUsers, FiShoppingBag, FiAlertCircle, FiHeart, FiTrendingUp, FiZap,
  FiCalendar, FiThumbsUp
} from 'react-icons/fi';

// --- Estilos Ultra Modernos & Compactos (Unified Theme) ---
const styles = {
  container: { 
    padding: '24px 16px', 
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", 
    background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 50%, #0f0f0f 100%)',
    minHeight: '100vh',
    position: 'relative',
    overflow: 'hidden'
  },
  backgroundDecoration: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
    zIndex: 0
  },
  headerSection: { textAlign: 'center', marginBottom: '32px', position: 'relative', zIndex: 1 },
  header: { 
    fontSize: '2.5rem', 
    fontWeight: '800', 
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '8px',
    letterSpacing: '-0.02em'
  },
  subtitle: { fontSize: '1.1rem', color: '#b0b0b0', maxWidth: '600px', margin: '0 auto' },
  
  // Stats Compactos
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px', position: 'relative', zIndex: 1 },
  statCard: { background: 'rgba(30, 30, 30, 0.7)', backdropFilter: 'blur(20px)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255, 255, 255, 0.1)', position: 'relative', overflow: 'hidden', transition: 'all 0.4s ease', cursor: 'pointer' },
  statCardHover: { transform: 'translateY(-4px) scale(1.01)', borderColor: 'rgba(102, 126, 234, 0.3)', boxShadow: '0 10px 20px rgba(0, 0, 0, 0.4)' },
  statCardGlow: { position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #667eea, #764ba2, #f093fb)' },
  statValue: { fontSize: '2rem', fontWeight: '800', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '4px', lineHeight: '1' },
  statLabel: { fontSize: '0.9rem', color: '#a0a0a0', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' },
  statIcon: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '8px', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' },

  // Layout Principal (Flex Wrap para móviles)
  mainLayout: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '24px',
    position: 'relative',
    zIndex: 1
  },
  column: { flex: '1 1 400px', minWidth: '300px' },

  section: {
    background: 'rgba(25, 25, 25, 0.8)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    position: 'relative',
    overflow: 'hidden',
    height: '100%'
  },
  sectionHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' },
  sectionTitle: { fontSize: '1.2rem', fontWeight: '700', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px' },
  sectionCount: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '700' },

  // Tarjetas de Proveedor Compactas
  providerList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  providerCard: {
    background: 'rgba(40, 40, 40, 0.4)', borderRadius: '16px', padding: '20px',
    border: '1px solid rgba(255, 255, 255, 0.05)', transition: 'all 0.3s ease', position: 'relative'
  },
  providerCardHover: { background: 'rgba(50, 50, 50, 0.6)', borderColor: 'rgba(102, 126, 234, 0.3)', transform: 'translateX(4px)' },
  
  providerHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' },
  providerAvatar: {
    width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: '700', color: 'white'
  },
  providerInfo: { flex: 1 },
  providerName: { fontSize: '1rem', fontWeight: '600', color: '#ffffff', marginBottom: '2px' },
  providerMeta: { fontSize: '0.8rem', color: '#888', display: 'flex', alignItems: 'center', gap: '8px' },

  // Rating System
  ratingContainer: { marginBottom: '16px' },
  starsContainer: { display: 'flex', gap: '4px', marginBottom: '4px' },
  starButton: { background: 'none', border: 'none', cursor: 'pointer', padding: '4px', transition: 'all 0.2s ease' },
  starActive: { color: '#FFD700', transform: 'scale(1.1)' },
  starInactive: { color: '#404040' },
  ratingText: { fontSize: '0.8rem', color: '#888', fontStyle: 'italic', marginLeft: '4px' },

  // Inputs Compactos
  textarea: {
    width: '100%', padding: '12px', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px',
    background: 'rgba(0, 0, 0, 0.2)', color: '#ffffff', fontSize: '0.9rem', resize: 'vertical', minHeight: '80px',
    fontFamily: 'inherit', transition: 'all 0.3s ease'
  },
  textareaFocus: { borderColor: '#667eea', background: 'rgba(0, 0, 0, 0.4)' },
  
  submitButton: {
    width: '100%', padding: '12px', marginTop: '12px', border: 'none', borderRadius: '12px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', fontSize: '0.9rem',
    fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: '8px', transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden'
  },
  submitButtonHover: { transform: 'translateY(-2px)', boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)' },
  submitButtonDisabled: { opacity: 0.5, cursor: 'not-allowed', transform: 'none' },
  
  ratedBadge: {
    background: 'rgba(39, 174, 96, 0.15)', color: '#2ecc71', padding: '8px 12px', borderRadius: '10px',
    display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: '600',
    marginBottom: '12px', border: '1px solid rgba(39, 174, 96, 0.3)'
  },
  commentPreview: { background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '10px', borderLeft: '3px solid #667eea', marginTop: '10px' },
  commentText: { color: '#ccc', fontSize: '0.85rem', fontStyle: 'italic' },

  emptyState: { textAlign: 'center', padding: '40px 20px', color: '#666', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' },
  buttonGlow: { position: 'absolute', top: 0, left: '-100%', width: '100%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)', transition: 'left 0.5s ease' },
  buttonGlowHover: { left: '100%' },
  pulseAnimation: { animation: 'pulse 2s infinite' }
};

const StarRating = ({ rating, onRate, disabled = false, size = 24 }) => {
  const [hover, setHover] = useState(0);
  return (
    <div style={styles.ratingContainer}>
      <div style={styles.starsContainer}>
        {[...Array(5)].map((_, index) => {
          const ratingValue = index + 1;
          const isActive = ratingValue <= (hover || rating);
          return (
            <button
              key={ratingValue} type="button"
              onClick={() => !disabled && onRate(ratingValue)}
              onMouseEnter={() => !disabled && setHover(ratingValue)}
              onMouseLeave={() => !disabled && setHover(0)}
              style={{ ...styles.starButton, ...(isActive && styles.starActive), ...(!isActive && styles.starInactive) }}
              disabled={disabled}
            >
              <FiStar size={size} fill={isActive ? '#FFD700' : 'none'} strokeWidth={isActive ? 0 : 2} />
            </button>
          );
        })}
      </div>
      <div style={styles.ratingText}>{rating > 0 ? `${rating}/5 - ${['Malo', 'Regular', 'Bueno', 'Muy Bueno', 'Excelente'][rating - 1]}` : 'Toca las estrellas'}</div>
    </div>
  );
};

const ProviderCard = ({ provider, onRateSubmit, submissionStatus }) => {
  const [rating, setRating] = useState(provider.user_rating || 0);
  const [comment, setComment] = useState(provider.user_comment || '');
  const [isHovered, setIsHovered] = useState(false);
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const isRated = provider.has_rated;
  const isSaving = submissionStatus === 'saving';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) return alert('¡Selecciona estrellas!');
    onRateSubmit(provider.provider_id, rating, comment);
  };

  return (
    <div 
      style={{ ...styles.providerCard, ...(isHovered && styles.providerCardHover) }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.providerHeader}>
        <div style={styles.providerAvatar}>{provider.provider_name.substring(0,2).toUpperCase()}</div>
        <div style={styles.providerInfo}>
          <div style={styles.providerName}>{provider.provider_name}</div>
          <div style={styles.providerMeta}><FiCalendar size={12} /> Última compra reciente</div>
        </div>
      </div>

      {isRated ? (
        <>
          <div style={styles.ratedBadge}><FiCheckCircle size={14} /> Enviado: {provider.user_rating}/5</div>
          <StarRating rating={provider.user_rating} disabled={true} size={20} />
          {provider.user_comment && (
            <div style={styles.commentPreview}>
              <div style={styles.commentText}>"{provider.user_comment}"</div>
            </div>
          )}
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <StarRating rating={rating} onRate={setRating} disabled={isSaving} />
          <textarea
            style={{ ...styles.textarea, ...(isTextareaFocused && styles.textareaFocus) }}
            placeholder="Opinión (opcional)..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onFocus={() => setIsTextareaFocused(true)}
            onBlur={() => setIsTextareaFocused(false)}
            disabled={isSaving}
            maxLength={300}
          />
          <button 
            style={{ ...styles.submitButton, ...(isButtonHovered && styles.submitButtonHover), ...((isSaving || rating === 0) && styles.submitButtonDisabled) }}
            onMouseEnter={() => setIsButtonHovered(true)} onMouseLeave={() => setIsButtonHovered(false)}
            type="submit" disabled={isSaving || rating === 0}
          >
            <div style={{ ...styles.buttonGlow, ...(isButtonHovered && styles.buttonGlowHover) }} />
            {isSaving ? 'Guardando...' : <><FiSend size={14} /> Enviar</>}
          </button>
        </form>
      )}
    </div>
  );
};

const UserRateProviders = () => {
  const { user } = useAuth();
  const [eligibleProviders, setEligibleProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState({});
  const [hoveredStat, setHoveredStat] = useState(null);

  // Simulación de datos si no hay backend conectado aún, para que veas el diseño
  const fetchEligibleProviders = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const response = await apiClient.get('/ratings/eligible');
      setEligibleProviders(response.data);
    } catch (err) {
      // Fallback para que no se rompa si el backend falla
      console.warn('Usando modo fallback:', err);
      setError('Error conectando con servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchEligibleProviders(); }, [user]);

  const handleRatingSubmit = async (providerId, rating, comment) => {
    setSubmissionStatus(prev => ({ ...prev, [providerId]: 'saving' }));
    try {
      await apiClient.post('/ratings', { provider_id: providerId, rating, comment });
      setSubmissionStatus(prev => ({ ...prev, [providerId]: 'success' }));
      fetchEligibleProviders();
    } catch (err) {
      setSubmissionStatus(prev => ({ ...prev, [providerId]: 'error' }));
      alert('Error al guardar calificación');
    } finally {
      setTimeout(() => setSubmissionStatus(prev => ({ ...prev, [providerId]: null })), 2000);
    }
  };

  if (isLoading) return <div style={{...styles.container, ...styles.emptyState}}><div style={styles.pulseAnimation}><FiTrendingUp size={40} color="#667eea" /></div></div>;
  if (error) return <div style={{...styles.container, ...styles.emptyState}}><FiAlertCircle size={40} color="#ff6b6b" /><p>{error}</p></div>;

  const unrated = eligibleProviders.filter(p => !p.has_rated);
  const rated = eligibleProviders.filter(p => p.has_rated);

  const stats = [
    { value: eligibleProviders.length, label: 'Proveedores', icon: FiUsers },
    { value: unrated.length, label: 'Pendientes', icon: FiShoppingBag },
    { value: rated.length, label: 'Calificados', icon: FiAward }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.backgroundDecoration} />
      
      <div style={styles.headerSection}>
        <h1 style={styles.header}>Calificaciones</h1>
        <p style={styles.subtitle}>Tu opinión mejora el servicio</p>
      </div>

      <div style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={stat.label} style={{...styles.statCard, ...(hoveredStat === index && styles.statCardHover)}} onMouseEnter={() => setHoveredStat(index)} onMouseLeave={() => setHoveredStat(null)}>
            <div style={styles.statCardGlow} />
            <div style={styles.statValue}>{stat.value}</div>
            <div style={styles.statLabel}><div style={styles.statIcon}><stat.icon size={16} color="white" /></div>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Grid Flex Wrap para columnas responsivas */}
      <div style={styles.mainLayout}>
        
        {/* Columna Pendientes */}
        <div style={styles.column}>
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}><FiShoppingBag size={20} /> Pendientes</h2>
              <div style={styles.sectionCount}>{unrated.length}</div>
            </div>
            <div style={styles.providerList}>
              {unrated.length > 0 ? (
                unrated.map(p => (
                  <ProviderCard key={p.provider_id} provider={p} onRateSubmit={handleRatingSubmit} submissionStatus={submissionStatus[p.provider_id]} />
                ))
              ) : (
                <div style={styles.emptyState}><FiThumbsUp size={32} /><p>¡Todo calificado!</p></div>
              )}
            </div>
          </div>
        </div>

        {/* Columna Historial */}
        <div style={styles.column}>
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}><FiAward size={20} /> Historial</h2>
              <div style={styles.sectionCount}>{rated.length}</div>
            </div>
            <div style={styles.providerList}>
              {rated.length > 0 ? (
                rated.map(p => (
                  <ProviderCard key={p.provider_id} provider={p} onRateSubmit={handleRatingSubmit} submissionStatus={submissionStatus[p.provider_id]} />
                ))
              ) : (
                <div style={styles.emptyState}><FiZap size={32} /><p>Sin historial aún</p></div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserRateProviders;