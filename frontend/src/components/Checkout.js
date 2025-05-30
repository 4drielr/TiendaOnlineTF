import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import AuthService from '../services/AuthService';
import PedidoService from '../services/PedidoService';
import { FaShoppingCart, FaTrash, FaMinus, FaPlus, FaTag } from 'react-icons/fa';
import '../styles/checkout.css';

const Checkout = () => {
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const { cartItems, removeFromCart, updateQuantity, total: cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const shipping = cartItems.length > 0 ? 2.99 : 0;
  const subtotal = cartTotal;
  const total = subtotal + shipping - discount;

  useEffect(() => {
    if (!AuthService.isAuthenticated() && cartItems.length > 0) {
      alert('Debes iniciar sesión para completar tu compra');
      navigate('/login?from=checkout');
    }
  }, [navigate, cartItems.length]);

  const handlePagarPedido = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      if (!cartItems || cartItems.length === 0) {
        setError('No hay productos en el carrito. Añade productos antes de pagar.');
        setLoading(false);
        return;
      }
      
      // Crear detalles con la estructura correcta para el backend
      const detalles = cartItems.map(item => ({
        // Enviar el objeto producto completo con su ID
        producto: {
          id: item.id,
          nombre: item.nombre,
          precio: item.precio
        },
        productoId: item.id,
        cantidad: item.quantity || 1,
        precioUnitario: item.precio,
        subtotal: item.precio * (item.quantity || 1)
      }));
      
      const pedido = {
        detalles,
        direccionEnvio: AuthService.getCurrentUser()?.direccion || 'Sin dirección',
        metodoPago: 'Tarjeta',
        estado: 'pendiente'
      };
      
      console.log('Enviando pedido:', JSON.stringify(pedido));
      
      await PedidoService.createPedido(pedido);
      clearCart();
      setSuccess('¡Pedido realizado con éxito! Gracias por tu compra.');
      setTimeout(() => navigate('/mis-pedidos'), 1200);
    } catch (error) {
      console.error('Error al crear pedido:', error);
      setError(error.message || 'Error al procesar el pedido. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === 'descuento10' || promoCode.toUpperCase() === 'TRABAJOFINAL') {
      setDiscount(subtotal * 0.1);
      setSuccess('¡Código aplicado! 10% de descuento');
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError('Código promocional no válido');
      setTimeout(() => setError(''), 3000);
      setDiscount(0);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <div className="cart-header">
          <h1><FaShoppingCart /> Mi Carrito</h1>
        </div>
        <div className="empty-cart">
          <div className="empty-cart-icon">
            <FaShoppingCart />
          </div>
          <h2>Tu carrito está vacío</h2>
          <p>Parece que aún no has añadido productos a tu carrito</p>
          <button onClick={() => navigate('/productos')} className="btn-shop">
            Ver Productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1><FaShoppingCart /> Mi Carrito</h1>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          <div className="cart-items-header">
            <span className="item-info">Producto</span>
            <span className="item-price">Precio</span>
            <span className="item-quantity">Cantidad</span>
            <span className="item-total">Total</span>
            <span className="item-actions"></span>
          </div>

          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="item-info">
                <div className="item-image">
                  <img 
                    src={item.imagen
                      ? (item.imagen.startsWith('http') 
                          ? item.imagen 
                          : `/img/${item.imagen}`)
                      : 'https://via.placeholder.com/80'}
                    alt={item.nombre}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/80';
                    }}
                  />
                </div>
                <div className="item-details">
                  <h3>{item.nombre}</h3>
                  <p>{item.descripcion?.substring(0, 60)}{item.descripcion?.length > 60 ? '...' : ''}</p>
                </div>
              </div>

              <div className="item-price">
                €{(item.precio || 0).toFixed(2)}
              </div>

              <div className="item-quantity">
                <button 
                  onClick={() => updateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))}
                  className="quantity-btn"
                >
                  <FaMinus />
                </button>
                <span>{item.quantity || 1}</span>
                <button 
                  onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                  className="quantity-btn"
                >
                  <FaPlus />
                </button>
              </div>

              <div className="item-total">
                €{((item.precio || 0) * (item.quantity || 1)).toFixed(2)}
              </div>

              <div className="item-actions">
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="remove-btn"
                  aria-label="Eliminar producto"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Resumen del Pedido</h2>
          
          <div className="promo-code">
            <div className="promo-input">
              <FaTag className="promo-icon" />
              <input
                type="text"
                placeholder="Código promocional"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
            </div>
            <button onClick={applyPromoCode} className="promo-btn">Aplicar</button>
          </div>
          
          <div className="summary-items">
            <div className="summary-item">
              <span>Subtotal</span>
              <span>€{subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <span>Envío</span>
              <span>€{shipping.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="summary-item discount">
                <span>Descuento (10%)</span>
                <span>-€{discount.toFixed(2)}</span>
              </div>
            )}
            <div className="summary-total">
              <span>Total</span>
              <span>€{total.toFixed(2)}</span>
            </div>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <button 
            className="checkout-btn" 
            disabled={loading}
            onClick={handlePagarPedido}
          >
            {loading ? 'Procesando...' : 'Finalizar Compra'}
          </button>
          
          <button 
            className="continue-shopping" 
            onClick={() => navigate('/productos')}
          >
            Seguir comprando
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;