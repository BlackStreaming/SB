// src/features/dashboard/AdminDashboard/AdminOrderReports.jsx

import React, { useState, useEffect } from 'react';
import apiClient from '/src/services/apiClient.js';
import {
  FiDollarSign, FiShoppingCart, FiTrendingUp, FiPackage, FiRefreshCw,
  FiDownload, FiSearch, FiCalendar, FiFilter, FiUser, FiFileText,
  FiCheckCircle, FiClock, FiXCircle, FiActivity, FiBarChart2, FiDatabase
} from 'react-icons/fi';

// --- Estilos Unified Compact Theme (Dark Glass) ---
const styles = {
  container: { 
    padding: '24px 16px', 
    fontFamily: "'Inter', sans-serif", 
    background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 50%, #0f0f0f 100%)',
    minHeight: '100vh',
    position: 'relative',
    overflow: 'hidden',
    color: '#e0e0e0'
  },
  backgroundDecoration: {
    position: 'absolute', top: 0, right: 0, width: '500px', height: '500px',
    background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)', zIndex: 0
  },
  
  // Header
  headerSection: { 
    marginBottom: '32px', position: 'relative', zIndex: 1,
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px'
  },
  headerTitle: { 
    fontSize: '2rem', fontWeight: '800', margin: 0,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    display: 'flex', alignItems: 'center', gap: '12px'
  },
  headerActions: { display: 'flex', gap: '12px' },

  // Botones
  mainButton: { 
    padding: '10px 20px', border: 'none', borderRadius: '10px', 
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
    color: 'white', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', display: 'flex', 
    alignItems: 'center', gap: '8px', transition: 'all 0.3s ease', boxSizing: 'border-box'
  },
  secondaryButton: {
    padding: '10px 20px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
    background: 'rgba(255,255,255,0.05)', color: '#e0e0e0', fontSize: '0.9rem', fontWeight: '600',
    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s ease', boxSizing: 'border-box'
  },

  // Stats Grid
  statsGrid: { 
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
    gap: '20px', marginBottom: '30px', position: 'relative', zIndex: 1 
  },
  statCard: {
    background: 'rgba(25, 25, 25, 0.8)', backdropFilter: 'blur(20px)', borderRadius: '16px',
    padding: '24px', border: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', 
    justifyContent: 'space-between', alignItems: 'flex-start', transition: 'transform 0.2s', cursor: 'default'
  },
  statLabel: { fontSize: '0.9rem', color: '#a0a0a0', marginBottom: '8px', fontWeight: '600' },
  statValue: { fontSize: '2rem', fontWeight: '800', margin: 0, color: '#fff', lineHeight: 1.2 },
  statIconWrapper: { 
    width: '50px', height: '50px', borderRadius: '12px', 
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff'
  },
  statTrend: { fontSize: '0.8rem', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' },
  trendPositive: { color: '#2ecc71' },
  trendNegative: { color: '#e74c3c' },

  // Filtros
  filterSection: {
    background: 'rgba(25, 25, 25, 0.8)', backdropFilter: 'blur(20px)', borderRadius: '16px',
    padding: '24px', border: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '24px', position: 'relative', zIndex: 1
  },
  filterGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' },
  
  inputLabel: { fontSize: '0.8rem', fontWeight: '600', color: '#a0a0a0', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' },
  input: { 
    width: '100%', padding: '10px 12px', border: '1px solid rgba(255, 255, 255, 0.1)', 
    borderRadius: '10px', fontSize: '0.9rem', backgroundColor: 'rgba(40, 40, 40, 0.6)', 
    color: '#ffffff', boxSizing: 'border-box', transition: 'border-color 0.2s'
  },
  select: {
    width: '100%', padding: '10px 12px', border: '1px solid rgba(255, 255, 255, 0.1)', 
    borderRadius: '10px', fontSize: '0.9rem', backgroundColor: 'rgba(40, 40, 40, 0.6)', 
    color: '#ffffff', boxSizing: 'border-box', cursor: 'pointer'
  },

  // Filtros Rápidos (Badges)
  quickFilters: { display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' },
  quickFilterButton: {
    padding: '6px 12px', background: 'rgba(255,255,255,0.05)', color: '#a0a0a0',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', cursor: 'pointer',
    fontSize: '0.8rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px', transition: '0.2s'
  },
  quickFilterActive: { background: 'rgba(102, 126, 234, 0.2)', color: '#667eea', borderColor: 'rgba(102, 126, 234, 0.3)' },

  // Tabla
  tableSection: {
    background: 'rgba(25, 25, 25, 0.8)', backdropFilter: 'blur(20px)', borderRadius: '16px',
    padding: '24px', border: '1px solid rgba(255, 255, 255, 0.1)', position: 'relative', zIndex: 1
  },
  sectionHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' },
  sectionTitle: { fontSize: '1.2rem', fontWeight: '700', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px' },
  sectionCount: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '700' },

  tableContainer: { overflowX: 'auto', borderRadius: '12px', background: 'rgba(30, 30, 30, 0.4)' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' },
  th: { 
    padding: '14px 16px', backgroundColor: 'rgba(40, 40, 40, 0.9)', fontWeight: '700', 
    color: '#a0a0a0', textAlign: 'left', textTransform: 'uppercase', whiteSpace: 'nowrap',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  },
  td: { 
    padding: '14px 16px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', 
    color: '#e0e0e0', verticalAlign: 'middle' 
  },
  tableRow: { transition: 'background-color 0.2s ease' },
  
  // Badges
  statusBadge: { padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '4px' },
  statusCompleted: { background: 'rgba(39, 174, 96, 0.2)', color: '#2ecc71', border: '1px solid rgba(39, 174, 96, 0.3)' },
  statusPending: { background: 'rgba(255, 193, 7, 0.2)', color: '#fbbf24', border: '1px solid rgba(255, 193, 7, 0.3)' },
  statusFailed: { background: 'rgba(220, 53, 69, 0.2)', color: '#ff6b6b', border: '1px solid rgba(220, 53, 69, 0.3)' },
  
  // Estados UI
  loading: { textAlign: 'center', padding: '60px 20px', fontSize: '1.1rem', color: '#a0a0a0' },
  emptyState: { textAlign: 'center', padding: '60px 40px', color: '#a0a0a0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' },
  error: { background: 'rgba(220, 53, 69, 0.15)', color: '#ff6b6b', border: '1px solid rgba(220, 53, 69, 0.3)', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' },
  pulse: { animation: 'pulse 2s infinite' }
};

// Componente: Tarjeta de Estadística
const StatCard = ({ value, label, icon: Icon, trend, isPositive }) => (
  <div style={styles.statCard}>
    <div>
      <div style={styles.statLabel}>{label}</div>
      <div style={styles.statValue}>
        {typeof value === 'number' ? 
          (label.includes('Ingresos') || label.includes('Valor') ? `$${value.toFixed(2)}` : value) 
          : value
        }
      </div>
      {trend && (
        <div style={{...styles.statTrend, ...(isPositive ? styles.trendPositive : styles.trendNegative)}}>
          <FiActivity /> {isPositive ? '+' : ''}{trend}% vs periodo anterior
        </div>
      )}
    </div>
    <div style={styles.statIconWrapper}><Icon /></div>
  </div>
);

const AdminOrderReports = () => {
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState({ total_revenue: 0, total_orders: 0, daily_revenue: 0, avg_order_value: 0, previous_period_comparison: 0 });
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filtros
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateRange, setDateRange] = useState('today');

  // Carga inicial
  useEffect(() => {
    fetchCategories();
  }, []);

  // Carga de reportes al cambiar filtros
  useEffect(() => {
    fetchReports();
  }, [search, startDate, endDate, categoryId, statusFilter]);

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get('/api/categories-admin');
      setCategories(response.data);
    } catch (err) { console.error('Error fetching categories:', err); }
  };

  const applyQuickDateRange = (range) => {
    setDateRange(range);
    const today = new Date();
    const start = new Date();
    switch (range) {
        case 'today':
            setStartDate(today.toISOString().split('T')[0]);
            setEndDate(today.toISOString().split('T')[0]);
            break;
        case 'yesterday':
            start.setDate(today.getDate() - 1);
            setStartDate(start.toISOString().split('T')[0]);
            setEndDate(start.toISOString().split('T')[0]);
            break;
        case 'week':
            start.setDate(today.getDate() - 7);
            setStartDate(start.toISOString().split('T')[0]);
            setEndDate(today.toISOString().split('T')[0]);
            break;
        case 'month':
            start.setMonth(today.getMonth() - 1);
            setStartDate(start.toISOString().split('T')[0]);
            setEndDate(today.toISOString().split('T')[0]);
            break;
        default:
            setStartDate(''); setEndDate('');
    }
  };

  const fetchReports = async () => {
    setIsLoading(true); setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      if (categoryId) params.append('category_id', categoryId);
      if (statusFilter) params.append('status', statusFilter);

      const [summaryRes, ordersRes] = await Promise.all([
        apiClient.get(`/admin/reports/summary?${params}`),
        apiClient.get(`/admin/reports/orders?${params}`)
      ]);

      setSummary(summaryRes.data);
      setOrders(ordersRes.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar reportes.');
    } finally { setIsLoading(false); }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify({ summary, orders }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reporte-pedidos-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  // Helpers de renderizado
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'completado': return styles.statusCompleted;
      case 'pendiente': return styles.statusPending;
      case 'fallido': return styles.statusFailed;
      default: return styles.statusPending;
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completado': return <FiCheckCircle />;
      case 'pendiente': return <FiClock />;
      case 'fallido': return <FiXCircle />;
      default: return <FiClock />;
    }
  };

  const trend = summary.previous_period_comparison || 0;

  return (
    <div style={styles.container}>
      <div style={styles.backgroundDecoration} />
      
      {/* Header */}
      <div style={styles.headerSection}>
        <div>
          <h1 style={styles.headerTitle}><FiBarChart2 /> Reportes de Pedidos</h1>
          <div style={{fontSize:'0.9rem', color:'#888', marginTop:4}}>Analíticas y gestión avanzada de ventas</div>
        </div>
        <div style={styles.headerActions}>
          <button onClick={fetchReports} style={styles.secondaryButton}><FiRefreshCw /> Actualizar</button>
          <button onClick={handleExport} style={styles.mainButton} disabled={orders.length===0}><FiDownload /> Exportar JSON</button>
        </div>
      </div>

      {error && <div style={styles.error}><FiXCircle /> {error}</div>}

      {/* Métricas (Stats) */}
      <div style={styles.statsGrid}>
        <StatCard 
          label="Ingresos Totales" value={summary.total_revenue} icon={FiDollarSign} 
          trend={trend} isPositive={trend > 0} 
        />
        <StatCard label="Total Pedidos" value={summary.total_orders} icon={FiShoppingCart} />
        <StatCard label="Venta Diaria Prom." value={summary.daily_revenue} icon={FiTrendingUp} />
        <StatCard label="Ticket Promedio" value={summary.avg_order_value} icon={FiPackage} />
      </div>

      {/* Filtros */}
      <div style={styles.filterSection}>
        <div style={styles.quickFilters}>
            {['today', 'yesterday', 'week', 'month'].map(range => (
                <button key={range} onClick={() => applyQuickDateRange(range)} style={{...styles.quickFilterButton, ...(dateRange === range && styles.quickFilterActive)}}>
                    <FiCalendar size={12} /> {range === 'today' ? 'Hoy' : range === 'yesterday' ? 'Ayer' : range === 'week' ? 'Semana' : 'Mes'}
                </button>
            ))}
        </div>
        <div style={styles.filterGrid}>
          <div>
            <label style={styles.inputLabel}><FiSearch size={14} /> Buscar</label>
            <input style={styles.input} placeholder="ID, Cliente..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div>
            <label style={styles.inputLabel}><FiCalendar size={14} /> Desde</label>
            <input type="date" style={styles.input} value={startDate} onChange={e => { setStartDate(e.target.value); setDateRange('custom'); }} />
          </div>
          <div>
            <label style={styles.inputLabel}><FiCalendar size={14} /> Hasta</label>
            <input type="date" style={styles.input} value={endDate} onChange={e => { setEndDate(e.target.value); setDateRange('custom'); }} />
          </div>
          <div>
            <label style={styles.inputLabel}><FiFilter size={14} /> Categoría</label>
            <select style={styles.select} value={categoryId} onChange={e => setCategoryId(e.target.value)}>
              <option value="">Todas</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label style={styles.inputLabel}><FiActivity size={14} /> Estado</label>
            <select style={styles.select} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="">Todos</option>
              <option value="completado">Completado</option>
              <option value="pendiente">Pendiente</option>
              <option value="procesando">Procesando</option>
              <option value="fallido">Fallido</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div style={styles.tableSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}><FiFileText /> Detalle de Pedidos</h2>
          <div style={styles.sectionCount}>{orders.length} Registros</div>
        </div>

        {isLoading ? (
          <div style={styles.loading}><FiRefreshCw className="spin"/> Cargando datos...</div>
        ) : orders.length === 0 ? (
          <div style={styles.emptyState}>
            <FiDatabase size={48} color="#667eea"/>
            <h3>No se encontraron resultados</h3>
            <p>Ajusta los filtros para ver más datos.</p>
          </div>
        ) : (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Fecha</th>
                  <th style={styles.th}>Cliente</th>
                  <th style={styles.th}>Items</th>
                  <th style={styles.th}>Total</th>
                  <th style={styles.th}>Cupón</th>
                  <th style={styles.th}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, idx) => (
                  <tr key={order.id} style={{backgroundColor: idx%2===0 ? 'rgba(255,255,255,0.02)' : 'transparent'}}>
                    <td style={{...styles.td, fontFamily:'monospace'}}>#{order.id}</td>
                    <td style={styles.td}>{new Date(order.created_at).toLocaleDateString()}</td>
                    <td style={styles.td}>
                      <div style={{fontWeight:500}}>{order.username || 'Invitado'}</div>
                      <div style={{fontSize:'0.75rem', color:'#888'}}>{order.user_email}</div>
                    </td>
                    <td style={styles.td}>{order.item_count}</td>
                    <td style={{...styles.td, color:'#2ecc71', fontWeight:700}}>${parseFloat(order.total_amount_usd).toFixed(2)}</td>
                    <td style={styles.td}>{order.coupon_name || '-'}</td>
                    <td style={styles.td}>
                      <span style={{...styles.statusBadge, ...getStatusStyle(order.status)}}>
                        {getStatusIcon(order.status)} {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrderReports;