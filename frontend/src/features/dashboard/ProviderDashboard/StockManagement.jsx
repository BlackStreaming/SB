// src/features/dashboard/ProviderDashboard/StockManagement.jsx

import React, { useState, useEffect } from 'react';
import apiClient from '../../../services/apiClient.js'; // Asegura que la ruta sea correcta
import { 
  FiBox, FiPlus, FiEdit2, FiTrash2, FiSave, FiAlertCircle, 
  FiCheckCircle, FiGrid, FiList, FiTerminal, FiUser, FiLock, FiHash,
  FiMail, FiSettings, FiX
} from 'react-icons/fi';

// --- Estilos Unified Compact Theme ---
const styles = {
  container: { padding: '24px 16px', fontFamily: "'Inter', sans-serif", background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 50%, #0f0f0f 100%)', minHeight: '100vh', color: '#e0e0e0' },
  headerSection: { textAlign: 'center', marginBottom: '24px' },
  header: { fontSize: '2rem', fontWeight: '800', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' },
  mainPanel: { background: 'rgba(25, 25, 25, 0.8)', backdropFilter: 'blur(20px)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(255, 255, 255, 0.1)', maxWidth: '1000px', margin: '0 auto' },
  productSelector: { display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'rgba(102, 126, 234, 0.05)', borderRadius: '12px', border: '1px solid rgba(102, 126, 234, 0.2)', marginBottom: '24px' },
  select: { flex: 1, padding: '12px 16px', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', fontSize: '1rem', backgroundColor: 'rgba(40, 40, 40, 0.9)', color: '#ffffff', cursor: 'pointer', boxSizing: 'border-box' },
  configSection: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' },
  configCard: { background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' },
  label: { fontSize: '0.85rem', fontWeight: '600', color: '#a0a0a0', marginBottom: '8px', display: 'block' },
  input: { width: '100%', padding: '10px 12px', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', fontSize: '0.9rem', backgroundColor: 'rgba(40, 40, 40, 0.6)', color: '#ffffff', boxSizing: 'border-box' },
  tabContainer: { display: 'flex', gap: '4px', marginBottom: '16px', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '10px', width: 'fit-content' },
  tabButton: { padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'transparent', color: '#888', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600' },
  tabActive: { background: 'rgba(102, 126, 234, 0.2)', color: '#667eea' },
  bulkTextarea: { width: '100%', padding: '16px', border: '1px solid rgba(102, 126, 234, 0.3)', borderRadius: '10px', fontSize: '0.85rem', backgroundColor: 'rgba(10, 10, 15, 0.95)', color: '#00ff88', fontFamily: 'monospace', minHeight: '150px', resize: 'vertical', boxSizing: 'border-box' },
  button: { padding: '10px 20px', border: 'none', borderRadius: '10px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxSizing: 'border-box', justifyContent: 'center' },
  buttonSecondary: { background: 'rgba(255, 255, 255, 0.1)', color: '#ccc' },
  tableContainer: { overflowX: 'auto', borderRadius: '12px', marginTop: '16px' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' },
  th: { padding: '12px 16px', backgroundColor: 'rgba(40, 40, 40, 0.8)', fontWeight: '700', color: '#a0a0a0', textAlign: 'left', textTransform: 'uppercase', whiteSpace: 'nowrap' },
  td: { padding: '12px 16px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', color: '#e0e0e0', verticalAlign: 'middle' },
  statusBadge: { padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' },
  actionBtn: { padding: '6px', borderRadius: '6px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' },
  btnEdit: { background: 'rgba(255, 193, 7, 0.15)', color: '#ffc107', marginRight: '8px' },
  btnDelete: { background: 'rgba(220, 53, 69, 0.15)', color: '#ff6b6b' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' },
  modalContent: { background: '#1a1a1a', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '500px', border: '1px solid rgba(255,255,255,0.1)' },
  message: { padding: '12px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' },
  success: { background: 'rgba(39, 174, 96, 0.15)', color: '#2ecc71', border: '1px solid rgba(39, 174, 96, 0.3)' },
  error: { background: 'rgba(220, 53, 69, 0.15)', color: '#ff6b6b', border: '1px solid rgba(220, 53, 69, 0.3)' },
  gridInputs: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '16px' }
};

const StockManagement = () => {
  const [productsList, setProductsList] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [currentProduct, setCurrentProduct] = useState(null);
  const [stockLimit, setStockLimit] = useState(0); 
  const [stockItems, setStockItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [uploadMode, setUploadMode] = useState('form');
  const [formStock, setFormStock] = useState({ email: '', password: '', profile_name: '', pin: '' });
  const [bulkStockText, setBulkStockText] = useState('');
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    const fetchProductsList = async () => {
      try {
        const response = await apiClient.get('/provider/products-list');
        setProductsList(response.data);
      } catch (err) { setError('No se pudo cargar la lista de productos.'); }
    };
    fetchProductsList();
  }, []);

  const fetchProductData = async (productId) => {
    if (!productId) { setCurrentProduct(null); setStockItems([]); return; }
    setLoading(true); setError(null); setSuccess(null);
    try {
      const statusResponse = await apiClient.get(`/provider/product-status/${productId}`);
      setCurrentProduct(statusResponse.data);
      setStockLimit(statusResponse.data.stock_quantity || 0);
      if (['en stock', 'agotado', 'activacion'].includes(statusResponse.data.status)) {
        const stockResponse = await apiClient.get(`/provider/stock-items/${productId}`);
        setStockItems(stockResponse.data);
      } else { setStockItems([]); }
    } catch (err) { setError('Error al cargar datos.'); } finally { setLoading(false); }
  };

  const handleProductSelect = (e) => {
    const id = e.target.value;
    setSelectedProductId(id);
    fetchProductData(id);
  };

  const handleSaveStatus = async (newStatus) => {
    setError(null); setSuccess(null); setLoading(true);
    try {
      await apiClient.put(`/provider/product-status/${selectedProductId}`, { 
        status: newStatus, stock_quantity: (newStatus === 'a pedido' || newStatus === 'activacion') ? stockLimit : null
      });
      setSuccess('¡Tipo de venta actualizado!');
      fetchProductData(selectedProductId);
    } catch (err) { setError('Error al guardar configuración.'); } finally { setLoading(false); }
  };

  const handleSaveStockLimit = async (e) => {
    e.preventDefault();
    if (!currentProduct) return;
    setError(null); setSuccess(null); setLoading(true);
    try {
      await apiClient.put(`/provider/product-status/${selectedProductId}`, { 
        status: currentProduct.status, stock_quantity: stockLimit
      });
      setSuccess('¡Límite actualizado!');
      fetchProductData(selectedProductId);
    } catch (err) { setError('Error al guardar límite.'); } finally { setLoading(false); }
  };

  const handleAddStock = async (e) => {
    e.preventDefault();
    setError(null); setSuccess(null);
    let items = [];

    if (uploadMode === 'form') {
      if (currentProduct.status === 'activacion' && !formStock.email) return setError('Email requerido.');
      if (currentProduct.status !== 'activacion' && (!formStock.email && !formStock.password)) return setError('Faltan datos.');
      items.push(currentProduct.status === 'activacion' ? { email: formStock.email } : formStock);
    } else {
      if (!bulkStockText.trim()) return setError('El campo está vacío.');
      items = bulkStockText.split('\n').filter(l => l.trim()).map(l => {
        if (currentProduct.status === 'activacion') return { email: l.trim() };
        const p = l.split(':');
        return { email: p[0], password: p[1], profile_name: p[2], pin: p[3] };
      });
    }

    if (items.length === 0) return setError('No hay datos válidos.');

    try {
      setLoading(true);
      await apiClient.post('/provider/stock-items', { productId: selectedProductId, items });
      setSuccess(`¡${items.length} item(s) añadidos!`);
      setBulkStockText('');
      setFormStock({ email: '', password: '', profile_name: '', pin: '' });
      fetchProductData(selectedProductId);
    } catch (err) { setError('Error al añadir stock.'); } finally { setLoading(false); }
  };

  // --- LÓGICA DE ELIMINAR CORREGIDA ---
  const handleDeleteStockItem = async (id) => {
    if (!id) return alert("Error: ID del item no encontrado."); // Validación extra
    if (!window.confirm('¿Eliminar este item definitivamente?')) return;
    
    try {
      setLoading(true);
      await apiClient.delete(`/provider/stock-items/${id}`);
      setSuccess('Item eliminado del inventario.');
      fetchProductData(selectedProductId); // Refrescar tabla
    } catch (err) { 
        console.error(err);
        setError('Error al eliminar el item. Verifica el backend.'); 
    } finally {
        setLoading(false);
    }
  };

  // --- LÓGICA DE EDITAR CORREGIDA ---
  const handleEditItemSubmit = async (e) => {
    e.preventDefault();
    if (!editingItem || !editingItem.id) return;

    try {
      setLoading(true);
      await apiClient.put(`/provider/stock-items/${editingItem.id}`, editingItem);
      setIsEditModalOpen(false);
      setSuccess('Item actualizado correctamente.');
      fetchProductData(selectedProductId);
    } catch (err) { 
        console.error(err);
        setError('Error al editar el item. Verifica el backend.'); 
    } finally {
        setLoading(false);
    }
  };

  const salesType = currentProduct ? (['a pedido', 'activacion'].includes(currentProduct.status) ? currentProduct.status : 'stock') : 'agotado';

  return (
    <div style={styles.container}>
      <div style={styles.backgroundDecoration} />
      <div style={styles.headerSection}>
        <h1 style={styles.header}>Gestión de Stock</h1>
      </div>

      <div style={styles.mainPanel}>
        {/* Selector */}
        <div style={styles.productSelector}>
          <FiBox size={20} color="#667eea" />
          <select style={styles.select} value={selectedProductId} onChange={handleProductSelect}>
            <option value="">-- Selecciona un Producto --</option>
            {productsList.map(p => <option key={p.id} value={p.id}>{p.name} ({p.status})</option>)}
          </select>
        </div>

        {selectedProductId && currentProduct && (
          <>
            {error && <div style={{...styles.message, ...styles.error}}><FiAlertCircle /> {error}</div>}
            {success && <div style={{...styles.message, ...styles.success}}><FiCheckCircle /> {success}</div>}

            {/* Configuración */}
            <div style={styles.configSection}>
              <div style={styles.configCard}>
                <label style={styles.label}><FiSettings /> Tipo de Venta</label>
                <select 
                  style={styles.select} 
                  value={salesType === 'agotado' ? 'agotado' : salesType}
                  onChange={(e) => handleSaveStatus(e.target.value)}
                  disabled={loading}
                >
                  <option value="agotado">Agotado</option>
                  <option value="stock">Inventario (Stock)</option>
                  <option value="a pedido">A Pedido</option>
                  <option value="activacion">Activación</option>
                </select>
              </div>

              {(salesType === 'a pedido' || salesType === 'activacion') && (
                <div style={styles.configCard}>
                  <label style={styles.label}><FiGrid /> Límite de Stock</label>
                  <div style={{display:'flex', gap: 10}}>
                    <input type="number" style={styles.input} value={stockLimit} onChange={e => setStockLimit(parseInt(e.target.value)||0)} />
                    <button onClick={handleSaveStockLimit} style={styles.button}><FiSave /> Guardar</button>
                  </div>
                </div>
              )}
            </div>

            {/* Área de Carga */}
            {(salesType === 'stock' || salesType === 'activacion') && (
              <div>
                <h3 style={{color:'#fff', marginBottom: 16}}>Añadir Inventario</h3>
                <div style={styles.tabContainer}>
                  <button style={{...styles.tabButton, ...(uploadMode === 'form' ? styles.tabActive : {})}} onClick={() => setUploadMode('form')}>Manual</button>
                  <button style={{...styles.tabButton, ...(uploadMode === 'bulk' ? styles.tabActive : {})}} onClick={() => setUploadMode('bulk')}>Masivo</button>
                </div>

                <form onSubmit={handleAddStock}>
                  {uploadMode === 'form' ? (
                    <div style={styles.gridInputs}>
                      <input name="email" value={formStock.email} onChange={e => setFormStock({...formStock, email: e.target.value})} placeholder="Email" style={styles.input} />
                      {salesType !== 'activacion' && (
                        <>
                          <input name="password" value={formStock.password} onChange={e => setFormStock({...formStock, password: e.target.value})} placeholder="Password" style={styles.input} />
                          <input name="profile_name" value={formStock.profile_name} onChange={e => setFormStock({...formStock, profile_name: e.target.value})} placeholder="Perfil" style={styles.input} />
                          <input name="pin" value={formStock.pin} onChange={e => setFormStock({...formStock, pin: e.target.value})} placeholder="PIN" style={styles.input} />
                        </>
                      )}
                    </div>
                  ) : (
                    <textarea 
                      style={styles.bulkTextarea} 
                      value={bulkStockText} 
                      onChange={e => setBulkStockText(e.target.value)}
                      placeholder={salesType === 'activacion' ? "email1@mail.com\nemail2@mail.com" : "user@mail.com:pass:perfil:pin"}
                    />
                  )}
                  <button type="submit" style={{...styles.button, width:'100%', justifyContent:'center'}} disabled={loading}><FiPlus /> Añadir al Stock</button>
                </form>

                {/* Tabla de Stock */}
                <div style={{marginTop: 32}}>
                  <h4 style={{color:'#fff'}}>Inventario ({stockItems.length})</h4>
                  <div style={styles.tableContainer}>
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th style={styles.th}>ID</th> {/* Agregado ID para debug visual */}
                          <th style={styles.th}><FiMail /> Email</th>
                          {salesType !== 'activacion' && (
                            <>
                              <th style={styles.th}><FiLock /> Pass</th>
                              <th style={styles.th}><FiUser /> Perfil</th>
                              <th style={styles.th}><FiHash /> PIN</th>
                            </>
                          )}
                          <th style={styles.th}>Estado</th>
                          <th style={styles.th}>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stockItems.map(item => (
                          <tr key={item.id}>
                            <td style={styles.td}><small style={{color:'#666'}}>#{item.id}</small></td>
                            <td style={styles.td}>{item.email}</td>
                            {salesType !== 'activacion' && (
                              <>
                                <td style={styles.td}>{item.password}</td>
                                <td style={styles.td}>{item.profile_name}</td>
                                <td style={styles.td}>{item.pin}</td>
                              </>
                            )}
                            <td style={styles.td}>
                              <span style={{...styles.statusBadge, background: item.status === 'vendida' ? 'rgba(220,53,69,0.2)' : 'rgba(39,174,96,0.2)', color: item.status === 'vendida' ? '#ff6b6b' : '#2ecc71'}}>
                                {item.status}
                              </span>
                            </td>
                            <td style={styles.td}>
                              <div style={{display:'flex', gap: 8}}>
                                <button 
                                    onClick={() => { setEditingItem({...item}); setIsEditModalOpen(true); }} 
                                    style={{...styles.actionBtn, ...styles.btnEdit}} 
                                    disabled={item.status === 'vendida'}
                                    title="Editar"
                                >
                                    <FiEdit2 />
                                </button>
                                <button 
                                    onClick={() => handleDeleteStockItem(item.id)} 
                                    style={{...styles.actionBtn, ...styles.btnDelete}} 
                                    disabled={item.status === 'vendida'}
                                    title="Eliminar"
                                >
                                    <FiTrash2 />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {stockItems.length === 0 && <tr><td colSpan="7" style={{textAlign:'center', padding: 30, color:'#666'}}>Sin datos</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal Edición */}
      {isEditModalOpen && editingItem && (
        <div style={styles.modalOverlay} onClick={() => setIsEditModalOpen(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:16}}>
                <h3 style={{color:'#fff', margin:0}}>Editar Item #{editingItem.id}</h3>
                <button onClick={() => setIsEditModalOpen(false)} style={{background:'none', border:'none', color:'#fff', cursor:'pointer'}}><FiX size={20} /></button>
            </div>
            <form onSubmit={handleEditItemSubmit} style={{display:'flex', flexDirection:'column', gap: 12}}>
              <label style={styles.label}>Email</label>
              <input value={editingItem.email} onChange={e => setEditingItem({...editingItem, email: e.target.value})} style={styles.input} placeholder="Email" />
              {salesType !== 'activacion' && (
                <>
                  <label style={styles.label}>Password</label>
                  <input value={editingItem.password} onChange={e => setEditingItem({...editingItem, password: e.target.value})} style={styles.input} placeholder="Password" />
                  <label style={styles.label}>Perfil</label>
                  <input value={editingItem.profile_name} onChange={e => setEditingItem({...editingItem, profile_name: e.target.value})} style={styles.input} placeholder="Perfil" />
                  <label style={styles.label}>PIN</label>
                  <input value={editingItem.pin} onChange={e => setEditingItem({...editingItem, pin: e.target.value})} style={styles.input} placeholder="PIN" />
                </>
              )}
              <div style={{display:'flex', gap: 10, marginTop: 10}}>
                <button type="submit" style={{...styles.button, flex:1, justifyContent:'center'}} disabled={loading}><FiSave /> Guardar</button>
                <button type="button" onClick={() => setIsEditModalOpen(false)} style={{...styles.button, ...styles.buttonSecondary, flex:1, justifyContent:'center'}}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockManagement;