import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import ProductService from '../../services/ProductService';

const initialForm = {
  nombre: '',
  descripcion: '',
  precio: '',
  imagen: ''
};

const ProductManagement = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/login');
    }
    fetchProducts();
  }, [navigate]);

  const fetchProducts = () => {
    ProductService.getAllProducts()
      .then(res => setProducts(res.data))
      .catch(() => setError('Error al cargar productos.'));
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
      imagen: product.imagen || ''
    });
    setError(''); setSuccess('');
  };

  const handleDelete = (productId) => {
    if (!window.confirm('¿Seguro que deseas eliminar este producto?')) return;
    ProductService.deleteProduct(productId)
      .then(() => {
        setSuccess('Producto eliminado correctamente.');
        fetchProducts();
      })
      .catch(() => setError('Error al eliminar producto.'));
  };

  const handleAddProduct = () => {
    setEditingId(null);
    setForm(initialForm);
    setError(''); setSuccess('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    const payload = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      precio: parseFloat(form.precio),
      imagen: form.imagen
    };
    if (editingId) {
      ProductService.updateProduct(editingId, payload)
        .then(() => {
          setSuccess('Producto actualizado correctamente.');
          setEditingId(null);
          setForm(initialForm);
          fetchProducts();
        })
        .catch(() => setError('Error al actualizar producto.'));
    } else {
      ProductService.createProduct(payload)
        .then(() => {
          setSuccess('Producto añadido correctamente.');
          setForm(initialForm);
          fetchProducts();
        })
        .catch(() => setError('Error al añadir producto.'));
    }
  };

  return (
    <div className="admin-container">
      <h2>Gestionar productos</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <button className="btn-add" onClick={handleAddProduct}>Añadir Producto</button>
      <form className="admin-form" onSubmit={handleSubmit}>
        <input type="text" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" required />
        <input type="text" name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción" required />
        <input type="number" name="precio" value={form.precio} onChange={handleChange} placeholder="Precio" step="0.01" required />
        <input type="text" name="imagen" value={form.imagen} onChange={handleChange} placeholder="URL Imagen (opcional)" />
        <button type="submit" className="btn-primary">{editingId ? 'Actualizar' : 'Añadir'}</button>
        {editingId && <button type="button" className="btn-secondary" onClick={() => { setEditingId(null); setForm(initialForm); }}>Cancelar</button>}
      </form>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.nombre}</td>
              <td>{product.descripcion}</td>
              <td>€{product.precio.toFixed(2)}</td>
              <td>{product.imagen ? <img src={product.imagen} alt={product.nombre} width={50} /> : 'Sin imagen'}</td>
              <td>
                <button className="btn-edit" onClick={() => handleEdit(product)}>Editar</button>
                <button className="btn-delete" onClick={() => handleDelete(product.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductManagement;