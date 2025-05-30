package com.tiendaonline.backend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tiendaonline.backend.model.Evento;
import com.tiendaonline.backend.model.Usuario;
import com.tiendaonline.backend.repository.EventoRepository;
import com.tiendaonline.backend.repository.UsuarioRepository;

@RestController
@RequestMapping("/api/eventos")
public class EventoController {

    @Autowired
    private EventoRepository eventoRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;

    // Obtener todos los eventos (accesible para todos)
    @GetMapping
    public List<Evento> getAllEventos() {
        return eventoRepository.findAll();
    }
    
    // Obtener eventos del usuario autenticado
    @GetMapping("/mis-eventos")
    public ResponseEntity<?> getMisEventos() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        Optional<Usuario> usuario = usuarioRepository.findByEmail(email);
        if (!usuario.isPresent()) {
            return ResponseEntity.badRequest().body("Usuario no encontrado");
        }
        List<Evento> eventos = eventoRepository.findByUsuario(usuario.get());
        return ResponseEntity.ok(eventos);
    }
    
    @GetMapping("/tipos/{tipo}")
    public List<Evento> getEventosByTipo(@PathVariable String tipo) {
        return eventoRepository.findByTipo(tipo);
    }
    
    @GetMapping("/usuario/{id}")
    public ResponseEntity<?> getEventosByUsuario(@PathVariable Long id) {
        Optional<Usuario> usuario = usuarioRepository.findById(id);
        if (usuario.isPresent()) {
            return ResponseEntity.ok(eventoRepository.findByUsuario(usuario.get()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Evento> getEventoById(@PathVariable Long id) {
        Optional<Evento> evento = eventoRepository.findById(id);
        if (evento.isPresent()) {
            return ResponseEntity.ok(evento.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createEvento(@RequestBody Evento evento) {
        // Verificar que el usuario existe
        Optional<Usuario> usuario = usuarioRepository.findById(evento.getUsuario().getId());
        if (!usuario.isPresent()) {
            return ResponseEntity.badRequest().body("Usuario no encontrado");
        }
        
        evento.setUsuario(usuario.get());
        return ResponseEntity.ok(eventoRepository.save(evento));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEvento(@PathVariable Long id, @RequestBody Evento eventoDetails) {
        Optional<Evento> evento = eventoRepository.findById(id);
        if (evento.isPresent()) {
            Evento existingEvento = evento.get();
            
            // Actualizar campos
            existingEvento.setTipo(eventoDetails.getTipo());
            existingEvento.setNombre(eventoDetails.getNombre());
            existingEvento.setDescripcion(eventoDetails.getDescripcion());
            existingEvento.setPrecio(eventoDetails.getPrecio());
            existingEvento.setFechaEvento(eventoDetails.getFechaEvento());
            existingEvento.setUbicacion(eventoDetails.getUbicacion());
            existingEvento.setNumInvitados(eventoDetails.getNumInvitados());
            existingEvento.setEstado(eventoDetails.getEstado());
            existingEvento.setIncluyeComida(eventoDetails.isIncluyeComida());
            existingEvento.setIncluyeBebida(eventoDetails.isIncluyeBebida());
            existingEvento.setIncluyeAnimacion(eventoDetails.isIncluyeAnimacion());
            existingEvento.setIncluyeDecoracion(eventoDetails.isIncluyeDecoracion());
            existingEvento.setIncluyeFotografia(eventoDetails.isIncluyeFotografia());
            
            return ResponseEntity.ok(eventoRepository.save(existingEvento));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Cancelar un evento (usuario o administrador)
    @PutMapping("/{id}/cancelar")
    public ResponseEntity<?> cancelarEvento(@PathVariable Long id) {
        Optional<Evento> evento = eventoRepository.findById(id);
        if (!evento.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        // Verificar que el usuario sea el dueño del evento o un administrador
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        Optional<Usuario> usuario = usuarioRepository.findByEmail(email);
        if (!usuario.isPresent()) {
            return ResponseEntity.badRequest().body("Usuario no encontrado");
        }
        
        if (!evento.get().getUsuario().getId().equals(usuario.get().getId()) && 
            !authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return ResponseEntity.status(403).body("No tienes permiso para cancelar este evento");
        }
        
        // Solo se pueden cancelar eventos en estado pendiente o aceptado
        String estadoActual = evento.get().getEstado().toUpperCase();
        if (!estadoActual.equals("PENDIENTE") && !estadoActual.equals("ACEPTADO")) {
            return ResponseEntity.badRequest().body("Solo se pueden cancelar eventos en estado pendiente o aceptado");
        }
        
        Evento existingEvento = evento.get();
        existingEvento.setEstado("cancelado");
        
        return ResponseEntity.ok(eventoRepository.save(existingEvento));
    }
    
    // Actualizar el estado de un evento (solo admin)
    @PutMapping("/{id}/estado")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateEstadoEvento(@PathVariable Long id, @RequestBody String estado) {
        Optional<Evento> evento = eventoRepository.findById(id);
        if (!evento.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        // Validar que el estado sea ACEPTADO o RECHAZADO
        estado = estado.trim().toUpperCase();
        if (!estado.equals("ACEPTADO") && !estado.equals("RECHAZADO")) {
            return ResponseEntity.badRequest().body("El estado debe ser ACEPTADO o RECHAZADO");
        }
        
        Evento existingEvento = evento.get();
        existingEvento.setEstado(estado);
        
        return ResponseEntity.ok(eventoRepository.save(existingEvento));
    }
    
    // Obtener todos los eventos (solo admin)
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllEventosAdmin() {
        return ResponseEntity.ok(eventoRepository.findAll());
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteEvento(@PathVariable Long id) {
        Optional<Evento> evento = eventoRepository.findById(id);
        if (evento.isPresent()) {
            eventoRepository.delete(evento.get());
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
