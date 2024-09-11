package romatattoo.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import romatattoo.entities.ProductoCesta;
import romatattoo.repositories.ProductoCestaRepository;

import java.util.List;

@Service
public class ProductoCestaService {

    @Autowired
    private ProductoCestaRepository productoCestaRepository;

    public List<ProductoCesta> obtenerProductoCestaPorUserEmail(String email) {
        return productoCestaRepository.findByUserTienda_Email(email);
    }

    public ProductoCesta agregarProductoCesta(ProductoCesta productoCesta) {
        return productoCestaRepository.save(productoCesta);
    }
}