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
    FiShield,
    FiStar,
    FiGift
} from 'react-icons/fi';

// --- Estilos Ultra Modernos ---
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
        maxWidth: '500px',
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
    phoneInputGroup: {
        display: 'flex',
        gap: '12px',
        alignItems: 'stretch'
    },
    phonePrefix: {
        flex: 1,
        padding: '1.2rem 1rem',
        border: '2px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        fontSize: '1rem',
        backgroundColor: 'rgba(30, 30, 30, 0.8)',
        color: '#ffffff',
        outline: 'none',
        fontFamily: 'inherit',
        textAlign: 'center',
        minWidth: '80px'
    },
    phoneNumber: {
        flex: 3,
        padding: '1.2rem 1.2rem 1.2rem 3.5rem',
        border: '2px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        fontSize: '1rem',
        backgroundColor: 'rgba(30, 30, 30, 0.8)',
        color: '#ffffff',
        transition: 'all 0.3s ease',
        outline: 'none',
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
        '&:hover': {
            background: 'rgba(102, 126, 234, 0.2)',
            transform: 'translateY(-1px)',
            boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)'
        }
    },
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
        fontSize: '0.85rem',
        color: '#a0a0a0',
        marginBottom: '0.5rem',
        '&:last-child': {
            marginBottom: 0
        }
    },
    requirementMet: {
        color: '#90ee90'
    },
    requirementUnmet: {
        color: '#ff6b6b'
    },
    pulseAnimation: {
        animation: 'pulse 2s infinite'
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

        // Validación de fortaleza de contraseña
        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
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
            setError(err.response?.data?.error || 'Error al conectar con el servidor.');
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
                    <div style={styles.phoneInputGroup}>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <input 
                                type="text" 
                                name="phone_prefix" 
                                value={formData.phone_prefix}
                                onChange={handleChange}
                                style={styles.phonePrefix}
                                required
                            />
                        </div>
                        <div style={{ position: 'relative', flex: 3 }}>
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
                            ...(isLoading ? styles.buttonLoading : {})
                        }}
                        disabled={isLoading || !allRequirementsMet}
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

            {/* Estilos CSS para animaciones */}
            <style>
                {`
                    @keyframes pulse {
                        0% { opacity: 1; }
                        50% { opacity: 0.5; }
                        100% { opacity: 1; }
                    }
                `}
            </style>
        </div>
    );
};

export default RegisterPage;