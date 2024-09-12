package romatattoo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import romatattoo.entities.Pedido;

import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByUserTiendaEmail(String email);
}
