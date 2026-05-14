package com.example.backend.data;

import com.example.backend.logic.VReporteSalariosAlto;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface VReporteSalariosAltoRepository extends CrudRepository<VReporteSalariosAlto, Integer> {
}
