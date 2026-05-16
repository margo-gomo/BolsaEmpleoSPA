package com.example.backend.presentation.empresa;

import java.math.BigDecimal;

public record PublicarPuestoRequest(
        String descripcion,
        BigDecimal salario,
        Integer idMoneda,
        String tipo
) {}