package romatattoo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import romatattoo.entities.ProductoCesta;

import java.util.List;

@Repository
public interface ProductoCestaRepository extends JpaRepository<ProductoCesta, Long> {
    List<ProductoCesta> findByUserTienda_Email(String email);
}