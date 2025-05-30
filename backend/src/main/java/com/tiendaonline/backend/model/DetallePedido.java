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
import lombok.EqualsAndHashCode;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.tiendaonline.backend.util.PriceFormatter;
import java.util.Map;

@Entity
@Table(name = "detalles_pedido")
@EqualsAndHashCode(exclude = {"pedido", "producto"})
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
    @JsonSerialize(using = PriceFormatter.EuroSerializer.class)
    private Double precioUnitario = 0.0;
    
    @Column(nullable = false)
    @JsonSerialize(using = PriceFormatter.EuroSerializer.class)
    private Double subtotal = 0.0;
    
    // Campo para almacenar temporalmente el objeto producto durante la deserialización
    @Transient
    @JsonIgnore
    private Map<String, Object> productoObjeto;
    
    // Campo para deserialización directa del ID del producto
    @Transient
    @JsonProperty("productoId")
    private Long productoId;

    // Constructor vacío necesario para que Jackson/JPA funcionen correctamente
    public DetallePedido() {
        this.precioUnitario = 0.0;
        this.subtotal = 0.0;
        this.cantidad = 1; // Valor por defecto para evitar NullPointerException
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
    public void setProducto(Producto producto) {
        this.producto = producto;
        if (producto != null) {
            // Asegurar que el precio nunca sea null
            Double productoPrecio = producto.getPrecio();
            this.precioUnitario = (productoPrecio != null) ? productoPrecio : 0.0;
            
            // Asegurar que la cantidad nunca sea null
            if (this.cantidad == null) {
                this.cantidad = 1;
            }
            
            // Calcular subtotal con valores seguros
            // Evitar unboxing de valores posiblemente nulos
            double precio = (this.precioUnitario != null) ? this.precioUnitario : 0.0;
            int cantidadSegura = (this.cantidad != null) ? this.cantidad : 1;
            this.subtotal = precio * cantidadSegura;
        }
    }
    
    // Getter y setter para el objeto producto temporal
    @JsonIgnore
    public Map<String, Object> getProductoObjeto() {
        return productoObjeto;
    }
    
    @JsonProperty("producto") // Esta es la única anotación JsonProperty("producto") que mantenemos
    public void setProductoObjeto(Map<String, Object> productoObj) {
        this.productoObjeto = productoObj;
        if (productoObj != null) {
            // Extraer ID del producto
            if (productoObj.get("id") != null) {
                try {
                    Long idProducto = Long.valueOf(productoObj.get("id").toString());
                    this.setProductoId(idProducto);
                } catch (NumberFormatException e) {
                    System.err.println("Error al convertir ID de producto: " + e.getMessage());
                }
            }
            
            // Extraer precio del producto
            if (productoObj.get("precio") != null) {
                try {
                    this.precioUnitario = Double.valueOf(productoObj.get("precio").toString());
                } catch (NumberFormatException e) {
                    System.err.println("Error al convertir precio de producto: " + e.getMessage());
                    this.precioUnitario = 0.0;
                }
            }
            
            // Asegurar que precioUnitario nunca sea null
            if (this.precioUnitario == null) {
                this.precioUnitario = 0.0;
            }
            
            // Calcular subtotal con valores seguros
            double precio = (this.precioUnitario != null) ? this.precioUnitario : 0.0;
            
            if (this.cantidad != null) {
                // Usar el valor de cantidad existente
                int cantidadSegura = this.cantidad;
                this.subtotal = precio * cantidadSegura;
            } else {
                // Usar valor por defecto para cantidad
                this.cantidad = 1;
                this.subtotal = precio * this.cantidad;
            }
        }
    }

    public Producto getProducto() {
        return producto;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad != null ? cantidad : 1; // Asegurar que cantidad nunca sea null
        if (this.precioUnitario != null) {
            this.subtotal = this.precioUnitario * this.cantidad;
        } else {
            this.precioUnitario = 0.0;
            this.subtotal = 0.0;
        }
    }

    public Double getPrecioUnitario() {
        return precioUnitario;
    }

    public void setPrecioUnitario(Double precioUnitario) {
        this.precioUnitario = precioUnitario != null ? precioUnitario : 0.0;
        if (this.cantidad != null) {
            this.subtotal = this.precioUnitario * this.cantidad;
        } else {
            this.cantidad = 1; // Valor por defecto para evitar NullPointerException
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