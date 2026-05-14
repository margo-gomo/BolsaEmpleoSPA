package com.example.backend.logic;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "oferente_puesto")
public class OferentePuesto {
    @EmbeddedId
    private OferentePuestoId id;

    @MapsId("oferenteUsuarioId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "oferente_usuario_id", nullable = false)
    private Oferente oferenteUsuario;

    @MapsId("puestoId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "puesto_id", nullable = false)
    private Puesto puesto;

    @ColumnDefault("(curdate())")
    @Column(name = "fecha_solicitud")
    private LocalDate fechaSolicitud;


}