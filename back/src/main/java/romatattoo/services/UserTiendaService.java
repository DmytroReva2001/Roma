package romatattoo.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import romatattoo.entities.UserTienda;
import romatattoo.repositories.UserTiendaRepository;

import java.util.Optional;

@Service
public class UserTiendaService {

    // Creamos objeto y lo inyectamos
    private final UserTiendaRepository userTiendaRepository;

    @Autowired
    public UserTiendaService(UserTiendaRepository userRepository) {
        this.userTiendaRepository = userRepository;
    }

    // Métodos para la gestión de tabla de User
    public boolean existsByEmail(String email) {
        return userTiendaRepository.existsByEmail(email);
    }

    public Optional<UserTienda> obtenerUserTiendaByEmail(String email) {
        return userTiendaRepository.findUserByEmail(email);
    }

    public void save(UserTienda userTienda) {
        userTiendaRepository.save(userTienda);
    }

    public void activateUserByEmail(String email) {
        UserTienda user = userTiendaRepository.findUserByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con el email: " + email));
        user.setActive(true);
        userTiendaRepository.save(user);
    }
}