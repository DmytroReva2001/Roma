package romatattoo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import romatattoo.entities.Pedido;
import romatattoo.entities.Producto;
import romatattoo.entities.ProductoPedido;
import romatattoo.entities.UserTienda;
import romatattoo.services.PedidoService;
import romatattoo.services.ProductoPedidoService;
import romatattoo.services.ProductoService;
import romatattoo.services.UserTiendaService;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;
    private final UserTiendaService userTiendaService;
    private final ProductoService productoService;
    private final ProductoPedidoService productoPedidoService;

    @Autowired
    public PedidoController(PedidoService pedidoService, UserTiendaService userTiendaService, ProductoService productoService, ProductoPedidoService productoPedidoService) {
        this.pedidoService = pedidoService;
        this.userTiendaService = userTiendaService;
        this.productoService = productoService;
        this.productoPedidoService = productoPedidoService;
    }

    @GetMapping
    public List<Pedido> obtenerTodosLosPedidos() {
        return pedidoService.obtenerTodosLosPedidos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pedido> obtenerPedidoPorId(@PathVariable Long id) {
        Optional<Pedido> pedido = pedidoService.obtenerPedidoPorId(id);
        return pedido.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/crear_pedido")
    public ResponseEntity<?> crearPedido(@RequestParam("email") String email, @RequestParam("total") BigDecimal total) {
        try {
            // Verificar si el email es válido
            if (email == null || email.isEmpty()) {
                return ResponseEntity.badRequest().body("El email no puede estar vacío.");
            }

            // Obtener el usuario basado en el email
            Optional<UserTienda> optionalUserTienda = userTiendaService.obtenerUserTiendaByEmail(email);

            if (optionalUserTienda.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No se encontró un usuario con el email proporcionado.");
            }

            UserTienda userTienda = optionalUserTienda.get();

            // Crear un nuevo pedido
            Pedido pedido = new Pedido();
            pedido.setUserTienda(userTienda);
            pedido.setFecha(LocalDateTime.now());
            pedido.setTotal(total);

            // Guardar el pedido
            Pedido pedidoGuardado = pedidoService.guardarPedido(pedido);

            // Devolver la respuesta con el pedido creado
            return ResponseEntity.ok(pedidoGuardado);

        } catch (Exception e) {
            // Manejar cualquier excepción no controlada
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al crear el pedido: " + e.getMessage());
        }
    }


    @PostMapping("/agregar_productos")
    public ResponseEntity<Void> agregarProductos(@RequestBody Map<String, Object> requestBody) {
        // Obtener pedidoId del requestBody
        Long pedidoId = ((Number) requestBody.get("pedidoId")).longValue();

        // Obtener la lista de productosPedidos del requestBody
        List<Map<String, Object>> productosPedidosData = (List<Map<String, Object>>) requestBody.get("productosPedidos");

        // Buscar el pedido
        Optional<Pedido> optionalPedido = pedidoService.obtenerPedidoPorId(pedidoId);
        if (optionalPedido.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Pedido pedido = optionalPedido.get();

        // Procesar cada productoPedido
        for (Map<String, Object> productoPedidoData : productosPedidosData) {
            Long productoId = ((Number) productoPedidoData.get("productoId")).longValue();
            Integer cantidad = ((Number) productoPedidoData.get("cantidad")).intValue();

            Producto producto = productoService.obtenerProductoPorId(productoId);
            if (producto == null) {
                return ResponseEntity.notFound().build();
            }

            ProductoPedido productoPedido = new ProductoPedido();
            productoPedido.setProducto(producto);
            productoPedido.setCantidadProducto(cantidad);
            productoPedido.setPedido(pedido);

            productoPedidoService.guardarPedidoProducto(productoPedido);
        }

        return ResponseEntity.ok().build();
    }


    @GetMapping("/get_pedidos")
    public ResponseEntity<List<Pedido>> consultarPedidosUser(@RequestParam String email) {
        Optional<UserTienda> userTienda = userTiendaService.obtenerUserTiendaByEmail(email);

        if (userTienda.isPresent()) {
            List<Pedido> listaPedidos = pedidoService.obtenerPedidoPorUser(email);

            if (listaPedidos.isEmpty()) {
                return ResponseEntity.noContent().build(); // 204 No Content si no tiene pedidos
            }
            return ResponseEntity.ok(listaPedidos); // 200 OK con la lista de pedidos
        } else {
            return ResponseEntity.notFound().build(); // 404 si no se encuentra el usuario
        }
    }

    @GetMapping("/productos_pedido")
    public ResponseEntity<?> getProductosPedido(@RequestParam Long idPedido) {
        // Obtener el pedido por id
        return pedidoService.obtenerPedidoPorId(idPedido)
                .map(pedido -> {
                    List<ProductoPedido> productosPedido = productoPedidoService.obtenerPedidoProductosPorPedido(pedido);

                    if (productosPedido.isEmpty()) {
                        return ResponseEntity.noContent().build(); // 204 si no hay productos
                    }
                    return ResponseEntity.ok(productosPedido); // 200 OK con la lista de productos
                })
                .orElse(ResponseEntity.notFound().build()); // 404 si el pedido no se encuentra
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPedido(@PathVariable Long id) {
        Optional<Pedido> pedido = pedidoService.obtenerPedidoPorId(id);
        if (pedido.isPresent()) {
            pedidoService.eliminarPedido(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}