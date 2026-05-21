package com.example.backend.logic;

import com.example.backend.data.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
@Service
public class Service_BolsaEmpleo {
    @Autowired
    private VPublicacionesPublicaRepository vPublicacionesPublicaRepository;
    public Iterable<VPublicacionesPublica> getAllPublicacionesPublicas() {
        return vPublicacionesPublicaRepository.findAll();
    }
    @Autowired
    private VBusquedaPuestoRepository vBusquedaPuestoRepository;
    public List<VBusquedaPuesto> getBusquedaPuestos(List<Integer> ids, boolean esAND, boolean usuarioLogeado) {
        String tipo = usuarioLogeado ? null : "Pública";
        if (!esAND) {
            List<VBusquedaPuesto> resultados;
            if (tipo != null) {
                resultados = vBusquedaPuestoRepository.findByAncestroIdInAndTipo(ids, tipo);
            } else {
                resultados = vBusquedaPuestoRepository.findByAncestroIdIn(ids);
            }
            return resultados.stream()
                    .collect(Collectors.toMap(
                            VBusquedaPuesto::getPuestoId,
                            p -> p,
                            (p1, p2) -> p1
                    ))
                    .values()
                    .stream()
                    .toList();
        }
        List<VBusquedaPuesto> resultados;
        if (tipo != null) {
            resultados = vBusquedaPuestoRepository.findByAncestroIdInAndTipo(ids, tipo);
        } else {
            resultados = vBusquedaPuestoRepository.findByAncestroIdIn(ids);
        }
        Map<Integer, List<VBusquedaPuesto>> agrupados =
                resultados.stream()
                        .collect(Collectors.groupingBy(VBusquedaPuesto::getPuestoId));
        return agrupados.values().stream()
                .filter(lista -> {
                    Set<Integer> encontrados = lista.stream()
                            .map(VBusquedaPuesto::getAncestroId)
                            .collect(Collectors.toSet());
                    return encontrados.containsAll(ids);
                })
                .map(lista -> lista.get(0))
                .toList();
    }
    public List<VBusquedaPuesto> getTodosBusquedaPuestos(boolean usuarioLogeado) {
        String tipo = usuarioLogeado ? null : "Pública";
        List<VBusquedaPuesto> resultados;
        if (tipo != null) {
            resultados = vBusquedaPuestoRepository.findByTipo(tipo);
        } else {
            resultados = new ArrayList<>();
            vBusquedaPuestoRepository.findAll().forEach(resultados::add);
        }
        return resultados.stream()
                .collect(Collectors.toMap(
                        VBusquedaPuesto::getPuestoId,
                        p -> p,
                        (p1, p2) -> p1
                ))
                .values()
                .stream()
                .toList();
    }
    @Autowired
    private VDetalleOferenteRepository vDetalleOferenteRepository;
    public VDetalleOferente getVDetalleOferente(Integer id) {
        return vDetalleOferenteRepository.findById(id).orElse(null);
    }
    @Autowired
    private VDetallePuestoRepository vDetallePuestoRepository;
    public VDetallePuesto getVDetallePuesto(Integer id) {
        return vDetallePuestoRepository.findById(id).orElse(null);
    }
    @Autowired
    private VHabilidadesOferenteRepository vHabilidadesOferenteRepository;
    public Iterable<VHabilidadesOferente> getVHabilidadesOferente(Integer id) {
        return vHabilidadesOferenteRepository.findByoferenteUsuarioId(id);
    }
    @Autowired
    private VHijosCaracteristicaRepository vHijosCaracteristicaRepository;
    public Iterable<VHijosCaracteristica> getAllPadreID(Integer id) {
        return vHijosCaracteristicaRepository.findByPadreId(id);
    }
    public Iterable<VHijosCaracteristica> getAllPadreIDNull() {
        return vHijosCaracteristicaRepository.findByPadreIdIsNull();
    }
    @Autowired
    private VPuestoCaracReporteRepository vPuestoCaracReporteRepository;

    public List<VPuestoCaracteristicasReporte> getAllPuestoCaracReporte(Integer id) {
        return vPuestoCaracReporteRepository.findByPuestoId(id);
    }
    @Autowired
    private VPuestoCaracteristicaRepository vPuestoCaracteristicaRepository;
    public Iterable<VPuestoCaracteristica> getAllPuestoCaracteristica(Integer id) {
        return vPuestoCaracteristicaRepository.findByPuestoId(id);
    }
    @Autowired
    private VReportePuestosSolicitadosMeRepository vReportePuestosSolicitadosMeRepository;
    public List<VReportePuestosSolicitadosMe> getReportePuestosSolicitadosMe(List<Integer> mes) {
        return vReportePuestosSolicitadosMeRepository.findByMesIn(mes);
    }
    @Autowired
    private VReporteSalariosAltoRepository vReporteSalariosAltoRepository;
    public Iterable<VReporteSalariosAlto> getAllSalariosAlto() {
        return vReporteSalariosAltoRepository.findAll();
    }

    @Autowired
    private UsuarioRepository usuarioRepository;
    public Usuario saveUsuario(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }
    public Usuario getUsuario(Integer id) {
        return usuarioRepository.findById(id).orElse(null);
    }
    public Usuario getUsuarioByCorreo(String correo) {
        return usuarioRepository.findByCorreo(correo);
    }
    public Iterable<Usuario> getUsuariosSinAutorizar(String tipoUsuario) {
        return usuarioRepository.findByTipoUsuarioAndAutorizadoOrderByIdAsc(tipoUsuario,"No");
    }
    @Autowired
    private EmpresaRepository empresaRepository;
    public Empresa saveEmpresa(Empresa empresa) {
        return empresaRepository.save(empresa);
    }
    public Empresa getEmpresa(Integer id) {
        return empresaRepository.findById(id).orElse(null);
    }
    @Autowired
    private VCandidatosOferenteRepository vCandidatosOferenteRepository;
    public List<VCandidatosOferente> getCandidatosPorPuesto(Integer puestoId) {
        return vCandidatosOferenteRepository.findByPuestoId(puestoId);
    }
    @Autowired
    private MonedaRepository monedaRepository;
    public Iterable<Moneda> getAllMonedas() {
        return monedaRepository.findAll();
    }
    @Autowired
    private OferenteRepository oferenteRepository;
    public Oferente saveOferente(Oferente oferente) {
        return oferenteRepository.save(oferente);
    }
    public Oferente getOferente(Integer id) {
        return oferenteRepository.findById(id).orElse(null);
    }
    public Moneda getMoneda(Integer id) {
        return monedaRepository.findById(id).orElse(null);
    }
    @Autowired
    private PaiRepository paiRepository;
    public Iterable<Pai> getAllPaises() {
        return paiRepository.findAll();
    }
    public Pai getPai(Integer id) {
        return paiRepository.findById(id).orElse(null);
    }
    @Autowired
    private PrefijoTelRepository prefijoTelRepository;
    public Iterable<PrefijoTel> getAllPrefijosTel() {
        return prefijoTelRepository.findAll();
    }
    public PrefijoTel getPrefijoTel(Integer id) {
        return prefijoTelRepository.findById(id).orElse(null);
    }
    @Autowired
    private ProvinciaCantonRepository provinciaCantonRepository;
    public List<ProvinciaCanton> getProvincias() {
        return provinciaCantonRepository.findByIdProvinciaIsNull();
    }
    public Iterable<ProvinciaCanton> getCantonesPorProvincia(Integer idProvincia) {
        return provinciaCantonRepository.findByIdProvincia_IdOrderByNombreAsc(idProvincia);
    }
    public ProvinciaCanton getProvinciaCanton(Integer id) {
        return provinciaCantonRepository.findById(id).orElse(null);
    }
    @Autowired
    private PuestoRepository puestoRepository;
    public Puesto savePuesto(Puesto puesto) {
        return puestoRepository.save(puesto);
    }
    public Puesto getPuesto(Integer id) {
        return puestoRepository.findById(id).orElse(null);
    }
    public List<Puesto> getPuestosPorEmpresa(Integer empresaId) {
        return puestoRepository.findByIdEmpresa_IdOrderByIdDesc(empresaId);
    }
    @Autowired
    private CaracteristicaRepository caracteristicaRepository;
    public Caracteristica getCaracteristica(Integer id) {
        return caracteristicaRepository.findById(id).orElse(null);
    }
    public Caracteristica saveCaracteristica(Caracteristica caracteristica) {
        return caracteristicaRepository.save(caracteristica);
    }
    public boolean existeCaracteristicaPorNombre(String nombre) {
        return caracteristicaRepository.findByNombre(nombre) != null;
    }
    @Autowired
    private OferenteCaracRepository oferenteCaracRepository;
    public OferenteCarac saveOferenteCarac(OferenteCarac oc) {
        return oferenteCaracRepository.save(oc);
    }
    public OferenteCarac getOferenteCarac(OferenteCaracId id) {
        return oferenteCaracRepository.findById(id).orElse(null);
    }
    public void deleteOferenteCarac(OferenteCaracId id) {
        oferenteCaracRepository.deleteById(id);
    }
    @Autowired
    private OferentePuestoRepository oferentePuestoRepository;
    public OferentePuesto saveOferentePuesto(OferentePuesto op) {
        return oferentePuestoRepository.save(op);
    }
    public OferentePuesto getOferentePuesto(OferentePuestoId id) {
        return oferentePuestoRepository.findById(id).orElse(null);
    }
    public boolean existeOferentePuesto(OferentePuestoId id) {
        return oferentePuestoRepository.existsById(id);
    }

    public List<OferentePuesto> getSolicitudesPorOferente(Integer oferenteId) {
        return oferentePuestoRepository.findByOferenteUsuarioId(oferenteId);
    }

    public List<OferentePuesto> getSolicitantesPorPuesto(Integer puestoId) {
        return oferentePuestoRepository.findByPuestoId(puestoId);
    }
    @Autowired
    private PuestoCaracRepository puestoCaracRepository;
    public PuestoCarac savePuestoCarac(PuestoCarac pc) {
        return puestoCaracRepository.save(pc);
    }
    public PuestoCarac getPuestoCarac(PuestoCaracId id) {
        return puestoCaracRepository.findById(id).orElse(null);
    }
    public void deletePuestoCarac(PuestoCaracId id) {
        puestoCaracRepository.deleteById(id);
    }
    public List<NodoCaracteristica> getArbolCaracteristicas() {
        List<NodoCaracteristica> padres = new ArrayList<>();
        for (VHijosCaracteristica raiz : getAllPadreIDNull()) {
            padres.add(construirNodo(raiz));
        }
        return padres;
    }
    private NodoCaracteristica construirNodo(VHijosCaracteristica actual) {
        NodoCaracteristica nodo = new NodoCaracteristica();
        nodo.setId(actual.getId());
        nodo.setNombre(actual.getNombre());
        for (VHijosCaracteristica hija : getAllPadreID(actual.getId())) {
            nodo.getHijas().add(construirNodo(hija));
        }
        return nodo;
    }

    @Autowired
    private LogActividadRepository logActividadRepository;

    // Registrar una acción
    public void registrarLog(Integer usuarioId, String tipoUsuario,
                             String accion, String detalle) {
        LogActividad log = new LogActividad();
        log.setUsuario(getUsuario(usuarioId));
        log.setTipoUsuario(tipoUsuario);
        log.setAccion(accion);
        log.setDetalle(detalle);
        log.setFecha(Instant.now());
        logActividadRepository.save(log);
    }

    // Consultar logs
    public List<LogActividad> getAllLogs() {
        return logActividadRepository.findAllByOrderByFechaDesc();
    }

    public List<LogActividad> getLogsPorTipo(String tipoUsuario) {
        return logActividadRepository.findByTipoUsuarioOrderByFechaDesc(tipoUsuario);
    }

    public List<LogActividad> getLogsPorUsuario(Integer usuarioId) {
        return logActividadRepository.findByUsuario_IdOrderByFechaDesc(usuarioId);
    }
}