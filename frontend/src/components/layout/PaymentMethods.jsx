// src/components/footer/PaymentMethods.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiShield, 
  FiCreditCard, 
  FiLock,
  FiCheckCircle,
  FiAward
} from 'react-icons/fi';

// --- Estilos Base (Unified Compact Theme - Dark Glass) ---
const styles = {
  container: {
    background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 50%, #0f0f0f 100%)',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    padding: '24px 0',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'Inter', sans-serif",
  },
  backgroundDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.03) 0%, transparent 50%)',
    zIndex: 0
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '24px',
    padding: '0 24px',
    position: 'relative',
    zIndex: 1
  },
  
  // Sección Legal
  legalSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap'
  },
  legalLink: {
    color: '#a0a0a0',
    textDecoration: 'none',
    fontSize: '0.85rem',
    fontWeight: '500',
    padding: '8px 12px',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  legalLinkHover: {
    color: '#667eea',
    background: 'rgba(102, 126, 234, 0.1)',
    transform: 'translateY(-1px)'
  },

  // Sección Métodos
  methodsSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    flex: 1
  },
  methodsContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap'
  },
  methodItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },
  methodItemHover: {
    transform: 'translateY(-3px)'
  },
  methodImage: {
    width: '44px',
    height: '44px',
    objectFit: 'contain',
    borderRadius: '10px',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6px',
    backdropFilter: 'blur(20px)',
    transition: 'all 0.3s ease'
  },
  methodImageHover: {
    background: 'rgba(102, 126, 234, 0.1)',
    borderColor: 'rgba(102, 126, 234, 0.3)',
    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.2)'
  },
  methodLabel: {
    fontSize: '0.7rem',
    color: '#a0a0a0',
    fontWeight: '600',
    whiteSpace: 'nowrap'
  },
  
  // Separador
  separator: {
    width: '1px',
    height: '30px',
    background: 'rgba(255, 255, 255, 0.1)',
    margin: '0 8px'
  },

  // Badge Seguridad
  securityBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    borderRadius: '12px',
    background: 'rgba(39, 174, 96, 0.1)',
    border: '1px solid rgba(39, 174, 96, 0.3)',
    color: '#27ae60',
    fontWeight: '700',
    fontSize: '0.85rem',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },
  securityBadgeHover: {
    background: 'rgba(39, 174, 96, 0.2)',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(39, 174, 96, 0.2)'
  },
  securityIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  // Fallback para imágenes rotas
  fallbackContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#a0a0a0'
  }
};

const PaymentMethods = () => {
  const [hoveredElements, setHoveredElements] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleHover = (element, isHovered) => {
    setHoveredElements(prev => ({ ...prev, [element]: isHovered }));
  };

  const handleImgError = (e) => {
    e.currentTarget.style.display = 'none';
    const fallback = e.currentTarget.parentElement.querySelector('.fallback-icon');
    if (fallback) fallback.style.display = 'flex';
  };

  const paymentMethods = [
    { 
      id: 'yape', 
      name: 'Yape', 
      image: 'src/images/yape.png', // Asegúrate de que esta ruta exista
      fallback: <FiCreditCard size={18} />
    },
    { 
      id: 'binance', 
      name: 'Binance', 
      image: 'src/images/binance.png', // Asegúrate de que esta ruta exista
      fallback: <FiAward size={18} />
    }
  ];

  const legalLinks = [
    { to: '/terminos', label: 'Términos y condiciones', icon: FiCheckCircle },
    { to: '/privacidad', label: 'Políticas de privacidad', icon: FiLock }
  ];

  // Estilos dinámicos
  const responsiveContentStyle = isMobile 
    ? { flexDirection: 'column', alignItems: 'center', gap: '30px', textAlign: 'center' } 
    : {};

  const responsiveMethodsSectionStyle = isMobile 
    ? { justifyContent: 'center', width: '100%' } 
    : {};

  const responsiveSeparatorStyle = isMobile 
    ? { display: 'none' } 
    : {};

  return (
    <div style={styles.container}>
      <div style={styles.backgroundDecoration} />
      
      <div style={{ ...styles.content, ...responsiveContentStyle }}>
        
        {/* Sección Legal */}
        <div style={{...styles.legalSection, ...(isMobile && {justifyContent: 'center'})}}>
          {legalLinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  ...styles.legalLink,
                  ...(hoveredElements[`legal-${link.to}`] && styles.legalLinkHover)
                }}
                onMouseEnter={() => handleHover(`legal-${link.to}`, true)}
                onMouseLeave={() => handleHover(`legal-${link.to}`, false)}
              >
                <IconComponent size={14} />
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Métodos de Pago y Seguridad */}
        <div style={{ ...styles.methodsSection, ...responsiveMethodsSectionStyle }}>
          <div style={styles.methodsContainer}>
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                style={{
                  ...styles.methodItem,
                  ...(hoveredElements[`method-${method.id}`] && styles.methodItemHover)
                }}
                onMouseEnter={() => handleHover(`method-${method.id}`, true)}
                onMouseLeave={() => handleHover(`method-${method.id}`, false)}
                title={method.name}
              >
                <div
                  style={{
                    ...styles.methodImage,
                    ...(hoveredElements[`method-${method.id}`] && styles.methodImageHover)
                  }}
                >
                  <img 
                    src={method.image} 
                    alt={method.name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onError={handleImgError}
                  />
                  <div className="fallback-icon" style={{ ...styles.fallbackContainer, display: 'none' }}>
                    {method.fallback}
                  </div>
                </div>
                <span style={styles.methodLabel}>{method.name}</span>
              </div>
            ))}
          </div>

          <div style={{ ...styles.separator, ...responsiveSeparatorStyle }} />

          <div
            style={{
              ...styles.securityBadge,
              ...(hoveredElements.security && styles.securityBadgeHover)
            }}
            onMouseEnter={() => handleHover('security', true)}
            onMouseLeave={() => handleHover('security', false)}
            title="Transacciones 100% seguras"
          >
            <div style={styles.securityIcon}>
              <FiShield size={16} />
            </div>
            <span>Compra segura</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PaymentMethods;