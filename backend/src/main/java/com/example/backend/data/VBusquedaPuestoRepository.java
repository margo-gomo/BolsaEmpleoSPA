package com.example.backend.data;

import com.example.backend.logic.VBusquedaPuesto;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VBusquedaPuestoRepository extends CrudRepository<VBusquedaPuesto, String> {
    List<VBusquedaPuesto> findByAncestroIdIn(List<Integer> ids);
    List<VBusquedaPuesto> findByAncestroIdInAndTipo(List<Integer> ids, String tipo);
    List<VBusquedaPuesto> findByTipo(String tipo);
}