package com.tiendaonline.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
public class DetallePedidoDTO {
    private Long productoId;
    private Integer cantidad;
    private Double precioUnitario;
    private Double subtotal;
    private Map<String, Object> producto;

    @JsonProperty("producto")
    public void setProductoMap(Map<String, Object> producto) {
        this.producto = producto;
        if (producto != null && producto.get("id") != null) {
            this.productoId = Long.valueOf(producto.get("id").toString());
            
            // Si el producto tiene precio, usarlo para el precioUnitario
            if (producto.get("precio") != null) {
                this.precioUnitario = Double.valueOf(producto.get("precio").toString());
            }
        }
    }

    public Map<String, Object> getProducto() {
        return producto;
    }

    // Métodos de acceso
    public Long getProductoId() {
        return productoId;
    }

    public void setProductoId(Long productoId) {
        this.productoId = productoId;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad != null ? cantidad : 1;
        // Calcular subtotal si tenemos precioUnitario
        if (this.precioUnitario != null) {
            this.subtotal = this.precioUnitario * this.cantidad;
        }
    }
    
    public Double getPrecioUnitario() {
        return precioUnitario;
    }

    public void setPrecioUnitario(Double precioUnitario) {
        this.precioUnitario = precioUnitario != null ? precioUnitario : 0.0;
        // Calcular subtotal si tenemos cantidad
        if (this.cantidad != null && this.precioUnitario != null) {
            this.subtotal = this.precioUnitario * this.cantidad;
        }
    }

    public Double getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(Double subtotal) {
        this.subtotal = subtotal;
    }
    
    @Override
    public String toString() {
        return "DetallePedidoDTO{" +
                "productoId=" + productoId +
                ", cantidad=" + cantidad +
                ", precioUnitario=" + precioUnitario +
                ", subtotal=" + subtotal +
                ", producto=" + producto +
                '}';
    }
}
