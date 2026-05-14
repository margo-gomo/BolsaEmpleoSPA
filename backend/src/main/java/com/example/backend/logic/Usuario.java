package com.example.backend.logic;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

@Getter
@Setter
@Entity
@Table(name = "usuario")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 45)
    @NotNull
    @Column(name = "correo", nullable = false, length = 45)
    private String correo;

    @Size(max = 255)
    @Column(name = "clave")
    private String clave;

    @Size(max = 10)
    @NotNull
    @Column(name = "tipo_usuario", nullable = false, length = 10)
    private String tipoUsuario;
    @Size(max = 2)
    @NotNull
    @ColumnDefault("'No'")
    @Column(name = "autorizado", nullable = false, length = 2)
    private String autorizado;


}