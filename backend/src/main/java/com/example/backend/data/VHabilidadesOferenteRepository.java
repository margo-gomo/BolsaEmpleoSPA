package com.example.backend.data;
import com.example.backend.logic.VHabilidadesOferente;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VHabilidadesOferenteRepository extends CrudRepository <VHabilidadesOferente,String> {
    List<VHabilidadesOferente> findByoferenteUsuarioId(Integer oferenteUsuarioId);
}
