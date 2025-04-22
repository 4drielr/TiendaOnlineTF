package com.tiendaonline.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/");
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Redirige todas las rutas no manejadas por el backend a index.html para que React Router funcione
        registry.addViewController("/{spring:[^\\.]*}").setViewName("forward:/index.html");
        registry.addViewController("/**/{spring:[^\\.]*}").setViewName("forward:/index.html");
    }
}