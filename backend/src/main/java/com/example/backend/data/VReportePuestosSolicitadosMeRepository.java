package com.example.backend.data;
import com.example.backend.logic.VReportePuestosSolicitadosMe;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VReportePuestosSolicitadosMeRepository extends CrudRepository<VReportePuestosSolicitadosMe, String> {
    List<VReportePuestosSolicitadosMe> findByMesIn (List<Integer> mes);
}
