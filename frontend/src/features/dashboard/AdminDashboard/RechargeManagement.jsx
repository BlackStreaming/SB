// src/features/dashboard/AdminDashboard/RechargeManagement.jsx

import React, { useState, useEffect } from 'react';
import apiClient from '/src/services/apiClient.js'; 
import { 
  FiDollarSign, FiCheck, FiX, FiMessageSquare, FiExternalLink, 
  FiCalendar, FiUser, FiCreditCard, FiHash, FiAlertCircle, FiClock, FiFileText
} from 'react-icons/fi';

// --- Estilos Unified Compact Theme (Dark Glass - Admin Edition) ---
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

  // Secciones (Tabla)
  tableSection: {
    background: 'rgba(25, 25, 25, 0.8)', backdropFilter: 'blur(20px)', borderRadius: '16px',
    padding: '24px', border: '1px solid rgba(255, 255, 255, 0.1)', position: 'relative', zIndex: 1,
    marginBottom: '30px' // Espacio entre tablas
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
  
  // Badges
  statusBadge: { padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '4px' },
  statusApproved: { background: 'rgba(39, 174, 96, 0.15)', color: '#2ecc71', border: '1px solid rgba(39, 174, 96, 0.3)' },
  statusPending: { background: 'rgba(255, 193, 7, 0.15)', color: '#fbbf24', border: '1px solid rgba(255, 193, 7, 0.3)' },
  statusRejected: { background: 'rgba(220, 53, 69, 0.15)', color: '#ff6b6b', border: '1px solid rgba(220, 53, 69, 0.3)' },

  // Botones de Acción
  actionCell: { display: 'flex', gap: '8px' },
  actionButton: { 
    padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', border: 'none', 
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
    fontSize: '0.8rem', fontWeight: '600', transition: '0.2s' 
  },
  approveButton: { background: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)', color: 'white', boxShadow: '0 4px 10px rgba(46, 204, 113, 0.3)' },
  rejectButton: { background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(220, 53, 69, 0.5)', color: '#ff6b6b' },
  proofLink: { color: '#667eea', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', padding: '4px 8px', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '6px', width: 'fit-content' },

  // Modal
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' },
  modalContent: { background: '#1a1a1a', borderRadius: '16px', padding: '30px', width: '100%', maxWidth: '450px', border: '1px solid rgba(255,255,255,0.1)' },
  modalTitle: { fontSize: '1.3rem', fontWeight: '700', marginBottom: '10px', color: '#fff' },
  modalSubtitle: { fontSize: '0.9rem', color: '#aaa', marginBottom: '20px' },
  textarea: { 
    width: '100%', padding: '12px', border: '1px solid rgba(255, 255, 255, 0.1)', 
    borderRadius: '10px', fontSize: '0.9rem', backgroundColor: 'rgba(40, 40, 40, 0.6)', 
    color: '#ffffff', boxSizing: 'border-box', minHeight: '120px', resize: 'vertical' 
  },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' },
  btnCancel: { padding: '10px 20px', background: 'transparent', border: '1px solid #555', color: '#aaa', borderRadius: '10px', cursor: 'pointer' },
  btnConfirmReject: { padding: '10px 20px', background: '#e74c3c', border: 'none', color: '#fff', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' },

  // Utils
  loading: { textAlign: 'center', padding: '60px', color: '#888', fontSize: '1.1rem' },
  emptyState: { textAlign: 'center', padding: '40px', color: '#666', fontStyle: 'italic' },
  error: { background: 'rgba(220, 53, 69, 0.15)', color: '#ff6b6b', border: '1px solid rgba(220, 53, 69, 0.3)', padding: '16px', borderRadius: '12px', marginBottom: '20px' },
  notesText: { fontSize: '0.75rem', color: '#aaa', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display:'inline-block' }
};

const RechargeManagement = () => {
  const [requests, setRequests] = useState([]); // Pendientes
  const [history, setHistory] = useState([]);   // Historial
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado para el modal de rechazo
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Llamadas paralelas para optimizar
      const [pendingRes, historyRes] = await Promise.all([
        apiClient.get('/admin/recharges/pending'),
        apiClient.get('/admin/recharges/history')
      ]);

      setRequests(pendingRes.data);
      setHistory(historyRes.data);

    } catch (err) {
      // Si falla history (quizás no agregaste la ruta backend aun), al menos muestra pendientes
      if (err.config && err.config.url.includes('history')) {
         console.warn("Ruta de historial no encontrada. Asegúrate de actualizar el backend.");
         setHistory([]); // Fallback vacío
         // Intentar cargar solo pendientes si el historial falló
         try {
            const pendingRes = await apiClient.get('/admin/recharges/pending');
            setRequests(pendingRes.data);
         } catch(e) { setError('Error de conexión.'); }
      } else {
         setError('No se pudo cargar la información.');
         console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenRejectModal = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
    setAdminNotes('');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  const submitProcess = async (request, status) => {
      try {
          await apiClient.put(`/admin/recharges/${request.id}`, {
              status: status,
              admin_notes: status === 'rechazado' ? adminNotes : ''
          });
          
          fetchData(); // Recargar ambas tablas
          if(status === 'rechazado') handleCloseModal();
          
      } catch (err) {
          setError(err.response?.data?.error || 'Error al procesar.');
      }
  }

  const getStatusStyle = (status) => {
    if (status === 'aprobado') return styles.statusApproved;
    if (status === 'rechazado') return styles.statusRejected;
    return styles.statusPending;
  };

  if (loading) return <div style={styles.loading}>Cargando panel de recargas...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.backgroundDecoration} />
      
      <div style={styles.headerSection}>
        <h1 style={styles.header}>Gestión de Recargas</h1>
      </div>

      {error && <div style={styles.error}><FiAlertCircle style={{verticalAlign:'middle'}}/> {error}</div>}
      
      {/* --- TABLA 1: PENDIENTES --- */}
      <div style={styles.tableSection}>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionTitle}><FiDollarSign /> Pendientes de Revisión</div>
          <div style={styles.sectionCount}>{requests.length}</div>
        </div>

        {requests.length === 0 ? (
          <div style={styles.emptyState}><p>No hay solicitudes pendientes.</p></div>
        ) : (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}><FiCalendar /> Fecha</th>
                  <th style={styles.th}><FiUser /> Usuario</th>
                  <th style={styles.th}><FiDollarSign /> Monto</th>
                  <th style={styles.th}><FiCreditCard /> Método</th>
                  <th style={styles.th}><FiHash /> Ref</th>
                  <th style={styles.th}>Prueba</th>
                  <th style={styles.th}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req, idx) => (
                  <tr key={req.id} style={{backgroundColor: idx%2===0 ? 'transparent' : 'rgba(255,255,255,0.02)'}}>
                    <td style={styles.td}>{new Date(req.created_at).toLocaleDateString()}</td>
                    <td style={styles.td}>
                        <div style={{fontWeight:'bold', color:'#fff'}}>{req.username}</div>
                        <div style={{fontSize:'0.75rem', color:'#888'}}>ID: {req.user_id}</div>
                    </td>
                    <td style={{...styles.td, color:'#2ecc71', fontWeight:'bold'}}>${parseFloat(req.amount_usd).toFixed(2)}</td>
                    <td style={styles.td}>{req.payment_method}</td>
                    <td style={styles.td}><span style={{fontFamily:'monospace', background:'rgba(255,255,255,0.1)', padding:'2px 6px', borderRadius:4}}>{req.transaction_reference}</span></td>
                    <td style={styles.td}>
                      {req.proof_url ? (
                        <a href={req.proof_url} target="_blank" rel="noopener noreferrer" style={styles.proofLink}>
                          <FiExternalLink /> Ver
                        </a>
                      ) : <span style={{color:'#666', fontSize:'0.8rem'}}>--</span>}
                    </td>
                    <td style={styles.td}>
                        <div style={styles.actionCell}>
                          <button 
                            style={{...styles.actionButton, ...styles.approveButton}}
                            onClick={() => { if(confirm('¿Aprobar recarga?')) submitProcess(req, 'aprobado') }}
                            title="Aprobar"
                          >
                            <FiCheck />
                          </button>
                          <button 
                            style={{...styles.actionButton, ...styles.rejectButton}}
                            onClick={() => handleOpenRejectModal(req)}
                            title="Rechazar"
                          >
                            <FiX />
                          </button>
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- TABLA 2: HISTORIAL (NUEVO) --- */}
      <div style={styles.tableSection}>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionTitle}><FiClock /> Historial Reciente</div>
          <div style={{...styles.sectionCount, background: 'linear-gradient(135deg, #444 0%, #666 100%)'}}>{history.length}</div>
        </div>

        {history.length === 0 ? (
          <div style={styles.emptyState}><p>No hay historial de recargas procesadas.</p></div>
        ) : (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Procesado</th>
                  <th style={styles.th}>Usuario</th>
                  <th style={styles.th}>Monto</th>
                  <th style={styles.th}>Método / Ref</th>
                  <th style={styles.th}>Estado</th>
                  <th style={styles.th}><FiMessageSquare /> Notas Admin</th>
                </tr>
              </thead>
              <tbody>
                {history.map((req, idx) => (
                  <tr key={req.id} style={{backgroundColor: idx%2===0 ? 'transparent' : 'rgba(255,255,255,0.02)'}}>
                    <td style={styles.td}>
                        {req.reviewed_at ? new Date(req.reviewed_at).toLocaleDateString() : new Date(req.created_at).toLocaleDateString()}
                        <div style={{fontSize:'0.7rem', color:'#666'}}>
                            {req.reviewed_at ? new Date(req.reviewed_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                        </div>
                    </td>
                    <td style={styles.td}>
                        <div style={{color:'#ddd'}}>{req.username}</div>
                    </td>
                    <td style={{...styles.td, color: req.status === 'aprobado' ? '#2ecc71' : '#ff6b6b', fontWeight:'bold'}}>
                        ${parseFloat(req.amount_usd).toFixed(2)}
                    </td>
                    <td style={styles.td}>
                        <div style={{fontSize:'0.8rem'}}>{req.payment_method}</div>
                        <div style={{fontSize:'0.7rem', color:'#888', fontFamily:'monospace'}}>{req.transaction_reference}</div>
                    </td>
                    <td style={styles.td}>
                      <span style={{...styles.statusBadge, ...getStatusStyle(req.status)}}>
                        {req.status}
                      </span>
                    </td>
                    <td style={styles.td}>
                        {req.admin_notes ? (
                            <span style={styles.notesText} title={req.admin_notes}>
                                {req.admin_notes}
                            </span>
                        ) : <span style={{color:'#444'}}>--</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- MODAL DE RECHAZO --- */}
      {isModalOpen && selectedRequest && (
        <div style={styles.modalOverlay} onClick={handleCloseModal}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Rechazar Solicitud</h3>
            <p style={styles.modalSubtitle}>
                Usuario: <strong>{selectedRequest.username}</strong> <br/>
                Monto: <strong>${parseFloat(selectedRequest.amount_usd).toFixed(2)}</strong>
            </p>
            
            <label style={{display:'block', marginBottom:8, fontSize:'0.9rem', color:'#aaa'}}><FiMessageSquare style={{verticalAlign:'middle'}}/> Motivo del rechazo (Opcional):</label>
            <textarea
              style={styles.textarea}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Ej: La referencia no existe o el monto es incorrecto..."
            />
            
            <div style={styles.modalActions}>
              <button style={styles.btnCancel} onClick={handleCloseModal}>Cancelar</button>
              <button style={styles.btnConfirmReject} onClick={() => submitProcess(selectedRequest, 'rechazado')}>Confirmar Rechazo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RechargeManagement;
