package romatattoo.services;

import romatattoo.entities.Tatuaje;
import romatattoo.repositories.TatuajeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TatuajeService {

    // Creamos objeto y lo inyectamos
    private final TatuajeRepository tatuajeRepository;

    @Autowired
    public TatuajeService(TatuajeRepository tatuajeRepository) {
        this.tatuajeRepository = tatuajeRepository;
    }

    // Métodos para la gestión de tabla de Tatuajes
    public List<Tatuaje> obtenerTodosLosTatuajes() {
        return tatuajeRepository.findAll();
    }

    public Tatuaje obtenerTatuajePorId(Long id) {
        Optional<Tatuaje> optionalTatuaje = tatuajeRepository.findById(id);
        if (optionalTatuaje.isPresent()) {
            return optionalTatuaje.get();
        } else {
            throw new RuntimeException("Tatuaje no encontrado para ID: " + id);
        }
    }

    public Tatuaje crearTatuaje(Tatuaje tatuaje) {
        return tatuajeRepository.save(tatuaje);
    }

    public Tatuaje actualizarTatuaje(Long id, Tatuaje tatuaje) {
        Optional<Tatuaje> optionalTatuaje = tatuajeRepository.findById(id);
        if (optionalTatuaje.isPresent()) {
            Tatuaje tatuajeExistente = optionalTatuaje.get();
            tatuajeExistente.setNombreTatuaje(tatuaje.getNombreTatuaje());
            tatuajeExistente.setDescripcion(tatuaje.getDescripcion());
            tatuajeExistente.setImagenes(tatuaje.getImagenes());
            return tatuajeRepository.save(tatuajeExistente);
        } else {
            throw new RuntimeException("Tatuaje no encontrado para ID: " + id);
        }
    }

    public void eliminarTatuaje(Long id) {
        tatuajeRepository.deleteById(id);
    }
}