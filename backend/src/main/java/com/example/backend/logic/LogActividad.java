package com.example.backend.logic;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "log_actividad")
public class LogActividad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Size(max = 10)
    @NotNull
    @Column(name = "tipo_usuario", nullable = false, length = 10)
    private String tipoUsuario;

    @Size(max = 100)
    @NotNull
    @Column(name = "accion", nullable = false, length = 100)
    private String accion;

    @Size(max = 255)
    @Column(name = "detalle")
    private String detalle;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "fecha", nullable = false)
    private Instant fecha;


}