// src/features/dashboard/AdminDashboard/RankManagement.jsx

import React, { useState, useEffect } from 'react';
import apiClient from '/src/services/apiClient.js'; 
import { FiUser, FiEdit, FiSave, FiX, FiUsers, FiClock, FiAward, FiCalendar } from 'react-icons/fi';

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
  headerSection: { textAlign: 'center', marginBottom: '32px', position: 'relative', zIndex: 1 },
  header: { 
    fontSize: '2rem', fontWeight: '800', 
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px'
  },

  // Tabla
  tableSection: {
    background: 'rgba(25, 25, 25, 0.8)', backdropFilter: 'blur(20px)', borderRadius: '16px',
    padding: '24px', border: '1px solid rgba(255, 255, 255, 0.1)', position: 'relative', zIndex: 1
  },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  sectionTitle: { fontSize: '1.2rem', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' },
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
  
  // Badges de Rango
  rankBadge: { padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '4px' },
  rankFree: { background: 'rgba(108, 117, 125, 0.15)', color: '#adb5bd', border: '1px solid rgba(108, 117, 125, 0.3)' },
  rankVip: { background: 'rgba(255, 193, 7, 0.15)', color: '#ffc107', border: '1px solid rgba(255, 193, 7, 0.3)' },
  rankDiamond: { background: 'rgba(0, 191, 255, 0.15)', color: '#00BFFF', border: '1px solid rgba(0, 191, 255, 0.3)' },

  // Botones
  actionButton: { 
    padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', border: 'none', 
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
    fontSize: '0.75rem', fontWeight: '600', transition: '0.2s',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white'
  },
  
  // Modal
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' },
  modalContent: { background: '#1a1a1a', borderRadius: '16px', padding: '30px', width: '100%', maxWidth: '450px', border: '1px solid rgba(255,255,255,0.1)', position: 'relative' },
  modalTitle: { fontSize: '1.5rem', fontWeight: '700', marginBottom: '20px', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' },
  modalCloseBtn: { position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1.2rem' },
  
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' },
  inputLabel: { fontSize: '0.8rem', fontWeight: '600', color: '#a0a0a0', display: 'flex', alignItems: 'center', gap: '6px' },
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
  
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' },
  btnCancel: { padding: '10px 20px', background: 'transparent', border: '1px solid #555', color: '#aaa', borderRadius: '10px', cursor: 'pointer' },
  btnSave: { padding: '10px 20px', background: '#667eea', border: 'none', color: '#fff', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' },

  // Estados
  loading: { textAlign: 'center', padding: '60px', color: '#888', fontSize: '1.1rem' },
  error: { background: 'rgba(220, 53, 69, 0.15)', color: '#ff6b6b', border: '1px solid rgba(220, 53, 69, 0.3)', padding: '16px', borderRadius: '12px', marginBottom: '20px' }
};

const RankManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado para el modal de edición
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editData, setEditData] = useState({
    account_tier: 'free',
    tier_expires_at: ''
  });

  // --- Cargar Usuarios ---
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/users');
      setUsers(response.data);
    } catch (err) {
      setError('No se pudo cargar la lista de usuarios.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- Lógica del Modal ---

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setEditData({
      account_tier: user.account_tier || 'free',
      tier_expires_at: formatDateForInput(user.tier_expires_at),
      // Datos requeridos por la API (aunque no se editen)
      role: user.role,
      status: user.status,
      balance_usd: user.balance_usd
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  // --- Lógica de Guardado ---
  const handleSave = async () => {
    if (!selectedUser) return;

    const dataToSend = {
      ...editData,
      account_tier: editData.account_tier,
      tier_expires_at: editData.tier_expires_at || null
    };

    try {
      await apiClient.put(`/users/${selectedUser.id}`, dataToSend);
      setUsers(prevUsers => 
        prevUsers.map(u => u.id === selectedUser.id ? { ...u, ...dataToSend } : u)
      );
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al actualizar el rango.');
    }
  };

  // Helper para estilos de badge
  const getRankStyle = (tier) => {
    switch(tier) {
      case 'diamante': return styles.rankDiamond;
      case 'vip': return styles.rankVip;
      default: return styles.rankFree;
    }
  };

  const getRankIcon = (tier) => {
    switch(tier) {
      case 'diamante': return '💎';
      case 'vip': return '⭐';
      default: return '👤';
    }
  };

  if (loading) return <div style={styles.loading}>Cargando usuarios...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.backgroundDecoration} />
      
      <div style={styles.headerSection}>
        <h1 style={styles.header}>Gestión de Rangos</h1>
      </div>

      {error && <div style={styles.error}>{error}</div>}
      
      <div style={styles.tableSection}>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionTitle}><FiUsers /> Usuarios Registrados</div>
          <div style={styles.sectionCount}>{users.length}</div>
        </div>

        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Usuario</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Rango (Tier)</th>
                <th style={styles.th}>Expira</th>
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={user.id} style={{backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.02)'}}>
                  <td style={styles.td}>
                    <div style={{fontWeight:'bold', color:'#fff'}}>{user.username}</div>
                  </td>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}>
                    <span style={{...styles.rankBadge, ...getRankStyle(user.account_tier)}}>
                       {getRankIcon(user.account_tier)} {user.account_tier || 'Free'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {user.tier_expires_at ? (
                        <span style={{display:'flex', alignItems:'center', gap:4, color: '#ccc'}}>
                            <FiClock size={12}/> {new Date(user.tier_expires_at).toLocaleDateString()}
                        </span>
                    ) : <span style={{color:'#666'}}>-</span>}
                  </td>
                  <td style={styles.td}>
                    <button 
                      style={styles.actionButton}
                      onClick={() => handleOpenModal(user)}
                    >
                      <FiEdit size={12} /> Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL DE EDICIÓN --- */}
      {isModalOpen && selectedUser && (
        <div style={styles.modalOverlay} onClick={handleCloseModal}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button onClick={handleCloseModal} style={styles.modalCloseBtn}><FiX /></button>
            
            <h3 style={styles.modalTitle}><FiAward /> Editar Rango</h3>
            <p style={{color:'#aaa', marginBottom: 20, fontSize:'0.9rem'}}>Usuario: <strong>{selectedUser.username}</strong></p>
            
            <form>
              <div style={styles.inputGroup}>
                <label htmlFor="account_tier" style={styles.inputLabel}><FiAward size={14}/> Rango (Tier)</label>
                <select
                  id="account_tier"
                  name="account_tier"
                  value={editData.account_tier}
                  onChange={handleChange}
                  style={styles.select}
                >
                  <option value="free">Free</option>
                  <option value="vip">VIP</option>
                  <option value="diamante">Diamante</option>
                </select>
              </div>

              <div style={styles.inputGroup}>
                <label htmlFor="tier_expires_at" style={styles.inputLabel}><FiCalendar size={14}/> Expiración del Rango</label>
                <input
                  type="date"
                  id="tier_expires_at"
                  name="tier_expires_at"
                  value={editData.tier_expires_at}
                  onChange={handleChange}
                  style={styles.input}
                />
                <small style={{color:'#666', fontSize:'0.75rem', fontStyle:'italic'}}>Dejar vacío para duración indefinida.</small>
              </div>

              <div style={styles.modalActions}>
                <button type="button" style={styles.btnCancel} onClick={handleCloseModal}>Cancelar</button>
                <button type="button" style={styles.btnSave} onClick={handleSave}><FiSave /> Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RankManagement;