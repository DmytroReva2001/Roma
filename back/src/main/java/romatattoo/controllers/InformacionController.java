package romatattoo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import romatattoo.entities.Informacion;
import romatattoo.services.InformacionService;

import java.util.List;

@RestController
@RequestMapping("/api/informacion")
public class InformacionController {

    // Objeto de servicio
    private final InformacionService informacionService;

    // Inyección
    @Autowired
    public InformacionController(InformacionService informacionService) {
        this.informacionService = informacionService;
    }

    // Métodos REST para la gestión de tabla de información
    @GetMapping
    public List<Informacion> obtenerTodosLosTiposDeProductos() {
        return informacionService.obtenerTodosLosDatos();
    }

    @GetMapping("/{id}")
    public Informacion obtenerTipoDeProductoPorId(@PathVariable Long id) {
        return informacionService.obtenerDatoPorId(id);
    }

    @PostMapping
    public Informacion crearTipoDeProducto(@RequestBody Informacion informacion) {
        return informacionService.crearDato(informacion);
    }

    @PutMapping("/{id}")
    public Informacion actualizarTipoDeProducto(@PathVariable Long id, @RequestBody Informacion informacion) {
        return informacionService.actualizarDato(id, informacion);
    }

    @DeleteMapping("/{id}")
    public void eliminarTipoDeProducto(@PathVariable Long id) {
        informacionService.eliminarDato(id);
    }
}