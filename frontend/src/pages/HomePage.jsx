import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom'; // Asegúrate de tener esto si usas Links
import apiClient from '/src/services/apiClient.js';
import ProductCard from '/src/components/product/ProductCard.jsx';
import Carousel from '/src/components/ui/Carousel.jsx';
import CategoryCard from '/src/components/ui/CategoryCard.jsx';
import PaymentMethods from '/src/components/layout/PaymentMethods.jsx';
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
  // FIX CLS: Reservamos altura mínima y proporción para el carrusel
  carouselSection: {
    width: '100%',
    position: 'relative',
    marginBottom: '30px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
    minHeight: '200px', 
    aspectRatio: '16/9', 
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
    contentVisibility: 'auto', // Mejora el renderizado
    containIntrinsicSize: '300px' 
  },
  sectionHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  sectionTitle: {
    fontSize: '1.6rem', fontWeight: '800', color: '#ffffff', margin: 0, 
    display: 'flex', alignItems: 'center', gap: '10px',
  },
  sectionSubtitle: {
    fontSize: '0.95rem', color: '#888', margin: '4px 0 0 0', fontWeight: '400'
  },
  loadingContainer: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', gap: '20px'
  },
  loadingSpinner: {
    width: '40px', height: '40px', border: '3px solid rgba(255, 255, 255, 0.1)',
    borderTop: '3px solid #667eea', borderRadius: '50%', animation: 'spin 0.8s linear infinite'
  },
  errorContainer: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    padding: '40px', textAlign: 'center', background: '#151515',
    borderRadius: '16px', border: '1px solid #333',
    color: '#e0e0e0'
  },
  retryButton: {
    padding: '10px 24px', background: '#667eea',
    color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600',
    cursor: 'pointer', marginTop: '15px', display: 'flex', alignItems: 'center', gap: '8px'
  },
  floatingButtons: { position: 'fixed', right: '20px', bottom: '20px', zIndex: 999 },
  scrollToTopButton: { 
    width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', border: 'none', fontSize: '20px', color: 'white', 
    background: '#667eea', boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    opacity: 0, transform: 'translateY(20px)', transition: 'all 0.3s ease'
  }, 
  scrollToTopButtonVisible: { opacity: 1, transform: 'translateY(0)' },
};

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // Optimización: debounce para el evento scroll
  useEffect(() => {
    let timeoutId = null;
    const handleScroll = () => {
      if (timeoutId) return;
      timeoutId = setTimeout(() => {
        setShowScrollToTop(window.scrollY > 400);
        timeoutId = null;
      }, 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
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
      setError('Error al cargar contenido.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHomeData(); }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Optimización: Limitamos productos iniciales para mejorar LCP y evitar lag por GIFs
  const featuredProducts = useMemo(() => products.slice(0, 12), [products]); 
  const trendingProducts = useMemo(() => products.slice(0, 6), [products]);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner} />
            <p style={{color: '#888'}}>Cargando...</p>
          </div>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
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
       
      <div style={styles.carouselSection} className="carousel-wrapper">
        <Carousel />
      </div>
       
      <div style={styles.floatingButtons}>
        <button
          style={{ ...styles.scrollToTopButton, ...(showScrollToTop ? styles.scrollToTopButtonVisible : {}) }}
          onClick={scrollToTop}
          aria-label="Subir"
        >
          <FiArrowUp />
        </button>
      </div>
       
      <div style={styles.content}>

        {/* Categorías */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}><FiGrid size={24} color="#667eea"/> Categorías</h2>
              <p style={styles.sectionSubtitle}>Explora nuestro catálogo</p>
            </div>
          </div>
          
          <div className="category-grid">
            {categories.map(cat => <CategoryCard category={cat} key={cat.id} />)}
          </div>
        </section>

        {/* Destacados */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}><FiStar size={24} color="#ffd700"/> Destacados</h2>
              <p style={styles.sectionSubtitle}>Lo mejor valorado</p>
            </div>
          </div>
          
          <div className="product-grid force-no-border">
            {featuredProducts.map(prod => <ProductCard product={prod} key={prod.id} />)}
          </div>
        </section>

        {/* Tendencias */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}><FiTrendingUp size={24} color="#ff6b6b"/> Tendencias</h2>
            </div>
          </div>
          
          <div className="product-grid force-no-border">
            {trendingProducts.map(prod => <ProductCard product={prod} key={prod.id} />)}
          </div>
        </section>

        <section style={styles.section}>
          <PaymentMethods />
        </section>

      </div>
       
      <style>{`
        body, html {
            overflow-x: hidden !important;
            width: 100%;
            background-color: #0c0c0c;
        }

        /* =========================================
           1. RESPONSIVE DE CATEGORÍAS (FIXED)
           ========================================= */
        .category-grid {
          display: grid;
          gap: 16px;
          /* MÓVIL: 1 COLUMNA */
          grid-template-columns: 1fr; 
          justify-items: center; /* Centrado para evitar estiramiento */
          width: 100%;
        }

        /* FIX TAMAÑO MÓVIL: Evita que la tarjeta sea gigante */
        .category-grid > div, 
        .category-grid > a {
            width: 100%;
            max-width: 280px; /* Límite de ancho en móvil */
        }
        
        /* Tablet (más de 600px): 4 columnas */
        @media (min-width: 600px) {
          .category-grid {
            grid-template-columns: repeat(4, 1fr); 
            justify-items: stretch;
          }
          /* Quitamos el límite en pantallas grandes */
          .category-grid > div, .category-grid > a { max-width: unset; }
        }

        /* PC (más de 1200px): 8 columnas */
        @media (min-width: 1200px) {
          .category-grid {
             grid-template-columns: repeat(8, 1fr);
          }
        }

        /* =========================================
           2. RESPONSIVE DE PRODUCTOS (FIXED)
           ========================================= */
        .product-grid {
          display: grid;
          gap: 20px;
          /* MÓVIL: 1 COLUMNA */
          grid-template-columns: 1fr;
          justify-items: center; 
        }
        
        /* FIX TAMAÑO MÓVIL: Evita el efecto poster */
        .product-grid > div, 
        .product-grid > a {
            width: 100%;
            max-width: 320px; 
        }

        /* Tablet y superiores */
        @media (min-width: 600px) {
          .product-grid {
            grid-template-columns: repeat(2, 1fr); 
            justify-items: stretch;
          }
           .product-grid > div, .product-grid > a { max-width: unset; }
        }
        @media (min-width: 900px) {
          .product-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (min-width: 1200px) {
          .product-grid { grid-template-columns: repeat(4, 1fr); }
        }
        @media (min-width: 1600px) {
          .product-grid { grid-template-columns: repeat(6, 1fr); }
        }

        /* =========================================
           3. MEJORA VISUAL GENERAL
           ========================================= */
        /* Contenedor Carrusel estable */
        .carousel-wrapper {
            width: 100%;
            aspect-ratio: 16/9;
            min-height: 200px;
            overflow: hidden; 
        }
        @media (min-width: 768px) {
            .carousel-wrapper { min-height: 400px; }
        }

        /* Bordes de tarjetas (force-no-border) */
        .force-no-border > * {
             border-color: rgba(255, 255, 255, 0.1) !important;
             transition: transform 0.3s ease !important;
             will-change: transform; 
        }
        .force-no-border > *:hover,
        .force-no-border > a:hover,
        .force-no-border > div:hover,
        .force-no-border .card:hover {
            border-color: rgba(255, 255, 255, 0.1) !important;
            box-shadow: none !important;
            outline: none !important;
        }

        /* Ajuste de títulos en móvil */
        @media (max-width: 600px) {
          div[style*="sectionTitle"] { font-size: 1.3rem !important; }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
