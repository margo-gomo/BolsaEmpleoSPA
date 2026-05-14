package com.example.backend.data;

import com.example.backend.logic.Pai;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaiRepository extends CrudRepository<Pai, Integer> {
}