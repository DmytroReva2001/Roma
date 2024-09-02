package romatattoo.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import romatattoo.entities.Informacion;
import romatattoo.repositories.InformacionRepository;

import java.util.List;
import java.util.Optional;

@Service
public class InformacionService {

    // Creamos objeto y lo inyectamos
    private final InformacionRepository informacionRepository;
    @Autowired
    public InformacionService(InformacionRepository informacionRepository) {
        this.informacionRepository = informacionRepository;
    }

    // Métodos para la gestión de tabla de Información
    public List<Informacion> obtenerTodosLosDatos() {
        return informacionRepository.findAll();
    }

    public Informacion obtenerDatoPorId(Long id) {
        Optional<Informacion> optionalDato = informacionRepository.findById(id);
        if (optionalDato.isPresent()) {
            return optionalDato.get();
        } else {
            // Manejo de caso en el que el producto no se encuentra
            // Puedes lanzar una excepción, retornar null o realizar otro tipo de manejo
            throw new RuntimeException("Producto no encontrado para ID: " + id);
        }
    }

    public Informacion crearDato(Informacion informacion) {
        // Puedes realizar validaciones adicionales antes de guardar el informacio
        return informacionRepository.save(informacion);
    }

    public Informacion actualizarDato(Long id, Informacion informacion) {
        // Verificar si el producto existe
        Optional<Informacion> optionalInformacion = informacionRepository.findById(id);
        if (optionalInformacion.isPresent()) {
            // Actualizar el producto con los datos proporcionados
            Informacion informacionExistente = getDatoActualizado(informacion, optionalInformacion);

            // Guardar el producto actualizado en la base de datos
            return informacionRepository.save(informacionExistente);
        } else {
            // Manejo de caso en el que el producto no se encuentra
            // Puedes lanzar una excepción, retornar null o realizar otro tipo de manejo
            throw new RuntimeException("Producto no encontrado para ID: " + id);
        }
    }
    public void eliminarDato(Long id) {
        informacionRepository.deleteById(id);
    }

    private static Informacion getDatoActualizado(Informacion informacion, Optional<Informacion> optionalInformacion) {

        Informacion productoExistente = optionalInformacion.get();
        productoExistente.setDato(informacion.getDato());
        productoExistente.setValor(informacion.getValor());
        return productoExistente;
    }

    public Informacion obtenerDatoPorNombre(String dato)
    {
        Optional<Informacion> optionalDato = informacionRepository.findInformacionByDato(dato);
        if (optionalDato.isPresent()) {
            return optionalDato.get();
        } else {
            // Manejo de caso en el que el producto no se encuentra
            // Puedes lanzar una excepción, retornar null o realizar otro tipo de manejo
            throw new RuntimeException("Dato no encontrado para nombre de campo: "+dato);
        }
    }
}