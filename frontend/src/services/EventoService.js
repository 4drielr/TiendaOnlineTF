import axios from 'axios';
import AuthService from './AuthService';

// URL relativa para que Nginx redireccione correctamente
const API_URL = '/api';

class EventoService {
  getAllEventos() {
    return axios.get(`${API_URL}/api/eventos`, {
      headers: AuthService.getAuthHeader()
    });
  }
  
  getAllEventosAdmin() {
    return axios.get(`${API_URL}/api/eventos/admin`, {
      headers: AuthService.getAuthHeader()
    });
  }

  getEventoById(id) {
    return axios.get(`${API_URL}/api/eventos/${id}`, {
      headers: AuthService.getAuthHeader()
    });
  }

  getEventosByUsuario(usuarioId) {
    return axios.get(`${API_URL}/api/eventos/usuario/${usuarioId}`, {
      headers: AuthService.getAuthHeader()
    });
  }

  getEventosByTipo(tipo) {
    return axios.get(`${API_URL}/api/eventos/tipos/${tipo}`, {
      headers: AuthService.getAuthHeader()
    });
  }

  createEvento(eventoData) {
    return axios.post(`${API_URL}/api/eventos`, eventoData, {
      headers: AuthService.getAuthHeader()
    });
  }

  updateEvento(id, eventoData) {
    return axios.put(`${API_URL}/api/eventos/${id}`, eventoData, {
      headers: AuthService.getAuthHeader()
    });
  }

  deleteEvento(id) {
    return axios.delete(`${API_URL}/api/eventos/${id}`, {
      headers: AuthService.getAuthHeader()
    });
  }

  updateEstadoEvento(id, estado) {
    return axios.put(`${API_URL}/api/eventos/${id}/estado`, estado, {
      headers: {
        ...AuthService.getAuthHeader(),
        'Content-Type': 'text/plain'
      }
    });
  }
}

export default new EventoService();
