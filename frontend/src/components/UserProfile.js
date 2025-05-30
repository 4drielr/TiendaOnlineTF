import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../services/AuthService';
import EventoService from '../services/EventoService';
import PedidoService from '../services/PedidoService';
import { FaShoppingBag, FaCalendarAlt, FaUser, FaSignOutAlt } from 'react-icons/fa';

const UserProfile = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [loadingEventos, setLoadingEventos] = useState(true);
  const [loadingPedidos, setLoadingPedidos] = useState(true);
  const [errorEventos, setErrorEventos] = useState('');
  const [errorPedidos, setErrorPedidos] = useState('');

  // Inicializar usuario desde localStorage y redirigir
  useEffect(() => {
    const user = AuthService.getCurrentUser();
    setCurrentUser(user);
    if (!user) {
      navigate('/login');
    } else if (user.role === 'admin') {
      navigate('/admin');
    }
  }, [navigate]);

  // Cargo los eventos del usuario
  useEffect(() => {
    if (currentUser && currentUser.id) {
      setLoadingEventos(true);
      EventoService.getEventosByUsuario(currentUser.id)
        .then(response => {
          setEventos(response.data);
          setLoadingEventos(false);
        })
        .catch(err => {
          console.error('Error cargando eventos:', err);
          setErrorEventos('No se pudieron cargar tus eventos.');
          setLoadingEventos(false);
        });
        
      // Cargar pedidos del usuario
      setLoadingPedidos(true);
      PedidoService.getUserPedidos()
        .then(response => {
          setPedidos(response.data);
          setLoadingPedidos(false);
        })
        .catch(err => {
          console.error('Error cargando pedidos:', err);
          setErrorPedidos('No se pudieron cargar tus pedidos.');
          setLoadingPedidos(false);
        });
    }
  }, [currentUser]);

  const handleLogout = () => {
    AuthService.logout();
    navigate('/');
  };

  if (!currentUser) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="profile-container">
      <h2>¡Hola, {currentUser.name}!</h2>
      <p>¿Qué deseas hacer?</p>

      <div className="profile-options">
        <Link to="/editar-perfil" className="profile-option">
          <FaUser className="option-icon" /> Editar perfil
        </Link>
        <Link to="/mis-pedidos" className="profile-option">
          <FaShoppingBag className="option-icon" /> Mis pedidos
        </Link>
        <Link to="/mis-eventos" className="profile-option">
          <FaCalendarAlt className="option-icon" /> Mis eventos
        </Link>
        <Link to="/eventos" className="profile-option">
          <FaCalendarAlt className="option-icon" /> Reservar evento
        </Link>
      </div>

      <div className="profile-sections">
        {/* Mostrar pedidos recientes */}
        <div className="profile-section">
          <h3>Mis Pedidos Recientes</h3>
          {loadingPedidos ? (
            <p>Cargando tus pedidos...</p>
          ) : errorPedidos ? (
            <p className="error-message">{errorPedidos}</p>
          ) : pedidos.length === 0 ? (
            <p>No tienes pedidos realizados. <Link to="/productos">¡Compra ahora!</Link></p>
          ) : (
            <div className="pedidos-preview">
              {pedidos.slice(0, 3).map(pedido => (
                <div key={pedido.id} className="pedido-card">
                  <div className="pedido-header">
                    <span className="pedido-id">Pedido #{pedido.id}</span>
                    <span className={`pedido-estado ${pedido.estado.toLowerCase()}`}>{pedido.estado}</span>
                  </div>
                  <div className="pedido-info">
                    <p><strong>Total:</strong> €{pedido.total.toFixed(2)}</p>
                    <p><strong>Productos:</strong> {pedido.detalles.length}</p>
                  </div>
                  <Link to={`/pedido/${pedido.id}`} className="ver-detalles">Ver detalles</Link>
                </div>
              ))}
              {pedidos.length > 3 && (
                <Link to="/mis-pedidos" className="ver-todos">Ver todos mis pedidos</Link>
              )}
            </div>
          )}
        </div>
        
        {/* Mostrar eventos reservados */}
        <div className="profile-section">
          <h3>Mis Eventos Reservados</h3>
          {loadingEventos ? (
            <p>Cargando tus eventos...</p>
          ) : errorEventos ? (
            <p className="error-message">{errorEventos}</p>
          ) : eventos.length === 0 ? (
            <p>No tienes eventos reservados. <Link to="/eventos">¡Reserva uno ahora!</Link></p>
          ) : (
            <div className="eventos-list">
              {eventos.map(evento => (
                <div key={evento.id} className="evento-card">
                  <h4>{evento.nombre}</h4>
                  <p><strong>Tipo:</strong> {evento.tipo}</p>
                  <p><strong>Fecha:</strong> {new Date(evento.fechaEvento).toLocaleDateString()}</p>
                  <p><strong>Estado:</strong> {evento.estado}</p>
                  <p><strong>Precio:</strong> {evento.precio}€</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <button onClick={handleLogout} className="btn-logout">
        <FaSignOutAlt /> Cerrar sesión
      </button>
    </div>
  );
};

export default UserProfile;