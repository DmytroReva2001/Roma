package romatattoo.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import romatattoo.entities.ProductoCesta;
import romatattoo.repositories.ProductoCestaRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ProductoCestaService {

    @Autowired
    private ProductoCestaRepository productoCestaRepository;

    public List<ProductoCesta> obtenerProductosCestaPorUserEmail(String email) {
        return productoCestaRepository.findByUserTienda_Email(email);
    }

    public ProductoCesta agregarProductoCesta(ProductoCesta productoCesta) {
        return productoCestaRepository.save(productoCesta);
    }

    public Optional<ProductoCesta> obtenerProductoCestaPorId(Long idProductoCesta)
    {
        return productoCestaRepository.findById(idProductoCesta);
    }

    public void eliminarProductoCesta(ProductoCesta productoCesta)
    {
        productoCestaRepository.delete(productoCesta);
    }
}