import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

// Estilo para el <main> PÚBLICO
const mainStyle = {
  // ¡AQUÍ ESTÁ EL ARREGLO! Añadimos el padding para la web pública
  padding: '2rem', 
  // Un alto mínimo para que el footer no se suba
  minHeight: 'calc(100vh - 160px)' // Ajusta 160px a la altura aprox. de tu Header+Footer
};

// Este componente envuelve las páginas que tienen Header y Footer
const MainLayout = () => {
  return (
    <>
      <Header />
      {/* Aplicamos el estilo de padding al main */}
      <main style={mainStyle}>
        {/* Outlet es el "hueco" donde React Router pondrá tu página (ej. HomePage) */}
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;