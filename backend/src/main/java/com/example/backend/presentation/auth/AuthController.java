package com.example.backend.presentation.auth;

import com.example.backend.data.EmpresaRepository;
import com.example.backend.data.OferenteRepository;
import com.example.backend.logic.Usuario;
import com.example.backend.security.JwtService;
import com.example.backend.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
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
    private EmpresaRepository empresaRepository;

    @Autowired
    private OferenteRepository oferenteRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
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
                case "Empresa" -> empresaRepository.findById(usuario.getId())
                        .map(e -> e.getNombre()).orElse("Empresa");
                case "Oferente" -> oferenteRepository.findById(usuario.getId())
                        .map(o -> o.getNombre()).orElse("Oferente");
                default -> "Administrador";
            };

            return ResponseEntity.ok(new JwtResponse(
                    token,
                    usuario.getTipoUsuario(),
                    nombre,
                    usuario.getId()
            ));

        } catch (DisabledException e) {
            // Usuario existe pero no está autorizado por el admin
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ErrorResponse("Tu cuenta está pendiente de aprobación por el administrador"));

        } catch (BadCredentialsException e) {
            // Correo o clave incorrectos
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Correo o clave incorrectos"));
        }
    }
}