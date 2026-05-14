package com.example.backend.data;

import com.example.backend.logic.VCandidatosOferente;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VCandidatosOferenteRepository extends CrudRepository<VCandidatosOferente, String> {
    List<VCandidatosOferente> findByPuestoId(Integer id);
}