package com.example.backend.presentation.empresa;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record PublicarPuestoRequest(
        @NotBlank(message = "La descripción es obligatoria")
        String descripcion,

        @NotNull(message = "El salario es obligatorio")
        @DecimalMin(value = "0.0", inclusive = false, message = "El salario debe ser mayor a 0")
        BigDecimal salario,

        @NotNull(message = "La moneda es obligatoria")
        Integer idMoneda,

        @NotBlank(message = "El tipo de publicación es obligatorio")
        @Pattern(regexp = "Pública|Privada", message = "El tipo debe ser 'Pública' o 'Privada'")
        String tipo
) {}