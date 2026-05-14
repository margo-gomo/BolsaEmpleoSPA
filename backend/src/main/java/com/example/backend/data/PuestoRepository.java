package com.example.backend.data;

import com.example.backend.logic.Puesto;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PuestoRepository extends CrudRepository<Puesto, Integer> {

    List<Puesto> findByIdEmpresa_IdOrderByIdDesc(Integer empresaId);
}