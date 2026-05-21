package com.example.backend.presentation.admin;

import jakarta.validation.constraints.NotBlank;

public record CaracteristicaRequest(
        @NotBlank(message = "El nombre de la característica es obligatorio")
        String nombre,

        Integer idPadre  // opcional, puede ser null si es raíz
) {}