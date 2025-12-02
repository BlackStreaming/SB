import React, { useState, useEffect, useMemo, useRef, useCallback, Suspense } from 'react';
// import { Link } from 'react-router-dom'; // No se usa en este componente
import apiClient from '/src/services/apiClient.js';
import ProductCard from '/src/components/product/ProductCard.jsx';
// import Carousel from '/src/components/ui/Carousel.jsx'; // <-- ELIMINADO IMPORT DIRECTO
import CategoryCard from '/src/components/ui/CategoryCard.jsx';
import PaymentMethods from '/src/components/layout/PaymentMethods.jsx';
import ChatBot from '/src/components/ui/ChatBot.jsx'; 
import { 
  FiTrendingUp, FiStar, FiGrid, FiRefreshCw, FiAlertTriangle, 
  FiArrowUp
} from 'react-icons/fi';

// --- OPTIMIZACIÓN CRÍTICA: Lazy Load del Carrusel ---
// Esto evita que el carrusel pesado bloquee la carga inicial (mejora LCP)
const Carousel = React.lazy(() => import('/src/components/ui/Carousel.jsx'));

// --- ESTILOS ESTÁTICOS ---
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0c0c0c',
    // OPTIMIZACIÓN: Gradiente lineal es más rápido de renderizar que el radial
    backgroundImage: 'linear-gradient(180deg, #1a1a1a 0%, #0c0c0c 100%)',
    fontFamily: "'Inter', sans-serif",
    color: '#e0e0e0',
    position: 'relative',
    overflowX: 'hidden' 
  },
  carouselContainer: {
    width: '100%',
    position: 'relative',
    marginBottom: '30px',
    // OPTIMIZACIÓN: Sombra menos compleja para mejorar rendimiento de renderizado
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)', 
    display: 'flex',
    // Importante mantener una altura mínima para evitar saltos de diseño (CLS)
    minHeight: '220px', 
  },
  // Placeholder mientras carga el carrusel lazy
  carouselPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#151515',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#333',
    borderRadius: '0 0 12px 12px'
  },
  content: {
    maxWidth: '1600px',
    margin: '0 auto',
    // Ajustado padding inferior para que no choque con botones flotantes en móvil
    padding: '0 20px 80px 20px',
    position: 'relative',
    zIndex: 1
  },
  section: {
    marginBottom: '50px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
    paddingBottom: '10px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  sectionTitle: {
    fontSize: '1.6rem',
    fontWeight: '800',
    color: '#ffffff',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  sectionSubtitle: {
    fontSize: '0.95rem',
    color: '#888',
    margin: '4px 0 0 0',
    fontWeight: '400'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    gap: '20px'
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(255, 255, 255, 0.1)',
    borderTop: '3px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    textAlign: 'center',
    background: '#151515',
    borderRadius: '16px',
    border: '1px solid #333',
    color: '#e0e0e0'
  },
  retryButton: {
    padding: '10px 24px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '15px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  floatingButtons: {
    position: 'fixed',
    right: '20px',
    bottom: '20px',
    zIndex: 999,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '15px',
    pointerEvents: 'none'
  },
  chatWrapper: {
    position: 'relative',
    pointerEvents: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    // RESPONSIVE FIX: Asegura que el contenedor no exceda el ancho de pantalla
    maxWidth: 'calc(100vw - 40px)' 
  },
  chatHintBubble: {
    marginBottom: '10px',
    backgroundColor: '#ffffff',
    color: '#000',
    padding: '8px 16px',
    borderRadius: '12px 12px 0 12px',
    fontSize: '0.9rem',
    fontWeight: '600',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    // RESPONSIVE FIX: Permitir que el texto se envuelva en pantallas pequeñas
    whiteSpace: 'normal', 
    textAlign: 'right',
    position: 'relative',
    display: 'none',
    // RESPONSIVE FIX: Ancho máximo para evitar cortes
    maxWidth: '260px' 
  },
  chatHintVisible: {
    display: 'block'
  },
  scrollToTopButton: {
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    display: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: 'none',
    fontSize: '20px',
    color: 'white',
    background: '#667eea',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    pointerEvents: 'auto' 
  },
  scrollToTopButtonVisible: {
    display: 'flex'
  },
};

// --- CSS GLOBAL OPTIMIZADO ---
const globalCss = `
  body, html {
    overflow-x: hidden !important;
    width: 100%;
    background-color: #0c0c0c;
    /* OPTIMIZACIÓN: Scroll suave nativo si el navegador lo soporta */
    scroll-behavior: smooth; 
  }
  @keyframes spin { 
    0% { transform: rotate(0deg); } 
    100% { transform: rotate(360deg); } 
  }

  /* FIX CARRUSEL RESPONSIVE */
  /* Ajustamos la altura mínima para móvil y desktop */
  .carousel-responsive-height {
    min-height: 220px; /* Móvil */
  }
  @media (min-width: 768px) {
    .carousel-responsive-height {
      min-height: 480px !important; /* Desktop */
    }
  }

  /* CATEGORÍAS - GRID RESPONSIVO */
  .category-grid {
    display: grid;
    width: 100%;
    /* Base móvil: 2 columnas */
    grid-template-columns: repeat(2, 1fr);
    gap: 15px; 
    grid-auto-rows: auto;
  }

  .category-grid > div, 
  .category-grid > a {
    width: 100%;
    height: auto;
    min-height: 100%;
    display: flex;
    flex-direction: column;
  }

  /* Breakpoints progresivos para categorías */
  @media (min-width: 500px) { .category-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (min-width: 768px) { .category-grid { grid-template-columns: repeat(4, 1fr); gap: 20px; } }
  @media (min-width: 1024px) { .category-grid { grid-template-columns: repeat(5, 1fr); } }
  @media (min-width: 1280px) { .category-grid { grid-template-columns: repeat(6, 1fr); } }
  @media (min-width: 1600px) { .category-grid { grid-template-columns: repeat(8, 1fr); } }

  /* PRODUCTOS - GRID RESPONSIVO */
  .product-grid {
    display: grid;
    gap: 20px;
    /* Base móvil: 1 columna para dar espacio a las tarjetas */
    grid-template-columns: repeat(1, 1fr);
    justify-items: stretch;
  }
  
  .product-grid > div, 
  .product-grid > a {
    width: 100%;
    height: 100%;
  }

  /* Breakpoints progresivos para productos */
  @media (min-width: 480px) { .product-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (min-width: 768px) { .product-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (min-width: 1024px) { .product-grid { grid-template-columns: repeat(4, 1fr); } }
  @media (min-width: 1400px) { .product-grid { grid-template-columns: repeat(5, 1fr); } }

  /* ESTILOS DE TARJETAS SIN ANIMACIONES PESADAS */
  .force-no-border > * {
    border-color: rgba(255, 255, 255, 0.1) !important;
    /* Transición solo en color de borde, muy ligera */
    transition: border-color 0.2s ease !important;
  }
  
  .force-no-border > *:hover,
  .force-no-border > a:hover,
  .force-no-border > div:hover {
    border-color: #667eea !important;
    /* Eliminado transform translateY para evitar repaints */
  }

  /* Ajuste de tamaño de fuente para títulos en móviles muy pequeños */
  @media (max-width: 400px) {
    div[style*="sectionTitle"] { font-size: 1.3rem !important; }
  }
`;

// Componente para carga diferida de secciones (Intersection Observer)
const LazySection = ({ children, rootMargin = '200px 0px' }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [rootMargin]);

  // Usa un placeholder de altura fija para evitar CLS mientras carga
  return (
    <div ref={ref} style={{ minHeight: isVisible ? 'auto' : '200px' }}>
      {isVisible ? children : null}
    </div>
  );
};

const HomePage = () => {
  const [data, setData] = useState({ categories: [], products: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [showChatHint, setShowChatHint] = useState(false);

  // Optimización Scroll: UseCallback y chequeo de estado previo
  const handleScroll = useCallback(() => {
    const shouldShow = window.scrollY > 400;
    setShowScrollToTop(prev => (prev !== shouldShow ? shouldShow : prev));
  }, []);

  useEffect(() => {
    // Throttle usando requestAnimationFrame para no sobrecargar el evento scroll
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [handleScroll]);

  useEffect(() => {
    const timer = setTimeout(() => setShowChatHint(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [cats, prods] = await Promise.all([
        apiClient.get('/categories'),
        apiClient.get('/products')
      ]);
      setData({ categories: cats.data, products: prods.data });
    } catch (err) {
      setError('Error al cargar contenido.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Memoizar datos derivados
  const featuredProducts = useMemo(() => data.products.slice(0, 12), [data.products]);
  const trendingProducts = useMemo(() => data.products.slice(0, 6), [data.products]);

  // Inyectar estilos globales
  const StyleInjector = () => <style>{globalCss}</style>;

  if (loading) {
    return (
      <div style={styles.container}>
        <StyleInjector />
        <div style={styles.content}>
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner} />
            <p style={{ color: '#888', marginTop: '1rem' }}>Cargando catálogo...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <StyleInjector />
        <div style={styles.content}>
          <div style={styles.errorContainer}>
            <FiAlertTriangle size={40} color="#ff6b6b" />
            <h3 style={{ margin: '1rem 0' }}>Ocurrió un error</h3>
            <button style={styles.retryButton} onClick={fetchHomeData}>
              <FiRefreshCw /> Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <StyleInjector />

      {/* CARRUSEL CON LAZY LOADING (Mejora LCP) */}
      <div style={styles.carouselContainer} className="carousel-responsive-height">
        <Suspense fallback={<div style={styles.carouselPlaceholder}>Cargando destacados...</div>}>
          <Carousel />
        </Suspense>
      </div>

      {/* BOTONES FLOTANTES */}
      <div style={styles.floatingButtons}>
        {/* ChatBot y Burbuja (Responsive Fix aplicado en styles) */}
        <div style={styles.chatWrapper}>
          <div style={{
            ...styles.chatHintBubble,
            ...(showChatHint ? styles.chatHintVisible : {})
          }}>
            Hola, ¿en qué puedo ayudarte? 👋
          </div>
          <ChatBot />
        </div>

        {/* Botón Subir */}
        <button
          style={{
            ...styles.scrollToTopButton,
            ...(showScrollToTop ? styles.scrollToTopButtonVisible : {})
          }}
          onClick={scrollToTop}
          aria-label="Subir al inicio"
        >
          <FiArrowUp />
        </button>
      </div>

      <div style={styles.content}>
        {/* CATEGORÍAS */}
        <LazySection>
          <section style={styles.section}>
            <div style={styles.sectionHeader}>
              <div>
                <h2 style={styles.sectionTitle}>
                  <FiGrid size={24} color="#667eea" /> Categorías
                </h2>
                <p style={styles.sectionSubtitle}>Explora nuestro catálogo</p>
              </div>
            </div>

            <div className="category-grid">
              {data.categories.map(cat => (
                <CategoryCard category={cat} key={cat.id} />
              ))}
            </div>
          </section>
        </LazySection>

        {/* DESTACADOS */}
        <LazySection>
          <section style={styles.section}>
            <div style={styles.sectionHeader}>
              <div>
                <h2 style={styles.sectionTitle}>
                  <FiStar size={24} color="#ffd700" /> Destacados
                </h2>
                <p style={styles.sectionSubtitle}>Lo mejor valorado</p>
              </div>
            </div>

            <div className="product-grid force-no-border">
              {featuredProducts.map(prod => (
                <ProductCard product={prod} key={prod.id} />
              ))}
            </div>
          </section>
        </LazySection>

        {/* TENDENCIAS */}
        <LazySection>
          <section style={styles.section}>
            <div style={styles.sectionHeader}>
              <div>
                <h2 style={styles.sectionTitle}>
                  <FiTrendingUp size={24} color="#ff6b6b" /> Tendencias
                </h2>
              </div>
            </div>

            <div className="product-grid force-no-border">
              {trendingProducts.map(prod => (
                <ProductCard product={prod} key={prod.id} />
              ))}
            </div>
          </section>
        </LazySection>

        {/* MÉTODOS DE PAGO */}
        <LazySection rootMargin="0px 0px 100px 0px">
          <section style={styles.section}>
            <PaymentMethods />
          </section>
        </LazySection>
      </div>
    </div>
  );
};

// Memoizar el componente completo para evitar re-renders si el padre cambia
export default React.memo(HomePage);
