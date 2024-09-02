package romatattoo.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

// Entidad con config de Lombok y sus campos correspondientes, en formato correspondiente
@Data
@Entity
@Table(name = "productos")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre_producto")
    private String nombreProducto;

    @Column(name = "precio")
    private BigDecimal precio;

    @Column(name = "descripcion_corta")
    private String descripcionCorta;

    @Column(name = "descripcion_larga")
    private String descripcionLarga;

    // Campo especial para guardar imagenes en formato base64 que es formato String
    @ElementCollection
    @CollectionTable(name = "producto_imagenes", joinColumns = @JoinColumn(name = "producto_id"))
    @Column(name = "imagen", columnDefinition = "LONGTEXT")
    private List<String> imagenes;

    @Column(name = "tipo_producto")
    private String tipoProducto;
}