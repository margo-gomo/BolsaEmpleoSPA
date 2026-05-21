package com.example.backend.presentation.publico;

import jakarta.validation.constraints.*;

public record RegistroEmpresaRequest(
        @NotBlank(message = "El correo es obligatorio")
        @Email(message = "Formato de correo inválido")
        String correo,

        @NotBlank(message = "La clave es obligatoria")
        String clave,

        @NotBlank(message = "El nombre es obligatorio")
        String nombre,

        String descripcion,

        @NotNull(message = "El teléfono es obligatorio")
        Integer telefono,

        @NotNull(message = "La localización es obligatoria")
        Integer idProvinciaCanton,

        @NotNull(message = "El prefijo telefónico es obligatorio")
        Integer idPrefijoTel
) {}