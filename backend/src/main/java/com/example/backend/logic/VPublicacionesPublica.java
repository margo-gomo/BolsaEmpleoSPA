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
@Table(name = "v_publicaciones_publicas")
public class VPublicacionesPublica {
    @Id
    @NotNull
    @Column(name = "id", nullable = false)
    private Integer id;

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
    @Column(name = "moneda", nullable = false, length = 1)
    private String moneda;

    @NotNull
    @Column(name = "salario", nullable = false, precision = 10, scale = 2)
    private BigDecimal salario;


}