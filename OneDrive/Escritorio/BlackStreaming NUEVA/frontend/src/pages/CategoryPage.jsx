import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../services/apiClient.js';
import ProductCard from '../components/product/ProductCard.jsx';
import { 
  FiFilter, 
  FiSearch, 
  FiGrid, 
  FiFolder, 
  FiList,
  FiHome,
  FiPackage,
  FiXCircle,
  FiMenu,
  FiX
} from 'react-icons/fi';

// --- Estilos Ultra Modernos Unificados ---
const styles = {
  container: { 
    padding: '40px 24px', 
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
  layout: {
    display: 'flex',
    gap: '32px',
    maxWidth: '1400px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 1
  },
  sidebar: {
    width: '280px',
    background: 'rgba(25, 25, 25, 0.8)',
    backdropFilter: 'blur(20px)',
    borderRadius: '28px',
    padding: '32px 0',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    position: 'sticky',
    top: '2rem',
    height: 'fit-content',
    overflow: 'hidden',
    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease'
  },
  sidebarHeader: {
    padding: '0 24px 24px 24px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    marginBottom: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  sidebarTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: '0 0 8px 0',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  sidebarSubtitle: {
    fontSize: '0.9rem',
    color: '#a0a0a0',
    margin: 0,
    lineHeight: '1.5'
  },
  sidebarList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  sidebarItem: {
    margin: '4px 16px',
  },
  sidebarLink: {
    textDecoration: 'none',
    color: '#b0b0b0',
    fontSize: '0.95rem',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 20px',
    borderRadius: '16px',
    transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    fontWeight: '500',
    border: '1px solid transparent',
    position: 'relative',
    overflow: 'hidden'
  },
  sidebarLinkActive: {
    color: '#667eea',
    fontWeight: '600',
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    borderColor: 'rgba(102, 126, 234, 0.3)',
    transform: 'translateX(8px)'
  },
  sidebarLinkHover: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: '#ffffff',
    transform: 'translateX(8px)',
    borderColor: 'rgba(255, 255, 255, 0.1)'
  },
  sidebarLinkGlow: {
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.2), transparent)',
    transition: 'left 0.5s ease'
  },
  sidebarLinkGlowHover: {
    left: '100%'
  },
  mainContent: {
    flex: 1,
    minWidth: 0,
  },
  headerSection: {
    background: 'rgba(25, 25, 25, 0.8)',
    backdropFilter: 'blur(20px)',
    borderRadius: '28px',
    padding: '32px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    marginBottom: '32px',
    position: 'relative',
    overflow: 'hidden'
  },
  header: { 
    fontSize: '3rem', 
    fontWeight: '800', 
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '12px',
    letterSpacing: '-0.02em',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap'
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#b0b0b0',
    margin: '0 0 16px 0',
    lineHeight: '1.6',
    fontWeight: '400'
  },
  count: {
    fontSize: '1rem',
    color: '#a0a0a0',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '500',
    padding: '12px 20px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    width: 'fit-content'
  },
  filtersSection: {
    background: 'rgba(25, 25, 25, 0.8)',
    backdropFilter: 'blur(20px)',
    borderRadius: '28px',
    padding: '32px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    marginBottom: '32px',
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  // --- CORRECCIÓN AQUÍ: Contenedor del buscador ---
  searchContainer: {
    position: 'relative',
    flex: '1 1 250px', // Base más pequeña para flexibilidad
    minWidth: '200px', // Evita que se colapse demasiado, pero no fuerza 300px
    maxWidth: '100%',  // Asegura que no exceda el padre
  },
  // --- CORRECCIÓN AQUÍ: Input del buscador ---
  searchInput: {
    width: '100%',
    boxSizing: 'border-box', // CRUCIAL: Incluye padding y borde en el ancho total
    padding: '16px 20px 16px 52px',
    border: '2px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
    color: '#ffffff',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    outline: 'none',
    fontFamily: 'inherit',
    backdropFilter: 'blur(20px)'
  },
  searchInputFocus: {
    borderColor: '#667eea',
    backgroundColor: 'rgba(35, 35, 35, 0.9)',
    boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.1)',
    transform: 'translateY(-2px)'
  },
  searchIcon: {
    position: 'absolute',
    left: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#667eea',
    pointerEvents: 'none',
    zIndex: 2
  },
  statusFilter: {
    padding: '16px 20px',
    border: '2px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
    color: '#ffffff',
    fontSize: '1rem',
    minWidth: '200px',
    transition: 'all 0.3s ease',
    outline: 'none',
    fontFamily: 'inherit',
    cursor: 'pointer',
    backdropFilter: 'blur(20px)',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'><path fill='%23667eea' d='M2 0L0 2h4zm0 5L0 3h4z'/></svg>")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 20px center',
    backgroundSize: '12px',
    boxSizing: 'border-box' // Aseguramos consistencia aquí también
  },
  statusFilterFocus: {
    borderColor: '#667eea',
    backgroundColor: 'rgba(35, 35, 35, 0.9)',
    boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.1)',
    transform: 'translateY(-2px)'
  },
  filterBtn: {
    padding: '16px 32px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '16px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
    position: 'relative',
    overflow: 'hidden',
    boxSizing: 'border-box'
  },
  filterBtnHover: {
    transform: 'translateY(-3px)',
    boxShadow: '0 12px 30px rgba(102, 126, 234, 0.4)'
  },
  buttonGlow: {
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
    transition: 'left 0.5s ease'
  },
  buttonGlowHover: {
    left: '100%'
  },
  grid: { 
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 40px',
    textAlign: 'center',
    background: 'rgba(25, 25, 25, 0.8)',
    backdropFilter: 'blur(20px)',
    borderRadius: '28px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  loadingSpinner: {
    width: '48px',
    height: '48px',
    border: '3px solid rgba(255, 255, 255, 0.1)',
    borderTop: '3px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px',
  },
  loadingText: {
    fontSize: '1.2rem',
    color: '#b0b0b0',
    fontWeight: '500',
  },
  error: { 
    background: 'rgba(25, 25, 25, 0.8)',
    backdropFilter: 'blur(20px)',
    color: '#ef4444', 
    padding: '24px', 
    borderRadius: '20px',
    marginBottom: '32px',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    textAlign: 'center',
    fontSize: '1.1rem',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px'
  },
  noProducts: {
    textAlign: 'center',
    padding: '80px 40px',
    color: '#a0a0a0',
    fontSize: '1.2rem',
    background: 'rgba(25, 25, 25, 0.8)',
    backdropFilter: 'blur(20px)',
    borderRadius: '28px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px'
  },
  homeLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 32px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '16px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    fontSize: '1rem',
    position: 'relative',
    overflow: 'hidden',
    marginTop: '16px'
  },
  homeLinkHover: {
    transform: 'translateY(-3px)',
    boxShadow: '0 12px 30px rgba(102, 126, 234, 0.4)'
  },
  homeLinkGlow: {
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
    transition: 'left 0.5s ease'
  },
  homeLinkGlowHover: {
    left: '100%'
  },
  menuButton: {
    padding: '12px',
    borderRadius: '12px',
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#fff',
    cursor: 'pointer',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backdropFilter: 'blur(10px)'
  },
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(5px)',
    zIndex: 99,
    transition: 'opacity 0.3s ease'
  }
};

const CategoryPage = () => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ search: '', status: '' });
  const [hoverStates, setHoverStates] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  
  // Responsive states
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const { slug } = useParams();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleHover = (element, isHovering) => {
    setHoverStates(prev => ({ ...prev, [element]: isHovering }));
  };

  const handleFocus = (field) => {
    setFocusedField(field);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await apiClient.get('/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('Error al cargar categorías:', err);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const fetchCategoryProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      if(isMobile) setIsSidebarOpen(false);

      const response = await apiClient.get(`/categories/${slug}/products`);
      
      setCategoryName(response.data.categoryName || slug);
      setAllProducts(response.data.products);
      setProducts(response.data.products);

    } catch (err) {
      setError('No se pudieron cargar los productos de esta categoría.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allProducts];

    if (filters.search) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.description?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.status) {
      filtered = filtered.filter(product => product.status === filters.status);
    }

    setProducts(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (allProducts.length > 0) {
      applyFilters();
    }
  }, [filters, allProducts]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (slug) {
      fetchCategoryProducts();
    }
  }, [slug]);

  const currentCategory = categories.find(cat => cat.slug === slug);

  // --- LÓGICA DE ESTILOS RESPONSIVE ---

  const layoutStyle = isMobile 
    ? { ...styles.layout, flexDirection: 'column' }
    : styles.layout;

  // Ajuste del padding del contenedor de filtros en móvil para que no se vea tan apretado
  const filtersSectionStyle = isMobile ? {
    ...styles.filtersSection,
    padding: '24px', // Menos padding en móvil
    gap: '16px'
  } : styles.filtersSection;

  const sidebarStyle = isMobile ? {
    ...styles.sidebar,
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    width: '80%',
    maxWidth: '320px',
    zIndex: 100,
    transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
    borderRadius: '0 28px 28px 0',
    boxShadow: '10px 0 50px rgba(0,0,0,0.5)',
  } : styles.sidebar;

  const gridStyle = isMobile ? {
    ...styles.grid,
    gridTemplateColumns: 'repeat(2, 1fr)', 
    gap: '12px' 
  } : styles.grid;

  if (categoriesLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.backgroundDecoration} />
        <div style={styles.loading}>
          <div style={styles.loadingSpinner} />
          <p style={styles.loadingText}>Cargando categorías...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.backgroundDecoration} />
      
      <div style={layoutStyle}>
        
        {/* Botón de Menú Móvil */}
        {isMobile && (
          <div style={{ width: '100%' }}>
            <button 
              onClick={() => setIsSidebarOpen(true)}
              style={styles.menuButton}
            >
              <FiMenu size={24} />
              <span>Explorar Categorías</span>
            </button>
          </div>
        )}

        {/* Backdrop */}
        {isMobile && isSidebarOpen && (
          <div 
            style={styles.backdrop} 
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside style={sidebarStyle}>
          <div style={styles.sidebarHeader}>
            <div>
              <h3 style={styles.sidebarTitle}>
                <FiGrid size={24} />
                Categorías
              </h3>
              <p style={styles.sidebarSubtitle}>
                Selección exclusiva
              </p>
            </div>
            {isMobile && (
              <FiX 
                size={24} 
                color="white" 
                style={{ cursor: 'pointer' }} 
                onClick={() => setIsSidebarOpen(false)} 
              />
            )}
          </div>
          <ul style={styles.sidebarList}>
            {categories.map((category) => (
              <li key={category.id} style={styles.sidebarItem}>
                <Link 
                  to={`/categoria/${category.slug}`}
                  style={{
                    ...styles.sidebarLink,
                    ...(currentCategory?.id === category.id ? styles.sidebarLinkActive : {}),
                    ...(hoverStates[`category-${category.id}`] && styles.sidebarLinkHover)
                  }}
                  onMouseEnter={() => handleHover(`category-${category.id}`, true)}
                  onMouseLeave={() => handleHover(`category-${category.id}`, false)}
                  onClick={() => isMobile && setIsSidebarOpen(false)}
                >
                  <div style={{
                    ...styles.sidebarLinkGlow,
                    ...(hoverStates[`category-${category.id}`] ? styles.sidebarLinkGlowHover : {})
                  }} />
                  <FiFolder size={18} />
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Contenido Principal */}
        <main style={styles.mainContent}>
          {loading ? (
            <div style={styles.loading}>
              <div style={styles.loadingSpinner} />
              <p style={styles.loadingText}>Cargando productos...</p>
            </div>
          ) : error ? (
            <div style={styles.error}>
              <FiXCircle size={24} />
              {error}
            </div>
          ) : (
            <>
              {/* Header */}
              <div style={styles.headerSection}>
                <h1 style={styles.header}>
                  <FiFolder size={36} />
                  {categoryName}
                </h1>
                <p style={styles.subtitle}>
                  Descubre nuestra selección exclusiva de productos en esta categoría
                </p>
                <div style={styles.count}>
                  <FiList size={16} />
                  Mostrando {products.length} de {allProducts.length} {products.length === 1 ? 'producto' : 'productos'}
                </div>
              </div>

              {/* Filtros */}
              <div style={filtersSectionStyle}>
                <div style={styles.searchContainer}>
                  <div style={styles.searchIcon}>
                    <FiSearch size={20} />
                  </div>
                  <input
                    type="text"
                    name="search"
                    placeholder="Buscar productos..."
                    value={filters.search}
                    onChange={handleFilterChange}
                    style={{
                      ...styles.searchInput,
                      ...(focusedField === 'search' && styles.searchInputFocus)
                    }}
                    onFocus={() => handleFocus('search')}
                    onBlur={handleBlur}
                  />
                </div>
                
                <select 
                  name="status" 
                  value={filters.status} 
                  onChange={handleFilterChange} 
                  style={{
                    ...styles.statusFilter,
                    ...(focusedField === 'status' && styles.statusFilterFocus)
                  }}
                  onFocus={() => handleFocus('status')}
                  onBlur={handleBlur}
                >
                  <option value="">Todos los estados</option>
                  <option value="en stock">En stock</option>
                  <option value="activacion">Activación</option>
                  <option value="a pedido">A pedido</option>
                  <option value="agotado">Agotados</option>
                </select>
                
                <button 
                  onClick={applyFilters} 
                  style={{
                    ...styles.filterBtn,
                    ...(hoverStates.filterBtn && styles.filterBtnHover)
                  }}
                  onMouseEnter={() => handleHover('filterBtn', true)}
                  onMouseLeave={() => handleHover('filterBtn', false)}
                >
                  <div style={{
                    ...styles.buttonGlow,
                    ...(hoverStates.filterBtn ? styles.buttonGlowHover : {})
                  }} />
                  <FiFilter size={18} />
                  Filtrar
                </button>
              </div>
              
              {/* Grid de Productos */}
              <div style={gridStyle}>
                {products.length > 0 ? (
                  products.map(prod => (
                    <ProductCard product={prod} key={prod.id} />
                  ))
                ) : (
                  <div style={styles.noProducts}>
                    <FiPackage size={48} color="#667eea" />
                    <p>No hay productos que coincidan con los filtros en esta categoría.</p>
                    <Link 
                      to="/"
                      style={{
                        ...styles.homeLink,
                        ...(hoverStates.homeLink && styles.homeLinkHover)
                      }}
                      onMouseEnter={() => handleHover('homeLink', true)}
                      onMouseLeave={() => handleHover('homeLink', false)}
                    >
                      <div style={{
                        ...styles.homeLinkGlow,
                        ...(hoverStates.homeLink ? styles.homeLinkGlowHover : {})
                      }} />
                      <FiHome size={18} />
                      Volver al Inicio
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default CategoryPage;