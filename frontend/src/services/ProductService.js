import axios from 'axios';
import AuthService from './AuthService';

const API_URL = 'http://20.199.88.134:8080';

class ProductService {
  getAllProducts() {
    return axios.get(`${API_URL}/api/productos`);
  }

  getProductById(id) {
    return axios.get(`${API_URL}/api/productos/${id}`);
  }

  // Métodos adicionales que requieren autenticación
  createProduct(product) {
    return axios.post(`${API_URL}/api/productos`, product, {
      headers: AuthService.getAuthHeader()
    });
  }

  updateProduct(id, product) {
    return axios.put(`${API_URL}/api/productos/${id}`, product, {
      headers: AuthService.getAuthHeader()
    });
  }

  deleteProduct(id) {
    return axios.delete(`${API_URL}/api/productos/${id}`, {
      headers: AuthService.getAuthHeader()
    });
  }
}

export default new ProductService();