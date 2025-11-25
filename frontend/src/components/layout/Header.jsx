import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '/src/context/CartContext';
import apiClient from '/src/services/apiClient';
import { useAuth } from '/src/context/AuthContext';
import NotificationBell from '/src/components/ui/NotificationBell.jsx';
import { 
  FiSearch, FiShoppingCart, FiGrid, FiLogOut, FiX, 
  FiDollarSign, FiStar, FiChevronDown, FiUser, FiTrendingUp, FiAward, FiCheck
} from 'react-icons/fi';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { itemCount } = useCart();

  // Estados
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const searchRef = useRef(null);
  const profileRef = useRef(null);
  const inputRef = useRef(null); 

  // --- LÓGICA DE BÚSQUEDA CON DEBOUNCE (Ahora en 200ms) ---
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setResults([]);
      setShowResults(false);
      return;
    }

    // Retraso de 200ms (ajustado para más fluidez)
    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      setShowResults(true);
      try {
        const response = await apiClient.get(`/search?q=${encodeURIComponent(searchTerm)}`);
        if (response.data && response.data.length > 0) {
            setResults(response.data);
        } else {
            setResults([]);
        }
      } catch (err) {
        console.error("Error búsqueda:", err);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 200); // <--- TIEMPO REDUCIDO

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]); 

  // --- EFECTO PARA RESTAURAR EL FOCO (Anti-pérdida de foco) ---
  useEffect(() => {
    if (!isLoading && searchTerm.length > 0 && inputRef.current) {
      // Usar requestAnimationFrame para asegurar que el DOM se haya actualizado antes de forzar el foco
      requestAnimationFrame(() => {
          inputRef.current.focus();
      });
    }
  }, [results, isLoading]); 

  // --- CLICK OUTSIDE ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileOpen(false);
  }; // <--- NO HAY '}' EXTRA AQUÍ

  const getDashboardLink = () => {
    if (!user) return '/';
    const roles = {
      'administrador': '/admin',
      'proveedor': '/proveedor',
      'afiliador': '/afiliador',
      'usuario': '/usuario'
    };
    return roles[user.role] || '/';
  };

  const getTierIcon = (tier) => {
    switch (tier) {
      case 'vip': return <FiTrendingUp size={14} color="#FFD700" />;
      case 'diamante': return <FiAward size={14} color="#00BFFF" />;
      default: return <FiCheck size={14} color="#667eea" />;
    }
  };

  const getUserInitial = () => user?.username ? user.username.charAt(0).toUpperCase() : 'U';

  // --- COMPONENTE BUSCADOR ---
  const SearchBar = ({ mobile = false }) => (
    <div 
      className={`search-wrapper ${mobile ? 'mobile-search-bar' : 'desktop-search-bar'}`}
      ref={mobile ? null : searchRef}
    >
      <div className="search-input-container">
        <FiSearch className="search-icon" size={18} />
        <input
          type="text"
          placeholder="Buscar..."
          ref={inputRef}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => { if(searchTerm) setShowResults(true); }}
        />
        {mobile && (
          <button className="close-search-btn" onClick={() => setIsMobileSearchOpen(false)}>
            <FiX size={20} />
          </button>
        )}
      </div>

      {showResults && (mobile || !isMobileSearchOpen) && (
        <div 
            className="search-results-dropdown"
            onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); }} 
        >
          {isLoading ? (
            <div className="p-4 text-center text-gray-400">Buscando...</div>
          ) : results.length > 0 ? (
            results.map(prod => (
              <Link 
                to={`/producto/${prod.slug}`} 
                key={prod.id} 
                className="search-item"
                tabIndex="-1" 
                onClick={() => {
                  setShowResults(false);
                  setSearchTerm(''); 
                  setIsMobileSearchOpen(false);
                }}
              >
                <img 
                  src={prod.image_url || 'https://placehold.co/40'} 
                  alt={prod.name} 
                  style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }}
                />
                <div>
                  <div className="prod-name">{prod.name}</div>
                  <div className="prod-provider">{prod.provider_name || 'Admin'}</div>
                </div>
              </Link>
            ))
          ) : (
            !isLoading && searchTerm.trim() !== '' && (
              <div className="p-4 text-center text-gray-400">No hay resultados para "{searchTerm}"</div>
            )
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      <header className="main-header">
        <div className="header-content">
          
          {/* 1. LOGO */}
          <Link to="/" className="logo-container">
            <img src="/src/images/BLACK.png" alt="BlackStreaming" className="logo-img" />
          </Link>

          {/* 2. BUSCADOR (Central) */}
          <SearchBar />

          {/* 3. NAVEGACIÓN DERECHA */}
          <div className="nav-actions">
            
            {/* Lupa Móvil */}
            <button 
              className="icon-btn mobile-only" 
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            >
              <FiSearch size={22} />
            </button>

            {/* Carrito */}
            <Link to="/carrito" className="icon-btn cart-btn">
              <FiShoppingCart size={22} />
              {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
            </Link>

            {user ? (
              <>
                {/* Notificaciones (Con corrección de estilo) */}
                <div className="notification-wrapper">
                  <NotificationBell />
                </div>
                
                {/* --- DATOS VISIBLES EN DESKTOP (Nombre, Saldo, Puntos) --- */}
                <div className="desktop-user-data">
                  <div className="user-text-info">
                    <span className="u-name">{getTierIcon(user.tier)} {user.username}</span>
                  </div>
                  <div className="user-financials">
                    <span className="f-pill money"><FiDollarSign size={12}/>{parseFloat(user.balance_usd).toFixed(2)}</span>
                    <span className="f-pill points"><FiStar size={12}/>{user.points_balance || 0}</span>
                  </div>
                </div>

                {/* --- MENU PERFIL (AVATAR) --- */}
                <div className="profile-menu-container" ref={profileRef}>
                  <button 
                    className={`user-avatar-btn ${isProfileOpen ? 'active' : ''}`} 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                  >
                    <div className="user-avatar-circle">
                      {getUserInitial()}
                    </div>
                    <FiChevronDown className="avatar-arrow" />
                  </button>

                  {/* MENÚ DESPLEGABLE */}
                  <div className={`profile-dropdown ${isProfileOpen ? 'open' : ''}`}>
                    
                    {/* INFO SOLO VISIBLE EN MÓVIL (Nombre, Saldo, Puntos) */}
                    <div className="mobile-dropdown-info">
                      <div className="dd-header-mobile">
                        <div className="dd-avatar-mobile">{getUserInitial()}</div>
                        <div>
                          <span className="dd-name-mobile">{user.username}</span>
                          <span className="dd-role-mobile">{user.role}</span>
                        </div>
                      </div>
                      <div className="dd-stats-mobile">
                        <span className="f-pill money full"><FiDollarSign/> {parseFloat(user.balance_usd).toFixed(2)}</span>
                        <span className="f-pill points full"><FiStar/> {user.points_balance || 0}</span>
                      </div>
                      <hr className="dd-divider" />
                    </div>

                    {/* BOTONES */}
                    <div className="dropdown-actions">
                      <Link 
                        to={getDashboardLink()} 
                        className="dd-action-btn btn-dashboard"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <FiGrid size={18} /> Dashboard
                      </Link>
                      
                      <button 
                        onClick={handleLogout} 
                        className="dd-action-btn btn-logout"
                      >
                        <FiLogOut size={18} /> Cerrar Sesión
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="nav-link">Ingresar</Link>
                <Link to="/register" className="nav-btn-register">Registro</Link>
              </div>
            )}
          </div>
        </div>

        {/* BUSCADOR MÓVIL EXPANDIDO */}
        {isMobileSearchOpen && (
          <div className="mobile-search-container">
            <SearchBar mobile={true} />
          </div>
        )}
      </header>

      {/* --- ESTILOS CSS (Sin cambios, ya están optimizados) --- */}
      <style>{`
        /* --- HEADER BASE --- */
        .main-header {
          position: sticky; top: 0; z-index: 1000;
          background: rgba(10, 10, 10, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          font-family: 'Inter', sans-serif; color: #e0e0e0;
        }
        .header-content {
          max-width: 1400px; margin: 0 auto; padding: 0 24px;
          display: flex; align-items: center; justify-content: space-between;
          height: 80px; gap: 20px;
        }

        /* --- LOGO --- */
        .logo-img { height: 40px; width: auto; filter: brightness(0) invert(1); transition: 0.3s; }
        .logo-img:hover { transform: scale(1.05); }

        /* --- BUSCADOR DESKTOP --- */
        .desktop-search-bar { flex: 1; max-width: 500px; position: relative; }
        .search-input-container { position: relative; width: 100%; display: flex; align-items: center; }
        .search-input-container input {
          width: 100%; padding: 12px 16px 12px 48px; border-radius: 99px;
          border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05);
          color: white; font-size: 0.95rem; outline: none; transition: 0.3s;
        }
        .search-input-container input:focus {
          background: rgba(0,0,0,0.5); border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
        }
        .search-icon { position: absolute; left: 16px; color: #888; pointer-events: none; }
        
        /* CORRECCIÓN Z-INDEX */
        .search-results-dropdown {
          position: absolute; top: calc(100% + 10px); left: 0; width: 100%;
          background: #141414; border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px; box-shadow: 0 20px 50px rgba(0,0,0,0.6);
          overflow: hidden; 
          z-index: 2000; /* Alto Z-INDEX para superponer el menú lateral */
        }
        .search-item {
          display: flex; align-items: center; gap: 12px; padding: 12px 16px;
          text-decoration: none; color: #e0e0e0; border-bottom: 1px solid rgba(255,255,255,0.05);
          transition: 0.2s;
        }
        .search-item:hover { background: rgba(255,255,255,0.08); }

        .prod-name { font-weight: 600; font-size: 0.95rem; }
        .prod-provider { font-size: 0.75rem; color: #999; }

        /* --- ACCIONES DERECHA --- */
        .nav-actions { display: flex; align-items: center; gap: 16px; }

        .icon-btn {
          background: transparent; border: none; color: #a0a0a0; padding: 10px;
          border-radius: 50%; cursor: pointer; transition: 0.3s;
          display: flex; align-items: center; justify-content: center; position: relative;
        }
        .icon-btn:hover { color: white; background: rgba(255,255,255,0.1); }
        .cart-badge {
          position: absolute; top: 0; right: 0; background: #E50914; color: white;
          font-size: 0.65rem; font-weight: bold; height: 18px; width: 18px;
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          border: 2px solid #080808;
        }

        /* --- ARREGLO DE NOTIFICACIONES --- */
        /* Quitamos el borde blanco de la campana */
        .notification-wrapper > button {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }
        /* Damos estilo al contenedor de la lista de notificaciones */
        .notification-wrapper > div {
          background-color: #181818 !important;
          border: 1px solid #333 !important;
          border-radius: 12px !important;
          box-shadow: 0 10px 30px rgba(0,0,0,0.8) !important;
          color: #e0e0e0 !important;
          z-index: 2000; /* Aseguramos z-index alto aquí también */
        }
        /* Estilizar textos dentro de la notificacion */
        .notification-wrapper h4, 
        .notification-wrapper h3, 
        .notification-wrapper strong {
          color: #fff !important;
        }
        .notification-wrapper p, 
        .notification-wrapper span {
          color: #ccc !important;
        }
        
        /* SCROLLBAR PERSONALIZADO OSCURO PARA TODO EL SITIO Y NOTIFICACIONES */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #0c0c0c; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #555; }


        /* --- DATOS USUARIO DESKTOP --- */
        .desktop-user-data {
          display: flex; flex-direction: column; align-items: flex-end;
          margin-right: 4px; line-height: 1.2;
        }
        .u-name { font-weight: 600; color: white; font-size: 0.9rem; display: flex; align-items: center; gap: 4px; }
        .user-financials { display: flex; gap: 6px; margin-top: 4px; }
        .f-pill {
          font-size: 0.75rem; padding: 2px 8px; border-radius: 6px;
          display: flex; align-items: center; gap: 4px; font-weight: 700;
        }
        .f-pill.money { background: rgba(39, 174, 96, 0.2); color: #2ecc71; }
        .f-pill.points { background: rgba(255, 215, 0, 0.15); color: #f1c40f; }

        /* --- AVATAR --- */
        .profile-menu-container { position: relative; height: 42px; display: flex; align-items: center; }
        .user-avatar-btn {
          background: transparent; border: none; cursor: pointer;
          display: flex; align-items: center; gap: 6px; padding: 0;
          transition: 0.3s; outline: none;
        }
        .user-avatar-circle {
          width: 42px; height: 42px; border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white; font-weight: 700; font-size: 1.2rem;
          display: flex; align-items: center; justify-content: center;
          border: 2px solid rgba(255,255,255,0.2);
        }
        .avatar-arrow { color: #888; font-size: 14px; transition: 0.3s; }
        .user-avatar-btn:hover .avatar-arrow { color: white; }

        /* --- MENÚ DESPLEGABLE DE PERFIL --- */
        .profile-dropdown {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          width: 250px;
          background: #181818; 
          border: 1px solid #333;
          border-radius: 12px;
          padding: 12px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.8);
          opacity: 0; visibility: hidden; transform: translateY(-10px);
          transition: 0.2s cubic-bezier(0.2, 0, 0, 1);
          z-index: 2000;
          display: flex; flex-direction: column; gap: 10px;
          box-sizing: border-box;
        }
        .profile-dropdown.open { opacity: 1; visibility: visible; transform: translateY(0); }

        .mobile-dropdown-info { display: none; padding-bottom: 8px; }
        .dd-divider { border: 0; height: 1px; background: rgba(255,255,255,0.1); margin: 8px 0; }
        .dropdown-actions { display: flex; flex-direction: column; gap: 8px; width: 100%; }

        /* BOTONES (Box Sizing para evitar desbordamiento) */
        .dd-action-btn {
          width: 100%; 
          box-sizing: border-box;
          padding: 12px; 
          border-radius: 8px; border: none;
          cursor: pointer; font-weight: 600; display: flex; align-items: center;
          justify-content: center; gap: 10px; text-decoration: none; font-size: 0.95rem;
          transition: 0.2s;
        }
        .dd-action-btn.btn-dashboard {
          background: #2a2a2a; color: white; border: 1px solid transparent;
        }
        .dd-action-btn.btn-dashboard:hover { background: #3a3a3a; }
        .dd-action-btn.btn-logout {
          background: transparent; color: #ff5252;
          border: 1px solid rgba(255, 82, 82, 0.3);
        }
        .dd-action-btn.btn-logout:hover {
          background: rgba(255, 82, 82, 0.05);
          border-color: #ff5252;
        }

        /* --- AUTH BUTTONS --- */
        .auth-buttons { display: flex; align-items: center; gap: 12px; }
        .nav-link { color: #ccc; text-decoration: none; font-weight: 500; transition: 0.2s; }
        .nav-link:hover { color: white; }
        .nav-btn-register {
          padding: 8px 20px; border-radius: 99px; background: white; color: black;
          text-decoration: none; font-weight: 700; transition: 0.3s;
        }
        .nav-btn-register:hover { transform: scale(1.05); }

        /* --- RESPONSIVE --- */
        .mobile-only { display: none; }
        .mobile-search-container { display: none; }

        @media (max-width: 900px) {
          .desktop-search-bar { display: none; }
          .desktop-user-data { display: none; } 
          .mobile-only { display: flex; }

          /* Buscador móvil ajustado */
          .mobile-search-container {
            display: block; position: absolute; top: 80px; left: 0; width: 100%;
            background: #0f0f0f; padding: 10px 16px; z-index: 999;
            border-bottom: 1px solid #222;
          }
          /* Ajuste de inputs en móvil para que no sean gigantes */
          .mobile-search-bar .search-input-container input {
            padding: 8px 12px 8px 40px;
            font-size: 0.9rem;
          }
          
          .close-search-btn {
            position: absolute; right: 16px; top: 50%; transform: translateY(-50%);
            background: none; border: none; color: white;
          }

          /* Dropdown en móvil */
          .mobile-search-bar .search-results-dropdown { z-index: 2000; }
          .profile-dropdown { width: 260px; right: 10px; z-index: 2000; }
          .mobile-dropdown-info { display: block; } 

          .dd-header-mobile { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
          .dd-avatar-mobile { 
            width: 40px; height: 40px; background: #333; border-radius: 50%; 
            display: flex; align-items: center; justify-content: center; font-weight: bold;
          }
          .dd-name-mobile { display: block; font-weight: 700; color: white; }
          .dd-role-mobile { display: block; font-size: 0.75rem; color: #888; text-transform: capitalize; }
          
          .dd-stats-mobile { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
          .f-pill.full { justify-content: center; padding: 6px; background: rgba(255,255,255,0.05); }
        }
      `}</style>
    </>
  );
};

export default Header;
