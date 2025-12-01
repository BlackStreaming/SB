// src/features/dashboard/AdminDashboard/UserManagement.jsx

import React, { useState, useEffect, useMemo } from 'react';
import apiClient from '/src/services/apiClient.js';
import { 
  FiUser, FiEdit, FiTrash2, FiSave, FiX, FiShield, 
  FiUsers, FiDollarSign, FiCheckCircle, FiAlertCircle, FiLock,
  FiSearch, FiFilter, FiRefreshCw, FiDownload, FiChevronLeft, FiChevronRight,
  FiActivity, FiBriefcase, FiUserCheck, FiXCircle
} from 'react-icons/fi';

// --- ESTILOS DARK GLASS THEME (Unificado con OrderManagement) ---
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
  
  // Badges y Botones
  badge: { padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '4px' },
  
  roleAdmin: { background: 'rgba(244, 67, 54, 0.15)', color: '#F44336', border: '1px solid rgba(244, 67, 54, 0.3)' },
  roleProvider: { background: 'rgba(156, 39, 176, 0.15)', color: '#9C27B0', border: '1px solid rgba(156, 39, 176, 0.3)' },
  roleUser: { background: 'rgba(33, 150, 243, 0.15)', color: '#2196F3', border: '1px solid rgba(33, 150, 243, 0.3)' },
  
  statusActive: { background: 'rgba(76, 175, 80, 0.15)', color: '#4CAF50', border: '1px solid rgba(76, 175, 80, 0.3)' },
  statusInactive: { background: 'rgba(158, 158, 158, 0.15)', color: '#9E9E9E', border: '1px solid rgba(158, 158, 158, 0.3)' },
  statusBanned: { background: 'rgba(244, 67, 54, 0.15)', color: '#F44336', border: '1px solid rgba(244, 67, 54, 0.3)' },

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
  modalContent: { background: '#1a1a1a', borderRadius: '16px', padding: '30px', width: '100%', maxWidth: '450px', border: '1px solid rgba(255,255,255,0.1)', position: 'relative' },
  modalTitle: { fontSize: '1.5rem', fontWeight: '700', marginBottom: '20px', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' },
  modalCloseBtn: { position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1.2rem' },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' },
  
  // Feedback
  loading: { textAlign: 'center', padding: '60px 20px', fontSize: '1.2rem', color: '#a0a0a0' },
  error: { background: 'rgba(220, 53, 69, 0.15)', color: '#ff6b6b', border: '1px solid rgba(220, 53, 69, 0.3)', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' },
  successMsg: { background: 'rgba(39, 174, 96, 0.15)', color: '#2ecc71', border: '1px solid rgba(39, 174, 96, 0.3)', padding: '12px', borderRadius: '10px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Filtros y Paginación
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortType, setSortType] = useState('id_asc');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal
  const [editingUser, setEditingUser] = useState(null);
  const [editData, setEditData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Cargar Usuarios ---
  const fetchUsers = async () => {
    try {
      setLoading(true); setError(null);
      const response = await apiClient.get('/users');
      setUsers(response.data);
      setLastUpdated(new Date());
    } catch (err) {
      setError('No se pudo cargar la lista de usuarios.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // --- Lógica de Filtrado ---
  const filteredUsers = useMemo(() => {
    let result = [...users];

    // 1. Buscador
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(u => 
        u.username.toLowerCase().includes(lower) || 
        u.email.toLowerCase().includes(lower) ||
        u.id.toString().includes(lower)
      );
    }

    // 2. Rol
    if (roleFilter !== 'all') {
      result = result.filter(u => u.role === roleFilter);
    }

    // 3. Estado
    if (statusFilter !== 'all') {
      result = result.filter(u => u.status === statusFilter);
    }

    // 4. Ordenamiento
    if (sortType === 'balance_desc') result.sort((a, b) => parseFloat(b.balance_usd) - parseFloat(a.balance_usd));
    else if (sortType === 'balance_asc') result.sort((a, b) => parseFloat(a.balance_usd) - parseFloat(b.balance_usd));
    else if (sortType === 'id_desc') result.sort((a, b) => b.id - a.id);
    else if (sortType === 'alpha') result.sort((a, b) => a.username.localeCompare(b.username));
    
    return result;
  }, [users, searchTerm, roleFilter, statusFilter, sortType]);

  // Estadísticas Calculadas
  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter(u => u.status === 'activo').length,
    providers: users.filter(u => u.role === 'proveedor').length,
    totalBalance: users.reduce((acc, u) => acc + (parseFloat(u.balance_usd) || 0), 0)
  }), [users]);

  // Paginación Lógica
  useEffect(() => setCurrentPage(1), [searchTerm, roleFilter, statusFilter, sortType]);
  const currentUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // --- Handlers ---

  const handleDelete = async (userId) => {
    if (window.confirm('¿Eliminar usuario permanentemente? Esta acción es irreversible.')) {
      try {
        await apiClient.delete(`/users/${userId}`);
        setMessage('Usuario eliminado correctamente.');
        fetchUsers();
        setTimeout(() => setMessage(null), 3000);
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
    setIsSubmitting(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const response = await apiClient.put(`/users/${editingUser.id}`, editData);
      setUsers(prev => prev.map(u => u.id === editingUser.id ? response.data : u));
      setMessage('Usuario actualizado correctamente.');
      handleCloseModal();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setError('Error al guardar cambios.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportCSV = () => {
    if (filteredUsers.length === 0) return alert('No hay datos para exportar.');
    const headers = ["ID", "Username", "Email", "Rol", "Estado", "Saldo USD"];
    const rows = filteredUsers.map(u => [
      u.id, `"${u.username}"`, `"${u.email}"`, u.role, u.status, (parseFloat(u.balance_usd)||0).toFixed(2)
    ].join(','));
    const blob = new Blob(['\uFEFF' + [headers.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob);
    link.download = `usuarios_${new Date().toISOString().slice(0,10)}.csv`; document.body.appendChild(link); link.click(); document.body.removeChild(link);
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

  if (loading) return <div style={styles.loading}><FiRefreshCw className="animate-spin" size={30}/> Cargando sistema...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.backgroundDecoration} />
      
      {/* HEADER */}
      <div style={styles.headerSection}>
        <div>
          <h1 style={styles.headerTitle}><FiUsers /> Gestión de Usuarios</h1>
          {lastUpdated && <small style={{color:'#888', display:'flex', alignItems:'center', gap:4, marginTop:4}}>Actualizado: {lastUpdated.toLocaleTimeString()}</small>}
        </div>
        <div style={styles.headerActions}>
          <button style={styles.secondaryButton} onClick={handleExportCSV}><FiDownload /> Exportar CSV</button>
          <button style={styles.mainButton} onClick={fetchUsers}><FiRefreshCw /> Actualizar</button>
        </div>
      </div>

      {/* STATS GRID */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div><div style={styles.statLabel}>Total Usuarios</div><div style={styles.statValue}>{stats.total}</div></div>
          <div style={{...styles.statIconWrapper, background: 'rgba(33, 150, 243, 0.2)', color: '#2196F3'}}><FiUsers /></div>
        </div>
        <div style={styles.statCard}>
          <div><div style={styles.statLabel}>Activos</div><div style={{...styles.statValue, color:'#2ecc71'}}>{stats.active}</div></div>
          <div style={{...styles.statIconWrapper, background: 'rgba(46, 204, 113, 0.2)', color: '#2ecc71'}}><FiUserCheck /></div>
        </div>
        <div style={styles.statCard}>
          <div><div style={styles.statLabel}>Proveedores</div><div style={{...styles.statValue, color:'#9C27B0'}}>{stats.providers}</div></div>
          <div style={{...styles.statIconWrapper, background: 'rgba(156, 39, 176, 0.2)', color: '#9C27B0'}}><FiBriefcase /></div>
        </div>
        <div style={styles.statCard}>
          <div><div style={styles.statLabel}>Saldo Global</div><div style={{...styles.statValue, color:'#f1c40f'}}>${stats.totalBalance.toFixed(2)}</div></div>
          <div style={{...styles.statIconWrapper, background: 'rgba(241, 196, 15, 0.2)', color: '#f1c40f'}}><FiDollarSign /></div>
        </div>
      </div>

      {/* MENSAJES FEEDBACK */}
      {message && <div style={styles.successMsg}><FiCheckCircle size={18}/> {message}</div>}
      {error && <div style={styles.error}><FiAlertCircle size={18}/> {error} <button onClick={() => setError(null)} style={{background:'none', border:'none', color:'inherit', cursor:'pointer', marginLeft:'auto'}}><FiX/></button></div>}
      
      {/* FILTROS */}
      <div style={styles.filterSection}>
        <div style={styles.quickFilters}>
          {['all', 'administrador', 'proveedor', 'usuario'].map(role => (
            <button key={role} onClick={() => setRoleFilter(role)} style={{...styles.quickFilterButton, ...(roleFilter === role ? styles.quickFilterActive : {})}}>
              {role === 'all' ? <FiFilter/> : role === 'administrador' ? <FiShield size={12}/> : role === 'proveedor' ? <FiBriefcase size={12}/> : <FiUser size={12}/>} 
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
        </div>

        <div style={styles.filterGroup}>
          <div style={{flex: '1 1 200px'}}>
            <label style={styles.inputLabel}><FiSearch size={14}/> Buscar Usuario</label>
            <input style={styles.input} placeholder="Username, email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <div style={{flex: '1 1 150px'}}>
            <label style={styles.inputLabel}><FiActivity size={14}/> Estado</label>
            <select style={styles.select} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="all">Todos</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
                <option value="bloqueado">Bloqueado</option>
            </select>
          </div>
          <div style={{flex: '1 1 150px'}}>
            <label style={styles.inputLabel}><FiFilter size={14}/> Ordenar</label>
            <select style={styles.select} value={sortType} onChange={e => setSortType(e.target.value)}>
              <option value="id_asc">Registro (Antiguo)</option>
              <option value="id_desc">Registro (Nuevo)</option>
              <option value="balance_desc">Mayor Saldo</option>
              <option value="balance_asc">Menor Saldo</option>
              <option value="alpha">Alfabético</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABLA */}
      <div style={styles.tableSection}>
        <div style={styles.sectionTitle}>
          <FiUsers color="#667eea" /> Lista de Usuarios <span style={{fontSize:'0.9rem', color:'#888', fontWeight:'normal'}}>({filteredUsers.length})</span>
        </div>

        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Usuario</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Rol</th>
                <th style={styles.th}>Estado</th>
                <th style={styles.th}>Saldo</th>
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? currentUsers.map((user, idx) => (
                <tr key={user.id} style={{backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.02)', transition: '0.2s'}}>
                  <td style={{...styles.td, fontFamily:'monospace', color:'#666'}}>{user.id.substring(0, 6)}...</td>
                  <td style={{...styles.td, fontWeight:'bold', color:'#fff'}}>
                    <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                       <div style={{width:24, height:24, background:'#333', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px', color:'#aaa'}}><FiUser/></div>
                       {user.username}
                    </div>
                  </td>
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
                  <td style={{...styles.td, color: user.balance_usd > 0 ? '#2ecc71' : '#666', fontWeight:'bold'}}>
                    ${(parseFloat(user.balance_usd) || 0).toFixed(2)}
                  </td>
                  <td style={styles.td}>
                    <div style={{...styles.actionButtonsWrapper, justifyContent:'flex-end'}}>
                      <button style={{...styles.actionButton, ...styles.btnEdit}} onClick={() => handleOpenModal(user)} title="Editar">
                        <FiEdit size={14} />
                      </button>
                      <button style={{...styles.actionButton, ...styles.btnDelete}} onClick={() => handleDelete(user.id)} title="Eliminar">
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="7" style={{textAlign:'center', padding:40, color:'#666'}}>No se encontraron usuarios con estos filtros.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINACIÓN */}
        {filteredUsers.length > 0 && (
            <div style={styles.paginationWrapper}>
                <span style={{fontSize:'0.9rem', color:'#888'}}>Página {currentPage} de {totalPages}</span>
                <button onClick={() => setCurrentPage(p => p-1)} disabled={currentPage===1} style={{...styles.pageBtn, ...(currentPage===1?styles.pageBtnDisabled:{})}}><FiChevronLeft/> Anterior</button>
                <button onClick={() => setCurrentPage(p => p+1)} disabled={currentPage===totalPages} style={{...styles.pageBtn, ...(currentPage===totalPages?styles.pageBtnDisabled:{})}}>Siguiente <FiChevronRight/></button>
            </div>
        )}
      </div>

      {/* --- MODAL DE EDICIÓN --- */}
      {editingUser && (
        <div style={styles.modalOverlay} onClick={handleCloseModal}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button onClick={handleCloseModal} style={styles.modalCloseBtn}><FiX /></button>
            
            <h3 style={styles.modalTitle}><FiEdit /> Editar Usuario</h3>
            <p style={{color:'#aaa', marginBottom: 20, fontSize:'0.9rem'}}>Usuario: <strong>{editingUser.username}</strong></p>
            
            <form>
              <div style={{marginBottom: 16}}>
                <label style={styles.inputLabel}><FiShield size={14}/> Rol del Sistema</label>
                <select name="role" value={editData.role} onChange={handleChange} style={styles.select}>
                  <option value="usuario">Usuario</option>
                  <option value="administrador">Administrador</option>
                  <option value="proveedor">Proveedor</option>
                  <option value="afiliador">Afiliador</option>
                </select>
              </div>

              <div style={{marginBottom: 16}}>
                <label style={styles.inputLabel}><FiLock size={14}/> Estado de Cuenta</label>
                <select name="status" value={editData.status} onChange={handleChange} style={styles.select}>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                  <option value="suspendido">Suspendido</option>
                  <option value="bloqueado">Bloqueado</option>
                </select>
              </div>

              <div style={{marginBottom: 16}}>
                <label style={styles.inputLabel}><FiDollarSign size={14}/> Saldo de Billetera (USD)</label>
                <input type="number" step="0.01" name="balance_usd" value={editData.balance_usd} onChange={handleChange} style={styles.input} />
              </div>

              <div style={styles.modalActions}>
                <button type="button" style={{...styles.secondaryButton, border:'1px solid #555'}} onClick={handleCloseModal}>Cancelar</button>
                <button type="button" style={{...styles.mainButton, opacity: isSubmitting ? 0.7 : 1}} onClick={handleSave} disabled={isSubmitting}>
                   {isSubmitting ? 'Guardando...' : <><FiSave /> Guardar Cambios</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
