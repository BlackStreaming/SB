// src/features/shop/ProductPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../services/apiClient';
import PurchaseModal from '../components/product/PurchaseModal';
import { useCart } from '../context/CartContext';
import { 
  FiShoppingCart, FiPackage, FiClock, FiRefreshCw, FiTag, 
  FiCheckCircle, FiXCircle, FiAlertTriangle, FiStar, FiUser,
  FiArrowLeft, FiShield, FiTruck, FiZap, FiBox
} from 'react-icons/fi';

// --- Estilos Unified Compact Theme (Dark Glass - Detail Page) ---
const styles = {
  container: { 
    padding: '40px 20px', 
    fontFamily: "'Inter', sans-serif", 
    background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 50%, #0f0f0f 100%)',
    minHeight: '100vh',
    position: 'relative',
    overflow: 'hidden',
    color: '#e0e0e0',
    display: 'flex',
    justifyContent: 'center'
  },
  backgroundDecoration: {
    position: 'absolute', top: 0, right: 0, width: '600px', height: '600px',
    background: 'radial-gradient(circle, rgba(102, 126, 234, 0.15) 0%, transparent 70%)', zIndex: 0
  },
  
  contentWrapper: {
    maxWidth: '1200px',
    width: '100%',
    position: 'relative',
    zIndex: 1
  },

  backLink: {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    color: '#a0a0a0', textDecoration: 'none', marginBottom: '24px',
    fontSize: '0.9rem', fontWeight: '600', transition: 'color 0.3s',
    cursor: 'pointer'
  },

  // Grid Principal
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '40px',
    alignItems: 'start'
  },

  // Sección Imagen
  imageCard: {
    background: 'rgba(30, 30, 30, 0.6)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
    position: 'relative',
    overflow: 'hidden'
  },
  productImage: {
    width: '100%',
    maxHeight: '450px',
    objectFit: 'contain',
    filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))',
    transition: 'transform 0.3s ease'
  },
  
  // Sección Info
  infoSection: {
    display: 'flex', flexDirection: 'column', gap: '24px'
  },
  
  // Header Info
  headerInfo: {
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    paddingBottom: '20px'
  },
  categoryBadge: {
    background: 'rgba(102, 126, 234, 0.15)', color: '#667eea',
    padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: '1px', display: 'inline-block', marginBottom: '12px'
  },
  title: {
    fontSize: '2.5rem', fontWeight: '800', color: '#fff', margin: '0 0 8px 0', lineHeight: 1.2
  },
  providerLink: {
    display: 'flex', alignItems: 'center', gap: '6px', color: '#a0a0a0', fontSize: '0.95rem',
    textDecoration: 'none', transition: 'color 0.2s'
  },

  // Precio y Stock
  priceStockRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px',
    background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)'
  },
  priceWrapper: { display: 'flex', flexDirection: 'column' },
  mainPrice: {
    fontSize: '2.2rem', fontWeight: '800',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
  },
  oldPrice: { fontSize: '1.2rem', color: '#666', textDecoration: 'line-through', marginLeft: '10px' },
  conversion: { fontSize: '0.9rem', color: '#888', fontStyle: 'italic', marginTop: '4px' },
  
  badgesWrapper: {
      display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px'
  },
  stockBadge: {
    padding: '8px 16px', borderRadius: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem'
  },
  inStock: { background: 'rgba(39, 174, 96, 0.2)', color: '#2ecc71', border: '1px solid rgba(39, 174, 96, 0.3)' },
  outOfStock: { background: 'rgba(220, 53, 69, 0.2)', color: '#ff6b6b', border: '1px solid rgba(220, 53, 69, 0.3)' },

  // Botón Compra
  actionSection: { marginTop: '10px' },
  buyButton: {
    width: '100%', padding: '18px', border: 'none', borderRadius: '16px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white', fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
    transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden',
    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
  },
  buyButtonDisabled: { background: '#333', color: '#666', cursor: 'not-allowed', boxShadow: 'none' },
  buttonGlow: {
    position: 'absolute', top: 0, left: '-100%', width: '100%', height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
    transition: 'left 0.5s ease'
  },

  // Detalles
  detailsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '10px' },
  detailItem: {
    background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px',
    display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid rgba(255,255,255,0.05)'
  },
  detailIcon: { color: '#667eea', fontSize: '20px' },
  detailLabel: { fontSize: '0.8rem', color: '#888', display: 'block' },
  detailValue: { fontSize: '1rem', color: '#e0e0e0', fontWeight: '600' },

  // Descripción y Términos
  textSection: {
    background: 'rgba(25, 25, 25, 0.6)', borderRadius: '16px', padding: '24px',
    border: '1px solid rgba(255,255,255,0.05)', lineHeight: '1.6'
  },
  sectionHeaderSmall: { fontSize: '1.2rem', fontWeight: '700', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' },
  paragraph: { color: '#b0b0b0', fontSize: '0.95rem', whiteSpace: 'pre-line' },

  // Tags
  tagsContainer: { display: 'flex', flexWrap: 'wrap', gap: '10px' },
  tag: {
    background: 'rgba(255,255,255,0.05)', padding: '6px 14px', borderRadius: '20px',
    fontSize: '0.8rem', color: '#ccc', display: 'flex', alignItems: 'center', gap: '6px',
    border: '1px solid rgba(255,255,255,0.1)'
  },

  // Loading / Error
  centerState: { 
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
    height: '60vh', textAlign: 'center', color: '#a0a0a0' 
  },
  pulse: { animation: 'pulse 2s infinite' }
};

// --- HELPER: Obtener Estilo del Tipo de Venta ---
const getTypeBadge = (status) => {
    switch (status) {
        case 'en stock':
            return { text: 'Entrega Inmediata', color: '#2ecc71', icon: <FiZap /> };
        case 'a pedido':
            return { text: 'A Pedido (Manual)', color: '#f1c40f', icon: <FiPackage /> };
        case 'activacion':
            return { text: 'Activación (Email)', color: '#9b59b6', icon: <FiRefreshCw /> };
        default:
            return { text: 'Digital', color: '#a0a0a0', icon: <FiBox /> };
    }
};

const ProductPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // --- TIPO DE CAMBIO FIJO ---
  const exchangeRate = 3.55;

  const { addToCart } = useCart();

  useEffect(() => {
    // Fetch Producto
    const fetchProduct = async () => {
      if (!slug) return setError('Producto no especificado.');
      try {
        setLoading(true);
        const response = await apiClient.get(`/products/${slug}`);
        setProduct(response.data);
      } catch (err) {
        setError('No se pudo cargar el producto.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const getConversion = (usd) => (usd * exchangeRate).toFixed(2);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.centerState}>
          <FiRefreshCw size={48} color="#667eea" className="spin" />
          <h2 style={{marginTop: 20}}>Cargando producto...</h2>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } } .spin { animation: spin 1s linear infinite; }`}</style>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={styles.container}>
        <div style={styles.centerState}>
          <FiAlertTriangle size={48} color="#ff6b6b" />
          <h2 style={{marginTop: 20, color:'#ff6b6b'}}>Producto no encontrado</h2>
          <p>{error || 'El producto que buscas no existe.'}</p>
          <Link to="/" style={{marginTop: 20, color: '#667eea'}}>Volver al inicio</Link>
        </div>
      </div>
    );
  }

  const isStockAvailable = product.stock_quantity > 0 && product.status !== 'agotado';
  const finalPrice = product.offer_price_usd || product.price_usd;
  
  // Obtener datos visuales del tipo de venta
  const typeInfo = getTypeBadge(product.status);

  return (
    <div style={styles.container}>
      <div style={styles.backgroundDecoration} />
      
      <div style={styles.contentWrapper}>
        {/* Botón Volver */}
        <Link to="/" style={styles.backLink}>
           <FiArrowLeft /> Volver a la tienda
        </Link>

        <div style={styles.grid}>
          
          {/* Columna Izquierda: Imagen */}
          <div style={styles.imageCard}>
             <img 
               src={product.image_url || 'https://placehold.co/600x600/1a1a1a/666?text=No+Image'} 
               alt={product.name} 
               style={styles.productImage}
               onError={(e) => e.target.src='https://placehold.co/600x600/1a1a1a/666?text=No+Image'}
             />
             {product.offer_price_usd && (
                 <div style={{position:'absolute', top:20, right:20, background:'#ff6b6b', color:'white', padding:'8px 16px', borderRadius:'20px', fontWeight:'bold', boxShadow:'0 4px 15px rgba(255,107,107,0.4)'}}>
                     OFERTA
                 </div>
             )}
          </div>

          {/* Columna Derecha: Información */}
          <div style={styles.infoSection}>
              
             <div style={styles.headerInfo}>
                <span style={styles.categoryBadge}>{product.category_name || 'Digital'}</span>
                <h1 style={styles.title}>{product.name}</h1>
                
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <div style={styles.providerLink}>
                        <FiUser /> Vendido por: <strong style={{color:'#fff', marginLeft:4}}>{product.provider_name}</strong>
                    </div>
                    <div style={{display:'flex', alignItems:'center', color:'#FFD700', gap:4}}>
                        <FiStar fill="#FFD700"/> <span>{parseFloat(product.provider_rating || 5).toFixed(1)}</span>
                    </div>
                </div>
             </div>

             {/* Precio y Stock */}
             <div style={styles.priceStockRow}>
                <div style={styles.priceWrapper}>
                    <div style={{display:'flex', alignItems:'baseline'}}>
                        <span style={styles.mainPrice}>${finalPrice}</span>
                        {(product.offer_price_usd || product.fictitious_price_usd) && (
                            <span style={styles.oldPrice}>
                                ${product.fictitious_price_usd || product.price_usd}
                            </span>
                        )}
                    </div>
                    <span style={styles.conversion}>Aproximado: S/ {getConversion(finalPrice)}</span>
                </div>
                
                <div style={styles.badgesWrapper}>
                    {/* BADGE DE TIPO DE VENTA */}
                    <div style={{...styles.stockBadge, background: `${typeInfo.color}22`, color: typeInfo.color, border: `1px solid ${typeInfo.color}44`}}>
                        {typeInfo.icon} {typeInfo.text}
                    </div>

                    {/* BADGE DE STOCK */}
                    <div style={isStockAvailable ? {...styles.stockBadge, ...styles.inStock} : {...styles.stockBadge, ...styles.outOfStock}}>
                        {isStockAvailable ? <FiCheckCircle /> : <FiXCircle />}
                        {isStockAvailable ? `Stock: ${product.stock_quantity}` : 'Agotado'}
                    </div>
                </div>
             </div>

             {/* Botón de Acción */}
             <div style={styles.actionSection}>
                <button 
                    style={{...styles.buyButton, ...(isStockAvailable ? {} : styles.buyButtonDisabled)}}
                    onClick={() => isStockAvailable && setIsModalOpen(true)}
                    disabled={!isStockAvailable}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div style={{...styles.buttonGlow, ...(isHovered && {left: '100%'})}} />
                    <FiShoppingCart size={20} /> 
                    {isStockAvailable ? 'Comprar Ahora' : 'Sin Stock Disponible'}
                </button>
             </div>

             {/* Detalles Grid */}
             <div style={styles.detailsGrid}>
                <div style={styles.detailItem}>
                    <FiClock style={styles.detailIcon}/>
                    <div>
                        <span style={styles.detailLabel}>Duración</span>
                        <span style={styles.detailValue}>{product.duration_days || 'N/A'} días</span>
                    </div>
                </div>
                <div style={styles.detailItem}>
                    <FiTruck style={styles.detailIcon}/>
                    <div>
                        <span style={styles.detailLabel}>Entrega</span>
                        <span style={styles.detailValue}>{product.delivery_time || 'Inmediata'}</span>
                    </div>
                </div>
                <div style={styles.detailItem}>
                    <FiRefreshCw style={styles.detailIcon}/>
                    <div>
                        <span style={styles.detailLabel}>Renovación</span>
                        <span style={styles.detailValue}>
                             {product.has_renewal ? `$${product.renewal_price_usd}` : 'No'}
                        </span>
                    </div>
                </div>
                <div style={styles.detailItem}>
                    <FiShield style={styles.detailIcon}/>
                    <div>
                        <span style={styles.detailLabel}>Garantía</span>
                        <span style={styles.detailValue}>Sí</span>
                    </div>
                </div>
             </div>

             {/* Descripción */}
             <div style={styles.textSection}>
                <div style={styles.sectionHeaderSmall}><FiPackage /> Descripción</div>
                <p style={styles.paragraph}>{product.description || 'Sin descripción detallada.'}</p>
                
                {product.tags && product.tags.length > 0 && (
                    <div style={{marginTop: 20}}>
                        <div style={styles.tagsContainer}>
                            {product.tags.map((tag, i) => (
                                <span key={i} style={styles.tag}><FiTag size={12}/> {tag}</span>
                            ))}
                        </div>
                    </div>
                )}
             </div>

             {/* Términos */}
             {product.terms_conditions && (
                 <div style={{...styles.textSection, background:'rgba(255, 193, 7, 0.05)', borderColor:'rgba(255, 193, 7, 0.2)'}}>
                    <div style={{...styles.sectionHeaderSmall, color:'#ffc107'}}><FiAlertTriangle /> Términos y Condiciones</div>
                    <p style={{...styles.paragraph, color:'#ddd', fontSize:'0.9rem'}}>
                        {product.terms_conditions}
                    </p>
                 </div>
             )}

          </div>
        </div>
      </div>

      {/* Modal de Compra */}
      {isModalOpen && (
        <PurchaseModal
          product={product}
          onClose={() => setIsModalOpen(false)}
          onAddToCart={(data) => {
            addToCart(data.product, {
              customerName: data.customerName,
              customerPhone: data.customerPhone,
            });
            setIsModalOpen(false);
          }}
        />
      )}

      {/* Animación CSS global para este componente */}
      <style>
        {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } } .spin { animation: spin 1s linear infinite; }`}
      </style>
    </div>
  );
};

export default ProductPage;