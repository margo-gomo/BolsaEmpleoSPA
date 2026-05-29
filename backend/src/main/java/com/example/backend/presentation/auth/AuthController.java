package com.example.backend.presentation.auth;

import com.example.backend.logic.Usuario;
import com.example.backend.logic.Service_BolsaEmpleo;
import com.example.backend.security.JwtService;
import com.example.backend.security.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private Service_BolsaEmpleo service_BolsaEmpleo;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            Usuario new_usuario= service_BolsaEmpleo.getUsuarioByCorreo(request.correo());
            if (new_usuario != null &&
                    !"Sí".equalsIgnoreCase(new_usuario.getAutorizado()) &&
                    !"Si".equalsIgnoreCase(new_usuario.getAutorizado())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new ErrorResponse("Tu cuenta está pendiente de aprobación por el administrador"));
            }
            // Spring Security valida correo + clave y llama al UserDetailsServiceImpl
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.correo(),
                            request.clave()
                    )
            );

            UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
            Usuario usuario = userDetails.getUsuario();

            String token = jwtService.generateToken(userDetails);

            // Buscar el nombre según el rol
            String nombre = switch (usuario.getTipoUsuario()) {
                case "Empresa" -> service_BolsaEmpleo.getEmpresa(usuario.getId()).getNombre();
                case "Oferente" -> service_BolsaEmpleo.getOferente(usuario.getId()).getNombre();
                default -> "Administrador";
            };

            return ResponseEntity.ok(new JwtResponse(
                    token,
                    usuario.getTipoUsuario(),
                    nombre,
                    usuario.getId()
            ));

        } catch (BadCredentialsException e) {
            // Correo o clave incorrectos
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Correo o clave incorrectos"));
        }
    }
}