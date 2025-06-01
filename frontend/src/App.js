import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './styles/main.css';
import './styles/auth.css';
import './styles/profile.css';
import './styles/admin.css';
import './styles/checkout.css';
import './styles/orders.css';
import { CartProvider } from './context/CartContext';
import AuthService from './services/AuthService';


import Header from './components/Header';
import Hero from './components/Hero';
import FeaturedProducts from './components/FeaturedProducts';
import Values from './components/Values';
import Gallery from './components/Gallery';
import Testimonials from './components/Testimonials';
import Features from './components/Features';
import Footer from './components/Footer';
import Catalog from './components/Catalog';
import Checkout from './components/Checkout';
import Login from './components/Login';
import Register from './components/Register';
// El componente Contacto ya está importado correctamente en la línea 36
import UserProfile from './components/UserProfile';
import AdminProfile from './components/AdminProfile';
import EditProfile from './components/EditProfile';
import EventosReserva from './components/EventosReserva';
import MisPedidos from './components/MisPedidos';
import DetallePedido from './components/DetallePedido';
import MisEventos from './components/MisEventos';
import AdminEventos from './components/AdminEventos';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoutes';

import Contacto from './components/Contacto';
import Nosotros from './components/Nosotros';


import UserManagement from './components/admin/UserManagement';
import ProductManagement from './components/admin/ProductManagement';
import GestionPedidos from './components/admin/OrderManagement';
import GestionEventos from './components/admin/EventManagement';


function App() {
  return (
    <Router>
      <CartProvider>
        <div className="App">
          <Header />
          <main>
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <FeaturedProducts />
                <Features />
                <Values />
                <Gallery />
                <Testimonials />
              </>
            } />
            <Route path="/productos" element={<Catalog />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/eventos" element={<EventosReserva />} />
            
            {/* Rutas protegidas */}
            <Route path="/perfil" element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } />
            <Route path="/editar-perfil" element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <AdminRoute>
                <AdminProfile />
              </AdminRoute>
            } />
            <Route path="/mis-pedidos" element={
              <ProtectedRoute>
                <MisPedidos />
              </ProtectedRoute>
            } />
            <Route path="/pedido/:id" element={
              <ProtectedRoute>
                <DetallePedido />
              </ProtectedRoute>
            } />
            <Route path="/mis-eventos" element={
              <ProtectedRoute>
                <MisEventos />
              </ProtectedRoute>
            } />
            
            
            {/* Rutas de administración */}
            <Route path="/admin/usuarios" element={
              <AdminRoute>
                <UserManagement />
              </AdminRoute>
            } />
            <Route path="/admin/productos" element={
              <AdminRoute>
                <ProductManagement />
              </AdminRoute>
            } />
            <Route path="/admin/pedidos" element={
              <AdminRoute>
                <GestionPedidos />
              </AdminRoute>
            } />
            <Route path="/admin/eventos" element={
              <AdminRoute>
                <AdminEventos />
              </AdminRoute>
            } />
          </Routes>
        </main>
          <Footer />
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;
