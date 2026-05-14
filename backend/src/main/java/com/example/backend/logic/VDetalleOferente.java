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
@Table(name = "v_detalle_oferente")
public class VDetalleOferente {
    @Id
    @NotNull
    @Column(name = "usuario_id", nullable = false)
    private Integer usuarioId;

    @Size(max = 45)
    @NotNull
    @Column(name = "identificacion", nullable = false, length = 45)
    private String identificacion;

    @Size(max = 45)
    @NotNull
    @Column(name = "nombre", nullable = false, length = 45)
    private String nombre;

    @Size(max = 45)
    @NotNull
    @Column(name = "primer_apellido", nullable = false, length = 45)
    private String primerApellido;

    @Size(max = 45)
    @Column(name = "correo", length = 45)
    private String correo;

    @Size(max = 10)
    @NotNull
    @Column(name = "prefijo", nullable = false, length = 10)
    private String prefijo;

    @NotNull
    @Column(name = "telefono", nullable = false)
    private Integer telefono;

    @Size(max = 45)
    @Column(name = "localidad", length = 45)
    private String localidad;

    @Size(max = 45)
    @Column(name = "ruta_cv", length = 45)
    private String rutaCv;


}