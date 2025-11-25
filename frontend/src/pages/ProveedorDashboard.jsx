import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FiPackage,      // Productos
  FiLayers,       // Stock
  FiClipboard,    // Ordenes
  FiCreditCard,   // Recargas
  FiUsers,        // Afiliados
  FiHeadphones,   // Soporte
  FiMenu,         // Hamburguesa
  FiLogOut,       // Salir
  FiHome          // Dashboard/Inicio
} from 'react-icons/fi';

// Importamos el contexto de autenticación
import { useAuth } from '/src/context/AuthContext';

// Importamos los componentes de lógica
import ProductManagement from '../features/dashboard/ProviderDashboard/ProductManagement.jsx';
import StockManagement from '../features/dashboard/ProviderDashboard/StockManagement.jsx';
import OrderManagement from '../features/dashboard/ProviderDashboard/OrderManagement.jsx';
import ProviderRechargePanel from '../features/dashboard/ProviderDashboard/ProviderRechargePanel.jsx';
import ProviderAffiliatePanel from '../features/dashboard/ProviderDashboard/ProviderAffiliatePanel.jsx';
import ProviderSupportPanel from '../features/dashboard/ProviderDashboard/ProviderSupportPanel.jsx';

// --- ESTILOS DEFINIDOS (Idénticos al UserDashboard) ---
const styles = {
    layout: {
      display: 'flex',
      minHeight: '100vh',
      fontFamily: "'Inter', sans-serif",
      background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 50%, #0f0f0f 100%)',
      position: 'relative',
      overflow: 'hidden'
    },
    backgroundDecoration: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'radial-gradient(circle at 20% 80%, rgba(102, 126, 234, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(118, 75, 162, 0.1) 0%, transparent 50%)',
      zIndex: 0
    },
    // Estilos del Sidebar
    sidebar: {
      width: '280px',
      background: 'rgba(25, 25, 25, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRight: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      padding: '32px 0',
      flexShrink: 0,
      height: '100vh',
      zIndex: 50,
      transition: 'transform 0.3s ease-in-out',
    },
    sidebarMobile: {
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100vh',
      width: '280px',
      transform: 'translateX(-100%)',
      zIndex: 1000,
      boxShadow: '4px 0 15px rgba(0,0,0,0.5)'
    },
    sidebarOpen: {
      transform: 'translateX(0)'
    },
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(3px)',
      zIndex: 999,
    },
    sidebarHeader: {
      padding: '0 24px 20px 24px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      marginBottom: '20px',
      textAlign: 'center'
    },
    logoContainer: {
      display: 'block',
      marginBottom: '10px',
      textDecoration: 'none'
    },
    logoImage: {
      maxWidth: '140px',
      height: 'auto',
      display: 'block',
      margin: '0 auto'
    },
    subtitle: {
      fontSize: '0.85rem',
      color: '#b0b0b0',
      marginTop: '8px',
      fontWeight: '400',
      letterSpacing: '1px'
    },
    navContainer: {
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        padding: '0 16px'
    },
    footerContainer: {
        padding: '16px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        marginTop: 'auto'
    },
    link: {
      padding: '14px 20px',
      textDecoration: 'none',
      color: '#a0a0a0',
      fontSize: '0.95rem',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      borderRadius: '12px',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    },
    linkActive: {
      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
      color: '#667eea',
      border: '1px solid rgba(102, 126, 234, 0.3)',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.1)'
    },
    linkHover: {
      color: '#ffffff',
      background: 'rgba(255, 255, 255, 0.05)',
      transform: 'translateX(4px)'
    },
    logoutButton: {
        width: '100%',
        padding: '14px 20px',
        background: 'rgba(255, 59, 59, 0.1)',
        border: '1px solid rgba(255, 59, 59, 0.2)',
        color: '#ff4d4d',
        fontSize: '0.95rem',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    content: {
      flexGrow: 1,
      padding: '0',
      backgroundColor: 'transparent',
      position: 'relative',
      zIndex: 1,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh'
    },
    mobileHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 24px',
      background: 'rgba(25, 25, 25, 0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      zIndex: 40,
      flexShrink: 0
    },
    menuButton: {
      background: 'rgba(102, 126, 234, 0.1)',
      border: '1px solid rgba(102, 126, 234, 0.3)',
      borderRadius: '8px',
      padding: '8px',
      color: '#667eea',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    userInfo: {
      padding: '24px 32px',
      background: 'rgba(30, 30, 30, 0.6)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0
    },
    userWelcome: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    },
    userName: {
      fontSize: '1.4rem',
      fontWeight: '700',
      color: '#ffffff',
      margin: 0,
    },
    userRole: {
      fontSize: '0.9rem',
      color: '#b0b0b0',
      fontWeight: '400'
    },
    mainContent: {
      padding: '32px',
      flexGrow: 1,
      overflowY: 'auto',
    },
    mobileLogo: {
      height: '28px',
      width: 'auto'
    }
};

// --- Componente Sidebar ---
const Sidebar = ({ isOpen, onClose, user, isMobile }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [hoveredLink, setHoveredLink] = useState(null);

    const isActive = (path) => location.pathname === path;

    // Estilos dinámicos para móvil/escritorio
    const sidebarStyle = isMobile 
        ? { ...styles.sidebar, ...styles.sidebarMobile, ...(isOpen ? styles.sidebarOpen : {}) }
        : styles.sidebar;

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Error al salir:", error);
        }
    };

    // Ítems del menú PROVEEDOR
    const menuItems = [
        { path: '/proveedor/productos', label: 'Mis Productos', icon: FiPackage },
        { path: '/proveedor/stock', label: 'Gestión de Stock', icon: FiLayers },
        { path: '/proveedor/ordenes', label: 'Órdenes', icon: FiClipboard },
        { path: '/proveedor/recargas', label: 'Panel Recargas', icon: FiCreditCard },
        { path: '/proveedor/afiliar', label: 'Afiliaciones', icon: FiUsers },
        { path: '/proveedor/soporte', label: 'Soporte', icon: FiHeadphones },
    ];

    return (
        <>
            {isMobile && isOpen && (
                <div style={styles.overlay} onClick={onClose} />
            )}
            
            <div style={sidebarStyle}>
                <div style={styles.sidebarHeader}>
                    <Link to="/" style={styles.logoContainer} onClick={isMobile ? onClose : undefined}>
                        <img 
                            src="/src/images/BLACK.png" // Asegúrate que la ruta sea correcta
                            alt="Logo" 
                            style={styles.logoImage} 
                        />
                    </Link>
                    <p style={styles.subtitle}>PANEL PROVEEDOR</p>
                </div>

                <nav style={styles.navContainer}>
                    {menuItems.map((item) => {
                        const IconComponent = item.icon;
                        const active = isActive(item.path);
                        const hovered = hoveredLink === item.path;
                        
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={isMobile ? onClose : undefined}
                                style={{
                                    ...styles.link,
                                    ...(active && styles.linkActive),
                                    ...(hovered && !active && styles.linkHover),
                                }}
                                onMouseEnter={() => setHoveredLink(item.path)}
                                onMouseLeave={() => setHoveredLink(null)}
                            >
                                <IconComponent size={20} style={{color: active ? '#fff' : '#667eea'}}/>
                                <span style={{ fontWeight: active ? '600' : '500', color: active ? '#ffffff' : '#a0a0a0' }}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                <div style={styles.footerContainer}>
                    <button onClick={handleLogout} style={styles.logoutButton}>
                        <FiLogOut size={20} />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </div>
        </>
    );
};

// --- Componente UserInfo (Top Bar) ---
const UserInfo = ({ user }) => {
    return (
        <div style={styles.userInfo}>
            <div style={styles.userWelcome}>
                <h2 style={styles.userName}>Bienvenido, {user?.username || 'Proveedor'}</h2>
                <p style={styles.userRole}>Proveedor Autorizado</p>
            </div>
            {/* Si quieres mostrar saldo del proveedor, descomenta esto:
            <div style={{...styles.statValue, fontSize: '1rem'}}>
               Saldo: ${parseFloat(user?.balance_usd || 0).toFixed(2)}
            </div> 
            */}
        </div>
    );
};

// --- Componente Mobile Header ---
const MobileHeader = ({ onMenuClick }) => {
    return (
        <div style={styles.mobileHeader}>
            <button style={styles.menuButton} onClick={onMenuClick}>
                <FiMenu size={22} />
            </button>
            <Link to="/">
                <img src="/images/BLACK.png" alt="Logo" style={styles.mobileLogo} />
            </Link>
            <div style={{ width: '40px' }} />
        </div>
    );
};

// --- Dashboard Principal del Proveedor ---
const ProviderDashboard = () => {
    const { user, isLoading } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

    useEffect(() => {
        const checkScreenSize = () => {
            const mobile = window.innerWidth <= 900;
            setIsMobile(mobile);
            if (!mobile) setIsSidebarOpen(false);
        };
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    // Protección básica de ruta
    if (!isLoading && !user) return <Navigate to="/login" replace />;
    if (isLoading) return <div style={{color:'white', padding:'50px', textAlign:'center'}}>Cargando Panel...</div>;

    return (
        <div style={styles.layout}>
            <div style={styles.backgroundDecoration} />
            
            <Sidebar 
                isOpen={isSidebarOpen} 
                onClose={closeSidebar} 
                user={user} 
                isMobile={isMobile} 
            />

            <div style={styles.content}>
                {isMobile ? (
                    <MobileHeader onMenuClick={toggleSidebar} />
                ) : (
                    <UserInfo user={user} />
                )}
                
                <div style={{
                    ...styles.mainContent,
                    padding: isMobile ? '20px' : '32px'
                }}>
                    <Routes>
                        <Route index element={<Navigate to="productos" replace />} />
                        
                        <Route path="productos" element={<ProductManagement />} />
                        <Route path="stock" element={<StockManagement />} />
                        <Route path="ordenes" element={<OrderManagement />} />
                        <Route path="recargas" element={<ProviderRechargePanel />} />
                        <Route path="afiliar" element={<ProviderAffiliatePanel />} />
                        <Route path="soporte" element={<ProviderSupportPanel />} />
                        
                        <Route path="*" element={<Navigate to="productos" replace />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default ProviderDashboard;