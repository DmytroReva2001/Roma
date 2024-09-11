package romatattoo.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import romatattoo.entities.UserTienda;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import romatattoo.services.UserTiendaService;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/user_tienda")
public class UserTiendaController {

    // Creación y inyección de servicio
    private final UserTiendaService userTiendaService;

    @Autowired
    public UserTiendaController(UserTiendaService userTiendaService) {
        this.userTiendaService = userTiendaService;
    }

    // Métodos REST para gestión de tabla de usuarios
    @GetMapping("/get_user")
    public Optional<UserTienda> obtenerUserTiendaByEmail(@RequestParam("email") String email) {
        return userTiendaService.obtenerUserTiendaByEmail(email);
    }

    @GetMapping("/activate")
    public ResponseEntity<Map<String, String>> activateUser(@RequestParam("email") String email) {
        try {
            userTiendaService.activateUserByEmail(email);
            // Respuesta de éxito con formato JSON
            Map<String, String> response = Collections.singletonMap("message", "¡Cuenta activada correctamente!");
            return ResponseEntity.ok(response);
        }
        catch (Exception e) {
            // Crear un mensaje de error
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Error al activar la cuenta con email: " + email);

            // Devolver una respuesta con el mensaje de error en formato JSON
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/update_user_data")
    public ResponseEntity<?> updateUser(@RequestBody UserTienda userTienda) {
        try {
            UserTienda userFromDb = userTiendaService.obtenerUserTiendaByEmail(userTienda.getEmail())
                    .orElseThrow(() -> new Exception("Usuario no encontrado"));

            userFromDb.setImagen(userTienda.getImagen());
            userFromDb.setNombre(userTienda.getNombre());
            userFromDb.setApellidos(userTienda.getApellidos());
            userFromDb.setTelefono(userTienda.getTelefono());

            userTiendaService.save(userFromDb);

            // Respuesta de éxito con formato JSON
            Map<String, String> response = Collections.singletonMap("message", "¡Cuenta actualizada correctamente!");
            return ResponseEntity.ok(response);
        }
        catch (Exception e) {
            // Crear un mensaje de error
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Ha ocurrido un error al actualizar la cuenta");

            // Devolver una respuesta con el mensaje de error en formato JSON
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}