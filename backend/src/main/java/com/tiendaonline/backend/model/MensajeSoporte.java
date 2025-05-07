package com.tiendaonline.backend.model;

import java.util.Date;
import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@Table(name = "mensajes_soporte")
@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
public class MensajeSoporte {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "solicitud_id", nullable = false)
    private Contacto solicitud;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false, length = 1000)
    private String mensaje;

    @Temporal(TemporalType.TIMESTAMP)
    private Date fecha = new Date();
}
