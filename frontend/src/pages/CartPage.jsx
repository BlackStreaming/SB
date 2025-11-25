import React, { useState, useEffect } from 'react';
import apiClient from '/src/services/apiClient.js';
import { 
  FiDollarSign, FiCreditCard, FiFileText, FiSend, FiClock,
  FiCheckCircle, FiXCircle, FiPlusCircle, FiShield, FiList, 
  FiTrendingUp, FiCopy, FiInfo, FiTag, FiTrash2, FiShoppingCart, FiZap, FiAlertCircle
} from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '/src/context/CartContext.jsx'; // Ajusta ruta si es necesario
import { useAuth } from '/src/context/AuthContext.jsx'; // Ajusta ruta si es necesario

// --- Estilos Ultra Modernos & Compactos (Unified) ---
const styles = {
  container: { 
    padding: '40px 24px', 
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", 
    background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 50%, #0f0f0f 100%)',
    minHeight: '100vh',
    position: 'relative',
    overflow: 'hidden'
  },
  backgroundDecoration: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
    zIndex: 0
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexWrap: 'wrap', 
    gap: '32px',
    position: 'relative',
    zIndex: 1
  },
  cartSection: {
    flex: '2 1 600px',
    background: 'rgba(25, 25, 25, 0.8)',
    backdropFilter: 'blur(20px)',
    borderRadius: '28px',
    padding: '32px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    position: 'relative',
    overflow: 'hidden'
  },
  summarySection: {
    flex: '1 1 350px',
    background: 'rgba(25, 25, 25, 0.8)',
    backdropFilter: 'blur(20px)',
    borderRadius: '28px',
    padding: '32px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    height: 'fit-content',
    position: 'sticky',
    top: '2rem',
  },
  headerSection: {
    textAlign: 'center',
    marginBottom: '32px',
    position: 'relative',
    zIndex: 1
  },
  header: { 
    fontSize: '3rem', 
    fontWeight: '800', 
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '16px',
    letterSpacing: '-0.02em',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px'
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#b0b0b0',
    maxWidth: '600px',
    margin: '0 auto',
    lineHeight: '1.6',
    fontWeight: '400'
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '32px',
    paddingBottom: '20px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  },
  sectionTitle: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  sectionCount: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: '700'
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    padding: '24px 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    position: 'relative'
  },
  itemHover: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    transform: 'translateY(-2px)',
    borderRadius: '16px',
    padding: '24px 16px',
    margin: '0 -16px'
  },
  itemImage: {
    width: '100px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: '1.2rem',
    fontWeight: '600',
    margin: '0 0 0.5rem 0',
    color: '#ffffff',
  },
  itemCustomer: {
    fontSize: '0.9rem',
    color: '#a0a0a0',
    margin: '0 0 0.5rem 0',
  },
  itemPrice: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#667eea',
    margin: '0',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  // ESTILOS ELIMINADOS DE CANTIDAD
  
  removeButton: {
    background: 'rgba(220, 53, 69, 0.1)',
    border: '1px solid rgba(220, 53, 69, 0.3)',
    color: '#dc3545',
    cursor: 'pointer',
    padding: '10px 14px',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.85rem',
    fontWeight: '500'
  },
  removeButtonHover: {
    backgroundColor: 'rgba(220, 53, 69, 0.2)',
    transform: 'translateY(-2px)'
  },
  emptyCart: {
    textAlign: 'center',
    padding: '80px 40px',
    color: '#a0a0a0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.05)'
  },
  emptyTitle: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#667eea',
    margin: 0
  },
  shopLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 32px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '16px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    fontSize: '1rem',
    position: 'relative',
    overflow: 'hidden'
  },
  shopLinkHover: {
    transform: 'translateY(-3px)',
    boxShadow: '0 12px 30px rgba(102, 126, 234, 0.4)'
  },
  shopLinkGlow: {
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
    transition: 'left 0.5s ease'
  },
  shopLinkGlowHover: {
    left: '100%'
  },
  summaryTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    margin: '0 0 1.5rem 0',
    color: '#ffffff',
    paddingBottom: '1rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 0',
    fontSize: '1rem',
    color: '#e0e0e0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
  },
  balanceWarning: {
    color: '#ef4444',
    fontWeight: '600',
  },
  balanceSuccess: {
    color: '#27ae60',
    fontWeight: '600',
  },
  summaryTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '1.3rem',
    fontWeight: '700',
    margin: '1.5rem 0',
    padding: '1.5rem 0',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#ffffff'
  },
  checkoutButton: {
    width: '100%',
    padding: '20px 24px',
    border: 'none',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    marginTop: '1.5rem',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
  },
  checkoutButtonHover: {
    transform: 'translateY(-3px)',
    boxShadow: '0 12px 30px rgba(102, 126, 234, 0.4)'
  },
  checkoutButtonDisabled: {
    background: 'linear-gradient(135deg, #666 0%, #999 100%)',
    cursor: 'not-allowed',
    transform: 'none',
    boxShadow: 'none'
  },
  buttonGlow: {
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
    transition: 'left 0.5s ease'
  },
  buttonGlowHover: {
    left: '100%'
  },
  couponContainer: {
    display: 'flex',
    gap: '12px',
    margin: '1.5rem 0',
  },
  couponInput: {
    flex: 1,
    padding: '16px',
    border: '2px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    fontSize: '0.9rem',
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
    transition: 'all 0.3s ease',
    outline: 'none',
    color: '#ffffff',
    fontFamily: 'inherit',
    backdropFilter: 'blur(20px)'
  },
  couponInputFocus: {
    borderColor: '#667eea',
    backgroundColor: 'rgba(35, 35, 35, 0.9)',
    boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.1)'
  },
  couponButton: {
    padding: '16px 20px',
    border: 'none',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
  },
  couponButtonHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)'
  },
  couponApplied: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    borderRadius: '12px',
    color: '#10b981',
    fontSize: '0.9rem',
    fontWeight: '500',
    margin: '1rem 0',
  },
  removeCouponButton: {
    background: 'none',
    border: 'none',
    color: '#ef4444',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: '600',
    padding: '8px 12px',
    borderRadius: '8px',
    transition: 'all 0.2s ease'
  },
  removeCouponButtonHover: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)'
  },
  message: {
    padding: '20px',
    borderRadius: '16px',
    textAlign: 'center',
    fontSize: '0.9rem',
    fontWeight: '500',
    margin: '1rem 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    width: '100%',
    backdropFilter: 'blur(20px)',
    border: '1px solid'
  },
  error: {
    backgroundColor: 'rgba(220, 53, 69, 0.1)',
    color: '#dc3545',
    borderColor: 'rgba(220, 53, 69, 0.3)'
  },
  success: {
    backgroundColor: 'rgba(39, 174, 96, 0.1)',
    color: '#27ae60',
    borderColor: 'rgba(39, 174, 96, 0.3)'
  },
  loginPrompt: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    border: '1px solid rgba(255, 193, 7, 0.3)',
    borderRadius: '12px',
    margin: '1rem 0',
    color: '#ffc107'
  },
  securityNote: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    borderRadius: '12px',
    border: '1px solid rgba(102, 126, 234, 0.3)',
    fontSize: '0.9rem',
    color: '#667eea',
    marginTop: '16px'
  },
  clearCartButton: {
    background: 'rgba(220, 53, 69, 0.1)',
    border: '1px solid rgba(220, 53, 69, 0.3)',
    color: '#dc3545',
    cursor: 'pointer',
    padding: '16px 24px',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '1rem',
    fontWeight: '500',
    marginTop: '2rem',
    width: '100%',
    justifyContent: 'center'
  },
  clearCartButtonHover: {
    backgroundColor: 'rgba(220, 53, 69, 0.2)',
    transform: 'translateY(-2px)'
  }
};

const CartPage = () => {
  const { 
    cartItems, 
    coupon,
    removeFromCart, 
    // updateQuantity, // YA NO LA USAMOS
    clearCart,
    applyCoupon,
    removeCoupon
  } = useCart();

  const { user, isAuthenticated, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [message, setMessage] = useState(null); 
  const [isCouponLoading, setIsCouponLoading] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [hoverStates, setHoverStates] = useState({});
  const [focusedField, setFocusedField] = useState(null);

  // --- CÁLCULO MANUAL DEL DESCUENTO Y TOTAL ---
  // Calculamos el subtotal asumiendo que la cantidad siempre es 1 (por si acaso el contexto tuviera otra cosa)
  const calculatedSubtotal = cartItems.reduce((sum, item) => {
      const price = parseFloat(item.offer_price_usd || item.price_usd) || 0;
      return sum + price; 
  }, 0);

  // Calculamos el descuento visualmente usando el porcentaje del cupón
  const calculatedDiscount = coupon 
      ? (calculatedSubtotal * parseFloat(coupon.discount_percent)) / 100 
      : 0;

  const calculatedTotal = calculatedSubtotal - calculatedDiscount;

  const userBalance = parseFloat(user?.balance_usd || 0);
  const remainingBalance = userBalance - calculatedTotal;
  const hasEnoughBalance = remainingBalance >= 0;

  const handleHover = (element, isHovering) => {
    setHoverStates(prev => ({ ...prev, [element]: isHovering }));
  };

  const handleFocus = (field) => {
    setFocusedField(field);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setMessage(null);
    setIsCouponLoading(true);
    try {
      await applyCoupon(couponCode);
      setMessage({ type: 'success', text: '¡Cupón aplicado con éxito!' });
      setCouponCode(''); 
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Error al validar cupón.' });
    } finally {
      setIsCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setMessage({ type: 'success', text: 'Cupón quitado.' });
  };
  
  const handleCheckout = async () => {
    if (!isAuthenticated) {
      setMessage({ type: 'error', text: 'Debes iniciar sesión para comprar.' });
      return;
    }
    
    if (!hasEnoughBalance) {
      setMessage({ type: 'error', text: '¡Saldo insuficiente! Recarga tu cuenta.' });
      return;
    }

    setMessage(null);
    setIsCheckoutLoading(true);

    try {
      const cartData = {
        couponId: coupon ? coupon.id : null,
        cartItems: cartItems.map(item => ({
          productId: item.id,
          quantity: 1, // FORZAMOS CANTIDAD A 1 AL ENVIAR AL BACKEND
          customerName: item.customerName,
          customerPhone: item.customerPhone
        }))
      };

      const response = await apiClient.post('/orders/checkout', cartData); // No necesitas importar checkout si usas apiClient
      
      setMessage({ type: 'success', text: '¡Compra realizada con éxito! Redirigiendo...' });
      
      clearCart(); 
      refreshUser(); 

      setTimeout(() => {
        navigate('/usuario/compras'); // Ajusta la ruta si es diferente en tu router
      }, 2000);

    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error al procesar el pago.';
      setMessage({ type: 'error', text: errorMsg });
      setIsCheckoutLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.backgroundDecoration} />
      
      {/* Header Section */}
      <div style={styles.headerSection}>
        <h1 style={styles.header}>
          <FiShoppingCart size={36} />
          Carrito de Compras
        </h1>
        <p style={styles.subtitle}>
          Revisa tus productos, aplica cupones y finaliza tu compra de forma segura
        </p>
      </div>

      <div style={styles.content}>
        {/* Sección de Items del Carrito */}
        <div style={styles.cartSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>
              <FiShoppingCart size={28} />
              Tus Productos
            </h2>
            <div style={styles.sectionCount}>
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
            </div>
          </div>
          
          {cartItems.length === 0 ? (
            <div style={styles.emptyCart}>
              <FiShoppingCart size={64} color="#667eea" />
              <h3 style={styles.emptyTitle}>Tu carrito está vacío</h3>
              <p style={{ marginBottom: '2rem', color: '#a0a0a0', textAlign: 'center' }}>
                Descubre productos increíbles y añádelos a tu carrito
              </p>
              <Link 
                to="/" 
                style={{
                  ...styles.shopLink,
                  ...(hoverStates.shopLink ? styles.shopLinkHover : {})
                }}
                onMouseEnter={() => handleHover('shopLink', true)}
                onMouseLeave={() => handleHover('shopLink', false)}
              >
                <div style={{
                  ...styles.shopLinkGlow,
                  ...(hoverStates.shopLink ? styles.shopLinkGlowHover : {})
                }} />
                <FiZap size={18} />
                Explorar Productos
              </Link>
            </div>
          ) : (
            <>
              {cartItems.map((item, index) => {
                const price = parseFloat(item.offer_price_usd || item.price_usd) || 0;
                
                return (
                  <div 
                    key={item.cartId} 
                    style={{
                      ...styles.item,
                      ...(hoverStates[`item-${index}`] ? styles.itemHover : {})
                    }}
                    onMouseEnter={() => handleHover(`item-${index}`, true)}
                    onMouseLeave={() => handleHover(`item-${index}`, false)}
                  >
                    <img 
                      src={item.image_url || 'https://placehold.co/100x80/1a1a1a/667eea?text=Producto'} 
                      alt={item.name} 
                      style={styles.itemImage}
                    />
                    <div style={styles.itemDetails}>
                      <h3 style={styles.itemName}>{item.name}</h3>
                      <p style={styles.itemCustomer}>
                        Para: {item.customerName} ({item.customerPhone})
                      </p>
                      <p style={styles.itemPrice}>
                        <FiDollarSign size={14} />
                        {price.toFixed(2)}
                      </p>
                    </div>
                    
                    {/* SECCIÓN DE CANTIDAD ELIMINADA */}

                    <div style={{ textAlign: 'right', minWidth: '120px' }}>
                      <button 
                        onClick={() => removeFromCart(item.cartId)} 
                        style={{
                          ...styles.removeButton,
                          ...(hoverStates[`remove-${index}`] ? styles.removeButtonHover : {})
                        }}
                        onMouseEnter={() => handleHover(`remove-${index}`, true)}
                        onMouseLeave={() => handleHover(`remove-${index}`, false)}
                      >
                        <FiTrash2 size={16} />
                        Eliminar
                      </button>
                    </div>
                  </div>
                );
              })}
              
              <button 
                onClick={clearCart} 
                style={{
                  ...styles.clearCartButton,
                  ...(hoverStates.clearCart ? styles.clearCartButtonHover : {})
                }}
                onMouseEnter={() => handleHover('clearCart', true)}
                onMouseLeave={() => handleHover('clearCart', false)}
              >
                <FiTrash2 size={18} />
                Vaciar Carrito Completo
              </button>
            </>
          )}
        </div>

        {/* Sección de Resumen */}
        <div style={styles.summarySection}>
          <h2 style={styles.summaryTitle}>
            <FiCreditCard size={24} />
            Resumen del Pedido
          </h2>
          
          <div style={styles.summaryRow}>
            <span>Subtotal</span>
            <span>${calculatedSubtotal.toFixed(2)}</span>
          </div>

          {coupon && (
            <div style={{...styles.summaryRow, color: '#10b981'}}>
              <span>Descuento ({coupon.code})</span>
              <span>-${calculatedDiscount.toFixed(2)}</span>
            </div>
          )}
          
          <div style={styles.summaryTotal}>
            <span>Total (USD)</span>
            <span>${calculatedTotal.toFixed(2)}</span>
          </div>

          {/* Información de Saldo */}
          {isAuthenticated && (
            <>
              <div style={styles.summaryRow}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiDollarSign size={16} />
                  Tu Saldo
                </span>
                <span>${userBalance.toFixed(2)}</span>
              </div>
              <div style={{
                ...styles.summaryRow, 
                ...(hasEnoughBalance ? styles.balanceSuccess : styles.balanceWarning)
              }}>
                <span>Saldo Restante</span>
                <span>${remainingBalance.toFixed(2)}</span>
              </div>
            </>
          )}

          {/* Cupón */}
          {!coupon ? (
            <div style={styles.couponContainer}>
              <input 
                type="text"
                placeholder="Código de cupón"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                style={{
                  ...styles.couponInput,
                  ...(focusedField === 'coupon' ? styles.couponInputFocus : {})
                }}
                onFocus={() => handleFocus('coupon')}
                onBlur={handleBlur}
                disabled={isCouponLoading}
              />
              <button 
                onClick={handleApplyCoupon} 
                style={{
                  ...styles.couponButton,
                  ...(hoverStates.couponButton ? styles.couponButtonHover : {})
                }}
                disabled={isCouponLoading}
                onMouseEnter={() => handleHover('couponButton', true)}
                onMouseLeave={() => handleHover('couponButton', false)}
              >
                <FiTag size={16} />
                {isCouponLoading ? '...' : 'Aplicar'}
              </button>
            </div>
          ) : (
            <div style={styles.couponApplied}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiTag size={16} />
                Cupón <strong>{coupon.code}</strong> aplicado
              </span>
              <button 
                onClick={handleRemoveCoupon} 
                style={{
                  ...styles.removeCouponButton,
                  ...(hoverStates.removeCoupon ? styles.removeCouponButtonHover : {})
                }}
                onMouseEnter={() => handleHover('removeCoupon', true)}
                onMouseLeave={() => handleHover('removeCoupon', false)}
              >
                Quitar
              </button>
            </div>
          )}

          {/* Mensajes */}
          {message && (
            <div style={{
              ...styles.message, 
              ...(message.type === 'error' ? styles.error : styles.success) 
            }}>
              {message.type === 'error' ? <FiAlertCircle size={20} /> : <FiCheckCircle size={20} />}
              {message.text}
            </div>
          )}

          {/* Nota de Seguridad */}
          <div style={styles.securityNote}>
            <FiShield size={16} />
            <span>Transacción protegida con encriptación de última generación</span>
          </div>

          {/* Botón de Pago */}
          <button 
            style={{
              ...styles.checkoutButton,
              ...(hoverStates.checkoutButton ? styles.checkoutButtonHover : {}),
              ...((cartItems.length === 0 || !hasEnoughBalance || !isAuthenticated) && styles.checkoutButtonDisabled)
            }}
            onClick={handleCheckout}
            disabled={cartItems.length === 0 || isCheckoutLoading || !hasEnoughBalance || !isAuthenticated}
            onMouseEnter={() => handleHover('checkoutButton', true)}
            onMouseLeave={() => handleHover('checkoutButton', false)}
          >
            <div style={{
              ...styles.buttonGlow,
              ...(hoverStates.checkoutButton ? styles.buttonGlowHover : {})
            }} />
            {isCheckoutLoading ? (
              <>
                <div style={{
                  width: '18px',
                  height: '18px',
                  border: '2px solid transparent',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Procesando Pago...
              </>
            ) : (
              <>
                <FiCreditCard size={20} />
                Pagar con Saldo
              </>
            )}
          </button>
          
          {!isAuthenticated && (
            <div style={styles.loginPrompt}>
              <p style={{ margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <FiAlertCircle size={16} />
                <Link 
                  to="/login" 
                  style={{ 
                    color: '#667eea', 
                    textDecoration: 'none',
                    fontWeight: '600'
                  }}
                >
                  Inicia sesión
                </Link> para pagar con tu saldo
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Estilos CSS para animaciones */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default CartPage;