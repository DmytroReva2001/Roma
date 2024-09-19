package romatattoo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import romatattoo.entities.Direccion;
import romatattoo.entities.UserTienda;
import romatattoo.services.DireccionService;
import romatattoo.services.UserTiendaService;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/direcciones")
public class DireccionController {

    private final DireccionService direccionService;
    private final UserTiendaService userTiendaService;

    @Autowired
    public DireccionController(DireccionService direccionService, UserTiendaService userTiendaService) {
        this.direccionService = direccionService;
        this.userTiendaService = userTiendaService;
    }

    @GetMapping
    public List<Direccion> obtenerTodosLosDireccions() {
        return direccionService.obtenerTodosLosDireccions();
    }

    @PostMapping("/add_direccion")
    public ResponseEntity<?> crearDireccion(@RequestBody Map<String, Object> requestBody) {
        try {
            Long id = requestBody.get("id") != null ? Long.valueOf(requestBody.get("id").toString()) : null;
            String email = (String) requestBody.get("email");
            String cp = (String) requestBody.get("cp");
            String direccion = (String) requestBody.get("direccion");
            boolean isPrincipal = Boolean.parseBoolean(requestBody.get("predeterminada").toString());

            // Validaciones
            if (email == null || email.isEmpty()) {
                return ResponseEntity.badRequest().body("El email no puede estar vacío.");
            }

            Optional<UserTienda> optionalUserTienda = userTiendaService.obtenerUserTiendaByEmail(email);
            if (optionalUserTienda.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró un usuario con el email proporcionado.");
            }

            UserTienda userTienda = optionalUserTienda.get();
            Direccion direccionNueva = new Direccion();
            direccionNueva.setId(id);
            direccionNueva.setUserTienda(userTienda);
            direccionNueva.setCp(cp);
            direccionNueva.setDireccion(direccion);
            direccionNueva.setPrincipal(isPrincipal);

            // Manejo de direcciones principales
            if (isPrincipal) {
                List<Direccion> direcciones = direccionService.obtenerDireccionPorUser(email);
                for (Direccion direccionLista : direcciones) {
                    if (direccionLista.isPrincipal()) {
                        direccionLista.setPrincipal(false);
                        direccionService.guardarDireccion(direccionLista);
                    }
                }
            }

            Direccion direccionGuardada = direccionService.guardarDireccion(direccionNueva);
            return ResponseEntity.ok(direccionGuardada);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al crear la dirección: " + e.getMessage());
        }
    }

    @GetMapping("/get_direcciones")
    public ResponseEntity<List<Direccion>> consultarDireccionsUser(@RequestParam String email) {
        Optional<UserTienda> userTienda = userTiendaService.obtenerUserTiendaByEmail(email);

        if (userTienda.isPresent()) {
            List<Direccion> listaDirecciones = direccionService.obtenerDireccionPorUser(email);

            if (listaDirecciones.isEmpty()) {
                return ResponseEntity.noContent().build(); // 204 No Content si no tiene Direccions
            }
            return ResponseEntity.ok(listaDirecciones); // 200 OK con la lista de Direccions
        } else {
            return ResponseEntity.notFound().build(); // 404 si no se encuentra el usuario
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarDireccion(@PathVariable Long id) {
        Optional<Direccion> direccion = direccionService.obtenerDireccionPorId(id);
        if (direccion.isPresent()) {
            direccionService.eliminarDireccion(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}