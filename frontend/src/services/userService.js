import { apiClient } from './apiClient';

export const fetchCurrentUser = () => apiClient('/me');
