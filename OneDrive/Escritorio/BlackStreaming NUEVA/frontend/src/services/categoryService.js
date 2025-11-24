import { apiClient } from './apiClient';

export const fetchCategories = () => apiClient('/categories');
export const fetchCategoryBySlug = (slug) => apiClient(`/categories/${slug}`);
