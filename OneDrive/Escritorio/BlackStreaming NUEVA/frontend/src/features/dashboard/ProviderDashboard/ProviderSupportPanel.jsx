// src/features/dashboard/ProviderDashboard/ProviderSupportPanel.jsx

import React, { useState, useEffect } from 'react';
import apiClient from '/src/services/apiClient';
import { 
  FiLifeBuoy, FiCheckCircle, FiXCircle, FiRefreshCw, FiUser, 
  FiPackage, FiClock, FiAlertTriangle, FiChevronLeft, FiChevronRight,
  FiLock, FiHash
} from 'react-icons/fi';

// --- Estilos Unified Compact Theme (Data Grid) ---
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
  
  // Header Section
  headerSection: { textAlign: 'center', marginBottom: '32px', position: 'relative', zIndex: 1 },
  header: { 
    fontSize: '2rem', fontWeight: '800', 
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px'
  },
  subtitle: { fontSize: '1.1rem', color: '#b0b0b0', maxWidth: '600px', margin: '0 auto' },

  // Panel Principal (Tabla)
  tableSection: {
    background: 'rgba(25, 25, 25, 0.8)', backdropFilter: 'blur(20px)', borderRadius: '16px',
    padding: '24px', border: '1px solid rgba(255, 255, 255, 0.1)', position: 'relative', zIndex: 1,
    maxWidth: '1200px', margin: '0 auto'
  },
  sectionHeader: { 
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' 
  },
  sectionTitle: { 
    color: '#fff', fontSize: '1.2rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px' 
  },
  sectionCount: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white',
    padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '700'
  },

  // Tabla Estilo Excel
  tableContainer: { overflowX: 'auto', borderRadius: '12px' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' },
  th: { 
    padding: '12px 16px', backgroundColor: 'rgba(40, 40, 40, 0.95)', fontWeight: '700', 
    color: '#a0a0a0', textAlign: 'left', textTransform: 'uppercase', whiteSpace: 'nowrap',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  },
  td: { 
    padding: '10px 16px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', 
    color: '#e0e0e0', verticalAlign: 'middle' 
  },
  tableRow: { transition: 'background-color 0.2s ease' },
  
  // Celdas Específicas
  productCell: { fontWeight: '600', color: '#fff' },
  idCell: { fontSize: '0.75rem', color: '#666', fontFamily: 'monospace' },
  
  credentialsCell: {
    display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.8rem', 
    background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)'
  },
  credentialItem: { display: 'flex', alignItems: 'center', gap: '6px', color: '#ccc' },
  credentialIcon: { color: '#667eea', minWidth: '14px' },
  credentialValue: { color: '#fff', fontWeight: '500' },
  credentialPass: { color: '#00BFFF', fontWeight: '600', fontFamily: 'monospace' },

  // Botones de Acción
  actionButtons: { display: 'flex', gap: '8px' },
  actionButton: {
    padding: '6px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer', 
    fontSize: '0.75rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', transition: '0.2s'
  },
  btnResolve: { background: 'rgba(39, 174, 96, 0.15)', color: '#2ecc71', border: '1px solid rgba(39, 174, 96, 0.3)' },
  btnCancel: { background: 'rgba(220, 53, 69, 0.15)', color: '#ff6b6b', border: '1px solid rgba(220, 53, 69, 0.3)' },
  btnDisabled: { opacity: 0.5, cursor: 'not-allowed', filter: 'grayscale(1)' },

  // Paginación
  paginationWrapper: { 
    display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '16px 0 0 0', 
    marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', gap: '12px' 
  },
  pageBtn: { 
    display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 12px', 
    border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', 
    borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', color: '#e0e0e0', transition: 'all 0.2s' 
  },
  pageBtnDisabled: { opacity: 0.5, cursor: 'not-allowed' },
  pageInfo: { fontSize: '0.9rem', color: '#888' },

  // Estados
  emptyState: { 
    textAlign: 'center', padding: '60px', background: 'rgba(255,255,255,0.02)', 
    borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', maxWidth: '500px', margin: '40px auto'
  },
  loading: { textAlign: 'center', padding: '60px', color: '#888', fontSize: '1.1rem' },
  statusBadge: { 
    padding: '4px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '700', 
    background: 'rgba(255, 193, 7, 0.15)', color: '#ffc107', display: 'inline-flex', alignItems: 'center', gap: '4px' 
  }
};

const ProviderSupportPanel = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => { fetchTickets(); }, []);

  const fetchTickets = async () => {
    try {
      const res = await apiClient.get('/provider/support-tickets');
      setTickets(res.data);
    } catch (error) {
      console.error("Error cargando tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (ticketId, action) => {
    const confirmMsg = action === 'restore' 
      ? "¿Restaurar servicio? El pedido volverá a estado ACTIVO."
      : "¿Cancelar servicio? El estado pasará a CANCELADO definitivamente.";
    
    if (!confirm(confirmMsg)) return;

    setProcessingId(ticketId);
    try {
      await apiClient.post(`/provider/support-tickets/${ticketId}/resolve`, { action });
      setTickets(prev => prev.filter(t => t.id !== ticketId));
      alert('✅ Acción completada.');
    } catch (error) {
      alert('❌ Error al procesar la solicitud.');
    } finally {
      setProcessingId(null);
    }
  };

  // Lógica de Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tickets.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(tickets.length / itemsPerPage);

  const goToPage = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div style={styles.loading}><FiRefreshCw className="spin"/> Cargando tickets...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.backgroundDecoration} />
      
      <div style={styles.headerSection}>
        <h1 style={styles.header}>Centro de Soporte</h1>
        <p style={styles.subtitle}>Resuelve los reportes de tus clientes rápidamente.</p>
      </div>

      {tickets.length === 0 ? (
        <div style={styles.emptyState}>
          <FiCheckCircle size={48} color="#2ecc71" style={{marginBottom: '16px'}}/>
          <h3 style={{color: '#fff', margin: '0 0 8px 0'}}>¡Todo en orden!</h3>
          <p style={{color: '#888', margin: 0}}>No tienes tickets de soporte pendientes por resolver.</p>
        </div>
      ) : (
        <div style={styles.tableSection}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionTitle}><FiAlertTriangle color="#ffc107"/> Tickets Pendientes</div>
            <div style={styles.sectionCount}>{tickets.length} Reportes</div>
          </div>

          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID / Producto</th>
                  <th style={styles.th}>Cliente</th>
                  <th style={styles.th}>Datos de Cuenta</th>
                  <th style={styles.th}>Fecha Activación</th>
                  <th style={styles.th}>Estado</th>
                  <th style={styles.th}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((ticket, idx) => (
                  <tr 
                    key={ticket.id} 
                    style={{
                      ...styles.tableRow, 
                      backgroundColor: hoveredRow === idx ? 'rgba(255,255,255,0.05)' : (idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent')
                    }}
                    onMouseEnter={() => setHoveredRow(idx)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td style={styles.td}>
                      <div style={styles.productCell}>{ticket.product_name}</div>
                      <div style={styles.idCell}>#{ticket.id}</div>
                    </td>
                    <td style={styles.td}>
                      <div style={{fontWeight:'500'}}>{ticket.buyer_name}</div>
                      <div style={{fontSize:'0.75rem', color:'#888'}}>{ticket.customer_name || 'Sin alias'}</div>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.credentialsCell}>
                        <div style={styles.credentialItem} title="Email">
                            <FiUser style={styles.credentialIcon} size={12} /> 
                            <span style={styles.credentialValue}>{ticket.account_email}</span>
                        </div>
                        <div style={styles.credentialItem} title="Contraseña">
                            <FiLock style={styles.credentialIcon} size={12} /> 
                            <span style={styles.credentialPass}>{ticket.account_pass}</span>
                        </div>
                      </div>
                    </td>
                    <td style={styles.td}>
                        <div style={{display:'flex', alignItems:'center', gap:6}}>
                            <FiClock size={12} color="#888"/>
                            {new Date(ticket.activation_date).toLocaleDateString()}
                        </div>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.statusBadge}><FiAlertTriangle size={10}/> REPORTADO</span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actionButtons}>
                        <button 
                          style={{...styles.actionButton, ...styles.btnResolve, ...(processingId === ticket.id ? styles.btnDisabled : {})}}
                          onClick={() => handleAction(ticket.id, 'restore')}
                          disabled={processingId === ticket.id}
                          title="Resolver y Activar"
                        >
                          {processingId === ticket.id ? '...' : <FiRefreshCw />} Restaurar
                        </button>
                        
                        <button 
                          style={{...styles.actionButton, ...styles.btnCancel, ...(processingId === ticket.id ? styles.btnDisabled : {})}}
                          onClick={() => handleAction(ticket.id, 'cancel')}
                          disabled={processingId === ticket.id}
                          title="Cancelar Definitivamente"
                        >
                          {processingId === ticket.id ? '...' : <FiXCircle />} Cancelar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {tickets.length > 0 && (
            <div style={styles.paginationWrapper}>
              <span style={styles.pageInfo}>
                Página {currentPage} de {totalPages}
              </span>
              <button 
                style={{...styles.pageBtn, ...(currentPage === 1 ? styles.pageBtnDisabled : {})}}
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <FiChevronLeft size={16} /> Anterior
              </button>
              <button 
                style={{...styles.pageBtn, ...(currentPage === totalPages ? styles.pageBtnDisabled : {})}}
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Siguiente <FiChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProviderSupportPanel;