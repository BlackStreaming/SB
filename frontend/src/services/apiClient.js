// src/services/apiClient.js (CORREGIDO)

import axios from 'axios';

// Define la URL base de tu API
const API_BASE_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// ---
// 1. FUNCIÓN PARA ESTABLECER EL TOKEN
// ---
export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

// ---
// 2. EXPORTACIONES NOMBRADAS
// (¡AQUÍ ESTÁ LA PARTE QUE FALTABA!)
// ---

// --- Autenticación ---
export const loginUser = (credentials) => apiClient.post('/auth/login', credentials);
export const registerUser = (userData) => apiClient.post('/auth/register', userData);

// ¡ESTA ES LA LÍNEA QUE ARREGLA EL ERROR!
export const getMe = () => apiClient.get('/auth/me');

// --- Productos (Público) ---
export const getProducts = () => apiClient.get('/products');
export const getProductBySlug = (slug) => apiClient.get(`/products/${slug}`);
export const getCategories = () => apiClient.get('/categories');
export const getProductsByCategory = (slug) => apiClient.get(`/categories/${slug}/products`);
export const getCarouselSlides = () => apiClient.get('/carousel-slides');

// --- Cupones ---
export const validateCoupon = (couponCode) => apiClient.post('/coupons/validate', { couponCode });

// --- Pedidos (Checkout e Historial) ---
export const checkout = (cartData) => apiClient.post('/orders/checkout', cartData);
export const getOrderHistory = () => apiClient.get('/orders/history');
export const getOrderDetails = (orderId) => apiClient.get(`/orders/${orderId}`);

// --- Recargas (Usuario) ---
export const requestRecharge = (rechargeData) => apiClient.post('/recharges/request', rechargeData);
export const getRechargeHistory = () => apiClient.get('/recharges/history');


// ---
// 3. EXPORTACIÓN POR DEFECTO
// ---
export default apiClient;
