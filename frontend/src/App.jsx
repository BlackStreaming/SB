// 1. AGREGA { useEffect } AQUÍ
import React, { useEffect } from 'react'; 
import { Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from './components/layout/MainLayout.jsx';

// Páginas Públicas
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import ProductPage from './pages/ProductPage.jsx';
import CartPage from './pages/CartPage.jsx'; 
import ProviderPage from './pages/ProviderPage.jsx';

// "Códigos Madre" de Dashboards
import AdminDashboard from './pages/AdminDashboard.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import ProveedorDashboard from './pages/ProveedorDashboard.jsx';
import AfiliadorDashboard from './pages/AfiliadorDashboard.jsx';

// 2. IMPORTA TU IMAGEN DEL LOGO AQUÍ
import logoBlack from './images/BLACK.png'; 

function App() {

  // 3. AGREGA ESTE BLOQUE USEEFFECT ANTES DEL RETURN
  useEffect(() => {
    // Cambiar el Título de la pestaña
    document.title = "Black Streaming"; 

    // Buscar si ya existe un favicon y reemplazarlo, o crear uno nuevo
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = logoBlack; // Asigna la imagen importada
  }, []);

  return (
    <Routes>
        {/* RUTAS PÚBLICAS (con Header y Footer) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/categoria/:slug" element={<CategoryPage />} />
          <Route path="/producto/:slug" element={<ProductPage />} /> 
          <Route path="/carrito" element={<CartPage />} />
          
          {/* --- 2. AÑADIDO: La nueva ruta pública para ver proveedores --- */}
          <Route path="/provider/:slug" element={<ProviderPage />} />

        </Route>

        {/* RUTAS SIN LAYOUT (Login/Registro) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* RUTAS DE DASHBOARDS */}
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/usuario/*" element={<UserDashboard />} />
        <Route path="/proveedor/*" element={<ProveedorDashboard />} />
        <Route path="/afiliador/*" element={<AfiliadorDashboard />} />
        
    </Routes>
  );
}

export default App;