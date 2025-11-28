// src/components/CategoryCard.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiFolder } from 'react-icons/fi';

// --- Estilos "Clean Hybrid" (Blanco arriba / Dark Glass abajo) ---
const styles = {
  cardLink: {
    textDecoration: 'none',
    color: 'inherit',
    display: 'block',
    height: '100%',
  },
  card: {
    background: 'rgba(30, 30, 30, 0.6)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'relative',
    minHeight: '300px',
  },
  cardHover: {
    transform: 'translateY(-8px)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.4)'
  },
  
  // --- SECCIÓN DE IMAGEN CON FONDO BLANCO ---
  imageContainer: {
    height: '180px',
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    padding: '20px',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'contain', 
    transition: 'transform 0.5s ease',
    filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
  },
  imageHover: {
    transform: 'scale(1.08)',
  },

  // --- CONTENIDO (Parte inferior oscura) ---
  content: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    flex: 1,
    justifyContent: 'space-between',
    borderTop: '1px solid rgba(255,255,255,0.05)'
  },
  
  header: { display: 'flex', alignItems: 'center', gap: '12px' },
  iconWrapper: {
    width: '36px', height: '36px', borderRadius: '10px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
  },
  title: {
    fontSize: '1.2rem', fontWeight: '700', color: '#ffffff', margin: 0,
    lineHeight: '1.3', textTransform: 'capitalize'
  },

  description: {
    fontSize: '0.85rem', color: '#ccc', lineHeight: '1.5',
    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
  },

  actionText: {
    fontSize: '0.9rem', fontWeight: '600', color: '#667eea',
    display: 'flex', alignItems: 'center', gap: '8px',
    marginTop: 'auto', transition: 'all 0.3s ease'
  },
  actionTextHover: {
    color: '#a78bfa',
    gap: '12px'
  },
};

const CategoryCard = ({ category }) => {
  if (!category) return null;

  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={`/categoria/${category.slug}`}
      style={styles.cardLink}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <article style={{ ...styles.card, ...(isHovered && styles.cardHover) }}>
        
        {/* Contenedor de imagen BLANCO */}
        <div style={styles.imageContainer}>
          <img
            src={category.image_url || 'https://placehold.co/600x400/ffffff/667eea?text=Categoria'}
            alt={category.name}
            style={{ ...styles.image, ...(isHovered && styles.imageHover) }}
            loading="lazy"           // <- LAZY LOADING
            decoding="async"         // <- sugerencia extra
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/600x400/ffffff/667eea?text=Categoria';
            }}
          />
        </div>

        {/* Contenido oscuro */}
        <div style={styles.content}>
          <div>
            <div style={styles.header}>
              <div style={styles.iconWrapper}><FiFolder size={18} /></div>
              <h3 style={styles.title}>{category.name}</h3>
            </div>
            
            {category.description && (
              <p style={styles.description}>{category.description}</p>
            )}
          </div>

          <div style={{ ...styles.actionText, ...(isHovered && styles.actionTextHover) }}>
            Explorar <FiArrowRight />
          </div>
        </div>
      </article>
    </Link>
  );
};

export default CategoryCard;
