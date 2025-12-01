// src/features/dashboard/UserDashboard/RechargePage.jsx

import React, { useState, useEffect } from 'react';
import apiClient from '../../../services/apiClient.js'; // Ajusta la ruta si es necesario
import { useAuth } from '../../../context/AuthContext'; 
import { 
  FiDollarSign, FiCreditCard, FiFileText, FiSend, FiClock,
  FiCheckCircle, FiXCircle, FiPlusCircle, FiShield, FiList, 
  FiTrendingUp, FiCopy, FiInfo, FiMessageCircle
} from 'react-icons/fi';

const styles = {
  // ... (TUS ESTILOS SE MANTIENEN IGUAL, NO LOS BORRES)
  // Solo asegúrate de mantener tus estilos anteriores aquí
  container: { padding: '24px 16px', fontFamily: "'Inter', sans-serif", background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 50%, #0f0f0f 100%)', minHeight: '100vh', position: 'relative', overflow: 'hidden', color: '#e0e0e0' },
  backgroundDecoration: { position: 'absolute', top: 0, right: 0, width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)', zIndex: 0 },
  headerSection: { textAlign: 'center', marginBottom: '32px', position: 'relative', zIndex: 1 },
  header: { fontSize: '2.5rem', fontWeight: '800', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px', letterSpacing: '-0.02em' },
  subtitle: { fontSize: '1.1rem', color: '#b0b0b0', maxWidth: '600px', margin: '0 auto' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px', position: 'relative', zIndex: 1 },
  statCard: { background: 'rgba(30, 30, 30, 0.7)', backdropFilter: 'blur(20px)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255, 255, 255, 0.1)', position: 'relative', overflow: 'hidden', transition: 'all 0.4s', cursor: 'pointer' },
  statCardHover: { transform: 'translateY(-4px) scale(1.01)', borderColor: 'rgba(102, 126, 234, 0.3)', boxShadow: '0 10px 20px rgba(0, 0, 0, 0.4)' },
  statCardGlow: { position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #667eea, #764ba2, #f093fb)' },
  statValue: { fontSize: '2rem', fontWeight: '800', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '4px', lineHeight: '1' },
  statLabel: { fontSize: '0.9rem', color: '#a0a0a0', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' },
  statIcon: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '8px', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  mainLayout: { display: 'flex', flexWrap: 'wrap', gap: '24px', position: 'relative', zIndex: 1 },
  columnForm: { flex: '1 1 350px', minWidth: '300px' }, 
  columnTable: { flex: '2 1 500px', minWidth: '300px' }, 
  section: { background: 'rgba(25, 25, 25, 0.8)', backdropFilter: 'blur(20px)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(255, 255, 255, 0.1)', position: 'relative', overflow: 'hidden', height: '100%' },
  sectionHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' },
  sectionTitle: { fontSize: '1.2rem', fontWeight: '700', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px' },
  sectionCount: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '700' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  inputGroup: { display: 'flex', flexDirection: 'column', position: 'relative' },
  inputWithIcon: { display: 'flex', alignItems: 'center', position: 'relative' },
  inputIcon: { position: 'absolute', left: '12px', color: '#666', zIndex: 10, width: '16px' },
  input: { width: '100%', padding: '12px 16px 12px 40px', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', fontSize: '0.9rem', backgroundColor: 'rgba(30, 30, 30, 0.8)', color: '#ffffff', fontFamily: 'inherit', backdropFilter: 'blur(20px)', transition: 'all 0.3s ease', boxSizing: 'border-box' },
  select: { width: '100%', padding: '12px 16px 12px 40px', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', fontSize: '0.9rem', backgroundColor: 'rgba(30, 30, 30, 0.8)', color: '#ffffff', fontFamily: 'inherit', cursor: 'pointer', appearance: 'none', transition: 'all 0.3s ease', boxSizing: 'border-box' },
  inputFocus: { borderColor: '#667eea', backgroundColor: 'rgba(40, 40, 40, 0.9)', boxShadow: '0 0 0 2px rgba(102, 126, 234, 0.1)' },
  label: { marginBottom: '8px', fontWeight: '600', color: '#ccc', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' },
  button: { padding: '12px', border: 'none', borderRadius: '12px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.3s ease', marginTop: '8px', position: 'relative', overflow: 'hidden' },
  buttonHover: { transform: 'translateY(-2px)', boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)' },
  buttonGlow: { position: 'absolute', top: 0, left: '-100%', width: '100%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)', transition: 'left 0.5s ease' },
  buttonGlowHover: { left: '100%' },
  securityNote: { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', backgroundColor: 'rgba(102, 126, 234, 0.1)', borderRadius: '10px', border: '1px solid rgba(102, 126, 234, 0.2)', fontSize: '0.8rem', color: '#667eea' },
  message: { textAlign: 'center', padding: '12px', borderRadius: '10px', marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: '500', fontSize: '0.85rem' },
  success: { backgroundColor: 'rgba(39, 174, 96, 0.15)', color: '#2ecc71', border: '1px solid rgba(39, 174, 96, 0.3)' },
  error: { backgroundColor: 'rgba(220, 53, 69, 0.15)', color: '#ff6b6b', border: '1px solid rgba(220, 53, 69, 0.3)' },
  tableContainer: { overflowX: 'auto', borderRadius: '12px' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' },
  th: { padding: '12px 10px', backgroundColor: 'rgba(40, 40, 40, 0.95)', fontWeight: '700', color: '#a0a0a0', textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', whiteSpace: 'nowrap' },
  td: { padding: '8px 10px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', color: '#e0e0e0', verticalAlign: 'middle' },
  tableRow: { transition: 'all 0.2s ease', cursor: 'pointer' },
  tableRowHover: { backgroundColor: 'rgba(255, 255, 255, 0.08)' },
  statusBadge: { padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '4px', minWidth: '70px', justifyContent: 'center', textTransform: 'uppercase' },
  statusPending: { background: 'rgba(255, 193, 7, 0.15)', color: '#ffc107', border: '1px solid rgba(255, 193, 7, 0.2)' },
  statusApproved: { background: 'rgba(39, 174, 96, 0.15)', color: '#2ecc71', border: '1px solid rgba(39, 174, 96, 0.2)' },
  statusRejected: { background: 'rgba(220, 53, 69, 0.15)', color: '#ff6b6b', border: '1px solid rgba(220, 53, 69, 0.2)' },
  amountCell: { display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700', color: '#2ecc71', fontSize: '0.9rem' },
  referenceCode: { fontFamily: 'monospace', fontSize: '0.8rem', color: '#a0a0a0', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: '2px 6px', borderRadius: '4px', transition: 'background 0.2s' },
  referenceCodeHover: { background: 'rgba(255,255,255,0.1)', color: 'white' },
  emptyState: { textAlign: 'center', padding: '40px 20px', color: '#a0a0a0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' },
  qrContainer: { marginTop: '16px', padding: '20px', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' },
  qrImage: { maxWidth: '220px', width: '100%', height: 'auto', borderRadius: '12px', marginBottom: '12px', border: '2px solid rgba(255, 255, 255, 0.1)' },
  conversionText: { color: '#2ecc71', fontSize: '1.1rem', fontWeight: '700', marginTop: '8px' },
  conversionLabel: { color: '#888', fontSize: '0.85rem', marginBottom: '4px' },
  wspButton: { padding: '6px 12px', backgroundColor: 'rgba(37, 211, 102, 0.15)', color: '#25D366', border: '1px solid rgba(37, 211, 102, 0.3)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', transition: '0.2s' }
};

const RechargePage = () => {
  const { user } = useAuth();
  
  // --- NUEVOS ESTADOS DINÁMICOS ---
  const [config, setConfig] = useState({ exchange_rate: 3.55, whatsapp_number: '' });
  const [availableMethods, setAvailableMethods] = useState([]);
  const [selectedMethodObj, setSelectedMethodObj] = useState(null); // Para guardar el objeto completo del método seleccionado

  const [formData, setFormData] = useState({
    amount_usd: '',
    payment_method: '', // Se llenará dinámicamente
    transaction_reference: '',
  });
  
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoveredStat, setHoveredStat] = useState(null);
  const [hoveredRef, setHoveredRef] = useState(null);

  // --- CARGAR CONFIGURACIÓN Y MÉTODOS DESDE EL BACKEND ---
  const fetchConfig = async () => {
    try {
        const res = await apiClient.get('/config/recharge');
        setConfig({
            exchange_rate: res.data.exchange_rate,
            whatsapp_number: res.data.whatsapp_number
        });
        
        const methods = res.data.payment_methods;
        setAvailableMethods(methods);

        // Seleccionar el primer método por defecto si existe
        if (methods.length > 0) {
            setFormData(prev => ({ ...prev, payment_method: methods[0].name }));
            setSelectedMethodObj(methods[0]);
        }
    } catch (err) {
        console.error("Error cargando configuración:", err);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await apiClient.get('/recharges/history');
      setRequests(response.data);
    } catch (err) {
      setError('No se pudo cargar tu historial de recargas.');
    }
  };

  useEffect(() => {
    fetchConfig();
    fetchHistory();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Si cambia el método de pago, actualizamos el objeto seleccionado para mostrar su QR
    if (name === 'payment_method') {
        const method = availableMethods.find(m => m.name === value);
        setSelectedMethodObj(method);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (parseFloat(formData.amount_usd) <= 0 || !formData.transaction_reference) {
      setError('Por favor, ingresa un monto válido y una referencia.');
      return;
    }

    try {
      await apiClient.post('/recharges/request', { ...formData, proof_url: '' });
      setMessage('¡Solicitud enviada! Será revisada pronto.');
      setFormData({ 
          amount_usd: '', 
          payment_method: availableMethods.length > 0 ? availableMethods[0].name : '', 
          transaction_reference: '' 
      });
      fetchHistory();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al enviar la solicitud.');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Referencia copiada al portapapeles');
  };

  const handleConfirmWsp = (req) => {
      const username = user?.username || 'N/A';
      const email = user?.email || '';
      
      const message = `Hola, hice una recarga de $${req.amount_usd} vía ${req.payment_method}.
Mi usuario es: ${username} (${email})
Referencia: ${req.transaction_reference}`;
      
      // Usamos el número dinámico de la base de datos
      const url = `https://wa.me/${config.whatsapp_number}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
  };

  const getStatusStyle = (status) => {
    if (status === 'aprobado') return styles.statusApproved;
    if (status === 'rechazado') return styles.statusRejected;
    return styles.statusPending;
  };

  const getStatusIcon = (status) => {
    if (status === 'aprobado') return <FiCheckCircle size={12} />;
    if (status === 'rechazado') return <FiXCircle size={12} />;
    return <FiClock size={12} />;
  };

  // Cálculo dinámico en soles usando la tasa de la BD
  const amountInSoles = formData.amount_usd ? (parseFloat(formData.amount_usd) * config.exchange_rate).toFixed(2) : '0.00';

  const stats = [
    { value: requests.length, label: 'Solicitudes', icon: FiList },
    { value: requests.filter(req => req.status === 'aprobado').length, label: 'Aprobadas', icon: FiCheckCircle },
    { value: `$${requests.filter(req => req.status === 'aprobado').reduce((sum, req) => sum + parseFloat(req.amount_usd), 0).toFixed(2)}`, label: 'Recargado', icon: FiTrendingUp }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.backgroundDecoration} />
      
      <div style={styles.headerSection}>
        <h1 style={styles.header}>Recargas</h1>
        <p style={styles.subtitle}>Añade saldo a tu cuenta</p>
      </div>

      <div style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={stat.label} style={{...styles.statCard, ...(hoveredStat === index && styles.statCardHover)}} onMouseEnter={() => setHoveredStat(index)} onMouseLeave={() => setHoveredStat(null)}>
            <div style={styles.statCardGlow} />
            <div style={styles.statValue}>{stat.value}</div>
            <div style={styles.statLabel}><div style={styles.statIcon}><stat.icon size={16} color="white" /></div>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={styles.mainLayout}>
        
        {/* Columna Formulario */}
        <div style={styles.columnForm}>
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}><FiPlusCircle size={20} /> Nueva Recarga</h2>
            </div>
            
            <form onSubmit={handleSubmit} style={styles.form}>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}><FiDollarSign size={14} /> Monto a Recargar (USD)</label>
                <div style={styles.inputWithIcon}>
                  <FiDollarSign style={styles.inputIcon} size={14} />
                  <input
                    type="number" step="0.01" name="amount_usd"
                    value={formData.amount_usd} onChange={handleChange}
                    onFocus={() => setFocusedField('amount')} onBlur={() => setFocusedField(null)}
                    style={{...styles.input, ...(focusedField === 'amount' && styles.inputFocus)}}
                    placeholder="10.00" required
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}><FiCreditCard size={14} /> Método de Pago</label>
                <div style={styles.inputWithIcon}>
                  <FiCreditCard style={styles.inputIcon} size={14} />
                  <select 
                    name="payment_method" value={formData.payment_method} onChange={handleChange}
                    onFocus={() => setFocusedField('method')} onBlur={() => setFocusedField(null)}
                    style={{...styles.select, ...(focusedField === 'method' && styles.inputFocus)}}
                  >
                    {availableMethods.length === 0 && <option>Cargando métodos...</option>}
                    {availableMethods.map(method => (
                        <option key={method.id} value={method.name}>{method.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* --- SECCIÓN DE IMAGEN DE PAGO DINÁMICA --- */}
              {selectedMethodObj && (
                  <div style={styles.qrContainer}>
                      <div style={styles.conversionLabel}>Escanea para pagar con {selectedMethodObj.name}:</div>
                      
                      {/* Imagen Dinámica desde BD */}
                      <img src={selectedMethodObj.image_url} alt="QR Pago" style={styles.qrImage} />

                      {selectedMethodObj.account_name && (
                          <div style={{fontSize:'0.8rem', color:'#aaa', marginBottom:'8px'}}>
                              Titular: {selectedMethodObj.account_name}
                          </div>
                      )}

                      <div style={{marginTop: 10, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 10, width: '100%'}}>
                          <div style={styles.conversionLabel}>
                              Monto a enviar {selectedMethodObj.currency === 'USD' ? '(USDT/USD)' : '(Soles)'}:
                          </div>
                          <div style={styles.conversionText}>
                              {selectedMethodObj.currency === 'USD' 
                                  ? `$ ${parseFloat(formData.amount_usd || 0).toFixed(2)} USD`
                                  : `S/ ${amountInSoles}`
                              }
                          </div>
                          <div style={{fontSize: '0.75rem', color: '#666', marginTop: 4}}>
                              {selectedMethodObj.currency !== 'USD' && `(Tipo de cambio: ${config.exchange_rate})`}
                          </div>
                      </div>
                  </div>
              )}

              <div style={styles.inputGroup}>
                <label style={styles.label}><FiList size={14} /> N° de Operación / Hash</label>
                <div style={styles.inputWithIcon}>
                  <FiFileText style={styles.inputIcon} size={14} />
                  <input
                    type="text" name="transaction_reference"
                    value={formData.transaction_reference} onChange={handleChange}
                    onFocus={() => setFocusedField('reference')} onBlur={() => setFocusedField(null)}
                    style={{...styles.input, ...(focusedField === 'reference' && styles.inputFocus)}}
                    placeholder="Ej: 12345678" required
                  />
                </div>
              </div>
              
              <div style={styles.securityNote}>
                <FiShield size={14} />
                <span>Verificamos tu pago en minutos.</span>
              </div>

              <button 
                type="submit" 
                style={{...styles.button, ...(isButtonHovered && styles.buttonHover)}}
                onMouseEnter={() => setIsButtonHovered(true)} onMouseLeave={() => setIsButtonHovered(false)}
              >
                <div style={{...styles.buttonGlow, ...(isButtonHovered && styles.buttonGlowHover)}} />
                <FiSend size={16} /> Confirmar Recarga
              </button>
            </form>

            {message && <div style={{...styles.message, ...styles.success}}><FiCheckCircle size={16} />{message}</div>}
            {error && <div style={{...styles.message, ...styles.error}}><FiXCircle size={16} />{error}</div>}
          </div>
        </div>

        {/* Columna Tabla Historial (Igual que antes) */}
        <div style={styles.columnTable}>
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}><FiList size={20} /> Historial</h2>
              <div style={styles.sectionCount}>{requests.length}</div>
            </div>

            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Fecha</th>
                    <th style={styles.th}>Monto</th>
                    <th style={styles.th}>Método</th>
                    <th style={styles.th}>Referencia</th>
                    <th style={styles.th}>Estado</th>
                    <th style={styles.th}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.length > 0 ? (
                    requests.map((req, index) => (
                      <tr key={req.id} style={{...styles.tableRow, ...(hoveredRow === index && styles.tableRowHover)}} onMouseEnter={() => setHoveredRow(index)} onMouseLeave={() => setHoveredRow(null)}>
                        <td style={styles.td}>
                          {new Date(req.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}
                        </td>
                        <td style={styles.td}>
                          <span style={styles.amountCell}><FiDollarSign size={12} />{parseFloat(req.amount_usd).toFixed(2)}</span>
                        </td>
                        <td style={styles.td}>{req.payment_method}</td>
                        <td style={styles.td}>
                          <div 
                            style={{...styles.referenceCode, ...(hoveredRef === req.id && styles.referenceCodeHover)}}
                            onClick={() => copyToClipboard(req.transaction_reference)}
                            onMouseEnter={() => setHoveredRef(req.id)}
                            onMouseLeave={() => setHoveredRef(null)}
                            title="Click para copiar"
                          >
                            {req.transaction_reference} <FiCopy size={10} style={{marginLeft: 4, opacity: 0.7}}/>
                          </div>
                        </td>
                        <td style={styles.td}>
                          <span style={{...styles.statusBadge, ...getStatusStyle(req.status)}}>
                            {getStatusIcon(req.status)} {req.status}
                          </span>
                        </td>
                        <td style={styles.td}>
                             <button 
                                onClick={() => handleConfirmWsp(req)}
                                style={styles.wspButton}
                                title="Enviar comprobante por WhatsApp"
                             >
                                <FiMessageCircle size={14}/> Confirmar
                             </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6">
                        <div style={styles.emptyState}>
                          <FiInfo size={32} />
                          <p>No hay historial.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RechargePage;
