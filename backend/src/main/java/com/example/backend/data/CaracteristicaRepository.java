package com.example.backend.data;

import com.example.backend.logic.Caracteristica;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CaracteristicaRepository extends CrudRepository<Caracteristica, Integer> {
    Caracteristica findByNombre(String nombre);
}