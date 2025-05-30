import React, { useEffect, useState } from 'react';
import PedidoService from '../services/PedidoService';
import AuthService from '../services/AuthService';
import { useNavigate, Link } from 'react-router-dom';

const MisPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('todos');
  const navigate = useNavigate();

  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    PedidoService.getUserPedidos()
      .then(res => setPedidos(res.data))
      .catch(() => setError('Error al cargar tus pedidos.'))
      .finally(() => setLoading(false));
  }, [navigate]);

  const filteredPedidos = pedidos.filter(pedido => {
    if (activeTab === 'todos') return true;
    return pedido.estado.toLowerCase() === activeTab;
  });

  // Función para obtener la clase CSS según el estado del pedido
  const getStatusClass = (estado) => {
    switch (estado.toLowerCase()) {
      case 'pendiente': return 'status-pending';
      case 'enviado': return 'status-shipped';
      case 'entregado': return 'status-delivered';
      case 'cancelado': return 'status-cancelled';
      default: return '';
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Cargando tus pedidos...</p>
    </div>
  );

  return (
    <div className="my-orders-page">
      <div className="my-orders-container">
        <div className="orders-header">
          <h2 className="orders-title">Mis Pedidos</h2>
          <p className="orders-subtitle">Consulta el estado y detalles de tus compras</p>
        </div>
        
        {error ? (
          <div className="error-message">{error}</div>
        ) : pedidos.length === 0 ? (
          <div className="empty-orders">
            <div className="empty-orders-icon">📦</div>
            <h3>No tienes pedidos realizados aún</h3>
            <p>¡Explora nuestro catálogo y realiza tu primera compra!</p>
            <Link to="/catalog" className="btn-primary">Ir a la tienda</Link>
          </div>
        ) : (
          <>
            <div className="orders-tabs">
              <button 
                className={`tab-btn ${activeTab === 'todos' ? 'active' : ''}`}
                onClick={() => setActiveTab('todos')}
              >
                Todos los pedidos
              </button>
              <button 
                className={`tab-btn ${activeTab === 'pendiente' ? 'active' : ''}`}
                onClick={() => setActiveTab('pendiente')}
              >
                Pendientes
              </button>
              <button 
                className={`tab-btn ${activeTab === 'enviado' ? 'active' : ''}`}
                onClick={() => setActiveTab('enviado')}
              >
                Enviados
              </button>
              <button 
                className={`tab-btn ${activeTab === 'entregado' ? 'active' : ''}`}
                onClick={() => setActiveTab('entregado')}
              >
                Entregados
              </button>
              <button 
                className={`tab-btn ${activeTab === 'cancelado' ? 'active' : ''}`}
                onClick={() => setActiveTab('cancelado')}
              >
                Cancelados
              </button>
            </div>
            
            {filteredPedidos.length === 0 ? (
              <div className="no-filtered-orders">
                <p>No tienes pedidos con el estado seleccionado.</p>
              </div>
            ) : (
              <div className="orders-list">
                {filteredPedidos.map(pedido => (
                  <div key={pedido.id} className="order-card">
                    <div className="order-header">
                      <div className="order-info">
                        <span className="label">Pedido #:</span>
                        <span className="value">{pedido.id}</span>
                      </div>
                      <div className={`order-status ${getStatusClass(pedido.estado)}`}>
                        {pedido.estado}
                      </div>
                    </div>
                    <div className="order-body">
                      <div className="order-summary">
                        <div className="order-items-count">
                          <span className="label">Productos:</span>
                          <span className="value">{pedido.detalles.length}</span>
                        </div>
                        <div className="order-total">
                          <span className="label">Total:</span>
                          <span className="value">€{pedido.total.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <div className="order-actions">
                        <button 
                          onClick={() => navigate(`/pedido/${pedido.id}`)} 
                          className="btn-view-details"
                        >
                          Ver detalles
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MisPedidos;
