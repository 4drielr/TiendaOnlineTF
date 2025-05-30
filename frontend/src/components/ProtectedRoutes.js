import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

// Componente que protege rutas que necesitan login
export const ProtectedRoute = ({ children }) => {
  const isAuthenticated = AuthService.isAuthenticated();
  
  if (!isAuthenticated) {
    // Si no está logueado, lo mando al login
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Componente que protege rutas solo para admin
export const AdminRoute = ({ children }) => {
  const currentUser = AuthService.getCurrentUser();
  const isAuthenticated = AuthService.isAuthenticated();
  
  if (!isAuthenticated) {
    // Si no está logueado, lo mando al login
    return <Navigate to="/login" />;
  }
  
  if (currentUser.role !== 'admin') {
    // Si no es admin, lo mando al perfil normal
    return <Navigate to="/perfil" />;
  }
  
  return children;
};