import React from 'react';
import { Link } from 'react-router-dom';

const Features = () => {
  const features = [
    {
      id: 1,
      icon: '🎂',
      title: 'Cumpleaños Temáticos',
      description: 'Creamos la fiesta perfecta con la temática que más le guste a tu hijo/a. Desde superhéroes hasta princesas, hacemos realidad su sueño.',
      link: '/eventos'
    },
    {
      id: 2,
      icon: '🎭',
      title: 'Animación Profesional',
      description: 'Nuestro equipo de animadores hará que los niños disfruten con juegos, concursos y actividades adaptadas a su edad.',
      link: '/productos'
    },
    {
      id: 3,
      icon: '🎈',
      title: 'Decoración Personalizada',
      description: 'Transformamos cualquier espacio con decoraciones únicas y personalizadas que harán que tu evento sea inolvidable.',
      link: '/productos'
    },
    {
      id: 4,
      icon: '🍰',
      title: 'Mesas Dulces',
      description: 'Deliciosas mesas de dulces y snacks temáticos que encantarán tanto a niños como a adultos.',
      link: '/productos'
    },
    {
      id: 5,
      icon: '📸',
      title: 'Fotógrafos Profesionales',
      description: 'Capturamos cada momento especial para que puedas recordarlo siempre con fotografías de alta calidad.',
      link: '/eventos'
    },
    {
      id: 6,
      icon: '🎁',
      title: 'Detalles y Recuerdos',
      description: 'Ofrecemos una amplia variedad de detalles y recuerdos personalizados para los invitados.',
      link: '/productos'
    }
  ];

  return (
    <section className="features-section">
      <div className="container">
        <h2 className="section-title">Nuestros Servicios</h2>
        <p className="section-subtitle">Todo lo que necesitas para crear eventos memorables</p>
        
        <div className="features-grid">
          {features.map(feature => (
            <div key={feature.id} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <Link to={feature.link} className="feature-link">
                Saber más <span className="arrow">→</span>
              </Link>
            </div>
          ))}
        </div>
        
        <div className="features-cta">
          <h3>¿Tienes alguna idea especial?</h3>
          <p>Estamos abiertos a personalizar nuestros servicios según tus necesidades</p>
          <Link to="/contacto" className="btn btn-outline">Contáctanos</Link>
        </div>
      </div>
    </section>
  );
};

export default Features;
