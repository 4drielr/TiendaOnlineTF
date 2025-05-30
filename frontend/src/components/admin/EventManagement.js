import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import EventoService from '../../services/EventoService';

const GestionEventos = () => {
  const navigate = useNavigate();
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedEvento, setSelectedEvento] = useState(null);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchEventos();
    // eslint-disable-next-line
  }, [navigate]);

  const fetchEventos = () => {
    EventoService.getAllEventos()
      .then(res => setEventos(res.data))
      .catch(() => setError('Error al cargar eventos.'))
      .finally(() => setLoading(false));
  };

  const handleViewDetails = (evento) => {
    setSelectedEvento(evento);
  };

  const handleUpdateStatus = (eventoId, newStatus) => {
    setError('');
    setSuccess('');
    EventoService.updateEvento(eventoId, { estado: newStatus })
      .then(() => {
        setSuccess('Estado actualizado correctamente.');
        fetchEventos();
      })
      .catch(() => setError('Error al actualizar el estado.'));
  };

  return (
    <div className="admin-container">
      <h2>Gestionar Eventos</h2>
      {loading && <div>Cargando eventos...</div>}
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      {!loading && eventos.length === 0 && <div>No hay eventos registrados.</div>}
      {!loading && eventos.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Tipo</th>
              <th>Nombre</th>
              <th>Fecha</th>
              <th>Precio</th>
              <th>Estado</th>
              <th>Detalles</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {eventos.map(evento => (
              <tr key={evento.id}>
                <td>{evento.usuario?.nombre || 'Sin nombre'}</td>
                <td>{evento.tipo}</td>
                <td>{evento.nombre}</td>
                <td>{new Date(evento.fechaEvento).toLocaleDateString('es-ES')}</td>
                <td>€{evento.precio?.toFixed(2)}</td>
                <td className={`status-${evento.estado.toLowerCase()}`}>{evento.estado}</td>
                <td>
                  <button className="btn-view" onClick={() => handleViewDetails(evento)}>Ver detalles</button>
                </td>
                <td>
                  <select 
                    value={evento.estado}
                    onChange={(e) => handleUpdateStatus(evento.id, e.target.value)}
                    className="status-select"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="confirmado">Confirmado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedEvento && (
        <div className="evento-modal">
          <div className="modal-content">
            <h3>Detalles del Evento</h3>
            <p><strong>Tipo:</strong> {selectedEvento.tipo}</p>
            <p><strong>Nombre:</strong> {selectedEvento.nombre}</p>
            <p><strong>Estado:</strong> {selectedEvento.estado}</p>
            <p><strong>Fecha:</strong> {new Date(selectedEvento.fechaEvento).toLocaleString('es-ES')}</p>
            <p><strong>Precio:</strong> {selectedEvento.precio?.toFixed(2)} €</p>
            <p><strong>Ubicación:</strong> {selectedEvento.ubicacion}</p>
            <p><strong>Número de invitados:</strong> {selectedEvento.numInvitados}</p>
            <p><strong>Descripción:</strong> {selectedEvento.descripcion}</p>
            
            <h4>Servicios incluidos:</h4>
            <ul>
              {selectedEvento.incluyeComida && <li>Comida</li>}
              {selectedEvento.incluyeBebida && <li>Bebida</li>}
              {selectedEvento.incluyeAnimacion && <li>Animación</li>}
              {selectedEvento.incluyeDecoracion && <li>Decoración</li>}
              {selectedEvento.incluyeFotografia && <li>Fotografía</li>}
            </ul>
            
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setSelectedEvento(null)}>Cerrar</button>
              <button 
                className={`btn-${selectedEvento.estado === 'pendiente' ? 'primary' : 'secondary'}`}
                onClick={() => handleUpdateStatus(selectedEvento.id, 'confirmado')}
                disabled={selectedEvento.estado !== 'pendiente'}
              >
                Confirmar Evento
              </button>
              <button 
                className="btn-danger"
                onClick={() => handleUpdateStatus(selectedEvento.id, 'cancelado')}
                disabled={selectedEvento.estado === 'cancelado'}
              >
                Cancelar Evento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionEventos;