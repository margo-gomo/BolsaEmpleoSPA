package com.example.backend.logic;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "moneda")
public class Moneda {
    @Id
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 5)
    @NotNull
    @Column(name = "codigo", nullable = false, length = 5)
    private String codigo;

    @Size(max = 10)
    @NotNull
    @Column(name = "nombre", nullable = false, length = 10)
    private String nombre;

    @Size(max = 1)
    @NotNull
    @Column(name = "simbolo", nullable = false, length = 1)
    private String simbolo;


}