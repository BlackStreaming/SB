// src/components/ProductCard.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiShoppingCart, FiTag, FiClock, FiRefreshCw, FiPackage, 
  FiStar, FiZap, FiAlertCircle, FiCheck, FiUser, FiInfo, FiShield, FiX
} from 'react-icons/fi';

// --- NUEVOS IMPORTS PARA LA FUNCIONALIDAD ---
import { useCart } from '/src/context/CartContext'; // Asegúrate de que la ruta sea correcta
import PurchaseModal from './PurchaseModal'; // Asegúrate de que la ruta al modal sea correcta

// --- CONFIGURACIÓN ---
const TIPO_DE_CAMBIO = 3.55;

// --- Estilos "Clean Hybrid" ---
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
    transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'relative',
    minHeight: '400px',
  },
  cardHover: {
    transform: 'translateY(-6px)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.4)'
  },
  
  // --- IMAGEN ---
  imageContainer: {
    height: '160px', 
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    padding: '15px',
    borderBottom: '1px solid rgba(0,0,0,0.05)'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    transition: 'transform 0.5s ease',
    filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
  },
  imageHover: { transform: 'scale(1.08)' },

  // Tags
  tags: {
    position: 'absolute', top: '10px', right: '10px',
    display: 'flex', flexDirection: 'column', gap: '4px', zIndex: 10, alignItems: 'flex-end',
  },
  tag: {
    padding: '4px 8px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: '700',
    backdropFilter: 'blur(4px)', display: 'inline-flex', alignItems: 'center', gap: '4px',
    border: '1px solid rgba(255, 255, 255, 0.2)', 
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    textTransform: 'uppercase', letterSpacing: '0.5px',
    color: '#fff',
    textShadow: '0 1px 2px rgba(0,0,0,0.3)'
  },
  // Colores
  tagOffer: { background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', color: '#000', textShadow: 'none' },
  tagUltimos: { background: 'linear-gradient(135deg, #FF4500 0%, #FF6347 100%)' }, 
  
  // ESTADOS ESPECÍFICOS:
  tagGreen: { background: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)' }, // Stock (Verde)
  tagRed: { background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)' },   // Agotado (Rojo)
  tagYellow: { background: 'linear-gradient(135deg, #f1c40f 0%, #f39c12 100%)', color: '#000', textShadow: 'none' }, // A Pedido (Amarillo)
  tagBlue: { background: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)' },   // Activación (Celeste/Azul)
  tagMuted: { background: 'rgba(0, 0, 0, 0.8)', color: '#fff' },

  // --- CONTENIDO ---
  content: {
    padding: '16px', 
    display: 'flex', flexDirection: 'column', gap: '8px', flex: 1,
    justifyContent: 'space-between',
    borderTop: '1px solid rgba(255,255,255,0.05)'
  },
  
  // Proveedor y Categoría
  providerSection: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: '2px' 
  },
  providerInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    flexWrap: 'wrap'
  },
  category: { 
    fontSize: '0.65rem', color: '#667eea', fontWeight: '700', 
    textTransform: 'uppercase', letterSpacing: '0.5px',
    background: 'rgba(102, 126, 234, 0.1)', padding: '2px 6px', borderRadius: '4px'
  },
  providerName: {
    fontSize: '0.8rem', color: '#e0e0e0', fontWeight: '600',
    display: 'flex', alignItems: 'center', gap: '4px'
  },

  name: {
    fontSize: '1rem', fontWeight: '700', color: '#ffffff', lineHeight: '1.3', margin: 0,
    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', 
    minHeight: '40px' 
  },

  // Botones de Info
  infoButtons: {
    display: 'flex', gap: '8px', marginTop: '4px'
  },
  infoBtn: {
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '6px', padding: '4px 8px', fontSize: '0.7rem', color: '#aaa',
    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
    transition: 'all 0.2s ease',
  },
  infoBtnHover: {
    background: 'rgba(255,255,255,0.1)', color: '#fff', borderColor: 'rgba(255,255,255,0.2)'
  },
  
  details: { 
    display: 'flex', flexWrap: 'wrap', gap: '8px', color: '#a0a0a0', fontSize: '0.8rem' 
  },
  detailItem: { display: 'flex', alignItems: 'center', gap: '4px' },
  renewal: { display: 'flex', alignItems: 'center', gap: '4px', color: '#2ecc71', fontWeight: '600', fontSize: '0.8rem' },

  // Rating
  ratingContainer: { display: 'flex', alignItems: 'center', gap: '2px' },
  starFilled: { color: '#FFD700', fill: '#FFD700' },
  starEmpty: { color: '#444', fill: 'none' },
  ratingText: { fontSize: '0.75rem', color: '#888', marginLeft: '4px', fontWeight: '500' },

  // Precio y Footer
  priceContainer: {
    marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex', flexDirection: 'column', gap: '8px'
  },
  priceRow: { display: 'flex', alignItems: 'baseline', gap: '8px' },
  price: {
    fontSize: '1.3rem', fontWeight: '800',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
  },
  offerPrice: { fontSize: '1.3rem', fontWeight: '800', color: '#ff6b6b' },
  fictitiousPrice: { fontSize: '0.85rem', color: '#666', textDecoration: 'line-through' },
  conversion: { fontSize: '0.75rem', color: '#666', fontStyle: 'italic' },

  // Botón Centrado
  addToCartButton: {
    width: '100%', 
    padding: '10px 0', 
    border: 'none', borderRadius: '10px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white',
    fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer', 
    display: 'flex', gap: '6px', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden', marginTop: '4px',
    boxSizing: 'border-box'
  },
  addToCartButtonHover: { transform: 'translateY(-2px)', boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)' },
  
  buttonGlow: {
    position: 'absolute', top: 0, left: '-100%', width: '100%', height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
    transition: 'left 0.5s ease'
  },
  buttonGlowHover: { left: '100%' },

  outOfStockText: {
    width: '100%', padding: '10px 0', 
    background: 'rgba(255, 107, 107, 0.1)', color: '#ff6b6b',
    fontSize: '0.9rem', fontWeight: '700', textAlign: 'center', borderRadius: '10px',
    border: '1px solid rgba(255, 107, 107, 0.3)', 
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
    boxSizing: 'border-box'
  },

  // MODALES INFO
  modalOverlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
    background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', 
    zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
  },
  modalContent: {
    background: '#1a1a1a', borderRadius: '16px', padding: '30px', width: '100%', maxWidth: '450px', 
    border: '1px solid rgba(255,255,255,0.1)', position: 'relative', color: '#e0e0e0',
    boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
  },
  modalClose: {
    position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', 
    color: '#888', cursor: 'pointer', fontSize: '1.2rem'
  },
  modalTitle: {
    fontSize: '1.2rem', fontWeight: '700', marginBottom: '15px', color: '#fff', 
    display: 'flex', alignItems: 'center', gap: '10px'
  },
  modalBody: {
    fontSize: '0.9rem', lineHeight: '1.6', color: '#ccc', whiteSpace: 'pre-line'
  }
};

const RatingStars = ({ rating }) => {
  if (!rating) return null;
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const empty = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div style={styles.ratingContainer}>
      {[...Array(fullStars)].map((_, i) => <FiStar key={`f-${i}`} size={10} style={styles.starFilled} />)}
      {hasHalf && <FiStar size={10} style={{ ...styles.starFilled, clipPath: 'inset(0 50% 0 0)' }} />}
      {[...Array(empty)].map((_, i) => <FiStar key={`e-${i}`} size={10} style={styles.starEmpty} />)}
      <span style={styles.ratingText}>{parseFloat(rating).toFixed(1)}</span>
    </div>
  );
};

// --- HELPER: Obtener Estilo del Tipo de Venta ---
const getTypeBadge = (status) => {
  switch (status) {
    case 'en stock':
      return { text: 'Entrega Inmediata', color: '#2ecc71', icon: <FiZap /> };
    case 'a pedido':
      return { text: 'A Pedido (Manual)', color: '#f1c40f', icon: <FiPackage /> };
    case 'activacion':
      return { text: 'Activación (Email)', color: '#00c6ff', icon: <FiRefreshCw /> };
    default:
      return { text: 'Digital', color: '#a0a0a0', icon: <FiInfo /> };
  }
};

const ProductCard = ({ product }) => {
  // Usamos el contexto del carrito directamente aquí
  const { addToCart } = useCart();
  
  // Estado fijo del dólar
  const exchangeRate = TIPO_DE_CAMBIO;
  
  const [hoverStates, setHoverStates] = useState({});
  const [showDetails, setShowDetails] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  
  // Estado para el Modal de Compra
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

  const handleHover = (key, state) => setHoverStates(prev => ({ ...prev, [key]: state }));

  // Abre el modal de compra
  const handleOpenPurchaseModal = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPurchaseModalOpen(true);
  };

  // Cierra el modal de compra
  const handleClosePurchaseModal = () => {
    setIsPurchaseModalOpen(false);
  };

  // Acción final de agregar al carrito (viene desde el PurchaseModal)
  const handleConfirmAddToCart = (data) => {
    addToCart(data.product, {
      customerName: data.customerName,
      customerPhone: data.customerPhone,
    });
    setIsPurchaseModalOpen(false);
  };

  const openDetails = (e) => {
      e.preventDefault(); e.stopPropagation();
      setShowDetails(true);
  };
  const openTerms = (e) => {
      e.preventDefault(); e.stopPropagation();
      setShowTerms(true);
  };

  const getConversion = (usd) => <span style={styles.conversion}>~ S/ {(usd * exchangeRate).toFixed(2)}</span>;

  const renderPrice = () => {
    const { offer_price_usd, price_usd, fictitious_price_usd } = product;
    if (offer_price_usd) {
      return (
        <>
          <div style={styles.priceRow}>
            <span style={styles.offerPrice}>${offer_price_usd}</span>
            <span style={styles.fictitiousPrice}>${price_usd}</span>
          </div>
          {getConversion(offer_price_usd)}
        </>
      );
    }
    const finalPrice = price_usd;
    const originalPrice = fictitious_price_usd;
    return (
      <>
        <div style={styles.priceRow}>
          <span style={styles.price}>${finalPrice}</span>
          {originalPrice && <span style={styles.fictitiousPrice}>${originalPrice}</span>}
        </div>
        {getConversion(finalPrice)}
      </>
    );
  };

  if (!product) return null;

  const hasOffer = !!product.offer_price_usd;
  const isLastStock = product.tags?.includes('ultimo stock');
  const stock = product.stock_quantity || 0;
  
  // Determinamos si está agotado
  const isOutOfStock = product.status === 'agotado' || (stock === 0 && ['en stock', 'a pedido', 'activacion'].includes(product.status));

  // --- LOGICA DE ETIQUETAS DE STOCK ---
  let statusTag = null;
  if (isOutOfStock) {
    statusTag = <div style={{...styles.tag, ...styles.tagRed}}><FiAlertCircle /> Agotado</div>;
  } else if (product.status === 'a pedido') {
    statusTag = <div style={{...styles.tag, ...styles.tagYellow}}><FiPackage /> A Pedido: {stock}</div>;
  } else if (product.status === 'activacion') {
    statusTag = <div style={{...styles.tag, ...styles.tagBlue}}><FiZap /> Activación: {stock}</div>;
  } else if (product.status === 'en stock') {
    statusTag = <div style={{...styles.tag, ...styles.tagGreen}}><FiCheck /> Stock: {stock}</div>;
  }

  return (
    <>
      <Link 
        to={`/producto/${product.slug}`} 
        style={styles.cardLink}
        onMouseEnter={() => handleHover('card', true)}
        onMouseLeave={() => handleHover('card', false)}
      >
        <article style={{...styles.card, ...(hoverStates.card && styles.cardHover)}}>
          
          {/* IMAGEN */}
          <div style={styles.imageContainer}>
            <img 
              src={product.image_url || 'https://placehold.co/600x400/ffffff/667eea?text=Producto'} 
              alt={product.name} 
              style={{...styles.image, ...(hoverStates.card && styles.imageHover)}} 
              onError={(e) => e.target.src='https://placehold.co/600x400/ffffff/667eea?text=Producto'}
            />
            <div style={styles.tags}>
              {hasOffer && <div style={{...styles.tag, ...styles.tagOffer}}><FiTag /> Oferta</div>}
              {isLastStock && <div style={{...styles.tag, ...styles.tagUltimos}}><FiZap /> Últimos</div>}
              {statusTag}
            </div>
          </div>

          {/* DETALLES */}
          <div style={styles.content}>
            <div style={styles.providerSection}>
              <div style={styles.providerInfo}>
                <span style={styles.category}>{product.category_name || 'Digital'}</span>
                <span style={styles.providerName}>
                  <FiUser size={10} color="#a0a0a0"/> {product.provider_name || 'Oficial'}
                </span>
              </div>
              <RatingStars rating={product.provider_rating} />
            </div>
            
            <h3 style={styles.name}>{product.name}</h3>

            {/* BOTONES DE INFORMACIÓN */}
            <div style={styles.infoButtons}>
                <button 
                    onClick={openDetails} 
                    style={{...styles.infoBtn, ...(hoverStates.details ? styles.infoBtnHover : {})}}
                    onMouseEnter={() => handleHover('details', true)}
                    onMouseLeave={() => handleHover('details', false)}
                >
                    <FiInfo size={12} /> Detalles
                </button>
                <button 
                    onClick={openTerms} 
                    style={{...styles.infoBtn, ...(hoverStates.terms ? styles.infoBtnHover : {})}}
                    onMouseEnter={() => handleHover('terms', true)}
                    onMouseLeave={() => handleHover('terms', false)}
                >
                    <FiShield size={12} /> Términos
                </button>
            </div>

            <div style={styles.details}>
              {product.duration_days && <div style={styles.detailItem}><FiClock size={12}/> {product.duration_days} días</div>}
              {product.has_renewal && product.renewal_price_usd && (
                 <div style={styles.renewal}><FiRefreshCw size={12}/> Renovable (${product.renewal_price_usd})</div>
              )}
            </div>

            <div style={styles.priceContainer}>
              {renderPrice()}
              
              {!isOutOfStock ? (
                <button 
                  onClick={handleOpenPurchaseModal}
                  style={{...styles.addToCartButton, ...(hoverStates.cartBtn && styles.addToCartButtonHover)}}
                  onMouseEnter={() => handleHover('cartBtn', true)}
                  onMouseLeave={() => handleHover('cartBtn', false)}
                >
                  <div style={{...styles.buttonGlow, ...(hoverStates.cartBtn && styles.buttonGlowHover)}} />
                  <FiShoppingCart size={16} /> Agregar al Carrito
                </button>
              ) : (
                <div style={styles.outOfStockText}>
                  <FiAlertCircle size={16} /> Sin Stock
                </div>
              )}
            </div>
          </div>
        </article>
      </Link>

      {/* --- MODAL DE COMPRA (El mismo de ProductPage) --- */}
      {isPurchaseModalOpen && (
        // El div wrapper detiene la propagación al hacer clic fuera del contenido del modal pero dentro del overlay
        <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
            <PurchaseModal
              product={product}
              onClose={handleClosePurchaseModal}
              onAddToCart={handleConfirmAddToCart}
            />
        </div>
      )}

      {/* MODAL DETALLES */}
      {showDetails && (
        <div style={styles.modalOverlay} onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowDetails(false); }}>
            <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                <button style={styles.modalClose} onClick={() => setShowDetails(false)}><FiX /></button>
                <h3 style={styles.modalTitle}><FiInfo color="#00BFFF" /> Detalles del Producto</h3>
                <div style={styles.modalBody}>
                    {product.description || "No hay descripción disponible."}
                </div>
            </div>
        </div>
      )}

      {/* MODAL TÉRMINOS */}
      {showTerms && (
        <div style={styles.modalOverlay} onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowTerms(false); }}>
            <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                <button style={styles.modalClose} onClick={() => setShowTerms(false)}><FiX /></button>
                <h3 style={styles.modalTitle}><FiShield color="#2ecc71" /> Términos y Condiciones</h3>
                <div style={styles.modalBody}>
                    {product.terms_conditions || "Garantía estándar de funcionamiento."}
                </div>
            </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;