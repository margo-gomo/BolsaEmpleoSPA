package com.example.backend.data;

import com.example.backend.logic.VPuestoCaracteristicasReporte;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface VPuestoCaracReporteRepository extends CrudRepository<VPuestoCaracteristicasReporte, String> {
    List<VPuestoCaracteristicasReporte> findByPuestoId(Integer puestoId);
}
