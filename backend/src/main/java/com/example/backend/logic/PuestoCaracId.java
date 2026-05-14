package com.example.backend.logic;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@EqualsAndHashCode
@Embeddable
public class PuestoCaracId implements Serializable {
    private static final long serialVersionUID = 156089673405534569L;
    @NotNull
    @Column(name = "puesto_id", nullable = false)
    private Integer puestoId;

    @NotNull
    @Column(name = "caracteristica_id", nullable = false)
    private Integer caracteristicaId;


}