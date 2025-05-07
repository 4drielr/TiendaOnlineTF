package com.tiendaonline.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tiendaonline.backend.model.Evento;
import com.tiendaonline.backend.model.Usuario;

@Repository
public interface EventoRepository extends JpaRepository<Evento, Long> {
    List<Evento> findByUsuario(Usuario usuario);
    List<Evento> findByTipo(String tipo);
    List<Evento> findByEstado(String estado);
}
