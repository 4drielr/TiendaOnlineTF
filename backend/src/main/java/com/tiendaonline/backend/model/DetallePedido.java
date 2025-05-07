package com.tiendaonline.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.Data;
import lombok.EqualsAndHashCode;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@EqualsAndHashCode(exclude = {"pedido", "producto"})
@Entity
@Table(name = "detalles_pedido")
public class DetallePedido {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id", nullable = false)
    @JsonBackReference
    private Pedido pedido;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "producto_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "detallesPedidos"})
    private Producto producto;
    
    @Column(nullable = false)
    private Integer cantidad;
    
    @Column(nullable = false)
    private Double precioUnitario = 0.0;
    
    @Column(nullable = false)
    private Double subtotal = 0.0;
    
    // Campo para deserialización directa del ID del producto
    @Transient
    @JsonProperty("productoId")
    private Long productoId;

    // Constructor vacío necesario para que Jackson/JPA funcionen correctamente
    public DetallePedido() {
        this.precioUnitario = 0.0;
    }

    // Constructor para pruebas o inicialización manual
    public DetallePedido(Producto producto, Integer cantidad, Double precioUnitario, Double subtotal) {
        this.producto = producto;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
        this.subtotal = subtotal;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Pedido getPedido() {
        return pedido;
    }

    public void setPedido(Pedido pedido) {
        this.pedido = pedido;
    }

    // Setter explícito para producto (Jackson necesita esto para deserializar correctamente)
    @JsonProperty("producto")
    public void setProducto(Producto producto) {
        this.producto = producto;
        if (producto != null && this.cantidad != null) {
            this.precioUnitario = producto.getPrecio() != null ? producto.getPrecio() : 0.0;
            this.subtotal = this.precioUnitario * this.cantidad;
        }
    }

    public Producto getProducto() {
        return producto;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
        if (this.producto != null && cantidad != null && this.precioUnitario != null) {
            this.subtotal = this.precioUnitario * cantidad;
        }
    }

    public Double getPrecioUnitario() {
        return precioUnitario;
    }

    public void setPrecioUnitario(Double precioUnitario) {
        this.precioUnitario = precioUnitario != null ? precioUnitario : 0.0;
        if (this.cantidad != null) {
            this.subtotal = this.precioUnitario * this.cantidad;
        }
    }

    public Double getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(Double subtotal) {
        this.subtotal = subtotal;
    }

    @JsonProperty("productoId")
    public void setProductoId(Long productoId) {
        this.productoId = productoId;
        if (productoId != null && (producto == null || !productoId.equals(producto.getId()))) {
            Producto p = new Producto();
            p.setId(productoId);
            this.producto = p;
        }
    }

    public Long getProductoId() {
        return producto != null ? producto.getId() : productoId;
    }

    // Devuelve el nombre del producto asociado
    public String getNombreProducto() {
        return producto != null ? producto.getNombre() : null;
    }
}