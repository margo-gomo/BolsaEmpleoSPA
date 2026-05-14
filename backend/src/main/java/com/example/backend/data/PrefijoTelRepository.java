package com.example.backend.data;

import com.example.backend.logic.PrefijoTel;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PrefijoTelRepository extends CrudRepository<PrefijoTel, Integer> {
}