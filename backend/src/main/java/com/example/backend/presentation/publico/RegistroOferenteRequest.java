package com.example.backend.presentation.publico;

import jakarta.validation.constraints.*;

public record RegistroOferenteRequest(
        @NotBlank(message = "El correo es obligatorio")
        @Email(message = "Formato de correo inválido")
        String correo,

        @NotBlank(message = "La clave es obligatoria")
        @Size(min = 6, message = "La clave debe tener al menos 6 caracteres")
        String clave,

        @NotBlank(message = "La identificación es obligatoria")
        String identificacion,

        @NotBlank(message = "El nombre es obligatorio")
        String nombre,

        @NotBlank(message = "El primer apellido es obligatorio")
        String primerApellido,

        @NotNull(message = "El teléfono es obligatorio")
        Integer telefono,

        @NotNull(message = "El país es obligatorio")
        Integer idPais,

        @NotNull(message = "El prefijo telefónico es obligatorio")
        Integer idPrefijoTel,

        @NotNull(message = "La localización es obligatoria")
        Integer idProvinciaCanton
) {}