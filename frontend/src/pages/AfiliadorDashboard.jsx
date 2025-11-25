import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
    FiDollarSign, 
    FiShoppingBag, 
    FiGift, 
    FiAward, 
    FiStar,
    FiMenu,
    FiLogOut,
    FiLock,
    FiShare2, // Icono para Código de Referido
    FiTrendingUp, // Icono VIP
    FiTarget      // Icono Diamante
} from 'react-icons/fi';

// Importa el contexto de autenticación
import { useAuth } from '/src/context/AuthContext';

// 🛑 SOLUCIÓN DEL LOGO: Importamos la imagen como un módulo (Ajustar ruta si es necesario)
// Si AffiliatorDashboard.jsx está en src/components/layout/, la ruta es:
import LogoBlack from '../images/BLACK.png'; 

import RechargePage from '../features/dashboard/UserDashboard/RechargePage.jsx';
import OrderHistory from '../features/dashboard/UserDashboard/OrderHistory.jsx';
import RedeemPoints from '../features/dashboard/UserDashboard/RedeemPoints.jsx';
import RedemptionHistory from '../features/dashboard/UserDashboard/RedemptionHistory.jsx';
import UserRateProviders from '../features/dashboard/UserDashboard/UserRateProviders.jsx';
import VIPEarnings from '../features/dashboard/UserDashboard/VIPEarnings.jsx';
import DiamondDiscounts from '../features/dashboard/UserDashboard/DiamondDiscounts.jsx';
import AffiliateDashboardContent from '../features/dashboard/AffiliateDashboard/AffiliateDashboard.jsx';
import AffiliateDashboard from '../features/dashboard/AffiliateDashboard/AffiliateDashboard.jsx';
// Importamos el contenido exclusivo de Afiliado

// --- ESTILOS (Mismos del UserDashboard) ---
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
        background: 'radial-gradient(circle at 80% 20%, rgba(0, 191, 255, 0.08) 0%, transparent 50%)',
        zIndex: 0
    },
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
    sidebarOpen: { transform: 'translateX(0)' },
    overlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(3px)',
        zIndex: 999
    },
    sidebarHeader: {
        padding: '0 24px 20px 24px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        marginBottom: '20px',
        textAlign: 'center'
    },
    logoContainer: { display: 'block', marginBottom: '10px', textDecoration: 'none' },
    logoImage: { maxWidth: '140px', height: 'auto', display: 'block', margin: '0 auto' },
    subtitle: { fontSize: '0.8rem', color: '#00BFFF', marginTop: '8px', fontWeight: '600', letterSpacing: '1px' },
    navContainer: {
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        padding: '0 16px'
    },
    footerContainer: { padding: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', marginTop: 'auto' },
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
        background: 'linear-gradient(135deg, rgba(0, 191, 255, 0.2) 0%, rgba(102, 126, 234, 0.2) 100%)',
        color: '#00BFFF',
        border: '1px solid rgba(0, 191, 255, 0.3)',
        boxShadow: '0 4px 15px rgba(0, 191, 255, 0.1)'
    },
    linkHover: { color: '#ffffff', background: 'rgba(255, 255, 255, 0.05)', transform: 'translateX(4px)' },
    linkLocked: { opacity: 0.5, cursor: 'default' },
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
        flexGrow: 1, padding: '0', backgroundColor: 'transparent', position: 'relative',
        zIndex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100vh'
    },
    mobileHeader: {
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px',
        background: 'rgba(25, 25, 25, 0.95)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)', zIndex: 40, flexShrink: 0
    },
    menuButton: {
        background: 'rgba(102, 126, 234, 0.1)', border: '1px solid rgba(102, 126, 234, 0.3)',
        borderRadius: '8px', padding: '8px', color: '#667eea', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    userInfo: {
        padding: '24px 32px', background: 'rgba(30, 30, 30, 0.6)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between', flexShrink: 0
    },
    userWelcome: { display: 'flex', flexDirection: 'column', gap: '4px' },
    userName: { fontSize: '1.4rem', fontWeight: '700', color: '#ffffff', margin: 0 },
    userRole: { fontSize: '0.9rem', color: '#00BFFF', fontWeight: '600' },
    userStats: { display: 'flex', gap: '24px', alignItems: 'center' },
    statItem: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' },
    statValue: {
        fontSize: '1.2rem', fontWeight: '700',
        background: 'linear-gradient(135deg, #00BFFF 0%, #667eea 100%)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    },
    statLabel: { fontSize: '0.75rem', color: '#a0a0a0', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' },
    mainContent: { padding: '32px', flexGrow: 1, overflowY: 'auto' },
    mobileLogo: { height: '28px', width: 'auto' },
    sectionDivider: {
        margin: '10px 20px',
        fontSize: '0.75rem',
        color: '#666',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '1px'
    }
};

// --- Componente Sidebar ---
const Sidebar = ({ isOpen, onClose, user, isMobile }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [hoveredLink, setHoveredLink] = useState(null);

    const isActive = (path) => location.pathname === path;
    const tier = user?.tier ? user.tier.toLowerCase() : 'usuario'; 
    const isVip = tier === 'vip' || tier === 'diamante';
    const isDiamond = tier === 'diamante';

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
        // SECCIÓN USUARIO NORMAL
        { header: 'Mi Cuenta' },
        { path: '/afiliador/recargar', label: 'Recargar Saldo', icon: FiDollarSign, requiredTier: 'usuario' },
        { path: '/afiliador/compras', label: 'Historial Compras', icon: FiShoppingBag, requiredTier: 'usuario' },
        { path: '/afiliador/calificar', label: 'Calificar Prov.', icon: FiStar, requiredTier: 'usuario' },
        { path: '/afiliador/puntos', label: 'Canjear Puntos', icon: FiGift, requiredTier: 'usuario' },
        { path: '/afiliador/premios', label: 'Mis Premios', icon: FiAward, requiredTier: 'usuario' },
        
        // SECCIÓN VIP / DIAMANTE (AÑADIDA)
        { path: '/afiliador/ganancias', label: 'Ganancias VIP', icon: FiTrendingUp, description: 'Tus ingresos', requiredTier: 'vip', color: '#e6ac00' },
        { path: '/afiliador/descuentos-diamante', label: 'Zona Diamante', icon: FiTarget, description: 'Descuentos exclusivos', requiredTier: 'diamante', color: '#00BFFF' },

        // SECCIÓN EXCLUSIVA AFILIADO
        { header: 'Zona de Socio' },
        { path: '/afiliador/panel-socio', label: 'Panel de Afiliado', icon: FiShare2, highlight: true, requiredTier: 'usuario' },
    ];

    const handleTierLinkClick = (e, requiredTier) => {
        const requiredName = requiredTier.toUpperCase();
        const userTierName = tier.toUpperCase() || 'GRATUITO';

        if ((requiredTier === 'vip' && !isVip) || (requiredTier === 'diamante' && !isDiamond)) {
            e.preventDefault();
            alert(`Acceso denegado. Función exclusiva para miembros ${requiredName}. Tu rango: ${userTierName}.`);
        } else if (isMobile) {
            onClose();
        }
    };

    return (
        <>
            {isMobile && isOpen && <div style={styles.overlay} onClick={onClose} />}
            
            <div style={sidebarStyle}>
                <div style={styles.sidebarHeader}>
                    <Link to="/" style={styles.logoContainer} onClick={isMobile ? onClose : undefined}>
                        {/* 🛑 CORRECCIÓN DE RUTA: Uso de variable importada */}
                        <img src={LogoBlack} alt="Logo" style={styles.logoImage} />
                    </Link>
                    <p style={styles.subtitle}>Socio Afiliado</p>
                </div>

                <nav style={styles.navContainer}>
                    {menuItems.map((item, index) => {
                        if (item.header) {
                            return <div key={index} style={styles.sectionDivider}>{item.header}</div>;
                        }

                        const IconComponent = item.icon;
                        const active = isActive(item.path);
                        const hovered = hoveredLink === item.path;
                        
                        const requiredTier = item.requiredTier;
                        const isEligible = (requiredTier === 'usuario') || (requiredTier === 'vip' && isVip) || (requiredTier === 'diamante' && isDiamond);
                        const isTierLocked = !isEligible;
                        const lockColor = isTierLocked ? item.color || '#a0a0a0' : (active ? '#667eea' : '#a0a0a0');

                        return (
                            <Link
                                key={item.path}
                                to={!isTierLocked ? item.path : '#'}
                                onClick={(e) => isTierLocked ? handleTierLinkClick(e, requiredTier) : (isMobile && onClose())}
                                style={{
                                    ...styles.link,
                                    ...(active && styles.linkActive),
                                    ...(hovered && !active && !isTierLocked && styles.linkHover),
                                    ...(item.highlight && !active ? {border: '1px solid rgba(0, 191, 255, 0.3)', background: 'rgba(0, 191, 255, 0.05)'} : {}),
                                    ...(isTierLocked && styles.linkLocked)
                                }}
                                onMouseEnter={() => setHoveredLink(item.path)}
                                onMouseLeave={() => setHoveredLink(null)}
                            >
                                <IconComponent size={20} style={{color: active || item.highlight ? '#00BFFF' : lockColor}}/>
                                <div style={{ flex: 1 }}>
                                    <span style={{ fontWeight: active ? '600' : '500', color: active ? '#ffffff' : lockColor }}>
                                        {item.label}
                                    </span>
                                    {item.description && !isTierLocked && (
                                        <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '2px' }}>
                                            {item.description}
                                        </div>
                                    )}
                                </div>
                                {isTierLocked && <FiLock size={16} style={{ color: item.color }} />}
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

// --- Componente UserInfo ---
const UserInfo = ({ user }) => {
    return (
        <div style={styles.userInfo}>
            <div style={styles.userWelcome}>
                <h2 style={styles.userName}>Hola, {user?.username || 'Socio'}</h2>
                <p style={styles.userRole}>Afiliado Verificado</p>
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
const MobileHeader = ({ onMenuClick }) => (
    <div style={styles.mobileHeader}>
        <button style={styles.menuButton} onClick={onMenuClick}><FiMenu size={22} /></button>
        {/* 🛑 CORRECCIÓN DE RUTA: Uso de variable importada */}
        <img src={LogoBlack} alt="Logo" style={styles.mobileLogo}/>
        <div style={{ width: '40px' }} />
    </div>
);

// --- Dashboard Principal del Afiliado ---
const AffiliatorDashboard = () => {
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
                {isMobile ? <MobileHeader onMenuClick={toggleSidebar} /> : <UserInfo user={user} />}
                
                <div style={{...styles.mainContent, padding: isMobile ? '20px' : '32px'}}>
                    {/* Resumen Móvil */}
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
                        {/* Redirección por defecto */}
                        <Route index element={<Navigate to="panel-socio" replace />} />
                        
                        {/* RUTAS ESTÁNDAR (Sin Perfil) */}
                        <Route path="recargar" element={<RechargePage />} />
                        <Route path="compras" element={<OrderHistory />} />
                        <Route path="calificar" element={<UserRateProviders />} />
                        <Route path="puntos" element={<RedeemPoints />} />
                        <Route path="premios" element={<RedemptionHistory />} />

                        {/* RUTAS EXCLUSIVAS DE RANGO (Añadidas) */}
                        {isVip && <Route path="ganancias" element={<VIPEarnings />} />}
                        {isDiamond && <Route path="descuentos-diamante" element={<DiamondDiscounts />} />}
                        <Route path="panel-socio" element={<AffiliateDashboard />} />

                        {/* RUTA EXCLUSIVA DE AFILIADO */}

                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default AffiliatorDashboard;
