package com.example.backend.presentation.oferente;

import com.example.backend.logic.*;
import com.example.backend.security.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;

@RestController
@RequestMapping("/api/oferente")
public class OferenteController {

    @Autowired
    private Service_BolsaEmpleo service;

    // GET /api/oferente/dashboard
    @GetMapping("/dashboard")
    public ResponseEntity<?> dashboard(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        Oferente oferente = service.getOferente(userDetails.getUsuario().getId());
        return ResponseEntity.ok(oferente);
    }

    // GET /api/oferente/habilidades
    @GetMapping("/habilidades")
    public ResponseEntity<?> habilidades(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(
                service.getVHabilidadesOferente(userDetails.getUsuario().getId())
        );
    }

    // POST /api/oferente/habilidades
    @PostMapping("/habilidades")
    public ResponseEntity<?> guardarHabilidad(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody HabilidadRequest req) {

        OferenteCaracId id = new OferenteCaracId();
        id.setOferenteUsuarioId(userDetails.getUsuario().getId());
        id.setCaracteristicaId(req.idCaracteristica());

        // Si ya existe, actualizamos el nivel
        OferenteCarac oc = service.getOferenteCarac(id);
        if (oc == null) {
            oc = new OferenteCarac();
            oc.setId(id);
            oc.setOferenteUsuario(service.getOferente(userDetails.getUsuario().getId()));
            oc.setCaracteristica(service.getCaracteristica(req.idCaracteristica()));
        }
        oc.setNivel(req.nivel());
        service.saveOferenteCarac(oc);

        return ResponseEntity.ok(new MensajeResponse("Habilidad guardada"));
    }

    @Value("${app.cv.upload-dir}")
    private String uploadDir;

    // POST /api/oferente/cv
    @PostMapping("/cv")
    public ResponseEntity<?> subirCv(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam("archivo") MultipartFile archivo) {

        // Validar que sea PDF
        if (archivo.isEmpty() || !Objects.requireNonNull(archivo.getContentType()).equals("application/pdf")) {
            return ResponseEntity.badRequest()
                    .body(new MensajeResponse("Solo se permiten archivos PDF"));
        }

        try {
            // Crear carpeta si no existe
            Path carpeta = Paths.get(uploadDir);
            if (!Files.exists(carpeta)) {
                Files.createDirectories(carpeta);
            }

            // Nombre único para evitar colisiones: cv_{idUsuario}.pdf
            String nombreArchivo = "cv_" + userDetails.getUsuario().getId() + ".pdf";
            Path destino = carpeta.resolve(nombreArchivo);
            Files.copy(archivo.getInputStream(), destino, StandardCopyOption.REPLACE_EXISTING);

            // Guardar la ruta en la entidad Oferente
            Oferente oferente = service.getOferente(userDetails.getUsuario().getId());
            oferente.setRutaCv(nombreArchivo);
            service.saveOferente(oferente);

            return ResponseEntity.ok(new MensajeResponse("CV subido correctamente"));

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MensajeResponse("Error al guardar el archivo"));
        }
    }
}