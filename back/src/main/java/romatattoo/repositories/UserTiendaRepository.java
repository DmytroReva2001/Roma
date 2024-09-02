package romatattoo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import romatattoo.entities.UserTienda;

import java.util.Optional;

// Repositorio de tabla Users
@Repository
public interface UserTiendaRepository extends JpaRepository<UserTienda, Long> {
    Optional<UserTienda> findUserByEmail(String email);
    boolean existsByEmail(String email);
}