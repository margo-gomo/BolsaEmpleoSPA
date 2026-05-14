package com.example.backend.logic;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class Breadcrumb {
    private Integer id;
    private String nombre;
    private String url;
}
