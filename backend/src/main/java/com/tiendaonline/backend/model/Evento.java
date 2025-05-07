package com.tiendaonline.backend.model;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Data;

@Data
@Entity
@Table(name = "eventos")
public class Evento {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String tipo; // Puede ser: CUMPLEAÑOS, COMUNION, BODA, OTRO
    
    @Column(nullable = false)
    private String nombre;
    
    @Column(nullable = false, length = 1000)
    private String descripcion;
    
    @Column(nullable = false)
    private Double precio;
    
    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date fechaEvento;
    
    @Column(nullable = false)
    private String ubicacion;
    
    @Column(nullable = false)
    private Integer numInvitados;
    
    @Column(nullable = false)
    private String estado; // PENDIENTE, CONFIRMADO, CANCELADO
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    @JsonIgnoreProperties({"pedidos", "solicitudesSoporte"})
    private Usuario usuario;
    
    // Servicios incluidos en el evento
    private boolean incluyeComida;
    private boolean incluyeBebida;
    private boolean incluyeAnimacion;
    private boolean incluyeDecoracion;
    private boolean incluyeFotografia;
    
    // Métodos de acceso
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Double getPrecio() {
        return precio;
    }

    public void setPrecio(Double precio) {
        this.precio = precio;
    }

    public Date getFechaEvento() {
        return fechaEvento;
    }

    public void setFechaEvento(Date fechaEvento) {
        this.fechaEvento = fechaEvento;
    }

    public String getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }

    public Integer getNumInvitados() {
        return numInvitados;
    }

    public void setNumInvitados(Integer numInvitados) {
        this.numInvitados = numInvitados;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public boolean isIncluyeComida() {
        return incluyeComida;
    }

    public void setIncluyeComida(boolean incluyeComida) {
        this.incluyeComida = incluyeComida;
    }

    public boolean isIncluyeBebida() {
        return incluyeBebida;
    }

    public void setIncluyeBebida(boolean incluyeBebida) {
        this.incluyeBebida = incluyeBebida;
    }

    public boolean isIncluyeAnimacion() {
        return incluyeAnimacion;
    }

    public void setIncluyeAnimacion(boolean incluyeAnimacion) {
        this.incluyeAnimacion = incluyeAnimacion;
    }

    public boolean isIncluyeDecoracion() {
        return incluyeDecoracion;
    }

    public void setIncluyeDecoracion(boolean incluyeDecoracion) {
        this.incluyeDecoracion = incluyeDecoracion;
    }

    public boolean isIncluyeFotografia() {
        return incluyeFotografia;
    }

    public void setIncluyeFotografia(boolean incluyeFotografia) {
        this.incluyeFotografia = incluyeFotografia;
    }
}
