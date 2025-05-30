import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import '../styles/register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    lastName: '',
    address: '',
    province: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Validación avanzada de contraseña
    const pwd = formData.password;
    const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/;
    if (!pwdRegex.test(pwd)) {
      setError('La contraseña debe tener al menos 1 mayúscula, 1 minúscula, 1 número, 1 carácter especial y mínimo 8 caracteres.');
      return;
    }
    
    AuthService.register(
      formData.email,
      formData.password,
      formData.name,
      formData.lastName,
      formData.address,
      formData.province
    )
      .then(() => {
        // Cuando el registro es exitoso, lo redirijo al login
        navigate('/login');
      })
      .catch(error => {
        // Mostrar mensaje real del backend si existe
        const backendMsg = error?.response?.data?.message || error?.response?.data || 'Error al registrarse. Verifica los datos.';
        setError(backendMsg);
        console.error('Error de registro:', error.response || error);
      });
  };

  return (
    <div className="auth-container">
      <h2>Registrate</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Correo electrónico" required />
        </div>
        <div className="form-group password-group" style={{ display: 'flex', alignItems: 'center', marginBottom: '1.3em' }}>
  <input
    type={showPassword ? 'text' : 'password'}
    name="password"
    value={formData.password}
    onChange={handleChange}
    placeholder="Contraseña"
    required
    style={{ flex: 1, minWidth: 0 }}
  />
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    style={{ marginLeft: '8px', background: 'none', border: 'none', color: '#4a90e2', cursor: 'pointer', fontSize: '1em', height: '40px', lineHeight: '40px', padding: '0 10px', borderRadius: '6px', display: 'flex', alignItems: 'center' }}
  >
    {showPassword ? 'Ocultar' : 'Mostrar'}
  </button>
</div>
        <div className="form-group">
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nombre" required />
        </div>
        <div className="form-group">
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Apellidos" required />
        </div>
        <div className="form-group">
          <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Dirección" required />
        </div>
        <div className="form-group">
          <input type="text" name="province" value={formData.province} onChange={handleChange} placeholder="Provincia" required />
        </div>
        <button type="submit" className="btn-primary">Registrarme</button>
      </form>
      <div className="auth-links">
        <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link></p>
      </div>
    </div>
  );
};

export default Register;