package com.tiendaonline.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Map;

public class DetallePedidoDTO {
    private Long productoId;
    private Integer cantidad;

    @JsonProperty("producto")
    public void setProductoMap(Map<String, Object> producto) {
        if (producto != null && producto.get("id") != null) {
            this.productoId = Long.valueOf(producto.get("id").toString());
        }
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
        this.cantidad = cantidad;
    }
}
