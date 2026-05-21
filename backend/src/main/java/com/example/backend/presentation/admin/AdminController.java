package com.example.backend.presentation.admin;

import com.example.backend.logic.*;
import com.example.backend.security.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private Service_BolsaEmpleo service;

    // GET /api/admin/empresas-pendientes
    @GetMapping("/empresas-pendientes")
    public ResponseEntity<?> empresasPendientes() {
        return ResponseEntity.ok(service.getUsuariosSinAutorizar("Empresa"));
    }

    // PUT /api/admin/autorizar-empresa/{id}
    @PutMapping("/autorizar-empresa/{id}")
    public ResponseEntity<?> autorizarEmpresa(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Integer id) {

        Usuario usuario = service.getUsuario(id);
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MensajeResponse("Empresa no encontrada"));
        }
        usuario.setAutorizado("Sí");
        service.saveUsuario(usuario);

        service.registrarLog(userDetails.getUsuario().getId(), "Admin",
                "AUTORIZAR_EMPRESA", "Empresa id=" + id + " autorizada");

        return ResponseEntity.ok(new MensajeResponse("Empresa autorizada correctamente"));
    }

    // GET /api/admin/oferentes-pendientes
    @GetMapping("/oferentes-pendientes")
    public ResponseEntity<?> oferentesPendientes() {
        return ResponseEntity.ok(service.getUsuariosSinAutorizar("Oferente"));
    }

    // PUT /api/admin/autorizar-oferente/{id}
    @PutMapping("/autorizar-oferente/{id}")
    public ResponseEntity<?> autorizarOferente(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Integer id) {

        Usuario usuario = service.getUsuario(id);
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MensajeResponse("Oferente no encontrado"));
        }
        usuario.setAutorizado("Sí");
        service.saveUsuario(usuario);

        service.registrarLog(userDetails.getUsuario().getId(), "Admin",
                "AUTORIZAR_OFERENTE", "Oferente id=" + id + " autorizado");

        return ResponseEntity.ok(new MensajeResponse("Oferente autorizado correctamente"));
    }

    // GET /api/admin/caracteristicas
    @GetMapping("/caracteristicas")
    public ResponseEntity<?> caracteristicas() {
        return ResponseEntity.ok(service.getArbolCaracteristicas());
    }

    // POST /api/admin/caracteristicas
    @PostMapping("/caracteristicas")
    public ResponseEntity<?> crearCaracteristica(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody CaracteristicaRequest req) {

        if (service.existeCaracteristicaPorNombre(req.nombre())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new MensajeResponse("Ya existe una característica con ese nombre"));
        }
        Caracteristica c = new Caracteristica();
        c.setNombre(req.nombre());
        if (req.idPadre() != null) {
            c.setIdCaracPadre(service.getCaracteristica(req.idPadre()));
        }
        service.saveCaracteristica(c);

        service.registrarLog(userDetails.getUsuario().getId(), "Admin",
                "CREAR_CARACTERISTICA", "Característica '" + req.nombre() + "' creada");

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new MensajeResponse("Característica creada correctamente"));
    }

    // GET /api/admin/logs
    @GetMapping("/logs")
    public ResponseEntity<?> getLogs(@RequestParam(required = false) String tipo) {
        if (tipo != null) {
            return ResponseEntity.ok(service.getLogsPorTipo(tipo));
        }
        return ResponseEntity.ok(service.getAllLogs());
    }

    // GET /api/admin/logs/{usuarioId}
    @GetMapping("/logs/{usuarioId}")
    public ResponseEntity<?> getLogsPorUsuario(@PathVariable Integer usuarioId) {
        return ResponseEntity.ok(service.getLogsPorUsuario(usuarioId));
    }
}