import React, { useState, useEffect } from 'react';
import apiClient from '../../../services/apiClient.js';
import { 
  FiUsers, FiActivity, FiGift, FiLoader, FiAlertTriangle, FiUserPlus
} from 'react-icons/fi';

// --- ESTILOS DARK GLASS THEME (Unificados) ---
const styles = {
  container: { 
    padding: '40px 24px', 
    fontFamily: "'Inter', sans-serif", 
    background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 50%, #0f0f0f 100%)',
    minHeight: '100vh',
    position: 'relative',
    overflow: 'hidden',
    color: '#e0e0e0',
    borderRadius: '16px'
  },
  backgroundDecoration: {
    position: 'absolute', top: 0, right: 0, width: '500px', height: '500px',
    background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)', zIndex: 0
  },
  
  // Header
  headerSection: { textAlign: 'center', marginBottom: '48px', position: 'relative', zIndex: 1 },
  header: { 
    fontSize: '3rem', fontWeight: '800', 
    background: 'linear-gradient(135deg, #00BFFF 0%, #764ba2 100%)', 
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    marginBottom: '10px'
  },
  subtitle: { fontSize: '1.1rem', color: '#a0a0a0', maxWidth: '600px', margin: '0 auto' },

  // Stats Grid
  statsGrid: { 
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
    gap: '24px', marginBottom: '40px', position: 'relative', zIndex: 1 
  },
  statCard: {
    background: 'rgba(30, 30, 30, 0.6)', backdropFilter: 'blur(20px)', borderRadius: '20px',
    padding: '25px', border: '1px solid rgba(255, 255, 255, 0.1)', position: 'relative', overflow: 'hidden',
    transition: 'transform 0.3s ease', cursor: 'default'
  },
  statIconBox: {
    width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: '15px', fontSize: '24px', background: 'rgba(255,255,255,0.05)'
  },
  statValue: { fontSize: '2.5rem', fontWeight: '700', color: '#fff', lineHeight: 1, marginBottom: '5px' },
  statLabel: { fontSize: '0.9rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' },

  // SECCIÓN TABLA
  tableCard: {
    background: 'rgba(30, 30, 30, 0.7)', backdropFilter: 'blur(20px)', borderRadius: '24px',
    padding: '30px', border: '1px solid rgba(255, 255, 255, 0.1)', position: 'relative', zIndex: 1
  },
  tableHeader: { fontSize: '1.3rem', fontWeight: 'bold', color: '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' },
  tableContainer: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '15px', color: '#888', borderBottom: '1px solid rgba(255,255,255,0.1)', textTransform: 'uppercase', fontSize: '0.8rem' },
  td: { padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#ddd' },
  userCell: { display: 'flex', alignItems: 'center', gap: '10px' },
  avatar: { width: '32px', height: '32px', borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: '12px', fontWeight: 'bold' },
  statusActive: { color: '#2ecc71', background: 'rgba(46, 204, 113, 0.1)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold' },
  statusInactive: { color: '#e74c3c', background: 'rgba(231, 76, 60, 0.1)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold' },
  
  // Estados
  loadingState: { textAlign: 'center', padding: '100px', color: '#666', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 15 },
  errorState: { textAlign: 'center', padding: '80px', color: '#ff6b6b' }
};

const AffiliateDashboard = () => {
  const [stats, setStats] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsRes, refsRes] = await Promise.all([
          apiClient.get('/affiliate/stats'),
          apiClient.get('/affiliate/referrals')
        ]);
        setStats(statsRes.data);
        setReferrals(refsRes.data);
      } catch (error) {
        console.error("Error cargando dashboard de afiliados:", error);
        setError("No se pudieron cargar los datos del afiliado.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div style={styles.loadingState}>
        <FiLoader className="spin" size={40} color="#00BFFF"/>
        <div>Cargando panel de socio...</div>
    </div>
  );

  if (error) return (
      <div style={styles.errorState}>
        <FiAlertTriangle size={40} />
        <p>{error}</p>
      </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.backgroundDecoration} />

      {/* Header */}
      <div style={styles.headerSection}>
        <h1 style={styles.header}>Programa de Afiliados</h1>
        <p style={styles.subtitle}>Invita a tus amigos y forma parte de nuestra comunidad.</p>
      </div>

      {/* Stats Cards (SIMPLIFICADO: Sin Dinero) */}
      <div style={styles.statsGrid}>
        
        {/* Tarjeta 1: Tu Código */}
        <div style={styles.statCard}>
          <div style={{...styles.statIconBox, color: '#f1c40f'}}><FiGift /></div>
          <div style={styles.statValue}>{stats?.referralCode || '---'}</div>
          <div style={styles.statLabel}>Tu Código de Invitación</div>
        </div>

        {/* Tarjeta 2: Total Registrados */}
        <div style={styles.statCard}>
          <div style={{...styles.statIconBox, color: '#00BFFF'}}><FiUsers /></div>
          <div style={styles.statValue}>{stats?.totalReferrals || 0}</div>
          <div style={styles.statLabel}>Usuarios Registrados</div>
        </div>

        {/* Tarjeta 3: Activos */}
        <div style={styles.statCard}>
          <div style={{...styles.statIconBox, color: '#9b59b6'}}><FiActivity /></div>
          <div style={styles.statValue}>{stats?.activeReferrals || 0}</div>
          <div style={styles.statLabel}>Referidos Activos</div>
        </div>

      </div>

      {/* SECCIÓN 2: LISTA DE REFERIDOS (SIMPLIFICADA) */}
      <div style={styles.tableCard}>
        <div style={styles.tableHeader}>
           <FiUserPlus color="#00BFFF" /> Usuarios Registrados con tu Código
        </div>
        
        {referrals.length === 0 ? (
           <div style={{textAlign:'center', padding: '40px', color: '#666'}}>
              <FiUsers size={40} style={{marginBottom:10, opacity:0.5}}/>
              <p>Aún no se ha registrado nadie con tu código.</p>
           </div>
        ) : (
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Usuario</th>
                    <th style={styles.th}>Fecha Registro</th>
                    <th style={styles.th}>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.map((ref, idx) => (
                    <tr key={idx}>
                      <td style={styles.td}>
                        <div style={styles.userCell}>
                           <div style={styles.avatar}>{ref.username.charAt(0).toUpperCase()}</div>
                           <div>
                             <div style={{fontWeight:'bold', color:'#fff'}}>{ref.username}</div>
                             <div style={{fontSize:'0.8rem', color:'#666'}}>{ref.email}</div>
                           </div>
                        </div>
                      </td>
                      <td style={styles.td}>{new Date(ref.date).toLocaleDateString()}</td>
                      <td style={styles.td}>
                         <span style={ref.status === 'activo' ? styles.statusActive : styles.statusInactive}>
                            {ref.status.toUpperCase()}
                         </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        )}
      </div>

    </div>
  );
};

export default AffiliateDashboard;