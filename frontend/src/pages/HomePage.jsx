import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '/src/services/apiClient.js';
import ProductCard from '/src/components/product/ProductCard.jsx';
import Carousel from '/src/components/ui/Carousel.jsx';
import CategoryCard from '/src/components/ui/CategoryCard.jsx';
import PaymentMethods from '/src/components/layout/PaymentMethods.jsx';
import { 
  FiTrendingUp, FiStar, FiGrid, FiRefreshCw, FiAlertTriangle, 
  FiArrowRight, FiShoppingBag, FiArrowUp 
} from 'react-icons/fi';

const styles = {
  container: {
    // Asegurar que el contenedor principal no genere scroll horizontal no deseado
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 50%, #0f0f0f 100%)',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: '#e0e0e0',
    position: 'relative',
    overflowX: 'hidden' // CLAVE: Previene el scroll horizontal global
  },
  backgroundDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'radial-gradient(circle at 20% 80%, rgba(102, 126, 234, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(118, 75, 162, 0.05) 0%, transparent 50%)',
    zIndex: 0
  },
  fullWidthSection: {
    width: '100%',
    position: 'relative',
    zIndex: 1,
    marginBottom: '40px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
  },
  content: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 16px 60px 16px', 
    position: 'relative',
    zIndex: 1
  },
  section: { marginBottom: '60px' },
  sectionHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  sectionTitle: {
    fontSize: '1.8rem', fontWeight: '800', color: '#ffffff', margin: 0, 
    display: 'flex', alignItems: 'center', gap: '12px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
  },
  sectionSubtitle: {
    fontSize: '1rem', color: '#b0b0b0', margin: '4px 0 0 0', fontWeight: '400', maxWidth: '600px'
  },
  viewAllButton: {
    display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
    background: 'rgba(102, 126, 234, 0.1)', border: '1px solid rgba(102, 126, 234, 0.3)',
    borderRadius: '12px', color: '#667eea', textDecoration: 'none', fontWeight: '600',
    fontSize: '0.9rem', transition: 'all 0.3s ease', backdropFilter: 'blur(20px)',
    position: 'relative', overflow: 'hidden'
  },
  viewAllButtonHover: {
    background: 'rgba(102, 126, 234, 0.2)', transform: 'translateY(-2px)', boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
  },
  buttonGlow: {
    position: 'absolute', top: 0, left: '-100%', width: '100%', height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)', transition: 'left 0.5s ease'
  },
  buttonGlowHover: { left: '100%' },
  loadingContainer: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', gap: '24px', position: 'relative', zIndex: 1
  },
  loadingSpinner: {
    width: '48px', height: '48px', border: '3px solid rgba(255, 255, 255, 0.1)',
    borderTop: '3px solid #667eea', borderRadius: '50%', animation: 'spin 1s linear infinite'
  },
  loadingText: { fontSize: '1.1rem', color: '#a0a0a0', fontWeight: '500' },
  errorContainer: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    minHeight: '300px', padding: '40px', textAlign: 'center', background: 'rgba(25, 25, 25, 0.8)',
    backdropFilter: 'blur(20px)', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)', color: '#e0e0e0', position: 'relative', zIndex: 1
  },
  errorIcon: { marginBottom: '20px', color: '#ff6b6b' },
  errorTitle: { fontSize: '1.5rem', fontWeight: '700', color: '#ffffff', margin: '0 0 12px 0' },
  errorText: { fontSize: '1rem', color: '#a0a0a0', margin: '0 0 24px 0', lineHeight: '1.5' },
  retryButton: {
    padding: '14px 28px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: '600',
    cursor: 'pointer', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', gap: '8px',
    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)', position: 'relative', overflow: 'hidden'
  },
  retryButtonHover: { transform: 'translateY(-2px)', boxShadow: '0 12px 30px rgba(102, 126, 234, 0.4)' },
  pulseAnimation: { animation: 'pulse 2s infinite' },
  floatingButtons: { position: 'fixed', right: '24px', bottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px', zIndex: 1000 },
  floatingButton: {
    width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)', border: 'none',
    fontSize: '24px', color: 'white', position: 'relative', overflow: 'hidden'
  },
  whatsappButton: { background: '#25D366', position: 'relative' },
  scrollToTopButton: { opacity: 0, transform: 'translateY(20px)', transition: 'all 0.3s ease', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }, 
  scrollToTopButtonVisible: { opacity: 1, transform: 'translateY(0)' },
  buttonHover: { transform: 'translateY(-3px)', boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)' },
  floatingButtonGlow: {
    position: 'absolute', top: 0, left: '-100%', width: '100%', height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)', transition: 'left 0.5s ease'
  },
  floatingButtonGlowHover: { left: '100%' },
  whatsappIcon: { width: '28px', height: '28px', fill: 'white' }
};

const WhatsAppIcon = () => (
  <svg style={styles.whatsappIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893c0-3.18-1.24-6.169-3.495-8.418"/>
  </svg>
);

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoverStates, setHoverStates] = useState({});
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) setShowScrollToTop(true);
      else setShowScrollToTop(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [categoriesResponse, productsResponse] = await Promise.all([
        apiClient.get('/categories'),
        apiClient.get('/products')
      ]);
      setCategories(categoriesResponse.data);
      setProducts(productsResponse.data);
    } catch (err) {
      setError('No se pudieron cargar los datos de la página. Por favor, intenta nuevamente.');
      console.error('Error fetching home data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHomeData(); }, []);

  const handleHover = (element, isHovering) => {
    setHoverStates(prev => ({ ...prev, [element]: isHovering }));
  };

  const openWhatsApp = () => {
    const phoneNumber = '+51940990278';
    const message = 'Hola, me interesa obtener más información sobre sus productos.';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.backgroundDecoration} />
        <div style={styles.content}>
          <div style={styles.loadingContainer}>
            <div style={{ ...styles.loadingSpinner, ...styles.pulseAnimation }} />
            <h3 style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>Cargando contenido</h3>
            <p style={styles.loadingText}>Preparando la mejor experiencia para ti...</p>
          </div>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.backgroundDecoration} />
        <div style={styles.content}>
          <div style={styles.errorContainer}>
            <div style={styles.errorIcon}><FiAlertTriangle size={48} /></div>
            <h2 style={styles.errorTitle}>Error de conexión</h2>
            <p style={styles.errorText}>{error}</p>
            <button
              style={{ ...styles.retryButton, ...(hoverStates.retryButton && styles.retryButtonHover) }}
              onClick={fetchHomeData}
              onMouseEnter={() => handleHover('retryButton', true)}
              onMouseLeave={() => handleHover('retryButton', false)}
            >
              <div style={{ ...styles.buttonGlow, ...(hoverStates.retryButton && styles.buttonGlowHover) }} />
              <FiRefreshCw size={18} /> Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.backgroundDecoration} />
      
      {/* --- SECCIÓN CARRUSEL --- */}
      <div style={styles.fullWidthSection}>
        <Carousel />
      </div>
      
      {/* Botones Flotantes */}
      <div style={styles.floatingButtons}>
        <button
          style={{ ...styles.floatingButton, ...styles.whatsappButton, ...(hoverStates.whatsappButton && styles.buttonHover) }}
          onClick={openWhatsApp}
          onMouseEnter={() => handleHover('whatsappButton', true)}
          onMouseLeave={() => handleHover('whatsappButton', false)}
          aria-label="Contactar por WhatsApp"
        >
          <div style={{ ...styles.floatingButtonGlow, ...(hoverStates.whatsappButton && styles.floatingButtonGlowHover) }} />
          <WhatsAppIcon />
        </button>
        <button
          style={{ ...styles.floatingButton, ...styles.scrollToTopButton, ...(showScrollToTop && styles.scrollToTopButtonVisible), ...(hoverStates.scrollToTopButton && styles.buttonHover) }}
          onClick={scrollToTop}
          onMouseEnter={() => handleHover('scrollToTopButton', true)}
          onMouseLeave={() => handleHover('scrollToTopButton', false)}
          aria-label="Ir al inicio de la página"
        >
          <div style={{ ...styles.floatingButtonGlow, ...(hoverStates.scrollToTopButton && styles.floatingButtonGlowHover) }} />
          <FiArrowUp />
        </button>
      </div>
      
      {/* --- CONTENIDO --- */}
      <div style={styles.content}>

        {/* Sección Categorías */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}><FiGrid size={32} /> Categorías</h2>
              <p style={styles.sectionSubtitle}>Encuentra lo que necesitas</p>
            </div>
            
          </div>
          
          <div className="custom-grid">
            {categories.length > 0 ? (
              categories.map(cat => <CategoryCard category={cat} key={cat.id} />)
            ) : (
              <div style={styles.errorContainer}>
                <FiGrid size={48} color="#667eea" />
                <h3 style={styles.errorTitle}>No hay categorías</h3>
                <p style={styles.errorText}>Estamos trabajando para agregar nuevas categorías.</p>
              </div>
            )}
          </div>
        </section>

        {/* Sección Productos Destacados */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}><FiStar size={32} /> Destacados</h2>
              <p style={styles.sectionSubtitle}>Lo mejor valorado por nuestros clientes</p>
            </div>
            
          </div>
          
          <div className="custom-grid">
            {products.length > 0 ? (
              products.map(prod => <ProductCard product={prod} key={prod.id} />)
            ) : (
              <div style={styles.errorContainer}>
                <FiShoppingBag size={48} color="#667eea" />
                <h3 style={styles.errorTitle}>No hay productos</h3>
                <p style={styles.errorText}>Pronto tendremos nuevos productos.</p>
              </div>
            )}
          </div>
        </section>

        {/* Sección Productos en Tendencia */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}><FiTrendingUp size={32} /> Tendencias</h2>
              <p style={styles.sectionSubtitle}>Lo más popular de la semana</p>
            </div>
            
          </div>
          
          <div className="custom-grid">
            {products.length > 0 ? (
              products.slice(0, 4).map(prod => <ProductCard product={prod} key={prod.id} />)
            ) : (
              <div style={styles.errorContainer}>
                <FiTrendingUp size={48} color="#667eea" />
                <h3 style={styles.errorTitle}>No hay tendencias</h3>
                <p style={styles.errorText}>Vuelve pronto.</p>
              </div>
            )}
          </div>
        </section>

        {/* Sección Medios de Pago */}
        <section style={styles.section}>
          <PaymentMethods />
        </section>

      </div>
      
      {/* 💥 SOLUCIÓN FINAL CSS (1 Columna Centrada y con ancho limitado en móvil) 💥 */}
      <style>{`
        /* Animaciones */
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
        
        /* Asegurar que el BODY/HTML no tenga scroll horizontal */
        body, html {
            overflow-x: hidden !important;
            width: 100%;
        }

        /* GRID POR DEFECTO (Escritorio/Tablet GRANDE) */
        .custom-grid {
          display: grid;
          gap: 20px;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        }
        
        /* MÓVIL (Pantallas hasta 768px): 1 COLUMNA COMPACTA */
        @media (max-width: 768px) {
          
          /* 1. CONTENEDOR DE LA GRILLA: FORZAR 1 COLUMNA */
          .custom-grid {
            grid-template-columns: 1fr !important; 
            gap: 20px !important; 
          }
          
          /* 2. HIJOS DE LA GRILLA (LAS TARJETAS): LIMITAR ANCHO Y CENTRAR */
          .custom-grid > a, .custom-grid > div {
             /* 💥 CAMBIO CLAVE: Limitar el ancho de la tarjeta para que no ocupe 100% */
             max-width: 350px !important; 
             width: 90% !important; /* Ocupa el 90% del espacio, permitiendo margen */
             min-width: unset !important;
             box-sizing: border-box !important;
             margin: 0 auto 20px auto !important; /* Centrar la tarjeta y añadir margen inferior */
             padding: 0 !important;
          }
          
          /* 3. AJUSTE PARA EL ENCABEZADO DE LA SECCIÓN (Mejora la visualización vertical) */
          div[style*="sectionHeader"] {
              flex-direction: column;
              align-items: flex-start;
          }
          /* El botón "Ver todas" se pone debajo y ocupa todo el ancho */
          .view-all-button { 
              margin-top: 10px;
              width: 100%;
              justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
