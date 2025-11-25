// src/features/dashboard/AdminDashboard/RedeemableItemsManagement.jsx

import React, { useState, useEffect } from 'react';
import apiClient from '/src/services/apiClient.js';
import {
  FiPlus, FiEdit, FiTrash2, FiImage, FiSave, FiX,
  FiGift, FiStar, FiDatabase, FiTag, FiCheckCircle, FiAlertCircle,
  FiLayers, FiAlignLeft, FiArchive
} from 'react-icons/fi';

// --- Estilos Unified Compact Theme (Dark Glass) ---
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
    marginBottom: '32px', position: 'relative', zIndex: 1,
    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
  },
  headerTitle: { 
    fontSize: '2rem', fontWeight: '800', margin: 0,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    display: 'flex', alignItems: 'center', gap: '12px'
  },

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
  actionBtn: { padding: '6px', borderRadius: '8px', cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' },
  btnEdit: { background: 'rgba(102, 126, 234, 0.15)', color: '#667eea', marginRight: '8px' },
  btnDelete: { background: 'rgba(220, 53, 69, 0.15)', color: '#ff6b6b' },
  btnStock: { background: 'rgba(243, 156, 18, 0.15)', color: '#f39c12', marginRight: '8px', fontWeight:'600', fontSize:'0.75rem', padding:'6px 10px' },

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
  badge: { padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '4px' },
  badgeActive: { background: 'rgba(39, 174, 96, 0.15)', color: '#2ecc71', border: '1px solid rgba(39, 174, 96, 0.3)' },
  badgeInactive: { background: 'rgba(220, 53, 69, 0.15)', color: '#ff6b6b', border: '1px solid rgba(220, 53, 69, 0.3)' },

  // Imágenes
  imagePreview: { width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' },
  placeholderImage: { width: '40px', height: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' },

  // Modales
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' },
  modalContent: { background: '#1a1a1a', borderRadius: '16px', padding: '30px', width: '100%', maxWidth: '500px', border: '1px solid rgba(255,255,255,0.1)', position: 'relative', maxHeight: '90vh', overflowY: 'auto' },
  modalTitle: { fontSize: '1.5rem', fontWeight: '700', marginBottom: '20px', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' },
  modalCloseBtn: { position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1.2rem' },
  
  // Formulario
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '0.8rem', fontWeight: '600', color: '#a0a0a0', display: 'flex', alignItems: 'center', gap: '6px' },
  input: { 
    width: '100%', padding: '10px 12px', border: '1px solid rgba(255, 255, 255, 0.1)', 
    borderRadius: '10px', fontSize: '0.9rem', backgroundColor: 'rgba(40, 40, 40, 0.6)', 
    color: '#ffffff', boxSizing: 'border-box'
  },
  textarea: {
    width: '100%', padding: '10px 12px', border: '1px solid rgba(255, 255, 255, 0.1)', 
    borderRadius: '10px', fontSize: '0.9rem', backgroundColor: 'rgba(40, 40, 40, 0.6)', 
    color: '#ffffff', boxSizing: 'border-box', minHeight: '100px', resize: 'vertical', fontFamily: 'inherit'
  },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' },

  // UI States
  loadingState: { textAlign: 'center', padding: '50px', color: '#aaa' },
  emptyState: { textAlign: 'center', padding: '60px 40px', color: '#a0a0a0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '20px' },
  pulseAnimation: { animation: 'pulse 2s infinite' }
};

const initialFormState = { name: '', description: '', image_url: '', points_cost: '', stock_quantity: '', is_active: true };

const RedeemableItemsManagement = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modales
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isStockOpen, setIsStockOpen] = useState(false);
  
  const [editingItem, setEditingItem] = useState(null);
  const [stockItem, setStockItem] = useState(null); 
  
  const [formState, setFormState] = useState(initialFormState);
  const [stockText, setStockText] = useState('');

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/admin/redeemable-items');
      setItems(response.data);
      setError(null);
    } catch (err) {
      setError('No se pudieron cargar los premios.');
    }
    setIsLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  // --- Handlers ---
  const openForm = (item = null) => {
    setEditingItem(item);
    setFormState(item ? { ...item, stock_quantity: item.stock_quantity === null ? '' : item.stock_quantity } : initialFormState);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const payload = { 
      ...formState, 
      points_cost: parseInt(formState.points_cost), 
      stock_quantity: formState.stock_quantity === '' ? null : parseInt(formState.stock_quantity) 
    };

    try {
      if (editingItem) await apiClient.put(`/admin/redeemable-items/${editingItem.id}`, payload);
      else await apiClient.post('/admin/redeemable-items', payload);
      
      await fetchItems();
      setIsFormOpen(false);
    } catch (err) {
      alert('Error al guardar.');
    }
  };

  const openStockModal = (item) => {
    setStockItem(item);
    setStockText('');
    setIsStockOpen(true);
  };

  const handleStockSubmit = async (e) => {
    e.preventDefault();
    const codes = stockText.split('\n').filter(line => line.trim() !== '');
    if (codes.length === 0) return alert("Ingresa al menos un código.");

    try {
      await apiClient.post(`/admin/redeemable-items/${stockItem.id}/stock`, { codes });
      alert(`¡${codes.length} códigos agregados!`);
      await fetchItems();
      setIsStockOpen(false);
    } catch (err) {
      alert('Error al cargar stock.');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('¿Eliminar premio?')) {
      try { await apiClient.delete(`/admin/redeemable-items/${id}`); fetchItems(); }
      catch (e) { alert('Error al eliminar'); }
    }
  };

  if (isLoading && !isFormOpen && !isStockOpen) return <div style={styles.container}><div style={styles.loadingState}>Cargando...</div></div>;

  return (
    <div style={styles.container}>
      <div style={styles.backgroundDecoration} />
      
      <div style={styles.headerSection}>
        <h1 style={styles.headerTitle}><FiGift /> Gestión de Premios</h1>
        <button style={styles.mainButton} onClick={() => openForm(null)}>
          <FiPlus /> Crear Premio
        </button>
      </div>

      <div style={styles.tableSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}><FiStar color="#FFD700"/> Premios Disponibles</h2>
          <div style={styles.sectionCount}>{items.length}</div>
        </div>

        {items.length === 0 ? (
            <div style={styles.emptyState}>
                <FiGift size={48} color="#667eea" />
                <p>No hay premios configurados.</p>
            </div>
        ) : (
            <div style={styles.tableContainer}>
            <table style={styles.table}>
                <thead>
                <tr>
                    <th style={styles.th}>Imagen</th>
                    <th style={styles.th}>Nombre</th>
                    <th style={styles.th}>Costo (Pts)</th>
                    <th style={styles.th}>Stock</th>
                    <th style={styles.th}>Estado</th>
                    <th style={styles.th}>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {items.map((item, index) => (
                    <tr key={item.id} style={{backgroundColor: index % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.02)'}}>
                    <td style={styles.td}>
                        {item.image_url ? <img src={item.image_url} alt={item.name} style={styles.imagePreview} /> : <div style={styles.placeholderImage}><FiImage/></div>}
                    </td>
                    <td style={{...styles.td, fontWeight:'600'}}>{item.name}</td>
                    <td style={{...styles.td, color:'#FFD700', fontWeight:'bold'}}>{item.points_cost} pts</td>
                    <td style={styles.td}>{item.stock_quantity === null ? 'Infinito' : item.stock_quantity}</td>
                    <td style={styles.td}>
                        <span style={{...styles.badge, ...(item.is_active ? styles.badgeActive : styles.badgeInactive)}}>
                            {item.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                    </td>
                    <td style={styles.td}>
                        <div style={{display:'flex'}}>
                            <button onClick={() => openStockModal(item)} style={{...styles.actionBtn, ...styles.btnStock}} title="Cargar Stock"><FiDatabase size={12}/> +Stock</button>
                            <button onClick={() => openForm(item)} style={{...styles.actionBtn, ...styles.btnEdit}} title="Editar"><FiEdit size={14}/></button>
                            <button onClick={() => handleDelete(item.id)} style={{...styles.actionBtn, ...styles.btnDelete}} title="Eliminar"><FiTrash2 size={14}/></button>
                        </div>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        )}
      </div>

      {/* Modal Crear/Editar */}
      {isFormOpen && (
        <div style={styles.modalOverlay} onClick={() => setIsFormOpen(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button onClick={() => setIsFormOpen(false)} style={styles.modalCloseBtn}><FiX /></button>
            <h3 style={styles.modalTitle}>{editingItem ? 'Editar' : 'Crear'} Premio</h3>
            
            <form onSubmit={handleFormSubmit} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}><FiTag size={14}/> Nombre</label>
                <input style={styles.input} value={formState.name} onChange={e => setFormState({...formState, name: e.target.value})} required />
              </div>

              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
                <div style={styles.inputGroup}>
                    <label style={styles.label}><FiStar size={14}/> Costo Puntos</label>
                    <input type="number" style={styles.input} value={formState.points_cost} onChange={e => setFormState({...formState, points_cost: e.target.value})} required />
                </div>
                <div style={styles.inputGroup}>
                    <label style={styles.label}><FiLayers size={14}/> Límite Stock</label>
                    <input type="number" style={styles.input} value={formState.stock_quantity} onChange={e => setFormState({...formState, stock_quantity: e.target.value})} placeholder="Vacío = Infinito" />
                </div>
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}><FiAlignLeft size={14}/> Descripción</label>
                <textarea style={styles.textarea} value={formState.description} onChange={e => setFormState({...formState, description: e.target.value})} />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}><FiImage size={14}/> URL Imagen</label>
                <input style={styles.input} value={formState.image_url} onChange={e => setFormState({...formState, image_url: e.target.value})} />
              </div>

              <label style={{...styles.label, cursor:'pointer', marginTop:10}}>
                <input type="checkbox" checked={formState.is_active} onChange={e => setFormState({...formState, is_active: e.target.checked})} style={{marginRight:8}} /> 
                Activar Premio
              </label>

              <div style={styles.modalActions}>
                <button type="button" style={styles.secondaryButton} onClick={() => setIsFormOpen(false)}>Cancelar</button>
                <button type="submit" style={styles.mainButton}>Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Cargar Stock */}
      {isStockOpen && (
        <div style={styles.modalOverlay} onClick={() => setIsStockOpen(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button onClick={() => setIsStockOpen(false)} style={styles.modalCloseBtn}><FiX /></button>
            <h3 style={styles.modalTitle}><FiDatabase /> Stock para: {stockItem.name}</h3>
            <p style={{color:'#aaa', marginBottom:16, fontSize:'0.9rem'}}>
              Ingresa un código, link o cuenta (email:pass) por línea. <br/>
              Se entregarán automáticamente uno por uno al canjear.
            </p>
            
            <form onSubmit={handleStockSubmit} style={styles.form}>
              <textarea 
                style={{...styles.textarea, minHeight: '200px', fontFamily: 'monospace', color:'#00ff88', background:'rgba(0,0,0,0.3)'}} 
                placeholder={`ABCD-1234-WXYZ\nhttp://regalo.com/claim?id=123\nusuario@mail.com:password123`}
                value={stockText} 
                onChange={e => setStockText(e.target.value)} 
              />
              <div style={styles.modalActions}>
                <button type="button" style={styles.secondaryButton} onClick={() => setIsStockOpen(false)}>Cancelar</button>
                <button type="submit" style={styles.mainButton}>Cargar Códigos</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RedeemableItemsManagement;