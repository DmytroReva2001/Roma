package romatattoo.config.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    // Creamos objetos para la clase
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;

    // Deifnimos los objetos para el tema de autorización, codificación en formato Bearer y formateo de datos en JSON
    @Override
    public void doFilterInternal(@NonNull HttpServletRequest request,
                                 @NonNull HttpServletResponse response,
                                 @NonNull FilterChain filterChain) throws ServletException, IOException {
        final String autHeader=request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        if(autHeader==null||!autHeader.startsWith("Bearer")){
            filterChain.doFilter(request,response);
            return;
        }

        jwt = autHeader.substring(7); //TOKEN EMPIEZA EN LA POSICIÓN 7 DE CODIFICACIÓN

        // Codificacmos el token y pasamos por el filtrado
        userEmail=jwtService.getUserName(jwt);
        if(userEmail!=null&& SecurityContextHolder.getContext().getAuthentication()==null){
            UserDetails userDetails=this.userDetailsService.loadUserByUsername(userEmail);
            if(jwtService.validateToken(jwt,userDetails)){
                UsernamePasswordAuthenticationToken authenticationToken=new UsernamePasswordAuthenticationToken(
                       userDetails,
                       null,
                        userDetails.getAuthorities()
                );
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
        }
        filterChain.doFilter(request,response);

    }
}
