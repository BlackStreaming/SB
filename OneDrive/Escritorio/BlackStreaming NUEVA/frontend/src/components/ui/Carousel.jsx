import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiArrowRight } from 'react-icons/fi';
import apiClient from '/src/services/apiClient.js'; 

// --- ESTILOS ULTRA MODERNOS (FULL SCREEN) ---
const CarouselStyles = () => (
  <style>{`
    .netflix-carousel-wrapper {
      width: 100%;
      height: 75vh; /* Ocupa el 75% de la altura de la pantalla */
      min-height: 550px; /* Altura mínima para laptops pequeñas */
      position: relative;
      overflow: hidden;
      border-radius: 0; /* Sin bordes redondeados para efecto inmersivo */
      background-color: #0c0c0c;
      color: white;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      box-shadow: 0 10px 40px rgba(0,0,0,0.6);
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }

    .netflix-carousel-wrapper .slide {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding-left: 8%; /* Espacio a la izquierda alineado visualmente */
      box-sizing: border-box;
      opacity: 0;
      transition: opacity 1s ease-in-out;
      z-index: 0;
    }

    .netflix-carousel-wrapper .slide-active {
      opacity: 1;
      z-index: 1;
    }

    /* --- CAPA DE FONDO (BACKDROP) --- */
    .netflix-carousel-wrapper .slide-backdrop {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #000;
      z-index: -2;
    }

    /* --- IMAGEN CON MÁSCARA (FADE TO BLACK) --- */
    .netflix-carousel-wrapper .slide-bg {
      position: absolute;
      top: 0;
      right: 0; /* Alineada a la derecha */
      width: 80%; /* La imagen ocupa el 80% derecho */
      height: 100%;
      background-size: cover;
      background-position: center center;
      z-index: -1;
      /* Esta máscara hace que la imagen se desvanezca hacia la izquierda (negro) */
      mask-image: linear-gradient(to right, transparent 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,1) 100%);
      -webkit-mask-image: linear-gradient(to right, transparent 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,1) 100%);
    }

    /* --- TIPOGRAFÍA Y CONTENIDO --- */
    .netflix-carousel-wrapper .text-content {
      max-width: 600px;
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      gap: 20px;
      text-shadow: 0 10px 30px rgba(0,0,0,0.9);
    }

    .netflix-carousel-wrapper .subtitle {
      font-size: 1rem;
      letter-spacing: 4px;
      text-transform: uppercase;
      font-weight: 700;
      color: #E50914; /* Un toque de color rojo en el subtítulo */
      margin: 0;
      display: block;
    }

    .netflix-carousel-wrapper .title {
      font-size: 5rem; /* Título GIGANTE */
      font-weight: 900;
      margin: 0;
      line-height: 0.95;
      color: #ffffff;
      text-transform: uppercase;
      letter-spacing: -2px;
    }

    .netflix-carousel-wrapper .description {
      font-size: 1.2rem;
      color: #e0e0e0;
      line-height: 1.6;
      max-width: 90%;
      opacity: 0.9;
    }

    /* --- BOTÓN DE ACCIÓN --- */
    .netflix-carousel-wrapper .cta-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      background-color: #E50914;
      color: white;
      padding: 16px 40px;
      border-radius: 8px; /* Botón semi-cuadrado moderno */
      text-decoration: none;
      font-weight: 700;
      font-size: 1.1rem;
      margin-top: 15px;
      width: fit-content;
      transition: all 0.3s ease;
      box-shadow: 0 4px 25px rgba(229, 9, 20, 0.4);
      border: 1px solid rgba(255,255,255,0.1);
    }

    .netflix-carousel-wrapper .cta-button:hover {
      background-color: #ff0f1b;
      transform: translateY(-3px);
      box-shadow: 0 8px 30px rgba(229, 9, 20, 0.6);
    }

    /* --- CONTROLES DE NAVEGACIÓN --- */
    .netflix-carousel-wrapper .arrow-button {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 20;
      transition: all 0.3s ease;
      opacity: 0; 
    }

    .netflix-carousel-wrapper:hover .arrow-button {
      opacity: 1;
    }

    .netflix-carousel-wrapper .arrow-button:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-50%) scale(1.1);
    }

    .netflix-carousel-wrapper .dots-container {
      position: absolute;
      bottom: 40px;
      left: 8%; /* Alineado con el texto */
      display: flex;
      gap: 14px;
      z-index: 20;
    }

    .netflix-carousel-wrapper .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.3);
      cursor: pointer;
      border: none;
      padding: 0;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .netflix-carousel-wrapper .dot-active {
      background-color: #E50914;
      transform: scale(1.4);
      box-shadow: 0 0 10px rgba(229, 9, 20, 0.5);
    }

    /* --- RESPONSIVE MOBILE --- */
    @media (max-width: 768px) {
      .netflix-carousel-wrapper { height: 65vh; min-height: 500px; }
      .netflix-carousel-wrapper .title { font-size: 3rem; }
      .netflix-carousel-wrapper .slide { padding-left: 24px; padding-right: 24px; align-items: flex-end; padding-bottom: 80px; }
      .netflix-carousel-wrapper .slide-bg { width: 100%; mask-image: linear-gradient(to top, rgba(0,0,0,1) 20%, transparent 100%); -webkit-mask-image: linear-gradient(to top, rgba(0,0,0,1) 20%, transparent 100%); }
      .netflix-carousel-wrapper .text-content { max-width: 100%; }
      .netflix-carousel-wrapper .dots-container { left: 50%; transform: translateX(-50%); bottom: 20px; }
      .netflix-carousel-wrapper .arrow-button { display: none; } /* Ocultar flechas en móvil */
    }
  `}</style>
);

const Carousel = () => {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/carousel-slides');
        setSlides(response.data);
      } catch (err) {
        setError('Error al cargar.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSlides();
  }, []);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (slides.length === 0 || isPaused) return;
    timerRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % slides.length);
    }, 6000); // 6 segundos por slide
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [slides.length, isPaused]); 

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);
  const goToPrevious = () => { setIsPaused(true); setCurrentIndex(prev => (prev - 1 + slides.length) % slides.length); };
  const goToNext = () => { setIsPaused(true); setCurrentIndex(prev => (prev + 1) % slides.length); };

  if (loading) return <div className="netflix-carousel-wrapper"><CarouselStyles /><div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100%'}}>Cargando...</div></div>;
  if (error || slides.length === 0) return null;

  return (
    <div className="netflix-carousel-wrapper" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <CarouselStyles />
      
      {slides.map((slide, index) => (
        <div key={slide.id || index} className={`slide ${index === currentIndex ? 'slide-active' : ''}`} aria-hidden={index !== currentIndex}>
          <div className="slide-backdrop" />
          {/* Imagen de fondo con máscara */}
          <div className="slide-bg" style={{ backgroundImage: `url(${slide.image_url})` }} />

          <div className="text-content">
            <span className="subtitle">{slide.subtitle || 'DESTACADO'}</span>
            <h2 className="title">{slide.title}</h2>
            {slide.description && <p className="description">{slide.description}</p>}
            
            {slide.link_url && (
              <Link to={slide.link_url} className="cta-button">
                VER OFERTA <FiArrowRight />
              </Link>
            )}
          </div>
        </div>
      ))}

      <button className="arrow-button" style={{left: '30px'}} onClick={goToPrevious}><FiChevronLeft size={28} /></button>
      <button className="arrow-button" style={{right: '30px'}} onClick={goToNext}><FiChevronRight size={28} /></button>

      <div className="dots-container">
        {slides.map((_, index) => (
          <button key={index} className={`dot ${index === currentIndex ? 'dot-active' : ''}`} onClick={() => setCurrentIndex(index)} />
        ))}
      </div>
    </div>
  );
};

export default Carousel;