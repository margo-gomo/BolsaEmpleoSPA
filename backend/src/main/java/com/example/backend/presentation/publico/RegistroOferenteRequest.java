package com.example.backend.presentation.publico;

public record RegistroOferenteRequest(
        String correo,
        String clave,
        String identificacion,
        String nombre,
        String primerApellido,
        Integer telefono,
        Integer idPais,
        Integer idPrefijoTel,
        Integer idProvinciaCanton
) {}