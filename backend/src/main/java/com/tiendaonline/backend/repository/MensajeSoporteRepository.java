package com.tiendaonline.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.tiendaonline.backend.model.MensajeSoporte;

public interface MensajeSoporteRepository extends JpaRepository<MensajeSoporte, Long> {
    List<MensajeSoporte> findBySolicitudIdOrderByFechaAsc(Long solicitudId);
}
