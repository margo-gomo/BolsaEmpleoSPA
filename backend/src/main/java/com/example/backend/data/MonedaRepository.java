package com.example.backend.data;

import com.example.backend.logic.Moneda;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MonedaRepository extends CrudRepository<Moneda, Integer> {
}