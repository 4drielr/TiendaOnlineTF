import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import UserService from '../services/UserService';
import '../styles/floating-labels.css';

const EditProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    direccion: '',
    provincia: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }

    setLoading(true);
    UserService.getUserById(currentUser.id)
      .then(response => {
        setUser(response.data);
        setFormData({
          nombre: response.data.nombre || '',
          apellidos: response.data.apellidos || '',
          direccion: response.data.direccion || '',
          provincia: response.data.provincia || '',
          password: '',
          confirmPassword: ''
        });
        setLoading(false);
      })
      .catch(err => {
        setError('Error al cargar los datos del usuario.');
        setLoading(false);
        console.error('Error cargando usuario:', err);
      });
  }, [navigate]);

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
    setSuccess('');

    // Si cambia la contraseña, valido que coincidan
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    const updateData = {
      nombre: formData.nombre,
      apellidos: formData.apellidos,
      direccion: formData.direccion,
      provincia: formData.provincia
    };

    // Solo pongo la contraseña si se cambia
    if (formData.password) {
      updateData.password = formData.password;
    }

    const currentUser = AuthService.getCurrentUser();
    UserService.updateUser(currentUser.id, updateData)
      .then(() => {
        setSuccess('Perfil actualizado correctamente.');
        // Actualizo el usuario en localStorage
        const updatedUser = {
          ...currentUser,
          name: formData.nombre
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Refresco la página tras 2 segundos para ver los cambios
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch(err => {
        setError('Error al actualizar el perfil. Inténtalo de nuevo.');
        console.error('Error actualizando perfil:', err);
      });
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Cargando datos del usuario...</p>
    </div>
  );

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-container">
        <div className="profile-header">
          <h2 className="profile-title">Editar Perfil</h2>
          <p className="profile-subtitle">Actualiza tu información personal</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <div className="profile-content">
          <div className="profile-avatar">
            <div className="avatar-circle" style={{
              background: (formData.nombre && formData.apellidos) ? '#4a90e2' : 'transparent',
              color: (formData.nombre && formData.apellidos) ? '#fff' : '#4a90e2',
              border: '2px solid #4a90e2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              fontSize: '2.1rem',
              borderRadius: '50%'
            }}>
              {formData.nombre && formData.apellidos ? (
                `${formData.nombre.charAt(0)}${formData.apellidos.charAt(0)}`
              ) : (
                ''
              )}
            </div>
            <h3 className="user-name">{formData.nombre} {formData.apellidos}</h3>
            <p className="user-email">{user?.email}</p>
          </div>
          
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-section">
              <h3 className="section-subtitle">Información Personal</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="form-control"
                    placeholder=" "
                  />
                  <label htmlFor="nombre">Nombre</label>
                </div>
                
                <div className="form-group">
                  <input
                    type="text"
                    id="apellidos"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleChange}
                    required
                    className="form-control"
                    placeholder=" "
                  />
                  <label htmlFor="apellidos">Apellidos</label>
                </div>
              </div>
              
              <div className="form-group">
                <div className="input-with-icon">
                  <input
                    type="email"
                    id="email"
                    value={user?.email || ''}
                    disabled
                    className="form-control disabled"
                    placeholder=" "
                  />
                  <label htmlFor="email">Email</label>
                  <span className="input-icon">🔒</span>
                </div>
                <small className="form-text">El email no se puede cambiar.</small>
              </div>
            </div>
            
            <div className="form-section">
              <h3 className="section-subtitle">Dirección de Envío</h3>
              
              <div className="form-group">
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  required
                  className="form-control"
                  placeholder=" "
                />
                <label htmlFor="direccion">Dirección</label>
              </div>
              
              <div className="form-group">
                <input
                  type="text"
                  id="provincia"
                  name="provincia"
                  value={formData.provincia}
                  onChange={handleChange}
                  required
                  className="form-control"
                  placeholder=" "
                />
                <label htmlFor="provincia">Provincia</label>
              </div>
            </div>
            
            <div className="form-section">
              <h3 className="section-subtitle">Cambiar Contraseña</h3>
              <p className="section-description">Deja estos campos en blanco si no deseas cambiar tu contraseña.</p>
              
              <div className="form-group">
                <div className="input-with-icon">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-control"
                    placeholder=" "
                  />
                  <label htmlFor="password">Nueva Contraseña</label>
                  <span className="input-icon">🔐</span>
                </div>
              </div>
              
              <div className="form-group">
                <div className="input-with-icon">
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="form-control"
                    placeholder=" "
                  />
                  <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                  <span className="input-icon">🔐</span>
                </div>
              </div>
            </div>
            
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => navigate('/perfil')}>Cancelar</button>
              <button type="submit" className="btn-primary">
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    <span>Guardando...</span>
                  </>
                ) : (
                  'Guardar Cambios'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
