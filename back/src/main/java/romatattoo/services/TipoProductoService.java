package romatattoo.services;

import romatattoo.entities.TipoProducto;
import romatattoo.repositories.TipoProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TipoProductoService {

    // Creamos objeto y lo inyectamos
    private final TipoProductoRepository tipoProductoRepository;

    @Autowired
    public TipoProductoService(TipoProductoRepository productoRepository) {
        this.tipoProductoRepository = productoRepository;
    }

    // Métodos para la gestión de tabla de Tipo de productos
    public List<TipoProducto> obtenerTodosLosTiposDeProductos() {
        return tipoProductoRepository.findAll();
    }

    public TipoProducto obtenerProductoPorId(Long id) {
        Optional<TipoProducto> optionalProducto = tipoProductoRepository.findById(id);
        if (optionalProducto.isPresent()) {
            return optionalProducto.get();
        } else {
            // Manejo de caso en el que el producto no se encuentra
            // Puedes lanzar una excepción, retornar null o realizar otro tipo de manejo
            throw new RuntimeException("Producto no encontrado para ID: " + id);
        }
    }

    public TipoProducto crearProducto(TipoProducto producto) {
        // Puedes realizar validaciones adicionales antes de guardar el producto
        return tipoProductoRepository.save(producto);
    }

    public TipoProducto actualizarProducto(Long id, TipoProducto producto) {
        // Verificar si el producto existe
        Optional<TipoProducto> optionalProducto = tipoProductoRepository.findById(id);
        if (optionalProducto.isPresent()) {
            // Actualizar el producto con los datos proporcionados
            TipoProducto productoExistente = getProductoActualizado(producto, optionalProducto);

            // Guardar el producto actualizado en la base de datos
            return tipoProductoRepository.save(productoExistente);
        } else {
            // Manejo de caso en el que el producto no se encuentra
            // Puedes lanzar una excepción, retornar null o realizar otro tipo de manejo
            throw new RuntimeException("Producto no encontrado para ID: " + id);
        }
    }
    public void eliminarProducto(Long id) {
        tipoProductoRepository.deleteById(id);
    }

    private static TipoProducto getProductoActualizado(TipoProducto producto, Optional<TipoProducto> optionalProducto) {

        TipoProducto productoExistente = optionalProducto.get();
        productoExistente.setTipoProducto(producto.getTipoProducto());
        return productoExistente;
    }
}