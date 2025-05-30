import React, { useState, useEffect } from 'react';
import UserService from '../../services/UserService';
import AuthService from '../../services/AuthService';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    direccion: '',
    provincia: '',
    rol: ''
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    setLoading(true);
    UserService.getAllUsers()
      .then(response => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Error al cargar los usuarios. Por favor, intenta de nuevo más tarde.');
        setLoading(false);
        console.error('Error cargando usuarios:', err);
      });
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      nombre: user.nombre || '',
      apellidos: user.apellidos || '',
      direccion: user.direccion || '',
      provincia: user.provincia || '',
      rol: user.rol || ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!editingUser) return;
    
    UserService.updateUser(editingUser.id, formData)
      .then(() => {
        setEditingUser(null);
        loadUsers();
      })
      .catch(err => {
        setError('Error al actualizar el usuario. Inténtalo de nuevo.');
        console.error('Error actualizando usuario:', err);
      });
  };

  const handleDelete = (userId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.')) {
      UserService.deleteUser(userId)
        .then(() => {
          loadUsers();
        })
        .catch(err => {
          setError('Error al eliminar el usuario. Inténtalo de nuevo.');
          console.error('Error eliminando usuario:', err);
        });
    }
  };

  const handleCancel = () => {
    setEditingUser(null);
  };

  if (loading && users.length === 0) return <div className="loading">Cargando usuarios...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-container">
      <h2 className="section-title">Gestión de Usuarios</h2>
      
      {editingUser ? (
        <div className="edit-form">
          <h3>Editar Usuario: {editingUser.email}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nombre:</label>
              <input 
                type="text" 
                name="nombre" 
                value={formData.nombre} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Apellidos:</label>
              <input 
                type="text" 
                name="apellidos" 
                value={formData.apellidos} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Dirección:</label>
              <input 
                type="text" 
                name="direccion" 
                value={formData.direccion} 
                onChange={handleChange} 
              />
            </div>
            <div className="form-group">
              <label>Provincia:</label>
              <input 
                type="text" 
                name="provincia" 
                value={formData.provincia} 
                onChange={handleChange} 
              />
            </div>
            <div className="form-group">
              <label>Rol:</label>
              <select 
                name="rol" 
                value={formData.rol} 
                onChange={handleChange} 
                required
              >
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">Guardar</button>
              <button type="button" className="btn-secondary" onClick={handleCancel}>Cancelar</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Nombre</th>
                <th>Apellidos</th>
                <th>Dirección</th>
                <th>Provincia</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>{user.nombre}</td>
                  <td>{user.apellidos}</td>
                  <td>{user.direccion}</td>
                  <td>{user.provincia}</td>
                  <td>{user.rol === 'admin' ? 'Administrador' : 'Usuario'}</td>
                  <td>
                    <button 
                      className="btn-edit" 
                      onClick={() => handleEdit(user)}
                    >
                      Editar
                    </button>
                    <button 
                      className="btn-delete" 
                      onClick={() => handleDelete(user.id)}
                      disabled={user.email === AuthService.getCurrentUser()?.email}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManagement;