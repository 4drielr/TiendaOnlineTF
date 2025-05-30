import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PedidoService from '../services/PedidoService';
import AuthService from '../services/AuthService';

const DetallePedido = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    PedidoService.getPedidoById(id)
      .then(response => {
        setPedido(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al cargar el pedido:', err);
        setError('No se pudo cargar la información del pedido.');
        setLoading(false);
      });
  }, [id, navigate]);

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

  // Función eliminada: formatDate

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Cargando detalles del pedido...</p>
    </div>
  );

  if (error) return (
    <div className="my-orders-page">
      <div className="my-orders-container">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate('/mis-pedidos')} className="btn-secondary mt-4">
          Volver a Mis Pedidos
        </button>
      </div>
    </div>
  );

  return (
    <div className="my-orders-page">
      <div className="my-orders-container">
        <div className="order-detail-header">
          <div className="back-button">
            <button onClick={() => navigate('/mis-pedidos')} className="btn-back">
              ← Volver a Mis Pedidos
            </button>
          </div>
          <h2 className="orders-title">Detalle del Pedido</h2>
          <div className={`order-status ${getStatusClass(pedido.estado)}`}>
            {pedido.estado}
          </div>
        </div>

        <div className="order-info-section">
          <div className="order-info-card">
            <h3 className="info-title">Información del Pedido</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Número de Pedido:</span>
                <span className="info-value">#{pedido.id}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Estado:</span>
                <span className={`info-value ${getStatusClass(pedido.estado)}`}>{pedido.estado}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Total:</span>
                <span className="info-value price">${pedido.total.toFixed(2)}</span>
              </div>
              {pedido.metodoPago && (
                <div className="info-item">
                  <span className="info-label">Método de Pago:</span>
                  <span className="info-value">{pedido.metodoPago}</span>
                </div>
              )}
            </div>
          </div>

          <div className="order-info-card">
            <h3 className="info-title">Información del Cliente</h3>
            <div className="customer-info">
              <div className="info-item">
                <span className="info-label">Nombre:</span>
                <span className="info-value">{pedido.usuario?.nombre || 'No disponible'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email:</span>
                <span className="info-value">{pedido.usuario?.email || 'No disponible'}</span>
              </div>
            </div>
          </div>
          
          <div className="order-info-card">
            <h3 className="info-title">Dirección de Envío</h3>
            <div className="address-info">
              <p>{pedido.direccionEnvio || 'No disponible'}</p>
              <p>{pedido.provincia || ''}</p>
            </div>
          </div>
        </div>

        <div className="order-items-section">
          <h3 className="section-title">Productos en tu Pedido</h3>
          <div className="order-items-table">
            <div className="table-header">
              <div className="col-product">Producto</div>
              <div className="col-price">Precio Unitario</div>
              <div className="col-quantity">Cantidad</div>
              <div className="col-total">Subtotal</div>
            </div>
            
            {pedido.detalles.map((detalle, index) => (
              <div key={index} className="table-row">
                <div className="col-product">
                  <div className="product-info">
                    {detalle.producto.imagen && (
                      <div className="product-image">
                        <img src={detalle.producto.imagen} alt={detalle.producto.nombre} />
                      </div>
                    )}
                    <div className="product-details">
                      <h4>{detalle.producto.nombre}</h4>
                    </div>
                  </div>
                </div>
                <div className="col-price">${detalle.precioUnitario.toFixed(2)}</div>
                <div className="col-quantity">{detalle.cantidad}</div>
                <div className="col-total">${detalle.subtotal.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="order-summary-section">
          <div className="order-summary-card">
            <h3 className="summary-title">Resumen del Pedido</h3>
            <div className="summary-items">
              <div className="summary-item">
                <span>Subtotal:</span>
                <span>${pedido.total.toFixed(2)}</span>
              </div>
              <div className="summary-item">
                <span>Gastos de envío:</span>
                <span>$0.00</span>
              </div>
              {pedido.descuento > 0 && (
                <div className="summary-item discount">
                  <span>Descuento:</span>
                  <span>-${pedido.descuento.toFixed(2)}</span>
                </div>
              )}
              <div className="summary-item total">
                <span>Total:</span>
                <span>${pedido.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="order-actions-section">
          <button onClick={() => navigate('/mis-pedidos')} className="btn-secondary">
            Volver a Mis Pedidos
          </button>
          {pedido.estado.toLowerCase() === 'pendiente' && (
            <button className="btn-cancel-order">
              Cancelar Pedido
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetallePedido;
