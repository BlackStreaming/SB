import React, { useState, useEffect, useMemo, useRef } from 'react';
import apiClient from '/src/services/apiClient.js';
import ProductCard from '/src/components/product/ProductCard.jsx';
import Carousel from '/src/components/ui/Carousel.jsx';
import CategoryCard from '/src/components/ui/CategoryCard.jsx';
import PaymentMethods from '/src/components/layout/PaymentMethods.jsx';
import FloatingControls from '/src/components/ui/FloatingControls.jsx'; // Nuevo componente
import { FiTrendingUp, FiStar, FiGrid, FiRefreshCw, FiAlertTriangle } from 'react-icons/fi';
import './HomePage.css'; // Importamos el CSS externo

// Componente LazySection optimizado con memo si el contenido no cambia
const LazySection = ({ children, rootMargin = '200px 0px' }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Importante desconectar
        }
      },
      { rootMargin, threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [rootMargin]);

  return <div ref={ref} style={{ minHeight: '100px' }}>{isVisible ? children : null}</div>;
};

const HomePage = () => {
  const [data, setData] = useState({ categories: [], products: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [categoriesResponse, productsResponse] = await Promise.all([
        apiClient.get('/categories'),
        apiClient.get('/products')
      ]);
      setData({
        categories: categoriesResponse.data,
        products: productsResponse.data
      });
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

  const featuredProducts = useMemo(() => data.products.slice(0, 12), [data.products]);
  const trendingProducts = useMemo(() => data.products.slice(0, 6), [data.products]);

  if (loading) {
    return (
      <div className="home-container">
        <div className="content-wrapper" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh'}}>
           <div className="loading-spinner" style={{width: 40, height: 40, border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#667eea', borderRadius: '50%', animation: 'spin 1s linear infinite'}} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-container">
        <div className="content-wrapper error-container" style={{textAlign: 'center', padding: 50}}>
          <FiAlertTriangle size={40} color="#ff6b6b" />
          <h3>Ocurrió un error</h3>
          <button onClick={fetchHomeData} className="retry-button">
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

      {/* Controles Flotantes (Aislados para no causar re-render) */}
      <FloatingControls />

      <div className="content-wrapper">
        
        {/* CATEGORÍAS */}
        <LazySection>
          <section className="section-block">
            <div className="section-header">
              <div>
                <h2 className="section-title">
                  <FiGrid size={24} color="#667eea" /> Categorías
                </h2>
                <p className="section-subtitle">Explora nuestro catálogo</p>
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
          <section className="section-block">
            <div className="section-header">
              <div>
                <h2 className="section-title">
                  <FiStar size={24} color="#ffd700" /> Destacados
                </h2>
                <p className="section-subtitle">Lo mejor valorado</p>
              </div>
            </div>
            <div className="product-grid">
              {featuredProducts.map(prod => (
                <ProductCard product={prod} key={prod.id} />
              ))}
            </div>
          </section>
        </LazySection>

        {/* TENDENCIAS */}
        <LazySection>
          <section className="section-block">
            <div className="section-header">
              <div>
                <h2 className="section-title">
                  <FiTrendingUp size={24} color="#ff6b6b" /> Tendencias
                </h2>
              </div>
            </div>
            <div className="product-grid">
              {trendingProducts.map(prod => (
                <ProductCard product={prod} key={prod.id} />
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
