// src/components/ProductCard.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiShoppingCart, FiFileText, FiInfo, FiRefreshCw, FiUser, FiX, FiStar, FiAlertTriangle, FiTag
} from 'react-icons/fi';

import { useCart } from '/src/context/CartContext'; 
import apiClient from '/src/services/apiClient.js'; 

import PurchaseModal from './PurchaseModal';

// --- COMPONENTE ESTRELLAS ---
const RatingStars = ({ rating }) => {
  if (!rating) return null;
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const empty = 5 - fullStars - (hasHalf ? 1 : 0);
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginTop: '4px' }}>
      {[...Array(fullStars)].map((_, i) => <FiStar key={`f-${i}`} size={12} fill="#FFD700" color="#FFD700" />)}
      {hasHalf && <FiStar size={12} style={{ clipPath: 'inset(0 50% 0 0)' }} fill="#FFD700" color="#FFD700" />}
      {[...Array(empty)].map((_, i) => <FiStar key={`e-${i}`} size={12} fill="none" color="#444" />)}
      <span style={{ fontSize: '0.7rem', color: '#777', marginLeft: '4px', fontWeight: '500' }}>
        {parseFloat(rating).toFixed(1)}
      </span>
    </div>
  );
};

// --- ESTILOS OPTIMIZADOS ---
const styles = {
  cardWrapper: {
    textDecoration: 'none', color: 'inherit', display: 'block', height: '100%', position: 'relative',
  },
  card: {
    backgroundColor: '#111', borderRadius: '16px', border: '1px solid #2a2a2a', 
    display: 'flex', flexDirection: 'column', overflow: 'hidden', 
    position: 'relative',
    height: '100%', minHeight: '480px', 
    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
    boxShadow: '0 4px 15px rgba(0,0,0,0.4)', fontFamily: "'Inter', 'Roboto', sans-serif",
    
    // --- FIX: ESTAS PROPIEDADES EVITAN EL TEMBLOR AL SCROLLEAR ---
    transform: 'translateZ(0)',       // Fuerza aceleración por hardware (GPU)
    backfaceVisibility: 'hidden',     // Evita parpadeos en renderizado
    willChange: 'transform',          // Optimiza la preparación de la animación
    zIndex: 1,                        // Establece contexto de apilamiento firme
  },
  cardHover: {
    // Usamos translate3d para asegurar que el movimiento siga en la GPU
    transform: 'translate3d(0, -6px, 0)', 
    borderColor: '#444', 
    boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
  },

  // CINTA (RIBBON)
  ribbonWrapper: {
    position: 'absolute', width: '110px', height: '110px', overflow: 'hidden', top: '-6px', left: '-6px', zIndex: 10,
  },
  ribbon: {
    position: 'absolute', top: '22px', left: '-38px', width: '160px', padding: '8px 0',
    textAlign: 'center', transform: 'rotate(-45deg)', fontSize: '0.7rem', fontWeight: '900',
    textTransform: 'uppercase', color: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.6)', letterSpacing: '0.5px',
  },
  // Colores Cinta
  ribbonGreen:  { background: 'linear-gradient(90deg, #16a34a 0%, #22c55e 100%)' }, 
  ribbonYellow: { background: 'linear-gradient(90deg, #ca8a04 0%, #eab308 100%)', color: '#000' },
  ribbonBlue:   { background: 'linear-gradient(90deg, #0284c7 0%, #0ea5e9 100%)' },
  ribbonRed:    { background: 'linear-gradient(90deg, #dc2626 0%, #ef4444 100%)' },

  // SIDEBAR
  sidebar: {
    position: 'absolute', top: '12px', right: '12px', zIndex: 20, display: 'flex', flexDirection: 'column', gap: '8px',
  },
  sidebarBtn: {
    width: '36px', height: '36px', borderRadius: '50%', 
    background: 'rgba(30, 30, 30, 0.8)', border: '1px solid rgba(255,255,255,0.4)',
    backdropFilter: 'blur(4px)', color: '#fff', 
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
  },
  sidebarBtnHover: {
    background: '#fff', color: '#000', transform: 'scale(1.1)', borderColor: '#fff'
  },

  // IMAGEN
  imageArea: {
    height: '190px', background: 'radial-gradient(circle, #1f1f1f 0%, #0d0d0d 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    position: 'relative', borderBottom: '1px solid #222', padding: '10px',
  },
  image: {
    width: '100%', height: '100%', objectFit: 'contain', transition: 'transform 0.4s ease', filter: 'drop-shadow(0 5px 15px rgba(0,0,0,0.4))'
  },
  
  // BADGES (OFERTA / NUEVO)
  badgeContainer: {
    position: 'absolute', bottom: '10px', left: '12px', display: 'flex', gap: '6px', zIndex: 5,
  },
  badge: {
    padding: '4px 10px', borderRadius: '20px', fontSize: '0.65rem', fontWeight: '800',
    textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)', letterSpacing: '0.5px',
  },
  pillOffer: { background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', color: '#000', border: 'none' },
  pillDiscount: { background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', color: '#fff' },
  pillNew: { background: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)', color: '#fff' },

  // BODY
  body: { padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' },
  category: { fontSize: '0.65rem', color: '#818cf8', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' },
  title: {
    fontSize: '1rem', fontWeight: '700', color: '#fff', lineHeight: '1.4', marginBottom: '8px',
    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '2.8em'
  },

  // GRID INFO
  infoGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px',
    marginTop: 'auto', marginBottom: '16px', paddingTop: '16px', borderTop: '1px dashed #333',
  },
  colLeft: { display: 'flex', flexDirection: 'column', borderRight: '1px solid #222', paddingRight: '10px' },
  
  // STOCK STYLES
  stockLabel: { fontSize: '0.7rem', color: '#666', marginBottom: '4px', fontWeight: '600', textTransform: 'uppercase' },
  stockValue: { fontWeight: 'bold' },
  stockRed: { color: '#ef4444' }, // Rojo para 0
  stockGreen: { color: '#4ade80' }, // Verde para > 0
  
  priceMain: { 
    fontSize: '1.6rem', fontWeight: '900', 
    background: 'linear-gradient(90deg, #fff, #ccc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    lineHeight: '1', marginTop: '4px' 
  },
  priceSub: { fontSize: '0.75rem', color: '#888', marginTop: '2px', fontStyle: 'italic' },

  colRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-end', textAlign: 'right' },
  provider: { fontSize: '0.7rem', color: '#aaa', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px' },

  // TOOLTIP STYLES
  tooltipWrapper: { position: 'relative', display: 'inline-block' },
  statusBadge: {
    padding: '4px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '700',
    display: 'flex', alignItems: 'center', gap: '6px', cursor: 'help', transition: '0.2s',
  },
  statusRenewable: { background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)' },
  statusNoRenewable: { background: 'rgba(234, 179, 8, 0.15)', color: '#fbbf24', border: '1px solid rgba(234, 179, 8, 0.3)' },
  
  tooltipBox: {
    position: 'absolute', bottom: '120%', right: 0, width: '200px',
    background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '8px',
    padding: '10px', fontSize: '0.7rem', lineHeight: '1.4', zIndex: 100,
    boxShadow: '0 10px 20px rgba(0,0,0,0.5)', pointerEvents: 'none', textAlign: 'left',
  },
  tooltipArrow: {
    position: 'absolute', bottom: '-5px', right: '15px', width: '10px', height: '10px',
    background: '#222', borderRight: '1px solid #444', borderBottom: '1px solid #444', transform: 'rotate(45deg)',
  },
  oldPrice: { fontSize: '0.7rem', color: '#555', textDecoration: 'line-through', marginTop: '6px' },

  // BOTÓN
  btnContainer: { width: '100%' },
  addToCartButton: {
    width: '100%', padding: '12px 0', border: 'none', 
    borderRadius: '50px', 
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
    color: 'white', fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer', 
    display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden',
    boxShadow: '0 5px 15px rgba(102, 126, 234, 0.3)',
  },
  addToCartButtonHover: { 
    transform: 'translateY(-2px)', boxShadow: '0 8px 25px rgba(102, 126, 234, 0.5)', filter: 'brightness(1.1)'
  },
  btnDisabled: {
    width: '100%', padding: '12px 0', borderRadius: '50px',
    background: 'rgba(50, 50, 50, 0.5)', color: '#888',
    border: '1px solid #444',
    cursor: 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: '700',
    textTransform: 'uppercase'
  },
  
  // MODALES
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' },
  modalContent: { background: '#181818', border: '1px solid #333', borderRadius: '12px', padding: '30px', width: '100%', maxWidth: '420px', color: '#eee' },
  modalClose: { float: 'right', background: 'transparent', border: 'none', color: '#777', fontSize: '1.5rem', cursor: 'pointer' },
  modalTitle: { margin: '0 0 15px 0', fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '10px', color: '#fff' },
  modalBody: { fontSize: '0.95rem', lineHeight: '1.6', color: '#bbb', whiteSpace: 'pre-line' }
};

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [hover, setHover] = useState(false);
  const [btnHover, setBtnHover] = useState(false);
  const [hoverTooltip, setHoverTooltip] = useState(false);
  const [hoverSidebar, setHoverSidebar] = useState(null); 
  
  const [showDetails, setShowDetails] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

  // 2. ESTADO PARA LA TASA DE CAMBIO
  const [exchangeRate, setExchangeRate] = useState(3.55); // Valor por defecto

  // 3. OBTENER TASA (Optimizado con sessionStorage)
  useEffect(() => {
    const fetchRate = async () => {
        // Intenta leer de caché primero
        const cachedRate = sessionStorage.getItem('exchangeRate');
        if (cachedRate) {
            setExchangeRate(parseFloat(cachedRate));
        }

        // Si no hay caché, o para actualizar en segundo plano:
        try {
            const res = await apiClient.get('/config/recharge');
            if (res.data && res.data.exchange_rate) {
                setExchangeRate(res.data.exchange_rate);
                sessionStorage.setItem('exchangeRate', res.data.exchange_rate);
            }
        } catch (err) {
            console.error("Error cargando tasa en card:", err);
        }
    };
    fetchRate();
  }, []);

  if (!product) return null;

  // --- LÓGICA DE STOCK ---
  const stock = parseInt(product.stock_quantity || 0);
  const isTrulyOutOfStock = stock <= 0 || product.status === 'agotado';

  // --- LÓGICA DE CINTA (RIBBON) ---
  let ribbonConf = { text: 'EN STOCK', style: styles.ribbonGreen };

  if (isTrulyOutOfStock) {
    ribbonConf = { text: 'AGOTADO', style: styles.ribbonRed };
  } else if (product.status === 'a pedido') {
    ribbonConf = { text: 'A PEDIDO', style: styles.ribbonYellow };
  } else if (product.status === 'activacion') {
    ribbonConf = { text: 'ACTIVACIÓN', style: styles.ribbonBlue };
  }

  // --- DATOS PRECIOS ---
  const hasOffer = !!product.offer_price_usd;
  const finalPrice = hasOffer ? product.offer_price_usd : product.price_usd;
  const oldPrice = hasOffer ? (product.fictitious_price_usd || product.price_usd) : product.fictitious_price_usd;
  const discountPercent = oldPrice ? Math.round(((oldPrice - finalPrice) / oldPrice) * 100) : 0;
  const renewalPrice = product.renewal_price_usd ? product.renewal_price_usd : finalPrice;

  // --- TOOLTIP RENOVACIÓN ---
  const isRenewable = product.has_renewal;
  const tooltipText = isRenewable 
    ? `Este pedido puede ser renovado por $${renewalPrice} para poder usar la misma cuenta comprada.`
    : `Este pedido no tiene renovación, activo solo los dias que estan indicados (${product.duration_days || '?'}), luego tendra que volver a comprarlo.`;

  const handleAddToCart = (e) => { 
    e.preventDefault(); 
    setIsPurchaseModalOpen(true); 
  };

  const confirmAddToCart = (data) => {
    addToCart(data.product, { customerName: data.customerName, customerPhone: data.customerPhone });
    setIsPurchaseModalOpen(false);
  };

  return (
    <>
      <Link 
        to={`/producto/${product.slug}`} 
        style={styles.cardWrapper}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <article style={{...styles.card, ...(hover && styles.cardHover)}}>
          
          {/* CINTA SUPERIOR */}
          <div style={styles.ribbonWrapper}>
            <div style={{...styles.ribbon, ...ribbonConf.style}}>
              {ribbonConf.text}
            </div>
          </div>

          {/* SIDEBAR ICONOS */}
          <div style={styles.sidebar}>
            <button 
              onClick={(e)=>{e.preventDefault(); setShowDetails(true)}} 
              style={{...styles.sidebarBtn, ...(hoverSidebar === 'details' && styles.sidebarBtnHover)}} 
              onMouseEnter={() => setHoverSidebar('details')}
              onMouseLeave={() => setHoverSidebar(null)}
              title="Ver Detalles"
            >
              <FiInfo size={18}/>
            </button>
            <button 
              onClick={(e)=>{e.preventDefault(); setShowTerms(true)}} 
              style={{...styles.sidebarBtn, ...(hoverSidebar === 'terms' && styles.sidebarBtnHover)}} 
              onMouseEnter={() => setHoverSidebar('terms')}
              onMouseLeave={() => setHoverSidebar(null)}
              title="Términos"
            >
              <FiFileText size={18}/>
            </button>
          </div>

          {/* IMAGEN Y BADGES */}
          <div style={styles.imageArea}>
            <img 
              src={product.image_url || 'https://via.placeholder.com/300?text=Digital'} 
              alt={product.name} 
              style={{...styles.image, transform: hover ? 'scale(1.08)' : 'scale(1)'}}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
            />
            
            <div style={styles.badgeContainer}>
              {hasOffer ? (
                <div style={{...styles.badge, ...styles.pillOffer}}>
                  <FiTag /> OFERTA
                </div>
              ) : (
                <div style={{...styles.badge, ...styles.pillNew}}>
                  NUEVO
                </div>
              )}
              {discountPercent > 0 && (
                <div style={{...styles.badge, ...styles.pillDiscount}}>
                  -{discountPercent}%
                </div>
              )}
            </div>
          </div>

          {/* CONTENIDO */}
          <div style={styles.body}>
            <div style={styles.category}>{product.category_name || 'DIGITAL'}</div>
            <h3 style={styles.title}>{product.name}</h3>
            <RatingStars rating={product.provider_rating || 5} />

            <div style={styles.infoGrid}>
              {/* IZQUIERDA: PRECIO Y STOCK */}
              <div style={styles.colLeft}>
                <div style={styles.stockLabel}>
                  Stock:{' '}
                  <span style={{ 
                    ...styles.stockValue, 
                    ...(stock > 0 ? styles.stockGreen : styles.stockRed)
                  }}>
                    {stock} und.
                  </span>
                </div>
                <div>
                  <div style={styles.priceMain}>${finalPrice}</div>
                  <div style={styles.priceSub}>
                    {/* 4. AQUI SE APLICA LA TASA DINÁMICA */}
                    S/ {(finalPrice * exchangeRate).toFixed(2)}
                  </div>
                </div>
              </div>

              {/* DERECHA: PROVEEDOR Y RENOVACIÓN */}
              <div style={styles.colRight}>
                <div style={styles.provider}>
                  <FiUser size={12}/> {product.provider_name || 'Oficial'}
                </div>
                
                <div 
                  style={styles.tooltipWrapper}
                  onMouseEnter={() => setHoverTooltip(true)}
                  onMouseLeave={() => setHoverTooltip(false)}
                >
                  {isRenewable ? (
                    <div style={{...styles.statusBadge, ...styles.statusRenewable}}>
                      <FiRefreshCw size={12}/> Renovable: ${renewalPrice}
                    </div>
                  ) : (
                    <div style={{...styles.statusBadge, ...styles.statusNoRenewable}}>
                      <FiAlertTriangle size={12}/> Sin Renovación
                    </div>
                  )}

                  {hoverTooltip && (
                    <div style={styles.tooltipBox}>
                      {tooltipText}
                      <div style={styles.tooltipArrow}></div>
                    </div>
                  )}
                </div>

                {oldPrice && (
                  <div style={styles.oldPrice}>
                    Antes: ${oldPrice}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* BOTÓN BLOQUEADO SI NO HAY STOCK */}
          <div style={styles.btnContainer}>
            {!isTrulyOutOfStock ? (
              <button 
                onClick={handleAddToCart}
                style={{...styles.addToCartButton, ...(btnHover && styles.addToCartButtonHover)}}
                onMouseEnter={() => setBtnHover(true)}
                onMouseLeave={() => setBtnHover(false)}
              >
                <FiShoppingCart size={18} /> AGREGAR AL CARRITO
              </button>
            ) : (
              <div style={styles.btnDisabled}>
                <FiX size={18} /> SIN STOCK
              </div>
            )}
          </div>

        </article>
      </Link>

      {/* MODALES */}
      {showDetails && (
        <div style={styles.modalOverlay} onClick={(e) => {e.preventDefault(); setShowDetails(false)}}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button style={styles.modalClose} onClick={() => setShowDetails(false)}>
              <FiX/>
            </button>
            <h3 style={styles.modalTitle}>
              <FiInfo color="#818cf8"/> Detalles
            </h3>
            <div style={styles.modalBody}>{product.description || "Sin descripción."}</div>
          </div>
        </div>
      )}

      {showTerms && (
        <div style={styles.modalOverlay} onClick={(e) => {e.preventDefault(); setShowTerms(false)}}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button style={styles.modalClose} onClick={() => setShowTerms(false)}>
              <FiX/>
            </button>
            <h3 style={styles.modalTitle}>
              <FiFileText color="#10b981"/> Términos
            </h3>
            <div style={styles.modalBody}>{product.terms_conditions || "Garantía de funcionamiento."}</div>
          </div>
        </div>
      )}

      {isPurchaseModalOpen && (
        <div onClick={(e) => {e.preventDefault(); e.stopPropagation()}}>
          <PurchaseModal 
            product={product} 
            onClose={() => setIsPurchaseModalOpen(false)} 
            onAddToCart={confirmAddToCart} 
          />
        </div>
      )}
    </>
  );
};

export default ProductCard;
