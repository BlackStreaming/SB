// src/features/dashboard/AdminDashboard/RechargeSettings.jsx

import React, { useState, useEffect } from 'react';
import apiClient from '/src/services/apiClient.js';
import { 
  FiSave, FiTrash2, FiPlus, FiDollarSign, FiPhone, FiImage, 
  FiSettings, FiCreditCard, FiCheckCircle, FiAlertCircle, FiX, FiRefreshCw 
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
    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
  },
  headerTitle: { 
    fontSize: '2rem', fontWeight: '800', margin: 0,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    display: 'flex', alignItems: 'center', gap: '12px'
  },

  // Sections
  section: {
    background: 'rgba(25, 25, 25, 0.8)', backdropFilter: 'blur(20px)', borderRadius: '16px',
    padding: '24px', border: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '24px', position: 'relative', zIndex: 1
  },
  sectionHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' },
  sectionTitle: { fontSize: '1.2rem', fontWeight: '700', color: '#fff', margin: 0 },

  // Inputs & Grid
  gridTwo: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' },
  gridThree: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' },
  
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '0.85rem', fontWeight: '600', color: '#a0a0a0', display: 'flex', alignItems: 'center', gap: '6px' },
  input: { 
    width: '100%', padding: '12px', border: '1px solid rgba(255, 255, 255, 0.1)', 
    borderRadius: '10px', fontSize: '0.9rem', backgroundColor: 'rgba(40, 40, 40, 0.6)', 
    color: '#ffffff', boxSizing: 'border-box', transition: '0.2s'
  },
  fileInput: {
    padding: '10px', background: 'rgba(40, 40, 40, 0.4)', borderRadius: '10px', border: '1px dashed rgba(255,255,255,0.2)', width: '100%', color: '#aaa', cursor: 'pointer'
  },

  // Buttons
  mainButton: { 
    padding: '12px 24px', border: 'none', borderRadius: '10px', 
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
    color: 'white', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer', display: 'flex', 
    alignItems: 'center', gap: '8px', transition: 'all 0.3s ease', justifyContent: 'center'
  },
  btnDelete: { 
    padding: '8px 16px', background: 'rgba(220, 53, 69, 0.15)', color: '#ff6b6b', 
    border: '1px solid rgba(220, 53, 69, 0.3)', borderRadius: '8px', cursor: 'pointer', 
    fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', width: '100%', justifyContent: 'center', marginTop: '12px'
  },

  // Cards (Payment Methods)
  methodsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' },
  methodCard: { 
    background: 'rgba(30, 30, 30, 0.6)', borderRadius: '16px', padding: '16px', 
    border: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center',
    transition: 'transform 0.2s ease', position: 'relative', overflow: 'hidden'
  },
  qrPreview: { width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px', marginBottom: '12px', border: '1px solid rgba(255,255,255,0.1)' },
  methodInfo: { width: '100%', textAlign: 'left' },
  methodName: { fontWeight: '700', color: '#fff', fontSize: '1.1rem' },
  methodDetail: { fontSize: '0.85rem', color: '#aaa', marginTop: '4px' },
  currencyBadge: { 
    position: 'absolute', top: '10px', right: '10px', padding: '4px 10px', borderRadius: '20px', 
    fontSize: '0.7rem', fontWeight: 'bold', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)'
  },

  // Feedback
  loading: { textAlign: 'center', padding: '60px', color: '#888' },
  message: { padding: '12px', borderRadius: '10px', marginBottom: '20px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' },
  successMsg: { background: 'rgba(39, 174, 96, 0.15)', color: '#2ecc71', border: '1px solid rgba(39, 174, 96, 0.3)' },
  errorMsg: { background: 'rgba(220, 53, 69, 0.15)', color: '#ff6b6b', border: '1px solid rgba(220, 53, 69, 0.3)' },
};

const RechargeSettings = () => {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Estados Globales
  const [config, setConfig] = useState({ exchange_rate: '', whatsapp_number: '' });
  
  // Estados Métodos
  const [methods, setMethods] = useState([]);
  const [newMethod, setNewMethod] = useState({ name: '', account_name: '', currency: 'SOL', image: null });

  // --- Cargar Datos ---
  const fetchData = async () => {
    try {
      setLoading(true); setError(null);
      // Usamos endpoint público o admin según tu API, aquí asumo que el admin tiene permiso para leer config
      const res = await apiClient.get('/config/recharge'); 
      setConfig({ 
          exchange_rate: res.data.exchange_rate, 
          whatsapp_number: res.data.whatsapp_number 
      });
      setMethods(res.data.payment_methods || []);
    } catch (err) { 
      console.error(err); 
      setError('Error al cargar la configuración.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // --- Handlers ---

  const handleSaveConfig = async () => {
    setIsSubmitting(true); setMessage(null); setError(null);
    try {
      await apiClient.put('/admin/config/settings', config);
      setMessage('Configuración global actualizada correctamente.');
      setTimeout(() => setMessage(null), 3000);
    } catch (err) { 
      setError('Error al guardar la configuración global.'); 
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateMethod = async (e) => {
    e.preventDefault();
    if (!newMethod.image) return setError('Debes seleccionar una imagen QR.');

    setIsSubmitting(true); setMessage(null); setError(null);
    const formData = new FormData();
    formData.append('name', newMethod.name);
    formData.append('account_name', newMethod.account_name);
    formData.append('currency', newMethod.currency);
    formData.append('image', newMethod.image);

    try {
      await apiClient.post('/admin/payment-methods', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage('Método de pago agregado exitosamente.');
      setNewMethod({ name: '', account_name: '', currency: 'SOL', image: null });
      fetchData(); // Recargar lista
      // Reset file input value visual hack
      document.getElementById('file-upload').value = "";
    } catch (err) { 
      setError('Error al crear método de pago.'); 
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMethod = async (id) => {
    if(!window.confirm('¿Estás seguro de eliminar este método de pago?')) return;
    try {
      await apiClient.delete(`/admin/payment-methods/${id}`);
      setMessage('Método eliminado.');
      fetchData();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) { 
      setError('Error al eliminar el método.'); 
    }
  };

  if (loading) return <div style={styles.loading}><FiRefreshCw className="animate-spin" size={30}/> Cargando configuración...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.backgroundDecoration} />

      {/* HEADER */}
      <div style={styles.headerSection}>
        <h1 style={styles.headerTitle}><FiSettings /> Configuración de Recargas</h1>
      </div>

      {/* FEEDBACK */}
      {message && <div style={{...styles.message, ...styles.successMsg}}><FiCheckCircle /> {message}</div>}
      {error && <div style={{...styles.message, ...styles.errorMsg}}><FiAlertCircle /> {error} <button onClick={() => setError(null)} style={{background:'none', border:'none', color:'inherit', marginLeft:'auto'}}><FiX/></button></div>}

      {/* SECCIÓN 1: CONFIGURACIÓN GLOBAL */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
            <FiDollarSign color="#667eea" size={20} />
            <h2 style={styles.sectionTitle}>Valores Generales</h2>
        </div>
        
        <div style={styles.gridTwo}>
            <div style={styles.inputGroup}>
                <label style={styles.label}><FiDollarSign /> Tasa de Cambio (USD a SOL)</label>
                <input 
                    type="number" step="0.01" 
                    style={styles.input} 
                    placeholder="Ej: 3.85"
                    value={config.exchange_rate} 
                    onChange={e => setConfig({...config, exchange_rate: e.target.value})}
                />
            </div>
            <div style={styles.inputGroup}>
                <label style={styles.label}><FiPhone /> WhatsApp de Confirmación</label>
                <input 
                    type="text" 
                    style={styles.input} 
                    placeholder="Ej: 51999999999"
                    value={config.whatsapp_number} 
                    onChange={e => setConfig({...config, whatsapp_number: e.target.value})}
                />
            </div>
        </div>
        <div style={{marginTop: 20, display:'flex', justifyContent:'flex-end'}}>
            <button style={{...styles.mainButton, width:'200px'}} onClick={handleSaveConfig} disabled={isSubmitting}>
                <FiSave /> {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
            </button>
        </div>
      </div>

      {/* SECCIÓN 2: MÉTODOS DE PAGO */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
            <FiCreditCard color="#764ba2" size={20} />
            <h2 style={styles.sectionTitle}>Métodos de Pago y QRs</h2>
        </div>

        {/* Formulario Agregar */}
        <form onSubmit={handleCreateMethod} style={{background:'rgba(255,255,255,0.03)', padding:'20px', borderRadius:'12px', border:'1px dashed rgba(255,255,255,0.1)'}}>
            <h4 style={{margin:'0 0 16px 0', color:'#aaa', fontWeight:'500'}}>Agregar Nuevo Método</h4>
            <div style={styles.gridThree}>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Nombre Método</label>
                    <input 
                        style={styles.input} 
                        placeholder="Ej: Yape / Plin" 
                        value={newMethod.name} 
                        onChange={e => setNewMethod({...newMethod, name: e.target.value})} 
                        required 
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Titular de Cuenta</label>
                    <input 
                        style={styles.input} 
                        placeholder="Ej: Juan Pérez" 
                        value={newMethod.account_name} 
                        onChange={e => setNewMethod({...newMethod, account_name: e.target.value})} 
                        required
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Moneda</label>
                    <select 
                        style={styles.input} 
                        value={newMethod.currency} 
                        onChange={e => setNewMethod({...newMethod, currency: e.target.value})}
                    >
                        <option value="SOL">Soles (PEN)</option>
                        <option value="USD">Dólares (USD/USDT)</option>
                    </select>
                </div>
            </div>
            
            <div style={{marginTop: 16}}>
                <label style={styles.label}><FiImage /> Imagen QR</label>
                <input 
                    id="file-upload"
                    type="file" 
                    accept="image/*" 
                    onChange={e => setNewMethod({...newMethod, image: e.target.files[0]})} 
                    style={styles.fileInput}
                    required
                />
            </div>
            
            <button type="submit" style={{...styles.mainButton, width:'100%', marginTop: 20}} disabled={isSubmitting}>
                <FiPlus /> {isSubmitting ? 'Agregando...' : 'Agregar Método'}
            </button>
        </form>

        {/* Lista de Métodos */}
        <div style={styles.methodsGrid}>
            {methods.length === 0 && <div style={{textAlign:'center', gridColumn:'1/-1', padding:30, color:'#666'}}>No hay métodos configurados.</div>}
            
            {methods.map(m => (
                <div key={m.id} style={styles.methodCard}>
                    <span style={styles.currencyBadge}>{m.currency}</span>
                    <img src={m.image_url} alt={m.name} style={styles.qrPreview} />
                    
                    <div style={styles.methodInfo}>
                        <div style={styles.methodName}>{m.name}</div>
                        <div style={styles.methodDetail}>{m.account_name}</div>
                    </div>
                    
                    <button style={styles.btnDelete} onClick={() => handleDeleteMethod(m.id)}>
                        <FiTrash2 /> Eliminar
                    </button>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default RechargeSettings;