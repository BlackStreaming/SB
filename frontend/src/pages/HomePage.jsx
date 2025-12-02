import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '/src/services/apiClient.js';
import ProductCard from '/src/components/product/ProductCard.jsx';
import Carousel from '/src/components/ui/Carousel.jsx';
import CategoryCard from '/src/components/ui/CategoryCard.jsx';
import PaymentMethods from '/src/components/layout/PaymentMethods.jsx';
import ChatBot from '/src/components/ui/ChatBot.jsx'; 
import { 
  FiTrendingUp, FiStar, FiGrid, FiRefreshCw, FiAlertTriangle, 
  FiArrowUp
} from 'react-icons/fi';

// --- ESTILOS ESTÁTICOS (Fuera del componente para evitar re-renderizados) ---
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0c0c0c',
    backgroundImage: 'radial-gradient(circle at 50% 0%, #1a1a1a 0%, #0c0c0c 70%)',
    fontFamily: "'Inter', sans-serif",
    color: '#e0e0e0',
    position: 'relative',
    overflowX: 'hidden'
  },
  carouselContainer: {
    width: '100%',
    position: 'relative',
    marginBottom: '30px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
    display: 'flex',
    minHeight: '220px', 
    contentVisibility: 'auto', // Optimización moderna
  },
  content: {
    maxWidth: '1600px',
    margin: '0 auto',
    padding: '0 20px 60px 20px',
    position: 'relative',
    zIndex: 1
  },
  section: {
    marginBottom: '50px',
    contentVisibility: 'auto', // Ayuda al navegador a no renderizar lo que no se ve
    containIntrinsicSize: '500px', // Evita saltos de layout
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
    animation: 'spin 0.8s linear infinite'
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
    alignItems: 'flex-end'
  },
  chatHintBubble: {
    marginBottom: '10px',
    backgroundColor: '#ffffff',
    color: '#000',
    padding: '8px 16px',
    borderRadius: '12px 12px 0 12px',
    fontSize: '0.9rem',
    fontWeight: '600',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
    opacity: 0,
    transform: 'translateY(10px) scale(0.95)',
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    whiteSpace: 'nowrap',
    position: 'relative'
  },
  chatHintVisible: {
    opacity: 1,
    transform: 'translateY(0) scale(1)'
  },
  scrollToTopButton: {
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: 'none',
    fontSize: '20px',
    color: 'white',
    background: '#667eea',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    opacity: 0,
    transform: 'translateY(20px)',
    transition: 'all 0.3s ease',
    pointerEvents: 'auto',
    willChange: 'opacity, transform' // Optimización GPU
  },
  scrollToTopButtonVisible: {
    opacity: 1,
    transform: 'translateY(0)'
  },
};

// --- CSS GLOBAL CONSTANTE ---
const GLOBAL_CSS = `
  body, html {
    overflow-x: hidden !important;
    width: 100%;
    background-color: #0c0c0c;
    scroll-behavior: smooth;
  }

  /* Animación Loading */
  @keyframes spin { 
    0% { transform: rotate(0deg); } 
    100% { transform: rotate(360deg); } 
  }

  /* FIX CARRUSEL RESPONSIVE */
  @media (min-width: 768px) {
    .carousel-responsive-height {
      min-height: 480px !important;
    }
  }

  /* --- CATEGORÍAS (Optimizado) --- */
  .category-grid {
    display: grid;
    width: 100%;
    /* MÓVIL: 1 Columna (Solicitud del usuario) */
    grid-template-columns: 1fr; 
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

  /* BREAKPOINTS RESPONSIVE */
  /* Móvil grande (480px) -> 2 columnas */
  @media (min-width: 480px) {
    .category-grid { grid-template-columns: repeat(2, 1fr); }
  }
  
  /* Tablets (768px) -> 3 columnas */
  @media (min-width: 768px) {
    .category-grid { grid-template-columns: repeat(3, 1fr); gap: 20px; }
  }

  /* Desktop (1024px) -> 4 columnas */
  @media (min-width: 1024px) {
    .category-grid { grid-template-columns: repeat(4, 1fr); }
  }
  
  /* Large (1280px) -> 5 columnas */
  @media (min-width: 1280px) {
    .category-grid { grid-template-columns: repeat(5, 1fr); }
  }
  
  /* Extra Large (1600px) -> 6 columnas */
  @media (min-width: 1600px) {
    .category-grid { grid-template-columns: repeat(6, 1fr); }
  }

  /* --- PRODUCTOS --- */
  .product-grid {
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(1, 1fr);
    justify-items: stretch;
  }
  
  .product-grid > div, 
  .product-grid > a {
    width: 100%;
    height: 100%;
  }

  @media (min-width: 500px) {
    .product-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (min-width: 850px) {
    .product-grid { grid-template-columns: repeat(3, 1fr); }
  }
  @media (min-width: 1100px) {
    .product-grid { grid-template-columns: repeat(4, 1fr); }
  }
  @media (min-width: 1500px) {
    .product-grid { grid-template-columns: repeat(5, 1fr); }
  }

  /* --- ANIMACIONES HOVER (Optimizadas) --- */
  .force-no-border > * {
    border-color: rgba(255, 255, 255, 0.1) !important;
    transition: transform 0.2s ease, border-color 0.2s ease !important;
    will-change: transform; /* Optimización GPU */
  }

  .force-no-border > *:hover {
    border-color: rgba(255, 255, 255, 0.3) !important;
    transform: translateY(-4px);
  }

  @media (max-width: 600px) {
    div[style*="sectionTitle"] { font-size: 1.3rem !important; }
  }
`;

// Componente LazySection (Memoizado para evitar renderizados innecesarios)
const LazySection = React.memo(({ children, rootMargin = '200px 0px' }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { root: null, rootMargin, threshold: 0.01 } // Threshold bajo para respuesta rápida
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} style={{ minHeight: '100px' }}>
      {isVisible ? children : null}
    </div>
  );
});

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [showChatHint, setShowChatHint] = useState(false);

  // Optimización de scroll usando requestAnimationFrame
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Solo actualizamos el estado si es necesario para evitar re-renders masivos
          if (currentScroll > 400 && !showScrollToTop) {
            setShowScrollToTop(true);
          } else if (currentScroll <= 400 && showScrollToTop) {
            setShowScrollToTop(false);
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showScrollToTop]); // Dependencia necesaria para comparar el estado actual

  useEffect(() => {
    const timer = setTimeout(() => setShowChatHint(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const fetchHomeData = useCallback(async () => {
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
      setError('Error al cargar contenido.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Memoizar listas de productos
  const featuredProducts = useMemo(() => products.slice(0, 12), [products]);
  const trendingProducts = useMemo(() => products.slice(0, 6), [products]);

  // Render condicional para Loading
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner} />
            <p style={{ color: '#888' }}>Cargando...</p>
          </div>
          {/* Estilo mínimo para el spinner */}
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  // Render condicional para Error
  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.errorContainer}>
            <FiAlertTriangle size={40} color="#ff6b6b" />
            <h3>Ocurrió un error</h3>
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
      {/* Inyección de CSS Global una sola vez */}
      <style>{GLOBAL_CSS}</style>

      {/* Carrusel */}
      <div style={styles.carouselContainer} className="carousel-responsive-height">
        <Carousel />
      </div>

      {/* --- BOTONES FLOTANTES --- */}
      <div style={styles.floatingButtons}>
        <div style={styles.chatWrapper}>
          <div style={{
            ...styles.chatHintBubble,
            ...(showChatHint ? styles.chatHintVisible : {})
          }}>
            Hola, ¿en qué puedo ayudarte? 👋
          </div>
          <ChatBot />
        </div>

        <button
          style={{
            ...styles.scrollToTopButton,
            ...(showScrollToTop ? styles.scrollToTopButtonVisible : {})
          }}
          onClick={scrollToTop}
          aria-label="Subir"
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
              {categories.map(cat => (
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
        <LazySection rootMargin="0px 0px 200px 0px">
          <section style={styles.section}>
            <PaymentMethods />
          </section>
        </LazySection>
      </div>
    </div>
  );
};

export default HomePage;
