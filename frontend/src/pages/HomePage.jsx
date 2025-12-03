import React, { useState, useEffect, useMemo, useRef } from 'react';
import apiClient from '/src/services/apiClient.js';
import ProductCard from '/src/components/product/ProductCard.jsx';
import Carousel from '/src/components/ui/Carousel.jsx';
import CategoryCard from '/src/components/ui/CategoryCard.jsx';
import PaymentMethods from '/src/components/layout/PaymentMethods.jsx';
import FloatingControls from '/src/components/ui/FloatingControls.jsx';
import { FiTrendingUp, FiStar, FiGrid, FiRefreshCw, FiAlertTriangle } from 'react-icons/fi';
import './HomePage.css'; // Asegúrate de haber creado este archivo CSS como vimos antes

// --- COMPONENTE LAZY SECTION (Optimizado) ---
const LazySection = ({ children, rootMargin = '200px 0px' }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Si no hay IntersectionObserver (navegadores viejos), mostrar todo
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Una vez visto, dejamos de observar para ahorrar recursos
        }
      },
      { rootMargin, threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [rootMargin]);

  // Altura mínima para evitar saltos de layout (CLS)
  return <div ref={ref} style={{ minHeight: '100px' }}>{isVisible ? children : null}</div>;
};

// --- COMPONENTE PRINCIPAL ---
const HomePage = () => {
  // Estado unificado para datos
  const [data, setData] = useState({ categories: [], products: [] });
  // Estado para la tasa de cambio (Inicial 3.55 por defecto)
  const [exchangeRate, setExchangeRate] = useState(3.55);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      setError(null);

      // OPTIMIZACIÓN CRÍTICA:
      // Hacemos 3 peticiones en paralelo. Si la tasa falla, no rompe la página.
      const [categoriesResponse, productsResponse, rateResponse] = await Promise.all([
        apiClient.get('/categories'),
        apiClient.get('/products'),
        // El catch aquí asegura que si falla la tasa, el resto carga igual con el valor por defecto
        apiClient.get('/config/recharge').catch(() => ({ data: { exchange_rate: 3.55 } }))
      ]);

      setData({
        categories: categoriesResponse.data,
        products: productsResponse.data
      });

      // Actualizamos la tasa si vino del backend
      if (rateResponse.data && rateResponse.data.exchange_rate) {
        setExchangeRate(parseFloat(rateResponse.data.exchange_rate));
      }

    } catch (err) {
      setError('Error al cargar el contenido de la tienda.');
      console.error("Error fetching home data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  // Memorizamos las listas para evitar filtrados innecesarios en cada render
  const featuredProducts = useMemo(() => data.products.slice(0, 12), [data.products]);
  const trendingProducts = useMemo(() => data.products.slice(0, 6), [data.products]);

  if (loading) {
    return (
      <div className="home-container">
        <div className="content-wrapper" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh'}}>
           <div className="loading-spinner" style={{
             width: 40, height: 40, 
             border: '3px solid rgba(255,255,255,0.1)', 
             borderTopColor: '#667eea', 
             borderRadius: '50%', 
             animation: 'spin 1s linear infinite'
           }} />
           <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-container">
        <div className="content-wrapper error-container" style={{
            textAlign: 'center', padding: 50, background: '#151515', 
            borderRadius: 16, marginTop: 50, border: '1px solid #333'
        }}>
          <FiAlertTriangle size={40} color="#ff6b6b" style={{marginBottom: 20}} />
          <h3 style={{color: '#fff'}}>Ocurrió un error</h3>
          <p style={{color: '#888', marginBottom: 20}}>{error}</p>
          <button onClick={fetchHomeData} className="retry-button" style={{
              padding: '10px 24px', background: '#667eea', color: 'white', 
              border: 'none', borderRadius: 8, cursor: 'pointer', 
              display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 600
          }}>
            <FiRefreshCw /> Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Carrusel */}
      <div className="carousel-container">
        <Carousel />
      </div>

      {/* Controles Flotantes (Aislados para no causar re-render al hacer scroll) */}
      <FloatingControls />

      <div className="content-wrapper">
        
        {/* SECCIÓN CATEGORÍAS */}
        <LazySection>
          <section className="section-block">
            <div className="section-header">
              <div>
                <h2 className="section-title">
                  <FiGrid size={24} color="#667eea" /> Categorías
                </h2>
                <p className="section-subtitle">Explora nuestro catálogo completo</p>
              </div>
            </div>
            <div className="category-grid">
              {data.categories.map(cat => (
                <CategoryCard category={cat} key={cat.id} />
              ))}
            </div>
          </section>
        </LazySection>

        {/* SECCIÓN DESTACADOS */}
        <LazySection>
          <section className="section-block">
            <div className="section-header">
              <div>
                <h2 className="section-title">
                  <FiStar size={24} color="#ffd700" /> Destacados
                </h2>
                <p className="section-subtitle">Los productos más populares</p>
              </div>
            </div>
            <div className="product-grid">
              {featuredProducts.map(prod => (
                <ProductCard 
                    product={prod} 
                    key={prod.id} 
                    exchangeRate={exchangeRate} /* <--- AQUÍ PASAMOS LA TASA */
                />
              ))}
            </div>
          </section>
        </LazySection>

        {/* SECCIÓN TENDENCIAS */}
        <LazySection>
          <section className="section-block">
            <div className="section-header">
              <div>
                <h2 className="section-title">
                  <FiTrendingUp size={24} color="#ff6b6b" /> Tendencias
                </h2>
                <p className="section-subtitle">Lo nuevo de esta semana</p>
              </div>
            </div>
            <div className="product-grid">
              {trendingProducts.map(prod => (
                <ProductCard 
                    product={prod} 
                    key={prod.id} 
                    exchangeRate={exchangeRate} /* <--- AQUÍ PASAMOS LA TASA */
                />
              ))}
            </div>
          </section>
        </LazySection>

        {/* MÉTODOS DE PAGO */}
        <LazySection rootMargin="0px 0px 200px 0px">
          <section className="section-block">
            <PaymentMethods />
          </section>
        </LazySection>

      </div>
    </div>
  );
};

export default HomePage;
