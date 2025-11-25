import React, { useState, useEffect } from 'react';
import apiClient from '/src/services/apiClient.js';
import { 
  FiDollarSign, 
  FiTrendingUp, 
  FiPlus, 
  FiTrash2, 
  FiActivity,
  FiAward,
  FiPieChart,
  FiShoppingBag,
  FiCheck,
  FiZap,
  FiShield,
  FiStar
} from 'react-icons/fi';

const styles = {
  // Layout principal
  container: { 
    padding: '32px', 
    color: '#e0e0e0',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  
  // Header premium VIP
  header: { 
    fontSize: '2.5rem', 
    fontWeight: '800', 
    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
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

  // Grid mejorado
  grid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
    gap: '28px',
    marginBottom: '40px'
  },

  // Tarjeta premium VIP
  card: { 
    background: 'linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)', 
    padding: '28px', 
    borderRadius: '20px', 
    border: '1px solid rgba(255, 215, 0, 0.3)',
    boxShadow: `
      0 8px 32px rgba(255, 215, 0, 0.15),
      0 2px 8px rgba(255, 215, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `,
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      transform: 'translateY(-8px)',
      borderColor: 'rgba(255, 215, 0, 0.6)',
      boxShadow: `
        0 16px 48px rgba(255, 215, 0, 0.25),
        0 4px 16px rgba(255, 215, 0, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.2)
      `
    }
  },

  // Efectos visuales VIP
  cardShine: {
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.1), transparent)',
    transition: 'left 0.6s ease',
    pointerEvents: 'none'
  },
  
  cardHoverShine: {
    left: '100%'
  },

  vipBadge: {
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
    boxShadow: '0 4px 12px rgba(255, 215, 0, 0.4)'
  },

  // Formulario mejorado
  formGroup: { 
    marginBottom: '20px' 
  },
  
  label: { 
    // CORREGIDO: Se eliminó "display: 'block'" duplicado
    marginBottom: '8px', 
    color: '#FFD700', 
    fontSize: '14px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  
  input: { 
    width: '100%', 
    padding: '14px', 
    borderRadius: '12px', 
    border: '1px solid rgba(255, 215, 0, 0.3)',
    background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, rgba(255, 165, 0, 0.05) 100%)',
    color: '#fff', 
    fontSize: '16px', 
    boxSizing: 'border-box',
    transition: 'all 0.3s ease',
    '&:focus': {
      outline: 'none',
      borderColor: 'rgba(255, 215, 0, 0.6)',
      boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.1)'
    }
  },

  inputGroup: {
    display: 'flex',
    gap: '12px'
  },

  // Botón premium VIP
  button: { 
    width: '100%', 
    padding: '16px', 
    borderRadius: '12px', 
    border: 'none', 
    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    color: '#000', 
    fontWeight: 'bold', 
    cursor: 'pointer', 
    marginTop: '10px', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: '8px',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(255, 215, 0, 0.4)'
    }
  },

  // Métricas VIP
  statLabel: { 
    fontSize: '14px', 
    color: '#FFD700',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '8px'
  },
  
  statValue: { 
    fontSize: '2.5rem', 
    fontWeight: '800', 
    color: '#fff',
    textShadow: '0 4px 8px rgba(255, 215, 0, 0.3)'
  },

  // Barra de progreso VIP
  progressBar: { 
    height: '10px', 
    borderRadius: '5px', 
    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
    marginTop: '15px', 
    overflow: 'hidden',
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)'
  },
  
  progressFill: { 
    height: '100%', 
    background: 'linear-gradient(90deg, #FFD700 0%, #FFA500 100%)',
    borderRadius: '5px',
    transition: 'width 0.5s ease'
  },

  // Tabla premium
  table: { 
    width: '100%', 
    borderCollapse: 'collapse', 
    marginTop: '10px' 
  },
  
  th: { 
    textAlign: 'left', 
    padding: '16px', 
    borderBottom: '1px solid rgba(255, 215, 0, 0.3)', 
    color: '#FFD700',
    fontWeight: '600',
    fontSize: '14px'
  },
  
  td: { 
    padding: '16px', 
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    fontSize: '14px'
  },

  profitPositive: { 
    color: '#00ff88',
    fontWeight: '600'
  },
  
  profitNegative: { 
    color: '#ff4444',
    fontWeight: '600'
  },

  // Estados de carga
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

  // Header de tarjeta
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
    color: '#FFD700'
  }
};

const VIPEarnings = () => {
  const [ledger, setLedger] = useState([]);
  const [form, setForm] = useState({ item_name: '', cost_price: '', sale_price: '' });
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);

  const fetchLedger = async () => {
    try {
      const res = await apiClient.get('/vip/ledger');
      setLedger(res.data);
    } catch (error) { 
      console.error(error);
      // Datos de ejemplo para demostración
      setLedger([
        { id: 1, item_name: 'Netflix Premium', cost_price: '15.00', sale_price: '25.00', profit: '10.00' },
        { id: 2, item_name: 'Spotify Family', cost_price: '12.00', sale_price: '20.00', profit: '8.00' },
        { id: 3, item_name: 'YouTube Premium', cost_price: '18.00', sale_price: '30.00', profit: '12.00' }
      ]);
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { 
    fetchLedger(); 
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/vip/ledger', form);
      setForm({ item_name: '', cost_price: '', sale_price: '' });
      fetchLedger();
    } catch (error) { 
      alert('Error al guardar'); 
    }
  };

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de que quieres borrar este registro?')) {
      await apiClient.delete(`/vip/ledger/${id}`);
      fetchLedger();
    }
  };

  // Cálculos
  const totalInvested = ledger.reduce((acc, item) => acc + parseFloat(item.cost_price || 0), 0);
  const totalRevenue = ledger.reduce((acc, item) => acc + parseFloat(item.sale_price || 0), 0);
  const totalProfit = ledger.reduce((acc, item) => acc + parseFloat(item.profit || 0), 0);
  const roi = totalInvested > 0 ? ((totalProfit / totalInvested) * 100).toFixed(1) : 0;

  if (loading) return (
    <div style={styles.container}>
      <div style={styles.loading}>
        <FiZap size={48} color="#FFD700" />
        <div style={styles.loadingText}>Cargando panel VIP exclusivo...</div>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      {/* Header VIP */}
      <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px'}}>
        <div>
          <h2 style={styles.header}>
            <FiStar size={48} />
            Panel de Ganancias VIP
          </h2>
          <p style={styles.subtitle}>
            Controla tus inversiones y ganancias como un verdadero VIP. 
            Registra cada movimiento y maximiza tu rentabilidad.
          </p>
        </div>
        <div style={{
          background: 'rgba(255, 215, 0, 0.1)',
          border: '1px solid rgba(255, 215, 0, 0.3)',
          borderRadius: '12px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <FiShield size={24} color="#FFD700" />
          <div>
            <div style={{fontSize: '0.9rem', color: '#94a3b8'}}>Nivel</div>
            <div style={{fontSize: '1.1rem', fontWeight: '600', color: '#FFD700'}}>Miembro VIP Elite</div>
          </div>
        </div>
      </div>

      <div style={styles.grid}>
        {/* Formulario de Registro */}
        <div 
          style={{
            ...styles.card,
            transform: hoveredCard === 'form' ? 'translateY(-8px)' : 'translateY(0)'
          }}
          onMouseEnter={() => setHoveredCard('form')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div style={{
            ...styles.cardShine,
            ...(hoveredCard === 'form' && styles.cardHoverShine)
          }}></div>

          <div style={styles.cardHeader}>
            <FiPlus size={24} />
            <h3 style={{margin: 0, color: '#FFD700'}}>Registrar Transacción VIP</h3>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <FiShoppingBag size={16} />
                Nombre del Producto/Cuenta
              </label>
              <input 
                style={styles.input} 
                value={form.item_name} 
                onChange={e => setForm({...form, item_name: e.target.value})} 
                placeholder="Ej: Netflix Premium, Spotify Family..." 
                required 
              />
            </div>
            
            <div style={styles.inputGroup}>
              <div style={{...styles.formGroup, flex: 1}}>
                <label style={styles.label}>
                  <FiDollarSign size={16} />
                  Costo de Inversión ($)
                </label>
                <input 
                  style={styles.input} 
                  type="number" 
                  step="0.01" 
                  value={form.cost_price} 
                  onChange={e => setForm({...form, cost_price: e.target.value})} 
                  placeholder="0.00" 
                  required 
                />
              </div>
              <div style={{...styles.formGroup, flex: 1}}>
                <label style={styles.label}>
                  <FiTrendingUp size={16} />
                  Precio de Venta ($)
                </label>
                <input 
                  style={styles.input} 
                  type="number" 
                  step="0.01" 
                  value={form.sale_price} 
                  onChange={e => setForm({...form, sale_price: e.target.value})} 
                  placeholder="0.00" 
                  required 
                />
              </div>
            </div>
            
            <button type="submit" style={styles.button}>
              <FiCheck size={18} />
              Registrar Transacción
            </button>
          </form>
        </div>

        {/* Métricas VIP */}
        <div 
          style={{
            ...styles.card,
            transform: hoveredCard === 'metrics' ? 'translateY(-8px)' : 'translateY(0)'
          }}
          onMouseEnter={() => setHoveredCard('metrics')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div style={{
            ...styles.cardShine,
            ...(hoveredCard === 'metrics' && styles.cardHoverShine)
          }}></div>

          <div style={styles.vipBadge}>
            <FiAward size={12} />
            RENDIMIENTO
          </div>

          <div style={styles.cardHeader}>
            <FiActivity size={24} />
            <h3 style={{margin: 0, color: '#FFD700'}}>Tus Métricas VIP</h3>
          </div>

          <div style={{marginBottom: '25px'}}>
            <p style={styles.statLabel}>
              <FiTrendingUp size={16} />
              Ganancia Neta Total
            </p>
            <p style={{
              ...styles.statValue, 
              color: totalProfit >= 0 ? '#00ff88' : '#ff4444',
              background: totalProfit >= 0 ? 
                'linear-gradient(135deg, #00ff88 0%, #00cc66 100%)' :
                'linear-gradient(135deg, #ff4444 0%, #cc0000 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              ${totalProfit.toFixed(2)}
            </p>
          </div>

          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px'}}>
            <div>
              <div style={{color: '#94a3b8', fontSize: '0.9rem'}}>Inversión Total</div>
              <div style={{color: '#FFD700', fontWeight: '600'}}>${totalInvested.toFixed(2)}</div>
            </div>
            <div>
              <div style={{color: '#94a3b8', fontSize: '0.9rem'}}>Ventas Totales</div>
              <div style={{color: '#00ff88', fontWeight: '600'}}>${totalRevenue.toFixed(2)}</div>
            </div>
          </div>

          <div style={styles.progressBar}>
            <div style={{
              ...styles.progressFill,
              width: `${Math.min(roi, 100)}%`
            }}></div>
          </div>
          
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px'}}>
            <div style={{color: '#94a3b8', fontSize: '0.8rem'}}>Retorno sobre Inversión</div>
            <div style={{color: '#FFD700', fontWeight: '700', fontSize: '1.1rem'}}>
              {roi}% ROI
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Historial */}
      <div 
        style={{
          ...styles.card,
          transform: hoveredCard === 'table' ? 'translateY(-8px)' : 'translateY(0)'
        }}
        onMouseEnter={() => setHoveredCard('table')}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <div style={{
          ...styles.cardShine,
          ...(hoveredCard === 'table' && styles.cardHoverShine)
        }}></div>

        <div style={styles.cardHeader}>
          <FiPieChart size={24} />
          <h3 style={{margin: 0, color: '#FFD700'}}>Historial de Movimientos VIP</h3>
        </div>

        <div style={{overflowX: 'auto'}}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Producto</th>
                <th style={styles.th}>Inversión</th>
                <th style={styles.th}>Venta</th>
                <th style={styles.th}>Ganancia</th>
                <th style={styles.th}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {ledger.map(item => (
                <tr key={item.id}>
                  <td style={styles.td}>{item.item_name}</td>
                  <td style={styles.td}>${parseFloat(item.cost_price).toFixed(2)}</td>
                  <td style={styles.td}>${parseFloat(item.sale_price).toFixed(2)}</td>
                  <td style={{
                    ...styles.td, 
                    ...(item.profit >= 0 ? styles.profitPositive : styles.profitNegative)
                  }}>
                    ${parseFloat(item.profit).toFixed(2)}
                  </td>
                  <td style={styles.td}>
                    <button 
                      onClick={() => handleDelete(item.id)} 
                      style={{
                        background: 'rgba(255, 68, 68, 0.1)',
                        border: '1px solid rgba(255, 68, 68, 0.3)',
                        borderRadius: '8px',
                        padding: '8px',
                        color: '#ff4444',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(255, 68, 68, 0.2)';
                        e.target.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(255, 68, 68, 0.1)';
                        e.target.style.transform = 'scale(1)';
                      }}
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {ledger.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#94a3b8'
          }}>
            <FiShoppingBag size={48} style={{opacity: 0.5, marginBottom: '16px'}} />
            <h4 style={{color: '#94a3b8', marginBottom: '8px'}}>No hay transacciones registradas</h4>
            <p>Comienza registrando tu primera transacción VIP arriba.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VIPEarnings;