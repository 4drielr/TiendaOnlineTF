package com.tiendaonline.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "{\"mensaje\":\"Bienvenido a la API de la Tienda Online\",\"version\":\"1.0\",\"estado\":\"activo\"}";
    }
}