import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiFilm, 
  FiHeart, 
  FiGithub, 
  FiTwitter, 
  FiMail,
  FiShield,
  FiFileText,
  FiUsers
} from 'react-icons/fi';

// --- Estilos Ultra Modernos Unificados ---
const styles = {
  footer: {
    background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 50%, #0f0f0f 100%)',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '48px 24px 32px',
    marginTop: 'auto',
    color: '#e0e0e0',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
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
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    position: 'relative',
    zIndex: 1
  },
  mainContent: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '40px',
    alignItems: 'start'
  },
  brandSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textDecoration: 'none',
    color: '#ffffff',
    fontSize: '1.5rem',
    fontWeight: '800',
    transition: 'all 0.3s ease',
    padding: '12px 16px',
    borderRadius: '16px',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    width: 'fit-content'
  },
  brandHover: {
    background: 'rgba(102, 126, 234, 0.1)',
    borderColor: 'rgba(102, 126, 234, 0.3)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.2)'
  },
  brandIcon: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '12px',
    padding: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  tagline: {
    color: '#a0a0a0',
    fontSize: '1rem',
    lineHeight: '1.6',
    maxWidth: '300px',
    margin: 0
  },
  linksSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  sectionTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: '0 0 16px 0',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  linksList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    listStyle: 'none',
    margin: 0,
    padding: 0
  },
  linkItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  link: {
    color: '#a0a0a0',
    textDecoration: 'none',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    borderRadius: '8px'
  },
  linkHover: {
    color: '#667eea',
    background: 'rgba(102, 126, 234, 0.1)',
    transform: 'translateX(4px)'
  },
  socialSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  socialLinks: {
    display: 'flex',
    gap: '12px'
  },
  socialLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '44px',
    height: '44px',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    color: '#a0a0a0',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(20px)'
  },
  socialLinkHover: {
    background: 'rgba(102, 126, 234, 0.1)',
    borderColor: 'rgba(102, 126, 234, 0.3)',
    color: '#667eea',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.2)'
  },
  divider: {
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
    margin: '8px 0'
  },
  bottomSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',
    paddingTop: '24px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    flexWrap: 'wrap'
  },
  copyright: {
    color: '#a0a0a0',
    fontSize: '0.9rem',
    margin: 0
  },
  credit: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#667eea',
    fontSize: '0.9rem',
    fontWeight: '600',
    textDecoration: 'none',
    padding: '10px 16px',
    borderRadius: '12px',
    background: 'rgba(102, 126, 234, 0.1)',
    border: '1px solid rgba(102, 126, 234, 0.2)',
    transition: 'all 0.3s ease'
  },
  creditHover: {
    background: 'rgba(102, 126, 234, 0.2)',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.3)'
  },
  heartIcon: {
    color: '#ff6b6b',
    animation: 'pulse 2s infinite'
  },
  pulseAnimation: {
    animation: 'pulse 2s infinite'
  }
};

const Footer = () => {
  const [hoveredElements, setHoveredElements] = React.useState({});

  const handleHover = (element, isHovered) => {
    setHoveredElements(prev => ({ ...prev, [element]: isHovered }));
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <div style={styles.backgroundDecoration} />
      
      <div style={styles.container}>
        {/* Main Content */}
        <div style={styles.mainContent}>
          {/* Brand Section */}
          <div style={styles.brandSection}>
            <Link
              to="/"
              style={{
                ...styles.brand,
                ...(hoveredElements.brand && styles.brandHover)
              }}
              onMouseEnter={() => handleHover('brand', true)}
              onMouseLeave={() => handleHover('brand', false)}
              aria-label="Ir a inicio - Blackstreaming"
            >
              <div style={styles.brandIcon}>
                <FiFilm size={24} color="white" />
              </div>
              <span>Blackstreaming</span>
            </Link>
            <p style={styles.tagline}>
              Tu plataforma líder para streaming premium. Accede a contenido exclusivo 
              y disfruta de la mejor experiencia de entretenimiento.
            </p>
          </div>

          {/* Quick Links */}
          

          {/* Legal Links */}
          

          {/* Social & Contact */}
          
        </div>

        {/* Bottom Section */}
        <div style={styles.bottomSection}>
          <p style={styles.copyright}>
            © {currentYear} Blackstreaming. Todos los derechos reservados.
          </p>
          
          <a
            href="https://wa.link/kpzpr2"
            style={{
              ...styles.credit,
              ...(hoveredElements.credit && styles.creditHover)
            }}
            onMouseEnter={() => handleHover('credit', true)}
            onMouseLeave={() => handleHover('credit', false)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Desarrollado por SAIPH"
          >
            <span style={styles.heartIcon}>
              <FiHeart style={styles.pulseAnimation} />
            </span>
            <span>Desarrollado por SAIPH</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;