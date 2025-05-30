import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

const AdminProfile = () => {
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();

  // Redirigir si no hay usuario autenticado o no es administrador
  React.useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      navigate('/login');
    } else if (currentUser.role !== 'admin') {
      // Si no es admin, lo mando al perfil de usuario normal
      navigate('/perfil');
    }
  }, [navigate]);

  const handleLogout = () => {
    AuthService.logout();
    navigate('/');
  };

  if (!currentUser) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="profile-container">
      <h2>Gestión/Admin.</h2>
      <p>¿Qué deseas hacer?</p>

      <div className="profile-options">
        <a href="/admin/usuarios" className="profile-option">Gestionar usuarios</a>
        <a href="/admin/productos" className="profile-option">Gestionar productos</a>
        <a href="/admin/pedidos" className="profile-option">Gestionar pedidos</a>
        <a href="/admin/eventos" className="profile-option">Gestionar eventos</a>
      </div>

      <button onClick={handleLogout} className="btn-logout">Cerrar sesión</button>
    </div>
  );
};

export default AdminProfile;