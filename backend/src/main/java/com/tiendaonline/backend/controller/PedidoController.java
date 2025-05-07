package com.tiendaonline.backend.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tiendaonline.backend.dto.DetallePedidoDTO;
import com.tiendaonline.backend.dto.PedidoDTO;
import com.tiendaonline.backend.model.DetallePedido;
import com.tiendaonline.backend.model.Pedido;
import com.tiendaonline.backend.model.Producto;
import com.tiendaonline.backend.model.Usuario;
import com.tiendaonline.backend.repository.PedidoRepository;
import com.tiendaonline.backend.repository.ProductoRepository;
import com.tiendaonline.backend.repository.UsuarioRepository;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    @Autowired
    private PedidoRepository pedidoRepository;
    
    @Autowired
    private ProductoRepository productoRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    // La lista de pedidos solo debe ser accesible para administradores
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("")
    public ResponseEntity<?> getAllPedidos() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getAuthorities().stream().noneMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return ResponseEntity.status(403).body("No tienes permiso para ver todos los pedidos (solo admin)");
        }
        return ResponseEntity.ok(pedidoRepository.findAll());
    }
    
    // Obtener pedidos del usuario autenticado
    @GetMapping({"/mis-pedidos", "/usuario"})
    public ResponseEntity<?> getMisPedidos() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        Optional<Usuario> usuario = usuarioRepository.findByEmail(email);
        if (!usuario.isPresent()) {
            return ResponseEntity.badRequest().body("Usuario no encontrado");
        }
        List<Pedido> pedidos = pedidoRepository.findByUsuarioOrderByFechaPedidoDesc(usuario.get());
        return ResponseEntity.ok(pedidos);
    }
    
    // Obtener un pedido específico
    @GetMapping("/{id}")
    public ResponseEntity<?> getPedidoById(@PathVariable Long id) {
        Optional<Pedido> pedido = pedidoRepository.findById(id);
        if (!pedido.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        // Verificar que el usuario sea el dueño del pedido o un administrador
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        Optional<Usuario> usuario = usuarioRepository.findByEmail(email);
        if (!usuario.isPresent()) {
            return ResponseEntity.badRequest().body("Usuario no encontrado");
        }
        
        if (!pedido.get().getUsuario().getId().equals(usuario.get().getId()) && 
            !authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return ResponseEntity.status(403).body("No tienes permiso para ver este pedido");
        }
        
        return ResponseEntity.ok(pedido.get());
    }
    
    // Crear un nuevo pedido
    @PostMapping
    public ResponseEntity<?> createPedido(@RequestBody PedidoDTO pedidoDto) {
        System.out.println("[DEBUG] Pedido recibido: " + pedidoDto);
        // Obtener el usuario autenticado
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        Optional<Usuario> usuario = usuarioRepository.findByEmail(email);
        if (!usuario.isPresent()) {
            return ResponseEntity.badRequest().body("Usuario no encontrado");
        }
        
        if (pedidoDto.getDetalles() == null || pedidoDto.getDetalles().isEmpty()) {
            return ResponseEntity.badRequest().body("El pedido debe contener al menos un producto");
        }
        
        Pedido entity = new Pedido();
        entity.setUsuario(usuario.get());
        entity.setDireccionEnvio(pedidoDto.getDireccionEnvio());
        entity.setMetodoPago(pedidoDto.getMetodoPago());
        entity.setEstado(pedidoDto.getEstado());
        
        Set<DetallePedido> detallesProcesados = new java.util.HashSet<>();
        double total = 0.0;
        
        for (DetallePedidoDTO dto : pedidoDto.getDetalles()) {
            DetallePedido detalle = new DetallePedido();
            detalle.setProductoId(dto.getProductoId());
            detalle.setCantidad(dto.getCantidad());
            
            Long productoId = dto.getProductoId();
            Optional<Producto> productoOpt = productoRepository.findById(productoId);
            if (productoOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Producto no encontrado: " + productoId + ". Detalle recibido: " + dto);
            }
            Producto producto = productoOpt.get();
            detalle.setPrecioUnitario(producto.getPrecio());
            if (dto.getCantidad() == null || dto.getCantidad() <= 0) {
                return ResponseEntity.badRequest().body("Cantidad no válida para el producto: " + producto.getNombre() + ". Detalle recibido: " + dto);
            }
            detalle.setSubtotal(detalle.getPrecioUnitario() * dto.getCantidad());
            total += detalle.getSubtotal();
            detallesProcesados.add(detalle);
        }
        
        entity.setTotal(total);
        for (DetallePedido detalle : detallesProcesados) {
            detalle.setPedido(entity);
        }
        entity.setDetalles(detallesProcesados);
        
        Pedido saved = pedidoRepository.save(entity);
        return ResponseEntity.ok(saved);
    }
    
    // El cambio de estado de pedidos solo debe ser accesible para administradores
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/estado")
    public ResponseEntity<?> updateEstadoPedido(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Optional<Pedido> pedidoOpt = pedidoRepository.findById(id);
        if (pedidoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Pedido pedido = pedidoOpt.get();
        String nuevoEstado = body.get("estado");
        if (nuevoEstado == null || nuevoEstado.isBlank()) {
            return ResponseEntity.badRequest().body("El campo 'estado' es requerido");
        }
        pedido.setEstado(nuevoEstado);
        pedidoRepository.save(pedido);
        return ResponseEntity.ok(pedido);
    }
    
    // Cancelar un pedido (usuario o administrador)
    @PutMapping("/{id}/cancelar")
    public ResponseEntity<?> cancelarPedido(@PathVariable Long id) {
        Optional<Pedido> pedido = pedidoRepository.findById(id);
        if (!pedido.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        // Verificar que el usuario sea el dueño del pedido o un administrador
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        Optional<Usuario> usuario = usuarioRepository.findByEmail(email);
        if (!usuario.isPresent()) {
            return ResponseEntity.badRequest().body("Usuario no encontrado");
        }
        
        if (!pedido.get().getUsuario().getId().equals(usuario.get().getId()) && 
            !authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return ResponseEntity.status(403).body("No tienes permiso para cancelar este pedido");
        }
        
        // Solo se pueden cancelar pedidos en estado pendiente
        if (!pedido.get().getEstado().equals("pendiente")) {
            return ResponseEntity.badRequest().body("Solo se pueden cancelar pedidos en estado pendiente");
        }
        
        Pedido existingPedido = pedido.get();
        existingPedido.setEstado("cancelado");
        
        return ResponseEntity.ok(pedidoRepository.save(existingPedido));
    }
}