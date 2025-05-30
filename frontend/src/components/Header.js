import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaBars } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import AuthService from '../services/AuthService';

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuth = () => {
      const user = AuthService.getCurrentUser();
      if (user && user.token) {
        setIsAuthenticated(true);
        setUsername(user.name || user.email);
      } else {
        setIsAuthenticated(false);
        setUsername('');
      }
    };
    
    checkAuth();
    // Verificar el estado de autenticación cuando cambia el almacenamiento local
    window.addEventListener('storage', checkAuth);
    window.addEventListener('userChanged', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('userChanged', checkAuth);
    };
  }, []);
  
  const handleLogout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
    setUsername('');
    navigate('/');
  };
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Cerrar menú cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      const nav = document.querySelector('nav');
      const hamburger = document.querySelector('.hamburger-menu');
      
      if (menuOpen && nav && !nav.contains(event.target) && !hamburger.contains(event.target)) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo">Niños y celebraciones</Link>
        
        <div className={`hamburger-menu ${menuOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        
        <nav>
          <ul className={`nav-menu ${menuOpen ? 'active' : ''}`}>
            <li className="nav-item">
              <Link to="/" className="nav-link">Inicio</Link>
            </li>
            <li className="nav-item">
              <Link to="/productos" className="nav-link">Ver Opciones</Link>
            </li>
            <li className="nav-item">
              <Link to="/nosotros" className="nav-link">Nosotros</Link>
            </li>
            <li className="nav-item">
              <Link to="/contacto" className="nav-link">Contacto</Link>
            </li>
            <li className="nav-item">
              <Link to="/checkout" className="nav-link cart-icon">
                <FaShoppingCart />
                {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
              </Link>
            </li>
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link to={AuthService.getCurrentUser()?.role === 'admin' ? '/admin' : '/perfil'} className="nav-link user-info">
                    <FaUser /> {username}
                  </Link>
                </li>
                <li className="nav-item">
                  <button onClick={handleLogout} className="nav-link logout-btn">
                    <FaSignOutAlt /> Salir
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link to="/login" className="nav-link">Iniciar Sesión</Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;