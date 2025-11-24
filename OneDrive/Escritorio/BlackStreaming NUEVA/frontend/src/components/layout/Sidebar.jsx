import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// Estilos para el Sidebar (inspirados en tu imagen)
const styles = {
  sidebar: {
    width: '240px',
    backgroundColor: '#252831', // Fondo oscuro del sidebar
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid #30333d',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: '2rem',
    textDecoration: 'none',
  },
  navGroup: {
    marginBottom: '1.5rem',
  },
  navTitle: {
    fontSize: '0.8rem',
    color: '#8a92a6',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '0.5rem',
  },
  navLink: {
    display: 'block',
    textDecoration: 'none',
    color: '#e0e0e0',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    marginBottom: '0.25rem',
  },
  // Estilo para el link activo
  activeLink: {
    backgroundColor: '#007bff', // Azul para el activo
    color: '#fff',
  }
};

const Sidebar = () => {
  const location = useLocation(); // Hook para saber qué ruta está activa

  // Función para ver si un link está activo
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav style={styles.sidebar}>
      <Link to="/" style={styles.logo}>DASHBOARD</Link>

      <div style={styles.navGroup}>
        <span style={styles.navTitle}>Admin</span>
        <Link 
          to="/admin/categorias" 
          style={{ 
            ...styles.navLink, 
            ...(isActive('/admin/categorias') ? styles.activeLink : {}) 
          }}
        >
          Gestión de Categorías
        </Link>
        <Link 
          to="/admin/usuarios" // Placeholder
          style={{ 
            ...styles.navLink, 
            ...(isActive('/admin/usuarios') ? styles.activeLink : {}) 
          }}
        >
          Gestión de Usuarios
        </Link>
        {/* Agrega más links de admin aquí */}
      </div>

      <div style={styles.navGroup}>
        <span style={styles.navTitle}>Proveedor (Placeholder)</span>
        <Link to="#" style={styles.navLink}>Mis Productos</Link>
      </div>
      
      <div style={styles.navGroup}>
        <span style={styles.navTitle}>Usuario (Placeholder)</span>
        <Link to="#" style={styles.navLink}>Mis Órdenes</Link>
      </div>

    </nav>
  );
};

export default Sidebar;