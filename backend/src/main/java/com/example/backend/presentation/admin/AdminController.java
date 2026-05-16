package com.example.backend.presentation.admin;

import com.example.backend.logic.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<?> autorizarEmpresa(@PathVariable Integer id) {
        Usuario usuario = service.getUsuario(id);
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MensajeResponse("Empresa no encontrada"));
        }
        usuario.setAutorizado("Sí");
        service.saveUsuario(usuario);
        return ResponseEntity.ok(new MensajeResponse("Empresa autorizada correctamente"));
    }

    // GET /api/admin/oferentes-pendientes
    @GetMapping("/oferentes-pendientes")
    public ResponseEntity<?> oferentesPendientes() {
        return ResponseEntity.ok(service.getUsuariosSinAutorizar("Oferente"));
    }

    // PUT /api/admin/autorizar-oferente/{id}
    @PutMapping("/autorizar-oferente/{id}")
    public ResponseEntity<?> autorizarOferente(@PathVariable Integer id) {
        Usuario usuario = service.getUsuario(id);
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MensajeResponse("Oferente no encontrado"));
        }
        usuario.setAutorizado("Sí");
        service.saveUsuario(usuario);
        return ResponseEntity.ok(new MensajeResponse("Oferente autorizado correctamente"));
    }

    // GET /api/admin/caracteristicas
    @GetMapping("/caracteristicas")
    public ResponseEntity<?> caracteristicas() {
        return ResponseEntity.ok(service.getArbolCaracteristicas());
    }

    // POST /api/admin/caracteristicas
    @PostMapping("/caracteristicas")
    public ResponseEntity<?> crearCaracteristica(@RequestBody CaracteristicaRequest req) {
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
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new MensajeResponse("Característica creada correctamente"));
    }
}