// src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// Asumo que tu apiClient.js está en 'src/services/apiClient.js'
import apiClient, { setAuthToken, getMe } from '../services/apiClient'; 

// 1. Crear el contexto
const AuthContext = createContext();

// 2. Crear el "Hook" para usarlo fácilmente
export const useAuth = () => useContext(AuthContext);

// 3. Crear el "Proveedor" (el que envuelve la app)
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  // 4. Función para cargar al usuario al iniciar la app
  const loadUser = useCallback(async () => {
    if (token) {
      localStorage.setItem('token', token);
      setAuthToken(token); // Configura el token en apiClient
      try {
        const response = await getMe();
        setUser(response.data.user);
      } catch (error) {
        console.error("Token inválido o sesión expirada", error);
        logout(); // Limpia si el token es malo
      }
    }
    setIsLoading(false);
  }, [token]);

  // 5. Cargar al usuario cuando el token cambie (al inicio)
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // 6. Función de Login
  const login = (userData) => {
    // userData viene de la respuesta de /api/auth/login
    setUser(userData.user);
    setToken(userData.token);
    localStorage.setItem('token', userData.token);
    setAuthToken(userData.token);
  };

  // 7. Función de Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    setAuthToken(null);
  };

  // 8. ¡IMPORTANTE! Función para refrescar el saldo
  // La llamamos después de una recarga o una compra
  const refreshUser = async () => {
    try {
      const response = await getMe();
      setUser(response.data.user);
      return response.data.user;
    } catch (error) {
      console.error("Error refrescando usuario", error);
      logout();
    }
  };

  // 9. Valores que compartiremos con la app
  const value = {
    user,
    token,
    login,
    logout,
    refreshUser,
    isAuthenticated: !!user, // Verdadero si 'user' no es null
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};