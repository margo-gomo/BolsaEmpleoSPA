package com.example.backend.presentation.publico;

public record RegistroEmpresaRequest(
        String correo,
        String clave,
        String nombre,
        String descripcion,
        Integer telefono,
        Integer idProvinciaCanton,
        Integer idPrefijoTel
) {}