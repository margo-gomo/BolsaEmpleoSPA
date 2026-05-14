package com.example.backend.data;

import com.example.backend.logic.Usuario;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UsuarioRepository extends CrudRepository<Usuario, Integer> {
    Usuario findByCorreo(String correo);
    List<Usuario> findByTipoUsuarioAndAutorizadoOrderByIdAsc(String tipoUsuario, String autorizado);
}