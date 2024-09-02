package romatattoo.controllers;

import romatattoo.entities.TipoProducto;
import romatattoo.services.TipoProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tipo_productos")
public class TipoProductoController {

    // Creación y inyección de servicio
    private final TipoProductoService tipoProductoService;
    @Autowired
    public TipoProductoController(TipoProductoService tipoProductoService) {
        this.tipoProductoService = tipoProductoService;
    }

    // Métodos REST para gestión de tabla de tipo de productos
    @GetMapping
    public List<TipoProducto> obtenerTodosLosTiposDeProductos() {
        return tipoProductoService.obtenerTodosLosTiposDeProductos();
    }

    @GetMapping("/{id}")
    public TipoProducto obtenerTipoDeProductoPorId(@PathVariable Long id) {
        return tipoProductoService.obtenerProductoPorId(id);
    }

    @PostMapping
    public TipoProducto crearTipoDeProducto(@RequestBody TipoProducto producto) {
        return tipoProductoService.crearProducto(producto);
    }

    @PutMapping("/{id}")
    public TipoProducto actualizarTipoDeProducto(@PathVariable Long id, @RequestBody TipoProducto producto) {
        return tipoProductoService.actualizarProducto(id, producto);
    }

    @DeleteMapping("/{id}")
    public void eliminarTipoDeProducto(@PathVariable Long id) {
        tipoProductoService.eliminarProducto(id);
    }
}