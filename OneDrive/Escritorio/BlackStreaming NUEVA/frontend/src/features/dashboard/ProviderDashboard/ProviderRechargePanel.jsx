// src/features/dashboard/ProviderDashboard/ProviderRechargePanel.jsx

import React, { useState, useEffect } from 'react';
import apiClient from '/src/services/apiClient.js';
import { 
  FiDollarSign, FiUser, FiCheckCircle, FiAlertCircle, FiLock, 
  FiRefreshCw, FiClock, FiSearch, FiSend, FiTrendingUp 
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
  headerSection: { textAlign: 'center', marginBottom: '32px', position: 'relative', zIndex: 1 },
  header: { 
    fontSize: '2rem', fontWeight: '800', 
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px'
  },
  subtitle: { fontSize: '1.1rem', color: '#b0b0b0', maxWidth: '600px', margin: '0 auto' },

  // Layout Principal
  gridContainer: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
    gap: '24px', 
    position: 'relative', 
    zIndex: 1 
  },

  // Tarjetas (Glassmorphism)
  card: {
    background: 'rgba(25, 25, 25, 0.8)', backdropFilter: 'blur(20px)', borderRadius: '16px',
    padding: '24px', border: '1px solid rgba(255, 255, 255, 0.1)', overflow: 'hidden',
    display: 'flex', flexDirection: 'column', height: '100%'
  },
  cardHeader: {
    display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px',
    borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px'
  },
  cardTitle: { fontSize: '1.2rem', fontWeight: '700', color: '#fff', margin: 0 },

  // Panel de Saldo (Hero)
  balanceCard: { 
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)', 
    border: '1px solid rgba(102, 126, 234, 0.3)', borderRadius: '16px', padding: '24px', 
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px',
    position: 'relative', zIndex: 1, backdropFilter: 'blur(10px)'
  },
  balanceLabel: { color: '#a0a0a0', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' },
  balanceAmount: { fontSize: '2.5rem', fontWeight: '800', color: '#fff', lineHeight: 1 },
  balanceIcon: { 
    width: '60px', height: '60px', borderRadius: '12px', 
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', color: '#fff'
  },

  // Buscador
  searchWrapper: { position: 'relative', marginBottom: '16px' },
  searchIcon: { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666' },
  searchInput: { 
    width: '100%', padding: '12px 12px 12px 40px', border: '1px solid rgba(255, 255, 255, 0.1)', 
    borderRadius: '10px', fontSize: '0.9rem', backgroundColor: 'rgba(40, 40, 40, 0.6)', 
    color: '#ffffff', boxSizing: 'border-box', transition: 'all 0.3s ease'
  },

  // Lista de Usuarios
  userList: { display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '400px', overflowY: 'auto', paddingRight: '4px' },
  userRow: { 
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', 
    borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
    transition: 'background 0.2s'
  },
  userInfo: { flex: 1, minWidth: '150px' },
  userName: { color: '#fff', fontWeight: '600', fontSize: '0.95rem' },
  userEmail: { color: '#888', fontSize: '0.8rem' },
  
  // Controles de Recarga
  rechargeControls: { display: 'flex', alignItems: 'center', gap: '8px' },
  amountInputWrapper: { position: 'relative' },
  amountIcon: { position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: '#aaa', fontSize: '0.8rem' },
  amountInput: { 
    padding: '8px 8px 8px 20px', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', 
    borderRadius: '8px', color: 'white', width: '80px', fontSize: '0.9rem', textAlign: 'right' 
  },
  btnRecargar: { 
    padding: '8px 16px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
    color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', 
    display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', transition: '0.2s'
  },
  btnDisabled: { opacity: 0.6, cursor: 'not-allowed', filter: 'grayscale(1)' },

  // Historial (Tabla Compacta)
  tableContainer: { overflowX: 'auto', borderRadius: '12px', marginTop: '10px' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' },
  th: { padding: '12px', backgroundColor: 'rgba(40, 40, 40, 0.8)', fontWeight: '700', color: '#a0a0a0', textAlign: 'left', textTransform: 'uppercase', whiteSpace: 'nowrap' },
  td: { padding: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', color: '#e0e0e0' },
  statusBadge: { padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', background: 'rgba(39, 174, 96, 0.2)', color: '#2ecc71' },
  amountNegative: { color: '#ff6b6b', fontWeight: '700' },

  // Estados
  loadingOverlay: { textAlign: 'center', padding: '40px', color: '#888' },
  lockedContainer: { textAlign: 'center', padding: '60px', background: 'rgba(25,25,25,0.8)', borderRadius: '16px', border: '1px dashed #dc3545', color: '#aaa', maxWidth: '500px', margin: '40px auto' }
};

const ProviderRechargePanel = () => {
  const [canRecharge, setCanRecharge] = useState(null);
  const [myBalance, setMyBalance] = useState(0);
  const [users, setUsers] = useState([]);
  const [history, setHistory] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [amounts, setAmounts] = useState({}); 
  const [loadingAction, setLoadingAction] = useState(null); 

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const settingsRes = await apiClient.get('/provider/my-settings');
      setCanRecharge(settingsRes.data.can_recharge);

      if (settingsRes.data.can_recharge) {
        const meRes = await apiClient.get('/auth/me');
        setMyBalance(parseFloat(meRes.data.user.balance_usd));

        const usersRes = await apiClient.get('/provider/users-list');
        setUsers(usersRes.data);

        fetchHistory();
      }
    } catch (err) {
      console.error("Error cargando datos", err);
      setCanRecharge(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await apiClient.get('/provider/transfer-history');
      setHistory(res.data);
    } catch (error) { console.error(error); }
  };

  const handleAmountChange = (userId, value) => {
    setAmounts(prev => ({ ...prev, [userId]: value }));
  };

  const handleRecharge = async (user) => {
    const amountStr = amounts[user.id];
    const amount = parseFloat(amountStr);

    if (!amount || amount <= 0) return alert("Ingresa un monto válido.");
    if (amount > myBalance) return alert("Saldo insuficiente.");
    if (!confirm(`¿Enviar $${amount} a ${user.username}?`)) return;

    setLoadingAction(user.id);

    try {
      const res = await apiClient.post('/provider/recharge-user', {
        userEmail: user.email,
        amount: amount
      });
      
      alert(`✅ ¡Éxito! ${res.data.message}`);
      setMyBalance(res.data.remaining_balance);
      setAmounts(prev => ({ ...prev, [user.id]: '' }));
      fetchHistory();
    } catch (err) {
      alert(`❌ Error: ${err.response?.data?.error || 'Error desconocido'}`);
    } finally {
      setLoadingAction(null);
    }
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (canRecharge === null) return <div style={styles.loadingOverlay}><FiRefreshCw className="animate-spin" size={30}/> Cargando panel...</div>;
  
  if (canRecharge === false) return (
    <div style={styles.container}>
      <div style={styles.backgroundDecoration} />
      <div style={styles.lockedContainer}>
        <FiLock size={48} color="#dc3545" style={{marginBottom: 20}} />
        <h2 style={{color: '#fff', marginTop: 0}}>Acceso Restringido</h2>
        <p>No tienes permisos para vender saldo a usuarios.</p>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.backgroundDecoration} />
      
      <div style={styles.headerSection}>
        <h1 style={styles.header}>Panel de Recargas</h1>
        <p style={styles.subtitle}>Transfiere saldo a tus usuarios de forma rápida y segura.</p>
      </div>

      {/* 1. PANEL DE SALDO */}
      <div style={styles.balanceCard}>
        <div>
          <div style={styles.balanceLabel}>Saldo Disponible</div>
          <div style={styles.balanceAmount}>${myBalance.toFixed(2)}</div>
        </div>
        <div style={styles.balanceIcon}>
          <FiDollarSign />
        </div>
      </div>

      <div style={styles.gridContainer}>
        
        {/* 2. LISTA DE USUARIOS */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <FiUser size={20} color="#667eea" />
            <h3 style={styles.cardTitle}>Enviar Saldo</h3>
          </div>
          
          <div style={styles.searchWrapper}>
            <FiSearch style={styles.searchIcon} size={16} />
            <input 
              style={styles.searchInput} 
              placeholder="Buscar usuario..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={styles.userList}>
            {filteredUsers.length === 0 ? (
              <div style={{textAlign:'center', color:'#666', padding: 20}}>No se encontraron usuarios.</div>
            ) : (
              filteredUsers.map(user => (
                <div key={user.id} style={styles.userRow}>
                  <div style={styles.userInfo}>
                    <div style={styles.userName}>{user.username}</div>
                    <div style={styles.userEmail}>{user.email}</div>
                  </div>
                  
                  <div style={styles.rechargeControls}>
                    <div style={styles.amountInputWrapper}>
                        <FiDollarSign style={styles.amountIcon} />
                        <input 
                            type="number" 
                            step="0.10"
                            placeholder="0.00" 
                            style={styles.amountInput}
                            value={amounts[user.id] || ''}
                            onChange={(e) => handleAmountChange(user.id, e.target.value)}
                        />
                    </div>
                    <button 
                      style={{...styles.btnRecargar, ...(loadingAction ? styles.btnDisabled : {})}}
                      disabled={loadingAction !== null}
                      onClick={() => handleRecharge(user)}
                    >
                      {loadingAction === user.id ? <FiRefreshCw className="spin" /> : <FiSend size={14} />}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 3. HISTORIAL */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <FiClock size={20} color="#667eea" />
            <h3 style={styles.cardTitle}>Historial Reciente</h3>
          </div>
          
          {history.length === 0 ? (
             <div style={{textAlign:'center', color:'#666', padding: 20, fontStyle: 'italic'}}>
                Sin movimientos recientes.
             </div>
          ) : (
            <div style={styles.tableContainer}>
                <table style={styles.table}>
                <thead>
                    <tr>
                    <th style={styles.th}>Fecha</th>
                    <th style={styles.th}>Destino</th>
                    <th style={styles.th}>Monto</th>
                    <th style={styles.th}>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {history.slice(0, 8).map(tx => (
                    <tr key={tx.id}>
                        <td style={styles.td}>
                            <div style={{display:'flex', alignItems:'center', gap:6}}>
                                <FiClock size={12} color="#666"/>
                                {new Date(tx.created_at).toLocaleDateString()}
                            </div>
                        </td>
                        <td style={styles.td} title={tx.reference_id}>{tx.reference_id.replace('A: ', '')}</td>
                        <td style={{...styles.td, ...styles.amountNegative}}>-${parseFloat(tx.amount).toFixed(2)}</td>
                        <td style={styles.td}>
                        <span style={styles.statusBadge}>{tx.status}</span>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProviderRechargePanel;