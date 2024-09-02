package romatattoo.services;

import romatattoo.entities.Producto;
import romatattoo.repositories.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Service
public class ProductoService {

    // Creamos objeto y lo inyectamos
    private final ProductoRepository productoRepository;

    @Autowired
    public ProductoService(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    // Métodos para la gestión de tabla de Productos
    public List<Producto> obtenerTodosLosProductos() {
        return productoRepository.findAll();
    }

    public Producto obtenerProductoPorId(Long id) {
        Optional<Producto> optionalProducto = productoRepository.findById(id);
        if (optionalProducto.isPresent()) {
            return optionalProducto.get();
        } else {
            // Manejo de caso en el que el producto no se encuentra
            // Puedes lanzar una excepción, retornar null o realizar otro tipo de manejo
            throw new RuntimeException("Producto no encontrado para ID: " + id);
        }
    }

    public Producto crearProducto(Producto producto) {
        // Puedes realizar validaciones adicionales antes de guardar el producto
        return productoRepository.save(producto);
    }

    public Producto actualizarProducto(Long id, Producto producto) {
        // Verificar si el producto existe
        Optional<Producto> optionalProducto = productoRepository.findById(id);
        if (optionalProducto.isPresent()) {
            // Actualizar el producto con los datos proporcionados
            Producto productoExistente = getProductoActualizado(producto, optionalProducto);

            // Guardar el producto actualizado en la base de datos
            return productoRepository.save(productoExistente);
        } else {
            // Manejo de caso en el que el producto no se encuentra
            // Puedes lanzar una excepción, retornar null o realizar otro tipo de manejo
            throw new RuntimeException("Producto no encontrado para ID: " + id);
        }
    }
    public void eliminarProducto(Long id) {
        productoRepository.deleteById(id);
    }

    private static Producto getProductoActualizado(Producto producto, Optional<Producto> optionalProducto) {

        Producto productoExistente = optionalProducto.get();
        productoExistente.setNombreProducto(producto.getNombreProducto());
        productoExistente.setPrecio(producto.getPrecio());
        productoExistente.setDescripcionCorta(producto.getDescripcionCorta());
        productoExistente.setDescripcionLarga(producto.getDescripcionLarga());
        productoExistente.setImagenes(producto.getImagenes());
        productoExistente.setTipoProducto(producto.getTipoProducto());
        return productoExistente;
    }
}