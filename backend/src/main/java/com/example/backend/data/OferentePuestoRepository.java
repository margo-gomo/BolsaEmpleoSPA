package com.example.backend.data;

import com.example.backend.logic.OferentePuesto;
import com.example.backend.logic.OferentePuestoId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OferentePuestoRepository extends JpaRepository<OferentePuesto, OferentePuestoId> {
    List<OferentePuesto> findByOferenteUsuarioId(Integer oferenteUsuarioId);
    List<OferentePuesto> findByPuestoId(Integer puestoId);
}