package com.tiendaonline.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

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
            Usuario usuario = usuarioRepository.findByEmail(loginRequest.getEmail())
                .orElse(null);
            System.out.println("Usuario encontrado: " + (usuario != null));
            if (usuario != null) {
                System.out.println("Password en BD: " + usuario.getPassword());
                System.out.println("Password introducido: " + loginRequest.getPassword());
                System.out.println("Password match: " + passwordEncoder.matches(loginRequest.getPassword(), usuario.getPassword()));
            }
            if (usuario == null) {
                return ResponseEntity.badRequest().body("Usuario no encontrado");
            }
            if (passwordEncoder.matches(loginRequest.getPassword(), usuario.getPassword())) {
                // Generar el token JWT
                String token = jwtUtil.generateToken(usuario.getEmail());
                // Construir respuesta con usuario y token
                Map<String, Object> response = new HashMap<>();
                response.put("id", usuario.getId());
                response.put("nombre", usuario.getNombre());
                response.put("apellidos", usuario.getApellidos());
                response.put("email", usuario.getEmail());
                response.put("direccion", usuario.getDireccion());
                response.put("provincia", usuario.getProvincia());
                response.put("rol", usuario.getRol());
                response.put("pedidos", usuario.getPedidos());
                response.put("solicitudesSoporte", usuario.getSolicitudesSoporte());
                response.put("token", token);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body("Contraseña incorrecta");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error en la autenticación: " + e.getMessage());
        }
    }

    @PostMapping("/registro")
    public ResponseEntity<?> registerUser(@RequestBody SignUpRequest signUpRequest) {
        try {
            if (usuarioRepository.existsByEmail(signUpRequest.getEmail())) {
                return ResponseEntity.badRequest().body("El email ya está registrado");
            }

            Usuario usuario = new Usuario(
                signUpRequest.getNombre(), 
                signUpRequest.getApellidos(), 
                signUpRequest.getEmail(), 
                passwordEncoder.encode(signUpRequest.getPassword())
            );

            if (signUpRequest.getDireccion() != null && !signUpRequest.getDireccion().isEmpty()) {
                usuario.setDireccion(signUpRequest.getDireccion());
            }
            
            if (signUpRequest.getProvincia() != null && !signUpRequest.getProvincia().isEmpty()) {
                usuario.setProvincia(signUpRequest.getProvincia());
            }

            usuario.setRol("user");
            usuarioRepository.save(usuario);

            return ResponseEntity.ok("Usuario registrado exitosamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error en el registro: " + e.getMessage());
        }
    }
}

class LoginRequest {
    private String email;
    private String password;

    // Getters y setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}

class SignUpRequest {
    private String nombre;
    private String apellidos;
    private String email;
    private String password;
    private String direccion;
    private String provincia;

    // Getters y setters
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getApellidos() { return apellidos; }
    public void setApellidos(String apellidos) { this.apellidos = apellidos; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }
    public String getProvincia() { return provincia; }
    public void setProvincia(String provincia) { this.provincia = provincia; }
}