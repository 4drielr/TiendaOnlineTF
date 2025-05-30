import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import PedidoService from '../../services/PedidoService';
import '../../styles/admin.css';

const GestionPedidos = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('todos');

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchOrders();
    // eslint-disable-next-line
  }, [navigate]);

  const fetchOrders = () => {
    setLoading(true);
    PedidoService.getAllPedidos()
      .then(res => {
        setOrders(res.data);
        setError('');
      })
      .catch(() => setError('Error al cargar pedidos. Inténtalo de nuevo más tarde.'))
      .finally(() => setLoading(false));
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    setError('');
    setSuccess('');
    PedidoService.updatePedidoStatus(orderId, newStatus)
      .then(() => {
        setSuccess(`Estado del pedido actualizado a "${newStatus}" correctamente.`);
        fetchOrders();
        // Ocultar el mensaje después de 3 segundos
        setTimeout(() => setSuccess(''), 3000);
      })
      .catch((err) => {
        setError(`Error al actualizar el estado: ${err.message || 'Inténtalo de nuevo.'}`);
        setTimeout(() => setError(''), 5000);
      });
  };
  
  // Función para obtener la clase CSS según el estado del pedido
  const getStatusClass = (estado) => {
    switch (estado.toLowerCase()) {
      case 'pendiente': return 'status-pending';
      case 'en proceso': return 'status-processing';
      case 'completado': return 'status-completed';
      case 'cancelado': return 'status-cancelled';
      default: return '';
    }
  };
  
  // Función eliminada: formatDate
  
  // Filtrar pedidos por estado
  const filteredOrders = filterStatus === 'todos' 
    ? orders 
    : orders.filter(order => order.estado.toLowerCase() === filterStatus.toLowerCase());

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2 className="admin-title">Gestión de Pedidos</h2>
        <p className="admin-subtitle">Administra y actualiza el estado de los pedidos de tus clientes</p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando pedidos...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-data-container">
          <div className="empty-data-icon">📦</div>
          <h3>No hay pedidos registrados</h3>
          <p>Los pedidos de los clientes aparecerán aquí cuando se realicen compras.</p>
        </div>
      ) : (
        <div className="admin-content">
          <div className="filter-controls">
            <div className="filter-group">
              <label>Filtrar por estado:</label>
              <select 
                className="status-filter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="todos">Todos los pedidos</option>
                <option value="pendiente">Pendientes</option>
                <option value="en proceso">En proceso</option>
                <option value="completado">Completados</option>
                <option value="cancelado">Cancelados</option>
              </select>
            </div>
            <button className="refresh-btn" onClick={fetchOrders} title="Actualizar lista">
              🔄 Actualizar
            </button>
          </div>
          
          <div className="results-count">
            {filteredOrders.length} {filteredOrders.length === 1 ? 'pedido encontrado' : 'pedidos encontrados'}
          </div>
          
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Detalles</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map(order => (
                    <tr key={order.id}>
                      <td>
                        <div className="customer-info">
                          <span className="customer-name">{order.usuario?.nombre || 'Sin nombre'}</span>
                          {order.usuario?.email && <span className="customer-email">{order.usuario.email}</span>}
                        </div>
                      </td>
                      <td className="price-cell">€{order.total.toFixed(2)}</td>
                      <td>
                        <span className={`status-badge ${getStatusClass(order.estado)}`}>
                          {order.estado}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn-view" 
                          onClick={() => handleViewDetails(order)}
                        >
                          Ver detalles
                        </button>
                      </td>
                      <td>
                        <select 
                          className={`status-select ${getStatusClass(order.estado)}`}
                          value={order.estado}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="en proceso">En proceso</option>
                          <option value="completado">Completado</option>
                          <option value="cancelado">Cancelado</option>
                        </select>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-results">
                      No hay pedidos con el estado seleccionado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedOrder && (
        <div className="modal-overlay">
          <div className="pedido-modal">
            <div className="modal-header">
              <h3>Detalles del Pedido</h3>
              <button className="close-btn" onClick={() => setSelectedOrder(null)}>&times;</button>
            </div>
            
            <div className="modal-body">
              <div className="order-info-grid">
                <div className="info-card">
                  <h4>Información del Pedido</h4>
                  <div className="info-item">
                    <span className="info-label">Estado:</span>
                    <span className={`info-value status-badge ${getStatusClass(selectedOrder.estado)}`}>
                      {selectedOrder.estado}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Total:</span>
                    <span className="info-value price">€{selectedOrder.total?.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="info-card">
                  <h4>Información del Cliente</h4>
                  <div className="info-item">
                    <span className="info-label">Nombre:</span>
                    <span className="info-value">{selectedOrder.usuario?.nombre || 'No disponible'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Email:</span>
                    <span className="info-value">{selectedOrder.usuario?.email || 'No disponible'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Dirección:</span>
                    <span className="info-value">{selectedOrder.direccionEnvio || 'No disponible'}</span>
                  </div>
                </div>
              </div>
              
              <div className="order-products">
                <h4>Productos en el Pedido</h4>
                <div className="products-table-container">
                  <table className="products-table">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Precio Unitario</th>
                        <th>Cantidad</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.detalles?.map((detalle, idx) => (
                        <tr key={idx}>
                          <td>
                            <div className="product-info">
                              {detalle.producto?.imagen && (
                                <img 
                                  src={detalle.producto.imagen} 
                                  alt={detalle.producto.nombre} 
                                  className="product-thumbnail"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/50';
                                  }}
                                />
                              )}
                              <span>{detalle.producto?.nombre || 'Producto'}</span>
                            </div>
                          </td>
                          <td className="price-cell">€{detalle.precioUnitario?.toFixed(2)}</td>
                          <td className="quantity-cell">{detalle.cantidad}</td>
                          <td className="price-cell">€{detalle.subtotal?.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="3" className="total-label">Total</td>
                        <td className="total-value">€{selectedOrder.total?.toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <div className="status-actions">
                <label>Actualizar estado:</label>
                <select 
                  className={`status-select ${getStatusClass(selectedOrder.estado)}`}
                  value={selectedOrder.estado}
                  onChange={(e) => {
                    handleUpdateStatus(selectedOrder.id, e.target.value);
                    setSelectedOrder({...selectedOrder, estado: e.target.value});
                  }}
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="en proceso">En proceso</option>
                  <option value="completado">Completado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
              <button className="btn-secondary" onClick={() => setSelectedOrder(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionPedidos;