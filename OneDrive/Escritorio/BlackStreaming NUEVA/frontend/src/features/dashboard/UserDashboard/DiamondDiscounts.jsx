import React, { useState, useEffect } from 'react';
import apiClient from '/src/services/apiClient.js';
import { 
  FiTag, 
  FiCopy, 
  FiCheck, 
  FiStar, 
  FiAward, 
  FiGift,
  FiClock,
  FiUsers,
  FiZap,
  FiShield,
  FiTrendingUp
} from 'react-icons/fi';

const styles = {
  // Layout principal
  container: { 
    padding: '32px', 
    color: '#e0e0e0',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  
  // Header mejorado
  header: { 
    fontSize: '2.5rem', 
    fontWeight: '800', 
    background: 'linear-gradient(135deg, #00BFFF 0%, #0077CC 50%, #005599 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  
  subtitle: {
    fontSize: '1.1rem',
    color: '#94a3b8',
    marginBottom: '40px',
    lineHeight: 1.6,
    maxWidth: '600px'
  },

  // Grid de tarjetas mejorado
  grid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
    gap: '28px',
    marginTop: '40px'
  },

  // Tarjeta premium
  card: { 
    background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', 
    padding: '28px', 
    borderRadius: '20px', 
    border: '1px solid rgba(0, 191, 255, 0.3)',
    boxShadow: `
      0 8px 32px rgba(0, 191, 255, 0.15),
      0 2px 8px rgba(0, 191, 255, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `,
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-8px)',
      borderColor: 'rgba(0, 191, 255, 0.6)',
      boxShadow: `
        0 16px 48px rgba(0, 191, 255, 0.25),
        0 4px 16px rgba(0, 191, 255, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.2)
      `
    }
  },

  // Efectos visuales
  cardShine: {
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
    transition: 'left 0.6s ease',
    pointerEvents: 'none'
  },
  
  cardHoverShine: {
    left: '100%'
  },

  badge: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    color: '#000',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)'
  },

  // Contenido de la tarjeta
  cardHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '20px'
  },

  discountContainer: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
    marginBottom: '8px'
  },

  discount: { 
    fontSize: '3.5rem', 
    fontWeight: '900', 
    background: 'linear-gradient(135deg, #00BFFF 0%, #0077CC 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: 0,
    lineHeight: 1,
    textShadow: '0 4px 8px rgba(0, 191, 255, 0.3)'
  },

  discountSymbol: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#00BFFF'
  },

  label: { 
    fontSize: '1rem', 
    color: '#00BFFF', 
    textTransform: 'uppercase', 
    letterSpacing: '1.5px', 
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },

  description: {
    color: '#cbd5e1',
    fontSize: '0.95rem',
    lineHeight: 1.5,
    marginBottom: '24px',
    minHeight: '40px'
  },

  // Código mejorado
  codeBox: { 
    background: 'linear-gradient(135deg, rgba(0, 191, 255, 0.1) 0%, rgba(0, 119, 204, 0.1) 100%)', 
    border: '1px solid rgba(0, 191, 255, 0.4)', 
    borderRadius: '12px', 
    padding: '16px', 
    marginTop: '20px', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
      background: 'linear-gradient(135deg, rgba(0, 191, 255, 0.15) 0%, rgba(0, 119, 204, 0.15) 100%)',
      borderColor: 'rgba(0, 191, 255, 0.6)',
      transform: 'translateY(-2px)'
    }
  },

  codeText: { 
    fontSize: '1.3rem', 
    fontWeight: 'bold', 
    color: '#fff', 
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    letterSpacing: '1px'
  },

  copyButton: {
    background: 'rgba(0, 191, 255, 0.2)',
    border: '1px solid rgba(0, 191, 255, 0.4)',
    borderRadius: '8px',
    padding: '8px',
    color: '#00BFFF',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'rgba(0, 191, 255, 0.3)',
      transform: 'scale(1.05)'
    }
  },

  // Estadísticas
  stats: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '20px',
    paddingTop: '16px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
  },

  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#94a3b8',
    fontSize: '0.85rem'
  },

  usageBar: {
    width: '100%',
    height: '6px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '3px',
    marginTop: '8px',
    overflow: 'hidden'
  },

  usageProgress: {
    height: '100%',
    background: 'linear-gradient(90deg, #00BFFF 0%, #0077CC 100%)',
    borderRadius: '3px',
    transition: 'width 0.5s ease'
  },

  // Estados
  loading: { 
    textAlign: 'center', 
    padding: '80px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px'
  },

  loadingText: {
    fontSize: '1.2rem',
    color: '#94a3b8',
    fontWeight: '500'
  },

  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#94a3b8'
  },

  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '16px',
    opacity: 0.5
  },

  // Animación de copiado
  copiedNotification: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    background: 'linear-gradient(135deg, #00BFFF 0%, #0077CC 100%)',
    color: 'white',
    padding: '12px 20px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 8px 25px rgba(0, 191, 255, 0.4)',
    zIndex: 1000,
    animation: 'slideIn 0.3s ease, slideOut 0.3s ease 1.7s'
  }
};

// Añadir keyframes para la animación
const keyframes = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;

const DiamondDiscounts = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copiedId, setCopiedId] = useState(null);
    const [hoveredCard, setHoveredCard] = useState(null);
    const [showCopiedNotification, setShowCopiedNotification] = useState(false);

    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                // Simulamos una llamada API - reemplaza con tu endpoint real
                const res = await apiClient.get('/diamante/coupons');
                setCoupons(res.data);
            } catch (error) { 
                console.error('Error fetching coupons:', error);
                // Datos de ejemplo para demostración
                setCoupons([
                  {
                    id: 1,
                    code: 'DIAMANTE25',
                    discount_percent: 25,
                    current_uses: 45,
                    max_uses: 100,
                    description: 'Descuento exclusivo en productos seleccionados'
                  },
                  {
                    id: 2,
                    code: 'PREMIUM30',
                    discount_percent: 30,
                    current_uses: 12,
                    max_uses: 50,
                    description: '30% de descuento en toda la tienda'
                  },
                  {
                    id: 3,
                    code: 'ELITE40',
                    discount_percent: 40,
                    current_uses: 8,
                    max_uses: 25,
                    description: 'Descuento máximo para miembros Elite'
                  }
                ]);
            } 
            finally { 
                setLoading(false); 
            }
        };
        fetchCoupons();
    }, []);

    const copyToClipboard = (code, id) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        setShowCopiedNotification(true);
        setTimeout(() => {
            setCopiedId(null);
            setShowCopiedNotification(false);
        }, 2000);
    };

    const getUsagePercentage = (current, max) => {
        return Math.min(100, (current / max) * 100);
    };

    if (loading) return (
        <div style={styles.container}>
            <style>{keyframes}</style>
            <div style={styles.loading}>
                <FiZap size={48} color="#00BFFF" />
                <div style={styles.loadingText}>Cargando beneficios exclusivos Diamante...</div>
            </div>
        </div>
    );

    return (
        <div style={styles.container}>
            <style>{keyframes}</style>
            
            {/* Notificación de copiado */}
            {showCopiedNotification && (
                <div style={styles.copiedNotification}>
                    <FiCheck size={20} />
                    ¡Código copiado al portapapeles!
                </div>
            )}

            {/* Header */}
            <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px'}}>
                <div>
                    <h2 style={styles.header}>
                        <FiAward size={48} />
                        Zona Exclusiva Diamante
                    </h2>
                    <p style={styles.subtitle}>
                        Disfruta de cupones premium seleccionados especialmente para nuestros miembros Diamante. 
                        Cada código es una oportunidad única de ahorro.
                    </p>
                </div>
                <div style={{
                    background: 'rgba(0, 191, 255, 0.1)',
                    border: '1px solid rgba(0, 191, 255, 0.3)',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <FiShield size={24} color="#00BFFF" />
                    <div>
                        <div style={{fontSize: '0.9rem', color: '#94a3b8'}}>Estado</div>
                        <div style={{fontSize: '1.1rem', fontWeight: '600', color: '#00BFFF'}}>Miembro Diamante</div>
                    </div>
                </div>
            </div>

            {/* Grid de Cupones */}
            <div style={styles.grid}>
                {coupons.map(coupon => {
                    const usagePercent = getUsagePercentage(coupon.current_uses, coupon.max_uses);
                    const isPopular = coupon.current_uses > coupon.max_uses * 0.7;
                    
                    return (
                        <div 
                            key={coupon.id} 
                            style={{
                                ...styles.card,
                                transform: hoveredCard === coupon.id ? 'translateY(-8px)' : 'translateY(0)'
                            }}
                            onMouseEnter={() => setHoveredCard(coupon.id)}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            {/* Efecto shine */}
                            <div style={{
                                ...styles.cardShine,
                                ...(hoveredCard === coupon.id && styles.cardHoverShine)
                            }}></div>

                            {/* Badge popular */}
                            {isPopular && (
                                <div style={styles.badge}>
                                    <FiTrendingUp size={12} />
                                    POPULAR
                                </div>
                            )}

                            {/* Header de la tarjeta */}
                            <div style={styles.cardHeader}>
                                <div>
                                    <div style={styles.label}>
                                        <FiGift size={16} />
                                        Descuento Exclusivo
                                    </div>
                                    <div style={styles.discountContainer}>
                                        <h3 style={styles.discount}>{parseInt(coupon.discount_percent)}</h3>
                                        <span style={styles.discountSymbol}>%</span>
                                    </div>
                                </div>
                                <FiStar size={24} color="#00BFFF" />
                            </div>

                            {/* Descripción */}
                            <p style={styles.description}>
                                {coupon.description || 'Descuento especial para miembros Diamante'}
                            </p>

                            {/* Código */}
                            <div 
                                style={styles.codeBox}
                                onClick={() => copyToClipboard(coupon.code, coupon.id)}
                            >
                                <span style={styles.codeText}>{coupon.code}</span>
                                <div style={styles.copyButton}>
                                    {copiedId === coupon.id ? 
                                        <FiCheck size={18} /> : 
                                        <FiCopy size={18} />
                                    }
                                </div>
                            </div>

                            {/* Estadísticas de uso */}
                            <div style={styles.stats}>
                                <div style={styles.statItem}>
                                    <FiUsers size={14} />
                                    <span>{coupon.current_uses} usados</span>
                                </div>
                                <div style={styles.statItem}>
                                    <FiClock size={14} />
                                    <span>{coupon.max_uses - coupon.current_uses} disponibles</span>
                                </div>
                            </div>

                            {/* Barra de progreso */}
                            <div style={styles.usageBar}>
                                <div style={{
                                    ...styles.usageProgress,
                                    width: `${usagePercent}%`
                                }}></div>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {/* Estado vacío */}
            {coupons.length === 0 && (
                <div style={styles.emptyState}>
                    <FiTag style={styles.emptyIcon} />
                    <h3 style={{color: '#94a3b8', marginBottom: '8px'}}>No hay cupones activos</h3>
                    <p>Vuelve pronto para descubrir nuevos beneficios exclusivos Diamante.</p>
                </div>
            )}
        </div>
    );
};

export default DiamondDiscounts;