package com.tiendaonline.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tiendaonline.backend.model.Producto;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
}