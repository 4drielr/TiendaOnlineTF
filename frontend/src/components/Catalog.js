import React, { useState, useEffect } from 'react';
import ProductService from '../services/ProductService';
import { useCart } from '../context/CartContext';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationProduct, setNotificationProduct] = useState(null);
  const { addToCart } = useCart();

  // Categorías de ejemplo (deberían venir del backend idealmente)
  const categories = [
    { id: 'all', name: 'Todos los productos' },
    { id: 'decoracion', name: 'Decoración' },
    { id: 'recuerdos', name: 'Recuerdos' },
    { id: 'juguetes', name: 'Juguetes' },
    { id: 'papeleria', name: 'Papelería' }
  ];

  useEffect(() => {
    setLoading(true);
    ProductService.getAllProducts()
      .then(response => {
        console.log('Productos recibidos:', response.data);
        // Asignar categorías temporales para el ejemplo
        const productsWithCategories = response.data.map((product, index) => {
          // Asignar categorías de forma aleatoria para este ejemplo
          const categoryIds = ['decoracion', 'recuerdos', 'juguetes', 'papeleria'];
          const randomCategory = categoryIds[index % categoryIds.length];
          return {
            ...product,
            category: randomCategory
          };
        });
        setProducts(productsWithCategories);
        setFilteredProducts(productsWithCategories);
        setLoading(false);
      })
      .catch(err => {
        setError('Error al cargar los productos. Por favor, intenta de nuevo más tarde.');
        setLoading(false);
        console.error('Error cargando productos:', err);
      });
  }, []);

  useEffect(() => {
    // Filtrar productos basado en búsqueda y categoría
    let result = [...products];
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      result = result.filter(product => 
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    // Ordenar productos
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.precio - b.precio);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.precio - a.precio);
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.nombre.localeCompare(b.nombre));
    }
    
    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, sortBy, products]);

  const handleAddToCart = (product) => {
    addToCart(product);
    setNotificationProduct(product);
    setShowNotification(true);
    
    // Ocultar la notificación después de 3 segundos
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Cargando productos...</p>
    </div>
  );
  
  if (error) return <div className="error-message">{error}</div>;

  return (
    <section className="catalog-section">
      <div className="container">
        <h2 className="section-title">Catálogo de Productos</h2>
        <p className="section-subtitle">Descubre todo lo que necesitas para tu evento</p>
        
        {/* Barra de búsqueda y filtros */}
        <div className="catalog-filters">
          <div className="search-container">
            <input 
              type="text" 
              placeholder="Buscar productos..." 
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-button">
              <i className="fas fa-search">🔍</i>
            </button>
          </div>
          
          <div className="filter-container">
            <div className="filter-group">
              <label>Categoría:</label>
              <select 
                className="filter-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>Ordenar por:</label>
              <select 
                className="filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Relevancia</option>
                <option value="price-asc">Precio: menor a mayor</option>
                <option value="price-desc">Precio: mayor a menor</option>
                <option value="name">Nombre</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Resultados */}
        <div className="catalog-results">
          <p className="results-count">{filteredProducts.length} productos encontrados</p>
        </div>
        
        {/* Grid de productos */}
        {filteredProducts.length === 0 ? (
          <div className="no-results">
            <p>No se encontraron productos que coincidan con tu búsqueda.</p>
            <button 
              className="btn btn-outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSortBy('default');
              }}
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="catalog-grid">
            {filteredProducts.map((product) => (
              <div key={product.id} className="catalog-product-card">
                <div className="product-image-container">
                  <img 
                    src={product.imagen
                      ? (product.imagen.startsWith('http') 
                          ? product.imagen 
                          : `/img/${product.imagen}`)
                      : 'https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg'}
                    alt={product.nombre} 
                    className="product-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg';
                    }}
                  />
                </div>
                <div className="product-details">
                  <h3 className="product-name">{product.nombre}</h3>
                  <p className="product-description">{product.descripcion}</p>
                  <div className="product-footer">
                    <span className="product-price">€{product.precio}</span>
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(product)}
                    >
                      <span className="btn-text">Añadir</span>
                      <span className="btn-icon">🛒</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Notificación de producto añadido */}
        {showNotification && notificationProduct && (
          <div className="cart-notification">
            <div className="notification-content">
              <div className="notification-icon">✓</div>
              <div className="notification-text">
                <p><strong>{notificationProduct.nombre}</strong> se ha añadido al carrito</p>
              </div>
              <button className="notification-close" onClick={() => setShowNotification(false)}>×</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Catalog;