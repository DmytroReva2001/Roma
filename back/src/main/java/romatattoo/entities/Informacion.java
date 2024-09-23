package romatattoo.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// Entidad con config de Lombok y sus campos correspondientes, en formato correspondiente
@Data
@Entity
@Table(name = "informacion")
@AllArgsConstructor
@NoArgsConstructor
public class Informacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "dato")
    private String dato;

    @Column(name = "valor", columnDefinition = "LONGTEXT")
    private String valor;

    @Column(name = "tipoDato")
    private String tipoDato;
}