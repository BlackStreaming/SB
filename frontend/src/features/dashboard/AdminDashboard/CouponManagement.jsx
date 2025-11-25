// src/features/dashboard/AdminDashboard/CouponManagement.jsx

import React, { useState, useEffect } from 'react';
import apiClient from '/src/services/apiClient.js';
import { 
  FiTag, FiTrash2, FiEdit2, FiPlus, FiUser, FiUsers, 
  FiCheckCircle, FiXCircle, FiPercent, FiHash, FiSave
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
    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s ease'
  },
  actionBtn: { padding: '6px', borderRadius: '8px', cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' },
  btnEdit: { background: 'rgba(102, 126, 234, 0.15)', color: '#667eea', marginRight: '8px' },
  btnDelete: { background: 'rgba(220, 53, 69, 0.15)', color: '#ff6b6b' },

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
  badgeDiamond: { background: 'rgba(0, 191, 255, 0.15)', color: '#00BFFF', border: '1px solid rgba(0, 191, 255, 0.3)' },
  badgeVip: { background: 'rgba(255, 215, 0, 0.15)', color: '#FFD700', border: '1px solid rgba(255, 215, 0, 0.3)' },
  badgePublic: { background: 'rgba(255, 255, 255, 0.1)', color: '#ccc', border: '1px solid rgba(255, 255, 255, 0.1)' },

  // Modales
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' },
  modalContent: { background: '#1a1a1a', borderRadius: '16px', padding: '30px', width: '100%', maxWidth: '500px', border: '1px solid rgba(255,255,255,0.1)', position: 'relative' },
  modalTitle: { fontSize: '1.5rem', fontWeight: '700', marginBottom: '20px', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' },
  
  inputLabel: { fontSize: '0.8rem', fontWeight: '600', color: '#a0a0a0', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' },
  input: { 
    width: '100%', padding: '10px 12px', border: '1px solid rgba(255, 255, 255, 0.1)', 
    borderRadius: '10px', fontSize: '0.9rem', backgroundColor: 'rgba(40, 40, 40, 0.6)', 
    color: '#ffffff', boxSizing: 'border-box', marginBottom: '16px'
  },
  select: {
    width: '100%', padding: '10px 12px', border: '1px solid rgba(255, 255, 255, 0.1)', 
    borderRadius: '10px', fontSize: '0.9rem', backgroundColor: 'rgba(40, 40, 40, 0.6)', 
    color: '#ffffff', boxSizing: 'border-box', cursor: 'pointer', marginBottom: '16px'
  },
  
  // UI States
  emptyState: { textAlign: 'center', padding: '60px 40px', color: '#a0a0a0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '20px' },
};

const initialForm = {
  code: '',
  discount_percent: '',
  max_uses: '',
  required_tier: '', 
  assigned_user_id: '', 
  is_active: true
};

const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [diamondUsers, setDiamondUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  // --- LÓGICA ORIGINAL INTACTA ---
  const fetchCoupons = async () => {
    try {
      const res = await apiClient.get('/coupons');
      setCoupons(res.data);
    } catch (error) { console.error('Error cupones:', error); }
  };

  const fetchDiamondUsers = async () => {
    try {
      const res = await apiClient.get('/admin/users/diamond');
      setDiamondUsers(res.data);
    } catch (error) { console.error('Error usuarios diamante:', error); }
  };

  useEffect(() => {
    fetchCoupons();
    fetchDiamondUsers();
  }, []);

  const handleOpenModal = (coupon = null) => {
    if (coupon) {
      setEditingId(coupon.id);
      setForm({
        code: coupon.code,
        discount_percent: coupon.discount_percent,
        max_uses: coupon.max_uses,
        required_tier: coupon.required_tier || '',
        assigned_user_id: coupon.assigned_user_id || '', 
        is_active: coupon.is_active
      });
    } else {
      setEditingId(null);
      setForm(initialForm);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        discount_percent: parseFloat(form.discount_percent),
        max_uses: parseInt(form.max_uses),
        required_tier: form.required_tier === '' ? null : form.required_tier,
        assigned_user_id: (form.required_tier === 'diamante' && form.assigned_user_id) ? form.assigned_user_id : null
      };

      if (editingId) {
        await apiClient.put(`/coupons/${editingId}`, payload);
      } else {
        await apiClient.post('/coupons', payload);
      }
      await fetchCoupons();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar el cupón.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar cupón?')) {
      try { await apiClient.delete(`/coupons/${id}`); fetchCoupons(); } 
      catch (error) { console.error(error); }
    }
  };

  const getAssignedUserName = (userId) => {
    const user = diamondUsers.find(u => u.id === userId);
    return user ? user.username : 'ID Desconocido';
  };

  return (
    <div style={styles.container}>
      <div style={styles.backgroundDecoration} />
      
      {/* Header */}
      <div style={styles.headerSection}>
        <div>
          <h1 style={styles.headerTitle}><FiTag /> Gestión de Cupones</h1>
          <div style={{fontSize:'0.9rem', color:'#888', marginTop:4}}>Administra descuentos y asignaciones especiales</div>
        </div>
        <button style={styles.mainButton} onClick={() => handleOpenModal()}>
          <FiPlus /> Nuevo Cupón
        </button>
      </div>

      {/* Tabla */}
      <div style={styles.tableSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}><FiPercent color="#667eea" /> Cupones Activos</h2>
          <div style={styles.sectionCount}>{coupons.length}</div>
        </div>

        {coupons.length === 0 ? (
            <div style={styles.emptyState}>
                <FiTag size={48} color="#667eea" />
                <p>No hay cupones creados.</p>
            </div>
        ) : (
            <div style={styles.tableContainer}>
            <table style={styles.table}>
                <thead>
                <tr>
                    <th style={styles.th}>Código</th>
                    <th style={styles.th}>Descuento</th>
                    <th style={styles.th}>Nivel (Tier)</th>
                    <th style={styles.th}>Asignado A</th>
                    <th style={styles.th}>Usos</th>
                    <th style={styles.th}>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {coupons.map((coupon, index) => (
                    <tr key={coupon.id} style={{backgroundColor: index % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.02)'}}>
                    <td style={styles.td}>
                        <code style={{background:'rgba(102, 126, 234, 0.1)', color:'#667eea', padding:'4px 8px', borderRadius:6, fontSize:'0.9rem'}}>
                            {coupon.code}
                        </code>
                    </td>
                    <td style={{...styles.td, color:'#2ecc71', fontWeight:700}}>{parseInt(coupon.discount_percent)}%</td>
                    <td style={styles.td}>
                        {coupon.required_tier === 'diamante' ? 
                        <span style={{...styles.badge, ...styles.badgeDiamond}}>💎 Diamante</span> : 
                        (coupon.required_tier === 'vip' ? <span style={{...styles.badge, ...styles.badgeVip}}>⭐ VIP</span> : 
                        <span style={{...styles.badge, ...styles.badgePublic}}>🌐 Todos</span>)
                        }
                    </td>
                    <td style={styles.td}>
                        {coupon.assigned_user_id ? (
                            <span style={{color: '#00BFFF', display: 'flex', alignItems: 'center', gap: '6px', fontWeight:500}}>
                                <FiUser size={14}/> {getAssignedUserName(coupon.assigned_user_id)}
                            </span>
                        ) : (
                            coupon.required_tier === 'diamante' ? <span style={{color: '#888', display:'flex', alignItems:'center', gap:'6px', fontStyle:'italic'}}><FiUsers size={14}/> Todos</span> : '-'
                        )}
                    </td>
                    <td style={styles.td}>{coupon.current_uses} / {coupon.max_uses}</td>
                    <td style={styles.td}>
                        <div style={{display:'flex'}}>
                            <button onClick={() => handleOpenModal(coupon)} style={{...styles.actionBtn, ...styles.btnEdit}}><FiEdit2 /></button>
                            <button onClick={() => handleDelete(coupon.id)} style={{...styles.actionBtn, ...styles.btnDelete}}><FiTrash2 /></button>
                        </div>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>{editingId ? 'Editar' : 'Crear'} Cupón</h3>
            
            <form onSubmit={handleSubmit}>
              <label style={styles.inputLabel}><FiHash size={14}/> Código</label>
              <input 
                style={{...styles.input, textTransform: 'uppercase', letterSpacing:1}} 
                value={form.code} 
                onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} 
                required 
                placeholder="Ej: PROMO2024"
              />

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                <div>
                    <label style={styles.inputLabel}><FiPercent size={14}/> Descuento</label>
                    <input type="number" style={styles.input} value={form.discount_percent} onChange={e => setForm({...form, discount_percent: e.target.value})} required />
                </div>
                <div>
                    <label style={styles.inputLabel}><FiHash size={14}/> Límite Usos</label>
                    <input type="number" style={styles.input} value={form.max_uses} onChange={e => setForm({...form, max_uses: e.target.value})} required />
                </div>
              </div>

              <label style={styles.inputLabel}><FiCheckCircle size={14}/> Nivel Requerido</label>
              <select style={styles.select} value={form.required_tier} onChange={e => setForm({...form, required_tier: e.target.value, assigned_user_id: ''})}>
                <option value="">🌐 Todos (Público)</option>
                <option value="vip">⭐ VIP</option>
                <option value="diamante">💎 Diamante</option>
              </select>

              {/* SELECTOR DE USUARIO (Solo aparece si es Diamante) */}
              {form.required_tier === 'diamante' && (
                <div style={{marginBottom: '16px', border: '1px solid rgba(0, 191, 255, 0.3)', padding: '16px', borderRadius: '12px', background: 'rgba(0, 191, 255, 0.05)'}}>
                    <label style={{...styles.inputLabel, color: '#00BFFF'}}>
                        <FiUser style={{marginRight: 5}}/> Asignar a Usuario Específico (Opcional)
                    </label>
                    <select style={{...styles.select, marginBottom:8}} value={form.assigned_user_id} onChange={e => setForm({...form, assigned_user_id: e.target.value})}>
                        <option value="">-- Disponible para TODOS los Diamante --</option>
                        {diamondUsers.map(user => (
                            <option key={user.id} value={user.id}>{user.username} ({user.email})</option>
                        ))}
                    </select>
                    <small style={{color: '#aaa', fontSize: '0.8rem'}}>
                        Si seleccionas a alguien, <b>solo ese usuario</b> verá este cupón.
                    </small>
                </div>
              )}

              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px'}}>
                <button type="button" style={styles.secondaryButton} onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" style={styles.mainButton} disabled={loading}>
                    <FiSave /> {loading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponManagement;