// src/features/dashboard/AdminDashboard/ProductManagement.jsx

import React, { useState, useEffect } from 'react';
import apiClient from '/src/services/apiClient.js';
import {
  FiPlus, FiEdit, FiTrash2, FiImage, FiSave, FiX,
  FiFolder, FiLink, FiTag, FiCheckCircle, FiAlertCircle,
  FiPackage, FiDollarSign, FiShoppingBag, FiTrendingUp, FiArchive,
  FiSearch, FiFilter, FiRefreshCw
} from 'react-icons/fi';

// --- Estilos Unified Compact Theme (Dark Glass - Admin Edition) ---
const styles = {
  container: { 
    padding: '24px 16px', 
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", 
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
    marginBottom: '24px', position: 'relative', zIndex: 1,
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
  // ... (Mismos botones que AdminOrderReports para consistencia)

  // Filtros
  controlsSection: {
    background: 'rgba(25, 25, 25, 0.8)', backdropFilter: 'blur(20px)', borderRadius: '16px',
    padding: '20px', border: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '24px', position: 'relative', zIndex: 1
  },
  filtersGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' },
  
  filterLabel: { fontSize: '0.8rem', fontWeight: '600', color: '#a0a0a0', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' },
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
  filterActions: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' },
  
  // Tabla
  tableSection: {
    background: 'rgba(25, 25, 25, 0.8)', backdropFilter: 'blur(20px)', borderRadius: '16px',
    padding: '24px', border: '1px solid rgba(255, 255, 255, 0.1)', position: 'relative', zIndex: 1
  },
  sectionHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' },
  sectionTitle: { fontSize: '1.1rem', fontWeight: '700', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px' },
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
  
  // Badges de Stock y Estado
  stockBadge: { padding: '4px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '4px' },
  inStock: { background: 'rgba(39, 174, 96, 0.15)', color: '#2ecc71', border: '1px solid rgba(39, 174, 96, 0.3)' },
  lowStock: { background: 'rgba(255, 193, 7, 0.15)', color: '#fbbf24', border: '1px solid rgba(255, 193, 7, 0.3)' },
  outOfStock: { background: 'rgba(220, 53, 69, 0.15)', color: '#ff6b6b', border: '1px solid rgba(220, 53, 69, 0.3)' },

  statusBadge: { padding: '4px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase' },
  activeStatus: { background: 'rgba(102, 126, 234, 0.15)', color: '#667eea', border: '1px solid rgba(102, 126, 234, 0.3)' },
  inactiveStatus: { background: 'rgba(255, 255, 255, 0.05)', color: '#888', border: '1px solid rgba(255, 255, 255, 0.1)' },

  // Acciones
  actionCell: { display: 'flex', gap: '8px' },
  actionButton: { 
    padding: '6px', borderRadius: '8px', cursor: 'pointer', border: 'none', 
    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' 
  },
  editButton: { background: 'rgba(39, 174, 96, 0.15)', color: '#2ecc71' },
  deleteButton: { background: 'rgba(220, 53, 69, 0.15)', color: '#ff6b6b' },

  // Imagen
  productImage: { width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' },
  placeholderImage: { width: '48px', height: '48px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' },

  // Modal
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' },
  modalContent: { background: '#1a1a1a', borderRadius: '16px', padding: '30px', width: '100%', maxWidth: '600px', border: '1px solid rgba(255,255,255,0.1)', maxHeight: '90vh', overflowY: 'auto' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  modalTitle: { fontSize: '1.5rem', fontWeight: '700', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' },
  modalForm: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  formLabel: { fontSize: '0.85rem', color: '#aaa', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' },
  formTextarea: { 
    width: '100%', padding: '12px', border: '1px solid rgba(255, 255, 255, 0.1)', 
    borderRadius: '10px', fontSize: '0.9rem', backgroundColor: 'rgba(40, 40, 40, 0.6)', 
    color: '#ffffff', boxSizing: 'border-box', minHeight: '100px', resize: 'vertical' 
  },
  modalActions: { gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' },

  // UI States
  loadingState: { textAlign: 'center', padding: '80px 40px', color: '#a0a0a0' },
  emptyState: { textAlign: 'center', padding: '60px 40px', color: '#a0a0a0', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '16px' },
  message: { padding: '12px', borderRadius: '10px', marginBottom: '20px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' },
  successMessage: { background: 'rgba(39, 174, 96, 0.15)', color: '#2ecc71', border: '1px solid rgba(39, 174, 96, 0.3)' },
  errorMessage: { background: 'rgba(220, 53, 69, 0.15)', color: '#ff6b6b', border: '1px solid rgba(220, 53, 69, 0.3)' },
  pulseAnimation: { animation: 'pulse 2s infinite' }
};

const ProductManagement = () => {
    // --- Lógica Original Intacta ---
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [filters, setFilters] = useState({ status: '', search: '' });
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [categories, setCategories] = useState([]);
    const [isButtonHovered, setIsButtonHovered] = useState(false);

    const [formData, setFormData] = useState({
        name: '', description: '', image_url: '', category_id: '',
        price_usd: '', fictitious_price_usd: '', offer_price_usd: '',
        stock_quantity: '', status: 'activo', tags: '',
    });

    useEffect(() => { fetchProducts(); fetchCategories(); }, []);
    useEffect(() => { fetchProducts(); }, [filters]);

    const fetchCategories = async () => {
        try {
            const response = await apiClient.get('/categories-admin');
            setCategories(response.data);
        } catch (err) { console.error("Error categorías", err); }
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams(filters);
            const response = await apiClient.get(`/admin/products?${params}`);
            setProducts(response.data);
            setError(null);
        } catch (err) { setError('Error productos: ' + (err.response?.data?.error || err.message)); }
        finally { setLoading(false); }
    };

    const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });
    const handleFilterSubmit = () => fetchProducts();
    const handleResetFilters = () => setFilters({ status: '', search: '' });

    const handleDelete = async (id) => {
        if (window.confirm('¿Eliminar producto?')) {
            try {
                await apiClient.delete(`/admin/products/${id}`);
                setMessage('Producto eliminado.'); fetchProducts();
            } catch (err) { setError('Error eliminar: ' + err.message); }
        }
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name || '', description: product.description || '',
            image_url: product.image_url || '', category_id: product.category_id || '',
            price_usd: product.price_usd || '', fictitious_price_usd: product.fictitious_price_usd || '',
            offer_price_usd: product.offer_price_usd || '', stock_quantity: product.stock_quantity || '',
            status: product.status || 'activo', tags: Array.isArray(product.tags) ? product.tags.join(', ') : (product.tags || ''),
        });
        setShowModal(true);
    };

    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!editingProduct) return;
        try {
            const payload = { ...formData };
            if (typeof payload.tags === 'string') payload.tags = payload.tags.split(',').map(t => t.trim()).filter(t => t);
            payload.price_usd = parseFloat(payload.price_usd) || 0;
            payload.category_id = parseInt(payload.category_id) || null;
            // Parse numbers...
            await apiClient.put(`/admin/products/${editingProduct.id}`, payload);
            setShowModal(false); fetchProducts(); setMessage('Actualizado exitosamente');
        } catch (err) { setError('Error actualizar: ' + err.message); }
    };

    const closeModal = () => { setShowModal(false); setEditingProduct(null); };

    // --- Helpers Visuales ---
    const getStockStatus = (stock) => {
        if (stock === null || stock === undefined) return 'outOfStock';
        if (stock > 10) return 'inStock';
        if (stock > 0) return 'lowStock';
        return 'outOfStock';
    };

    const getStockIcon = (stock) => {
        const status = getStockStatus(stock);
        switch (status) {
            case 'inStock': return <FiCheckCircle size={12} />;
            case 'lowStock': return <FiAlertCircle size={12} />;
            default: return <FiX size={12} />;
        }
    };

    if (loading) return <div style={styles.container}><div style={styles.loadingState}><div style={styles.pulseAnimation}><FiPackage size={48} color="#667eea" /></div><p>Cargando...</p></div></div>;

    return (
        <div style={styles.container}>
            <div style={styles.backgroundDecoration} />
            
            {/* Header */}
            <div style={styles.headerSection}>
                <h1 style={styles.headerTitle}><FiPackage /> Gestión de Productos</h1>
            </div>

            {/* Mensajes */}
            {message && <div style={{ ...styles.message, ...styles.successMessage }}><FiCheckCircle /> {message}</div>}
            {error && <div style={{ ...styles.message, ...styles.errorMessage }}><FiAlertCircle /> {error}</div>}

            {/* Filtros */}
            <div style={styles.controlsSection}>
                <div style={styles.filtersGrid}>
                    <div>
                        <div style={styles.filterLabel}><FiSearch /> Buscar</div>
                        <input type="text" name="search" placeholder="Nombre..." value={filters.search} onChange={handleFilterChange} style={styles.input} />
                    </div>
                    <div>
                        <div style={styles.filterLabel}><FiFilter /> Estado</div>
                        <select name="status" value={filters.status} onChange={handleFilterChange} style={styles.select}>
                            <option value="">Todos</option>
                            <option value="activo">Activos</option>
                            <option value="en stock">En Stock</option>
                            <option value="agotado">Agotados</option>
                        </select>
                    </div>
                </div>
                <div style={styles.filterActions}>
                    <button onClick={handleResetFilters} style={{padding:'10px 20px', background:'transparent', border:'1px solid #555', borderRadius:10, color:'#aaa', cursor:'pointer'}}>Limpiar</button>
                    <button onClick={handleFilterSubmit} style={{padding:'10px 20px', background:'#667eea', border:'none', borderRadius:10, color:'#fff', cursor:'pointer'}}>Filtrar</button>
                </div>
            </div>

            {/* Tabla */}
            <div style={styles.tableSection}>
                <div style={styles.sectionHeader}>
                    <h2 style={styles.sectionTitle}><FiFolder /> Inventario</h2>
                    <div style={styles.sectionCount}>{products.length}</div>
                </div>

                {products.length === 0 ? (
                    <div style={styles.emptyState}>
                        <FiArchive size={48} color="#666" />
                        <p>No se encontraron productos.</p>
                    </div>
                ) : (
                    <div style={styles.tableContainer}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}><FiImage /> Imagen</th>
                                    <th style={styles.th}><FiPackage /> Producto</th>
                                    <th style={styles.th}><FiTag /> Categoría</th>
                                    <th style={styles.th}><FiDollarSign /> Precio</th>
                                    <th style={styles.th}><FiShoppingBag /> Stock</th>
                                    <th style={styles.th}>Estado</th>
                                    <th style={styles.th}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product, index) => (
                                    <tr key={product.id} style={{ backgroundColor: index % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.02)' }}>
                                        <td style={styles.td}>
                                            {product.image_url ? <img src={product.image_url} alt={product.name} style={styles.productImage} onError={(e) => e.target.style.display='none'} /> : <div style={styles.placeholderImage}><FiImage /></div>}
                                        </td>
                                        <td style={styles.td}>
                                            <div style={{fontWeight:'bold', color:'#fff'}}>{product.name}</div>
                                            <div style={{fontSize:'0.8rem', color:'#888'}}>{product.provider_name}</div>
                                        </td>
                                        <td style={styles.td}>{product.category_name || '-'}</td>
                                        <td style={styles.td}>
                                            <div style={{fontWeight:'bold', color:'#fff'}}>${product.price_usd}</div>
                                            {product.offer_price_usd && <div style={{fontSize:'0.8rem', textDecoration:'line-through', color:'#666'}}>${product.offer_price_usd}</div>}
                                        </td>
                                        <td style={styles.td}>
                                            <span style={{...styles.stockBadge, ...styles[getStockStatus(product.stock_quantity)]}}>
                                                {getStockIcon(product.stock_quantity)} {product.stock_quantity ?? 'N/A'}
                                            </span>
                                        </td>
                                        <td style={styles.td}>
                                            <span style={{...styles.statusBadge, ...(product.status === 'activo' ? styles.activeStatus : styles.inactiveStatus)}}>
                                                {product.status}
                                            </span>
                                        </td>
                                        <td style={styles.td}>
                                            <div style={styles.actionCell}>
                                                <button onClick={() => openEditModal(product)} style={{...styles.actionButton, ...styles.editButton}}><FiEdit /></button>
                                                <button onClick={() => handleDelete(product.id)} style={{...styles.actionButton, ...styles.deleteButton}}><FiTrash2 /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal Edición */}
            {showModal && (
                <div style={styles.modalOverlay} onClick={closeModal}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h2 style={styles.modalTitle}><FiEdit /> Editar Producto</h2>
                            <button onClick={closeModal} style={{background:'none', border:'none', color:'#fff', cursor:'pointer'}}><FiX size={24}/></button>
                        </div>
                        <form onSubmit={handleSubmit} style={styles.modalForm}>
                            <div style={styles.formGroup}>
                                <label style={styles.formLabel}>Nombre</label>
                                <input name="name" value={formData.name} onChange={handleInputChange} style={styles.input} />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.formLabel}>Imagen URL</label>
                                <input name="image_url" value={formData.image_url} onChange={handleInputChange} style={styles.input} />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.formLabel}>Categoría</label>
                                <select name="category_id" value={formData.category_id} onChange={handleInputChange} style={styles.select}>
                                    <option value="">-- Seleccionar --</option>
                                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                </select>
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.formLabel}>Precio USD</label>
                                <input type="number" step="0.01" name="price_usd" value={formData.price_usd} onChange={handleInputChange} style={styles.input} />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.formLabel}>Stock</label>
                                <input type="number" name="stock_quantity" value={formData.stock_quantity} onChange={handleInputChange} style={styles.input} />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.formLabel}>Estado</label>
                                <select name="status" value={formData.status} onChange={handleInputChange} style={styles.select}>
                                    <option value="activo">Activo</option>
                                    <option value="inactivo">Inactivo</option>
                                    <option value="agotado">Agotado</option>
                                </select>
                            </div>
                            <div style={{...styles.formGroup, gridColumn:'1/-1'}}>
                                <label style={styles.formLabel}>Descripción</label>
                                <textarea name="description" value={formData.description} onChange={handleInputChange} style={styles.formTextarea} />
                            </div>
                            <div style={styles.modalActions}>
                                <button type="button" onClick={closeModal} style={{padding:'10px 20px', background:'transparent', border:'1px solid #555', color:'#aaa', borderRadius:10, cursor:'pointer'}}>Cancelar</button>
                                <button type="submit" style={{padding:'10px 20px', background:'#667eea', border:'none', color:'#fff', borderRadius:10, cursor:'pointer'}}>Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManagement;