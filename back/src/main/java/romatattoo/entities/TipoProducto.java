package romatattoo.entities;

import jakarta.persistence.*;
import lombok.Data;

// Entidad con config de Lombok y sus campos correspondientes, en formato correspondiente
@Data
@Entity
@Table(name = "tipo_producto")
public class TipoProducto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tipo_producto")
    private String tipoProducto;
}