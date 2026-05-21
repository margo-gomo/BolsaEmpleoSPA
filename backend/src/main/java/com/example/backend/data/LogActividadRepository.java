package com.example.backend.data;

import com.example.backend.logic.LogActividad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LogActividadRepository extends JpaRepository<LogActividad, Integer> {
    List<LogActividad> findAllByOrderByFechaDesc();
    List<LogActividad> findByTipoUsuarioOrderByFechaDesc(String tipoUsuario);
    List<LogActividad> findByUsuario_IdOrderByFechaDesc(Integer usuarioId);
}