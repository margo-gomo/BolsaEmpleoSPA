package com.example.backend.presentation.publico;

import com.example.backend.logic.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/publico")
public class PublicoController {

    @Autowired
    private Service_BolsaEmpleo service;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // GET /api/publico/puestos-recientes
    @GetMapping("/puestos-recientes")
    public ResponseEntity<?> puestosRecientes() {
        return ResponseEntity.ok(service.getAllPublicacionesPublicas());
    }

    // GET /api/publico/buscar-puestos?ids=1,2,3&esAND=true&logeado=false
    @GetMapping("/buscar-puestos")
    public ResponseEntity<?> buscarPuestos(
            @RequestParam(required = false) List<Integer> ids,
            @RequestParam(defaultValue = "false") boolean esAND,
            @RequestParam(defaultValue = "false") boolean logeado) {

        if (ids == null || ids.isEmpty()) {
            return ResponseEntity.ok(service.getTodosBusquedaPuestos(logeado));
        }
        return ResponseEntity.ok(service.getBusquedaPuestos(ids, esAND, logeado));
    }

    // GET /api/publico/caracteristicas
    @GetMapping("/caracteristicas")
    public ResponseEntity<?> caracteristicas() {
        return ResponseEntity.ok(service.getArbolCaracteristicas());
    }

    // GET /api/publico/provincias
    @GetMapping("/provincias")
    public ResponseEntity<?> provincias() {
        return ResponseEntity.ok(service.getProvincias());
    }

    // GET /api/publico/cantones/{idProvincia}
    @GetMapping("/cantones/{idProvincia}")
    public ResponseEntity<?> cantones(@PathVariable Integer idProvincia) {
        return ResponseEntity.ok(service.getCantonesPorProvincia(idProvincia));
    }

    // GET /api/publico/prefijos-tel
    @GetMapping("/prefijos-tel")
    public ResponseEntity<?> prefijosTel() {
        return ResponseEntity.ok(service.getAllPrefijosTel());
    }

    // GET /api/publico/paises
    @GetMapping("/paises")
    public ResponseEntity<?> paises() {
        return ResponseEntity.ok(service.getAllPaises());
    }

    // GET /api/publico/monedas
    @GetMapping("/monedas")
    public ResponseEntity<?> monedas() {
        return ResponseEntity.ok(service.getAllMonedas());
    }

    // POST /api/publico/registro-empresa
    @PostMapping("/registro-empresa")
    public ResponseEntity<?> registroEmpresa(@Valid @RequestBody RegistroEmpresaRequest req) {
        // Verificar que el correo no exista
        if (service.getUsuarioByCorreo(req.correo()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ErrorResponse("El correo ya está registrado"));
        }

        // Crear usuario
        Usuario usuario = new Usuario();
        usuario.setCorreo(req.correo());
        usuario.setClave(passwordEncoder.encode(req.clave()));
        usuario.setTipoUsuario("Empresa");
        usuario.setAutorizado("No");
        Usuario usuarioGuardado = service.saveUsuario(usuario);

        // Crear empresa
        Empresa empresa = new Empresa();
        empresa.setUsuario(usuarioGuardado);
        empresa.setNombre(req.nombre());
        empresa.setDescripcion(req.descripcion());
        empresa.setTelefono(req.telefono());
        empresa.setIdProvinciaCanton(service.getProvinciaCanton(req.idProvinciaCanton()));
        empresa.setIdPrefijoTel(service.getPrefijoTel(req.idPrefijoTel()));
        service.saveEmpresa(empresa);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new MensajeResponse("Registro exitoso. Esperá la aprobación del administrador"));
    }

    // POST /api/publico/registro-oferente
    @PostMapping("/registro-oferente")
    public ResponseEntity<?> registroOferente(@Valid @RequestBody RegistroOferenteRequest req) {
        if (service.getUsuarioByCorreo(req.correo()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ErrorResponse("El correo ya está registrado"));
        }

        Usuario usuario = new Usuario();
        usuario.setCorreo(req.correo());
        usuario.setClave(passwordEncoder.encode(req.clave()));
        usuario.setTipoUsuario("Oferente");
        usuario.setAutorizado("No");
        Usuario usuarioGuardado = service.saveUsuario(usuario);

        Oferente oferente = new Oferente();
        oferente.setUsuario(usuarioGuardado);
        oferente.setIdentificacion(req.identificacion());
        oferente.setNombre(req.nombre());
        oferente.setPrimerApellido(req.primerApellido());
        oferente.setTelefono(req.telefono());
        oferente.setIdPais(service.getPai(req.idPais()));
        oferente.setPrefijoTel(service.getPrefijoTel(req.idPrefijoTel()));
        oferente.setIdProvinciaCanton(service.getProvinciaCanton(req.idProvinciaCanton()));
        service.saveOferente(oferente);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new MensajeResponse("Registro exitoso. Esperá la aprobación del administrador"));
    }
    // GET /api/publico/detalle-puesto/{id}
    @GetMapping("/detalle-puesto/{id}")
    public ResponseEntity<?> detallePuesto(@PathVariable Integer id) {
        VDetallePuesto detalle = service.getVDetallePuesto(id);
        if (detalle == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("Puesto no encontrado"));
        }
        return ResponseEntity.ok(detalle);
    }

    // GET /api/publico/requisitos-puesto/{id}
    @GetMapping("/requisitos-puesto/{id}")
    public ResponseEntity<?> requisitosPuesto(@PathVariable Integer id) {
        return ResponseEntity.ok(service.getAllPuestoCaracteristica(id));
    }

}