package romatattoo.config.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import romatattoo.entities.UserTienda;
import romatattoo.repositories.UserTiendaRepository;

import java.security.Key;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService implements UserDetailsService {

    // Creación de codificación
    private static final String SECRET_KEY = "a2fe162bb7a7b0e56d413cc696a64f243d3e55ad4ba65608ef77ddd73e03ba44";

    // Creación de objeto para repositorio
    private final UserTiendaRepository userTiendaRepository;

    // Inyectamos
    @Autowired
    public JwtService(UserTiendaRepository userTiendaRepository) {
        this.userTiendaRepository = userTiendaRepository;
    }

    // Métodos que generan token con datos del usuario
    public String generateToken(UserDetails userDetails, int horas){
        return generateToken(new HashMap<>(), userDetails, horas);
    }
    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails, int horas) {
        // Obtener el rol del usuario
        String userRole = getUserRoleFromUserDetails(userDetails);

        // Agregar el rol del usuario como una afirmación adicional
        extraClaims.put("rol", userRole);

        // Construir el token JWT con las afirmaciones adicionales
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000L * 60 * 60 * horas))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Método para recuperar rol registrado de usuario
    public String getUserRoleFromUserDetails(UserDetails userDetails) {
        // Obtener los roles del usuario desde userDetails
        Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();

        // Verificar si el usuario tiene el rol de ADMIN
        if (authorities.contains(new SimpleGrantedAuthority(Role.ADMIN.name()))) {
            return Role.ADMIN.name();
        } else {
            return Role.USER.name();
        }
    }

    // Métodos para recuperar datos del token
    public String getUserName(String token){
        return getClaim(token, Claims::getSubject);
    }
    public <T> T getClaim(String token, Function<Claims, T> claimsResolver){
        final Claims claims=getAllClaims(token);
        return claimsResolver.apply(claims);
    }
    private Claims getAllClaims(String token) {
        return Jwts
                .parser()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    private Key getSignInKey() {
        byte[]KeyBytes= Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(KeyBytes);
    }
    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = getUserName(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    // Método para ampliar funcionalidad de token
    public String modifyTokenExpiration(String token, long expirationTimeInMillis) {
        // Parsear el token utilizando JwtParserBuilder
        Jws<Claims> parsedToken = Jwts.parser()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token);

        // Reconstruir el token con la nueva fecha de expiración
        return Jwts.builder()
                .setClaims(parsedToken.getBody())
                .setExpiration(new Date(expirationTimeInMillis))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Métodos para revisión de token
    private boolean isTokenExpired(String token) {
        return getExpiration(token).before(new Date());
    }
    private Date getExpiration(String token) {
        return getClaim(token, Claims::getExpiration);
    }

    // Método para recuperar usuario a base de su email
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        return userTiendaRepository.findUserByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }



}
