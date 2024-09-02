package romatattoo.config.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfig {

    // Variables predeterminadas de Spring
    public static final String API = "/api/**";
    private final JwtFilter jwtFilter;
    private final AuthenticationProvider authenticationProvider;

    // Definir seguridad de página a base de roles y rutas de acceso
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(request ->
                        request
                                .requestMatchers("/api/auth/**").permitAll()
                                .requestMatchers(HttpMethod.GET, API).permitAll()
                                .requestMatchers(HttpMethod.POST, API).hasAnyAuthority(Role.ADMIN.toString())
                                .requestMatchers(HttpMethod.PUT, API).hasAnyAuthority(Role.ADMIN.toString())
                                .requestMatchers(HttpMethod.DELETE, API).hasAnyAuthority(Role.ADMIN.toString()))
                .sessionManagement(sess -> sess.sessionCreationPolicy(STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return httpSecurity.build();
    }
}