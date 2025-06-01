import axios from 'axios';

// URL relativa para que Nginx redireccione correctamente
const API_URL = '/api';

class AuthService {
  login(email, password) {
    // Llamar siempre al backend para login
    return axios
      .post(`${API_URL}/api/auth/login`, { email, password })
      .then(response => {
        if (response.data && (response.data.token || response.data.accessToken)) {
          const userData = {
            email: response.data.email,
            name: response.data.nombre,
            // Guardar el rol como 'admin' o 'user' (sin prefijo)
            role: response.data.rol ? response.data.rol.toLowerCase() : 'user',
            id: response.data.id,
            direccion: response.data.direccion || '',
            provincia: response.data.provincia || '',
            token: response.data.token || response.data.accessToken || ''
          };
          localStorage.setItem('user', JSON.stringify(userData));
          return userData;
        }
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem('user');
  }

  register(email, password, name, lastName, address, province) {
    return axios.post(`${API_URL}/api/auth/registro`, {
      email,
      password,
      nombre: name,
      apellidos: lastName,
      direccion: address,
      provincia: province
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  isAuthenticated() {
    const user = this.getCurrentUser();
    return !!user;
  }

  getAuthHeader() {
    const user = this.getCurrentUser();
    if (user && user.token) {
      return { Authorization: 'Bearer ' + user.token };
    } else {
      return {};
    }
  }
}

export function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default new AuthService();