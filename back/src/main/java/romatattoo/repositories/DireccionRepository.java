package romatattoo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import romatattoo.entities.Direccion;
import java.util.List;

public interface DireccionRepository extends JpaRepository<Direccion, Long> {
    List<Direccion> findByUserTiendaEmail(String email);
}
