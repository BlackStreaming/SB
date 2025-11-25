import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
    FiDollarSign, 
    FiShoppingBag, 
    FiGift, 
    FiAward, 
    FiStar,
    FiMenu,
    FiTrendingUp,
    FiTarget,
    FiLogOut,
    FiLock 
} from 'react-icons/fi';

// Ajusta la ruta según tu estructura real
import { useAuth } from '/src/context/AuthContext';

// 🛑 SOLUCIÓN DEL LOGO: Importamos la imagen como un módulo
// La ruta es '../../images/BLACK.png' asumiendo que UserDashboard.jsx está en src/components/layout/
import LogoBlack from '../images/BLACK.png'; 

import RechargePage from '../features/dashboard/UserDashboard/RechargePage.jsx';
import OrderHistory from '../features/dashboard/UserDashboard/OrderHistory.jsx';
import RedeemPoints from '../features/dashboard/UserDashboard/RedeemPoints.jsx';
import RedemptionHistory from '../features/dashboard/UserDashboard/RedemptionHistory.jsx';
import UserRateProviders from '../features/dashboard/UserDashboard/UserRateProviders.jsx';
import VIPEarnings from '../features/dashboard/UserDashboard/VIPEarnings.jsx';
import DiamondDiscounts from '../features/dashboard/UserDashboard/DiamondDiscounts.jsx';
import ProfileSettings from '../features/dashboard/UserDashboard/ProfileSettings.jsx';

// --- ESTILOS DEFINIDOS ---
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
    // Estilos base del Sidebar (Escritorio)
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
    // Estilos del Sidebar para Móvil (Overlay)
    sidebarMobile: {
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100vh',
      width: '280px',
      transform: 'translateX(-100%)', // Oculto por defecto
      zIndex: 1000,
      boxShadow: '4px 0 15px rgba(0,0,0,0.5)'
    },
    sidebarOpen: {
      transform: 'translateX(0)'
    },
    // El fondo oscuro cuando se abre el menú en móvil
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(3px)',
      zIndex: 999,
      display: 'block' // Se controlará con renderizado condicional
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
      fontWeight: '400'
    },
    navContainer: {
        flex: 1, // Ocupa el espacio disponible para empujar el logout abajo
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
      position: 'relative',
      overflow: 'hidden',
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
    linkLocked: {
        opacity: 0.5,
        cursor: 'default',
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
        justifyContent: 'center', // Centrado para logout
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
      overflow: 'hidden', // Evita doble scroll
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
    userStats: {
      display: 'flex',
      gap: '24px',
      alignItems: 'center',
    },
    statItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '2px',
    },
    statValue: {
      fontSize: '1.2rem',
      fontWeight: '700',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    statLabel: {
      fontSize: '0.75rem',
      color: '#a0a0a0',
      fontWeight: '500',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    mainContent: {
      padding: '32px',
      flexGrow: 1,
      overflowY: 'auto', // Scroll solo en el contenido
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
    const { logout } = useAuth(); // Función de logout del contexto
    const [hoveredLink, setHoveredLink] = useState(null);

    const isActive = (path) => location.pathname === path;
    const tier = user?.tier ? user.tier.toLowerCase() : 'usuario'; 
    const isVip = tier === 'vip' || tier === 'diamante';
    const isDiamond = tier === 'diamante';

    // Determinar estilos dinámicos
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

    const menuItems = [
        { path: '/usuario/recargar', label: 'Recargar Saldo', icon: FiDollarSign, description: 'Agregar fondos', requiredTier: 'usuario', color: '#667eea' },
        { path: '/usuario/compras', label: 'Historial', icon: FiShoppingBag, description: 'Mis pedidos', requiredTier: 'usuario', color: '#667eea' },
        { path: '/usuario/calificar-proveedores', label: 'Calificar', icon: FiStar, description: 'Tus experiencias', requiredTier: 'usuario', color: '#667eea' },
        { path: '/usuario/puntos', label: 'Tienda de Canje', icon: FiGift, description: 'Premios', requiredTier: 'usuario', color: '#667eea' },
        { path: '/usuario/recompensas', label: 'Mis Premios', icon: FiAward, description: 'Canjes hechos', requiredTier: 'usuario', color: '#667eea' },
        // Secciones por Rango
        { path: '/usuario/ganancias', label: 'Ganancias VIP', icon: FiTrendingUp, description: 'Tus ingresos', requiredTier: 'vip', color: '#e6ac00' },
        { path: '/usuario/descuentos-diamante', label: 'Zona Diamante', icon: FiTarget, description: 'Descuentos exclusivos', requiredTier: 'diamante', color: '#00BFFF' },

    ];
    
    const handleTierLinkClick = (e, requiredTier) => {
        const requiredName = requiredTier.toUpperCase();
        const userTierName = tier.toUpperCase() || 'GRATUITO';

        if ((requiredTier === 'vip' && !isVip) || (requiredTier === 'diamante' && !isDiamond)) {
            e.preventDefault();
            alert(`Acceso denegado. Función exclusiva para miembros ${requiredName}. Tu rango: ${userTierName}.`);
        } else if (isMobile) {
            onClose(); // Cerrar menú al hacer click en móvil
        }
    };

    return (
        <>
            {/* Fondo oscuro (Overlay) solo visible en móvil cuando está abierto */}
            {isMobile && isOpen && (
                <div 
                    style={styles.overlay}
                    onClick={onClose}
                />
            )}
            
            <div style={sidebarStyle}>
                <div style={styles.sidebarHeader}>
                    <Link to="/" style={styles.logoContainer} onClick={isMobile ? onClose : undefined}>
                        {/* 🛑 CORRECCIÓN DE RUTA: Uso de variable importada */}
                        <img 
                            src={LogoBlack} // <-- ¡CORREGIDO!
                            alt="Logo" 
                            style={styles.logoImage} 
                        />
                    </Link>
                    <p style={styles.subtitle}>Panel de Control</p>
                </div>

                <nav style={styles.navContainer}>
                    {menuItems.map((item) => {
                        const IconComponent = item.icon;
                        const active = isActive(item.path);
                        const hovered = hoveredLink === item.path;
                        
                        const requiredTier = item.requiredTier;
                        const isEligible = (requiredTier === 'usuario') || (requiredTier === 'vip' && isVip) || (requiredTier === 'diamante' && isDiamond);
                        const isTierLocked = !isEligible;
                        const lockColor = isTierLocked ? item.color : (active ? '#667eea' : '#a0a0a0');
                        
                        return (
                            <Link
                                key={item.path}
                                to={!isTierLocked ? item.path : '#'}
                                onClick={(e) => isTierLocked ? handleTierLinkClick(e, requiredTier) : (isMobile && onClose())}
                                style={{
                                    ...styles.link,
                                    ...(active && styles.linkActive),
                                    ...(hovered && !active && !isTierLocked && styles.linkHover),
                                    ...(isTierLocked && styles.linkLocked) 
                                }}
                                onMouseEnter={() => setHoveredLink(item.path)}
                                onMouseLeave={() => setHoveredLink(null)}
                            >
                                <IconComponent size={20} style={{color: lockColor}}/>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: active ? '600' : '500', color: active ? '#ffffff' : lockColor }}>
                                        {item.label}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: active ? 'rgba(255, 255, 255, 0.7)' : '#666', marginTop: '2px' }}>
                                        {item.description}
                                    </div>
                                </div>
                                {isTierLocked && (
                                    <FiLock size={16} style={{ color: item.color }} />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* BOTÓN CERRAR SESIÓN */}
                <div style={styles.footerContainer}>
                    <button 
                        onClick={handleLogout}
                        style={styles.logoutButton}
                    >
                        <FiLogOut size={20} />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </div>
        </>
    );
};

// --- Componente UserInfo (Versión Escritorio) ---
const UserInfo = ({ user }) => {
    const tier = user?.tier?.toLowerCase() || 'usuario';
    let tierLabel = 'Cliente Estándar';
    if (tier === 'vip') tierLabel = '⭐ Miembro VIP';
    if (tier === 'diamante') tierLabel = '💎 Miembro DIAMANTE';

    return (
        <div style={styles.userInfo}>
            <div style={styles.userWelcome}>
                <h2 style={styles.userName}>Hola, {user?.username || 'Usuario'}</h2>
                <p style={styles.userRole}>{tierLabel}</p>
            </div>
            
            <div style={styles.userStats}>
                <div style={styles.statItem}>
                    <span style={styles.statValue}>${parseFloat(user?.balance_usd || 0).toFixed(2)}</span>
                    <span style={styles.statLabel}>Saldo</span>
                </div>
                <div style={styles.statItem}>
                    <span style={styles.statValue}>{user?.points_balance || 0}</span>
                    <span style={styles.statLabel}>Puntos</span>
                </div>
            </div>
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
                {/* 🛑 CORRECCIÓN DE RUTA: Uso de variable importada */}
                <img 
                    src={LogoBlack} // <-- ¡CORREGIDO!
                    alt="Logo" 
                    style={styles.mobileLogo}
                />
            </Link>
            
            {/* Espacio invisible para equilibrar el header */}
            <div style={{ width: '40px' }} />
        </div>
    );
};

// --- Dashboard Principal ---
const UserDashboard = () => {
    const { user, isLoading } = useAuth(); 
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 900); // Aumenté un poco el breakpoint

    useEffect(() => {
        const checkScreenSize = () => {
            const mobile = window.innerWidth <= 900;
            setIsMobile(mobile);
            if (!mobile) setIsSidebarOpen(false); // Cierra el menú móvil si se agranda la pantalla
        };
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    const tier = user?.tier ? user.tier.toLowerCase() : 'usuario';
    const isVip = tier === 'vip' || tier === 'diamante';
    const isDiamond = tier === 'diamante';

    if (!isLoading && !user) return <Navigate to="/login" replace />; 
    if (isLoading) return <div style={{color:'white', padding:'50px', textAlign:'center'}}>Cargando...</div>;

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
                    padding: isMobile ? '20px' : '32px' // Padding dinámico
                }}>
                    {/* En móvil, mostramos un resumen rápido arriba del contenido */}
                    {isMobile && (
                        <div style={{marginBottom: '20px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between'}}>
                            <div>
                                <div style={{color:'#aaa', fontSize:'0.8rem'}}>Saldo</div>
                                <div style={{color:'white', fontWeight:'bold', fontSize:'1.1rem'}}>${parseFloat(user?.balance_usd || 0).toFixed(2)}</div>
                            </div>
                            <div style={{textAlign:'right'}}>
                                <div style={{color:'#aaa', fontSize:'0.8rem'}}>Puntos</div>
                                <div style={{color:'white', fontWeight:'bold', fontSize:'1.1rem'}}>{user?.points_balance || 0}</div>
                            </div>
                        </div>
                    )}

                    <Routes>
                        <Route index element={<Navigate to="compras" replace />} />
                        <Route path="recargar" element={<RechargePage />} />
                        <Route path="compras" element={<OrderHistory />} />
                        <Route path="puntos" element={<RedeemPoints />} />
                        <Route path="recompensas" element={<RedemptionHistory />} />
                        <Route path="calificar-proveedores" element={<UserRateProviders />} />
                        
                        {isVip && <Route path="ganancias" element={<VIPEarnings />} />}
                        {isDiamond && <Route path="descuentos-diamante" element={<DiamondDiscounts />} />}

                        <Route path="*" element={<Navigate to="compras" replace />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
