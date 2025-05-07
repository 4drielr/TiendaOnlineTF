package com.tiendaonline.backend.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tiendaonline.backend.model.Contacto;
import com.tiendaonline.backend.model.MensajeSoporte;
import com.tiendaonline.backend.model.Usuario;
import com.tiendaonline.backend.repository.ContactoRepository;
import com.tiendaonline.backend.repository.MensajeSoporteRepository;
import com.tiendaonline.backend.repository.UsuarioRepository;
import com.tiendaonline.backend.request.ContactoRequest;

//@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/contacto")
public class ContactoController {

    @Autowired
    private ContactoRepository contactoRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private MensajeSoporteRepository mensajeRepo;

    @GetMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public List<Contacto> getAllContactos() {
        return contactoRepository.findAll();
    }
    
    @GetMapping("/usuario/{id}")
    public ResponseEntity<?> getContactosByUsuario(@PathVariable Long id) {
        Optional<Usuario> usuario = usuarioRepository.findById(id);
        if (usuario.isPresent()) {
            return ResponseEntity.ok(contactoRepository.findByUsuario(usuario.get()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createContacto(@RequestBody ContactoRequest contactoRequest) {
        // Crear solicitud de soporte
        Contacto contacto = new Contacto();
        contacto.setNombre(contactoRequest.getNombre());
        contacto.setEmail(contactoRequest.getEmail());
        contacto.setAsunto(contactoRequest.getAsunto());
        contacto.setMensaje(contactoRequest.getMensaje());
        // Asociar con usuario si se proporciona ID
        if (contactoRequest.getUsuarioId() != null) {
            Optional<Usuario> usuarioOpt = usuarioRepository.findById(contactoRequest.getUsuarioId());
            if (usuarioOpt.isPresent()) {
                contacto.setUsuario(usuarioOpt.get());
            }
        }
        // Guardar solicitud
        Contacto saved = contactoRepository.save(contacto);
        // Crear primer mensaje en la conversación
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Optional<Usuario> authorOpt = usuarioRepository.findByEmail(auth.getName());
        if (authorOpt.isPresent()) {
            MensajeSoporte msg = new MensajeSoporte();
            msg.setSolicitud(saved);
            msg.setUsuario(authorOpt.get());
            msg.setMensaje(contactoRequest.getMensaje());
            mensajeRepo.save(msg);
        }
        return ResponseEntity.ok(saved);
    }
    
    // Obtener mensajes de una solicitud de soporte
    @GetMapping("/{id}/mensajes")
    public ResponseEntity<?> getMensajes(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Optional<Contacto> sol = contactoRepository.findById(id);
        if (sol.isEmpty()) return ResponseEntity.notFound().build();
        Contacto solicitud = sol.get();
        // verificar acceso: owner o admin
        String email = auth.getName();
        Optional<Usuario> userOpt = usuarioRepository.findByEmail(email);
        boolean isAdmin = auth.getAuthorities().stream().anyMatch(a->a.getAuthority().equals("ROLE_ADMIN"));
        if (userOpt.isEmpty() || (!isAdmin && !solicitud.getUsuario().getId().equals(userOpt.get().getId()))) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(mensajeRepo.findBySolicitudIdOrderByFechaAsc(id));
    }
    
    // Obtener detalles de una solicitud de soporte
    @GetMapping("/{id}")
    public ResponseEntity<?> getSolicitud(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Optional<Contacto> sol = contactoRepository.findById(id);
        if (sol.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Contacto solicitud = sol.get();
        String email = auth.getName();
        Optional<Usuario> userOpt = usuarioRepository.findByEmail(email);
        boolean isAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (userOpt.isEmpty() || (!isAdmin && !solicitud.getUsuario().getId().equals(userOpt.get().getId()))) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(solicitud);
    }
    
    // Enviar mensaje en una solicitud de soporte
    @PostMapping("/{id}/mensajes")
    public ResponseEntity<?> postMensaje(@PathVariable Long id, @RequestBody Map<String,String> body) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Optional<Contacto> sol = contactoRepository.findById(id);
        if (sol.isEmpty()) return ResponseEntity.notFound().build();
        Contacto solicitud = sol.get();
        String email = auth.getName();
        Optional<Usuario> userOpt = usuarioRepository.findByEmail(email);
        boolean isAdmin = auth.getAuthorities().stream().anyMatch(a->a.getAuthority().equals("ROLE_ADMIN"));
        if (userOpt.isEmpty() || (!isAdmin && !solicitud.getUsuario().getId().equals(userOpt.get().getId()))) {
            return ResponseEntity.status(403).build();
        }
        String msg = body.get("mensaje");
        MensajeSoporte m = new MensajeSoporte();
        m.setSolicitud(solicitud);
        m.setUsuario(userOpt.get());
        m.setMensaje(msg);
        return ResponseEntity.ok(mensajeRepo.save(m));
    }
}
