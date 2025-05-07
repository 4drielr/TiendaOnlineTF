package com.tiendaonline.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.beans.factory.annotation.Autowired;
import com.tiendaonline.backend.repository.UsuarioRepository;
import com.tiendaonline.backend.model.Usuario;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

    @Bean
    public CommandLineRunner ensureAdminUser(@Autowired UsuarioRepository usuarioRepository, @Autowired PasswordEncoder passwordEncoder) {
        return args -> {
            String adminEmail = "asd@123.com";
            String adminPassword = "123";
            String adminRol = "admin";
            if (!usuarioRepository.existsByEmail(adminEmail)) {
                Usuario admin = new Usuario();
                admin.setEmail(adminEmail);
                admin.setPassword(passwordEncoder.encode(adminPassword));
                admin.setRol(adminRol);
                admin.setNombre("Administrador");
                admin.setApellidos("Sistema");
                usuarioRepository.save(admin);
            }
        };
    }
}