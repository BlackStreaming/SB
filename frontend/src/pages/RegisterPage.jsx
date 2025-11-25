import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import {
    FiUser,
    FiMail,
    FiLock,
    FiEye,
    FiEyeOff,
    FiPhone,
    FiUserPlus,
    FiArrowLeft,
    FiCheck,
    FiX,
    FiStar,
    FiGift
} from 'react-icons/fi';

// --- Estilos Ultra Modernos ---
const styles = {
    // ESTILOS DE CONTENEDOR Y CARTA (AJUSTADO PARA MEJOR RESPONSIVE)
    container: { 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 50%, #0f0f0f 100%)',
        padding: '2rem 1rem', // Más padding horizontal para móviles
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        position: 'relative',
        overflow: 'hidden'
    },
    backgroundDecoration: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(102, 126, 234, 0.15) 0%, transparent 70%)',
        zIndex: 0
    },
    card: {
        width: '100%',
        maxWidth: '400px', // REDUCCIÓN para mejor ajuste en pantallas más pequeñas
        background: 'rgba(25, 25, 25, 0.8)',
        backdropFilter: 'blur(20px)',
        padding: '2rem 1.5rem', // REDUCCIÓN del padding para móviles
        borderRadius: '28px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
        position: 'relative',
        zIndex: 1
    },
    header: {
        textAlign: 'center',
        marginBottom: '2rem',
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        marginBottom: '1rem',
        textDecoration: 'none',
        fontSize: '1.75rem',
        fontWeight: '800',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    title: {
        fontSize: '2rem', // Reducido para mejor ajuste
        fontWeight: '800',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        margin: '0 0 0.5rem 0',
        letterSpacing: '-0.02em'
    },
    subtitle: {
        fontSize: '1rem', // Reducido para mejor ajuste
        color: '#b0b0b0',
        margin: 0,
        fontWeight: '400',
        lineHeight: '1.6'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem', // Reducido ligeramente
    },
    inputGroup: {
        position: 'relative',
    },
    // Estilo base para todos los inputs
    inputBase: {
        width: '100%',
        padding: '1rem 1.2rem 1rem 3.5rem', // Padding ajustado
        border: '2px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        fontSize: '1rem',
        backgroundColor: 'rgba(30, 30, 30, 0.8)',
        color: '#ffffff',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        outline: 'none',
        boxSizing: 'border-box',
        fontFamily: 'inherit',
    },
    // Estilos de inputs específicos
    input: {
        // ...styles.inputBase, // Si se usa sintaxis ES6: { ...styles.inputBase, ...otrosEstilos }
        width: '100%',
        padding: '1rem 1.2rem 1rem 3.5rem',
        border: '2px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        fontSize: '1rem',
        backgroundColor: 'rgba(30, 30, 30, 0.8)',
        color: '#ffffff',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        outline: 'none',
        boxSizing: 'border-box',
        fontFamily: 'inherit',
    },
    // GRUPO DE TELÉFONO (SE MANTIENE FLEX, PERO SE REDISTRIBUYE EL ESPACIO)
    phoneInputGroup: {
        display: 'flex',
        gap: '12px',
        alignItems: 'stretch',
    },
    phonePrefixContainer: {
        position: 'relative', 
        flex: '0 0 80px' // FIJA EL ANCHO para evitar que colapse demasiado
    },
    phoneNumberContainer: {
        position: 'relative', 
        flex: '1' // Ocupa el espacio restante
    },
    phonePrefix: {
        // ...styles.inputBase, // Heredar de la base
        width: '100%', // Asegura el 100% del contenedor padre
        padding: '1rem 0.5rem', 
        border: '2px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        fontSize: '1rem',
        backgroundColor: 'rgba(30, 30, 30, 0.8)',
        color: '#ffffff',
        outline: 'none',
        fontFamily: 'inherit',
        textAlign: 'center',
        boxSizing: 'border-box',
    },
    phoneNumber: {
        // ...styles.inputBase, // Heredar de la base
        width: '100%',
        padding: '1rem 1.2rem 1rem 3.5rem',
        border: '2px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        fontSize: '1rem',
        backgroundColor: 'rgba(30, 30, 30, 0.8)',
        color: '#ffffff',
        transition: 'all 0.3s ease',
        outline: 'none',
        fontFamily: 'inherit',
        boxSizing: 'border-box',
    },
    inputIcon: {
        position: 'absolute',
        left: '1.2rem',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#667eea',
        pointerEvents: 'none',
        zIndex: 2
    },
    passwordToggle: {
        position: 'absolute',
        right: '1.2rem',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'rgba(255, 255, 255, 0.1)',
        border: 'none',
        color: '#a0a0a0',
        cursor: 'pointer',
        padding: '0.5rem',
        borderRadius: '10px',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 3 // Asegurar que está por encima del input
    },
    // Estilos de botón
    button: {
        padding: '1rem 2rem', // Ajustado ligeramente
        border: 'none',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontSize: '1.1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        marginTop: '1rem',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'inherit',
    },
    buttonGlow: {
        position: 'absolute',
        top: 0,
        left: '-100%',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
        transition: 'left 0.5s ease'
    },
    buttonLoading: {
        opacity: 0.7,
        cursor: 'not-allowed',
        transform: 'none !important'
    },
    // Estilos de mensajes
    message: {
        padding: '1rem',
        borderRadius: '16px',
        textAlign: 'center',
        fontSize: '0.9rem',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        border: '1px solid'
    },
    error: {
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        color: '#ff6b6b',
        borderColor: 'rgba(255, 107, 107, 0.3)'
    },
    success: {
        backgroundColor: 'rgba(144, 238, 144, 0.1)',
        color: '#90ee90',
        borderColor: 'rgba(144, 238, 144, 0.3)'
    },
    // Estilos de pie de página
    footer: {
        textAlign: 'center',
        marginTop: '2rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
    },
    footerText: {
        color: '#a0a0a0',
        fontSize: '0.95rem',
        margin: '0 0 1rem 0',
        lineHeight: '1.6'
    },
    loginLink: {
        color: '#667eea',
        textDecoration: 'none',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.75rem 1.5rem',
        borderRadius: '12px',
        background: 'rgba(102, 126, 234, 0.1)',
        border: '1px solid rgba(102, 126, 234, 0.2)',
    },
    // Requisitos de contraseña
    passwordRequirements: {
        marginTop: '0.5rem',
        padding: '1rem',
        background: 'rgba(30, 30, 30, 0.6)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    requirement: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.8rem',
        color: '#a0a0a0',
        marginBottom: '0.5rem',
    },
    requirementMet: {
        color: '#90ee90'
    },
    requirementUnmet: {
        color: '#ff6b6b'
    },
    pulseAnimation: {
        // La animación debe definirse en la etiqueta <style>
    }
};

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone_prefix: '+51',
        phone_number: '',
        referral_code: '',
    });

    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isButtonHovered, setIsButtonHovered] = useState(false);
    
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setIsLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden.');
            setIsLoading(false);
            return;
        }

        // Validación de fortaleza de contraseña (AJUSTADA: comprueba que todos los requisitos básicos estén cubiertos)
        if (!allRequirementsMet) {
            setError('La contraseña no cumple con todos los requisitos de seguridad.');
            setIsLoading(false);
            return;
        }

        try {
            const { confirmPassword, ...dataToSubmit } = formData;
            const response = await apiClient.post('/auth/register', dataToSubmit);
            
            setMessage(response.data.message || '¡Cuenta creada exitosamente!');
            setFormData({
                username: '', email: '', password: '', confirmPassword: '',
                phone_prefix: '+51', phone_number: '', referral_code: '',
            });

            // Redirigir al login después de 2 segundos
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            setError(err.response?.data?.error || 'Error al intentar registrar. Intente de nuevo más tarde.');
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    // Validaciones de contraseña en tiempo real
    const passwordRequirements = {
        length: formData.password.length >= 6,
        hasUpperCase: /[A-Z]/.test(formData.password),
        hasLowerCase: /[a-z]/.test(formData.password),
        hasNumber: /[0-9]/.test(formData.password),
    };

    const allRequirementsMet = Object.values(passwordRequirements).every(Boolean);

    return (
        <div style={styles.container}>
            <div style={styles.backgroundDecoration} />
            
            <div style={styles.card}>
                {/* Header */}
                <div style={styles.header}>
                    <Link to="/" style={styles.logo}>
                        <FiStar size={32} />
                        Blackstreaming
                    </Link>
                    <h1 style={styles.title}>Crear Cuenta</h1>
                    <p style={styles.subtitle}>
                        Únete a nuestra plataforma y descubre todos los servicios
                    </p>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} style={styles.form}>
                    {/* Campo Username (OBLIGATORIO) */}
                    <div style={styles.inputGroup}>
                        <div style={styles.inputIcon}>
                            <FiUser size={20} />
                        </div>
                        <input 
                            type="text" 
                            name="username" 
                            placeholder="Nombre de usuario"
                            value={formData.username}
                            onChange={handleChange}
                            style={styles.input}
                            required 
                        />
                    </div>

                    {/* Campo Email (OBLIGATORIO) */}
                    <div style={styles.inputGroup}>
                        <div style={styles.inputIcon}>
                            <FiMail size={20} />
                        </div>
                        <input 
                            type="email" 
                            name="email" 
                            placeholder="correo@ejemplo.com"
                            value={formData.email}
                            onChange={handleChange}
                            style={styles.input}
                            required 
                        />
                    </div>

                    {/* Campo Contraseña (OBLIGATORIO) */}
                    <div style={styles.inputGroup}>
                        <div style={styles.inputIcon}>
                            <FiLock size={20} />
                        </div>
                        <input 
                            type={showPassword ? "text" : "password"}
                            name="password" 
                            placeholder="Contraseña"
                            value={formData.password}
                            onChange={handleChange}
                            style={styles.input}
                            required 
                        />
                        <button
                            type="button"
                            style={styles.passwordToggle}
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                        </button>
                    </div>

                    {/* Requisitos de Contraseña */}
                    {formData.password && (
                        <div style={styles.passwordRequirements}>
                            <div style={{
                                ...styles.requirement,
                                ...(passwordRequirements.length ? styles.requirementMet : styles.requirementUnmet)
                            }}>
                                {passwordRequirements.length ? <FiCheck size={14} /> : <FiX size={14} />}
                                Al menos 6 caracteres
                            </div>
                            <div style={{
                                ...styles.requirement,
                                ...(passwordRequirements.hasUpperCase ? styles.requirementMet : styles.requirementUnmet)
                            }}>
                                {passwordRequirements.hasUpperCase ? <FiCheck size={14} /> : <FiX size={14} />}
                                Una letra mayúscula
                            </div>
                            <div style={{
                                ...styles.requirement,
                                ...(passwordRequirements.hasLowerCase ? styles.requirementMet : styles.requirementUnmet)
                            }}>
                                {passwordRequirements.hasLowerCase ? <FiCheck size={14} /> : <FiX size={14} />}
                                Una letra minúscula
                            </div>
                            <div style={{
                                ...styles.requirement,
                                ...(passwordRequirements.hasNumber ? styles.requirementMet : styles.requirementUnmet)
                            }}>
                                {passwordRequirements.hasNumber ? <FiCheck size={14} /> : <FiX size={14} />}
                                Un número
                            </div>
                        </div>
                    )}

                    {/* Campo Confirmar Contraseña (OBLIGATORIO) */}
                    <div style={styles.inputGroup}>
                        <div style={styles.inputIcon}>
                            <FiLock size={20} />
                        </div>
                        <input 
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword" 
                            placeholder="Confirmar contraseña"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            style={styles.input}
                            required 
                        />
                        <button
                            type="button"
                            style={styles.passwordToggle}
                            onClick={toggleConfirmPasswordVisibility}
                        >
                            {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                        </button>
                    </div>

                    {/* Campo Teléfono (OBLIGATORIO) */}
                    <div style={styles.phoneInputGroup} id="phone-group"> {/* Agregado ID para media query */}
                        <div style={styles.phonePrefixContainer}>
                            <input 
                                type="text" 
                                name="phone_prefix" 
                                value={formData.phone_prefix}
                                onChange={handleChange}
                                style={styles.phonePrefix}
                                required
                            />
                        </div>
                        <div style={styles.phoneNumberContainer}>
                            <div style={styles.inputIcon}>
                                <FiPhone size={20} />
                            </div>
                            <input 
                                type="text" 
                                name="phone_number" 
                                placeholder="Número de teléfono"
                                value={formData.phone_number}
                                onChange={handleChange}
                                style={styles.phoneNumber}
                                required
                            />
                        </div>
                    </div>

                    {/* Campo Código de Referido (OPCIONAL) */}
                    <div style={styles.inputGroup}>
                        <div style={styles.inputIcon}>
                            <FiGift size={20} />
                        </div>
                        <input 
                            type="text" 
                            name="referral_code" 
                            placeholder="Código de referido (opcional)"
                            value={formData.referral_code}
                            onChange={handleChange}
                            style={styles.input}
                            // NO se agrega required aquí
                        />
                    </div>

                    {/* Mensajes */}
                    {message && (
                        <div style={{...styles.message, ...styles.success}}>
                            <FiCheck size={18} />
                            {message}
                        </div>
                    )}
                    {error && (
                        <div style={{...styles.message, ...styles.error}}>
                            <FiX size={18} />
                            {error}
                        </div>
                    )}

                    {/* Botón de Registro */}
                    <button 
                        type="submit" 
                        style={{
                            ...styles.button,
                            ...(isLoading || !allRequirementsMet ? styles.buttonLoading : {})
                        }}
                        disabled={isLoading || !allRequirementsMet}
                        onMouseEnter={() => setIsButtonHovered(true)}
                        onMouseLeave={() => setIsButtonHovered(false)}
                    >
                        <div style={{ 
                            ...styles.buttonGlow,
                            ...(isButtonHovered && !isLoading && allRequirementsMet && { left: '100%' })
                        }} />
                        {isLoading ? (
                            <>
                                <div className="pulse-animation">
                                    <FiUserPlus size={20} />
                                </div>
                                Creando cuenta...
                            </>
                        ) : (
                            <>
                                <FiUserPlus size={20} />
                                Crear Cuenta
                            </>
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div style={styles.footer}>
                    <p style={styles.footerText}>
                        ¿Ya tienes una cuenta?
                    </p>
                    <Link 
                        to="/login" 
                        style={styles.loginLink}
                    >
                        <FiArrowLeft size={16} />
                        Iniciar Sesión
                    </Link>
                </div>
            </div>

            {/* Estilos CSS para animaciones y media queries (MEJOR SOLUCIÓN RESPONSIVE) */}
            <style>
                {`
                    @keyframes pulse {
                        0% { opacity: 1; }
                        50% { opacity: 0.5; }
                        100% { opacity: 1; }
                    }
                    
                    .pulse-animation {
                        animation: pulse 2s infinite;
                    }

                    /* Estilos para Hover y Focus que no funcionan bien en estilos inline */
                    input[style]:focus, 
                    select[style]:focus {
                        border-color: #667eea !important;
                        background-color: rgba(35, 35, 35, 0.9) !important;
                        box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1) !important;
                    }

                    button[style]:hover:not(:disabled) {
                        transform: translateY(-2px) !important;
                        box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4) !important;
                    }

                    /* MEDIA QUERY para APILAR el campo de teléfono en móviles */
                    @media (max-width: 480px) {
                        #phone-group {
                            flex-direction: column; /* Apila el prefijo y el número */
                            gap: 1.25rem; /* Espacio entre los campos apilados */
                        }
                        
                        /* Ambos contenedores ocupan el 100% */
                        #phone-group > div {
                            flex: 1 1 100% !important; 
                        }

                        /* Ajustar el padding para el input de prefijo cuando está apilado */
                        input[name="phone_prefix"] {
                            text-align: left !important;
                            padding-left: 1.2rem !important; /* Mover el texto a la izquierda */
                        }
                    }
                `}
            </style>
        </div> 
    );
};

export default RegisterPage;
