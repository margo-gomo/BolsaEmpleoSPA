package com.example.backend.logic;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "oferente_carac")
public class OferenteCarac {
    @EmbeddedId
    private OferenteCaracId id;

    @MapsId("oferenteUsuarioId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "oferente_usuario_id", nullable = false)
    private Oferente oferenteUsuario;

    @MapsId("caracteristicaId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "caracteristica_id", nullable = false)
    private Caracteristica caracteristica;

    @NotNull
    @Column(name = "nivel", nullable = false)
    private Integer nivel;


}