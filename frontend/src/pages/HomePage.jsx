import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  // --- BOTONES FLOTANTES Y CHAT ---
  floatingButtons: {
    position: 'fixed',
    right: '20px',
    bottom: '20px',
    zIndex: 999,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '15px',
    pointerEvents: 'none' // Permite clicks a través del área vacía
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
    pointerEvents: 'auto' 
  },
  scrollToTopButtonVisible: {
    opacity: 1,
    transform: 'translateY(0)'
  },
};

/**
 * Sección perezosa: solo monta el contenido cuando entra al viewport.
 */
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
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { root: null, rootMargin, threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref}>
      {isVisible ? children : null}
    </div>
  );
};

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [showChatHint, setShowChatHint] = useState(false);

  // Manejo del Scroll
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setShowScrollToTop(window.scrollY > 400);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mostrar el mensaje del chat después de 3 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowChatHint(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Fetch de datos
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

  const featuredProducts = useMemo(() => products.slice(0, 12), [products]);
  const trendingProducts = useMemo(() => products.slice(0, 6), [products]);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner} />
            <p style={{ color: '#888' }}>Cargando...</p>
          </div>
          <style>{`
            @keyframes spin { 
              0% { transform: rotate(0deg); } 
              100% { transform: rotate(360deg); } 
            }
          `}</style>
        </div>
      </div>
    );
  }

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
      {/* Carrusel */}
      <div style={styles.carouselContainer} className="carousel-responsive-height">
        <Carousel />
      </div>

      {/* --- BOTONES FLOTANTES (Chat + Subir) --- */}
      <div style={styles.floatingButtons}>
        
        {/* Contenedor del Chat con Mensaje Flotante */}
        <div style={styles.chatWrapper}>
          {/* Mensajito profesional */}
          <div style={{
            ...styles.chatHintBubble,
            ...(showChatHint ? styles.chatHintVisible : {})
          }}>
            Hola, ¿en qué puedo ayudarte? 👋
          </div>
          
          <ChatBot />
        </div>

        {/* Botón ScrollToTop */}
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

      {/* ESTILOS GLOBALES Y RESPONSIVE OPTIMIZADOS */}
      <style>{`
        body, html {
          overflow-x: hidden !important;
          width: 100%;
          background-color: #0c0c0c;
        }

        /* --- FIX RESPONSIVE HEIGHT (CLS) --- */
        @media (min-width: 768px) {
          .carousel-responsive-height {
            min-height: 480px !important;
          }
        }

        /* --- CATEGORÍAS GRID MEJORADO --- */
        .category-grid {
          display: grid;
          gap: 16px;
          width: 100%;
          /* Mobile first: 2 columnas */
          grid-template-columns: repeat(2, 1fr);
        }

        .category-grid > div, 
        .category-grid > a {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          /* Aspect ratio más equilibrado para que se vean como la foto */
          aspect-ratio: 1 / 1.1; 
          min-height: 0;
        }

        /* Ajustes responsivos para que se vea lleno como en la imagen */
        @media (min-width: 500px) {
          .category-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (min-width: 768px) {
          .category-grid { grid-template-columns: repeat(4, 1fr); }
        }
        @media (min-width: 1024px) {
          .category-grid { grid-template-columns: repeat(5, 1fr); }
        }
        @media (min-width: 1280px) {
          .category-grid { grid-template-columns: repeat(6, 1fr); }
        }
        @media (min-width: 1600px) {
          .category-grid { grid-template-columns: repeat(8, 1fr); }
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

        @media (min-width: 480px) {
          .product-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 768px) {
          .product-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (min-width: 1024px) {
          .product-grid { grid-template-columns: repeat(4, 1fr); }
        }
        @media (min-width: 1400px) {
          .product-grid { grid-template-columns: repeat(5, 1fr); }
        }
        @media (min-width: 1700px) {
          .product-grid { grid-template-columns: repeat(6, 1fr); }
        }

        /* --- EFECTOS HOVER --- */
        .force-no-border > * {
          border-color: rgba(255, 255, 255, 0.1) !important;
          transition: transform 0.3s ease, border-color 0.3s ease !important;
        }

        .force-no-border > *:hover,
        .force-no-border > a:hover,
        .force-no-border > div:hover {
          border-color: rgba(255, 255, 255, 0.3) !important;
          transform: translateY(-5px);
        }

        @media (max-width: 600px) {
          div[style*="sectionTitle"] { font-size: 1.3rem !important; }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
