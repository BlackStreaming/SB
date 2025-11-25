import { apiClient } from './apiClient';

export const fetchProducts = () => apiClient('/products');
export const fetchProductBySlug = (slug) => apiClient(`/products/${slug}`);
