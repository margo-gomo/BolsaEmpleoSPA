package com.example.backend.data;
import com.example.backend.logic.OferentePuesto;
import com.example.backend.logic.OferentePuestoId;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OferentePuestoRepository extends CrudRepository<OferentePuesto,OferentePuestoId> {
}
