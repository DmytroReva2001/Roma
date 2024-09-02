package romatattoo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    // Permitimos acceso a los metodos REST desde cualquier origen
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Permitir solicitudes en todas las rutas
                .allowedOrigins("*") // Permitir solicitudes desde este origen
                .allowedMethods("GET", "POST", "PUT", "DELETE"); // Permitir estos métodos HTTP
    }
}