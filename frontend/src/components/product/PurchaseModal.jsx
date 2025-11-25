// src/components/product/PurchaseModal.jsx

import React, { useState } from 'react';
import { FiUser, FiSmartphone, FiShoppingCart, FiX } from 'react-icons/fi';

// --- Estilos Unified Compact Theme (Dark Glass - Modal Edition) ---
const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(8px)',
    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000,
    padding: '20px'
  },
  modal: {
    backgroundColor: '#1a1a1a', borderRadius: '20px', padding: '30px',
    width: '100%', maxWidth: '450px', fontFamily: "'Inter', sans-serif",
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', 
    border: '1px solid rgba(255, 255, 255, 0.1)', color: '#e0e0e0',
    position: 'relative', overflow: 'hidden'
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: '24px'
  },
  title: {
    margin: 0, fontSize: '1.4rem', fontWeight: '700', color: '#fff',
    display: 'flex', alignItems: 'center', gap: '10px'
  },
  closeButton: {
    background: 'rgba(255, 255, 255, 0.1)', border: 'none', borderRadius: '10px',
    padding: '8px', cursor: 'pointer', color: '#ccc', display: 'flex',
    alignItems: 'center', justifyContent: 'center', transition: '0.2s',
    fontSize: '1.2rem'
  },
  
  // Resumen del Producto
  productSummary: {
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
    padding: '16px', borderRadius: '12px', border: '1px solid rgba(102, 126, 234, 0.2)',
    marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px'
  },
  productImage: {
    width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover',
    background: 'rgba(0,0,0,0.3)'
  },
  productInfo: { flex: 1 },
  productName: { margin: 0, fontSize: '1rem', fontWeight: '600', color: '#fff' },
  productPrice: { margin: '4px 0 0 0', fontSize: '1.1rem', color: '#667eea', fontWeight: '800' },

  // Formulario
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { 
    fontSize: '0.85rem', fontWeight: '600', color: '#a0a0a0', 
    display: 'flex', alignItems: 'center', gap: '6px' 
  },
  inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  inputIcon: { position: 'absolute', left: '12px', color: '#666' },
  input: {
    width: '100%', padding: '12px 12px 12px 40px', 
    background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px', color: '#fff', fontSize: '0.95rem', outline: 'none',
    transition: 'all 0.3s ease', boxSizing: 'border-box'
  },
  
  // Botón
  button: {
    padding: '14px', border: 'none', borderRadius: '12px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white', fontSize: '1rem', fontWeight: '700', cursor: 'pointer',
    marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: '8px', transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
  },
  
  error: {
    background: 'rgba(220, 53, 69, 0.15)', color: '#ff6b6b', 
    border: '1px solid rgba(220, 53, 69, 0.3)', padding: '10px', 
    borderRadius: '8px', fontSize: '0.9rem', textAlign: 'center'
  }
};

const PurchaseModal = ({ product, onClose, onAddToCart }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone) {
      setError('Por favor, completa todos los campos.');
      return;
    }
    
    onAddToCart({
      product: product, 
      customerName: name,
      customerPhone: phone
    });
  };

  const priceToShow = product.offer_price_usd || product.price_usd;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}><FiShoppingCart /> Confirmar Compra</h2>
          <button 
            onClick={onClose} 
            style={styles.closeButton}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            <FiX />
          </button>
        </div>
        
        {/* Resumen del Producto */}
        <div style={styles.productSummary}>
          <img 
            src={product.image_url || 'https://placehold.co/50'} 
            alt={product.name} 
            style={styles.productImage} 
            onError={(e) => e.target.style.display = 'none'}
          />
          <div style={styles.productInfo}>
            <p style={styles.productName}>{product.name}</p>
            <p style={styles.productPrice}>${parseFloat(priceToShow).toFixed(2)}</p>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="customerName" style={styles.label}>
              <FiUser /> Nombre del Cliente
            </label>
            <div style={styles.inputWrapper}>
                <FiUser style={styles.inputIcon} size={18}/>
                <input
                type="text"
                id="customerName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={styles.input}
                placeholder="Ej: Juan Pérez"
                required
                onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.background = 'rgba(0,0,0,0.3)';
                }}
                onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                    e.target.style.background = 'rgba(255,255,255,0.05)';
                }}
                />
            </div>
          </div>
          
          <div style={styles.inputGroup}>
            <label htmlFor="customerPhone" style={styles.label}>
              <FiSmartphone /> Celular del Cliente
            </label>
            <div style={styles.inputWrapper}>
                <FiSmartphone style={styles.inputIcon} size={18} />
                <input
                type="tel"
                id="customerPhone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={styles.input}
                placeholder="Ej: +51 987654321"
                required
                onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.background = 'rgba(0,0,0,0.3)';
                }}
                onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                    e.target.style.background = 'rgba(255,255,255,0.05)';
                }}
                />
            </div>
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button 
            type="submit" 
            style={{
                ...styles.button,
                ...(isHovered ? { transform: 'translateY(-2px)', boxShadow: '0 8px 25px rgba(102, 126, 234, 0.5)' } : {})
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Añadir al Carrito
          </button>
        </form>
      </div>
    </div>
  );
};

export default PurchaseModal;