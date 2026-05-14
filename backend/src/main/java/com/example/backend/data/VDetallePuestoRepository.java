package com.example.backend.data;
import com.example.backend.logic.VDetallePuesto;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface VDetallePuestoRepository extends CrudRepository<VDetallePuesto, Integer> {
}
