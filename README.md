# 🛒 Tienda Online - Proyecto Full Stack

Aplicación web completa de tienda online desarrollada con **React (frontend)** y **Spring Boot (backend)** con **MySQL** como base de datos.

## ✅ Estado actual del proyecto

- La aplicación **ya funciona correctamente con base de datos**.
- Pendiente de revisión la funcionalidad del formulario **"Contáctanos"**.
- La interfaz ha sido **levemente mejorada**, pero se planean más cambios visuales.
- Funcionalidades como login, pedidos, gestión de productos y usuarios ya están **operativas**.

---

## 👥 Usuarios predefinidos para pruebas

| Rol     | Email           | Contraseña |
|----------|------------------|------------|
| Admin    | asd@123.com      | 123        |
| Usuario  | usuario@mail.com | 123        |

> ⚠️ Nota: tras iniciar sesión, **puede ser necesario recargar la página manualmente** para que se muestre correctamente el perfil de usuario y habilitar sus funcionalidades. Este comportamiento está pendiente de revisión.

---

## 🧰 Tecnologías utilizadas

- **Frontend:** React, React Router, Axios
- **Backend:** Spring Boot 3, Spring Security, JWT, Hibernate (JPA)
- **Base de datos:** MySQL
- **Servidor de despliegue:** NGINX en máquina virtual (Azure)

---

## 🔧 Funcionalidades implementadas

- ✅ Registro e inicio de sesión con JWT
- ✅ Diferenciación de roles (admin / usuario)
- ✅ Gestión de productos (crear, editar, eliminar)
- ✅ Creación y gestión de pedidos
- ✅ Visualización del historial de pedidos
- ✅ Gestión de soporte técnico
- ✅ Edición de perfil y contraseña
- ✅ Sistema de reservas de eventos

---

## 🔄 Funcionalidades pendientes

- 🔧 Validación avanzada de contraseñas
- 🔧 Mejoras de diseño e interfaz (UI/UX)
- 🔧 Añadir imágenes faltantes y ajustar las existentes
- 🔧 Mostrar los **nombres** de productos en pedidos (actualmente se muestran los IDs)
- 🔧 Agregar rutas o enlaces de destino a todos los botones
- 🔧 Reparar el formulario de contacto
- 🔧 Solucionar el refresco manual tras el login
