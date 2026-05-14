package com.example.backend.data;
import com.example.backend.logic.VHijosCaracteristica;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VHijosCaracteristicaRepository extends CrudRepository<VHijosCaracteristica, Integer> {
    List<VHijosCaracteristica> findByPadreId(Integer padreId);

    List<VHijosCaracteristica> findByPadreIdIsNull();
}
