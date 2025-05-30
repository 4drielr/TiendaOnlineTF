import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthService from '../services/AuthService';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const location = useLocation();
  const [redirectPath, setRedirectPath] = useState('/');
  
  useEffect(() => {
    // Verificar si viene de checkout para redirigir después del login
    const params = new URLSearchParams(location.search);
    const from = params.get('from');
    if (from === 'checkout') {
      setRedirectPath('/checkout');
    }
  }, [location]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    AuthService.login(formData.email, formData.password)
      .then((userData) => {
        // Guardar el nombre de usuario en el estado o contexto global
        localStorage.setItem('username', userData.name);
        localStorage.setItem('user', JSON.stringify(userData));
        window.dispatchEvent(new Event('userChanged'));
        navigate(redirectPath);
      })
      .catch(error => {
        // Mostrar el mensaje real del backend si existe
        const backendMsg = error?.response?.data || 'Error al iniciar sesión. Verifica tus credenciales.';
        setError(backendMsg);
        console.error('Error de inicio de sesión:', error);
      });
  };

  return (
    <div className="auth-container">
      <h2>Iniciar Sesión</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Correo electrónico"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Contraseña"
            required
          />
        </div>
        <button type="submit" className="btn-primary">Iniciar Sesión</button>
      </form>
      <div className="auth-links">
        <p>¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link></p>
      </div>
      <div className="stats-banner">
        <h3>¿Sabías que el 98% de clientes están satisfechos?</h3>
      </div>
    </div>
  );
};

export default Login;