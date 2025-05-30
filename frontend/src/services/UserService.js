import axios from 'axios';
import AuthService from './AuthService';

const API_URL = 'http://20.199.88.134:8080';

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
