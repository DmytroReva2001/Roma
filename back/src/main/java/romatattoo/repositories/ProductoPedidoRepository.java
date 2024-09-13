package romatattoo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import romatattoo.entities.Pedido;
import romatattoo.entities.ProductoCesta;
import romatattoo.entities.ProductoPedido;

import java.util.List;

public interface ProductoPedidoRepository extends JpaRepository<ProductoPedido, Long> {
    List<ProductoPedido> findByPedido(Pedido pedido);

}
