package romatattoo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import romatattoo.entities.ProductoPedido;

public interface ProductoPedidoRepository extends JpaRepository<ProductoPedido, Long> {
    // Puedes agregar consultas personalizadas si lo necesitas
}
