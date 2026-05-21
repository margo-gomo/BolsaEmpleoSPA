package com.example.backend.presentation.oferente;

import jakarta.validation.constraints.*;

public record HabilidadRequest(
        @NotNull(message = "La característica es obligatoria")
        Integer idCaracteristica,

        @NotNull(message = "El nivel es obligatorio")
        @Min(value = 1, message = "El nivel mínimo es 1")
        @Max(value = 5, message = "El nivel máximo es 5")
        Integer nivel
) {}