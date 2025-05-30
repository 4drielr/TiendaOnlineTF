import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-container">
          <div className="footer-section">
            <h3 className="footer-logo">Niños y celebraciones</h3>
            <p>Organizamos tus eventos con la mejor calidad y atención al detalle.</p>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FaFacebook />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FaInstagram />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FaTwitter />
              </a>
            </div>
          </div>
          
          <div className="footer-section">
            <h3>Enlaces</h3>
            <ul className="footer-links">
              <li className="footer-link"><Link to="/">Inicio</Link></li>
              <li className="footer-link"><Link to="/productos">Ver Opciones</Link></li>
              <li className="footer-link"><Link to="/nosotros">Nosotros</Link></li>
              <li className="footer-link"><Link to="/contacto">Contacto</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Contacto</h3>
            <ul className="footer-links">
              <li className="footer-link">Teléfono: +123 456 7890</li>
              <li className="footer-link">Email: info@ninosycelebraciones.com</li>
              <li className="footer-link">Dirección: Calle Principal 123, Ciudad</li>
            </ul>
          </div>
        </div>
        
        <div className="copyright">
          <p>&copy; {new Date().getFullYear()} Niños y celebraciones. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;