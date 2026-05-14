package com.example.backend.data;
import com.example.backend.logic.PuestoCarac;
import com.example.backend.logic.PuestoCaracId;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PuestoCaracRepository extends CrudRepository<PuestoCarac,PuestoCaracId> {
}
