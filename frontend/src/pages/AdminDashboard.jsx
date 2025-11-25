import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FiSettings, FiUsers, FiTag, FiDollarSign, FiAward,
  FiPackage, FiTruck, FiGift, FiShoppingCart, FiLayers,
  FiBarChart2, FiLogOut, FiSearch, FiDownload, FiUpload,
  FiEye, FiEdit, FiTrash2, FiFilter, FiRefreshCw,
  FiCheckCircle, FiClock, FiAlertCircle, FiMenu
} from 'react-icons/fi';

// Importamos el contexto de autenticación
import { useAuth } from '/src/context/AuthContext';

// 🛑 SOLUCIÓN DEL LOGO: Importamos la imagen como un módulo
// La ruta es '../../images/BLACK.png' porque AdminDashboard.jsx está en src/components/layout/
import LogoBlack from '../images/BLACK.png'; 

// Importamos los componentes de gestión
import CategoryManagement from '../features/dashboard/AdminDashboard/CategoryManagement.jsx';
import SiteSettings from '../features/dashboard/AdminDashboard/SiteSettings.jsx';
import UserManagement from '../features/dashboard/AdminDashboard/UserManagement.jsx';
import CouponManagement from '../features/dashboard/AdminDashboard/CouponManagement.jsx';
import RechargeManagement from '../features/dashboard/AdminDashboard/RechargeManagement.jsx';
import RankManagement from '../features/dashboard/AdminDashboard/RankManagement.jsx';
import ProductManagement from '../features/dashboard/AdminDashboard/ProductManagement.jsx';
import ProviderManagement from '../features/dashboard/AdminDashboard/ProviderManagement.jsx';
import RedeemableItemsManagement from '../features/dashboard/AdminDashboard/RedeemableItemsManagement.jsx';
import AdminOrderReports from '../features/dashboard/AdminDashboard/AdminOrderReports.jsx';

// --- ESTILOS VISUALES "ULTRA MODERNOS" (Idénticos a User/Provider) ---
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
  // --- Sidebar ---
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
  navSectionTitle: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#667eea', 
    textTransform: 'uppercase',
    letterSpacing: '1px',
    margin: '24px 0 8px 12px',
    opacity: 0.9
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
  footerContainer: {
    padding: '16px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    marginTop: 'auto'
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
  mainContent: {
    padding: '32px',
    flexGrow: 1,
    overflowY: 'auto',
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
  mobileLogo: {
    height: '28px',
    width: 'auto'
  },
  // --- User Info Top Bar ---
  userInfo: {
    padding: '24px 32px',
    background: 'rgba(30, 30, 30, 0.6)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0
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
  // --- Estilos Específicos para Componentes Internos ---
  internalCard: {
    backgroundColor: 'rgba(30, 30, 30, 0.4)',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid rgba(255,255,255,0.05)',
    backdropFilter: 'blur(10px)',
    marginBottom: '24px'
  },
  headerTitle: {
      fontSize: '1.8rem',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '5px'
  },
  headerDesc: {
    color: '#aaa',
    marginBottom: '20px'
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { 
      textAlign: 'left', 
      padding: '16px', 
      color: '#667eea', 
      fontSize: '0.8rem', 
      textTransform: 'uppercase', 
      borderBottom: '1px solid rgba(255,255,255,0.1)' 
  },
  td: { 
      padding: '16px', 
      color: '#ddd', 
      borderBottom: '1px solid rgba(255,255,255,0.05)' 
  },
  statusBadge: {
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px'
  }
};

// --- Componente Sidebar ---
const Sidebar = ({ isOpen, onClose, user, isMobile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [hoveredLink, setHoveredLink] = useState(null);

  const isActive = (path) => location.pathname === path;

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

  const menuSections = [
    {
      title: 'Gestión Principal',
      items: [
        { path: '/admin/categorias', label: 'Categorías', icon: FiLayers },
        { path: '/admin/productos', label: 'Productos', icon: FiPackage },
        { path: '/admin/usuarios', label: 'Usuarios', icon: FiUsers },
        { path: '/admin/pedidos', label: 'Pedidos', icon: FiShoppingCart }
      ]
    },
    {
      title: 'Configuración',
      items: [
        { path: '/admin/sitio', label: 'Configuración Sitio', icon: FiSettings },
        { path: '/admin/cupones', label: 'Cupones', icon: FiTag },
        { path: '/admin/rangos', label: 'Rangos', icon: FiAward },
        { path: '/admin/recompensas', label: 'Recompensas', icon: FiGift }
      ]
    },
    {
      title: 'Operaciones',
      items: [
        { path: '/admin/recargas', label: 'Recargas', icon: FiDollarSign },
        { path: '/admin/proveedores', label: 'Proveedores', icon: FiTruck }
      ]
    }
  ];

  return (
    <>
      {isMobile && isOpen && (
          <div style={styles.overlay} onClick={onClose} />
      )}
      
      <div style={sidebarStyle}>
        <div style={styles.sidebarHeader}>
          <Link to="/" style={styles.logoContainer} onClick={isMobile ? onClose : undefined}>
              {/* 🛑 USO DEL LOGO IMPORTADO */}
             <img 
                 src={LogoBlack} // <-- ¡CORREGIDO!
                 alt="Logo" 
                 style={styles.logoImage} 
             />
          </Link>
          <div style={styles.subtitle}>PANEL ADMINISTRADOR</div>
        </div>

        <nav style={styles.navContainer}>
          {menuSections.map((section, index) => (
            <div key={index}>
              <div style={styles.navSectionTitle}>{section.title}</div>
              {section.items.map((item) => {
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
                      <IconComponent size={20} style={{color: active ? '#fff' : '#667eea'}} />
                      <span style={{ fontWeight: active ? '600' : '500', color: active ? '#ffffff' : '#a0a0a0' }}>
                        {item.label}
                      </span>
                    </Link>
                  );
              })}
            </div>
          ))}
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

// --- Header de Página ---
const PageHeader = ({ currentPage }) => {
    const pageInfo = {
        '/admin/categorias': { title: 'Gestión de Categorías', desc: 'Organiza las categorías de productos' },
        '/admin/sitio': { title: 'Configuración del Sitio', desc: 'Ajustes generales del sistema' },
        '/admin/usuarios': { title: 'Gestión de Usuarios', desc: 'Administra permisos y roles' },
        '/admin/cupones': { title: 'Gestión de Cupones', desc: 'Códigos de descuento' },
        '/admin/recargas': { title: 'Solicitudes de Recarga', desc: 'Aprobar o rechazar recargas' },
        '/admin/rangos': { title: 'Gestión de Rangos', desc: 'Niveles y beneficios' },
        '/admin/productos': { title: 'Gestión de Productos', desc: 'Inventario global' },
        '/admin/proveedores': { title: 'Proveedores', desc: 'Partners comerciales' },
        '/admin/recompensas': { title: 'Recompensas', desc: 'Sistema de puntos' },
        '/admin/pedidos': { title: 'Historial de Pedidos', desc: 'Revisión de transacciones' }
    };

    const info = pageInfo[currentPage] || { title: 'Dashboard', desc: 'Panel de administración' };

    return (
        <div style={{marginBottom: '24px'}}>
            <h1 style={styles.headerTitle}>{info.title}</h1>
            <p style={styles.headerDesc}>{info.desc}</p>
        </div>
    );
};

// --- CORRECCIÓN AQUÍ: User Info Top Bar Dinámico ---
const UserInfo = ({ user }) => {
    // Intentamos obtener el nombre de usuario, o usamos el email, o un fallback
    const displayName = user?.username || user?.email || 'Administrador';
    // Obtenemos el rol si existe
    const displayRole = user?.role ? `Rol: ${user.role.toUpperCase()}` : 'Administrador del Sistema';
    // Inicial para el avatar
    const initial = displayName.charAt(0).toUpperCase();

    return (
        <div style={styles.userInfo}>
            <div style={{display:'flex', flexDirection:'column'}}>
                <span style={styles.userName}>Bienvenido, {displayName}</span>
                <span style={styles.userRole}>{displayRole}</span>
            </div>
            <div style={{
                width: '40px', height: '40px', borderRadius: '50%', 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', color: 'white',
                boxShadow: '0 0 10px rgba(102, 126, 234, 0.5)'
            }}>
                {initial}
            </div>
        </div>
    );
};

// --- Mobile Header ---
const MobileHeader = ({ onMenuClick }) => (
    <div style={styles.mobileHeader}>
        <button style={styles.menuButton} onClick={onMenuClick}>
            <FiMenu size={22} />
        </button>
        <Link to="/">
            {/* 🛑 USO DEL LOGO IMPORTADO */}
            <img 
                src={LogoBlack} // <-- ¡CORREGIDO!
                alt="Logo" 
                style={styles.mobileLogo}
            />
        </Link>
        <div style={{ width: '40px' }} />
    </div>
);

// --- Componente de Tabla de Pedidos (Demo) ---
const OrdersPage = () => {
  const [orders] = useState([
    { id: 77, product: 'NETFLIX PREMIUM 4K', client: 'Reddo', supplier: 'Prov A', price: '$5.00', status: 'active', daysLeft: 2 },
    { id: 78, product: 'SPOTIFY DUO', client: 'TechCorp', supplier: 'Prov B', price: '$3.50', status: 'pending', daysLeft: 15 },
    { id: 79, product: 'DISNEY+ ANUAL', client: 'Juan P.', supplier: 'Prov C', price: '$20.00', status: 'expired', daysLeft: 0 }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return { bg: 'rgba(34, 197, 94, 0.2)', text: '#4ade80', icon: <FiCheckCircle /> };
      case 'pending': return { bg: 'rgba(234, 179, 8, 0.2)', text: '#facc15', icon: <FiClock /> };
      case 'expired': return { bg: 'rgba(239, 68, 68, 0.2)', text: '#f87171', icon: <FiAlertCircle /> };
      default: return { bg: 'rgba(100,100,100,0.2)', text: '#ddd' };
    }
  };

  return (
    <div style={styles.internalCard}>
      <div style={{display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap'}}>
          <div style={{flex: 1, minWidth: '200px', position: 'relative'}}>
            <FiSearch style={{position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#aaa'}} />
            <input 
                placeholder="Buscar pedido..." 
                style={{
                    width: '100%', padding: '10px 10px 10px 35px', borderRadius: '8px', 
                    border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white'
                }} 
            />
          </div>
          <button style={{padding: '10px 15px', borderRadius: '8px', border: 'none', background: '#3b82f6', color: 'white', cursor: 'pointer', display: 'flex', gap: '5px', alignItems: 'center'}}>
            <FiFilter /> Filtrar
          </button>
      </div>

      <div style={{overflowX: 'auto'}}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Producto</th>
                <th style={styles.th}>Cliente</th>
                <th style={styles.th}>Precio</th>
                <th style={styles.th}>Estado</th>
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                  const statusInfo = getStatusColor(order.status);
                  return (
                  <tr key={order.id}>
                    <td style={styles.td}>#{order.id}</td>
                    <td style={styles.td}><span style={{fontWeight:'600', color: 'white'}}>{order.product}</span></td>
                    <td style={styles.td}>{order.client}</td>
                    <td style={styles.td}>{order.price}</td>
                    <td style={styles.td}>
                      <span style={{...styles.statusBadge, backgroundColor: statusInfo.bg, color: statusInfo.text}}>
                          {statusInfo.icon} {order.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={styles.td}>
                        <div style={{display: 'flex', gap: '8px'}}>
                          <button style={{background:'none', border:'none', color:'#667eea', cursor:'pointer'}}><FiEye size={18}/></button>
                          <button style={{background:'none', border:'none', color:'#aaa', cursor:'pointer'}}><FiEdit size={18}/></button>
                          <button style={{background:'none', border:'none', color:'#ff4d4d', cursor:'pointer'}}><FiTrash2 size={18}/></button>
                        </div>
                    </td>
                  </tr>
                  );
              })}
            </tbody>
          </table>
      </div>
    </div>
  );
};

// --- Dashboard Principal ---
const AdminDashboard = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    const checkScreenSize = () => {
        const mobile = window.innerWidth <= 1024;
        setIsMobile(mobile);
        if (!mobile) setIsSidebarOpen(false);
    };
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  // const CustomAdminOrderReports = () => <OrdersPage />; // No es necesario si ya usas AdminOrderReports

  if (isLoading) return <div style={{color:'white', padding:'50px', textAlign:'center'}}>Cargando Admin...</div>;
  if (!user) return <Navigate to="/login" replace />; 

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
              <PageHeader currentPage={location.pathname} />

              <Routes>
                <Route index element={<Navigate to="categorias" replace />} />
                
                <Route path="categorias" element={<CategoryManagement />} />
                <Route path="sitio" element={<SiteSettings />} />
                <Route path="usuarios" element={<UserManagement />} />
                <Route path="cupones" element={<CouponManagement />} />
                <Route path="recargas" element={<RechargeManagement />} />
                <Route path="rangos" element={<RankManagement />} />
                <Route path="productos" element={<ProductManagement />} />
                <Route path="proveedores" element={<ProviderManagement />} />
                <Route path="recompensas" element={<RedeemableItemsManagement />} />
                
                <Route path="pedidos" element={<AdminOrderReports />} />
              </Routes>
          </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
