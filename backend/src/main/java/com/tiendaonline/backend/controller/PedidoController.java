package com.tiendaonline.backend.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tiendaonline.backend.model.DetallePedido;
import com.tiendaonline.backend.model.Pedido;
import com.tiendaonline.backend.model.Producto;
import com.tiendaonline.backend.model.Usuario;
import com.tiendaonline.backend.repository.DetallePedidoRepository;
import com.tiendaonline.backend.repository.PedidoRepository;
import com.tiendaonline.backend.repository.ProductoRepository;
import com.tiendaonline.backend.repository.UsuarioRepository;
import com.tiendaonline.backend.security.UserPrincipal;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    @Autowired
    private PedidoRepository pedidoRepository;
    
    @Autowired
    private DetallePedidoRepository detallePedidoRepository;
    
    @Autowired
    private ProductoRepository productoRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    // Obtener todos los pedidos (solo admin)
    @GetMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public List<Pedido> getAllPedidos() {
        return pedidoRepository.findAll();
    }
    
    // Obtener pedidos del usuario autenticado
    @GetMapping("/mis-pedidos")
    public ResponseEntity<?> getMisPedidos() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        
        Optional<Usuario> usuario = usuarioRepository.findById(userPrincipal.getId());
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
        
        // Verificar que el usuario sea el dueño del pedido o un admin
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        
        if (!pedido.get().getUsuario().getId().equals(userPrincipal.getId()) && 
            !authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return ResponseEntity.status(403).body("No tienes permiso para ver este pedido");
        }
        
        return ResponseEntity.ok(pedido.get());
    }
    
    // Crear un nuevo pedido
    @PostMapping
    public ResponseEntity<?> createPedido(@RequestBody Pedido pedido) {
        // Obtener el usuario autenticado
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        
        Optional<Usuario> usuario = usuarioRepository.findById(userPrincipal.getId());
        if (!usuario.isPresent()) {
            return ResponseEntity.badRequest().body("Usuario no encontrado");
        }
        
        // Establecer el usuario del pedido
        pedido.setUsuario(usuario.get());
        
        // Validar y procesar los detalles del pedido
        if (pedido.getDetalles() == null || pedido.getDetalles().isEmpty()) {
            return ResponseEntity.badRequest().body("El pedido debe tener al menos un producto");
        }
        
        // Calcular el total del pedido y validar productos
        double total = 0.0;
        List<DetallePedido> detallesValidos = pedido.getDetalles().stream()
                .filter(detalle -> detalle.getProducto() != null && detalle.getProducto().getId() != null)
                .collect(Collectors.toList());
        
        for (DetallePedido detalle : detallesValidos) {
            Optional<Producto> producto = productoRepository.findById(detalle.getProducto().getId());
            if (!producto.isPresent()) {
                return ResponseEntity.badRequest().body("Producto no encontrado: " + detalle.getProducto().getId());
            }
            
            detalle.setProducto(producto.get());
            detalle.setPrecioUnitario(producto.get().getPrecio());
            detalle.setSubtotal(detalle.getPrecioUnitario() * detalle.getCantidad());
            total += detalle.getSubtotal();
        }
        
        pedido.setTotal(total);
        
        // Guardar el pedido
        Pedido savedPedido = pedidoRepository.save(pedido);
        
        // Establecer la relación bidireccional y guardar los detalles
        for (DetallePedido detalle : detallesValidos) {
            detalle.setPedido(savedPedido);
            detallePedidoRepository.save(detalle);
        }
        
        return ResponseEntity.ok(savedPedido);
    }
    
    // Actualizar el estado de un pedido (solo admin)
    @PutMapping("/{id}/estado")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> updateEstadoPedido(@PathVariable Long id, @RequestBody String estado) {
        Optional<Pedido> pedido = pedidoRepository.findById(id);
        if (!pedido.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        Pedido existingPedido = pedido.get();
        existingPedido.setEstado(estado);
        
        return ResponseEntity.ok(pedidoRepository.save(existingPedido));
    }
    
    // Cancelar un pedido (usuario o admin)
    @PutMapping("/{id}/cancelar")
    public ResponseEntity<?> cancelarPedido(@PathVariable Long id) {
        Optional<Pedido> pedido = pedidoRepository.findById(id);
        if (!pedido.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        // Verificar que el usuario sea el dueño del pedido o un admin
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        
        if (!pedido.get().getUsuario().getId().equals(userPrincipal.getId()) && 
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