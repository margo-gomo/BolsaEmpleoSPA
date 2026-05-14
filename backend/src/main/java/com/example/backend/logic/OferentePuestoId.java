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
public class OferentePuestoId implements Serializable {
    private static final long serialVersionUID = -5342827706592431439L;
    @NotNull
    @Column(name = "oferente_usuario_id", nullable = false)
    private Integer oferenteUsuarioId;

    @NotNull
    @Column(name = "puesto_id", nullable = false)
    private Integer puestoId;


}