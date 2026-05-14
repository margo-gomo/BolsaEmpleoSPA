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
@Table(name = "v_reporte_salarios_altos")
public class VReporteSalariosAlto {
    @Id
    @NotNull
    @Column(name = "puesto_id", nullable = false)
    private Integer puestoId;

    @Size(max = 5)
    @NotNull
    @Column(name = "moneda", nullable = false, length = 5)
    private String moneda;

    @Size(max = 1)
    @NotNull
    @Column(name = "simbolo", nullable = false, length = 1)
    private String simbolo;

    @Size(max = 45)
    @NotNull
    @Column(name = "empresa", nullable = false, length = 45)
    private String empresa;

    @Size(max = 50)
    @NotNull
    @Column(name = "puesto", nullable = false, length = 50)
    private String puesto;

    @Size(max = 5)
    @NotNull
    @Column(name = "activo", nullable = false, length = 5)
    private String activo;

    @NotNull
    @Column(name = "salario", nullable = false, precision = 10, scale = 2)
    private BigDecimal salario;

    @Column(name = "salario_convertido", precision = 13, scale = 2)
    private BigDecimal salarioConvertido;


}