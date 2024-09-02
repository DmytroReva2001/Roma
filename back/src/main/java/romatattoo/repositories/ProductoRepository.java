package romatattoo.repositories;

import romatattoo.entities.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// Repositorio de tabla Productos
@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {}
