package com.example.backend.security;

import com.example.backend.data.UsuarioRepository;
import com.example.backend.logic.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String correo) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByCorreo(correo);

        if (usuario == null) {
            throw new UsernameNotFoundException("No existe un usuario con el correo " + correo);
        }

        if (!"Sí".equals(usuario.getAutorizado())) {
            throw new UsernameNotFoundException("El usuario no está autorizado por el administrador");
        }

        return new UserDetailsImpl(usuario);
    }
}
