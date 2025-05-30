import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EventoService from '../services/EventoService';
import AuthService from '../services/AuthService';
import '../styles/admin.css';

const AdminEventos = () => {
  const navigate = useNavigate();
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Verificar que el usuario es administrador
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/login');
      return;
    }

    loadEventos();
  }, [navigate]);

  const loadEventos = () => {
    setLoading(true);
    EventoService.getAllEventosAdmin()
      .then(response => {
        setEventos(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Error al cargar los eventos. Por favor, inténtalo de nuevo.');
        setLoading(false);
        console.error('Error cargando eventos:', err);
      });
  };

  const handleEstadoChange = (id, nuevoEstado) => {
    setLoading(true);
    EventoService.updateEstadoEvento(id, nuevoEstado)
      .then(() => {
        setSuccessMessage(`Estado del evento actualizado a ${nuevoEstado}`);
        // Actualizar la lista de eventos
        loadEventos();
        // Limpiar el mensaje después de 3 segundos
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      })
      .catch(err => {
        setError('Error al actualizar el estado del evento. Por favor, inténtalo de nuevo.');
        setLoading(false);
        console.error('Error actualizando estado:', err);
      });
  };

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

  if (loading && eventos.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando eventos...</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <h2 className="admin-title">Gestión de Eventos</h2>
      
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      <div className="admin-content">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Nombre</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Ubicación</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {eventos.length > 0 ? (
                eventos.map(evento => (
                  <tr key={evento.id}>
                    <td>{evento.tipo}</td>
                    <td>{evento.nombre}</td>
                    <td>{evento.usuario?.nombre} {evento.usuario?.apellidos}</td>
                    <td>{formatDate(evento.fechaEvento)}</td>
                    <td>{evento.ubicacion}</td>
                    <td className={getEstadoClass(evento.estado)}>
                      {evento.estado.toUpperCase()}
                    </td>
                    <td>
                      <div className="action-buttons">
                        {evento.estado.toUpperCase() !== 'ACEPTADO' && (
                          <button 
                            className="btn-accept"
                            onClick={() => handleEstadoChange(evento.id, 'ACEPTADO')}
                          >
                            Aceptar
                          </button>
                        )}
                        {evento.estado.toUpperCase() !== 'RECHAZADO' && (
                          <button 
                            className="btn-reject"
                            onClick={() => handleEstadoChange(evento.id, 'RECHAZADO')}
                          >
                            Rechazar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">No hay eventos disponibles</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminEventos;
