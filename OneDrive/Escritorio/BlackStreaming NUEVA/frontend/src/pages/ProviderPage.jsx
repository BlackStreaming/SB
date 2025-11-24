import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../services/apiClient.js';
// 1. Importamos el ProductCard, asumimos la ruta basado en tu HomePage
import ProductCard from '/src/components/product/ProductCard.jsx';

// --- ESTILOS COMPLETOS (Actualizados) ---
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '20px auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '30px',
    marginBottom: '40px',
    alignItems: 'center',
  },
  providerImageContainer: {
    flex: '1 1 300px',
    maxWidth: '300px',
  },
  providerImage: {
    width: '100%',
    height: 'auto',
    borderRadius: '8px',
    border: '1px solid #eee',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  },
  providerInfo: {
    flex: '2 1 600px',
    display: 'flex',
    flexDirection: 'column',
  },
  providerName: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    margin: '0 0 15px 0',
    color: '#333',
  },
  providerDescription: {
    fontSize: '1.1rem',
    color: '#555',
    lineHeight: '1.6',
    marginBottom: '20px',
  },
  // 2. ESTILO DE GRID (copiado de HomePage)
  grid: { 
    display: 'flex', 
    flexWrap: 'wrap', 
    gap: '15px', 
    marginBottom: '30px',
    justifyContent: 'center', // Centramos las tarjetas
  },
  // 3. ESTILO DE TÍTULO (copiado de HomePage)
  sectionTitle: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#333',
    borderBottom: '2px solid #007bff',
    paddingBottom: '10px',
    marginBottom: '20px',
    marginTop: '30px',
  },
  loading: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#666',
    padding: '40px',
  },
  error: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#dc3545',
    padding: '40px',
  },
  noProducts: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#999',
    padding: '40px',
  },
  // ... (Los estilos de productCard, productImage, etc., se han eliminado 
  //      porque ProductCard ahora maneja sus propios estilos)
};
// --- FIN ESTILOS ---

const ProviderPage = () => {
  const { slug } = useParams();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProvider = async () => {
      if (!slug) {
        setError('Proveedor no especificado.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Esta llamada está correcta (no lleva /api/ al inicio
        // porque apiClient ya lo tiene en la baseURL)
        const response = await apiClient.get(`/providers/${slug}`);
        
        setProvider(response.data);
      } catch (err) {
        setError('No se pudo cargar la información del proveedor.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProvider();
  }, [slug]);

  if (loading) {
    return <div style={styles.container}><div style={styles.loading}>Cargando proveedor...</div></div>;
  }

  if (error) {
    return <div style={styles.container}><div style={styles.error}>{error}</div></div>;
  }

  if (!provider) {
    return <div style={styles.container}><div style={styles.error}>Proveedor no encontrado.</div></div>;
  }

  return (
    <div style={styles.container}>
      {/* Header del Proveedor */}
      <div style={styles.header}>
        <div style={styles.providerImageContainer}>
          <img
            src={provider.image_url || 'https://placehold.co/300x300/f0f0f0/999?text=Sin+Imagen'}
            alt={provider.name}
            style={styles.providerImage}
            onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/300x300/f0f0f0/999?text=Error'; }}
          />
        </div>
        <div style={styles.providerInfo}>
          <h1 style={styles.providerName}>{provider.name}</h1>
          {provider.description && (
            <p style={styles.providerDescription}>{provider.description}</p>
          )}
        </div>
      </div>

      {/* Lista de Productos (¡ACTUALIZADO!) */}
      <div>
        {/* 4. TÍTULO CON ESTILO */}
        <h2 style={styles.sectionTitle}>
          Productos de {provider.name}
        </h2>
        {provider.products && provider.products.length > 0 ? (
          
          // 5. GRID CON ESTILO
          <div style={styles.grid}>
            {provider.products.map((product) => (
              
              // 6. USANDO EL COMPONENTE ProductCard
              <ProductCard product={product} key={product.id} />

            ))}
          </div>
        ) : (
          <div style={styles.noProducts}>No hay productos disponibles para este proveedor.</div>
        )}
      </div>
    </div>
  );
};

export default ProviderPage;