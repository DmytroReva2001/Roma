package romatattoo.entities;

import jakarta.persistence.*;
import lombok.Data;
import org.antlr.v4.runtime.misc.NotNull;

@Data
@Entity
@Table(name = "producto_cesta")
public class ProductoCesta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "producto_id", referencedColumnName = "id")
    private Producto producto;

    @NotNull
    @Column(name = "cantidad_producto")
    private Integer cantidadProducto;

    @NotNull
    @Column(name = "talla")
    private String talla;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private UserTienda userTienda;
}
