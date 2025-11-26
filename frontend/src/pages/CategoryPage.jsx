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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { slug } = useParams();

  // Responsive
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleHover = (key, val) => setHoverStates(p => ({ ...p, [key]: val }));

  // API
  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const res = await apiClient.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const fetchCategoryProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      if (isMobile) setIsSidebarOpen(false);

      const res = await apiClient.get(`/categories/${slug}/products`);
      setCategoryName(res.data.categoryName || slug.charAt(0).toUpperCase() + slug.slice(1));
      setAllProducts(res.data.products);
      setProducts(res.data.products);
    } catch (err) {
      setError('No se pudieron cargar los productos de esta categoría.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allProducts];
    if (filters.search) {
      const term = filters.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(term) || 
        (p.description && p.description.toLowerCase().includes(term))
      );
    };
    
    if (filters.status) filtered = filtered.filter(p => p.status === filters.status);
    setProducts(filtered);
  };

  useEffect(() => { if (allProducts.length) applyFilters(); }, [filters, allProducts]);
  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => { if (slug) fetchCategoryProducts(); }, [slug]);

  const currentCategory = categories.find(c => c.slug === slug);

  // Estilos responsive
  const containerStyle = {
    padding: isMobile ? '20px 16px' : '40px 24px',
    fontFamily: "'Inter', sans-serif",
    background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 50%, #0f0f0f 100%)',
    minHeight: '100vh',
    position: 'relative',
    overflowX: 'hidden'
  };

  const layoutStyle = isMobile 
    ? { display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1400px', margin: '0 auto' }
    : { display: 'flex', gap: '32px', maxWidth: '1400px', margin: '0 auto' };

  const gridStyle = isMobile
    ? { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' }
    : { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' };

  const sidebarStyle = isMobile ? {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '85%',
    maxWidth: '320px',
    height: '100vh', // Corrección warning: Se eliminó el duplicado
    background: 'rgba(15, 15, 20, 0.98)',
    backdropFilter: 'blur(30px)',
    WebkitBackdropFilter: 'blur(30px)',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
    animation: isSidebarOpen ? 'slideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards' : 'slideOut 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
    transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    borderRadius: '0 32px 32px 0',
    boxShadow: '20px 0 60px rgba(0, 0, 0, 0.8)',
    borderRight: '1px solid rgba(102, 126, 234, 0.2)'
  } : {
    width: '280px',
    background: 'rgba(25, 25, 25, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '28px',
    border: '1px solid rgba(255,255,255,0.1)',
    position: 'sticky',
    top: '2rem',
    height: 'fit-content',
    maxHeight: 'calc(100vh - 4rem)',
    display: 'flex',
    flexDirection: 'column'
  };

  if (categoriesLoading) {
    return (
      <div style={containerStyle}>
        <div style={{textAlign:'center', padding:'120px 20px', color:'#b0b0b0'}}>
          <div style={{width:'60px',height:'60px',border:'4px solid rgba(255,255,255,0.1)',borderTopColor:'#667eea',borderRadius:'50%',animation:'spin 1s linear infinite',margin:'0 auto 24px'}}></div>
          <p style={{fontSize:'1.2rem'}}>Cargando categorías...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Fondo decorativo */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(102,126,234,0.15) 0%, transparent 70%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      {/* BACKDROP PREMIUM - Corrección Warning Vite */}
      {isMobile && isSidebarOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh', // Aquí estaba el error duplicado, corregido.
            backgroundColor: 'rgba(0, 0, 0, 0.88)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            zIndex: 999,
            animation: 'fadeIn 0.4s ease-out forwards',
            cursor: 'pointer'
          }}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div style={layoutStyle}>

        {/* Botón hamburguesa móvil */}
        {isMobile && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            style={{
              padding: '14px 18px',
              background: 'rgba(30,30,30,0.9)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '14px',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '16px',
              backdropFilter: 'blur(10px)'
            }}
          >
            <FiMenu size={26} />
            Categorías
          </button>
        )}

        {/* SIDEBAR */}
        <aside style={sidebarStyle}>
          <div style={{
            padding: '24px 24px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexShrink: 0
          }}>
            <div>
              <h3 style={{fontSize:'1.5rem',fontWeight:'700',color:'#fff',margin:'0 0 8px',display:'flex',alignItems:'center',gap:'12px'}}>
                <FiGrid size={24} />
                Categorías
              </h3>
              <p style={{fontSize:'0.9rem',color:'#a0a0a0',margin:0}}>Selección exclusiva</p>
            </div>
            {isMobile && <FiX size={30} style={{cursor:'pointer', color:'#fff'}} onClick={() => setIsSidebarOpen(false)} />}
          </div>

          {/* Lista scrolleable con ANIMACIÓN EN CATEGORÍAS */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '8px 16px 140px',
            WebkitOverflowScrolling: 'touch'
          }}>
            <ul style={{listStyle:'none',padding:0,margin:'16px 0 0'}}>
              {categories.map((cat, index) => (
                <li 
                  key={cat.id} 
                  style={{
                    margin:'6px 0',
                    opacity: 0,
                    animation: 'slideInRight 0.5s ease-out forwards',
                    animationDelay: `${index * 0.08}s`
                  }}
                >
                  <Link
                    to={`/categoria/${cat.slug}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '16px 20px',
                      borderRadius: '16px',
                      color: currentCategory?.id === cat.id ? '#667eea' : '#b0b0b0',
                      fontWeight: currentCategory?.id === cat.id ? '600' : '500',
                      backgroundColor: currentCategory?.id === cat.id ? 'rgba(102,126,234,0.1)' : 'transparent',
                      border: currentCategory?.id === cat.id ? '1px solid rgba(102,126,234,0.3)' : '1px solid transparent',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={() => handleHover(`cat-${cat.id}`, true)}
                    onMouseLeave={() => handleHover(`cat-${cat.id}`, false)}
                    onClick={() => isMobile && setIsSidebarOpen(false)}
                  >
                    <FiFolder size={18} />
                    {cat.name}
                    {hoverStates[`cat-${cat.id}`] && (
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(102,126,234,0.2), transparent)',
                        animation: 'shine 0.6s ease-out'
                      }} />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* CONTENIDO PRINCIPAL */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {loading ? (
            <div style={{textAlign:'center',padding:'100px 20px'}}>
              <div style={{width:'60px',height:'60px',border:'4px solid rgba(255,255,255,0.1)',borderTopColor:'#667eea',borderRadius:'50%',animation:'spin 1s linear infinite',margin:'0 auto 24px'}}></div>
              <p style={{color:'#b0b0b0',fontSize:'1.2rem'}}>Cargando productos...</p>
            </div>
          ) : error ? (
            <div style={{padding:'32px',background:'rgba(239,68,68,0.2)',border:'1px solid rgba(239,68,68,0.4)',borderRadius:'20px',color:'#ef4444',textAlign:'center'}}>
              <FiXCircle size={40} style={{marginBottom:'16px'}} />
              <p>{error}</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div style={{
                background: 'rgba(25,25,25,0.8)',
                backdropFilter: 'blur(20px)',
                borderRadius: '28px',
                padding: isMobile ? '24px' : '32px',
                border: '1px solid rgba(255,255,255,0.1)',
                marginBottom: '32px'
              }}>
                <h1 style={{
                  fontSize: isMobile ? '2.4rem' : '3rem',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  margin: '0 0 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <FiFolder size={isMobile ? 36 : 44} />
                  {categoryName}
                </h1>
                <p style={{fontSize:'1.2rem',color:'#b0b0b0',margin:'0 0 16px'}}>Descubre nuestra selección exclusiva</p>
                <div style={{
                  display:'inline-flex',
                  alignItems:'center',
                  gap:'8px',
                  padding:'12px 20px',
                  background:'rgba(255,255,255,0.05)',
                  borderRadius:'12px',
                  border:'1px solid rgba(255,255,255,0.1)',
                  color:'#a0a0a0'
                }}>
                  <FiList size={16} />
                  {products.length} productos
                </div>
              </div>

              {/* Filtros CORREGIDOS CON GRID */}
              <div style={{
                background: 'rgba(25,25,25,0.8)',
                backdropFilter: 'blur(20px)',
                borderRadius: '28px',
                padding: isMobile ? '20px' : '32px',
                border: '1px solid rgba(255,255,255,0.1)',
                marginBottom: '32px',
                // CAMBIO CLAVE AQUÍ: Usar GRID en lugar de Flex
                display: 'grid',
                // En móvil: 1 columna. En escritorio: 3 columnas (Search toma el espacio restante, Select fijo, Botón fijo)
                gridTemplateColumns: isMobile ? '1fr' : '1fr 220px auto',
                gap: '16px',
                alignItems: 'center'
              }}>
                <div style={{position:'relative', width: '100%'}}>
                  <FiSearch size={20} style={{position:'absolute',left:'20px',top:'50%',transform:'translateY(-50%)',color:'#667eea'}} />
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={filters.search}
                    onChange={e => setFilters(p => ({...p, search: e.target.value}))}
                    style={{
                      width: '80%', // Asegura que ocupe su celda del grid
                      padding: '16px 20px 16px 52px',
                      border: '2px solid rgba(255,255,255,0.1)',
                      borderRadius: '16px',
                      background: 'rgba(30,30,30,0.8)',
                      color: '#fff',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'all 0.3s'
                    }}
                    onFocus={() => setFocusedField('search')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>

                <select
                  value={filters.status}
                  onChange={e => setFilters(p => ({...p, status: e.target.value}))}
                  style={{
                    width: '100%', // Asegura que ocupe su celda del grid
                    padding: '16px 20px',
                    border: '2px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    background: 'rgba(30,30,30,0.8)',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    appearance: 'none' // Limpia estilos nativos feos
                  }}
                >
                  <option value="">Todos los estados</option>
                  <option value="en stock">En stock</option>
                  <option value="activacion">Activación</option>
                  <option value="a pedido">A pedido</option>
                  <option value="agotado">Agotado</option>
                </select>

                <button
                  onClick={applyFilters}
                  style={{
                    width: isMobile ? '100%' : 'auto', // En móvil ocupa todo el ancho
                    padding: '16px 32px',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    boxShadow: '0 8px 25px rgba(102,126,234,0.4)'
                  }}
                >
                  <FiFilter size={18} />
                  Filtrar
                </button>
              </div>

              {/* Productos */}
              <div style={gridStyle}>
                {products.length > 0 ? (
                  products.map(p => <ProductCard key={p.id} product={p} />)
                ) : (
                  <div style={{
                    gridColumn: '1 / -1',
                    textAlign: 'center',
                    padding: '80px 20px',
                    background: 'rgba(25,25,25,0.8)',
                    borderRadius: '28px',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    <FiPackage size={64} color="#667eea" style={{marginBottom:'24px'}} />
                    <p style={{fontSize:'1.4rem',color:'#a0a0a0',marginBottom:'24px'}}>No hay productos en esta categoría</p>
                    <Link to="/" style={{
                      padding: '16px 32px',
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '16px',
                      fontWeight: '600',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      <FiHome size={18} />
                      Volver al inicio
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>

      {/* Animaciones */}
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        @keyframes slideOut {
          from { transform: translateX(0); }
          to { transform: translateX(-100%); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes shine {
          to { left: '100%'; }
        }
      `}</style>
    </div>
  );
};

export default CategoryPage;
