import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../services/apiClient'; 
import { useAuth } from '../context/AuthContext';
import {
    FiUser,
    FiLock,
    FiEye,
    FiEyeOff,
    FiLogIn,
    FiMail,
    FiArrowRight,
    FiShield,
    FiStar
} from 'react-icons/fi';

// --- Estilos Ultra Modernos (Mismos colores que UserRateProviders) ---
const styles = {
    container: { 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 50%, #0f0f0f 100%)',
        padding: '2rem 1rem',
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
        maxWidth: '440px',
        background: 'rgba(25, 25, 25, 0.8)',
        backdropFilter: 'blur(20px)',
        padding: '3rem 2.5rem',
        borderRadius: '28px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
        position: 'relative',
        zIndex: 1
    },
    header: {
        textAlign: 'center',
        marginBottom: '2.5rem',
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        marginBottom: '1.5rem',
        textDecoration: 'none',
        fontSize: '1.75rem',
        fontWeight: '800',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    logoImage: {
        height: '40px',
        width: 'auto',
        filter: 'brightness(0) saturate(100%) invert(39%) sepia(96%) saturate(747%) hue-rotate(198deg) brightness(97%) contrast(101%)',
    },
    title: {
        fontSize: '2.5rem',
        fontWeight: '800',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        margin: '0 0 0.5rem 0',
        letterSpacing: '-0.02em'
    },
    subtitle: {
        fontSize: '1.1rem',
        color: '#b0b0b0',
        margin: 0,
        fontWeight: '400',
        lineHeight: '1.6'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
    },
    inputGroup: {
        position: 'relative',
    },
    input: {
        width: '100%',
        padding: '1.2rem 1.2rem 1.2rem 3.5rem',
        border: '2px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        fontSize: '1rem',
        backgroundColor: 'rgba(30, 30, 30, 0.8)',
        color: '#ffffff',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        outline: 'none',
        boxSizing: 'border-box',
        fontFamily: 'inherit',
        '&:focus': {
            borderColor: '#667eea',
            backgroundColor: 'rgba(35, 35, 35, 0.9)',
            boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.1)'
        }
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
        '&:hover': {
            background: 'rgba(102, 126, 234, 0.2)',
            color: '#667eea'
        }
    },
    button: {
        padding: '1.2rem 2rem',
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
        '&:hover:not(:disabled)': {
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 30px rgba(102, 126, 234, 0.4)'
        }
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
    message: {
        padding: '1.2rem',
        borderRadius: '16px',
        textAlign: 'center',
        fontSize: '0.95rem',
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
    footer: {
        textAlign: 'center',
        marginTop: '2.5rem',
        paddingTop: '2rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
    },
    footerText: {
        color: '#a0a0a0',
        fontSize: '1rem',
        margin: '0 0 1.5rem 0',
        lineHeight: '1.6'
    },
    registerLink: {
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
        '&:hover': {
            background: 'rgba(102, 126, 234, 0.2)',
            transform: 'translateY(-1px)',
            boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)'
        }
    },
    features: {
        display: 'flex',
        justifyContent: 'center',
        gap: '2rem',
        marginTop: '2rem',
        flexWrap: 'wrap'
    },
    feature: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: '#a0a0a0',
        fontSize: '0.9rem',
        fontWeight: '500'
    },
    pulseAnimation: {
        animation: 'pulse 2s infinite'
    }
};

const LoginPage = () => {
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isButtonHovered, setIsButtonHovered] = useState(false);
    
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await apiClient.post('/auth/login', formData);
            login(response.data);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Error al conectar con el servidor.');
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

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
                    <h1 style={styles.title}>Bienvenido</h1>
                    <p style={styles.subtitle}>
                        Ingresa a tu cuenta para acceder a todos los servicios
                    </p>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} style={styles.form}>
                    {/* Campo Email */}
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

                    {/* Campo Contraseña */}
                    <div style={styles.inputGroup}>
                        <div style={styles.inputIcon}>
                            <FiLock size={20} />
                        </div>
                        <input 
                            type={showPassword ? "text" : "password"}
                            name="password" 
                            placeholder="Ingresa tu contraseña"
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

                    {/* Mensaje de Error */}
                    {error && (
                        <div style={{...styles.message, ...styles.error}}>
                            <FiShield size={18} />
                            {error}
                        </div>
                    )}

                    {/* Botón de Envío */}
                    <button 
                        type="submit" 
                        style={{
                            ...styles.button,
                            ...(isLoading ? styles.buttonLoading : {})
                        }}
                        disabled={isLoading}
                        onMouseEnter={() => setIsButtonHovered(true)}
                        onMouseLeave={() => setIsButtonHovered(false)}
                    >
                        <div style={{ 
                            ...styles.buttonGlow,
                            ...(isButtonHovered && { left: '100%' })
                        }} />
                        {isLoading ? (
                            <>
                                <div style={styles.pulseAnimation}>
                                    <FiLogIn size={20} />
                                </div>
                                Entrando...
                            </>
                        ) : (
                            <>
                                <FiLogIn size={20} />
                                Iniciar Sesión
                            </>
                        )}
                    </button>
                </form>

                {/* Features */}
                <div style={styles.features}>
                    <div style={styles.feature}>
                        <FiShield size={16} />
                        Seguro
                    </div>
                    <div style={styles.feature}>
                        <FiStar size={16} />
                        Premium
                    </div>
                    <div style={styles.feature}>
                        <FiUser size={16} />
                        Confiable
                    </div>
                </div>

                {/* Footer */}
                <div style={styles.footer}>
                    <p style={styles.footerText}>
                        ¿No tienes una cuenta?
                    </p>
                    <Link 
                        to="/register" 
                        style={styles.registerLink}
                    >
                        Crear Cuenta
                        <FiArrowRight size={16} />
                    </Link>
                </div>
            </div>

            {/* Estilos CSS para animaciones */}
            <style>
                {`
                    @keyframes pulse {
                        0% { opacity: 1; }
                        50% { opacity: 0.5; }
                        100% { opacity: 1; }
                    }
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}
            </style>
        </div>
    );
};

export default LoginPage;