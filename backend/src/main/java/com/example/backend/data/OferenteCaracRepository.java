package com.example.backend.data;
import com.example.backend.logic.OferenteCarac;
import com.example.backend.logic.OferenteCaracId;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OferenteCaracRepository extends CrudRepository<OferenteCarac,OferenteCaracId>{
}
