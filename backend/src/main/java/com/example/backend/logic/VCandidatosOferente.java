package com.example.backend.logic;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import org.hibernate.annotations.Immutable;

import java.math.BigDecimal;

@Getter
@Entity
@Immutable
@Table(name = "v_candidatos_oferentes")
public class VCandidatosOferente {
    @Id
    @Size(max = 23)
    @Column(name = "id", length = 23)
    private String id;

    @NotNull
    @Column(name = "puesto_id", nullable = false)
    private Integer puestoId;

    @NotNull
    @Column(name = "oferente_id", nullable = false)
    private Integer oferenteId;

    @Size(max = 45)
    @NotNull
    @Column(name = "nombre", nullable = false, length = 45)
    private String nombre;

    @Size(max = 45)
    @NotNull
    @Column(name = "primer_apellido", nullable = false, length = 45)
    private String primerApellido;

    @NotNull
    @Column(name = "cumple", nullable = false)
    private Long cumple;

    @Column(name = "total")
    private Long total;

    @Column(name = "porcentaje", precision = 26, scale = 2)
    private BigDecimal porcentaje;


}