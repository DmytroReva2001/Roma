package romatattoo.controllers;

import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import romatattoo.entities.Informacion;
import romatattoo.services.EmailService;
import romatattoo.services.InformacionService;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class EmailController {

    // Inyectamos clase Service
    @Autowired
    private EmailService emailService;

    @Autowired
    private InformacionService informacionService;

    // Inyectamos la variable de nombre de empresa desde application.properties
    @Value("${app.company}")
    private String companyName;

    // Método para configurar la plantilla de correo y enviarlo a base de Service
    public String sendEmail(String to, String name, String subject, String mensaje, String token) {

        // Consultamos logo de empresa
        Informacion logoInfo = informacionService.obtenerDatoPorNombre("Logo");
        String logo = logoInfo.getValor();

        Map<String, Object> variables = new HashMap<>();
        variables.put("name", name);
        variables.put("subject", subject);
        variables.put ("mensaje", mensaje);
        variables.put ("companyName", companyName);
        variables.put ("email", to);
        variables.put ("token", token);
        variables.put ("logo",logo);

        // Enviamos email con plantilla creada
        try {
            emailService.sendEmail(to, subject, "email", variables);
        } catch (MessagingException e) {
            e.printStackTrace();
            return "Error al enviar email";
        }
        return "Email enviado correctamente";
    }
}
