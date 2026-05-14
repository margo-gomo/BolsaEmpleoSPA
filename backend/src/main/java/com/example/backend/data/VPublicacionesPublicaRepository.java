package com.example.backend.data;
import com.example.backend.logic.VPublicacionesPublica;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface VPublicacionesPublicaRepository extends CrudRepository<VPublicacionesPublica, Integer> {
}
