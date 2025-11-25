// src/features/dashboard/UserDashboard/OrderHistory.jsx

import React, { useState, useEffect, useMemo } from 'react';
import apiClient from '../../../services/apiClient.js';
import { useAuth } from '../../../context/AuthContext';
import { 
  FiSearch, FiDownload, FiRefreshCw, FiMessageCircle, FiUser, FiEye, FiCalendar, 
  FiClock, FiDollarSign, FiPackage, FiPhone, FiMail, FiKey, FiUserCheck, 
  FiCheckCircle, FiXCircle, FiAlertTriangle, FiShoppingBag, FiAward, FiLifeBuoy,
  FiChevronLeft, FiChevronRight, FiSend // Importamos FiSend
} from 'react-icons/fi';

// --- Estilos Ultra Modernos & Compactos (Data Grid) ---
const styles = {
  container: { 
    padding: '24px 16px', 
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", 
    background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 50%, #0f0f0f 100%)',
    minHeight: '100vh',
    position: 'relative',
    overflow: 'hidden'
  },
  backgroundDecoration: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
    zIndex: 0
  },
  headerSection: { textAlign: 'center', marginBottom: '32px', position: 'relative', zIndex: 1 },
  header: { 
    fontSize: '2.5rem', 
    fontWeight: '800', 
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '8px',
    letterSpacing: '-0.02em'
  },
  subtitle: { fontSize: '1.1rem', color: '#b0b0b0', maxWidth: '600px', margin: '0 auto' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px', position: 'relative', zIndex: 1 },
  statCard: { background: 'rgba(30, 30, 30, 0.7)', backdropFilter: 'blur(20px)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255, 255, 255, 0.1)', position: 'relative', overflow: 'hidden', transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)', cursor: 'pointer' },
  statCardHover: { transform: 'translateY(-4px) scale(1.01)', borderColor: 'rgba(102, 126, 234, 0.3)', boxShadow: '0 10px 20px rgba(0, 0, 0, 0.4)' },
  statCardGlow: { position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #667eea, #764ba2, #f093fb)' },
  statValue: { fontSize: '2rem', fontWeight: '800', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '4px', lineHeight: '1' },
  statLabel: { fontSize: '0.9rem', color: '#a0a0a0', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' },
  statIcon: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '8px', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  controlsSection: { display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '12px', marginBottom: '20px', position: 'relative', zIndex: 1, alignItems: 'center' },
  searchContainer: { position: 'relative', maxWidth: '350px' },
  searchInput: { width: '100%', padding: '12px 16px 12px 40px', fontSize: '0.9rem', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', backgroundColor: 'rgba(30, 30, 30, 0.8)', color: '#ffffff', backdropFilter: 'blur(20px)', transition: 'all 0.3s ease', fontFamily: 'inherit' },
  searchInputFocus: { borderColor: '#667eea', backgroundColor: 'rgba(40, 40, 40, 0.9)', boxShadow: '0 0 0 2px rgba(102, 126, 234, 0.1)' },
  searchIcon: { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666', width: '16px' },
  filterGroup: { display: 'flex', gap: '12px', alignItems: 'center' },
  sortSelect: { padding: '12px 16px', fontSize: '0.85rem', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', backgroundColor: 'rgba(30, 30, 30, 0.8)', color: '#ffffff', backdropFilter: 'blur(20px)', cursor: 'pointer', minWidth: '150px', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', backgroundSize: '14px', fontFamily: 'inherit' },
  exportButton: { padding: '12px 16px', border: 'none', borderRadius: '12px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s ease', backdropFilter: 'blur(20px)', position: 'relative', overflow: 'hidden' },
  exportButtonHover: { transform: 'translateY(-1px)', boxShadow: '0 5px 15px rgba(102, 126, 234, 0.4)' },
  buttonGlow: { position: 'absolute', top: 0, left: '-100%', width: '100%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)', transition: 'left 0.5s ease' },
  buttonGlowHover: { left: '100%' },
  tableContainer: { background: 'rgba(25, 25, 25, 0.8)', backdropFilter: 'blur(20px)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)', overflow: 'hidden', position: 'relative', zIndex: 1, boxShadow: '0 4px 20px rgba(0,0,0,0.2)' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' },
  th: { padding: '12px 10px', backgroundColor: 'rgba(40, 40, 40, 0.95)', fontWeight: '700', color: '#a0a0a0', textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', whiteSpace: 'nowrap' },
  td: { padding: '8px 10px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', color: '#e0e0e0', verticalAlign: 'middle' },
  tableRow: { transition: 'all 0.2s ease', cursor: 'pointer' },
  tableRowHover: { backgroundColor: 'rgba(255, 255, 255, 0.08)' },
  productCell: { display: 'flex', alignItems: 'center', gap: '10px' },
  productIcon: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '8px', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '28px', height: '28px' },
  productInfo: { display: 'flex', flexDirection: 'column', gap: '2px', maxWidth: '180px' },
  productName: { fontWeight: '600', color: '#ffffff', fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  productMeta: { fontSize: '0.75rem', color: '#888', display: 'flex', alignItems: 'center', gap: '6px' },
  customerCell: { display: 'flex', flexDirection: 'column', gap: '2px', maxWidth: '140px' },
  customerName: { fontWeight: '500', color: '#ffffff', fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  
  // --- MODIFICADO: Estilo para el teléfono ---
  customerPhone: { fontSize: '0.75rem', color: '#a0a0a0', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' },

  actionButtons: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', width: 'auto', minWidth: '160px' },
  actionButton: { padding: '6px 8px', border: 'none', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s ease', whiteSpace: 'nowrap' },
  accountButton: { background: 'rgba(102, 126, 234, 0.1)', color: '#667eea', border: '1px solid rgba(102, 126, 234, 0.3)' },
  renewButton: { background: 'rgba(39, 174, 96, 0.1)', color: '#27ae60', border: '1px solid rgba(39, 174, 96, 0.3)' },
  contactButton: { background: 'rgba(23, 162, 184, 0.1)', color: '#17a2b8', border: '1px solid rgba(23, 162, 184, 0.3)' },
  
  // --- NUEVO: Estilo botón enviar al cliente ---
  customerContactButton: { background: 'rgba(37, 211, 102, 0.15)', color: '#25D366', border: '1px solid rgba(37, 211, 102, 0.3)' },

  supportButton: { background: 'rgba(255, 87, 34, 0.1)', color: '#ff5722', border: '1px solid rgba(255, 87, 34, 0.3)' },
  disabledButton: { background: 'rgba(108, 117, 125, 0.1)', color: '#6c757d', border: '1px solid rgba(108, 117, 125, 0.3)', cursor: 'not-allowed' },
  statusBadge: { padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '4px', minWidth: '70px', justifyContent: 'center', textTransform: 'uppercase' },
  statusActive: { background: 'rgba(39, 174, 96, 0.15)', color: '#2ecc71', border: '1px solid rgba(39, 174, 96, 0.2)' },
  statusPending: { background: 'rgba(23, 162, 184, 0.15)', color: '#17a2b8', border: '1px solid rgba(23, 162, 184, 0.2)' },
  statusExpired: { background: 'rgba(108, 117, 125, 0.15)', color: '#adb5bd', border: '1px solid rgba(108, 117, 125, 0.2)' },
  statusSupport: { background: 'rgba(255, 193, 7, 0.15)', color: '#ffc107', border: '1px solid rgba(255, 193, 7, 0.2)' },
  daysBadge: { padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' },
  daysCritical: { background: 'rgba(220, 53, 69, 0.1)', color: '#e74c3c', border: '1px solid rgba(220, 53, 69, 0.2)' },
  daysWarning: { background: 'rgba(255, 193, 7, 0.1)', color: '#f1c40f', border: '1px solid rgba(255, 193, 7, 0.2)' },
  daysGood: { background: 'rgba(39, 174, 96, 0.1)', color: '#2ecc71', border: '1px solid rgba(39, 174, 96, 0.2)' },
  priceCell: { display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600', fontSize: '0.85rem' },
  paginationContainer: { display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px', marginTop: '16px', padding: '0 8px', position: 'relative', zIndex: 2 },
  pageBtn: { background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', transition: '0.3s', fontSize: '0.8rem' },
  pageBtnDisabled: { opacity: 0.4, cursor: 'not-allowed' },
  pageInfo: { color: '#888', fontSize: '0.8rem' },
  loadingState: { textAlign: 'center', padding: '100px 40px', color: '#a0a0a0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', position: 'relative', zIndex: 1 },
  errorState: { textAlign: 'center', padding: '80px 40px', color: '#ff6b6b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', position: 'relative', zIndex: 1 },
  emptyState: { textAlign: 'center', padding: '60px 20px', color: '#a0a0a0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.05)', position: 'relative', zIndex: 1 },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' },
  modalContent: { background: '#1e1e1e', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '450px', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)' },
  modalHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' },
  modalTitle: { fontSize: '1.2rem', fontWeight: '700', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px' },
  modalCloseButton: { background: 'transparent', border: 'none', color: '#666', cursor: 'pointer' },
  modalCloseButtonHover: { color: '#fff' },
  modalSection: { marginBottom: '16px' },
  modalDetail: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '0.9rem' },
  modalDetailLabel: { color: '#888' },
  modalDetailValue: { color: '#fff', fontWeight: '500' },
  accountCredentials: { background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '16px', marginTop: '12px' },
  credentialItem: { display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '0.85rem' },
  renewPrice: { fontSize: '1.5rem', fontWeight: '800', color: '#2ecc71', textAlign: 'center', margin: '16px 0' },
  confirmButton: { width: '100%', padding: '12px', border: 'none', borderRadius: '10px', background: '#667eea', color: 'white', fontWeight: '600', cursor: 'pointer', marginTop: '10px' },
  confirmButtonHover: { background: '#5a6fd6' },
  confirmButtonDisabled: { opacity: 0.6 },
  modalError: { color: '#ff6b6b', fontSize: '0.85rem', textAlign: 'center', marginTop: '10px' },
  pulseAnimation: { animation: 'pulse 2s infinite' }
};

// Helpers
const getRemainingDaysValue = (endDateObject, itemStatus) => {
  if (itemStatus !== 'activo' || !endDateObject) return Infinity;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const end = new Date(endDateObject.getTime()); end.setHours(0, 0, 0, 0);
  const remainingDays = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return remainingDays <= 0 ? Infinity : remainingDays;
};

const getRemainingDaysStatus = (endDateObject, totalDuration, itemStatus) => {
  if (itemStatus === 'soporte') return { text: 'Soporte', style: styles.statusSupport, icon: FiLifeBuoy };
  if (itemStatus !== 'activo') return { text: 'Pendiente', style: styles.statusPending, icon: FiClock };
  if (!endDateObject) return { text: 'Activo', style: styles.statusActive, icon: FiCheckCircle };

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const end = new Date(endDateObject.getTime()); end.setHours(0, 0, 0, 0);
  const remainingDays = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (remainingDays <= 0) return { text: 'Expirado', style: styles.statusExpired, icon: FiXCircle };
  if (totalDuration === 0 || !totalDuration) return { text: `${remainingDays}d`, style: styles.daysGood, icon: FiCheckCircle };
  
  const percentageLeft = (remainingDays / totalDuration) * 100;
  if (percentageLeft <= 10) return { text: `${remainingDays}d`, style: styles.daysCritical, icon: FiAlertTriangle };
  if (percentageLeft <= 40) return { text: `${remainingDays}d`, style: styles.daysWarning, icon: FiClock };
  return { text: `${remainingDays}d`, style: styles.daysGood, icon: FiCheckCircle };
};

const OrderHistory = () => {
  const [allOrderItems, setAllOrderItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // --- IMPORTANTE: Obtenemos 'user' para el nombre del usuario logueado ---
  const { isAuthenticated, refreshUser, user } = useAuth(); 

  const [searchTerm, setSearchTerm] = useState('');
  const [sortType, setSortType] = useState('recent');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isExportHovered, setIsExportHovered] = useState(false);
  const [hoveredStat, setHoveredStat] = useState(null);

  const [modalType, setModalType] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isRenewing, setIsRenewing] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [isCloseHovered, setIsCloseHovered] = useState(false);
  const [isConfirmHovered, setIsConfirmHovered] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const fetchAllOrderDetails = async () => {
    if (!isAuthenticated) {
      setError('Debes iniciar sesión para ver tu historial.');
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const response = await apiClient.get('/orders/history');
      const orders = response.data;
      const allItems = [];
      for (const order of orders) {
        try {
          const detailsResponse = await apiClient.get(`/orders/${order.id}`);
          const orderItems = detailsResponse.data.items || [];
          orderItems.forEach(item => {
            const startDate = item.activation_date ? new Date(item.activation_date) : null;
            const totalDurationDays = item.duration_days || 0;
            const originalDurationDays = item.original_duration_days || totalDurationDays;
            const endDateObject = startDate ? new Date(startDate.getTime() + (totalDurationDays * 24 * 60 * 60 * 1000)) : null;
            
            allItems.push({
              orderId: order.id,
              orderDate: order.created_at,
              orderStatus: order.status,
              orderItemId: item.order_item_id,
              stockItemId: item.stock_item_id,
              productName: item.product_name,
              productType: item.product_type,
              email: item.email || 'N/A',
              password: item.password || 'N/A',
              profileName: item.profile_name || 'N/A',
              pin: item.pin || 'N/A',
              customerName: item.customer_name || 'N/A',
              customerPhone: item.customer_phone || 'N/A', // Asegurar que esto venga del backend
              price: item.price_per_unit_usd,
              hasRenewal: item.has_renewal,
              renewalPrice: item.renewal_price_usd,
              totalDuration: totalDurationDays,
              contractedDays: originalDurationDays,
              startDate: startDate ? startDate.toLocaleDateString('es-ES') : 'N/A',
              endDate: endDateObject ? endDateObject.toLocaleDateString('es-ES') : 'N/A',
              endDateObject: endDateObject,
              providerName: item.provider_name || 'N/A',
              providerNumber: item.provider_phone || 'N/A',
              quantity: item.quantity,
              itemStatus: item.status,
            });
          });
        } catch (itemErr) {
          console.error(`Error al cargar detalles del pedido ${order.id}:`, itemErr);
        }
      }
      setAllOrderItems(allItems);
    } catch (err) {
      setError('Error al cargar el historial de pedidos.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrderDetails();
  }, [isAuthenticated]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortType]);

  const filteredAndSortedItems = useMemo(() => {
    let items = [...allOrderItems];
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      items = items.filter(item => 
        item.productName.toLowerCase().includes(searchLower) ||
        item.providerName.toLowerCase().includes(searchLower) ||
        item.customerName.toLowerCase().includes(searchLower) ||
        item.email.toLowerCase().includes(searchLower) ||
        item.profileName.toLowerCase().includes(searchLower)
      );
    }
    switch (sortType) {
      case 'recent': items.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)); break;
      case 'days_asc': items.sort((a, b) => getRemainingDaysValue(a.endDateObject, a.itemStatus) - getRemainingDaysValue(b.endDateObject, b.itemStatus)); break;
      case 'price_desc': items.sort((a, b) => b.price - a.price); break;
      case 'price_asc': items.sort((a, b) => a.price - b.price); break;
      default: items.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
    }
    return items;
  }, [allOrderItems, searchTerm, sortType]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAndSortedItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAndSortedItems.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const exportToCSV = () => {
    if (!filteredAndSortedItems || filteredAndSortedItems.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }

    const headers = [
      "ID Pedido", "Fecha", "Producto", "Cliente", "Teléfono", 
      "Proveedor", "Precio", "Renovación", "Estado", 
      "Vencimiento", "Email Cuenta", "Contraseña", "Perfil", "PIN"
    ];

    const rows = filteredAndSortedItems.map(item => {
      const safeText = (text) => `"${String(text || '').replace(/"/g, '""')}"`;
      return [
        item.orderId,
        item.orderDate ? new Date(item.orderDate).toLocaleDateString('es-ES') : '',
        safeText(item.productName),
        safeText(item.customerName),
        safeText(item.customerPhone),
        safeText(item.providerName),
        item.price,
        item.renewalPrice || '0.00',
        item.itemStatus,
        item.endDate,
        safeText(item.email),
        safeText(item.password),
        safeText(item.profileName),
        safeText(item.pin)
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `historial_pedidos_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- NUEVA FUNCIÓN: ENVIAR DATOS AL CLIENTE ---
  const handleContactCustomer = (item) => {
    if (!item.customerPhone || item.customerPhone === 'N/A') {
        alert('El cliente no tiene un número de teléfono registrado.');
        return;
    }
    
    const userName = user?.name || user?.username || 'Administrador'; // Nombre de usuario logueado
    const duration = item.contractedDays || 30; // Usamos días contratados para la plantilla

    const message = `Hola 👋🏻
🍿Tu subscripción a *${item.productName}* X *${duration}* DIAS🍿
✉ usuario: ${item.email}
🔐 contraseña: ${item.password}
👥 Perfil: ${item.profileName}
🔐 Pin: ${item.pin}
⏳ Contratado: ${duration} días
🗓 Compra: ${item.startDate}
🗓 Vencimiento: ${item.endDate}
⚠ Condiciones de uso: Uso: Este perfil es de ${item.productName} es válido por ${duration} DIAS y está diseñado para un único dispositivo.

Garantía: Para mantener la garantía, no modifiques la contraseña, los datos de pago ni el plan. El uso en múltiples dispositivos anulará la garantía y el acceso.

Soporte: Resolveremos cualquier inconveniente en un máximo de 24 horas. En caso de fallas generalizadas, se reembolsará el saldo pendiente al día siguiente.
🎬🍿🎬🍿🎬🍿🎬🍿🎬🍿🎬🍿
¡¡Muchas gracias por su compra!! ${userName}`;

    const phone = item.customerPhone.replace(/\D/g, '');
    const url = `https://api.whatsapp.com/send/?phone=${phone}&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };
  // ---------------------------------------------

  const handleReportIssue = async (item) => {
    if (!confirm(`¿Tienes problemas con "${item.productName}"?\n\nEsto cambiará el estado a "Soporte" y notificará al proveedor.`)) return;
    try {
      await apiClient.post(`/orders/item/${item.orderItemId}/report`);
      alert('✅ Reporte enviado. El proveedor revisará tu caso.');
      fetchAllOrderDetails();
    } catch (err) {
      alert('❌ Error: ' + (err.response?.data?.error || 'No se pudo enviar el reporte.'));
    }
  };

  const handleConfirmRenewal = async () => {
    if (!selectedItem || isRenewing) return;
    setIsRenewing(true);
    setModalError(null);
    try {
      const response = await apiClient.post(`/orders/renew/${selectedItem.orderItemId}`);
      alert(`¡Renovación exitosa! Nuevo saldo: $${response.data.newBalance.toFixed(2)}`);
      refreshUser();
      fetchAllOrderDetails();
      closeModal();
    } catch (err) {
      setModalError(err.response?.data?.error || 'Error al renovar.');
    } finally {
      setIsRenewing(false);
    }
  };

  const handleShowAccount = (item) => { setSelectedItem(item); setModalType('account'); };
  const handleOpenRenewal = (item) => { setSelectedItem(item); setModalError(null); setModalType('renew'); };
  const closeModal = () => { setModalType(null); setSelectedItem(null); setModalError(null); setIsRenewing(false); setIsCloseHovered(false); setIsConfirmHovered(false); };
  const handleContactProvider = (item) => { 
    if(item.providerNumber && item.providerNumber !== 'N/A') {
        window.open(`https://wa.me/${item.providerNumber.replace(/\D/g, '')}`, '_blank'); 
    }
  };

  if (isLoading) return <div style={styles.loadingState}><div style={styles.pulseAnimation}><FiPackage size={48} color="#667eea" /></div><h3>Cargando Historial</h3></div>;
  if (error) return <div style={styles.errorState}><FiAlertTriangle size={48} /><h3>Error</h3><p>{error}</p></div>;

  return (
    <div style={styles.container}>
      <div style={styles.backgroundDecoration} />
      
      <div style={styles.headerSection}>
        <h1 style={styles.header}>Historial</h1>
        <p style={styles.subtitle}>Gestiona tus suscripciones</p>
      </div>

      {/* Estadísticas Compactas */}
      <div style={styles.statsGrid}>
        {[
          { value: allOrderItems.length, label: 'Total', icon: FiShoppingBag },
          { value: allOrderItems.filter(i => i.itemStatus === 'activo').length, label: 'Activos', icon: FiAward },
          { value: allOrderItems.filter(i => i.itemStatus === 'soporte').length, label: 'Soporte', icon: FiLifeBuoy }
        ].map((stat, i) => (
          <div key={i} style={{...styles.statCard, ...(hoveredStat === i && styles.statCardHover)}} onMouseEnter={() => setHoveredStat(i)} onMouseLeave={() => setHoveredStat(null)}>
            <div style={styles.statCardGlow} />
            <div style={styles.statValue}>{stat.value}</div>
            <div style={styles.statLabel}><div style={styles.statIcon}><stat.icon size={16} color="white" /></div>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Controles Compactos */}
      <div style={styles.controlsSection}>
        <div style={styles.searchContainer}>
          <FiSearch size={16} style={styles.searchIcon} />
          <input type="text" placeholder="Buscar pedido..." style={{...styles.searchInput, ...(isSearchFocused && styles.searchInputFocus)}} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onFocus={() => setIsSearchFocused(true)} onBlur={() => setIsSearchFocused(false)} />
        </div>
        <div style={styles.filterGroup}>
          <select style={styles.sortSelect} value={sortType} onChange={(e) => setSortType(e.target.value)}>
            <option value="recent">Recientes</option>
            <option value="days_asc">Por Vencer</option>
            <option value="price_desc">Precio Alto</option>
          </select>
          <button onClick={exportToCSV} style={{...styles.exportButton, ...(isExportHovered && styles.exportButtonHover)}} onMouseEnter={() => setIsExportHovered(true)} onMouseLeave={() => setIsExportHovered(false)}>
            <div style={{...styles.buttonGlow, ...(isExportHovered && styles.buttonGlowHover)}} />
            <FiDownload size={16} /> CSV
          </button>
        </div>
      </div>

      {/* Tabla Compacta Data Grid */}
      <div style={styles.tableContainer}>
        {currentItems.length > 0 ? (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Producto</th>
                    <th style={styles.th}>Cliente</th>
                    <th style={styles.th}>Prov.</th>
                    <th style={styles.th}>Costo</th>
                    <th style={styles.th}>Renov.</th>
                    <th style={styles.th}>Estado</th>
                    <th style={styles.th}>Días</th>
                    <th style={styles.th}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item, idx) => {
                    const status = getRemainingDaysStatus(item.endDateObject, item.totalDuration, item.itemStatus);
                    const StatusIcon = status.icon;
                    return (
                      <tr key={item.orderItemId} style={{...styles.tableRow, ...(hoveredRow === idx && styles.tableRowHover)}} onMouseEnter={() => setHoveredRow(idx)} onMouseLeave={() => setHoveredRow(null)}>
                        <td style={styles.td}>
                          <div style={styles.productCell}>
                            <div style={styles.productIcon}><FiPackage size={14} color="white" /></div>
                            <div style={styles.productInfo}>
                              <div style={styles.productName} title={item.productName}>{item.productName}</div>
                              <div style={styles.productMeta}>#{item.orderId}</div>
                            </div>
                          </div>
                        </td>
                        
                        {/* MODIFICADO: Se agregó el teléfono debajo del nombre */}
                        <td style={styles.td}>
                            <div style={styles.customerCell}>
                                <div style={styles.customerName} title={item.customerName}>{item.customerName}</div>
                                {item.customerPhone && item.customerPhone !== 'N/A' ? (
                                    <div style={styles.customerPhone}><FiPhone size={10} />{item.customerPhone}</div>
                                ) : (
                                    <div style={{...styles.customerPhone, color: '#666'}}>Sin Tlf.</div>
                                )}
                            </div>
                        </td>

                        <td style={styles.td}><span title={item.providerName}>{item.providerName.substring(0, 15)}{item.providerName.length > 15 ? '...' : ''}</span></td>
                        <td style={styles.td}><div style={styles.priceCell}><FiDollarSign size={12} />{parseFloat(item.price).toFixed(2)}</div></td>
                        
                        <td style={styles.td}>
                            {item.hasRenewal && item.renewalPrice ? (
                                <div style={{...styles.priceCell, color: '#2ecc71'}}>
                                    <FiRefreshCw size={10} /> {parseFloat(item.renewalPrice).toFixed(2)}
                                </div>
                            ) : <span style={{color: '#666', fontSize: '0.8rem'}}>-</span>}
                        </td>

                        <td style={styles.td}>
                          <span style={{ ...styles.statusBadge, ...(item.itemStatus === 'activo' ? styles.statusActive : (item.itemStatus === 'soporte' ? styles.statusSupport : styles.statusPending)) }}>
                            {item.itemStatus === 'activo' ? 'Activo' : (item.itemStatus === 'soporte' ? 'Soporte' : 'Pendiente')}
                          </span>
                        </td>
                        <td style={styles.td}><span style={{ ...styles.daysBadge, ...status.style }}>{status.text}</span></td>
                        <td style={styles.td}>
                          {/* ACCIONES EN GRID COMPACTO */}
                          <div style={styles.actionButtons}>
                            {/* Botón Enviar a Cliente (WhatsApp) */}
                             <button 
                                style={{ ...styles.actionButton, ...styles.customerContactButton }} 
                                onClick={() => handleContactCustomer(item)} 
                                title="Enviar datos al cliente"
                                disabled={!item.customerPhone || item.customerPhone === 'N/A'}
                             >
                                <FiSend size={12} /> Enviar
                             </button>

                            <button style={{ ...styles.actionButton, ...styles.accountButton }} onClick={() => handleShowAccount(item)} title="Ver Cuenta"><FiEye size={12} /> Ver</button>
                            
                            {item.itemStatus === 'activo' && (
                                <button style={{ ...styles.actionButton, ...styles.supportButton }} onClick={() => handleReportIssue(item)} title="Reportar"><FiLifeBuoy size={12} /> Rep.</button>
                            )}
                            
                            {item.hasRenewal && (
                              <button 
                                  style={{ ...styles.actionButton, ...(item.itemStatus === 'activo' ? styles.renewButton : styles.disabledButton) }} 
                                  onClick={() => handleOpenRenewal(item)} 
                                  disabled={item.itemStatus !== 'activo'}
                                  title="Renovar"
                              >
                                <FiRefreshCw size={12} /> Ren.
                              </button>
                            )}

                            {item.providerNumber && item.providerNumber !== 'N/A' && (
                              <button style={{ ...styles.actionButton, ...styles.contactButton }} onClick={() => handleContactProvider(item)} title="Contactar Proveedor"><FiMessageCircle size={12} /> Prov.</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={styles.paginationContainer}>
              <button 
                style={{...styles.pageBtn, ...(currentPage === 1 && styles.pageBtnDisabled)}} 
                onClick={() => paginate(currentPage - 1)} 
                disabled={currentPage === 1}
              >
                <FiChevronLeft />
              </button>
              
              <span style={styles.pageInfo}>
                {currentPage} / {totalPages}
              </span>

              <button 
                style={{...styles.pageBtn, ...(currentPage === totalPages && styles.pageBtnDisabled)}} 
                onClick={() => paginate(currentPage + 1)} 
                disabled={currentPage === totalPages}
              >
                <FiChevronRight />
              </button>
            </div>
          </>
        ) : (
          <div style={styles.emptyState}><FiPackage size={48} color="#667eea" /><h3>Sin resultados</h3></div>
        )}
      </div>

      {modalType && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>{modalType === 'account' ? <><FiUserCheck size={20} /> Datos</> : <><FiRefreshCw size={20} /> Renovar</>}</h2>
              <button onClick={closeModal} style={{...styles.modalCloseButton, ...(isCloseHovered && styles.modalCloseButtonHover)}} onMouseEnter={() => setIsCloseHovered(true)} onMouseLeave={() => setIsCloseHovered(false)}><FiXCircle size={20} /></button>
            </div>
            {modalType === 'account' && selectedItem && (
              <div style={styles.modalSection}>
                <div style={styles.modalDetail}><span style={styles.modalDetailLabel}>Producto:</span><span style={styles.modalDetailValue}>{selectedItem.productName}</span></div>
                <div style={styles.accountCredentials}>
                  <h4 style={{ color: '#ffffff', marginBottom: '12px', fontSize: '0.9rem' }}>Credenciales</h4>
                  <div style={styles.credentialItem}><span style={styles.modalDetailLabel}><FiMail size={12} /> Correo:</span><span style={styles.modalDetailValue}>{selectedItem.email}</span></div>
                  <div style={styles.credentialItem}><span style={styles.modalDetailLabel}><FiKey size={12} /> Pass:</span><span style={styles.modalDetailValue}>{selectedItem.password}</span></div>
                  <div style={styles.credentialItem}><span style={styles.modalDetailLabel}><FiUser size={12} /> Perfil:</span><span style={styles.modalDetailValue}>{selectedItem.profileName}</span></div>
                  <div style={styles.credentialItem}><span style={styles.modalDetailLabel}><FiKey size={12} /> PIN:</span><span style={styles.modalDetailValue}>{selectedItem.pin}</span></div>
                </div>
              </div>
            )}
            {modalType === 'renew' && selectedItem && (
              <div style={styles.modalSection}>
                <div style={styles.modalDetail}><span style={styles.modalDetailLabel}>Producto:</span><span style={styles.modalDetailValue}>{selectedItem.productName}</span></div>
                <div style={styles.modalDetail}><span style={styles.modalDetailLabel}>Días:</span><span style={styles.modalDetailValue}>+{selectedItem.contractedDays}</span></div>
                <div style={styles.renewPrice}>${parseFloat(selectedItem.renewalPrice).toFixed(2)}</div>
                <p style={{ color: '#a0a0a0', textAlign: 'center', marginBottom: '16px', fontSize: '0.85rem' }}>Se descontará de tu saldo.</p>
                {modalError && <div style={styles.modalError}><FiAlertTriangle size={14} /> {modalError}</div>}
                <button style={{...styles.confirmButton, ...(isConfirmHovered && styles.confirmButtonHover), ...(isRenewing && styles.confirmButtonDisabled)}} onClick={handleConfirmRenewal} disabled={isRenewing} onMouseEnter={() => setIsConfirmHovered(true)} onMouseLeave={() => setIsConfirmHovered(false)}>
                  {isRenewing ? 'Procesando...' : 'Confirmar Renovación'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;