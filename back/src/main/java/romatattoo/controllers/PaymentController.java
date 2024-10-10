package romatattoo.controllers;

import com.stripe.exception.StripeException;
import com.stripe.model.Charge;
import com.stripe.model.PaymentMethod;
import com.stripe.model.PaymentMethodCollection;
import com.stripe.param.PaymentMethodListParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import romatattoo.entities.UserTienda;
import romatattoo.services.PaymentService;
import romatattoo.services.UserTiendaService;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    UserTiendaService userTiendaService;

    @PostMapping
    public Charge charge(@RequestBody Map<String, Object> payload) throws StripeException {
        String token = (String) payload.get("token");
        double amount = ((Number) payload.get("amount")).doubleValue();

        return paymentService.charge(token, amount);
    }

    @GetMapping("/check-payment-option")
    public ResponseEntity<Map<String, Boolean>> checkPaymentOption(@RequestParam String email) {
        // Obtener el usuario a partir del email
        Optional<UserTienda> userTiendaOptional = userTiendaService.obtenerUserTiendaByEmail(email);

        if (userTiendaOptional.isEmpty()) {
            // El email no se encuentra
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("El email no fue encontrado.", false));
        }

        try {
            // Listar los métodos de pago del cliente
            PaymentMethodListParams params = PaymentMethodListParams.builder()
                    .setCustomer(email)
                    .setType(PaymentMethodListParams.Type.CARD)
                    .setLimit(3L) // Limita a 3 métodos de pago (opcional)
                    .build();

            PaymentMethodCollection paymentMethods = PaymentMethod.list(params);

            boolean tieneMetodoDePago = !paymentMethods.getData().isEmpty();

            // Crear la respuesta
            Map<String, Boolean> response = new HashMap<>();
            response.put("tieneMetodoDePago", tieneMetodoDePago);

            return ResponseEntity.ok(response);

        } catch (StripeException e) {
            // Manejo de errores, puedes agregar logs o responder con un error adecuado
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("Error al verificar el método de pago: " + e.getMessage(), false));
        }
    }

}