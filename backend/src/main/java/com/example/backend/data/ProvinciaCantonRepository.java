package com.example.backend.data;

import com.example.backend.logic.ProvinciaCanton;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProvinciaCantonRepository extends CrudRepository<ProvinciaCanton, Integer> {

    Iterable<ProvinciaCanton> findByIdProvincia_IdOrderByNombreAsc(Integer idProvincia);

    List<ProvinciaCanton> findByIdProvinciaIsNull();

    List<ProvinciaCanton> findByIdProvinciaIsNotNull();

    List<ProvinciaCanton> findByIdProvincia_Id(Integer idProvincia);
}