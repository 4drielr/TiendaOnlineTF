import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import ProductoService from '../../services/ProductoService';
import '../../styles/datatable.css';

const ProductosDataTable = () => {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' });
  
  // Cargar productos
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        const response = await ProductoService.getAllProductos();
        setProductos(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar productos:', err);
        setError('No se pudieron cargar los productos');
        setLoading(false);
      }
    };
    
    fetchProductos();
  }, []);
  
  // Función para eliminar un producto
  const handleDelete = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede revertir",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        ProductoService.deleteProducto(id)
          .then(() => {
            setProductos(productos.filter(producto => producto.id !== id));
            Swal.fire(
              '¡Eliminado!',
              'El producto ha sido eliminado correctamente.',
              'success'
            );
          })
          .catch(err => {
            console.error('Error al eliminar producto:', err);
            Swal.fire(
              'Error',
              'No se pudo eliminar el producto.',
              'error'
            );
          });
      }
    });
  };
  
  // Función para editar un producto
  const handleEdit = (id) => {
    navigate(`/admin/productos/editar/${id}`);
  };
  
  // Función para ordenar productos
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  // Aplicar ordenamiento
  const sortedProductos = React.useMemo(() => {
    let sortableItems = [...productos];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [productos, sortConfig]);
  
  // Filtrar productos por término de búsqueda
  const filteredProductos = sortedProductos.filter(producto => 
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (producto.descripcion && producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProductos.slice(indexOfFirstItem, indexOfLastItem);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Obtener clases para el encabezado de la tabla según ordenamiento
  const getClassNamesFor = (name) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando productos...</p>
      </div>
    );
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  return (
    <div className="datatable-container">
      <div className="datatable-header">
        <h2>Gestión de Productos</h2>
        <div className="datatable-actions">
          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <select 
            value={itemsPerPage} 
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="items-per-page"
          >
            <option value={5}>5 por página</option>
            <option value={10}>10 por página</option>
            <option value={20}>20 por página</option>
            <option value={50}>50 por página</option>
          </select>
          <button 
            className="btn-add"
            onClick={() => navigate('/admin/productos/nuevo')}
          >
            Añadir Producto
          </button>
        </div>
      </div>
      
      <div className="datatable-wrapper">
        <table className="datatable">
          <thead>
            <tr>
              <th onClick={() => requestSort('id')} className={getClassNamesFor('id')}>
                ID
              </th>
              <th>Imagen</th>
              <th onClick={() => requestSort('nombre')} className={getClassNamesFor('nombre')}>
                Nombre
              </th>
              <th onClick={() => requestSort('categoria')} className={getClassNamesFor('categoria')}>
                Categoría
              </th>
              <th onClick={() => requestSort('precio')} className={getClassNamesFor('precio')}>
                Precio
              </th>
              <th onClick={() => requestSort('stock')} className={getClassNamesFor('stock')}>
                Stock
              </th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map(producto => (
                <tr key={producto.id}>
                  <td>{producto.id}</td>
                  <td>
                    <div className="product-image">
                      <img 
                        src={producto.imagen || 'https://via.placeholder.com/50'} 
                        alt={producto.nombre}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/50';
                        }}
                      />
                    </div>
                  </td>
                  <td>{producto.nombre}</td>
                  <td>{producto.categoria}</td>
                  <td>€{producto.precio?.toFixed(2)}</td>
                  <td>{producto.stock}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-edit"
                        onClick={() => handleEdit(producto.id)}
                      >
                        Editar
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDelete(producto.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">No se encontraron productos</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Paginación */}
      <div className="pagination">
        <button 
          onClick={() => paginate(1)} 
          disabled={currentPage === 1}
          className="pagination-button"
        >
          &laquo;
        </button>
        <button 
          onClick={() => paginate(currentPage - 1)} 
          disabled={currentPage === 1}
          className="pagination-button"
        >
          &lt;
        </button>
        
        <div className="pagination-info">
          Página {currentPage} de {Math.ceil(filteredProductos.length / itemsPerPage)}
        </div>
        
        <button 
          onClick={() => paginate(currentPage + 1)} 
          disabled={currentPage === Math.ceil(filteredProductos.length / itemsPerPage)}
          className="pagination-button"
        >
          &gt;
        </button>
        <button 
          onClick={() => paginate(Math.ceil(filteredProductos.length / itemsPerPage))} 
          disabled={currentPage === Math.ceil(filteredProductos.length / itemsPerPage)}
          className="pagination-button"
        >
          &raquo;
        </button>
      </div>
      
      <div className="datatable-footer">
        <div className="datatable-info">
          Mostrando {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredProductos.length)} de {filteredProductos.length} productos
        </div>
      </div>
    </div>
  );
};

export default ProductosDataTable;
