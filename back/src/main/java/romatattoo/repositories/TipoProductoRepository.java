package romatattoo.repositories;

import romatattoo.entities.TipoProducto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


// Repositorio de tabla Tipos de productos
@Repository
public interface TipoProductoRepository extends JpaRepository<TipoProducto, Long> {}
