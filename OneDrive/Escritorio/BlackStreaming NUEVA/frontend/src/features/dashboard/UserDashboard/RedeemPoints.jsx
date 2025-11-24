// src/features/dashboard/UserDashboard/RedeemPoints.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '/src/context/AuthContext';
import apiClient from '/src/services/apiClient.js';
import { 
  FiGift, FiStar, FiShoppingBag, FiCheckCircle, FiAlertCircle,
  FiLoader, FiAward, FiZap, FiClock, FiTrendingUp, FiBox,
  FiCoffee, FiShoppingCart
} from 'react-icons/fi';

// --- Estilos Unified Compact Theme (Store Edition) ---
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

  // Filtros Compactos
  filterSection: { display: 'flex', gap: '12px', marginBottom: '24px', position: 'relative', zIndex: 1, flexWrap: 'wrap', justifyContent: 'center' },
  filterButton: {
    padding: '10px 20px', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '20px',
    background: 'rgba(30, 30, 30, 0.8)', color: '#a0a0a0', cursor: 'pointer', transition: 'all 0.3s ease',
    display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: '600', backdropFilter: 'blur(20px)'
  },
  filterButtonActive: {
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
    color: '#667eea', borderColor: 'rgba(102, 126, 234, 0.4)', transform: 'translateY(-2px)',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.2)'
  },

  // Grid de Productos
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', // Más compacto
    gap: '24px',
    position: 'relative',
    zIndex: 1
  },
  card: {
    background: 'rgba(30, 30, 30, 0.6)', backdropFilter: 'blur(20px)', borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.08)', overflow: 'hidden', display: 'flex', flexDirection: 'column',
    transition: 'all 0.3s ease', position: 'relative'
  },
  cardHover: { transform: 'translateY(-8px)', borderColor: 'rgba(102, 126, 234, 0.3)', boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3)' },
  
  cardImageContainer: { position: 'relative', width: '100%', height: '160px', overflow: 'hidden' },
  cardImage: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' },
  cardImageHover: { transform: 'scale(1.1)' },
  
  cardBadge: {
    position: 'absolute', top: '12px', right: '12px',
    background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', color: '#ffd700',
    padding: '4px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: '700',
    display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid rgba(255, 215, 0, 0.3)'
  },

  cardContent: { padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '12px' },
  
  cardHeader: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' },
  cardTitle: { fontSize: '1.1rem', fontWeight: '700', color: '#ffffff', margin: 0, lineHeight: '1.3' },
  cardIcon: { color: '#667eea', background: 'rgba(102, 126, 234, 0.1)', padding: '8px', borderRadius: '8px' },
  
  cardDescription: { fontSize: '0.85rem', color: '#a0a0a0', lineHeight: 1.5, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  
  cardFooter: { marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  
  cardPoints: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1.2rem', fontWeight: '800', color: '#2ecc71' },
  
  redeemButton: {
    padding: '8px 16px', border: 'none', borderRadius: '10px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white',
    fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s ease',
    display: 'flex', alignItems: 'center', gap: '6px', position: 'relative', overflow: 'hidden'
  },
  redeemButtonDisabled: { background: 'rgba(255, 255, 255, 0.1)', color: '#666', cursor: 'not-allowed' },
  
  messageContainer: { position: 'relative', zIndex: 1, marginBottom: '24px' },
  message: { padding: '12px 20px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '10px', backdropFilter: 'blur(20px)', border: '1px solid', maxWidth: '600px', margin: '0 auto' },
  success: { background: 'rgba(39, 174, 96, 0.15)', color: '#2ecc71', borderColor: 'rgba(39, 174, 96, 0.3)' },
  error: { background: 'rgba(220, 53, 69, 0.15)', color: '#ff6b6b', borderColor: 'rgba(220, 53, 69, 0.3)' },
  
  loadingState: { textAlign: 'center', padding: '60px 20px', color: '#a0a0a0' },
  emptyState: { textAlign: 'center', padding: '60px 20px', color: '#a0a0a0', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '16px' },
  pulseAnimation: { animation: 'pulse 2s infinite' }
};

const RedeemPoints = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [hoveredStat, setHoveredStat] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  
  const { user, updateUserContext } = useAuth();
  const [redeemingId, setRedeemingId] = useState(null);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/redeem-items');
      setItems(response.data);
      setFilteredItems(response.data);
      setError(null);
    } catch (err) {
      console.error('Error al cargar premios:', err);
      setError('No se pudieron cargar los premios disponibles.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const applyFilter = (filterType) => {
    setActiveFilter(filterType);
    switch (filterType) {
      case 'affordable':
        setFilteredItems(items.filter(item => (user?.points_balance ?? 0) >= item.points_cost && (item.stock_quantity === null || item.stock_quantity > 0)));
        break;
      case 'limited':
        setFilteredItems(items.filter(item => item.stock_quantity !== null && item.stock_quantity > 0));
        break;
      case 'popular':
        setFilteredItems([...items].sort((a, b) => b.popularity - a.popularity));
        break;
      default:
        setFilteredItems(items);
    }
  };

  const handleRedeem = async (item) => {
    if (redeemingId) return;
    if (!window.confirm(`¿Canjear "${item.name}" por ${item.points_cost} puntos?`)) return;

    setRedeemingId(item.id);
    setError(null);
    setSuccess(null);

    try {
      const { data } = await apiClient.post(`/redeem-items/${item.id}`);
      setSuccess(data.message || '¡Canje realizado con éxito!');
      updateUserContext({ ...user, points_balance: data.newPointsBalance });
      
      // Actualizar stock local
      const updateStock = (list) => list.map(i => i.id === item.id && i.stock_quantity !== null ? { ...i, stock_quantity: i.stock_quantity - 1 } : i);
      setItems(prev => updateStock(prev));
      setFilteredItems(prev => updateStock(prev));

    } catch (err) {
      setError(err.response?.data?.error || 'Error al procesar el canje.');
    } finally {
      setRedeemingId(null);
      setTimeout(() => setSuccess(null), 5000); // Limpiar mensaje de éxito
    }
  };

  const getItemIcon = (itemName) => {
    const name = itemName.toLowerCase();
    if (name.includes('café') || name.includes('cafe')) return FiCoffee;
    if (name.includes('descuento')) return FiShoppingCart;
    if (name.includes('premium')) return FiAward;
    if (name.includes('gamer')) return FiZap;
    return FiGift;
  };

  const stats = [
    { value: user?.points_balance ?? 0, label: 'Mis Puntos', icon: FiStar },
    { value: items.filter(item => (user?.points_balance ?? 0) >= item.points_cost).length, label: 'Alcanzables', icon: FiGift },
    { value: items.filter(item => item.stock_quantity !== null && item.stock_quantity > 0).length, label: 'Limitados', icon: FiClock }
  ];

  if (isLoading) return <div style={styles.container}><div style={styles.loadingState}><div style={styles.pulseAnimation}><FiGift size={48} color="#667eea" /></div><h3>Cargando Tienda...</h3></div></div>;

  return (
    <div style={styles.container}>
      <div style={styles.backgroundDecoration} />
      
      <div style={styles.headerSection}>
        <h1 style={styles.header}>Tienda de Puntos</h1>
        <p style={styles.subtitle}>Tus puntos valen oro. Canjéalos aquí.</p>
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

      <div style={styles.filterSection}>
        {[
          { key: 'all', label: 'Todos', icon: FiShoppingBag },
          { key: 'affordable', label: 'Puedo Canjear', icon: FiCheckCircle },
          { key: 'limited', label: 'Limitados', icon: FiZap },
          { key: 'popular', label: 'Populares', icon: FiTrendingUp }
        ].map((filter) => {
          const Icon = filter.icon;
          return (
            <button
              key={filter.key}
              style={{...styles.filterButton, ...(activeFilter === filter.key && styles.filterButtonActive)}}
              onClick={() => applyFilter(filter.key)}
            >
              <Icon size={14} /> {filter.label}
            </button>
          );
        })}
      </div>

      <div style={styles.messageContainer}>
        {error && <div style={{ ...styles.message, ...styles.error }}><FiAlertCircle size={18} />{error}</div>}
        {success && <div style={{ ...styles.message, ...styles.success }}><FiCheckCircle size={18} />{success}</div>}
      </div>

      <div style={styles.contentGrid}>
        {filteredItems.map((item) => {
          const canAfford = (user?.points_balance ?? 0) >= item.points_cost;
          const inStock = item.stock_quantity === null || item.stock_quantity > 0;
          const isRedeemingThis = redeemingId === item.id;
          const isLimited = item.stock_quantity !== null && item.stock_quantity < 10;
          const isHovered = hoveredCard === item.id;
          const ItemIcon = getItemIcon(item.name);
          
          let btnText = 'Canjear';
          if (isRedeemingThis) btnText = '...';
          else if (!inStock) btnText = 'Agotado';
          else if (!canAfford) btnText = 'Faltan Puntos';

          return (
            <div 
              key={item.id}
              style={{...styles.card, ...(isHovered && styles.cardHover)}}
              onMouseEnter={() => setHoveredCard(item.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={styles.cardImageContainer}>
                <img 
                  src={item.image_url || 'https://placehold.co/600x400/2a2a2a/555?text=PREMIO'} 
                  alt={item.name} 
                  style={{...styles.cardImage, ...(isHovered && styles.cardImageHover)}}
                />
                {isLimited && inStock && <div style={styles.cardBadge}><FiZap size={10} /> Quedan {item.stock_quantity}</div>}
              </div>

              <div style={styles.cardContent}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>{item.name}</h3>
                  <div style={styles.cardIcon}><ItemIcon size={16} /></div>
                </div>
                
                <p style={styles.cardDescription}>
                  {item.description || 'Premio exclusivo para usuarios fieles.'}
                </p>
                
                <div style={styles.cardFooter}>
                  <div style={styles.cardPoints}><FiStar size={16} /> {item.points_cost}</div>
                  <button
                    style={{...styles.redeemButton, ...((!canAfford || !inStock || isRedeemingThis) && styles.redeemButtonDisabled)}}
                    onClick={() => handleRedeem(item)}
                    disabled={!canAfford || !inStock || isRedeemingThis}
                  >
                    {isRedeemingThis && <FiLoader className="spin" size={14} />}
                    {!isRedeemingThis && inStock && canAfford && <FiBox size={14} />}
                    {btnText}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && !isLoading && (
        <div style={styles.emptyState}>
          <FiBox size={48} color="#667eea" />
          <p>No se encontraron premios con este filtro.</p>
        </div>
      )}
    </div>
  );
};

export default RedeemPoints;