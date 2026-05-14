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
public class OferenteCaracId implements Serializable {
    private static final long serialVersionUID = 933870522157085888L;
    @NotNull
    @Column(name = "oferente_usuario_id", nullable = false)
    private Integer oferenteUsuarioId;

    @NotNull
    @Column(name = "caracteristica_id", nullable = false)
    private Integer caracteristicaId;


}