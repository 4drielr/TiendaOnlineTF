package com.tiendaonline.backend.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tiendaonline.backend.dto.LoginRequest;
import com.tiendaonline.backend.dto.RegisterRequest;
import com.tiendaonline.backend.model.Usuario;
import com.tiendaonline.backend.repository.UsuarioRepository;
import com.tiendaonline.backend.security.JwtUtil;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    UsuarioRepository usuarioRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("Login attempt: " + loginRequest.getEmail());
            
            // Verificar si el usuario existe
            if (loginRequest.getEmail() == null || loginRequest.getEmail().isEmpty()) {
                return ResponseEntity.badRequest().body("Email no proporcionado");
            }
            
            Usuario usuario = usuarioRepository.findByEmail(loginRequest.getEmail()).orElse(null);
            
            if (usuario == null) {
                System.out.println("Usuario no encontrado: " + loginRequest.getEmail());
                return ResponseEntity.badRequest().body("Usuario no encontrado");
            }
            
            System.out.println("Usuario encontrado: " + usuario.getEmail());
            System.out.println("Password hash en BD: " + usuario.getPassword());
            
            // Verificar contraseña
            if (passwordEncoder.matches(loginRequest.getPassword(), usuario.getPassword())) {
                System.out.println("Contraseña correcta para: " + loginRequest.getEmail());
                
                // Generar token JWT
                String jwt = jwtUtil.generateToken(usuario.getEmail());
                
                // Crear respuesta con datos del usuario y token
                Map<String, Object> response = new HashMap<>();
                response.put("token", jwt);
                response.put("id", usuario.getId());
                response.put("email", usuario.getEmail());
                response.put("nombre", usuario.getNombre());
                response.put("apellidos", usuario.getApellidos());
                response.put("rol", usuario.getRol());
                response.put("direccion", usuario.getDireccion());
                response.put("provincia", usuario.getProvincia());
                
                return ResponseEntity.ok(response);
            } else {
                System.out.println("Contraseña incorrecta para: " + loginRequest.getEmail());
                return ResponseEntity.badRequest().body("Credenciales incorrectas");
            }
        } catch (Exception e) {
            System.err.println("Error en autenticación: " + e.getMessage());
            return ResponseEntity.badRequest().body("Error en la autenticación");
        }
    }

    @PostMapping("/registro")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        try {
            // Validar datos de entrada
            if (registerRequest.getEmail() == null || registerRequest.getEmail().isEmpty()) {
                return ResponseEntity.badRequest().body("El email es obligatorio");
            }
            
            if (registerRequest.getPassword() == null || registerRequest.getPassword().isEmpty()) {
                return ResponseEntity.badRequest().body("La contraseña es obligatoria");
            }
            
            // Verificar si el email ya está en uso
            if (usuarioRepository.existsByEmail(registerRequest.getEmail())) {
                return ResponseEntity.badRequest().body("El email ya está registrado");
            }
            
            // Crear nuevo usuario
            Usuario usuario = new Usuario();
            usuario.setEmail(registerRequest.getEmail());
            usuario.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
            usuario.setNombre(registerRequest.getNombre() != null ? registerRequest.getNombre() : "");
            usuario.setApellidos(registerRequest.getApellidos() != null ? registerRequest.getApellidos() : "");
            usuario.setDireccion(registerRequest.getDireccion() != null ? registerRequest.getDireccion() : "");
            usuario.setProvincia(registerRequest.getProvincia() != null ? registerRequest.getProvincia() : "");
            usuario.setRol("user"); // Por defecto, todos los nuevos usuarios son 'user'
            
            usuarioRepository.save(usuario);
            
            // Generar token JWT para inicio de sesión automático
            String jwt = jwtUtil.generateToken(usuario.getEmail());
            
            // Crear respuesta con datos del usuario y token
            Map<String, Object> response = new HashMap<>();
            response.put("token", jwt);
            response.put("id", usuario.getId());
            response.put("email", usuario.getEmail());
            response.put("nombre", usuario.getNombre());
            response.put("apellidos", usuario.getApellidos());
            response.put("rol", usuario.getRol());
            response.put("direccion", usuario.getDireccion());
            response.put("provincia", usuario.getProvincia());
            response.put("mensaje", "Usuario registrado exitosamente");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error en el registro: " + e.getMessage());
            if (e.getMessage() != null && e.getMessage().contains("constraint")) {
                return ResponseEntity.badRequest().body("Error al registrar usuario: el email ya está en uso");
            }
            return ResponseEntity.badRequest().body("Error al registrar usuario");
        }
    }
}