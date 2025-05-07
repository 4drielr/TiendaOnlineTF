package com.tiendaonline.backend.controller;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tiendaonline.backend.model.SoporteTecnico;
import com.tiendaonline.backend.model.Usuario;
import com.tiendaonline.backend.repository.SoporteTecnicoRepository;
import com.tiendaonline.backend.repository.UsuarioRepository;
import com.tiendaonline.backend.security.UserPrincipal;

//@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/soporte")
public class SoporteTecnicoController {

    @Autowired
    private SoporteTecnicoRepository soporteTecnicoRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    // Obtener todas las solicitudes de soporte (solo admin)
    @GetMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public List<SoporteTecnico> getAllSolicitudes() {
        return soporteTecnicoRepository.findAll();
    }
    
    // Obtener solicitudes del usuario autenticado
    @GetMapping("/mis-solicitudes")
    public ResponseEntity<?> getMisSolicitudes() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        
        Optional<Usuario> usuario = usuarioRepository.findById(userPrincipal.getId());
        if (!usuario.isPresent()) {
            return ResponseEntity.badRequest().body("Usuario no encontrado");
        }
        
        List<SoporteTecnico> solicitudes = soporteTecnicoRepository.findByUsuarioOrderByFechaCreacionDesc(usuario.get());
        return ResponseEntity.ok(solicitudes);
    }
    
    // Obtener una solicitud específica
    @GetMapping("/{id}")
    public ResponseEntity<?> getSolicitudById(@PathVariable Long id) {
        Optional<SoporteTecnico> solicitud = soporteTecnicoRepository.findById(id);
        if (!solicitud.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        // Verificar que el usuario sea el dueño de la solicitud o un administrador
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        
        if (!solicitud.get().getUsuario().getId().equals(userPrincipal.getId()) && 
            !authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return ResponseEntity.status(403).body("No tienes permiso para ver esta solicitud");
        }
        
        return ResponseEntity.ok(solicitud.get());
    }
    
    // Crear una nueva solicitud de soporte
    @PostMapping
    public ResponseEntity<?> createSolicitud(@RequestBody SoporteTecnico solicitud) {
        // Obtener el usuario autenticado
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        
        Optional<Usuario> usuario = usuarioRepository.findById(userPrincipal.getId());
        if (!usuario.isPresent()) {
            return ResponseEntity.badRequest().body("Usuario no encontrado");
        }
        
        // Establecer el usuario de la solicitud
        solicitud.setUsuario(usuario.get());
        solicitud.setFechaCreacion(new Date());
        solicitud.setEstado("abierto");
        
        return ResponseEntity.ok(soporteTecnicoRepository.save(solicitud));
    }
    
    // Responder a una solicitud (solo admin)
    @PutMapping("/{id}/responder")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> responderSolicitud(@PathVariable Long id, @RequestBody String respuesta) {
        Optional<SoporteTecnico> solicitud = soporteTecnicoRepository.findById(id);
        if (!solicitud.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        SoporteTecnico existingSolicitud = solicitud.get();
        existingSolicitud.setRespuesta(respuesta);
        existingSolicitud.setFechaRespuesta(new Date());
        existingSolicitud.setEstado("resuelto");
        
        return ResponseEntity.ok(soporteTecnicoRepository.save(existingSolicitud));
    }
    
    // Actualizar el estado de una solicitud (solo admin)
    @PutMapping("/{id}/estado")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> updateEstadoSolicitud(@PathVariable Long id, @RequestBody String estado) {
        Optional<SoporteTecnico> solicitud = soporteTecnicoRepository.findById(id);
        if (!solicitud.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        SoporteTecnico existingSolicitud = solicitud.get();
        existingSolicitud.setEstado(estado);
        
        return ResponseEntity.ok(soporteTecnicoRepository.save(existingSolicitud));
    }
    
    // Cerrar una solicitud (usuario o admin)
    @PutMapping("/{id}/cerrar")
    public ResponseEntity<?> cerrarSolicitud(@PathVariable Long id) {
        Optional<SoporteTecnico> solicitud = soporteTecnicoRepository.findById(id);
        if (!solicitud.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        // Verificar que el usuario sea el dueño de la solicitud o un administrador
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        
        if (!solicitud.get().getUsuario().getId().equals(userPrincipal.getId()) && 
            !authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return ResponseEntity.status(403).body("No tienes permiso para cerrar esta solicitud");
        }
        
        SoporteTecnico existingSolicitud = solicitud.get();
        existingSolicitud.setEstado("cerrado");
        
        return ResponseEntity.ok(soporteTecnicoRepository.save(existingSolicitud));
    }
}