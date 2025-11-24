import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '/src/services/apiClient.js'; // Usando ruta absoluta

// 1. Crear el Contexto
const CartContext = createContext();

// 2. Hook personalizado para usar el contexto fácilmente
export const useCart = () => {
  return useContext(CartContext);
};

// 3. El Proveedor del Contexto (el "cerebro")
export const CartProvider = ({ children }) => {
  // --- ESTADOS ---
  
  // Estado para los items del carrito
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localData = localStorage.getItem('cart');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Error al cargar carrito de localStorage:", error);
      return [];
    }
  });

  // Estado para el cupón aplicado
  const [coupon, setCoupon] = useState(() => {
    try {
      const localData = localStorage.getItem('coupon');
      return localData ? JSON.parse(localData) : null;
    } catch (error) {
      return null;
    }
  });

  // --- EFECTOS ---

  // Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Guardar cupón en localStorage cada vez que cambie
  useEffect(() => {
    if (coupon) {
      localStorage.setItem('coupon', JSON.stringify(coupon));
    } else {
      localStorage.removeItem('coupon');
    }
  }, [coupon]);

  // --- FUNCIONES DEL CARRITO ---

  const addToCart = (product, customerData) => {
    setCartItems(prevItems => {
      // Manejo de error si product es undefined (visto en consola)
      if (!product || typeof product.id === 'undefined') {
        console.error("addToCart fue llamado con un producto inválido:", product);
        return prevItems; // No hacer nada si el producto es inválido
      }
      
      const cartId = `${product.id}-${customerData.customerName}-${customerData.customerPhone}`;
      const existingItem = prevItems.find(item => item.cartId === cartId);

      if (existingItem) {
        return prevItems.map(item =>
          item.cartId === cartId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [
          ...prevItems,
          {
            ...product,
            ...customerData,
            cartId: cartId, 
            quantity: 1
          }
        ];
      }
    });
  };

  const removeFromCart = (cartId) => {
    setCartItems(prevItems => prevItems.filter(item => item.cartId !== cartId));
  };

  const updateQuantity = (cartId, quantity) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.cartId === cartId ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setCoupon(null); // También limpiar el cupón
  };

  // --- LÓGICA DE CUPONES ---

  /**
   * Intenta aplicar un cupón llamando al backend.
   * @param {string} couponCode - El código a validar.
   * @returns {Promise<boolean>} - True si fue exitoso, lanza error si falla.
   */
  const applyCoupon = async (couponCode) => {
    if (!couponCode) {
      throw new Error("Ingresa un código de cupón.");
    }

    try {
      // Llamamos a la nueva ruta del backend (sin /api/ porque apiClient ya lo tiene)
      const response = await apiClient.post('/coupons/validate', { couponCode });
      
      const validatedCoupon = response.data;
      
      // Verificamos si el cupón es válido para el subtotal actual
      const subtotal = getSubtotal();
      if (validatedCoupon.min_purchase_usd && subtotal < parseFloat(validatedCoupon.min_purchase_usd)) {
        throw new Error(`Este cupón requiere una compra mínima de $${validatedCoupon.min_purchase_usd}`);
      }
      
      // ¡Éxito! Guardamos el cupón en el estado
      setCoupon(validatedCoupon);
      return true;

    } catch (err) {
      // Si el backend da un error (ej. "Cupón no encontrado"), lo pasamos
      const errorMessage = err.response?.data?.error || 'Error al validar el cupón.';
      setCoupon(null); // Nos aseguramos de limpiar cualquier cupón viejo
      throw new Error(errorMessage);
    }
  };

  /**
   * Quita el cupón aplicado.
   */
  const removeCoupon = () => {
    setCoupon(null);
  };


  // --- CÁLCULOS DE PRECIO ---

  // Calcula el subtotal (precio * cantidad)
  const getSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.offer_price_usd || item.price_usd) || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  // Calcula el descuento basado en el cupón
  const getDiscount = () => {
    const subtotal = getSubtotal();
    if (!coupon || !subtotal) {
      return 0;
    }

    let discount = 0;
    if (coupon.discount_type === 'percentage') {
      discount = (subtotal * (parseFloat(coupon.discount_value) / 100));
    } else if (coupon.discount_type === 'fixed') {
      discount = parseFloat(coupon.discount_value);
    }

    // El descuento no puede ser mayor que el subtotal
    return Math.min(discount, subtotal);
  };

  // Calcula el total final
  const getTotal = () => {
    return getSubtotal() - getDiscount();
  };


  // Valor que compartiremos con toda la app
  const value = {
    cartItems,
    coupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getDiscount,
    getTotal,
    itemCount: cartItems.length 
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};