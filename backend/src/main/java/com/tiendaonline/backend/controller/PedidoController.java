package com.tiendaonline.backend.controller;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.ExceptionHandler;
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

    private static final Logger logger = LoggerFactory.getLogger(PedidoController.class);

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
    @PostMapping("")
    public ResponseEntity<?> createPedido(@RequestBody PedidoDTO pedidoDTO) {
        try {
            // Validar que el usuario exista
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);
            if (!usuarioOpt.isPresent()) {
                return ResponseEntity.badRequest().body("Usuario no encontrado");
            }
            Usuario usuario = usuarioOpt.get();
            
            // Crear la entidad Pedido
            Pedido entity = new Pedido();
            entity.setUsuario(usuario);
            entity.setFechaPedido(new Date());
            entity.setEstado("PENDIENTE");
            
            // Inicializar el total
            Double total = 0.0;
            
            // Procesar los detalles del pedido
            Set<DetallePedido> detalles = new HashSet<>();
            
            if (pedidoDTO.getDetalles() != null) {
                for (DetallePedidoDTO dto : pedidoDTO.getDetalles()) {
                    DetallePedido detalle = new DetallePedido();
                    detalle.setPedido(entity);
                    
                    // Buscar el producto por ID
                    final Long productoId;
                    if (dto.getProductoId() != null) {
                        productoId = dto.getProductoId();
                    } else if (dto.getProducto() != null && dto.getProducto().get("id") != null) {
                        productoId = Long.valueOf(dto.getProducto().get("id").toString());
                    } else {
                        throw new IllegalArgumentException("ID de producto no proporcionado");
                    }
                    
                    Producto producto = productoRepository.findById(productoId)
                        .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado: " + productoId));
                    
                    detalle.setProducto(producto);
                    detalle.setProductoId(productoId);
                    
                    // Manejar precio unitario
                    Double precioUnitario = dto.getPrecioUnitario();
                    if (precioUnitario == null) {
                        precioUnitario = producto.getPrecio();
                        if (precioUnitario == null) {
                            precioUnitario = 0.0; // Valor por defecto si no hay precio
                        }
                    }
                    detalle.setPrecioUnitario(precioUnitario);
                    
                    // Manejar cantidad
                    Integer cantidad = dto.getCantidad();
                    if (cantidad == null) {
                        cantidad = 1; // Valor por defecto
                    }
                    detalle.setCantidad(cantidad);
                    
                    // Manejar subtotal
                    Double subtotal = dto.getSubtotal();
                    if (subtotal == null) {
                        subtotal = precioUnitario * cantidad;
                    }
                    detalle.setSubtotal(subtotal);
                    
                    // Agregar al total
                    total += subtotal;
                    
                    detalles.add(detalle);
                }
            }
            
            // Agregar los detalles al pedido
            for (DetallePedido detalle : detalles) {
                entity.addDetallePedido(detalle);
                if (detalle.getProducto() != null && detalle.getProducto().getId() != null) {
                    entity.getProductos_id().add(detalle.getProducto().getId());
                }
            }
            
            entity.setTotal(total);
            
            Pedido saved = pedidoRepository.save(entity);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException | NullPointerException e) {
            // Manejar errores de validación
            logger.error("Error de validación al crear pedido: {}", e.getMessage());
            imprimirDetallesError(e);
            return ResponseEntity.badRequest().body("Error de validación al crear pedido: " + e.getMessage());
        } catch (Exception e) {
            // Manejar errores inesperados
            String tipoError = e instanceof RuntimeException ? "de ejecución" : "inesperado";
            logger.error("Error {} al crear pedido: {}", tipoError, e.getMessage());
            imprimirDetallesError(e);
            return ResponseEntity.badRequest().body("Error " + tipoError + " al crear pedido: " + e.getMessage());
        }
    }
    
    // Método auxiliar para registrar detalles de error
    private void imprimirDetallesError(Exception e) {
        logger.error("Detalles del error:", e);
    }
    
    // El cambio de estado de pedidos solo debe ser accesible para administradores
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/estado")
    public ResponseEntity<?> updateEstadoPedido(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Optional<Pedido> pedidoOpt = pedidoRepository.findById(id);
        if (!pedidoOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        Pedido pedido = pedidoOpt.get();
        String nuevoEstado = body.get("estado");
        if (nuevoEstado == null || nuevoEstado.isEmpty()) {
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
        if (!pedido.get().getEstado().equalsIgnoreCase("pendiente")) {
            return ResponseEntity.badRequest().body("Solo se pueden cancelar pedidos en estado pendiente");
        }
        
        Pedido existingPedido = pedido.get();
        existingPedido.setEstado("cancelado");
        
        return ResponseEntity.ok(pedidoRepository.save(existingPedido));
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error en el servidor: " + e.getMessage());
    }
}