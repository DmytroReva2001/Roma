package romatattoo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import romatattoo.entities.Informacion;
import romatattoo.entities.UserTienda;

import java.util.Optional;

// Repositorio de tabla Información
@Repository
public interface InformacionRepository extends JpaRepository<Informacion, Long> {
    Optional<Informacion> findInformacionByDato(String dato);
}
