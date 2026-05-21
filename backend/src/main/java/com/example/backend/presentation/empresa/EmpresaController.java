package com.example.backend.presentation.empresa;

import com.example.backend.logic.*;
import com.example.backend.security.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/empresa")
public class EmpresaController {

    @Autowired
    private Service_BolsaEmpleo service;

    // GET /api/empresa/dashboard
    @GetMapping("/dashboard")
    public ResponseEntity<?> dashboard(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        Empresa empresa = service.getEmpresa(userDetails.getUsuario().getId());
        return ResponseEntity.ok(empresa);
    }

    // GET /api/empresa/mis-puestos
    @GetMapping("/mis-puestos")
    public ResponseEntity<?> misPuestos(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(
                service.getPuestosPorEmpresa(userDetails.getUsuario().getId())
        );
    }

    // POST /api/empresa/publicar-puesto
    @PostMapping("/publicar-puesto")
    public ResponseEntity<?> publicarPuesto(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody PublicarPuestoRequest req) {

        Empresa empresa = service.getEmpresa(userDetails.getUsuario().getId());
        Moneda moneda = service.getMoneda(req.idMoneda());

        if (moneda == null) {
            return ResponseEntity.badRequest()
                    .body(new MensajeResponse("Moneda no válida"));
        }

        Puesto puesto = new Puesto();
        puesto.setIdEmpresa(empresa);
        puesto.setDescripcion(req.descripcion());
        puesto.setSalario(req.salario());
        puesto.setIdMoneda(moneda);
        puesto.setTipo(req.tipo()); // "Pública" o "Privada"
        puesto.setActivo("Sí");
        Puesto guardado = service.savePuesto(puesto);

        return ResponseEntity.status(HttpStatus.CREATED).body(guardado.getId());
    }

    // POST /api/empresa/requisitos-puesto/{id}
    @PostMapping("/requisitos-puesto/{id}")
    public ResponseEntity<?> agregarRequisito(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Integer id,
            @Valid @RequestBody RequisitoRequest req) {

        Puesto puesto = service.getPuesto(id);
        if (puesto == null || !puesto.getIdEmpresa().getId().equals(userDetails.getUsuario().getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MensajeResponse("No tenés acceso a este puesto"));
        }

        PuestoCaracId pcId = new PuestoCaracId();
        pcId.setPuestoId(id);
        pcId.setCaracteristicaId(req.idCaracteristica());

        PuestoCarac pc = new PuestoCarac();
        pc.setId(pcId);
        pc.setPuesto(puesto);
        pc.setCaracteristica(service.getCaracteristica(req.idCaracteristica()));
        pc.setNivel(req.nivel());
        service.savePuestoCarac(pc);

        return ResponseEntity.ok(new MensajeResponse("Requisito agregado"));
    }

    // DELETE /api/empresa/requisitos-puesto/{idPuesto}/{idCarac}
    @DeleteMapping("/requisitos-puesto/{idPuesto}/{idCarac}")
    public ResponseEntity<?> eliminarRequisito(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Integer idPuesto,
            @PathVariable Integer idCarac) {

        Puesto puesto = service.getPuesto(idPuesto);
        if (puesto == null || !puesto.getIdEmpresa().getId().equals(userDetails.getUsuario().getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MensajeResponse("No tenés acceso a este puesto"));
        }

        PuestoCaracId pcId = new PuestoCaracId();
        pcId.setPuestoId(idPuesto);
        pcId.setCaracteristicaId(idCarac);
        service.deletePuestoCarac(pcId);

        return ResponseEntity.ok(new MensajeResponse("Requisito eliminado"));
    }

    // PUT /api/empresa/desactivar-puesto/{id}
    @PutMapping("/desactivar-puesto/{id}")
    public ResponseEntity<?> desactivarPuesto(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Integer id) {

        Puesto puesto = service.getPuesto(id);
        if (puesto == null || !puesto.getIdEmpresa().getId().equals(userDetails.getUsuario().getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MensajeResponse("No tenés acceso a este puesto"));
        }
        puesto.setActivo("No");
        service.savePuesto(puesto);
        return ResponseEntity.ok(new MensajeResponse("Puesto desactivado"));
    }

    // GET /api/empresa/buscar-candidatos?puestoId=5
    @GetMapping("/buscar-candidatos")
    public ResponseEntity<?> buscarCandidatos(@RequestParam Integer puestoId) {
        return ResponseEntity.ok(service.getCandidatosPorPuesto(puestoId));
    }

    // GET /api/empresa/detalle-candidato/{id}
    @GetMapping("/detalle-candidato/{id}")
    public ResponseEntity<?> detalleCandidato(@PathVariable Integer id) {
        return ResponseEntity.ok(service.getVDetalleOferente(id));
    }

    @Value("${app.cv.upload-dir}")
    private String uploadDir;

    // GET /api/empresa/cv-candidato/{id}
    @GetMapping("/cv-candidato/{id}")
    public ResponseEntity<?> verCvCandidato(@PathVariable Integer id) {
        try {
            Oferente oferente = service.getOferente(id);

            if (oferente == null || oferente.getRutaCv() == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new MensajeResponse("Este candidato no tiene CV subido"));
            }

            Path archivo = Paths.get(uploadDir).resolve(oferente.getRutaCv());

            if (!Files.exists(archivo)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new MensajeResponse("Archivo no encontrado en el servidor"));
            }

            byte[] contenido = Files.readAllBytes(archivo);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"" + oferente.getRutaCv() + "\"")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(contenido);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MensajeResponse("Error al leer el archivo"));
        }
    }
}