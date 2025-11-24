// src/features/dashboard/UserDashboard/RedemptionHistory.jsx

import React, { useState, useEffect } from 'react';
import apiClient from '/src/services/apiClient.js';
import { 
  FiGift, FiAward, FiClock, FiStar, FiDownload, FiCalendar,
  FiHash, FiBox, FiArchive, FiTrendingUp
} from 'react-icons/fi';

// --- Estilos Unified Compact Theme (Data Grid Edition) ---
const styles = {
  container: { 
    padding: '24px 16px', 
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", 
    background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 50%, #0f0f0f 100%)',
    minHeight: '100vh',
    position: 'relative',
    overflow: 'hidden'
  },
  backgroundDecoration: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
    zIndex: 0
  },
  headerSection: { textAlign: 'center', marginBottom: '32px', position: 'relative', zIndex: 1 },
  header: { 
    fontSize: '2.5rem', 
    fontWeight: '800', 
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '8px',
    letterSpacing: '-0.02em'
  },
  subtitle: { fontSize: '1.1rem', color: '#b0b0b0', maxWidth: '600px', margin: '0 auto' },

  // Stats Compactos
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px', position: 'relative', zIndex: 1 },
  statCard: { background: 'rgba(30, 30, 30, 0.7)', backdropFilter: 'blur(20px)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255, 255, 255, 0.1)', position: 'relative', overflow: 'hidden', transition: 'all 0.4s ease', cursor: 'pointer' },
  statCardHover: { transform: 'translateY(-4px) scale(1.01)', borderColor: 'rgba(102, 126, 234, 0.3)', boxShadow: '0 10px 20px rgba(0, 0, 0, 0.4)' },
  statCardGlow: { position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #667eea, #764ba2, #f093fb)' },
  statValue: { fontSize: '2rem', fontWeight: '800', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '4px', lineHeight: '1' },
  statLabel: { fontSize: '0.9rem', color: '#a0a0a0', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' },
  statIcon: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '8px', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' },

  // Contenedor de Tabla / Sección
  section: {
    background: 'rgba(25, 25, 25, 0.8)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    position: 'relative',
    zIndex: 1,
    overflow: 'hidden'
  },
  sectionHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' },
  sectionTitle: { fontSize: '1.2rem', fontWeight: '700', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px' },
  sectionCount: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '700' },

  // Botón Exportar Compacto
  exportButton: {
    padding: '8px 16px', border: 'none', borderRadius: '10px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white',
    fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', display: 'flex',
    alignItems: 'center', gap: '8px', transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden'
  },
  exportButtonHover: { transform: 'translateY(-2px)', boxShadow: '0 5px 15px rgba(102, 126, 234, 0.4)' },
  buttonGlow: { position: 'absolute', top: 0, left: '-100%', width: '100%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)', transition: 'left 0.5s ease' },
  buttonGlowHover: { left: '100%' },

  // Tabla Data Grid
  tableContainer: { overflowX: 'auto', borderRadius: '12px' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' },
  th: { padding: '12px 10px', backgroundColor: 'rgba(40, 40, 40, 0.95)', fontWeight: '700', color: '#a0a0a0', textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', whiteSpace: 'nowrap' },
  td: { padding: '8px 10px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', color: '#e0e0e0', verticalAlign: 'middle' },
  tableRow: { transition: 'all 0.2s ease', cursor: 'pointer' },
  tableRowHover: { backgroundColor: 'rgba(255, 255, 255, 0.08)' },

  // Celdas Específicas
  itemCell: { display: 'flex', alignItems: 'center', gap: '10px' },
  itemIcon: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '8px', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '28px', height: '28px' },
  itemInfo: { display: 'flex', flexDirection: 'column', gap: '2px' },
  itemName: { fontWeight: '600', color: '#ffffff', fontSize: '0.85rem' },
  
  codeContent: { 
    fontFamily: 'monospace', fontSize: '0.8rem', color: '#a0a0a0', 
    backgroundColor: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '6px',
    display: 'inline-block', border: '1px solid rgba(255,255,255,0.1)'
  },
  
  pointsCell: { display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700', color: '#FFD700', fontSize: '0.9rem' },
  dateCell: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#aaa' },

  // Estados
  loadingState: { textAlign: 'center', padding: '60px 20px', color: '#a0a0a0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' },
  emptyState: { textAlign: 'center', padding: '60px 20px', color: '#a0a0a0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '16px' },
  errorState: { textAlign: 'center', padding: '60px 20px', color: '#ff6b6b' },
  pulseAnimation: { animation: 'pulse 2s infinite' }
};

const RedemptionHistory = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredStat, setHoveredStat] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [isExportHovered, setIsExportHovered] = useState(false);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/user/redemption-history');
      setHistory(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching redemption history:', err);
      setError('Error al cargar el historial.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  const formatItemDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    } catch { return dateString; }
  };

  const exportToCSV = () => {
    if (history.length === 0) return;
    const headers = ['Premio', 'Contenido', 'Puntos', 'Fecha'];
    const csvContent = [
      headers.join(','),
      ...history.map(item => [
        `"${item.item_name}"`,
        `"${item.code_content}"`,
        item.points_cost,
        formatItemDate(item.used_at)
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `historial_canjes_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const stats = [
    { value: history.length, label: 'Canjes', icon: FiGift },
    { value: history.reduce((sum, item) => sum + item.points_cost, 0), label: 'Puntos Usados', icon: FiStar },
    { value: history.filter(item => item.code_content?.trim()).length, label: 'Códigos', icon: FiAward }
  ];

  if (isLoading) return <div style={styles.container}><div style={styles.loadingState}><div style={styles.pulseAnimation}><FiGift size={40} color="#667eea" /></div><h3>Cargando...</h3></div></div>;
  if (error) return <div style={styles.container}><div style={styles.errorState}><FiArchive size={40} /><h3>Error</h3><p>{error}</p></div></div>;

  return (
    <div style={styles.container}>
      <div style={styles.backgroundDecoration} />
      
      <div style={styles.headerSection}>
        <h1 style={styles.header}>Historial Canjes</h1>
        <p style={styles.subtitle}>Tus recompensas obtenidas</p>
      </div>

      <div style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={stat.label} style={{...styles.statCard, ...(hoveredStat === index && styles.statCardHover)}} onMouseEnter={() => setHoveredStat(index)} onMouseLeave={() => setHoveredStat(null)}>
            <div style={styles.statCardGlow} />
            <div style={styles.statValue}>{stat.value}</div>
            <div style={styles.statLabel}><div style={styles.statIcon}><stat.icon size={16} color="white" /></div>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}><FiAward size={20} /> Lista de Canjes</h2>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={styles.sectionCount}>{history.length}</div>
            {history.length > 0 && (
              <button 
                onClick={exportToCSV}
                style={{...styles.exportButton, ...(isExportHovered && styles.exportButtonHover)}}
                onMouseEnter={() => setIsExportHovered(true)}
                onMouseLeave={() => setIsExportHovered(false)}
              >
                <div style={{...styles.buttonGlow, ...(isExportHovered && styles.buttonGlowHover)}} />
                <FiDownload size={14} /> CSV
              </button>
            )}
          </div>
        </div>

        {history.length === 0 ? (
          <div style={styles.emptyState}>
            <FiGift size={48} color="#667eea" />
            <h3>Sin canjes aún</h3>
            <p style={{maxWidth: '300px'}}>Visita la tienda de puntos para obtener tu primera recompensa.</p>
          </div>
        ) : (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Premio</th>
                  <th style={styles.th}>Contenido (Código)</th>
                  <th style={styles.th}>Costo</th>
                  <th style={styles.th}>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, index) => (
                  <tr 
                    key={index} 
                    style={{...styles.tableRow, ...(hoveredRow === index && styles.tableRowHover)}}
                    onMouseEnter={() => setHoveredRow(index)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td style={styles.td}>
                      <div style={styles.itemCell}>
                        <div style={styles.itemIcon}><FiGift size={14} color="white" /></div>
                        <div style={styles.itemInfo}>
                          <div style={styles.itemName}>{item.item_name}</div>
                        </div>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.codeContent}>
                        {item.code_content || 'N/A'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.pointsCell}><FiStar size={12} /> -{item.points_cost}</div>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.dateCell}><FiClock size={12} /> {formatItemDate(item.used_at)}</div>
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

export default RedemptionHistory;