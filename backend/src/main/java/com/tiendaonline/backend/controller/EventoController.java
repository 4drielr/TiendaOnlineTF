package com.tiendaonline.backend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

    @GetMapping
    public List<Evento> getAllEventos() {
        return eventoRepository.findAll();
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

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
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
