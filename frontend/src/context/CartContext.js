import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../services/AuthService';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated());
  const [currentUserId, setCurrentUserId] = useState(AuthService.getCurrentUser()?.id || 'guest');

  // Verificar autenticación cuando cambia
  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(AuthService.isAuthenticated());
      setCurrentUserId(AuthService.getCurrentUser()?.id || 'guest');
    };
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  // Cargar carrito desde localStorage al iniciar o al cambiar de usuario
  useEffect(() => {
    const user = AuthService.getCurrentUser();
    const userId = user ? user.id || user.email : 'guest';
    setCurrentUserId(userId);
    const storedCart = localStorage.getItem(`cart_${userId}`);
    if (storedCart) {
      // Normaliza los productos para asegurar que tienen 'precio' y 'quantity'
      const parsed = JSON.parse(storedCart).map(item => ({
        ...item,
        precio: item.precio !== undefined ? item.precio : item.price,
        quantity: item.quantity !== undefined ? item.quantity : (item.cantidad !== undefined ? item.cantidad : 1)
      }));
      setCartItems(parsed);
    } else {
      setCartItems([]);
    }
  }, [isAuthenticated, currentUserId]);

  // Actualizar localStorage cuando cambia el carrito
  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem(`cart_${currentUserId}`, JSON.stringify(cartItems));
    }
    calculateTotal();
  }, [cartItems, currentUserId]);

  // Limpiar carrito y localStorage al cerrar sesión o cambiar de usuario
  const clearCart = () => {
    setCartItems([]);
    if (currentUserId) {
      localStorage.removeItem(`cart_${currentUserId}`);
    }
  };

  // Calcular el total del carrito
  const calculateTotal = () => {
    const newTotal = cartItems.reduce(
      (sum, item) => sum + (Number(item.precio) || 0) * (item.quantity || 1),
      0
    );
    setTotal(newTotal);
  };

  // Añadir producto al carrito
  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      const precio = product.precio !== undefined ? product.precio : product.price;
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1, precio }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1, precio }];
      }
    });
  };

  // Eliminar producto del carrito
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // Actualizar cantidad de un producto
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        total,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount: cartItems.reduce((count, item) => count + item.quantity, 0)
      }}
    >
      {children}
    </CartContext.Provider>
  );
};