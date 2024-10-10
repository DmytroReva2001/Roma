package romatattoo.services;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Charge;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class PaymentService {

    @Value("${stripe.secret.key}") // Carga la clave secreta de Stripe
    private String secretKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = this.secretKey; // Configura la clave en Stripe después de la inyección
    }

    public Charge charge(String token, double amount) throws StripeException {
        Map<String, Object> chargeParams = new HashMap<>();
        chargeParams.put("amount", (int) (amount * 100)); // Convertir a centavos
        chargeParams.put("currency", "usd");
        chargeParams.put("source", token); // El token recibido del frontend
        chargeParams.put("description", "Compra en mi tienda");

        return Charge.create(chargeParams);
    }
}
