import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EventoService from '../services/EventoService';
import AuthService from '../services/AuthService';
import '../styles/profile.css';

const MisEventos = () => {
  const navigate = useNavigate();
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Verificar que el usuario está autenticado
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Cargar los eventos del usuario
    setLoading(true);
    EventoService.getEventosByUsuario(currentUser.id)
      .then(response => {
        setEventos(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Error al cargar tus eventos. Por favor, inténtalo de nuevo.');
        setLoading(false);
        console.error('Error cargando eventos:', err);
      });
  }, [navigate]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const getEstadoClass = (estado) => {
    switch (estado.toUpperCase()) {
      case 'ACEPTADO':
        return 'status-completed';
      case 'RECHAZADO':
        return 'status-cancelled';
      default:
        return 'status-pending';
    }
  };

  const getEstadoText = (estado) => {
    switch (estado.toUpperCase()) {
      case 'ACEPTADO':
        return 'Aceptado';
      case 'RECHAZADO':
        return 'Rechazado';
      default:
        return 'Pendiente';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando tus eventos...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h2 className="profile-title">Mis Eventos</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      {eventos.length === 0 ? (
        <div className="no-events-message">
          <p>No tienes eventos reservados.</p>
          <button 
            className="btn-primary" 
            onClick={() => navigate('/eventos')}
          >
            Reservar un Evento
          </button>
        </div>
      ) : (
        <div className="user-eventos">
          <div className="eventos-list">
            {eventos.map(evento => (
              <div key={evento.id} className="evento-card">
                <h4>{evento.nombre}</h4>
                <p><strong>Tipo:</strong> {evento.tipo}</p>
                <p><strong>Fecha:</strong> {formatDate(evento.fechaEvento)}</p>
                <p><strong>Ubicación:</strong> {evento.ubicacion}</p>
                <p><strong>Invitados:</strong> {evento.numInvitados}</p>
                <p><strong>Precio:</strong> {evento.precio}€</p>
                <p>
                  <strong>Estado:</strong> 
                  <span className={getEstadoClass(evento.estado)}>
                    {getEstadoText(evento.estado)}
                  </span>
                </p>
                <div className="evento-servicios">
                  <p><strong>Servicios incluidos:</strong></p>
                  <ul>
                    {evento.incluyeComida && <li>Comida</li>}
                    {evento.incluyeBebida && <li>Bebida</li>}
                    {evento.incluyeAnimacion && <li>Animación</li>}
                    {evento.incluyeDecoracion && <li>Decoración</li>}
                    {evento.incluyeFotografia && <li>Fotografía</li>}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MisEventos;
