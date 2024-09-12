package romatattoo.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import romatattoo.entities.Pedido;
import romatattoo.entities.ProductoPedido;
import romatattoo.repositories.PedidoRepository;
import romatattoo.repositories.ProductoPedidoRepository;

import java.util.List;
import java.util.Optional;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ProductoPedidoRepository productoPedidoRepository;
    @Autowired
    public PedidoService(PedidoRepository pedidoRepository, ProductoPedidoRepository productoPedidoRepository) {
        this.pedidoRepository = pedidoRepository;
        this.productoPedidoRepository = productoPedidoRepository;
    }

    public List<Pedido> obtenerTodosLosPedidos() {
        return pedidoRepository.findAll();
    }

    public Optional<Pedido> obtenerPedidoPorId(Long id) {
        return pedidoRepository.findById(id);
    }

    public Pedido guardarPedido(Pedido pedido) {
        return pedidoRepository.save(pedido);
    }

    public void eliminarPedido(Long id) {
        pedidoRepository.deleteById(id);
    }

    public List<Pedido> obtenerPedidoPorUser(String email) {
        return pedidoRepository.findByUserTiendaEmail(email);
    }

    public void agregarProductosPedido(Pedido pedido, List<ProductoPedido> productosPedidos) {
        for (ProductoPedido productoPedido : productosPedidos) {
            productoPedido.setPedido(pedido); // Asocia el pedido
            productoPedidoRepository.save(productoPedido);
        }
    }
}