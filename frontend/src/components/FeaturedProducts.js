import React from 'react';
import { Link } from 'react-router-dom';

const FeaturedProducts = () => {
  const products = [
    {
      id: 1,
      name: 'Chupetes Personalizados',
      description: 'Chupetes decorativos personalizados para anuncios especiales o recuerdos únicos para los más pequeños.',
      price: '15,90€',
      image: '/img/Chupetes.png',
      category: 'Recuerdos',
      badge: 'Popular'
    },
    {
      id: 2,
      name: 'Pack de Juguetes Infantiles',
      description: 'Colección de juguetes educativos para que los pequeños invitados disfruten durante y después del evento.',
      price: '24,50€',
      image: '/img/DiaDelPadre.jpg',
      category: 'Juguetes',
      badge: 'Nuevo'
    },
    {
      id: 3,
      name: 'Kit de Decoración Temática',
      description: 'Todo lo necesario para decorar una fiesta temática: globos, guirnaldas, centros de mesa y más.',
      price: '49,99€',
      image: 'https://images.unsplash.com/photo-1533294455009-a77b7557d979?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      category: 'Decoración',
      badge: 'Oferta'
    },
    {
      id: 4,
      name: 'Invitaciones Personalizadas',
      description: 'Elegantes invitaciones a medida con el diseño y texto que prefieras para tu evento especial.',
      price: '12,00€',
      image: 'https://images.unsplash.com/photo-1607145121003-c2e285e8aa6a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
      category: 'Papelería',
      badge: null
    }
  ];

  // Función para manejar errores de carga de imágenes
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://png.pngtree.com/png-vector/20201224/ourlarge/pngtree-corporate-business-professional-team-png-image_2620011.jpg';
  };

  return (
    <section className="featured-products-section">
      <div className="container">
        <h2 className="section-title">Productos Destacados</h2>
        <p className="section-subtitle">Descubre nuestra selección de artículos para hacer de tu evento algo especial</p>
        
        <div className="featured-products-grid">
          {products.map((product) => (
            <div key={product.id} className="featured-product-card">
              {product.badge && (
                <div className={`product-badge ${product.badge.toLowerCase()}`}>
                  {product.badge}
                </div>
              )}
              <div className="product-image-container">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="product-image"
                  onError={handleImageError}
                />
                <div className="product-category">{product.category}</div>
              </div>
              <div className="product-details">
                <h3 className="product-title">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-footer">
                  <span className="product-price">{product.price}</span>
                  <Link to="/productos" className="product-button">Ver detalles</Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="featured-products-cta">
          <Link to="/productos" className="btn btn-primary">Ver todos los productos</Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;