import React from 'react';
import { Link } from 'react-router-dom';

const Gallery = () => {
  // Array de imágenes para la galería
  const galleryImages = [
    {
      id: 1,
      src: '/img/Cumplebetis.jpg',
      alt: 'Fiesta de cumpleaños con temática de fútbol',
      category: 'Cumpleaños'
    },
    {
      id: 2,
      src: '/img/David18.jpg',
      alt: 'Celebración de 18 años',
      category: 'Cumpleaños'
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1602631985686-1bb0e6a8bb5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      alt: 'Decoración para primera comunión',
      category: 'Comunión'
    },
    {
      id: 4,
      src: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=936&q=80',
      alt: 'Decoración de globos para cumpleaños',
      category: 'Decoración'
    },
    {
      id: 5,
      src: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      alt: 'Mesa de dulces para fiesta infantil',
      category: 'Comida'
    },
    {
      id: 6,
      src: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      alt: 'Animación con payasos para niños',
      category: 'Animación'
    }
  ];

  // Función para manejar errores de carga de imágenes
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://png.pngtree.com/png-vector/20201224/ourlarge/pngtree-corporate-business-professional-team-png-image_2620011.jpg';
  };

  return (
    <section className="gallery-section">
      <div className="container">
        <h2 className="section-title">Nuestra Especialidad</h2>
        <p className="section-subtitle">Deja en nuestras manos la creación de recuerdos inolvidables para tus eventos especiales</p>
        
        <div className="gallery-grid">
          {galleryImages.map((image) => (
            <div key={image.id} className="gallery-item">
              <img 
                src={image.src} 
                alt={image.alt} 
                className="gallery-img" 
                onError={handleImageError}
              />
              <div className="gallery-overlay">
              </div>
            </div>
          ))}
        </div>
        
        <div className="gallery-cta">
          <h3>Crea momentos mágicos con nosotros</h3>
          <p>Nuestro equipo de profesionales está listo para hacer de tu evento algo único</p>
          <Link to="/eventos" className="btn btn-primary gallery-btn">Reservar mi evento</Link>
        </div>
      </div>
    </section>
  );
};

export default Gallery;