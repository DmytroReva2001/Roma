package romatattoo.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import romatattoo.entities.Direccion;
import romatattoo.repositories.DireccionRepository;

import java.util.List;
import java.util.Optional;

@Service
public class DireccionService {

    private final DireccionRepository direccionRepository;
    @Autowired
    public DireccionService(DireccionRepository direccionRepository) {
        this.direccionRepository = direccionRepository;
    }

    public List<Direccion> obtenerTodosLosDireccions() {
        return direccionRepository.findAll();
    }

    public Optional<Direccion> obtenerDireccionPorId(Long id) {
        return direccionRepository.findById(id);
    }

    public Direccion guardarDireccion(Direccion Direccion) {
        return direccionRepository.save(Direccion);
    }

    public void eliminarDireccion(Long id) {
        direccionRepository.deleteById(id);
    }

    public List<Direccion> obtenerDireccionPorUser(String email) {
        return direccionRepository.findByUserTiendaEmail(email);
    }
}