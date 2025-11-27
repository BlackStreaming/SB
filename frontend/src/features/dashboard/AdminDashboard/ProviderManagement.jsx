import React, { useState, useEffect } from 'react';
import apiClient from '/src/services/apiClient';
import { 
  FiUsers, FiCheck, FiX, FiEdit, FiRefreshCw, FiShield, FiGrid, 
  FiCheckCircle, FiAlertTriangle 
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
  
  // Badges
  badge: { padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '4px' },
  badgeActive: { background: 'rgba(39, 174, 96, 0.15)', color: '#2ecc71', border: '1px solid rgba(39, 174, 96, 0.3)' },
  badgeInactive: { background: 'rgba(220, 53, 69, 0.15)', color: '#ff6b6b', border: '1px solid rgba(220, 53, 69, 0.3)' },
  badgeYes: { background: 'rgba(102, 126, 234, 0.15)', color: '#667eea', border: '1px solid rgba(102, 126, 234, 0.3)' },
  badgeNo: { background: 'rgba(255, 255, 255, 0.05)', color: '#666', border: '1px solid rgba(255, 255, 255, 0.1)' },
  badgePurple: { background: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa', border: '1px solid rgba(139, 92, 246, 0.3)', cursor: 'pointer' },

  // Botón Gestionar
  manageButton: {
    padding: '8px 16px', border: 'none', borderRadius: '8px', cursor: 'pointer', 
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white',
    fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px',
    transition: 'all 0.2s'
  },

  // Modal Principal
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' },
  modalContent: { background: '#1a1a1a', borderRadius: '16px', padding: '30px', width: '100%', maxWidth: '600px', border: '1px solid rgba(255,255,255,0.1)', maxHeight: '90vh', overflowY: 'auto' },
  modalTitle: { fontSize: '1.5rem', fontWeight: '700', marginBottom: '8px', color: '#fff' },
  modalSubtitle: { fontSize: '0.9rem', color: '#aaa', marginBottom: '24px' },
  modalCloseBtn: { position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1.5rem' },

  // Modal Feedback (Success/Error)
  feedbackOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' },
  feedbackContent: { background: '#1f1f1f', borderRadius: '20px', padding: '40px 30px', width: '100%', maxWidth: '380px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' },
  feedbackTitle: { fontSize: '1.4rem', fontWeight: '700', marginTop: '16px', marginBottom: '8px', color: '#fff' },
  feedbackText: { fontSize: '0.95rem', color: '#aaa', marginBottom: '24px', lineHeight: '1.5' },
  feedbackButton: { padding: '12px 30px', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', transition: '0.2s', width: '100%' },
  
  // Elementos del Modal
  permissionGroup: { marginBottom: '20px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' },
  groupTitle: { fontSize: '1rem', fontWeight: '600', color: '#e0e0e0', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' },
  checkboxLabel: { display: 'flex', alignItems: 'center', gap: '10px', color: '#ccc', fontSize: '0.9rem', cursor: 'pointer', marginBottom: '8px' },
  checkboxInput: { width: '16px', height: '16px', accentColor: '#667eea', cursor: 'pointer' },
  
  limitInputWrapper: { marginTop: '10px', marginLeft: '26px', padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' },
  limitLabel: { display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '4px' },
  limitInput: { width: '100px', padding: '8px', borderRadius: '6px', border: '1px solid #444', background: '#222', color: '#fff', fontSize: '0.9rem' },

  categoryList: { maxHeight: '200px', overflowY: 'auto', paddingRight: '4px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' },
  categoryItem: { display: 'flex', alignItems: 'center', gap: '8px', padding: '6px', borderRadius: '6px', transition: '0.2s', cursor: 'pointer', fontSize: '0.85rem', color: '#ccc', background: 'rgba(255,255,255,0.02)' },
  categoryItemActive: { background: 'rgba(102, 126, 234, 0.1)', color: '#667eea', border: '1px solid rgba(102, 126, 234, 0.2)' },

  saveButton: { width: '100%', padding: '12px', marginTop: '20px', border: 'none', borderRadius: '10px', background: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)', color: 'white', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', transition: '0.2s' },

  // Estados
  loading: { textAlign: 'center', padding: '60px', color: '#888', fontSize: '1.1rem' },
  emptyState: { textAlign: 'center', padding: '60px', color: '#666' },
  error: { background: 'rgba(220, 53, 69, 0.15)', color: '#ff6b6b', border: '1px solid rgba(220, 53, 69, 0.3)', padding: '16px', borderRadius: '12px', marginBottom: '20px' }
};

const ProviderManagement = () => {
  const [providers, setProviders] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Nuevo estado para el Modal de Feedback
  const [feedback, setFeedback] = useState({ show: false, type: 'success', message: '' });

  const [modalSettings, setModalSettings] = useState({
    can_recharge: false,
    can_affiliate: false,
    allowed_category_ids: [],
    affiliate_limit: 0,
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/admin/provider-settings');
      setProviders(response.data.providers || []);
      setAllCategories(response.data.all_categories || []);
      setError(null);
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar datos.');
    }
    setIsLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleOpenModal = (provider) => {
    setSelectedProvider(provider);
    setModalSettings({
      can_recharge: provider.can_recharge,
      can_affiliate: provider.can_affiliate,
      allowed_category_ids: [...provider.allowed_category_ids],
      affiliate_limit: parseInt(provider.affiliate_limit) || 0,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProvider(null);
    setIsSaving(false);
  };

  const handleCloseFeedback = () => {
    setFeedback({ ...feedback, show: false });
  };

  const handlePermissionChange = (e) => {
    const { name, checked } = e.target;
    setModalSettings(prev => ({ ...prev, [name]: checked }));
  };

  const handleLimitChange = (e) => {
      const val = e.target.value;
      const numVal = val === '' ? 0 : parseInt(val);
      setModalSettings(prev => ({
          ...prev,
          affiliate_limit: isNaN(numVal) ? 0 : numVal
      }));
  };

  const handleCategoryChange = (categoryId) => {
    setModalSettings(prev => {
      const currentIds = prev.allowed_category_ids;
      return currentIds.includes(categoryId)
        ? { ...prev, allowed_category_ids: currentIds.filter(id => id !== categoryId) }
        : { ...prev, allowed_category_ids: [...currentIds, categoryId] };
    });
  };

  const handleSave = async () => {
    if (!selectedProvider) return;
    setIsSaving(true);
    try {
      await apiClient.put(`/admin/provider-settings/${selectedProvider.id}`, modalSettings);
      
      handleCloseModal();
      
      setFeedback({
        show: true,
        type: 'success',
        message: 'La configuración del proveedor se ha actualizado correctamente.'
      });
      
      fetchData();
    } catch (err) {
      setFeedback({
        show: true,
        type: 'error',
        message: 'Hubo un problema al intentar guardar los cambios. Inténtalo de nuevo.'
      });
      setIsSaving(false);
    }
  };

  const getCategoryName = (id) => {
    const category = allCategories.find(cat => cat.id === id);
    return category ? category.name : `ID ${id}`;
  };

  if (isLoading) return <div style={styles.loading}><FiRefreshCw className="spin"/> Cargando proveedores...</div>;

  return (
    <div style={styles.container}>
      {/* INYECCIÓN DE ESTILOS CSS PARA ANIMACIONES 
        Esto permite usar keyframes sin archivos CSS externos 
      */}
      <style>{`
        @keyframes scaleUp {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>

      <div style={styles.backgroundDecoration} />
      
      <div style={styles.headerSection}>
        <h1 style={styles.header}>Gestión de Proveedores</h1>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.tableSection}>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionTitle}><FiUsers /> Proveedores Registrados</div>
          <div style={styles.sectionCount}>{providers.length}</div>
        </div>

        {providers.length === 0 ? (
          <div style={styles.emptyState}><p>No hay proveedores.</p></div>
        ) : (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Proveedor</th>
                  <th style={styles.th}>Estado</th>
                  <th style={styles.th}>Recargas</th>
                  <th style={styles.th}>Afiliados</th>
                  <th style={styles.th}>Categorías</th>
                  <th style={styles.th}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {providers.map((provider, idx) => (
                  <tr key={provider.id} style={{backgroundColor: idx%2===0 ? 'transparent' : 'rgba(255,255,255,0.02)'}}>
                    <td style={styles.td}>
                      <div style={{fontWeight:600, color:'#fff'}}>{provider.username}</div>
                      <div style={{fontSize:'0.75rem', color:'#888'}}>ID: {provider.id}</div>
                    </td>
                    <td style={styles.td}>
                      <span style={{...styles.badge, ...(provider.status==='activo' ? styles.badgeActive : styles.badgeInactive)}}>
                        {provider.status}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={{...styles.badge, ...(provider.can_recharge ? styles.badgeYes : styles.badgeNo)}}>
                        {provider.can_recharge ? 'Sí' : 'No'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={{...styles.badge, ...(provider.can_affiliate ? styles.badgeYes : styles.badgeNo)}}>
                        {provider.can_affiliate ? `Sí (${provider.affiliate_limit})` : 'No'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={{...styles.badge, ...styles.badgePurple}} title={provider.allowed_category_ids.map(id => getCategoryName(id)).join(', ')}>
                        {provider.allowed_category_ids.length} cats.
                      </span>
                    </td>
                    <td style={styles.td}>
                      <button style={styles.manageButton} onClick={() => handleOpenModal(provider)}>
                        <FiEdit size={14}/> Gestionar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Configuración */}
      {showModal && selectedProvider && (
        <div style={styles.modalOverlay} onClick={handleCloseModal}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button onClick={handleCloseModal} style={styles.modalCloseBtn}><FiX /></button>
            <div style={styles.modalTitle}>Gestionar Permisos</div>
            <div style={styles.modalSubtitle}>Proveedor: <strong>{selectedProvider.username}</strong></div>

            <div style={styles.permissionGroup}>
              <div style={styles.groupTitle}><FiShield /> Permisos Generales</div>
              
              <label style={styles.checkboxLabel}>
                <input type="checkbox" style={styles.checkboxInput} name="can_recharge" checked={modalSettings.can_recharge} onChange={handlePermissionChange} />
                Permitir Recargas
              </label>

              <label style={styles.checkboxLabel}>
                <input type="checkbox" style={styles.checkboxInput} name="can_affiliate" checked={modalSettings.can_affiliate} onChange={handlePermissionChange} />
                Permitir Afiliados
              </label>

              {modalSettings.can_affiliate && (
                <div style={styles.limitInputWrapper}>
                    <label style={styles.limitLabel}>Cupo de Activaciones:</label>
                    <input 
                      type="number" 
                      min="0" 
                      value={modalSettings.affiliate_limit.toString()} 
                      onChange={handleLimitChange}
                      style={styles.limitInput}
                    />
                </div>
              )}
            </div>

            <div style={styles.permissionGroup}>
              <div style={styles.groupTitle}><FiGrid /> Categorías Permitidas ({modalSettings.allowed_category_ids.length})</div>
              <div style={styles.categoryList}>
                {allCategories.map(category => (
                  <div 
                    key={category.id} 
                    style={{...styles.categoryItem, ...(modalSettings.allowed_category_ids.includes(category.id) ? styles.categoryItemActive : {})}}
                    onClick={() => handleCategoryChange(category.id)}
                  >
                    <div style={{
                        width:14, height:14, border: modalSettings.allowed_category_ids.includes(category.id) ? 'none' : '1px solid #666', 
                        background: modalSettings.allowed_category_ids.includes(category.id) ? '#667eea' : 'transparent',
                        borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        {modalSettings.allowed_category_ids.includes(category.id) && <FiCheck size={10} color="white"/>}
                    </div>
                    {category.name}
                  </div>
                ))}
              </div>
            </div>

            <button style={styles.saveButton} onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      )}

      {/* Modal de Feedback con ANIMACIONES */}
      {feedback.show && (
        <div style={styles.feedbackOverlay} onClick={handleCloseFeedback}>
          <div style={styles.feedbackContent} onClick={e => e.stopPropagation()}>
            {feedback.type === 'success' ? (
              <FiCheckCircle 
                size={64} 
                color="#2ecc71" 
                style={{ 
                  marginBottom: 10,
                  // Animación de "Pop" suave
                  animation: 'scaleUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards' 
                }} 
              />
            ) : (
              <FiAlertTriangle 
                size={64} 
                color="#e74c3c" 
                style={{ 
                  marginBottom: 10,
                  // Animación de "Sacudida" para error
                  animation: 'shake 0.4s ease-in-out forwards'
                }} 
              />
            )}
            
            <h3 style={styles.feedbackTitle}>
              {feedback.type === 'success' ? '¡Éxito!' : 'Error'}
            </h3>
            
            <p style={styles.feedbackText}>{feedback.message}</p>
            
            <button 
              onClick={handleCloseFeedback}
              style={{
                ...styles.feedbackButton,
                background: feedback.type === 'success' 
                  ? 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)' 
                  : 'rgba(255,255,255,0.1)',
                color: feedback.type === 'success' ? '#fff' : '#e0e0e0',
                border: feedback.type === 'success' ? 'none' : '1px solid #444'
              }}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderManagement;
