package romatattoo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import romatattoo.entities.Producto;
import romatattoo.entities.ProductoCesta;
import romatattoo.entities.UserTienda;
import romatattoo.services.ProductoCestaService;
import romatattoo.services.ProductoService;
import romatattoo.services.UserTiendaService;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/api/cesta")
public class ProductoCestaController {

    private final ProductoCestaService productoCestaService;
    private final ProductoService productoService;
    private final UserTiendaService userTiendaService;

    @Autowired
    public ProductoCestaController(ProductoCestaService productoCestaService, ProductoService productoService, UserTiendaService userTiendaService) {
        this.productoCestaService = productoCestaService;
        this.productoService = productoService;
        this.userTiendaService = userTiendaService;
    }

    // Obtener los productos de la cesta de un usuario por su email
    @GetMapping("/get_cart_products")
    public ResponseEntity<List<ProductoCesta>> obtenerProductoCestaPorEmail(@RequestParam("email") String email) {
        List<ProductoCesta> productosCesta = productoCestaService.obtenerProductosCestaPorUserEmail(email);

        // Verificar si la lista está vacía
        if (productosCesta.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        // Devolver la lista de productos
        return ResponseEntity.ok(productosCesta);
    }

    @GetMapping("/add_producto")
    public ResponseEntity<?> agregarProductoCesta(@RequestParam("email") String email,
                                                  @RequestParam("idProducto") Long idProducto,
                                                  @RequestParam("cantidad") int cantidad) {
        // Buscar el producto por id
        Producto producto = productoService.obtenerProductoPorId(idProducto);
        if (producto == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Producto no encontrado");
        }

        // Buscar el usuario por email
        Optional<UserTienda> userTiendaOpt = userTiendaService.obtenerUserTiendaByEmail(email);
        if (userTiendaOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
        }

        List<ProductoCesta> productosCestaUsuario = productoCestaService.obtenerProductosCestaPorUserEmail(email);

        // Comprobar que id producto pasado por parámetro no coincida con ninguno de los productos de productosCestaUsuario
        for (ProductoCesta productoCesta : productosCestaUsuario) {

            if (Objects.equals(productoCesta.getProducto().getId(), idProducto))
            {
                productoCesta.setCantidadProducto(productoCesta.getCantidadProducto()+cantidad);

                ProductoCesta altaProductoCesta = productoCestaService.agregarProductoCesta(productoCesta);
                return ResponseEntity.ok(altaProductoCesta);
            }
        }

        // Crear la entidad ProductoCesta
        ProductoCesta productoCesta = new ProductoCesta();
        productoCesta.setCantidadProducto(cantidad);
        productoCesta.setProducto(producto);
        productoCesta.setUserTienda(userTiendaOpt.get());

        // Agregar el producto a la cesta
        ProductoCesta nuevoProductoCesta = productoCestaService.agregarProductoCesta(productoCesta);

        // Devolver el resultado
        return ResponseEntity.ok(nuevoProductoCesta);
    }

    @GetMapping("/delete_producto")
    public ResponseEntity<?> eliminarProductoCesta(@RequestParam("email") String email,
                                                   @RequestParam("idProductoCesta") Long idProductoCesta) {
        // Buscar el producto por id
        Optional<ProductoCesta> optionalProductoCesta = productoCestaService.obtenerProductoCestaPorId(idProductoCesta);

        if (optionalProductoCesta.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Producto no encontrado");
        }

        ProductoCesta productoCesta = optionalProductoCesta.get();

        // Buscar el usuario por email
        Optional<UserTienda> userTiendaOpt = userTiendaService.obtenerUserTiendaByEmail(email);
        if (userTiendaOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
        }

        UserTienda userTienda = userTiendaOpt.get();

        // Verificar si el producto pertenece a la cesta del usuario
        if (!productoCesta.getUserTienda().equals(userTienda)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No autorizado para eliminar este producto");
        }

        // Agregar el producto a la cesta
        productoCestaService.eliminarProductoCesta(productoCesta);

        // Devolver el resultado
        return ResponseEntity.ok(Map.of("message", "Producto eliminado"));
    }

    @GetMapping("/modify_producto")
    public ResponseEntity<?> modificarProductoCesta(@RequestParam("idProductoCesta") Long idProductoCesta,
                                                    @RequestParam("cantidad") int cantidad) {
        // Buscar el producto por id
        Optional<ProductoCesta> optionalProductoCesta = productoCestaService.obtenerProductoCestaPorId(idProductoCesta);

        if (optionalProductoCesta.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Producto no encontrado"));
        }

        ProductoCesta productoCesta = optionalProductoCesta.get();
        productoCesta.setCantidadProducto(cantidad);
        // Agregar el producto a la cesta
        productoCestaService.agregarProductoCesta(productoCesta);

        // Devolver el resultado
        return ResponseEntity.ok(Map.of("message", "Producto actualizado"));
    }
}