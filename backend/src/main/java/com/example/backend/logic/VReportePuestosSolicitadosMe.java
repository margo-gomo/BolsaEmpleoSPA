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
@Table(name = "v_reporte_puestos_solicitados_mes")
public class VReportePuestosSolicitadosMe {
    @Id
    @Size(max = 20)
    @Column(name = "id", length = 20)
    private String id;

    @NotNull
    @Column(name = "puesto_id", nullable = false)
    private Integer puestoId;

    @Size(max = 45)
    @NotNull
    @Column(name = "empresa", nullable = false, length = 45)
    private String empresa;

    @Size(max = 50)
    @NotNull
    @Column(name = "descripcion", nullable = false, length = 50)
    private String descripcion;

    @Size(max = 1)
    @NotNull
    @Column(name = "simbolo", nullable = false, length = 1)
    private String simbolo;

    @NotNull
    @Column(name = "salario", nullable = false, precision = 10, scale = 2)
    private BigDecimal salario;

    @Column(name = "mes")
    private Integer mes;

    @Column(name = "anio")
    private Integer anio;

    @NotNull
    @Column(name = "cantidad_solicitudes", nullable = false)
    private Long cantidadSolicitudes;
}