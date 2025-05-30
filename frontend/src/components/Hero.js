import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-background">
        <div className="hero-overlay"></div>
      </div>
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">Celebraciones Mágicas para Momentos Únicos</h1>
          <p className="hero-text">
            Creamos experiencias inolvidables para niños y familias. Eventos personalizados con atención en cada detalle para hacer de tu día especial un recuerdo que perdure para siempre.
          </p>
          <div className="hero-buttons">
            <Link to="/productos" className="btn btn-primary hero-btn">Ver Productos</Link>
            <Link to="/eventos" className="btn btn-outline hero-btn">Reservar Evento</Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat-item">
              <span className="hero-stat-number">500+</span>
              <span className="hero-stat-text">Eventos Realizados</span>
            </div>
            <div className="hero-stat-item">
              <span className="hero-stat-number">98%</span>
              <span className="hero-stat-text">Clientes Satisfechos</span>
            </div>
            <div className="hero-stat-item">
              <span className="hero-stat-number">15+</span>
              <span className="hero-stat-text">Años de Experiencia</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;