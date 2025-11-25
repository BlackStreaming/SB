// src/features/dashboard/AdminDashboard/CategoryManagement.jsx

import React, { useState, useEffect } from 'react';
import apiClient from '../../../services/apiClient.js';
import {
    FiPlus, FiEdit, FiTrash2, FiImage, FiSave, FiX,
    FiFolder, FiLink, FiTag, FiCheckCircle, FiAlertCircle,
    FiRefreshCw
} from 'react-icons/fi';

// --- Estilos Unified Compact Theme (Dark Glass) ---
const styles = {
    container: { 
        padding: '24px 16px', 
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", 
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

    // Extras
    imagePreview: { width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginTop: '8px', border: '1px solid rgba(255,255,255,0.1)' },
    tableImage: { width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px', background: '#333' },
    slugCode: { fontFamily: 'monospace', fontSize: '0.75rem', color: '#667eea', background: 'rgba(102, 126, 234, 0.1)', padding: '2px 6px', borderRadius: '4px' },

    // Modales y Mensajes
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' },
    modalContent: { background: '#1a1a1a', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '500px', border: '1px solid rgba(255,255,255,0.1)' },
    message: { padding: '12px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' },
    success: { background: 'rgba(39, 174, 96, 0.15)', color: '#2ecc71', border: '1px solid rgba(39, 174, 96, 0.3)' },
    error: { background: 'rgba(220, 53, 69, 0.15)', color: '#ff6b6b', border: '1px solid rgba(220, 53, 69, 0.3)' },
    loadingState: { textAlign: 'center', padding: '50px', color: '#aaa' },
    pulseAnimation: { animation: 'pulse 2s infinite' }
};

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        image_url: ''
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // --- LÓGICA ORIGINAL INTACTA ---
    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get('/categories');
            setCategories(response.data);
            setError(null);
        } catch (err) {
            setError('No se pudieron cargar las categorías.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'name') {
            const newSlug = value.toLowerCase()
                .trim()
                .replace(/\s+/g, '-')
                .replace(/[^\w-]+/g, '')
                .replace(/--+/g, '-');
            setFormData(prev => ({ ...prev, name: value, slug: newSlug }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        try {
            const response = await apiClient.post('/categories', formData);
            setMessage(`¡Categoría "${response.data.name}" creada con éxito!`);
            setFormData({ name: '', slug: '', image_url: '' });
            fetchCategories();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al crear la categoría.');
        }
    };

    const handleDelete = async (categoryId) => {
        if (!window.confirm("¿Estás seguro de eliminar esta categoría?")) return;
        try {
            await apiClient.delete(`/categories/${categoryId}`);
            setMessage('Categoría eliminada con éxito.');
            fetchCategories();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al eliminar la categoría.');
        }
    };

    // --- Lógica de Edición ---
    const handleEditClick = (category) => {
        setEditingCategory({ ...category });
        setIsModalOpen(true);
        setError(null);
        setMessage(null);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditingCategory(prev => ({ ...prev, [name]: value }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const { id, name, slug, image_url } = editingCategory;
            const response = await apiClient.put(`/categories/${id}`, { name, slug, image_url });
            setMessage(`¡Categoría "${response.data.name}" actualizada!`);
            closeModal();
            fetchCategories();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al actualizar la categoría.');
        }
    };

    if (isLoading) return (
        <div style={styles.container}>
            <div style={styles.loadingState}>
                <div style={styles.pulseAnimation}><FiRefreshCw size={40} color="#667eea" /></div>
                <p style={{ marginTop: 10 }}>Cargando categorías...</p>
            </div>
        </div>
    );

    return (
        <div style={styles.container}>
            <div style={styles.backgroundDecoration} />

            <div style={styles.headerSection}>
                <h1 style={styles.header}>Gestión de Categorías</h1>
            </div>

            <div style={styles.mainLayout}>

                {/* --- COLUMNA IZQUIERDA: FORMULARIO DE CREACIÓN --- */}
                <div style={styles.columnForm}>
                    <div style={styles.section}>
                        <div style={styles.sectionHeader}>
                            <h3 style={styles.sectionTitle}><FiPlus size={18} /> Nueva Categoría</h3>
                        </div>

                        {message && <div style={{ ...styles.message, ...styles.success }}><FiCheckCircle size={16} /> {message}</div>}
                        {error && <div style={{ ...styles.message, ...styles.error }}><FiAlertCircle size={16} /> {error}</div>}

                        <form onSubmit={handleSubmit} style={styles.form}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}><FiTag size={14} /> Nombre</label>
                                <div style={styles.inputWrapper}>
                                    <FiTag style={styles.inputIcon} size={14} />
                                    <input name="name" value={formData.name} onChange={handleChange} style={styles.input} placeholder="Ej: Streaming" required />
                                </div>
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}><FiLink size={14} /> Slug (URL)</label>
                                <div style={styles.inputWrapper}>
                                    <FiLink style={styles.inputIcon} size={14} />
                                    <input name="slug" value={formData.slug} onChange={handleChange} style={styles.input} placeholder="Ej: streaming" required />
                                </div>
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}><FiImage size={14} /> URL Imagen</label>
                                <div style={styles.inputWrapper}>
                                    <FiImage style={styles.inputIcon} size={14} />
                                    <input name="image_url" value={formData.image_url} onChange={handleChange} style={styles.input} placeholder="https://..." />
                                </div>
                                {formData.image_url && <img src={formData.image_url} style={styles.imagePreview} alt="Preview" />}
                            </div>

                            <button type="submit" style={styles.button}><FiSave size={16} /> Crear Categoría</button>
                        </form>
                    </div>
                </div>

                {/* --- COLUMNA DERECHA: TABLA DE CATEGORÍAS --- */}
                <div style={styles.columnTable}>
                    <div style={styles.section}>
                        <div style={styles.sectionHeader}>
                            <h3 style={styles.sectionTitle}><FiFolder size={18} /> Existentes ({categories.length})</h3>
                            <button onClick={fetchCategories} style={{ background: 'transparent', border: 'none', color: '#667eea', cursor: 'pointer' }}><FiRefreshCw /></button>
                        </div>

                        <div style={styles.tableContainer}>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>Imagen</th>
                                        <th style={styles.th}>Nombre</th>
                                        <th style={styles.th}>Slug</th>
                                        <th style={styles.th}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map((cat, index) => (
                                        <tr key={cat.id} style={{ backgroundColor: index % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                                            <td style={styles.td}>
                                                {cat.image_url ? (
                                                    <img src={cat.image_url} alt={cat.name} style={styles.tableImage} />
                                                ) : (
                                                    <div style={{ ...styles.tableImage, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}><FiImage /></div>
                                                )}
                                            </td>
                                            <td style={{ ...styles.td, fontWeight: '600' }}>{cat.name}</td>
                                            <td style={styles.td}><span style={styles.slugCode}>{cat.slug}</span></td>
                                            <td style={styles.td}>
                                                <div style={{ display: 'flex' }}>
                                                    <button onClick={() => handleEditClick(cat)} style={{ ...styles.actionBtn, ...styles.btnEdit }} title="Editar">
                                                        <FiEdit size={14} />
                                                    </button>
                                                    <button onClick={() => handleDelete(cat.id)} style={{ ...styles.actionBtn, ...styles.btnDelete }} title="Eliminar">
                                                        <FiTrash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {categories.length === 0 && (
                                        <tr><td colSpan="4" style={{ textAlign: 'center', padding: 30, color: '#666' }}>No hay categorías registradas.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MODAL DE EDICIÓN --- */}
            {isModalOpen && editingCategory && (
                <div style={styles.modalOverlay} onClick={closeModal}>
                    <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                            <h3 style={{ color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}><FiEdit /> Editar Categoría</h3>
                            <button onClick={closeModal} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><FiX size={20} /></button>
                        </div>

                        <form onSubmit={handleEditSubmit} style={styles.form}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Nombre</label>
                                <input name="name" value={editingCategory.name} onChange={handleEditChange} style={styles.input} required />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Slug</label>
                                <input name="slug" value={editingCategory.slug} onChange={handleEditChange} style={styles.input} required />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>URL Imagen</label>
                                <input name="image_url" value={editingCategory.image_url} onChange={handleEditChange} style={styles.input} />
                                {editingCategory.image_url && <img src={editingCategory.image_url} style={styles.imagePreview} alt="Preview" />}
                            </div>

                            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                                <button type="submit" style={{ ...styles.button, flex: 1, marginTop: 0 }}>Guardar Cambios</button>
                                <button type="button" onClick={closeModal} style={{ ...styles.button, ...styles.buttonSecondary, flex: 1, marginTop: 0 }}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryManagement;