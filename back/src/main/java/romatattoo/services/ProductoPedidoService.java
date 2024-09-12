package romatattoo.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import romatattoo.entities.ProductoPedido;
import romatattoo.repositories.ProductoPedidoRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ProductoPedidoService {

    private final ProductoPedidoRepository pedidoProductoRepository;
    @Autowired
    public ProductoPedidoService(ProductoPedidoRepository pedidoProductoRepository) {
        this.pedidoProductoRepository = pedidoProductoRepository;
    }

    public List<ProductoPedido> obtenerTodosLosPedidoProductos() {
        return pedidoProductoRepository.findAll();
    }

    public Optional<ProductoPedido> obtenerPedidoProductoPorId(Long id) {
        return pedidoProductoRepository.findById(id);
    }

    public ProductoPedido guardarPedidoProducto(ProductoPedido pedidoProducto) {
        return pedidoProductoRepository.save(pedidoProducto);
    }

    public void eliminarPedidoProducto(Long id) {
        pedidoProductoRepository.deleteById(id);
    }
}