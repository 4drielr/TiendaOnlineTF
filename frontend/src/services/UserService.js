import axios from 'axios';
import AuthService from './AuthService';

// URL relativa para que Nginx redireccione correctamente
const API_URL = '/api';

class UserService {
  getAllUsers() {
    return axios.get(`${API_URL}/api/usuarios`, {
      headers: AuthService.getAuthHeader()
    });
  }

  getUserById(id) {
    return axios.get(`${API_URL}/api/usuarios/${id}`, {
      headers: AuthService.getAuthHeader()
    });
  }

  updateUser(id, userData) {
    return axios.put(`${API_URL}/api/usuarios/${id}`, userData, {
      headers: AuthService.getAuthHeader()
    });
  }

  deleteUser(id) {
    return axios.delete(`${API_URL}/api/usuarios/${id}`, {
      headers: AuthService.getAuthHeader()
    });
  }
}

export default new UserService();
