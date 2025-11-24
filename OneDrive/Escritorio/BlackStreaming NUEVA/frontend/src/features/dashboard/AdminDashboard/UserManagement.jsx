// src/features/dashboard/AdminDashboard/UserManagement.jsx

import React, { useState, useEffect } from 'react';
import apiClient from '/src/services/apiClient.js';
import { 
  FiUser, FiEdit, FiTrash2, FiSave, FiX, FiShield, 
  FiUsers, FiDollarSign, FiCheckCircle, FiAlertCircle, FiLock 
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
  
  // Badges de Rol y Estado
  badge: { padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '4px' },
  
  roleAdmin: { background: 'rgba(255, 87, 34, 0.15)', color: '#FF5722', border: '1px solid rgba(255, 87, 34, 0.3)' },
  roleProvider: { background: 'rgba(156, 39, 176, 0.15)', color: '#9C27B0', border: '1px solid rgba(156, 39, 176, 0.3)' },
  roleUser: { background: 'rgba(33, 150, 243, 0.15)', color: '#2196F3', border: '1px solid rgba(33, 150, 243, 0.3)' },
  
  statusActive: { background: 'rgba(76, 175, 80, 0.15)', color: '#4CAF50', border: '1px solid rgba(76, 175, 80, 0.3)' },
  statusInactive: { background: 'rgba(158, 158, 158, 0.15)', color: '#9E9E9E', border: '1px solid rgba(158, 158, 158, 0.3)' },
  statusBanned: { background: 'rgba(244, 67, 54, 0.15)', color: '#F44336', border: '1px solid rgba(244, 67, 54, 0.3)' },

  // Botones
  actionButton: { 
    padding: '6px', borderRadius: '8px', cursor: 'pointer', border: 'none', 
    display: 'flex', alignItems: 'center', justifyContent: 'center', 
    fontSize: '0.8rem', fontWeight: '600', transition: '0.2s' 
  },
  btnEdit: { background: 'rgba(102, 126, 234, 0.15)', color: '#667eea', marginRight: '8px' },
  btnDelete: { background: 'rgba(220, 53, 69, 0.15)', color: '#ff6b6b' },
  
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
  error: { background: 'rgba(220, 53, 69, 0.15)', color: '#ff6b6b', border: '1px solid rgba(220, 53, 69, 0.3)', padding: '16px', borderRadius: '12px', marginBottom: '20px' },
  message: { padding: '12px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' },
  success: { background: 'rgba(39, 174, 96, 0.15)', color: '#2ecc71', border: '1px solid rgba(39, 174, 96, 0.3)' }
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const [editingUser, setEditingUser] = useState(null);
  const [editData, setEditData] = useState({});

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

  useEffect(() => { fetchUsers(); }, []);

  // --- Handlers ---

  const handleDelete = async (userId) => {
    if (window.confirm('¿Eliminar usuario permanentemente?')) {
      try {
        await apiClient.delete(`/users/${userId}`);
        setMessage('Usuario eliminado.');
        fetchUsers();
      } catch (err) {
        setError('Error al eliminar usuario.');
      }
    }
  };

  const handleOpenModal = (user) => {
    setEditingUser(user);
    setEditData({ ...user });
  };

  const handleCloseModal = () => {
    setEditingUser(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await apiClient.put(`/users/${editingUser.id}`, editData);
      setUsers(prev => prev.map(u => u.id === editingUser.id ? response.data : u));
      setMessage('Usuario actualizado.');
      handleCloseModal();
    } catch (err) {
      setError('Error al guardar cambios.');
    }
  };

  // Helpers Visuales
  const getRoleStyle = (role) => {
    switch(role) {
      case 'administrador': return styles.roleAdmin;
      case 'proveedor': return styles.roleProvider;
      default: return styles.roleUser;
    }
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'activo': return styles.statusActive;
      case 'bloqueado': return styles.statusBanned;
      default: return styles.statusInactive;
    }
  };

  if (loading) return <div style={styles.loading}>Cargando usuarios...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.backgroundDecoration} />
      
      <div style={styles.headerSection}>
        <h1 style={styles.header}>Gestión de Usuarios</h1>
      </div>

      {message && <div style={{...styles.message, ...styles.success}}><FiCheckCircle size={16}/> {message}</div>}
      {error && <div style={styles.error}><FiAlertCircle size={16}/> {error}</div>}
      
      <div style={styles.tableSection}>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionTitle}><FiUsers /> Lista de Usuarios</div>
          <div style={styles.sectionCount}>{users.length}</div>
        </div>

        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Username</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Rol</th>
                <th style={styles.th}>Estado</th>
                <th style={styles.th}>Saldo</th>
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={user.id} style={{backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.02)'}}>
                  <td style={{...styles.td, fontFamily:'monospace', color:'#888'}}>{user.id.substring(0, 8)}...</td>
                  <td style={{...styles.td, fontWeight:'bold', color:'#fff'}}>{user.username}</td>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}>
                    <span style={{...styles.badge, ...getRoleStyle(user.role)}}>
                        {user.role}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={{...styles.badge, ...getStatusStyle(user.status)}}>
                        {user.status}
                    </span>
                  </td>
                  <td style={{...styles.td, color:'#2ecc71', fontWeight:'bold'}}>
                    ${(parseFloat(user.balance_usd) || 0).toFixed(2)}
                  </td>
                  <td style={styles.td}>
                    <div style={{display:'flex'}}>
                      <button style={{...styles.actionButton, ...styles.btnEdit}} onClick={() => handleOpenModal(user)}>
                        <FiEdit size={14} />
                      </button>
                      <button style={{...styles.actionButton, ...styles.btnDelete}} onClick={() => handleDelete(user.id)}>
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && <tr><td colSpan="7" style={{textAlign:'center', padding:30, color:'#666'}}>Sin usuarios.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL DE EDICIÓN --- */}
      {editingUser && (
        <div style={styles.modalOverlay} onClick={handleCloseModal}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button onClick={handleCloseModal} style={styles.modalCloseBtn}><FiX /></button>
            
            <h3 style={styles.modalTitle}><FiEdit /> Editar Usuario</h3>
            <p style={{color:'#aaa', marginBottom: 20, fontSize:'0.9rem'}}>Editando a: <strong>{editingUser.username}</strong></p>
            
            <form>
              <div style={styles.inputGroup}>
                <label htmlFor="role" style={styles.inputLabel}><FiShield size={14}/> Rol</label>
                <select name="role" value={editData.role} onChange={handleChange} style={styles.select}>
                  <option value="usuario">Usuario</option>
                  <option value="administrador">Administrador</option>
                  <option value="proveedor">Proveedor</option>
                  <option value="afiliador">Afiliador</option>
                </select>
              </div>

              <div style={styles.inputGroup}>
                <label htmlFor="status" style={styles.inputLabel}><FiLock size={14}/> Estado</label>
                <select name="status" value={editData.status} onChange={handleChange} style={styles.select}>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                  <option value="suspendido">Suspendido</option>
                  <option value="bloqueado">Bloqueado</option>
                </select>
              </div>

              <div style={styles.inputGroup}>
                <label htmlFor="balance_usd" style={styles.inputLabel}><FiDollarSign size={14}/> Saldo (USD)</label>
                <input type="number" step="0.01" name="balance_usd" value={editData.balance_usd} onChange={handleChange} style={styles.input} />
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

export default UserManagement;