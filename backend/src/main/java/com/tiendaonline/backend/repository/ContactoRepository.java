package com.tiendaonline.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tiendaonline.backend.model.Contacto;
import com.tiendaonline.backend.model.Usuario;

@Repository
public interface ContactoRepository extends JpaRepository<Contacto, Long> {
    List<Contacto> findByUsuario(Usuario usuario);
    List<Contacto> findByEmail(String email);
}
