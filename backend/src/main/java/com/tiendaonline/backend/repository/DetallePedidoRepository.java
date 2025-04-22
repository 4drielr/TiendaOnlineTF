package com.tiendaonline.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tiendaonline.backend.model.DetallePedido;
import com.tiendaonline.backend.model.Pedido;
import com.tiendaonline.backend.model.Producto;

@Repository
public interface DetallePedidoRepository extends JpaRepository<DetallePedido, Long> {
    List<DetallePedido> findByPedido(Pedido pedido);
    List<DetallePedido> findByProducto(Producto producto);
}