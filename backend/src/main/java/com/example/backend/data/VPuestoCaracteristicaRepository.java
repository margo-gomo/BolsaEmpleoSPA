package com.example.backend.data;
import com.example.backend.logic.VPuestoCaracteristica;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VPuestoCaracteristicaRepository extends CrudRepository<VPuestoCaracteristica, String> {
    List<VPuestoCaracteristica> findByPuestoId(Integer puestoId);
}
