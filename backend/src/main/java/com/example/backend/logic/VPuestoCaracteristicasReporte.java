package com.example.backend.logic;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import org.hibernate.annotations.Immutable;

@Getter
@Entity
@Immutable
@Table(name = "v_puesto_caracteristicas_reporte")
public class VPuestoCaracteristicasReporte {
    @Id
    @Size(max = 23)
    @Column(name = "id", length = 23)
    private String id;

    @NotNull
    @Column(name = "puesto_id", nullable = false)
    private Integer puestoId;

    @Size(max = 45)
    @NotNull
    @Column(name = "caracteristica", nullable = false, length = 45)
    private String caracteristica;

    @NotNull
    @Column(name = "nivel", nullable = false)
    private Integer nivel;


}