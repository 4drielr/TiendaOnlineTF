package com.tiendaonline.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tiendaonline.backend.model.SoporteTecnico;
import com.tiendaonline.backend.model.Usuario;

@Repository
public interface SoporteTecnicoRepository extends JpaRepository<SoporteTecnico, Long> {
    List<SoporteTecnico> findByUsuarioOrderByFechaCreacionDesc(Usuario usuario);
    List<SoporteTecnico> findByEstado(String estado);
}