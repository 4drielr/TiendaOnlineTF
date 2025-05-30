import axios from 'axios';
import AuthService from './AuthService';

const API_URL = 'http://20.199.88.134:8080';

class PedidoService {
  // Obtener todos los pedidos (para administradores)
  getAllPedidos() {
    return axios.get(`${API_URL}/api/pedidos`, {
      headers: AuthService.getAuthHeader()
    });
  }

  // Obtener pedidos del usuario actual
  getUserPedidos() {
    // Usar endpoint correcto para obtener pedidos de usuario autenticado
    return axios.get(`${API_URL}/api/pedidos/mis-pedidos`, {
      headers: AuthService.getAuthHeader()
    });
  }

  // Obtener un pedido específico por ID
  getPedidoById(id) {
    return axios.get(`${API_URL}/api/pedidos/${id}`, {
      headers: AuthService.getAuthHeader()
    });
  }

  // Crear un nuevo pedido
  createPedido(pedido) {
    return axios.post(`${API_URL}/api/pedidos`, pedido, {
      headers: AuthService.getAuthHeader(),
    }).catch(error => {
      // Mostrar mensaje de error claro si lo hay
      if (error.response && error.response.data) {
        throw new Error(error.response.data);
      } else {
        throw error;
      }
    });
  }

  // Actualizar el estado de un pedido (para administradores)
  updatePedidoStatus(id, estado) {
    // Cambia PUT por PATCH para coincidir con el backend
    return axios.patch(`${API_URL}/api/pedidos/${id}/estado`, { estado }, {
      headers: AuthService.getAuthHeader()
    });
  }

  // Cancelar un pedido (para usuarios)
  cancelarPedido(id) {
    return axios.put(`${API_URL}/api/pedidos/${id}/cancelar`, {}, {
      headers: AuthService.getAuthHeader()
    });
  }
}

export default new PedidoService();
