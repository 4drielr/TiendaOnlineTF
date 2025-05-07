package com.tiendaonline.backend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tiendaonline.backend.model.Usuario;
import com.tiendaonline.backend.repository.UsuarioRepository;
import com.tiendaonline.backend.request.UsuarioUpdateRequest;

// @CrossOrigin(origins = "http://20.199.88.134:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    // La lista de usuarios solo debe ser accesible para administradores
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("")
    public List<Usuario> getAllUsuarios() {
        return usuarioRepository.findAll();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getUsuarioById(@PathVariable Long id) {
        try {
            Optional<Usuario> usuario = usuarioRepository.findById(id);
            if (usuario.isPresent()) {
                return ResponseEntity.ok(usuario.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al obtener usuario: " + e.getMessage());
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUsuario(@PathVariable Long id, @RequestBody UsuarioUpdateRequest usuarioDetails) {
        try {
            Optional<Usuario> usuario = usuarioRepository.findById(id);
            if (usuario.isPresent()) {
                Usuario existingUsuario = usuario.get();
                
                // Actualizar campos si no están vacíos
                if (usuarioDetails.getNombre() != null) {
                    existingUsuario.setNombre(usuarioDetails.getNombre());
                }
                
                if (usuarioDetails.getApellidos() != null) {
                    existingUsuario.setApellidos(usuarioDetails.getApellidos());
                }
                
                if (usuarioDetails.getDireccion() != null) {
                    existingUsuario.setDireccion(usuarioDetails.getDireccion());
                }
                
                if (usuarioDetails.getProvincia() != null) {
                    existingUsuario.setProvincia(usuarioDetails.getProvincia());
                }
                
                // Solo actualizar la contraseña si se proporciona
                if (usuarioDetails.getPassword() != null && !usuarioDetails.getPassword().isEmpty()) {
                    existingUsuario.setPassword(passwordEncoder.encode(usuarioDetails.getPassword()));
                }
                
                // Solo los administradores pueden cambiar el rol
                if (usuarioDetails.getRol() != null) {
                    existingUsuario.setRol(usuarioDetails.getRol());
                }
                
                return ResponseEntity.ok(usuarioRepository.save(existingUsuario));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al actualizar usuario: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUsuario(@PathVariable Long id) {
        try {
            Optional<Usuario> usuario = usuarioRepository.findById(id);
            if (usuario.isPresent()) {
                usuarioRepository.delete(usuario.get());
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al eliminar usuario: " + e.getMessage());
        }
    }
}
