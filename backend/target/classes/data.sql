-- Insertar usuarios predefinidos
    -- Contraseñas encriptadas con BCrypt
    -- Usuario normal: email=usuario@tienda.com, password=usuario123
    -- Administrador: email=admin@tienda.com, password=admin123
    INSERT INTO usuarios (id, email, password, nombre, apellidos, direccion, provincia, rol) VALUES
    (1, 'admin@tienda.com', '$2a$10$xWEP0Cq.zASDMjNFxGNOXeEHs.fkQW6hZUyXLMoQMoqsUxW4OcyHG', 'Administrador', 'Sistema', 'Calle Admin 123', 'Madrid', 'admin'),
    (2, 'usuario@tienda.com', '$2a$10$3vEJ0Wl01zRERqXK2qKrA.Hl5wNXp6O5lALYIaFswMhPQrJVTXEJW', 'Usuario', 'Predeterminado', 'Calle Usuario 456', 'Barcelona', 'user');

    -- Insertar productos de ejemplo
    INSERT INTO productos (id, nombre, descripcion, precio, imagen) VALUES
    (1, 'Laptop Gaming', 'Laptop gaming de alta gama con RTX 3080', 1499.99, 'laptop.jpg'),
    (2, 'Smartphone Pro', 'Smartphone con cámara profesional y 5G', 899.99, 'smartphone.jpg'),
    (3, 'Tablet Ultra', 'Tablet con pantalla 4K y lápiz digital', 599.99, 'tablet.jpg'),
    (4, 'Auriculares Bluetooth', 'Auriculares inalámbricos con cancelación de ruido', 199.99, 'auriculares.jpg'),
    (5, 'Monitor Gaming', 'Monitor 27" 144Hz QHD', 299.99, 'monitor.jpg');

    -- Insertar pedidos de ejemplo
    INSERT INTO pedidos (id, fecha_pedido, estado, total, usuario_id, direccion_envio, metodo_pago) VALUES
    (1, '2025-04-25', 'COMPLETADO', 1499.99, 2, 'Calle Usuario 456, Barcelona', 'Tarjeta de crédito'),
    (2, '2025-04-28', 'EN_PROCESO', 1099.98, 2, 'Calle Usuario 456, Barcelona', 'PayPal');

    -- Insertar detalles de pedidos
    INSERT INTO detalles_pedido (id, cantidad, precio_unitario, subtotal, pedido_id, producto_id) VALUES
    (1, 1, 1499.99, 1499.99, 1, 1),
    (2, 1, 899.99, 899.99, 2, 2),
    (3, 1, 199.99, 199.99, 2, 4);

    -- Insertar incidencias de ejemplo
    INSERT INTO soporte_tecnico (id, asunto, descripcion, fecha_creacion, estado, usuario_id) VALUES
    (1, 'Problema con laptop', 'La laptop no enciende correctamente', '2025-04-26', 'abierto', 2),
    (2, 'Consulta sobre garantía', 'Quisiera saber cuánto tiempo de garantía tiene el smartphone', '2025-04-29', 'cerrado', 2);