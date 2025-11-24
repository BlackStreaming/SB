// src/features/dashboard/AdminDashboard/SiteSettings.jsx

import React, { useState, useEffect } from 'react';
import apiClient from '../../../services/apiClient.js';
import { 
  FiImage, FiType, FiLink, FiCheckCircle, FiXCircle, 
  FiEdit, FiTrash2, FiPlus, FiSave, FiX, FiLayout, 
  FiMonitor, FiRefreshCw, FiAlertCircle
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
  headerSection: { textAlign: 'center', marginBottom: '24px', position: 'relative', zIndex: 1 },
  header: { 
    fontSize: '2rem', fontWeight: '800', 
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px'
  },

  // Layout Principal (2 Columnas)
  mainLayout: { display: 'flex', flexWrap: 'wrap', gap: '24px', position: 'relative', zIndex: 1 },
  columnForm: { flex: '1 1 350px', minWidth: '300px' },
  columnTable: { flex: '2 1 500px', minWidth: '320px' },

  // Secciones
  section: {
    background: 'rgba(25, 25, 25, 0.8)', backdropFilter: 'blur(20px)', borderRadius: '16px',
    padding: '24px', border: '1px solid rgba(255, 255, 255, 0.1)', position: 'relative', overflow: 'hidden',
    height: 'fit-content'
  },
  sectionHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' },
  sectionTitle: { fontSize: '1.1rem', fontWeight: '700', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px' },
  sectionCount: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '700' },

  // Formulario
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  inputGroup: { display: 'flex', flexDirection: 'column', width: '100%' },
  label: { fontSize: '0.8rem', fontWeight: '600', color: '#a0a0a0', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' },
  
  inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  inputIcon: { position: 'absolute', left: '12px', color: '#666', zIndex: 10 },
  
  input: { 
    width: '100%', padding: '10px 12px 10px 36px', border: '1px solid rgba(255, 255, 255, 0.1)', 
    borderRadius: '10px', fontSize: '0.9rem', backgroundColor: 'rgba(40, 40, 40, 0.6)', 
    color: '#ffffff', fontFamily: 'inherit', transition: 'all 0.3s ease', boxSizing: 'border-box'
  },
  
  // Botones
  button: { 
    padding: '12px', border: 'none', borderRadius: '12px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
    color: 'white', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', display: 'flex', 
    alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.3s ease', 
    marginTop: '12px', position: 'relative', overflow: 'hidden'
  },
  buttonSecondary: { background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#ccc' },
  
  // Tabla
  tableContainer: { overflowX: 'auto', borderRadius: '12px' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' },
  th: { padding: '12px 10px', backgroundColor: 'rgba(40, 40, 40, 0.95)', fontWeight: '700', color: '#a0a0a0', textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase', whiteSpace: 'nowrap' },
  td: { padding: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', color: '#e0e0e0', verticalAlign: 'middle' },
  
  // Acciones Tabla
  actionBtn: { padding: '6px', borderRadius: '8px', cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' },
  btnEdit: { background: 'rgba(102, 126, 234, 0.15)', color: '#667eea', marginRight: '8px' },
  btnDelete: { background: 'rgba(220, 53, 69, 0.15)', color: '#ff6b6b' },
  btnRefresh: { background: 'transparent', color: '#667eea', border: 'none', cursor: 'pointer' },

  // Extras
  imagePreview: { width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', marginTop: '8px', border: '1px solid rgba(255,255,255,0.1)' },
  tableImage: { width: '60px', height: '35px', objectFit: 'cover', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' },
  statusBadge: { padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '4px' },
  activeBadge: { background: 'rgba(39, 174, 96, 0.15)', color: '#2ecc71' },
  inactiveBadge: { background: 'rgba(255, 107, 107, 0.15)', color: '#ff6b6b' },

  // Modales y Mensajes
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' },
  modalContent: { background: '#1a1a1a', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '500px', border: '1px solid rgba(255,255,255,0.1)' },
  message: { padding: '12px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' },
  success: { background: 'rgba(39, 174, 96, 0.15)', color: '#2ecc71', border: '1px solid rgba(39, 174, 96, 0.3)' },
  error: { background: 'rgba(220, 53, 69, 0.15)', color: '#ff6b6b', border: '1px solid rgba(220, 53, 69, 0.3)' },
  loadingState: { textAlign: 'center', padding: '50px', color: '#aaa' },
  emptyState: { textAlign: 'center', padding: '40px', color: '#666' },
  pulseAnimation: { animation: 'pulse 2s infinite' }
};

const SiteSettings = () => {
  // --- Estado para la LISTA de slides ---
  const [slides, setSlides] = useState([]);

  // --- Estado para el formulario de CREAR ---
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image_url: '',
    link_url: '',
    is_active: true
  });

  // --- Estado para el formulario de EDITAR ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);

  // --- Estado para mensajes ---
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- Función para Cargar (Leer) Slides ---
  const fetchSlides = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/carousel-slides');
      setSlides(response.data);
      setError(null);
    } catch (err) {
      setError('No se pudieron cargar los slides del carrusel.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSlides(); }, []);

  // --- Lógica para CREAR ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!formData.image_url) {
      setError('La URL de la imagen es requerida.');
      return;
    }

    try {
      const response = await apiClient.post('/carousel-slides', formData);
      setMessage(`¡Slide creado con éxito!`);
      setFormData({ title: '', subtitle: '', image_url: '', link_url: '', is_active: true });
      fetchSlides();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear el slide.');
    }
  };

  // --- Lógica para ELIMINAR ---
  const handleDelete = async (slideId) => {
    if (!window.confirm('¿Estás seguro de eliminar este slide?')) return;
    try {
      await apiClient.delete(`/carousel-slides/${slideId}`);
      setMessage('Slide eliminado con éxito.');
      fetchSlides();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al eliminar el slide.');
    }
  };

  // --- Lógica para EDITAR (Modal) ---
  const handleEditClick = (slide) => {
    setEditingSlide({ ...slide });
    setIsModalOpen(true);
    setError(null);
    setMessage(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSlide(null);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingSlide(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const { id, title, subtitle, image_url, link_url, is_active } = editingSlide;
      await apiClient.put(`/carousel-slides/${id}`, { title, subtitle, image_url, link_url, is_active });
      setMessage(`¡Slide actualizado!`);
      closeModal();
      fetchSlides();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al actualizar el slide.');
    }
  };

  if (loading && !slides.length) return <div style={styles.container}><div style={styles.loadingState}>Cargando...</div></div>;

  return (
    <div style={styles.container}>
      <div style={styles.backgroundDecoration} />
      
      <div style={styles.headerSection}>
        <h1 style={styles.header}>Configuración del Sitio</h1>
      </div>

      <div style={styles.mainLayout}>
        
        {/* --- COLUMNA IZQUIERDA: FORMULARIO --- */}
        <div style={styles.columnForm}>
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}><FiPlus size={18} /> Nuevo Slide</h3>
            </div>

            {message && <div style={{ ...styles.message, ...styles.success }}><FiCheckCircle size={16} /> {message}</div>}
            {error && <div style={{ ...styles.message, ...styles.error }}><FiAlertCircle size={16} /> {error}</div>}

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}><FiType size={14} /> Título</label>
                <div style={styles.inputWrapper}>
                    <FiType style={styles.inputIcon} size={14} />
                    <input name="title" value={formData.title} onChange={handleChange} style={styles.input} placeholder="Título Principal" />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}><FiType size={14} /> Subtítulo</label>
                <div style={styles.inputWrapper}>
                    <FiType style={styles.inputIcon} size={14} />
                    <input name="subtitle" value={formData.subtitle} onChange={handleChange} style={styles.input} placeholder="Subtítulo opcional" />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}><FiImage size={14} /> URL Imagen</label>
                <div style={styles.inputWrapper}>
                    <FiImage style={styles.inputIcon} size={14} />
                    <input name="image_url" value={formData.image_url} onChange={handleChange} style={styles.input} placeholder="https://..." required />
                </div>
                {formData.image_url && <img src={formData.image_url} style={styles.imagePreview} alt="Vista Previa" onError={(e) => e.target.style.display = 'none'} />}
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}><FiLink size={14} /> Enlace</label>
                <div style={styles.inputWrapper}>
                    <FiLink style={styles.inputIcon} size={14} />
                    <input name="link_url" value={formData.link_url} onChange={handleChange} style={styles.input} placeholder="/ruta/destino" />
                </div>
              </div>

              <div style={styles.inputGroup}>
                 <label style={{...styles.label, cursor: 'pointer', marginTop: '10px'}}>
                    <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} style={{marginRight: '8px'}} />
                    Activo (Visible en Carrusel)
                 </label>
              </div>

              <button type="submit" style={styles.button}>
                 <FiPlus size={16} /> Añadir Slide
              </button>
            </form>
          </div>
        </div>

        {/* --- COLUMNA DERECHA: TABLA --- */}
        <div style={styles.columnTable}>
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}><FiMonitor size={18} /> Slides Activos</h3>
              <div style={{display:'flex', alignItems:'center', gap:10}}>
                <span style={styles.sectionCount}>{slides.length}</span>
                <button onClick={fetchSlides} style={styles.btnRefresh}><FiRefreshCw /></button>
              </div>
            </div>

            {slides.length === 0 ? (
              <div style={styles.emptyState}><p>No hay slides en el carrusel.</p></div>
            ) : (
              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Imagen</th>
                      <th style={styles.th}>Título</th>
                      <th style={styles.th}>Enlace</th>
                      <th style={styles.th}>Estado</th>
                      <th style={styles.th}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {slides.map((slide, idx) => (
                      <tr key={slide.id} style={{backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)'}}>
                        <td style={styles.td}>
                           <img src={slide.image_url} style={styles.tableImage} alt="slide" onError={(e) => e.target.src = 'https://placehold.co/60x35/333/FFF?text=IMG'} />
                        </td>
                        <td style={{...styles.td, fontWeight:'600'}}>{slide.title || <span style={{color:'#666', fontStyle:'italic'}}>Sin título</span>}</td>
                        <td style={{...styles.td, fontSize:'0.75rem', color:'#aaa'}}>{slide.link_url || '-'}</td>
                        <td style={styles.td}>
                          <span style={{...styles.statusBadge, ...(slide.is_active ? styles.activeBadge : styles.inactiveBadge)}}>
                             {slide.is_active ? <FiCheckCircle size={10}/> : <FiXCircle size={10}/>} {slide.is_active ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <div style={{display:'flex'}}>
                            <button onClick={() => handleEditClick(slide)} style={{...styles.actionBtn, ...styles.btnEdit}}><FiEdit size={14}/></button>
                            <button onClick={() => handleDelete(slide.id)} style={{...styles.actionBtn, ...styles.btnDelete}}><FiTrash2 size={14}/></button>
                          </div>
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

      {/* --- MODAL DE EDICIÓN --- */}
      {isModalOpen && editingSlide && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 20}}>
                <h3 style={{color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}><FiLayout /> Editar Slide</h3>
                <button onClick={closeModal} style={{background:'none', border:'none', color:'#fff', cursor:'pointer'}}><FiX size={20} /></button>
            </div>

            <form onSubmit={handleEditSubmit} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Título</label>
                <input name="title" value={editingSlide.title || ''} onChange={handleEditChange} style={styles.input} />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Subtítulo</label>
                <input name="subtitle" value={editingSlide.subtitle || ''} onChange={handleEditChange} style={styles.input} />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>URL Imagen</label>
                <input name="image_url" value={editingSlide.image_url} onChange={handleEditChange} style={styles.input} />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Enlace</label>
                <input name="link_url" value={editingSlide.link_url || ''} onChange={handleEditChange} style={styles.input} />
              </div>
              <div style={styles.inputGroup}>
                 <label style={{...styles.label, cursor: 'pointer'}}>
                    <input type="checkbox" name="is_active" checked={editingSlide.is_active} onChange={handleEditChange} style={{marginRight: '8px'}} />
                    Activo
                 </label>
              </div>

              <div style={{display: 'flex', gap: 10, marginTop: 20}}>
                <button type="submit" style={{...styles.button, flex: 1, marginTop: 0}}><FiSave size={16} /> Guardar Cambios</button>
                <button type="button" onClick={closeModal} style={{...styles.button, ...styles.buttonSecondary, flex: 1, marginTop: 0}}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteSettings;