package com.example.backend.data;
import com.example.backend.logic.VDetalleOferente;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface VDetalleOferenteRepository extends CrudRepository<VDetalleOferente,Integer> {
}
