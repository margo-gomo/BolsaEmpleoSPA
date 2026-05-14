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
@Table(name = "v_puesto_caracteristicas")
public class VPuestoCaracteristica {
    @Id
    @Size(max = 23)
    @Column(name = "id", length = 23)
    private String id;

    @NotNull
    @Column(name = "puesto_id", nullable = false)
    private Integer puestoId;

    @Size(max = 45)
    @Column(name = "caracteristica", length = 45)
    private String caracteristica;

    @NotNull
    @Column(name = "nivel", nullable = false)
    private Integer nivel;


}