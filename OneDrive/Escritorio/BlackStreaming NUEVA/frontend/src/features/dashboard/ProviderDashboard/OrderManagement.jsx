// src/features/dashboard/ProviderDashboard/OrderManagement.jsx

import React, { useState, useEffect, useMemo } from 'react';
import apiClient from '../../../services/apiClient.js';
import { useAuth } from '../../../context/AuthContext';
import {
  FiSearch, FiFilter, FiRefreshCw, FiEdit, FiPlay, FiMessageCircle,
  FiUser, FiCalendar, FiDollarSign, FiClock, FiCheckCircle, FiXCircle,
  FiAlertTriangle, FiInfo, FiMail, FiSmartphone, FiPackage,
  FiChevronLeft, FiChevronRight, FiDownload, FiX, FiSettings,
  FiLock, FiHash, FiCreditCard
} from 'react-icons/fi';

// --- ESTILOS DARK GLASS THEME (Unificado) ---
const styles = {
  container: { 
    padding: '24px 16px', 
    fontFamily: "'Inter', sans-serif", 
    background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 50%, #0f0f0f 100%)',
    minHeight: '100vh',
    color: '#e0e0e0',
    position: 'relative'
  },
  backgroundDecoration: {
    position: 'absolute', top: 0, right: 0, width: '500px', height: '500px',
    background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)', zIndex: 0
  },
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

  mainButton: { 
    padding: '10px 20px', border: 'none', borderRadius: '10px', 
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
    color: 'white', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', display: 'flex', 
    alignItems: 'center', gap: '8px', transition: 'all 0.3s ease'
  },
  secondaryButton: {
    padding: '10px 20px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
    background: 'rgba(255,255,255,0.05)', color: '#e0e0e0', fontSize: '0.9rem', fontWeight: '600',
    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s ease'
  },

  // Stats Grid
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px', position: 'relative', zIndex: 1 },
  statCard: {
    background: 'rgba(25, 25, 25, 0.8)', backdropFilter: 'blur(20px)', borderRadius: '16px',
    padding: '20px', border: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'space-between'
  },
  statLabel: { fontSize: '0.85rem', color: '#a0a0a0', marginBottom: '8px' },
  statValue: { fontSize: '1.8rem', fontWeight: '700', margin: 0 },
  statIconWrapper: { width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' },

  // Filtros
  filterSection: {
    background: 'rgba(25, 25, 25, 0.8)', backdropFilter: 'blur(20px)', borderRadius: '16px',
    padding: '20px', border: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '24px', position: 'relative', zIndex: 1
  },
  quickFilters: { display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' },
  quickFilterButton: {
    padding: '8px 16px', background: 'rgba(255,255,255,0.05)', color: '#a0a0a0',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', cursor: 'pointer',
    fontSize: '0.85rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px', transition: '0.2s'
  },
  quickFilterActive: { background: 'rgba(102, 126, 234, 0.2)', color: '#667eea', borderColor: 'rgba(102, 126, 234, 0.3)' },
  
  filterGroup: { display: 'flex', flexWrap: 'wrap', gap: '15px' },
  inputLabel: { fontSize: '0.8rem', fontWeight: '600', color: '#a0a0a0', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' },
  input: { 
    width: '100%', padding: '10px 12px', border: '1px solid rgba(255, 255, 255, 0.1)', 
    borderRadius: '10px', fontSize: '0.9rem', backgroundColor: 'rgba(40, 40, 40, 0.6)', 
    color: '#ffffff', boxSizing: 'border-box'
  },
  select: {
    width: '100%', padding: '10px 12px', border: '1px solid rgba(255, 255, 255, 0.1)', 
    borderRadius: '10px', fontSize: '0.9rem', backgroundColor: 'rgba(40, 40, 40, 0.6)', 
    color: '#ffffff', boxSizing: 'border-box', cursor: 'pointer'
  },

  // Tabla
  tableSection: {
    background: 'rgba(25, 25, 25, 0.8)', backdropFilter: 'blur(20px)', borderRadius: '16px',
    padding: '24px', border: '1px solid rgba(255, 255, 255, 0.1)', position: 'relative', zIndex: 1
  },
  sectionTitle: { color: '#fff', fontSize: '1.2rem', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' },
  tableContainer: { overflowX: 'auto', borderRadius: '12px' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' },
  th: { padding: '12px 16px', backgroundColor: 'rgba(40, 40, 40, 0.8)', fontWeight: '700', color: '#a0a0a0', textAlign: 'left', textTransform: 'uppercase', whiteSpace: 'nowrap' },
  td: { padding: '12px 16px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', color: '#e0e0e0', verticalAlign: 'middle' },
  
  // Estilo especial para la celda de credenciales
  credentialsCell: {
    display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.8rem', 
    background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)'
  },
  credentialItem: { display: 'flex', alignItems: 'center', gap: '6px', color: '#ccc' },
  credentialIcon: { color: '#667eea', minWidth: '14px' },

  statusBadge: { padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content' },
  actionButtonsColumn: { display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '140px' },
  actionButtonSm: { 
    padding: '6px 10px', border: 'none', borderRadius: '6px', cursor: 'pointer', 
    fontSize: '0.75rem', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', width: '100%'
  },
  btnActivate: { background: 'rgba(39, 174, 96, 0.2)', color: '#2ecc71', border: '1px solid rgba(39, 174, 96, 0.3)' },
  btnEdit: { background: 'rgba(102, 126, 234, 0.2)', color: '#667eea', border: '1px solid rgba(102, 126, 234, 0.3)' },
  btnContact: { background: 'rgba(255, 193, 7, 0.2)', color: '#ffc107', border: '1px solid rgba(255, 193, 7, 0.3)' },
  btnDisabled: { background: 'rgba(255, 255, 255, 0.05)', color: '#666', border: '1px solid rgba(255, 255, 255, 0.05)', cursor: 'not-allowed' },

  // Paginación
  paginationWrapper: { display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '16px 0 0 0', marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', gap: '12px' },
  pageBtn: { display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', color: '#e0e0e0', transition: 'all 0.2s' },
  pageBtnDisabled: { opacity: 0.5, cursor: 'not-allowed' },

  // Modales
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' },
  modalContent: { background: '#1a1a1a', borderRadius: '16px', padding: '30px', width: '100%', maxWidth: '500px', border: '1px solid rgba(255,255,255,0.1)', position: 'relative' },
  modalTitle: { fontSize: '1.5rem', fontWeight: '700', marginBottom: '20px', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' },
  modalCloseBtn: { position: 'absolute', top: '15px', right: '20px', background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1.2rem' },
  modalRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem' },
  modalInput: { width: '100%', padding: '12px', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', marginBottom: '16px', background: 'rgba(0,0,0,0.2)', color: '#fff' },

  loading: { textAlign: 'center', padding: '60px 20px', fontSize: '1.2rem', color: '#a0a0a0' },
  error: { background: 'rgba(220, 53, 69, 0.15)', color: '#ff6b6b', border: '1px solid rgba(220, 53, 69, 0.3)', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' },
};

// --- Helpers de fechas ---
const getRemainingDaysStatus = (endDateObject, totalDuration, itemStatus) => {
  if (itemStatus !== 'activo') return { text: 'Pendiente', color: '#f1c40f', icon: <FiClock /> };
  if (!endDateObject) return { text: 'Activo (S/F)', color: '#2ecc71', icon: <FiCheckCircle /> };
  
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const end = new Date(endDateObject.getTime()); end.setHours(0, 0, 0, 0);
  const remainingDays = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (remainingDays <= 0) return { text: 'Expirado', color: '#e74c3c', icon: <FiXCircle /> };
  
  return { text: `${remainingDays} días`, color: '#2ecc71', icon: <FiCheckCircle /> };
};

const OrderManagement = () => {
  const { isAuthenticated, user } = useAuth();
  const [allOrderItems, setAllOrderItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortType, setSortType] = useState('pending');
  const [statusFilter, setStatusFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all'); 
  
  const [lastUpdated, setLastUpdated] = useState(null);

  // Modales
  const [modalType, setModalType] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItemData, setEditingItemData] = useState({ email: '', password: '', profile_name: '', pin: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --- FUNCIÓN CORREGIDA PARA CALCULAR FECHAS CORRECTAMENTE ---
  const fetchProviderOrders = async () => {
    if (!isAuthenticated || user.role !== 'proveedor') return setError('Acceso denegado.');
    try {
      setIsLoading(true); setError(null);
      const response = await apiClient.get('/provider/orders');
      
      const mappedItems = response.data.map(item => {
        // 1. Obtener fecha de inicio
        const startDate = item.activation_date ? new Date(item.activation_date) : null;
        
        // 2. Obtener duración (asegurar que es entero)
        const duration = parseInt(item.duration_days, 10) || 0;
        
        // 3. Calcular fecha fin sumando días (forma segura)
        let endDate = null;
        if (startDate && duration > 0) {
            endDate = new Date(startDate.getTime()); // Clonar fecha
            endDate.setDate(endDate.getDate() + duration); // Sumar días nativos
        }

        return {
          orderItemId: item.order_item_id, stockItemId: item.stock_item_id, orderDate: item.order_date,
          productName: item.product_name || '[Borrado]',
          email: item.email || '', password: item.password || '', profileName: item.profile_name || '', pin: item.pin || '',
          clientName: item.buyer_username || item.manual_customer_name || 'N/A',
          clientPhone: (item.buyer_phone_prefix && item.buyer_phone_number) ? `${item.buyer_phone_prefix}${item.buyer_phone_number}` : item.manual_customer_phone || 'N/A',
          itemStatus: item.order_item_status,
          startDate: startDate ? startDate.toLocaleDateString('es-ES') : 'N/A',
          endDate: endDate ? endDate.toLocaleDateString('es-ES') : 'N/A',
          endDateObject: endDate, 
          totalDuration: duration,
          price: item.price_per_unit_usd, hasRenewal: item.has_renewal, renewalPrice: item.renewal_price_usd,
        };
      });
      setAllOrderItems(mappedItems); setLastUpdated(new Date());
    } catch (err) { setError('Error al cargar pedidos.'); } finally { setIsLoading(false); }
  };

  useEffect(() => { if (isAuthenticated) fetchProviderOrders(); }, [isAuthenticated]);

  // --- Lógica de Filtrado ---
  const filteredItems = useMemo(() => {
    let items = [...allOrderItems];
    
    // 1. Búsqueda
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      items = items.filter(i => i.productName.toLowerCase().includes(lower) || i.clientName.toLowerCase().includes(lower) || i.email.toLowerCase().includes(lower));
    }
    
    // 2. Estado
    if (statusFilter !== 'all') items = items.filter(i => i.itemStatus === statusFilter);
    
    // 3. Tiempo
    if (timeFilter !== 'all') {
        const now = new Date();
        now.setHours(0,0,0,0); 
        const msPerDay = 24 * 60 * 60 * 1000;

        items = items.filter(item => {
            const orderDate = new Date(item.orderDate);
            orderDate.setHours(0,0,0,0);
            const diffTime = now - orderDate;
            const diffDays = Math.ceil(diffTime / msPerDay);

            if (timeFilter === 'today') return diffDays === 0;
            if (timeFilter === 'yesterday') return diffDays === 1;
            if (timeFilter === 'week') return diffDays <= 7;
            if (timeFilter === 'month') return diffDays <= 30;
            return true;
        });
    }

    // 4. Ordenación
    if (sortType === 'pending') items.sort((a, b) => (a.itemStatus === 'pendiente' ? -1 : 1));
    else if (sortType === 'recent') items.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
    else if (sortType === 'days_asc') items.sort((a, b) => {
        return 0; 
    });
    
    return items;
  }, [allOrderItems, searchTerm, sortType, statusFilter, timeFilter]);

  // Estadísticas
  const stats = useMemo(() => ({
    total: filteredItems.length,
    pending: filteredItems.filter(i => i.itemStatus === 'pendiente').length,
    active: filteredItems.filter(i => i.itemStatus === 'activo').length,
    revenue: filteredItems.reduce((sum, i) => sum + (parseFloat(i.price) || 0), 0)
  }), [filteredItems]);

  useEffect(() => setCurrentPage(1), [searchTerm, statusFilter, sortType, timeFilter]);
  const currentItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handleExportCSV = () => {
    if (filteredItems.length === 0) return alert('Nada que exportar.');
    const headers = ["ID", "Producto", "Cliente", "Teléfono", "Precio", "Estado", "Inicio", "Fin", "Email Cuenta", "Contraseña", "Perfil", "PIN"];
    const rows = filteredItems.map(i => [
      i.orderItemId, `"${i.productName}"`, `"${i.clientName}"`, `"${i.clientPhone}"`, i.price, i.itemStatus,
      i.startDate, i.endDate, `"${i.email}"`, `"${i.password}"`, `"${i.profileName}"`, `"${i.pin}"`
    ].join(','));
    const blob = new Blob(['\uFEFF' + [headers.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob);
    link.download = `pedidos_${new Date().toISOString().slice(0,10)}.csv`; document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const closeModal = () => { setModalType(null); setSelectedItem(null); setIsSubmitting(false); };
  const handleActivate = async () => {
    if (isSubmitting) return; setIsSubmitting(true);
    try { await apiClient.post(`/provider/orders/activate/${selectedItem.orderItemId}`); alert('¡Activado!'); fetchProviderOrders(); closeModal(); } 
    catch (err) { alert('Error al activar'); } finally { setIsSubmitting(false); }
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault(); if (isSubmitting) return; setIsSubmitting(true);
    try { await apiClient.put(`/provider/stock-items/${selectedItem.stockItemId}`, editingItemData); alert('¡Actualizado!'); fetchProviderOrders(); closeModal(); } 
    catch (err) { alert('Error al actualizar'); } finally { setIsSubmitting(false); }
  };

  if (isLoading) return <div style={styles.loading}><FiRefreshCw className="animate-spin" size={30}/> Cargando...</div>;
  if (error) return <div style={styles.error}><FiXCircle /> {error} <button onClick={fetchProviderOrders} style={styles.secondaryButton}>Reintentar</button></div>;

  return (
    <div style={styles.container}>
      <div style={styles.backgroundDecoration} />
      
      {/* Header */}
      <div style={styles.headerSection}>
        <div>
          <h1 style={styles.headerTitle}><FiPackage /> Gestión de Pedidos</h1>
          {lastUpdated && <small style={{color:'#888', display:'flex', alignItems:'center', gap:4}}><FiClock size={12}/> Actualizado: {lastUpdated.toLocaleTimeString()}</small>}
        </div>
        <div style={styles.headerActions}>
          <button style={styles.secondaryButton} onClick={handleExportCSV}><FiDownload /> Exportar Excel</button>
          <button style={styles.mainButton} onClick={fetchProviderOrders}><FiRefreshCw /> Actualizar</button>
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div><div style={styles.statLabel}>Total</div><div style={styles.statValue}>{stats.total}</div></div>
          <div style={{...styles.statIconWrapper, background: 'rgba(102, 126, 234, 0.2)', color: '#667eea'}}><FiPackage /></div>
        </div>
        <div style={styles.statCard}>
          <div><div style={styles.statLabel}>Pendientes</div><div style={{...styles.statValue, color:'#f1c40f'}}>{stats.pending}</div></div>
          <div style={{...styles.statIconWrapper, background: 'rgba(241, 196, 15, 0.2)', color: '#f1c40f'}}><FiClock /></div>
        </div>
        <div style={styles.statCard}>
          <div><div style={styles.statLabel}>Activos</div><div style={{...styles.statValue, color:'#2ecc71'}}>{stats.active}</div></div>
          <div style={{...styles.statIconWrapper, background: 'rgba(46, 204, 113, 0.2)', color: '#2ecc71'}}><FiCheckCircle /></div>
        </div>
        <div style={styles.statCard}>
          <div><div style={styles.statLabel}>Ingresos</div><div style={{...styles.statValue, color:'#9b59b6'}}>${stats.revenue.toFixed(2)}</div></div>
          <div style={{...styles.statIconWrapper, background: 'rgba(155, 89, 182, 0.2)', color: '#9b59b6'}}><FiDollarSign /></div>
        </div>
      </div>

      {/* Filtros */}
      <div style={styles.filterSection}>
        <div style={styles.quickFilters}>
          {['all', 'pendiente', 'activo'].map(filter => (
            <button key={filter} onClick={() => setStatusFilter(filter)} style={{...styles.quickFilterButton, ...(statusFilter === filter ? styles.quickFilterActive : {})}}>
              {filter === 'all' ? <FiFilter/> : filter === 'pendiente' ? <FiClock/> : <FiCheckCircle/>} {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
        <div style={styles.filterGroup}>
          <div style={{flex: '1 1 200px'}}>
            <label style={styles.inputLabel}><FiSearch size={14}/> Buscar</label>
            <input style={styles.input} placeholder="Producto, cliente..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <div style={{flex: '1 1 180px'}}>
            <label style={styles.inputLabel}><FiCalendar size={14}/> Tiempo</label>
            <select style={styles.select} value={timeFilter} onChange={e => setTimeFilter(e.target.value)}>
                <option value="all">Todo el tiempo</option>
                <option value="today">Hoy</option>
                <option value="yesterday">Ayer</option>
                <option value="week">Última Semana</option>
                <option value="month">Último Mes</option>
            </select>
          </div>
          <div style={{flex: '1 1 180px'}}>
            <label style={styles.inputLabel}><FiFilter size={14}/> Ordenar</label>
            <select style={styles.select} value={sortType} onChange={e => setSortType(e.target.value)}>
              <option value="pending">Pendientes Primero</option>
              <option value="recent">Más Recientes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div style={styles.tableSection}>
        <div style={styles.sectionTitle}>
          <FiPackage color="#667eea" /> Lista de Pedidos <span style={{fontSize:'0.9rem', color:'#888', fontWeight:'normal'}}>({filteredItems.length})</span>
        </div>
        {filteredItems.length === 0 ? (
          <div style={{textAlign:'center', padding: '40px', color:'#888'}}>No se encontraron pedidos.</div>
        ) : (
          <>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}><FiPackage /> Producto</th>
                    <th style={styles.th}><FiUser /> Cliente</th>
                    <th style={styles.th}><FiInfo /> Datos de Cuenta</th>
                    <th style={styles.th}><FiDollarSign /> Precio</th>
                    <th style={styles.th}><FiCalendar /> Inicio</th> {/* NUEVA COLUMNA */}
                    <th style={styles.th}><FiCalendar /> Vence</th>
                    <th style={styles.th}>Estado</th>
                    <th style={styles.th}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item, idx) => {
                    const status = getRemainingDaysStatus(item.endDateObject, item.totalDuration, item.itemStatus);
                    return (
                      <tr key={item.orderItemId} style={{backgroundColor: idx%2===0 ? 'rgba(255,255,255,0.02)' : 'transparent'}}>
                        <td style={styles.td}>
                          <strong>{item.productName}</strong><br/>
                          <small style={{color:'#888'}}>ID: {item.orderItemId}</small>
                        </td>
                        <td style={styles.td}>
                          {item.clientName}<br/>
                          <small style={{color:'#888', display:'flex', alignItems:'center', gap:4}}><FiSmartphone size={10}/> {item.clientPhone}</small>
                        </td>
                        <td style={styles.td}>
                            {item.stockItemId ? (
                                <div style={styles.credentialsCell}>
                                    <div style={styles.credentialItem} title="Email"><FiMail style={styles.credentialIcon} /> {item.email || '-'}</div>
                                    <div style={styles.credentialItem} title="Pass"><FiLock style={styles.credentialIcon} /> {item.password || '-'}</div>
                                    {(item.profileName || item.pin) && (
                                        <div style={{...styles.credentialItem, fontSize:'0.75rem', color:'#888', marginTop:2}}>
                                            {item.profileName && <span title="Perfil"><FiUser size={10}/> {item.profileName}</span>}
                                            {item.pin && <span title="PIN"><FiHash size={10}/> {item.pin}</span>}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <span style={{fontStyle:'italic', color:'#666'}}>Pendiente de asignar</span>
                            )}
                        </td>
                        <td style={styles.td}>${parseFloat(item.price||0).toFixed(2)}</td>
                        
                        {/* COLUMNA INICIO */}
                        <td style={styles.td}>{item.startDate}</td>

                        <td style={styles.td}>{item.endDate}</td>
                        <td style={styles.td}>
                          <span style={{...styles.statusBadge, background: `${status.color}33`, color: status.color, border: `1px solid ${status.color}55`}}>
                            {status.icon} {status.text}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <div style={styles.actionButtonsColumn}>
                            {item.itemStatus === 'pendiente' && (
                              <button onClick={() => {setSelectedItem(item); setModalType('activate');}} style={{...styles.actionButtonSm, ...styles.btnActivate}}>
                                <FiPlay size={12}/> Activar
                              </button>
                            )}
                            <button 
                              onClick={() => {
                                setSelectedItem(item); 
                                setEditingItemData({email: item.email, password: item.password, profile_name: item.profileName, pin: item.pin}); 
                                setModalType('edit');
                              }} 
                              style={{...styles.actionButtonSm, ...(item.stockItemId ? styles.btnEdit : styles.btnDisabled)}}
                              disabled={!item.stockItemId}
                            >
                              <FiEdit size={12}/> Editar
                            </button>
                            {item.clientPhone !== 'N/A' && (
                                <button onClick={() => window.open(`https://wa.me/${item.clientPhone.replace(/\D/g,'')}`, '_blank')} style={{...styles.actionButtonSm, ...styles.btnContact}}>
                                    <FiMessageCircle size={12}/> Contactar
                                </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filteredItems.length > 0 && (
                <div style={styles.paginationWrapper}>
                    <span style={{fontSize:'0.9rem', color:'#888'}}>Página {currentPage} de {totalPages}</span>
                    <button onClick={() => setCurrentPage(p => p-1)} disabled={currentPage===1} style={{...styles.pageBtn, ...(currentPage===1?styles.pageBtnDisabled:{})}}><FiChevronLeft/> Anterior</button>
                    <button onClick={() => setCurrentPage(p => p+1)} disabled={currentPage===totalPages} style={{...styles.pageBtn, ...(currentPage===totalPages?styles.pageBtnDisabled:{})}}>Siguiente <FiChevronRight/></button>
                </div>
            )}
          </>
        )}
      </div>

      {/* Modales */}
      {modalType && selectedItem && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button onClick={closeModal} style={styles.modalCloseBtn}><FiX /></button>
            
            {modalType === 'activate' ? (
              <>
                <h3 style={{...styles.modalTitle, color: '#2ecc71'}}><FiPlay /> Activar Pedido</h3>
                <div style={styles.modalRow}><span style={{color:'#888'}}>Producto:</span> <span>{selectedItem.productName}</span></div>
                <button onClick={handleActivate} disabled={isSubmitting} style={{...styles.mainButton, width:'100%', justifyContent:'center', background: isSubmitting ? '#555' : '#2ecc71'}}>
                    {isSubmitting ? 'Activando...' : 'Confirmar Activación'}
                </button>
              </>
            ) : (
              <form onSubmit={handleEditSubmit}>
                <h3 style={{...styles.modalTitle, color: '#667eea'}}><FiEdit /> Editar Cuenta</h3>
                <div style={styles.modalRow}><span style={{color:'#888'}}>Producto:</span> <span>{selectedItem.productName}</span></div>
                {['email', 'password', 'profile_name', 'pin'].map(field => (
                    <div key={field} style={{marginBottom: 12}}>
                        <label style={{display:'block', marginBottom:4, fontSize:'0.8rem', color:'#aaa', textTransform:'capitalize'}}>{field.replace('_',' ')}</label>
                        <input 
                            style={styles.modalInput} 
                            value={editingItemData[field]} 
                            onChange={e => setEditingItemData({...editingItemData, [field]: e.target.value})}
                        />
                    </div>
                ))}
                <button type="submit" disabled={isSubmitting} style={{...styles.mainButton, width:'100%', justifyContent:'center', marginTop: 20}}>
                    {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;