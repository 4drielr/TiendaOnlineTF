-- Insertar usuarios predefinidos
INSERT INTO usuarios (email, password, nombre, apellidos, direccion, provincia, rol) VALUES
('admin@tiendaonline.com', '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbQGsMNd.n97GrxbEUi', 'Administrador', 'Sistema', 'Calle Admin 123', 'Madrid', 'admin'),
('user@tiendaonline.com', '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbQGsMNd.n97GrxbEUi', 'Usuario', 'Demo', 'Calle Usuario 456', 'Barcelona', 'user');

-- Insertar productos de ejemplo
INSERT INTO productos (nombre, descripcion, precio, imagen) VALUES
('Laptop Gaming', 'Laptop gaming de alta gama con RTX 3080', 1499.99, 'laptop.jpg'),
('Smartphone Pro', 'Smartphone con cámara profesional y 5G', 899.99, 'smartphone.jpg'),
('Tablet Ultra', 'Tablet con pantalla 4K y lápiz digital', 599.99, 'tablet.jpg'),
('Auriculares Bluetooth', 'Auriculares inalámbricos con cancelación de ruido', 199.99, 'auriculares.jpg'),
('Monitor Gaming', 'Monitor 27" 144Hz QHD', 299.99, 'monitor.jpg');