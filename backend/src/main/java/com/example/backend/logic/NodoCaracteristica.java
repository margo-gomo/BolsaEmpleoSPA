package com.example.backend.logic;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class NodoCaracteristica {
    private Integer id;
    private String nombre;
    private List<NodoCaracteristica> hijas = new ArrayList<>();
}