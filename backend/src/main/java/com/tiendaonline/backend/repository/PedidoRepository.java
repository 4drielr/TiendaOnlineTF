package com.tiendaonline.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tiendaonline.backend.model.Pedido;
import com.tiendaonline.backend.model.Usuario;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByUsuarioOrderByFechaPedidoDesc(Usuario usuario);
    List<Pedido> findByEstado(String estado);
}