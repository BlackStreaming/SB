// src/features/dashboard/ProviderDashboard/ProductManagement.jsx

import React, { useState, useEffect, useRef } from 'react';
import apiClient from '/src/services/apiClient.js';
import { 
  FiBox, FiPlus, FiEdit2, FiTrash2, FiImage, FiDollarSign, 
  FiTrendingUp, FiClock, FiFileText, FiCheckCircle, FiAlertCircle,
  FiLayers, FiGrid, FiList, FiTag, FiRefreshCw, FiEye, FiEyeOff,
  FiTerminal, FiSave, FiX, FiTruck, FiShield, FiUploadCloud
} from 'react-icons/fi';

// Tasa de cambio
const EXCHANGE_RATE = 3.55;

// --- Estilos Unified Compact Theme (Fixed Layout) ---
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
    position: 'absolute', top: 0, right: 0, width: '500px', height: '500px',
    background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)', zIndex: 0
  },
  headerSection: { textAlign: 'center', marginBottom: '24px', position: 'relative', zIndex: 1 },
  header: { 
    fontSize: '2rem', fontWeight: '800', 
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px'
  },
  
  mainLayout: { display: 'flex', flexWrap: 'wrap', gap: '24px', position: 'relative', zIndex: 1 },
  columnForm: { flex: '1 1 450px', minWidth: '350px' }, 
  columnTable: { flex: '2 1 500px', minWidth: '350px' }, 

  section: {
    background: 'rgba(25, 25, 25, 0.8)', backdropFilter: 'blur(20px)', borderRadius: '16px',
    padding: '24px', border: '1px solid rgba(255, 255, 255, 0.1)', position: 'relative', overflow: 'hidden',
    height: 'fit-content'
  },
  sectionHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' },
  sectionTitle: { fontSize: '1.1rem', fontWeight: '700', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px' },

  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  gridRow2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  gridRow3: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' },
  inputGroup: { display: 'flex', flexDirection: 'column', width: '100%' },
  label: { fontSize: '0.8rem', fontWeight: '600', color: '#a0a0a0', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' },
  
  inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center', width: '100%' },
  inputIcon: { position: 'absolute', left: '12px', color: '#666', zIndex: 10 },
  
  input: { 
    width: '100%', padding: '10px 12px 10px 36px', border: '1px solid rgba(255, 255, 255, 0.1)', 
    borderRadius: '10px', fontSize: '0.9rem', backgroundColor: 'rgba(40, 40, 40, 0.6)', 
    color: '#ffffff', fontFamily: 'inherit', transition: 'all 0.3s ease',
    boxSizing: 'border-box' 
  },
  textarea: {
    width: '100%', padding: '12px 12px 12px 36px', border: '1px solid rgba(255, 255, 255, 0.1)', 
    borderRadius: '10px', fontSize: '0.9rem', backgroundColor: 'rgba(40, 40, 40, 0.6)', 
    color: '#ffffff', fontFamily: 'inherit', minHeight: '80px', resize: 'vertical',
    boxSizing: 'border-box'
  },
  bulkTextarea: {
    width: '100%', padding: '12px', border: '1px solid rgba(102, 126, 234, 0.3)', 
    borderRadius: '10px', fontSize: '0.8rem', backgroundColor: 'rgba(15, 15, 20, 0.9)', 
    color: '#00ff88', fontFamily: 'monospace', minHeight: '120px', resize: 'vertical',
    lineHeight: '1.4', boxSizing: 'border-box'
  },
  select: {
    width: '100%', padding: '10px 12px 10px 36px', border: '1px solid rgba(255, 255, 255, 0.1)', 
    borderRadius: '10px', fontSize: '0.9rem', backgroundColor: 'rgba(40, 40, 40, 0.6)', 
    color: '#ffffff', cursor: 'pointer', appearance: 'none', boxSizing: 'border-box'
  },
  
  tagContainer: { display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px' },
  tagLabel: { fontSize: '0.75rem', color: '#ccc', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', transition: '0.2s' },
  tagLabelActive: { background: 'rgba(102, 126, 234, 0.2)', color: '#667eea', border: '1px solid rgba(102, 126, 234, 0.3)' },

  button: { 
    padding: '12px', border: 'none', borderRadius: '12px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
    color: 'white', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', display: 'flex', 
    alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.3s ease', 
    marginTop: '12px', position: 'relative', overflow: 'hidden'
  },
  buttonSecondary: { background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#ccc' },
  
  // Estilo del botón de subir imagen
  uploadBtn: {
    position: 'absolute', right: '5px', top: '5px', bottom: '5px',
    background: '#333', color: '#fff', border: '1px solid #555', borderRadius: '8px',
    padding: '0 12px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px',
    zIndex: 15
  },

  actionBtn: { padding: '6px', borderRadius: '8px', cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' },
  btnEdit: { background: 'rgba(102, 126, 234, 0.15)', color: '#667eea' },
  btnDelete: { background: 'rgba(220, 53, 69, 0.15)', color: '#ff6b6b' },

  tableContainer: { overflowX: 'auto', borderRadius: '12px' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' },
  th: { padding: '12px 10px', backgroundColor: 'rgba(40, 40, 40, 0.95)', fontWeight: '700', color: '#a0a0a0', textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase', whiteSpace: 'nowrap' },
  td: { padding: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', color: '#e0e0e0', verticalAlign: 'middle' },
  statusBadge: { padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase' },
  
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' },
  modalContent: { background: '#1a1a1a', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '700px', border: '1px solid rgba(255,255,255,0.1)', maxHeight: '90vh', overflowY: 'auto' },
  
  imagePreview: { width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', marginTop: '8px', border: '1px solid rgba(255,255,255,0.1)' },
  message: { padding: '12px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' },
  error: { background: 'rgba(220, 53, 69, 0.15)', color: '#ff6b6b', border: '1px solid rgba(220, 53, 69, 0.3)' },
};

const allTags = ['Oferta', 'Nuevo', 'Recomendado', 'Más Vendido', 'Garantía', 'Entrega Inmediata'];

const initialFormState = {
  name: '', description: '', category_id: '',
  price_pen: '', fictitious_price_pen: '', offer_price_pen: '', renewal_price_pen: '',
  is_published: false, terms_conditions: '', delivery_time: '', duration_days: '',
  tags: [], image_url: '', has_renewal: false,
  status: 'agotado', stock_quantity: 0, inlineStockText: '', 
};

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProductForm, setNewProductForm] = useState(initialFormState);
  
  // Estado para subida de imagen
  const [uploadingImg, setUploadingImg] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    fetchProducts();
    fetchCategories();
  }, []);

  const convertPenToUsd = (pen) => pen ? (parseFloat(pen) / EXCHANGE_RATE).toFixed(2) : null;
  const convertUsdToPen = (usd) => usd ? (parseFloat(usd) * EXCHANGE_RATE).toFixed(2) : '';

  const fetchProducts = async () => {
    try {
      const response = await apiClient.get('/provider/products'); 
      setProducts(response.data);
    } catch (err) { setError('No se pudieron cargar los productos.'); }
  };
  
  const fetchCategories = async () => {
    try {
      const response = await apiClient.get('/provider/allowed-categories');
      setCategories(response.data);
      if (response.data.length === 0) setError('No tienes categorías asignadas.');
    } catch (err) { setError('Error al cargar categorías.'); } 
    finally { setLoading(false); }
  };

  const handleNewProductChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewProductForm(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : (name === 'is_published' ? value === 'true' : (name === 'stock_quantity' ? (parseInt(value)||0) : value)) 
    }));
  };

  // --- LÓGICA DE SUBIDA DE IMAGEN ---
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploadingImg(true);
    try {
        // Endpoint en el backend que configuramos en el paso 1
        const res = await apiClient.post('/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        const imageUrl = res.data.imageUrl;

        // Si estamos editando, actualizamos el producto en edición
        if (isModalOpen && editingProduct) {
            setEditingProduct(prev => ({ ...prev, image_url: imageUrl }));
        } else {
            // Si estamos creando, actualizamos el formulario nuevo
            setNewProductForm(prev => ({ ...prev, image_url: imageUrl }));
        }
    } catch (err) {
        console.error(err);
        alert("Error al subir la imagen.");
    } finally {
        setUploadingImg(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  // ----------------------------------

  const handleNewTagChange = (tag) => {
    setNewProductForm(prev => {
      const tags = prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag];
      return { ...prev, tags };
    });
  };

  const prepareDataForBackend = (formData) => {
    const data = {
      ...formData,
      price_usd: convertPenToUsd(formData.price_pen),
      fictitious_price_usd: convertPenToUsd(formData.fictitious_price_pen),
      offer_price_usd: convertPenToUsd(formData.offer_price_pen),
      renewal_price_usd: formData.has_renewal ? convertPenToUsd(formData.renewal_price_pen) : null,
      stock_quantity: (formData.status === 'a pedido' || formData.status === 'activacion') ? formData.stock_quantity : 0,
      price_pen: undefined, fictitious_price_pen: undefined, offer_price_pen: undefined, 
      renewal_price_pen: undefined, inlineStockText: undefined, 
    };
    if (formData.status === 'en stock') data.status = 'agotado'; 
    return data;
  };

  const handleNewProductSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitLoading(true);
    let newProductId = null;

    try {
      if (categories.length === 0 || !newProductForm.category_id) throw new Error('Selecciona una categoría válida.');

      const backendData = prepareDataForBackend(newProductForm);
      const productResponse = await apiClient.post('/provider/products', backendData);
      newProductId = productResponse.data.id;
      let createdProduct = productResponse.data;

      const stockText = newProductForm.inlineStockText.trim();
      const selectedStatus = newProductForm.status;

      if ((selectedStatus === 'en stock' || selectedStatus === 'activacion') && stockText !== '') {
        let items = [];
        if (selectedStatus === 'activacion') {
          items = stockText.split('\n').filter(l => l.trim()).map(l => ({ email: l.trim() }));
        } else {
          items = stockText.split('\n').filter(l => l.trim()).map(l => {
            const p = l.split(':');
            return { email: p[0] || null, password: p[1] || null, profile_name: p[2] || null, pin: p[3] || null };
          });
        }
        
        if (items.length > 0) {
          await apiClient.post('/provider/stock-items', { productId: newProductId, items });
          createdProduct.status = 'en stock';
        }
      }

      setProducts([createdProduct, ...products]);
      setNewProductForm(initialFormState);
      alert('¡Producto creado!');
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Error al crear.';
      setError(msg);
      if (newProductId && !msg.includes('stock')) setError(`Creado (ID: ${newProductId}) pero falló stock.`);
    } finally { setSubmitLoading(false); }
  };

  // --- Funciones de Edición ---
  const openEditModal = (product) => {
    setEditingProduct({
      ...product,
      price_pen: convertUsdToPen(product.price_usd),
      fictitious_price_pen: convertUsdToPen(product.fictitious_price_usd),
      offer_price_pen: convertUsdToPen(product.offer_price_usd),
      renewal_price_pen: product.has_renewal ? convertUsdToPen(product.renewal_price_usd) : '',
      tags: product.tags || [], 
      stock_quantity: product.stock_quantity || 0,
      terms_conditions: product.terms_conditions || '',
      delivery_time: product.delivery_time || '',
      duration_days: product.duration_days || '',
    });
    setIsModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingProduct(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : (name === 'is_published' ? value === 'true' : (name === 'stock_quantity' ? (parseInt(value)||0) : value)) }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const backendData = prepareDataForBackend(editingProduct);
      const response = await apiClient.put(`/provider/products/${editingProduct.id}`, backendData);
      setProducts(products.map(p => p.id === editingProduct.id ? response.data : p));
      setIsModalOpen(false);
      alert('¡Actualizado!');
    } catch (err) { alert('Error al actualizar'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar?')) {
      try {
        await apiClient.delete(`/provider/products/${id}`);
        setProducts(products.filter(p => p.id !== id));
      } catch (err) { alert('Error al eliminar. Puede tener pedidos asociados.'); }
    }
  };

  const renderConditionalFields = (type) => {
    const formState = type === 'new' ? newProductForm : editingProduct;
    const setFunction = type === 'new' ? setNewProductForm : setEditingProduct;
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFunction(prev => ({ ...prev, [name]: name === 'stock_quantity' ? parseInt(value)||0 : value }));
    };
    const status = formState.status;

    return (
      <div style={{marginTop: '12px', padding: '16px', background: 'rgba(102, 126, 234, 0.05)', borderRadius: '12px', border: '1px solid rgba(102, 126, 234, 0.2)'}}>
        <label style={styles.label}><FiLayers size={14} /> Tipo de Venta</label>
        <div style={styles.inputWrapper}>
            <FiLayers style={styles.inputIcon} size={14} />
            <select name="status" value={status} onChange={handleChange} style={styles.select}>
                <option value="agotado">Agotado</option>
                <option value="en stock">Inventario (Automático)</option>
                <option value="a pedido">A Pedido (Manual)</option>
                <option value="activacion">Activación (Manual/Email)</option>
            </select>
        </div>

        {(status === 'a pedido' || status === 'activacion') && (
          <div style={{marginTop: '12px'}}>
            <label style={styles.label}><FiGrid size={14} /> Límite de Ventas (0 = Infinito)</label>
            <div style={styles.inputWrapper}>
                <FiGrid style={styles.inputIcon} size={14} />
                <input type="number" name="stock_quantity" value={formState.stock_quantity} onChange={handleChange} style={styles.input} min="0" />
            </div>
          </div>
        )}

        {type === 'new' && (status === 'en stock' || status === 'activacion') && (
          <div style={{marginTop: '16px'}}>
            <label style={{...styles.label, color: '#00ff88'}}>
                <FiTerminal size={14} /> 
                {status === 'activacion' ? 'Emails (uno por línea)' : 'Cuentas (email:pass:perfil:pin)'}
            </label>
            <textarea 
                name="inlineStockText" 
                style={styles.bulkTextarea} 
                value={formState.inlineStockText} 
                onChange={handleChange} 
                placeholder={status === 'activacion' ? "user1@mail.com\nuser2@mail.com" : "user@mail.com:pass123:Perfil 1:0000"} 
            />
          </div>
        )}
      </div>
    );
  };

  if (loading) return <div style={{textAlign:'center', padding: '50px', color: '#aaa'}}>Cargando...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.backgroundDecoration} />
      <div style={styles.headerSection}>
        <h1 style={styles.header}>Gestión de Productos</h1>
      </div>

      {/* Input invisible para subir archivo */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImageUpload} 
        style={{display: 'none'}} 
        accept="image/*"
      />

      <div style={styles.mainLayout}>
        
        {/* --- COLUMNA FORMULARIO --- */}
        <div style={styles.columnForm}>
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}><FiPlus size={18} /> Nuevo Producto</h3>
            </div>
            {error && <div style={{...styles.message, ...styles.error}}><FiAlertCircle size={16} /> {error}</div>}
            
            <form onSubmit={handleNewProductSubmit} style={styles.form}>
              {/* Nombre */}
              <div style={styles.inputGroup}>
                <label style={styles.label}><FiBox size={14} /> Nombre</label>
                <div style={styles.inputWrapper}>
                    <FiBox style={styles.inputIcon} size={14} />
                    <input name="name" value={newProductForm.name} onChange={handleNewProductChange} placeholder="Ej: Netflix 4K" style={styles.input} required />
                </div>
              </div>

              {/* Categoría y Visibilidad */}
              <div style={styles.gridRow2}>
                <div style={styles.inputGroup}>
                    <label style={styles.label}><FiList size={14} /> Categoría</label>
                    <div style={styles.inputWrapper}>
                        <FiList style={styles.inputIcon} size={14} />
                        <select name="category_id" value={newProductForm.category_id} onChange={handleNewProductChange} style={styles.select} required>
                            <option value="">Seleccionar...</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                </div>
                <div style={styles.inputGroup}>
                    <label style={styles.label}><FiEye size={14} /> Estado</label>
                    <div style={styles.inputWrapper}>
                        <select name="is_published" value={newProductForm.is_published} onChange={handleNewProductChange} style={{...styles.select, paddingLeft:'12px'}}>
                            <option value={true}>Público</option>
                            <option value={false}>Borrador</option>
                        </select>
                    </div>
                </div>
              </div>

              {/* Precios */}
              <div style={styles.gridRow3}>
                <div style={styles.inputGroup}>
                    <label style={styles.label}><FiDollarSign size={14} /> Precio</label>
                    <input type="number" step="0.01" name="price_pen" value={newProductForm.price_pen} onChange={handleNewProductChange} style={{...styles.input, paddingLeft: '12px'}} placeholder="0.00" required />
                </div>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Tachado</label>
                    <input type="number" step="0.01" name="fictitious_price_pen" value={newProductForm.fictitious_price_pen} onChange={handleNewProductChange} style={{...styles.input, paddingLeft: '12px'}} placeholder="0.00" />
                </div>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Oferta</label>
                    <input type="number" step="0.01" name="offer_price_pen" value={newProductForm.offer_price_pen} onChange={handleNewProductChange} style={{...styles.input, paddingLeft: '12px'}} placeholder="0.00" />
                </div>
              </div>

              {/* IMAGEN con Botón de Upload */}
              <div style={styles.inputGroup}>
                <label style={styles.label}><FiImage size={14} /> Imagen (URL o Subir)</label>
                <div style={styles.inputWrapper}>
                    <FiImage style={styles.inputIcon} size={14} />
                    <input 
                        name="image_url" 
                        value={newProductForm.image_url} 
                        onChange={handleNewProductChange} 
                        placeholder="https://..." 
                        style={{...styles.input, paddingRight: '90px'}} // Espacio para el botón
                    />
                    <button 
                        type="button" 
                        onClick={triggerFileInput} 
                        style={styles.uploadBtn}
                        disabled={uploadingImg}
                    >
                        <FiUploadCloud /> {uploadingImg ? '...' : 'Subir'}
                    </button>
                </div>
                {newProductForm.image_url && <img src={newProductForm.image_url} style={styles.imagePreview} alt="Vista previa" />}
              </div>

              {/* Descripción */}
              <div style={styles.inputGroup}>
                <label style={styles.label}><FiFileText size={14} /> Descripción</label>
                <div style={styles.inputWrapper}>
                    <FiFileText style={{...styles.inputIcon, top: '14px', transform: 'none'}} size={14} />
                    <textarea name="description" value={newProductForm.description} onChange={handleNewProductChange} style={styles.textarea} placeholder="Detalles del servicio..." />
                </div>
              </div>

              {/* Duración y Entrega */}
              <div style={styles.gridRow2}>
                <div style={styles.inputGroup}>
                    <label style={styles.label}><FiClock size={14} /> Duración (días)</label>
                    <input type="number" name="duration_days" value={newProductForm.duration_days} onChange={handleNewProductChange} placeholder="30" style={styles.input} min="1" />
                </div>
                <div style={styles.inputGroup}>
                    <label style={styles.label}><FiTruck size={14} /> Entrega</label>
                    <input name="delivery_time" value={newProductForm.delivery_time} onChange={handleNewProductChange} style={{...styles.input, paddingLeft: '12px'}} placeholder="Inmediata" />
                </div>
              </div>

              {/* Términos */}
              <div style={styles.inputGroup}>
                <label style={styles.label}><FiShield size={14} /> Términos</label>
                <textarea name="terms_conditions" value={newProductForm.terms_conditions} onChange={handleNewProductChange} style={{...styles.textarea, minHeight: '60px'}} placeholder="Garantía..." />
              </div>

              {/* Tags */}
              <div style={styles.inputGroup}>
                <label style={styles.label}><FiTag size={14} /> Etiquetas</label>
                <div style={styles.tagContainer}>
                    {allTags.map(tag => (
                        <div key={tag} onClick={() => handleNewTagChange(tag)} style={{...styles.tagLabel, ...(newProductForm.tags.includes(tag) ? styles.tagLabelActive : {})}}>
                            {tag}
                        </div>
                    ))}
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={{...styles.label, cursor: 'pointer'}}>
                    <input type="checkbox" name="has_renewal" checked={newProductForm.has_renewal} onChange={handleNewProductChange} style={{marginRight: 8}} />
                    Permitir Renovación
                </label>
              </div>
              
              {newProductForm.has_renewal && (
                 <div style={styles.inputGroup}>
                    <label style={styles.label}>Precio Renovación (S/)</label>
                    <input type="number" step="0.01" name="renewal_price_pen" value={newProductForm.renewal_price_pen} onChange={handleNewProductChange} style={styles.input} placeholder="0.00" />
                 </div>
              )}

              {renderConditionalFields('new')}

              <button type="submit" style={styles.button} disabled={submitLoading}>
                {submitLoading ? 'Procesando...' : 'Crear Producto'}
              </button>
            </form>
          </div>
        </div>

        {/* --- COLUMNA TABLA --- */}
        <div style={styles.columnTable}>
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}><FiGrid size={18} /> Inventario ({products.length})</h3>
              <button onClick={fetchProducts} style={{...styles.actionBtn, background: 'rgba(255,255,255,0.1)'}}><FiRefreshCw size={16} /></button>
            </div>

            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Producto</th>
                    <th style={styles.th}>Precio (USD)</th>
                    <th style={styles.th}>Estado</th>
                    <th style={styles.th}>Visibilidad</th>
                    <th style={styles.th}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} style={styles.tableRow}>
                      <td style={styles.td}>
                        <div style={{fontWeight: '600'}}>{p.name}</div>
                        <div style={{fontSize: '0.75rem', color: '#888'}}>{p.duration_days} días</div>
                      </td>
                      <td style={{...styles.td, color: '#2ecc71', fontWeight: '700'}}>${parseFloat(p.price_usd).toFixed(2)}</td>
                      <td style={styles.td}>
                        <span style={{...styles.statusBadge, background: p.status === 'en stock' ? 'rgba(39,174,96,0.2)' : 'rgba(255,193,7,0.2)', color: p.status === 'en stock' ? '#2ecc71' : '#ffc107'}}>
                            {p.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={styles.td}>
                        {p.is_published ? <FiEye size={16} color="#667eea" /> : <FiEyeOff size={16} color="#666" />}
                      </td>
                      <td style={styles.td}>
                        <div style={{display:'flex', gap: 8}}>
                            <button onClick={() => openEditModal(p)} style={{...styles.actionBtn, ...styles.btnEdit}}><FiEdit2 size={14} /></button>
                            <button onClick={() => handleDelete(p.id)} style={{...styles.actionBtn, ...styles.btnDelete}}><FiTrash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {/* MODAL EDICIÓN */}
      {isModalOpen && editingProduct && (
        <div style={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
            <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 20}}>
                    <h3 style={{color: '#fff', margin: 0}}>Editar {editingProduct.name}</h3>
                    <button onClick={() => setIsModalOpen(false)} style={{background:'none', border:'none', color:'#fff', cursor:'pointer'}}><FiX size={20} /></button>
                </div>
                <form onSubmit={handleEditSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Nombre</label>
                        <input name="name" value={editingProduct.name} onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})} style={styles.input} />
                    </div>
                    
                    <div style={styles.gridRow3}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Precio</label>
                            <input type="number" step="0.01" name="price_pen" value={editingProduct.price_pen} onChange={handleEditChange} style={styles.input} />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Ficticio</label>
                            <input type="number" step="0.01" name="fictitious_price_pen" value={editingProduct.fictitious_price_pen} onChange={handleEditChange} style={styles.input} />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Oferta</label>
                            <input type="number" step="0.01" name="offer_price_pen" value={editingProduct.offer_price_pen} onChange={handleEditChange} style={styles.input} />
                        </div>
                    </div>

                    {/* Imagen en Edición */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}><FiImage size={14} /> Imagen URL</label>
                        <div style={styles.inputWrapper}>
                            <FiImage style={styles.inputIcon} size={14} />
                            <input 
                                name="image_url" 
                                value={editingProduct.image_url} 
                                onChange={handleEditChange} 
                                style={{...styles.input, paddingRight: '90px'}}
                            />
                            <button 
                                type="button" 
                                onClick={triggerFileInput} 
                                style={styles.uploadBtn}
                                disabled={uploadingImg}
                            >
                                <FiUploadCloud /> {uploadingImg ? '...' : 'Subir'}
                            </button>
                        </div>
                        {editingProduct.image_url && <img src={editingProduct.image_url} style={styles.imagePreview} alt="Preview" />}
                    </div>

                    <div style={styles.gridRow2}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Duración</label>
                            <input type="number" name="duration_days" value={editingProduct.duration_days} onChange={handleEditChange} style={styles.input} />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Entrega</label>
                            <input name="delivery_time" value={editingProduct.delivery_time} onChange={handleEditChange} style={styles.input} />
                        </div>
                    </div>
                    
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Términos</label>
                        <textarea name="terms_conditions" value={editingProduct.terms_conditions} onChange={handleEditChange} style={{...styles.textarea, minHeight: '60px'}} />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Visibilidad</label>
                        <select name="is_published" value={editingProduct.is_published.toString()} onChange={handleEditChange} style={styles.select}>
                            <option value="true">Visible</option>
                            <option value="false">Oculto</option>
                        </select>
                    </div>

                    {renderConditionalFields('edit')}

                    <div style={{display: 'flex', gap: 10, marginTop: 20}}>
                        <button type="submit" style={{...styles.button, flex: 1, marginTop: 0}}><FiSave size={16} /> Guardar</button>
                        <button type="button" onClick={() => setIsModalOpen(false)} style={{...styles.button, ...styles.buttonSecondary, flex: 1, marginTop: 0}}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;