package romatattoo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import romatattoo.entities.ProductoCesta;
import romatattoo.services.ProductoCestaService;

import java.util.List;

@RestController
@RequestMapping("/api/cesta")
public class ProductoCestaController {

    private final ProductoCestaService productoCestaService;

    @Autowired
    public ProductoCestaController(ProductoCestaService productoCestaService) {
        this.productoCestaService = productoCestaService;
    }

    // Obtener los productos de la cesta de un usuario por su email
    @GetMapping("/get_cart_products")
    public ResponseEntity<List<ProductoCesta>> obtenerProductoCestaPorEmail(@RequestParam("email") String email) {
        List<ProductoCesta> productosCesta = productoCestaService.obtenerProductoCestaPorUserEmail(email);

        // Verificar si la lista está vacía
        if (productosCesta.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        // Devolver la lista de productos
        return ResponseEntity.ok(productosCesta);
    }

    @PostMapping("/add")
    public ResponseEntity<ProductoCesta> agregarProductoCesta(@RequestBody ProductoCesta productoCesta) {
        ProductoCesta nuevoProductoCesta = productoCestaService.agregarProductoCesta(productoCesta);
        return ResponseEntity.ok(nuevoProductoCesta);
    }
}