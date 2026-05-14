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
@Table(name = "v_detalle_puesto")
public class VDetallePuesto {
    @Id
    @NotNull
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 45)
    @NotNull
    @Column(name = "empresa", nullable = false, length = 45)
    private String empresa;

    @NotNull
    @Column(name = "empresa_id", nullable = false)
    private Integer empresaId;

    @Size(max = 22)
    @Column(name = "telefono_empresa", length = 22)
    private String telefonoEmpresa;

    @Size(max = 45)
    @Column(name = "localidad", length = 45)
    private String localidad;

    @Size(max = 50)
    @NotNull
    @Column(name = "descripcion", nullable = false, length = 50)
    private String descripcion;

    @Size(max = 1)
    @NotNull
    @Column(name = "simbolo", nullable = false, length = 1)
    private String simbolo;

    @Size(max = 5)
    @NotNull
    @Column(name = "moneda", nullable = false, length = 5)
    private String moneda;

    @NotNull
    @Column(name = "salario", nullable = false, precision = 10, scale = 2)
    private BigDecimal salario;

    @Size(max = 10)
    @NotNull
    @Column(name = "tipo", nullable = false, length = 10)
    private String tipo;


}