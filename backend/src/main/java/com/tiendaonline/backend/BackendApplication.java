package com.tiendaonline.backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.tiendaonline.backend.model.Usuario;
import com.tiendaonline.backend.repository.UsuarioRepository;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

    @Bean
    public CommandLineRunner ensureAdminUser(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            try {
                // Definir credenciales para el usuario administrador
                String adminEmail = "admin@tienda.com";
                String adminPassword = "admin123";
                
                // Definir credenciales para el usuario de prueba
                String userEmail = "asd@123.com";
                String userPassword = "123";
                
                // Verificar si el usuario admin ya existe
                if (!usuarioRepository.existsByEmail(adminEmail)) {
                    Usuario admin = new Usuario();
                    admin.setEmail(adminEmail);
                    admin.setPassword(passwordEncoder.encode(adminPassword));
                    admin.setNombre("Administrador");
                    admin.setApellidos("Sistema");
                    admin.setDireccion("Calle Admin 123");
                    admin.setProvincia("Madrid");
                    admin.setRol("admin");
                    usuarioRepository.save(admin);
                    System.out.println("Usuario administrador creado con éxito.");
                } else {
                    System.out.println("El usuario administrador ya existe.");
                }
                
                // Verificar si el usuario de prueba ya existe
                if (!usuarioRepository.existsByEmail(userEmail)) {
                    Usuario user = new Usuario();
                    user.setEmail(userEmail);
                    user.setPassword(passwordEncoder.encode(userPassword));
                    user.setNombre("Usuario");
                    user.setApellidos("Predeterminado");
                    user.setDireccion("Calle Usuario 456");
                    user.setProvincia("Barcelona");
                    user.setRol("user");
                    usuarioRepository.save(user);
                    System.out.println("Usuario de prueba creado con éxito.");
                } else {
                    System.out.println("El usuario de prueba ya existe.");
                }
            } catch (Exception e) {
                System.err.println("Error al crear usuarios iniciales: " + e.getMessage());
            }
        };
    }
}