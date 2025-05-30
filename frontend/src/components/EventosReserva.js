import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EventoService from '../services/EventoService';
import AuthService from '../services/AuthService';
import '../styles/eventos.css';

const EventosReserva = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tipo: 'CUMPLEAÑOS',
    nombre: '',
    descripcion: '',
    fechaEvento: '',
    ubicacion: '',
    numInvitados: 10,
    incluyeComida: true,
    incluyeBebida: true,
    incluyeAnimacion: false,
    incluyeDecoracion: true,
    incluyeFotografia: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [precios, setPrecios] = useState({
    CUMPLEAÑOS: 300,
    COMUNION: 500,
    BODA: 1500,
    OTRO: 250
  });
  const [precioTotal, setPrecioTotal] = useState(0);

  useEffect(() => {
    // Compruebo si el usuario está logueado
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      navigate('/login?from=eventos');
    }
  }, [navigate]);

  useEffect(() => {
    // Calculo el precio total según el tipo y extras
    let precio = precios[formData.tipo] || precios.OTRO;
    
    if (formData.incluyeComida) precio += 150;
    if (formData.incluyeBebida) precio += 100;
    if (formData.incluyeAnimacion) precio += 200;
    if (formData.incluyeDecoracion) precio += 150;
    if (formData.incluyeFotografia) precio += 250;
    
    // Si hay más de 10 invitados, sumo 10€ por cada uno extra
    if (formData.numInvitados > 10) {
      precio += (formData.numInvitados - 10) * 10;
    }
    
    setPrecioTotal(precio);
  }, [formData, precios]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      setError('Debes iniciar sesión para reservar un evento.');
      setLoading(false);
      return;
    }
    
    const eventoData = {
      ...formData,
      precio: parseFloat(precioTotal),
      fechaEvento: new Date(formData.fechaEvento),
      estado: 'PENDIENTE',
      usuario: {
        id: currentUser.id
      }
    };
    
    EventoService.createEvento(eventoData)
      .then(response => {
        setSuccess('¡Evento reservado con éxito! Te contactaremos pronto para confirmar los detalles.');
        setFormData({
          tipo: 'CUMPLEAÑOS',
          nombre: '',
          descripcion: '',
          fechaEvento: '',
          ubicacion: '',
          numInvitados: 10,
          incluyeComida: true,
          incluyeBebida: true,
          incluyeAnimacion: false,
          incluyeDecoracion: true,
          incluyeFotografia: false
        });
        setLoading(false);
      })
      .catch(err => {
        setError('Error al reservar el evento. Por favor, inténtalo de nuevo.');
        setLoading(false);
        console.error('Error reservando evento:', err);
      });
  };

  return (
    <div className="container">
      <h2 className="section-title">Reserva tu Evento</h2>
      <div className="eventos-info">
        <h3>Celebra con nosotros tus momentos especiales</h3>
        <p>
          En Niños y Celebraciones nos encargamos de hacer realidad tus eventos más importantes.
          Organizamos cumpleaños infantiles, comuniones, bodas y todo tipo de celebraciones con
          la máxima calidad y atención personalizada.
        </p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <div className="eventos-container">
        <div className="eventos-tipos">
          <div className="evento-tipo">
            <h4>Cumpleaños</h4>
            <p>Celebraciones infantiles con animación, decoración temática y merienda.</p>
            <p className="precio">Desde {precios.CUMPLEAÑOS}€</p>
          </div>
          <div className="evento-tipo">
            <h4>Comuniones</h4>
            <p>Celebraciones especiales con menú personalizado y decoración elegante.</p>
            <p className="precio">Desde {precios.COMUNION}€</p>
          </div>
          <div className="evento-tipo">
            <h4>Bodas</h4>
            <p>Celebraciones completas con banquete, música y decoración personalizada.</p>
            <p className="precio">Desde {precios.BODA}€</p>
          </div>
          <div className="evento-tipo">
            <h4>Otros Eventos</h4>
            <p>Bautizos, aniversarios, graduaciones y más celebraciones a medida.</p>
            <p className="precio">Desde {precios.OTRO}€</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="eventos-form" autoComplete="off">
          <h3 className="form-title">Reserva tu evento</h3>
          <p className="form-subtitle">Completa los datos y personaliza tu celebración. ¡Te ayudamos a crear recuerdos inolvidables!</p>
          
          <div className="form-group">
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              required
              className="form-control"
            >
              <option value="CUMPLEAÑOS">Cumpleaños</option>
              <option value="COMUNION">Comunión</option>
              <option value="BODA">Boda</option>
              <option value="OTRO">Otro</option>
            </select>
            <label htmlFor="tipo">Tipo de Evento</label>
          </div>
          
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
            <label htmlFor="nombre">Nombre del Evento</label>
          </div>
          
          <div className="form-group">
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              required
              className="form-control"
              placeholder=" "
              rows="3"
            ></textarea>
            <label htmlFor="descripcion">Descripción y Detalles</label>
          </div>
          
          <div className="form-group">
            <input
              type="date"
              id="fechaEvento"
              name="fechaEvento"
              value={formData.fechaEvento}
              onChange={handleChange}
              required
              className="form-control"
              min={new Date().toISOString().split('T')[0]}
            />
            <label htmlFor="fechaEvento">Fecha del Evento</label>
            {!formData.fechaEvento && <span className="input-error">Selecciona una fecha para el evento</span>}
          </div>
          
          <div className="form-group">
            <input
              type="text"
              id="ubicacion"
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleChange}
              required
              className="form-control"
              placeholder=" "
            />
            <label htmlFor="ubicacion">Ubicación</label>
          </div>
          
          <div className="form-group">
            <input
              type="number"
              id="numInvitados"
              name="numInvitados"
              value={formData.numInvitados}
              onChange={handleChange}
              required
              min="1"
              max="200"
              className="form-control"
              placeholder=" "
              style={formData.numInvitados < 1 ? { borderColor: '#ff4d4f' } : {}}
            />
            <label htmlFor="numInvitados">Número de Invitados</label>
            {formData.numInvitados < 1 && <span className="input-error">Debe haber al menos 1 invitado</span>}
          </div>
          
          <div className="form-group servicios">
            <span className="servicios-label">Servicios Incluidos</span>
            <div className="checkbox-group">
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="incluyeComida"
                  name="incluyeComida"
                  checked={formData.incluyeComida}
                  onChange={handleChange}
                />
                <label htmlFor="incluyeComida">Comida (+150€)</label>
              </div>
              
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="incluyeBebida"
                  name="incluyeBebida"
                  checked={formData.incluyeBebida}
                  onChange={handleChange}
                />
                <label htmlFor="incluyeBebida">Bebida (+100€)</label>
              </div>
              
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="incluyeAnimacion"
                  name="incluyeAnimacion"
                  checked={formData.incluyeAnimacion}
                  onChange={handleChange}
                />
                <label htmlFor="incluyeAnimacion">Animación (+200€)</label>
              </div>
              
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="incluyeDecoracion"
                  name="incluyeDecoracion"
                  checked={formData.incluyeDecoracion}
                  onChange={handleChange}
                />
                <label htmlFor="incluyeDecoracion">Decoración (+150€)</label>
              </div>
              
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="incluyeFotografia"
                  name="incluyeFotografia"
                  checked={formData.incluyeFotografia}
                  onChange={handleChange}
                />
                <label htmlFor="incluyeFotografia">Fotografía (+250€)</label>
              </div>
            </div>
          </div>
          
          <div className="precio-total">
            <h3>Precio Total: {precioTotal}€</h3>
            <p className="precio-info">*10€ adicionales por cada invitado después de 10 personas</p>
          </div>
          
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading || formData.numInvitados < 1 || !formData.fechaEvento}
          >
            {loading ? 'Procesando...' : 'Reservar Evento'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EventosReserva;
