import React, { useState, memo } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiShoppingCart, FiFileText, FiInfo, FiRefreshCw, FiUser, FiX, FiStar, FiAlertTriangle, FiTag
} from 'react-icons/fi';
import { useCart } from '/src/context/CartContext'; 
import PurchaseModal from './PurchaseModal';
import './ProductCard.css'; // Importamos el CSS corregido

// Memoizamos las estrellas
const RatingStars = memo(({ rating }) => {
  if (!rating) return null;
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const empty = 5 - fullStars - (hasHalf ? 1 : 0);
  
  return (
    <div className="stars-container">
      {[...Array(fullStars)].map((_, i) => <FiStar key={`f-${i}`} size={12} fill="#FFD700" color="#FFD700" />)}
      {hasHalf && <FiStar size={12} style={{ clipPath: 'inset(0 50% 0 0)' }} fill="#FFD700" color="#FFD700" />}
      {[...Array(empty)].map((_, i) => <FiStar key={`e-${i}`} size={12} fill="none" color="#444" />)}
      <span className="rating-number">
        {parseFloat(rating).toFixed(1)}
      </span>
    </div>
  );
});

const ProductCard = ({ product, exchangeRate = 3.55 }) => {
  const { addToCart } = useCart();
  const [showDetails, setShowDetails] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

  if (!product) return null;

  // --- LÓGICA DE STOCK ---
  const stock = parseInt(product.stock_quantity || 0);
  const isTrulyOutOfStock = stock <= 0 || product.status === 'agotado';

  // --- LÓGICA DE CINTA (RIBBON) ---
  // Mapeamos tu lógica de colores a clases CSS
  let ribbonClass = 'green';
  let ribbonText = 'EN STOCK';

  if (isTrulyOutOfStock) {
    ribbonClass = 'red'; ribbonText = 'AGOTADO';
  } else if (product.status === 'a pedido') {
    ribbonClass = 'yellow'; ribbonText = 'A PEDIDO';
  } else if (product.status === 'activacion') {
    ribbonClass = 'blue'; ribbonText = 'ACTIVACIÓN';
  }

  // --- PRECIOS ---
  const hasOffer = !!product.offer_price_usd;
  const finalPrice = hasOffer ? parseFloat(product.offer_price_usd) : parseFloat(product.price_usd);
  const oldPrice = hasOffer ? (product.fictitious_price_usd || product.price_usd) : product.fictitious_price_usd;
  const discountPercent = oldPrice ? Math.round(((oldPrice - finalPrice) / oldPrice) * 100) : 0;
  const renewalPrice = product.renewal_price_usd ? product.renewal_price_usd : finalPrice;

  // --- LÓGICA DE RENOVACIÓN (TU SCRIPT) ---
  const isRenewable = product.has_renewal;
  
  const tooltipText = isRenewable 
    ? `Este pedido puede ser renovado por $${renewalPrice} para poder usar la misma cuenta comprada.`
    : `Este pedido no tiene renovación, activo solo los dias que estan indicados (${product.duration_days || '?'}), luego tendra que volver a comprarlo.`;

  // Handlers
  const handleAddToCart = (e) => { 
    e.preventDefault(); 
    e.stopPropagation(); 
    setIsPurchaseModalOpen(true); 
  };

  const openModal = (e, setter) => {
    e.preventDefault();
    e.stopPropagation();
    setter(true);
  }

  const confirmAddToCart = (data) => {
    addToCart(data.product, { customerName: data.customerName, customerPhone: data.customerPhone });
    setIsPurchaseModalOpen(false);
  };

  return (
    <>
      <Link to={`/producto/${product.slug}`} className="card-wrapper">
        <article className="product-card">
          
          {/* CINTA */}
          <div className="ribbon-wrapper">
            <div className={`ribbon ${ribbonClass}`}>{ribbonText}</div>
          </div>

          {/* SIDEBAR */}
          <div className="card-sidebar">
            <button className="sidebar-btn" onClick={(e) => openModal(e, setShowDetails)} title="Ver Detalles">
              <FiInfo size={18}/>
            </button>
            <button className="sidebar-btn" onClick={(e) => openModal(e, setShowTerms)} title="Términos">
              <FiFileText size={18}/>
            </button>
          </div>

          {/* IMAGEN */}
          <div className="image-area">
            <img 
              src={product.image_url || 'https://via.placeholder.com/300?text=Digital'} 
              alt={product.name} 
              className="card-image"
              loading="lazy" 
            />
            <div className="badge-container">
              {hasOffer ? (
                <div className="badge offer"><FiTag /> OFERTA</div>
              ) : (
                <div className="badge new">NUEVO</div>
              )}
              {discountPercent > 0 && <div className="badge discount">-{discountPercent}%</div>}
            </div>
          </div>

          {/* CONTENIDO */}
          <div className="card-body">
            <div className="card-cat">{product.category_name || 'DIGITAL'}</div>
            <h3 className="card-title">{product.name}</h3>
            <RatingStars rating={product.provider_rating || 5} />

            <div className="info-grid">
              {/* IZQUIERDA: PRECIO Y STOCK */}
              <div className="col-left">
                <div className="stock-label">
                  Stock: <span className={`stock-value ${stock > 0 ? 'green' : 'red'}`}>{stock} und.</span>
                </div>
                <div>
                  <div className="price-main">${finalPrice}</div>
                  <div className="price-sub">S/ {(finalPrice * exchangeRate).toFixed(2)}</div>
                </div>
              </div>

              {/* DERECHA: PROVEEDOR Y STATUS */}
              <div className="col-right">
                <div className="provider-info">
                   <FiUser size={12}/> {product.provider_name || 'Oficial'}
                </div>
                
                {/* STATUS BADGE CON TOOLTIP */}
                <div className="tooltip-trigger">
                  <div className={`status-badge ${isRenewable ? 'renewable' : 'no-renewable'}`}>
                    {isRenewable 
                      ? <><FiRefreshCw size={12}/> Renovable: ${renewalPrice}</> 
                      : <><FiAlertTriangle size={12}/> Sin Renovación</>
                    }
                  </div>
                  
                  {/* TEXTO FLOTANTE */}
                  <div className="tooltip-box">
                    {tooltipText}
                    <div className="tooltip-arrow"></div>
                  </div>
                </div>

                {oldPrice && <div className="old-price">Antes: ${oldPrice}</div>}
              </div>
            </div>

            {/* BOTÓN */}
            <div className="btn-container">
              {!isTrulyOutOfStock ? (
                <button className="add-btn" onClick={handleAddToCart}>
                  <FiShoppingCart size={18} /> AGREGAR AL CARRITO
                </button>
              ) : (
                <div className="btn-disabled"><FiX size={18} /> SIN STOCK</div>
              )}
            </div>
          </div>
        </article>
      </Link>

      {/* MODALES */}
      {(showDetails || showTerms) && (
        <div className="modal-overlay" onClick={(e) => {e.preventDefault(); setShowDetails(false); setShowTerms(false)}}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
                <h3 className="modal-title">
                   {showDetails ? <><FiInfo color="#818cf8"/> Detalles</> : <><FiFileText color="#10b981"/> Términos</>}
                </h3>
                <button onClick={() => {setShowDetails(false); setShowTerms(false)}} className="modal-close"><FiX size={20}/></button>
            </div>
            <div className="modal-body">
                {showDetails ? (product.description || "Sin descripción.") : (product.terms_conditions || "Garantía de funcionamiento.")}
            </div>
          </div>
        </div>
      )}

      {isPurchaseModalOpen && (
        <div onClick={(e) => {e.preventDefault(); e.stopPropagation()}}>
          <PurchaseModal 
            product={product} 
            exchangeRate={exchangeRate}
            onClose={() => setIsPurchaseModalOpen(false)} 
            onAddToCart={confirmAddToCart} 
          />
        </div>
      )}
    </>
  );
};

export default memo(ProductCard);
