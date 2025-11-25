// src/features/dashboard/ProviderDashboard/ProviderAffiliatePanel.jsx

import React, { useState, useEffect } from 'react';
import apiClient from '/src/services/apiClient';
import { FiUsers, FiCheck, FiLock, FiAlertTriangle, FiUserCheck, FiSearch, FiUserPlus } from 'react-icons/fi';

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
  
  // Layout Principal
  gridContainer: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
    gap: '24px', 
    position: 'relative', 
    zIndex: 1 
  },

  // Header Section
  headerSection: { textAlign: 'center', marginBottom: '32px', position: 'relative', zIndex: 1 },
  header: { 
    fontSize: '2rem', fontWeight: '800', 
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px'
  },
  subtitle: { fontSize: '1.1rem', color: '#b0b0b0', maxWidth: '600px', margin: '0 auto' },

  // Tarjeta de Cupo (Hero)
  limitCard: {
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)', 
    border: '1px solid rgba(102, 126, 234, 0.3)', borderRadius: '16px', padding: '24px', 
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px',
    position: 'relative', zIndex: 1, backdropFilter: 'blur(10px)'
  },
  limitLabel: { color: '#a0a0a0', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' },
  limitValue: { fontSize: '3rem', fontWeight: '800', color: '#fff', lineHeight: 1 },
  limitIcon: { 
    width: '60px', height: '60px', borderRadius: '12px', 
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', color: '#fff'
  },

  // Panel de Lista
  listCard: {
    background: 'rgba(25, 25, 25, 0.8)', backdropFilter: 'blur(20px)', borderRadius: '16px',
    padding: '24px', border: '1px solid rgba(255, 255, 255, 0.1)', overflow: 'hidden',
    display: 'flex', flexDirection: 'column', height: '100%'
  },
  cardHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px',
    borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px', flexWrap: 'wrap', gap: '16px'
  },
  cardTitle: { fontSize: '1.2rem', fontWeight: '700', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' },

  // Buscador
  searchWrapper: { position: 'relative', minWidth: '250px' },
  searchIcon: { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666' },
  searchInput: { 
    width: '100%', padding: '10px 12px 10px 40px', border: '1px solid rgba(255, 255, 255, 0.1)', 
    borderRadius: '10px', fontSize: '0.9rem', backgroundColor: 'rgba(40, 40, 40, 0.6)', 
    color: '#ffffff', boxSizing: 'border-box', transition: 'all 0.3s ease'
  },

  // Lista de Usuarios
  userList: { display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '500px', overflowY: 'auto', paddingRight: '4px' },
  userRow: { 
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', 
    borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
    transition: 'background 0.2s'
  },
  userInfo: { flex: 1 },
  userName: { color: '#fff', fontWeight: '600', fontSize: '1rem', marginBottom: '4px' },
  userEmail: { color: '#888', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' },
  userDate: { fontSize: '0.75rem', color: '#666', marginTop: '4px' },

  // Botón Activar
  btnActivate: { 
    padding: '10px 20px', background: 'linear-gradient(135deg, #28a745 0%, #218838 100%)', 
    color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', 
    display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', transition: '0.2s',
    boxShadow: '0 4px 12px rgba(40, 167, 69, 0.3)'
  },
  btnDisabled: { 
    background: 'rgba(255, 255, 255, 0.1)', color: '#666', cursor: 'not-allowed', boxShadow: 'none',
    border: '1px solid rgba(255, 255, 255, 0.05)'
  },

  // Estados
  loadingOverlay: { textAlign: 'center', padding: '60px', color: '#888', fontSize: '1.1rem' },
  emptyState: { textAlign: 'center', padding: '40px', color: '#666' },
  lockedContainer: { textAlign: 'center', padding: '60px', background: 'rgba(25,25,25,0.8)', borderRadius: '16px', border: '1px dashed #dc3545', color: '#aaa', maxWidth: '500px', margin: '40px auto' },
  
  // Alerta
  alertBox: {
    marginTop: '20px', padding: '16px', backgroundColor: 'rgba(255, 193, 7, 0.1)', 
    border: '1px solid rgba(255, 193, 7, 0.3)', borderRadius: '12px', color: '#ffc107', 
    display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '500'
  }
};

const ProviderAffiliatePanel = () => {
  const [canAffiliate, setCanAffiliate] = useState(null);
  const [limit, setLimit] = useState(0);
  const [inactiveUsers, setInactiveUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const settingsRes = await apiClient.get('/provider/my-settings');
      setCanAffiliate(settingsRes.data.can_affiliate);
      setLimit(settingsRes.data.affiliate_limit || 0);

      if (settingsRes.data.can_affiliate) {
        const usersRes = await apiClient.get('/provider/inactive-users');
        setInactiveUsers(usersRes.data);
      }
    } catch (error) {
      console.error("Error cargando panel:", error);
      setCanAffiliate(false);
    }
  };

  const handleActivate = async (user) => {
    if (limit <= 0) return alert("Has agotado tu cupo de afiliaciones.");
    if (!confirm(`¿Activar a ${user.username}? Se descontará 1 cupo.`)) return;

    setLoadingAction(true);
    try {
      const res = await apiClient.post('/provider/affiliate-user', { userIdToActivate: user.id });
      alert(`✅ ¡Activado!\n${res.data.message}`);
      setLimit(res.data.remaining_limit);
      setInactiveUsers(prev => prev.filter(u => u.id !== user.id));
    } catch (err) {
      alert(`❌ Error: ${err.response?.data?.error || 'Falló la activación.'}`);
    } finally {
      setLoadingAction(false);
    }
  };

  const filteredUsers = inactiveUsers.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (canAffiliate === null) return <div style={styles.loadingOverlay}>Cargando panel...</div>;

  if (canAffiliate === false) return (
    <div style={styles.container}>
      <div style={styles.backgroundDecoration} />
      <div style={styles.lockedContainer}>
        <FiLock size={48} color="#dc3545" style={{marginBottom: 20}} />
        <h2 style={{color: '#fff', marginTop: 0}}>Acceso Restringido</h2>
        <p>No tienes permisos para gestionar afiliados.</p>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.backgroundDecoration} />
      
      <div style={styles.headerSection}>
        <h1 style={styles.header}>Panel de Afiliación</h1>
        <p style={styles.subtitle}>Activa nuevos usuarios y gestiona tu red de afiliados.</p>
      </div>

      {/* 1. TARJETA DE CUPO */}
      <div style={styles.limitCard}>
        <div>
          <div style={styles.limitLabel}>Cupos Disponibles</div>
          <div style={styles.limitValue}>{limit}</div>
        </div>
        <div style={styles.limitIcon}>
          <FiUserCheck />
        </div>
      </div>

      {/* 2. LISTA DE USUARIOS */}
      <div style={styles.listCard}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}><FiUserPlus color="#667eea"/> Usuarios Pendientes</h3>
          <div style={styles.searchWrapper}>
            <FiSearch style={styles.searchIcon} size={16} />
            <input 
              style={styles.searchInput} 
              placeholder="Buscar usuario..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div style={styles.userList}>
          {filteredUsers.length === 0 ? (
            <div style={styles.emptyState}>
              <FiUsers size={48} style={{marginBottom: '16px', opacity: 0.5}}/>
              <p>No hay usuarios pendientes.</p>
            </div>
          ) : (
            filteredUsers.map(user => (
              <div key={user.id} style={styles.userRow}>
                <div style={styles.userInfo}>
                  <div style={styles.userName}>{user.username}</div>
                  <div style={styles.userEmail}>{user.email}</div>
                  <div style={styles.userDate}>Registrado: {new Date(user.created_at).toLocaleDateString()}</div>
                </div>
                
                <button 
                  style={limit <= 0 || loadingAction ? {...styles.btnActivate, ...styles.btnDisabled} : styles.btnActivate}
                  onClick={() => handleActivate(user)}
                  disabled={limit <= 0 || loadingAction}
                >
                  {loadingAction ? '...' : <><FiCheck /> Activar</>}
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ALERTA DE CUPO AGOTADO */}
      {limit <= 0 && (
        <div style={styles.alertBox}>
          <FiAlertTriangle size={24} />
          <div>
            <strong>Cupo agotado.</strong>
            <div style={{fontSize: '0.85rem', opacity: 0.8}}>Solicita una recarga al administrador para continuar activando.</div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProviderAffiliatePanel;