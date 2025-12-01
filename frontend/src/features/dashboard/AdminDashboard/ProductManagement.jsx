// src/features/dashboard/AdminDashboard/ProductManagement.jsx

import React, { useState, useEffect, useMemo } from 'react';
import apiClient from '/src/services/apiClient.js';
import {
  FiPlus, FiEdit, FiTrash2, FiImage, FiSave, FiX,
  FiFolder, FiTag, FiCheckCircle, FiAlertCircle, FiXCircle,
  FiPackage, FiDollarSign, FiShoppingBag, FiArchive,
  FiSearch, FiFilter, FiRefreshCw, FiDownload, FiChevronLeft, FiChevronRight,
  FiTrendingUp, FiLayers
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
  tableContainer: { overflowX: 'auto', borderRadius: '12px', minHeight: '300px' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' },
  th: { padding: '14px 16px', backgroundColor: 'rgba(40, 40, 40, 0.8)', fontWeight: '700', color: '#a0a0a0', textAlign: 'left', textTransform: 'uppercase', whiteSpace: 'nowrap' },
  td: { padding: '14px 16px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', color: '#e0e0e0', verticalAlign: 'middle' },
  
  // Imagen Producto
  productImage: { width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' },
  placeholderImage: { width: '48px', height: '48px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' },

  // Badges y Botones
  badge: { padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '4px' },
  
  statusActive: { background: 'rgba(76, 175, 80, 0.15)', color: '#4CAF50', border: '1px solid rgba(76, 175, 80, 0.3)' },
  statusInactive: { background: 'rgba(158, 158, 158, 0.15)', color: '#9E9E9E', border: '1px solid rgba(158, 158, 158, 0.3)' },
  
  stockIn: { background: 'rgba(39, 174, 96, 0.15)', color: '#2ecc71', border: '1px solid rgba(39, 174, 96, 0.3)' },
  stockLow: { background: 'rgba(255, 193, 7, 0.15)', color: '#fbbf24', border: '1px solid rgba(255, 193, 7, 0.3)' },
  stockOut: { background: 'rgba(220, 53, 69, 0.15)', color: '#ff6b6b', border: '1px solid rgba(220, 53, 69, 0.3)' },

  actionButtonsWrapper: { display: 'flex', gap: '8px' },
  actionButton: { 
    padding: '6px', borderRadius: '8px', cursor: 'pointer', border: 'none', 
    display: 'flex', alignItems: 'center', justifyContent: 'center', 
    fontSize: '0.8rem', fontWeight: '600', transition: '0.2s' 
  },
  btnEdit: { background: 'rgba(102, 126, 234, 0.15)', color: '#667eea', border: '1px solid rgba(102, 126, 234, 0.3)' },
  btnDelete: { background: 'rgba(220, 53, 69, 0.15)', color: '#ff6b6b', border: '1px solid rgba(220, 53, 69, 0.3)' },

  // Paginación
  paginationWrapper: { display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '16px 0 0 0', marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', gap: '12px' },
  pageBtn: { display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', color: '#e0e0e0', transition: 'all 0.2s' },
  pageBtnDisabled: { opacity: 0.5, cursor: 'not-allowed' },

  // Modales
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' },
  modalContent: { background: '#1a1a1a', borderRadius: '16px', padding: '30px', width: '100%', maxWidth: '600px', border: '1px solid rgba(255,255,255,0.1)', position: 'relative', maxHeight: '90vh', overflowY: 'auto' },
  modalTitle: { fontSize: '1.5rem', fontWeight: '700', marginBottom: '20px', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' },
  modalCloseBtn: { position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1.2rem' },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' },

  // Feedback
  loading: { textAlign: 'center', padding: '60px 20px', fontSize: '1.2rem', color: '#a0a0a0' },
  error: { background: 'rgba(220, 53, 69, 0.15)', color: '#ff6b6b', border: '1px solid rgba(220, 53, 69, 0.3)', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' },
  successMsg: { background: 'rgba(39, 174, 96, 0.15)', color: '#2ecc71', border: '1px solid rgba(39, 174, 96, 0.3)', padding: '12px', borderRadius: '10px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }
};

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Filtros y Paginación
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [sortType, setSortType] = useState('name_asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '', description: '', image_url: '', category_id: '',
    price_usd: '', fictitious_price_usd: '', offer_price_usd: '',
    stock_quantity: '', status: 'activo', tags: '',
  });

  // --- Cargar Datos ---
  const fetchData = async () => {
    try {
      setLoading(true); setError(null);
      const [prodRes, catRes] = await Promise.all([
        apiClient.get('/admin/products'),
        apiClient.get('/categories-admin')
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Error al cargar datos del sistema.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // --- Helpers Lógica ---
  const getStockStatus = (stock) => {
    const qty = parseInt(stock) || 0;
    if (qty === 0) return 'out';
    if (qty < 10) return 'low';
    return 'in';
  };

  // --- Filtrado y Ordenamiento ---
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Buscador
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(lower) || 
        (p.provider_name && p.provider_name.toLowerCase().includes(lower))
      );
    }

    // 2. Categoría
    if (categoryFilter !== 'all') {
      result = result.filter(p => p.category_id.toString() === categoryFilter);
    }

    // 3. Stock
    if (stockFilter !== 'all') {
      result = result.filter(p => getStockStatus(p.stock_quantity) === stockFilter);
    }

    // 4. Ordenamiento
    if (sortType === 'price_desc') result.sort((a, b) => parseFloat(b.price_usd) - parseFloat(a.price_usd));
    else if (sortType === 'price_asc') result.sort((a, b) => parseFloat(a.price_usd) - parseFloat(b.price_usd));
    else if (sortType === 'stock_asc') result.sort((a, b) => (a.stock_quantity || 0) - (b.stock_quantity || 0));
    else if (sortType === 'name_asc') result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [products, searchTerm, categoryFilter, stockFilter, sortType]);

  // Estadísticas
  const stats = useMemo(() => ({
    total: products.length,
    activeValue: products.reduce((acc, p) => acc + (parseFloat(p.price_usd) * (p.stock_quantity || 0)), 0),
    lowStock: products.filter(p => getStockStatus(p.stock_quantity) === 'low').length,
    outStock: products.filter(p => getStockStatus(p.stock_quantity) === 'out').length
  }), [products]);

  // Paginación
  useEffect(() => setCurrentPage(1), [searchTerm, categoryFilter, stockFilter, sortType]);
  const currentProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // --- Handlers ---
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await apiClient.delete(`/admin/products/${id}`);
        setMessage('Producto eliminado.');
        fetchData();
        setTimeout(() => setMessage(null), 3000);
      } catch (err) { setError('No se pudo eliminar el producto.'); }
    }
  };

  const openModal = (product = null) => {
    setEditingProduct(product);
    if (product) {
      setFormData({
        name: product.name || '', description: product.description || '',
        image_url: product.image_url || '', category_id: product.category_id || '',
        price_usd: product.price_usd || '', fictitious_price_usd: product.fictitious_price_usd || '',
        offer_price_usd: product.offer_price_usd || '', stock_quantity: product.stock_quantity || 0,
        status: product.status || 'activo', tags: Array.isArray(product.tags) ? product.tags.join(', ') : (product.tags || ''),
      });
    } else {
      setFormData({
        name: '', description: '', image_url: '', category_id: '',
        price_usd: '', fictitious_price_usd: '', offer_price_usd: '',
        stock_quantity: 0, status: 'activo', tags: '',
      });
    }
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = { ...formData };
      if (typeof payload.tags === 'string') payload.tags = payload.tags.split(',').map(t => t.trim()).filter(t => t);
      payload.price_usd = parseFloat(payload.price_usd) || 0;
      payload.stock_quantity = parseInt(payload.stock_quantity) || 0;
      payload.category_id = parseInt(payload.category_id) || null;

      if (editingProduct) {
        await apiClient.put(`/admin/products/${editingProduct.id}`, payload);
        setMessage('Producto actualizado.');
      } else {
        await apiClient.post(`/admin/products`, payload);
        setMessage('Producto creado.');
      }
      setShowModal(false);
      fetchData();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setError('Error al guardar el producto.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportCSV = () => {
    if (filteredProducts.length === 0) return alert('No hay datos.');
    const headers = ["ID", "Nombre", "Categoría", "Precio", "Stock", "Estado", "Proveedor"];
    const rows = filteredProducts.map(p => [
      p.id, `"${p.name}"`, `"${p.category_name}"`, p.price_usd, p.stock_quantity, p.status, `"${p.provider_name}"`
    ].join(','));
    const blob = new Blob(['\uFEFF' + [headers.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob);
    link.download = `inventario_${new Date().toISOString().slice(0,10)}.csv`; document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const getStockStyle = (stock) => {
    const status = getStockStatus(stock);
    if(status === 'in') return styles.stockIn;
    if(status === 'low') return styles.stockLow;
    return styles.stockOut;
  };

  if (loading && !products.length) return <div style={styles.loading}><FiRefreshCw className="animate-spin" size={30}/> Cargando inventario...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.backgroundDecoration} />
      
      {/* HEADER */}
      <div style={styles.headerSection}>
        <div>
          <h1 style={styles.headerTitle}><FiPackage /> Gestión de Productos</h1>
          {lastUpdated && <small style={{color:'#888', display:'flex', alignItems:'center', gap:4, marginTop:4}}>Actualizado: {lastUpdated.toLocaleTimeString()}</small>}
        </div>
        <div style={styles.headerActions}>
          <button style={styles.secondaryButton} onClick={handleExportCSV}><FiDownload /> CSV</button>
          <button style={styles.mainButton} onClick={() => openModal()}><FiPlus /> Nuevo Producto</button>
        </div>
      </div>

      {/* STATS */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div><div style={styles.statLabel}>Total Productos</div><div style={styles.statValue}>{stats.total}</div></div>
          <div style={{...styles.statIconWrapper, background: 'rgba(102, 126, 234, 0.2)', color: '#667eea'}}><FiFolder /></div>
        </div>
        <div style={styles.statCard}>
          <div><div style={styles.statLabel}>Valor Inventario</div><div style={{...styles.statValue, color:'#2ecc71'}}>${stats.activeValue.toFixed(0)}</div></div>
          <div style={{...styles.statIconWrapper, background: 'rgba(46, 204, 113, 0.2)', color: '#2ecc71'}}><FiDollarSign /></div>
        </div>
        <div style={styles.statCard}>
          <div><div style={styles.statLabel}>Bajo Stock</div><div style={{...styles.statValue, color:'#fbbf24'}}>{stats.lowStock}</div></div>
          <div style={{...styles.statIconWrapper, background: 'rgba(255, 193, 7, 0.2)', color: '#fbbf24'}}><FiAlertCircle /></div>
        </div>
        <div style={styles.statCard}>
          <div><div style={styles.statLabel}>Agotados</div><div style={{...styles.statValue, color:'#ff6b6b'}}>{stats.outStock}</div></div>
          <div style={{...styles.statIconWrapper, background: 'rgba(220, 53, 69, 0.2)', color: '#ff6b6b'}}><FiArchive /></div>
        </div>
      </div>

      {/* FEEDBACK */}
      {message && <div style={styles.successMsg}><FiCheckCircle size={18}/> {message}</div>}
      {error && <div style={styles.error}><FiAlertCircle size={18}/> {error} <button onClick={() => setError(null)} style={{background:'none', border:'none', color:'inherit', marginLeft:'auto'}}><FiX/></button></div>}

      {/* FILTROS */}
      <div style={styles.filterSection}>
        <div style={styles.quickFilters}>
          {['all', 'in', 'low', 'out'].map(filter => (
            <button key={filter} onClick={() => setStockFilter(filter)} style={{...styles.quickFilterButton, ...(stockFilter === filter ? styles.quickFilterActive : {})}}>
              {filter === 'all' ? <FiFilter/> : filter === 'in' ? <FiCheckCircle size={12}/> : filter === 'low' ? <FiAlertCircle size={12}/> : <FiXCircle size={12}/>} 
              {filter === 'all' ? 'Todo' : filter === 'in' ? 'En Stock' : filter === 'low' ? 'Bajo Stock' : 'Agotado'}
            </button>
          ))}
        </div>

        <div style={styles.filterGroup}>
          <div style={{flex: '1 1 200px'}}>
            <label style={styles.inputLabel}><FiSearch size={14}/> Buscar</label>
            <input style={styles.input} placeholder="Nombre producto, proveedor..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <div style={{flex: '1 1 150px'}}>
            <label style={styles.inputLabel}><FiTag size={14}/> Categoría</label>
            <select style={styles.select} value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                <option value="all">Todas</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div style={{flex: '1 1 150px'}}>
            <label style={styles.inputLabel}><FiTrendingUp size={14}/> Ordenar</label>
            <select style={styles.select} value={sortType} onChange={e => setSortType(e.target.value)}>
              <option value="name_asc">Nombre (A-Z)</option>
              <option value="price_desc">Mayor Precio</option>
              <option value="price_asc">Menor Precio</option>
              <option value="stock_asc">Menor Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABLA */}
      <div style={styles.tableSection}>
        <div style={styles.sectionTitle}>
          <FiFolder color="#667eea" /> Inventario <span style={{fontSize:'0.9rem', color:'#888', fontWeight:'normal'}}>({filteredProducts.length})</span>
        </div>

        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}><FiImage /> Imagen</th>
                <th style={styles.th}><FiPackage /> Detalles</th>
                <th style={styles.th}><FiTag /> Categoría</th>
                <th style={styles.th}><FiDollarSign /> Precio</th>
                <th style={styles.th}><FiShoppingBag /> Stock</th>
                <th style={styles.th}>Estado</th>
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.length > 0 ? currentProducts.map((product, idx) => (
                <tr key={product.id} style={{backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.02)', transition: '0.2s'}}>
                  <td style={styles.td}>
                    {product.image_url ? 
                      <img src={product.image_url} alt="img" style={styles.productImage} onError={(e) => e.target.style.display='none'} /> : 
                      <div style={styles.placeholderImage}><FiImage /></div>
                    }
                  </td>
                  <td style={styles.td}>
                    <div style={{fontWeight:'bold', color:'#fff'}}>{product.name}</div>
                    <div style={{fontSize:'0.8rem', color:'#888'}}>{product.provider_name || 'Sin proveedor'}</div>
                  </td>
                  <td style={styles.td}>{product.category_name || '-'}</td>
                  <td style={styles.td}>
                    <div style={{fontWeight:'bold', color:'#fff'}}>${parseFloat(product.price_usd).toFixed(2)}</div>
                    {product.offer_price_usd && <div style={{fontSize:'0.75rem', textDecoration:'line-through', color:'#666'}}>${product.offer_price_usd}</div>}
                  </td>
                  <td style={styles.td}>
                    <span style={{...styles.badge, ...getStockStyle(product.stock_quantity)}}>
                       {product.stock_quantity || 0} unid.
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={{...styles.badge, ...(product.status === 'activo' ? styles.statusActive : styles.statusInactive)}}>
                        {product.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={{...styles.actionButtonsWrapper, justifyContent:'flex-end'}}>
                      <button style={{...styles.actionButton, ...styles.btnEdit}} onClick={() => openModal(product)} title="Editar">
                        <FiEdit size={14} />
                      </button>
                      <button style={{...styles.actionButton, ...styles.btnDelete}} onClick={() => handleDelete(product.id)} title="Eliminar">
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="7" style={{textAlign:'center', padding:40, color:'#666'}}>No se encontraron productos.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINACIÓN */}
        {filteredProducts.length > 0 && (
            <div style={styles.paginationWrapper}>
                <span style={{fontSize:'0.9rem', color:'#888'}}>Página {currentPage} de {totalPages}</span>
                <button onClick={() => setCurrentPage(p => p-1)} disabled={currentPage===1} style={{...styles.pageBtn, ...(currentPage===1?styles.pageBtnDisabled:{})}}><FiChevronLeft/> Anterior</button>
                <button onClick={() => setCurrentPage(p => p+1)} disabled={currentPage===totalPages} style={{...styles.pageBtn, ...(currentPage===totalPages?styles.pageBtnDisabled:{})}}>Siguiente <FiChevronRight/></button>
            </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowModal(false)} style={styles.modalCloseBtn}><FiX /></button>
            
            <h3 style={styles.modalTitle}>{editingProduct ? <><FiEdit /> Editar Producto</> : <><FiPlus /> Nuevo Producto</>}</h3>
            
            <form onSubmit={handleSave} style={{marginTop: 20}}>
              <div style={styles.formGrid}>
                <div style={{marginBottom: 16}}>
                    <label style={styles.inputLabel}>Nombre</label>
                    <input style={styles.input} name="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required/>
                </div>
                <div style={{marginBottom: 16}}>
                    <label style={styles.inputLabel}>Categoría</label>
                    <select style={styles.select} name="category_id" value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} required>
                        <option value="">-- Seleccionar --</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
              </div>

              <div style={styles.formGrid}>
                 <div style={{marginBottom: 16}}>
                    <label style={styles.inputLabel}>Precio (USD)</label>
                    <input type="number" step="0.01" style={styles.input} name="price_usd" value={formData.price_usd} onChange={e => setFormData({...formData, price_usd: e.target.value})} required/>
                 </div>
                 <div style={{marginBottom: 16}}>
                    <label style={styles.inputLabel}>Precio Oferta (Opcional)</label>
                    <input type="number" step="0.01" style={styles.input} name="offer_price_usd" value={formData.offer_price_usd} onChange={e => setFormData({...formData, offer_price_usd: e.target.value})}/>
                 </div>
              </div>

              <div style={styles.formGrid}>
                 <div style={{marginBottom: 16}}>
                    <label style={styles.inputLabel}>Stock Actual</label>
                    <input type="number" style={styles.input} name="stock_quantity" value={formData.stock_quantity} onChange={e => setFormData({...formData, stock_quantity: e.target.value})} required/>
                 </div>
                 <div style={{marginBottom: 16}}>
                    <label style={styles.inputLabel}>Estado</label>
                    <select style={styles.select} name="status" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                        <option value="agotado">Agotado</option>
                    </select>
                 </div>
              </div>
              
              <div style={{marginBottom: 16}}>
                <label style={styles.inputLabel}>URL de Imagen</label>
                <input style={styles.input} name="image_url" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})}/>
              </div>

              <div style={{marginBottom: 16}}>
                <label style={styles.inputLabel}>Descripción</label>
                <textarea 
                    style={{...styles.input, minHeight: 100, resize:'vertical'}} 
                    name="description" 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div style={styles.modalActions}>
                <button type="button" style={{...styles.secondaryButton, border:'1px solid #555'}} onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" style={{...styles.mainButton, opacity: isSubmitting ? 0.7 : 1}} disabled={isSubmitting}>
                   {isSubmitting ? 'Guardando...' : <><FiSave /> Guardar</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
