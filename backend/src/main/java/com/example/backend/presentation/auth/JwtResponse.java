package com.example.backend.presentation.auth;

public record JwtResponse(
        String token,
        String rol,
        String nombre,
        Integer id
) {}