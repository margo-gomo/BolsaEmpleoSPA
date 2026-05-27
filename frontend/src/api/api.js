const BASE = '/api'

function headers(token) {
    const h = { 'Content-Type': 'application/json' }
    if (token) h['Authorization'] = `Bearer ${token}`
    return h
}

async function manejarRespuesta(res) {
    if (!res.ok) {
        const err = new Error('Error en la petición')
        err.status = res.status
        try { err.body = await res.json() } catch (_) {}
        throw err
    }
    return res.json()
}

// AUTH
export async function login(correo, clave) {
    const res = await fetch(`${BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, clave })
    })
    return manejarRespuesta(res)
}

// PÚBLICO
export async function getPuestosRecientes() {
    const res = await fetch(`${BASE}/publico/puestos-recientes`)
    return manejarRespuesta(res)
}

export async function getCaracteristicas() {
    const res = await fetch(`${BASE}/publico/caracteristicas`)
    return manejarRespuesta(res)
}

export async function buscarPuestos(ids, esAND, logeado = false, token = null) {
    const params = new URLSearchParams()
    ids.forEach(id => params.append('ids', id))
    params.append('esAND', esAND)
    params.append('logeado', logeado)
    const res = await fetch(`${BASE}/publico/buscar-puestos?${params}`, {
        headers: token ? headers(token) : {}
    })
    return manejarRespuesta(res)
}

export async function getDetallePuesto(id) {
    const res = await fetch(`${BASE}/publico/detalle-puesto/${id}`)
    return manejarRespuesta(res)
}

export async function getRequisitosPuesto(id) {
    const res = await fetch(`${BASE}/publico/requisitos-puesto/${id}`)
    return manejarRespuesta(res)
}

export async function getProvincias() {
    const res = await fetch(`${BASE}/publico/provincias`)
    return manejarRespuesta(res)
}

export async function getCantones(idProvincia) {
    const res = await fetch(`${BASE}/publico/cantones/${idProvincia}`)
    return manejarRespuesta(res)
}

export async function getPrefijosTel() {
    const res = await fetch(`${BASE}/publico/prefijos-tel`)
    return manejarRespuesta(res)
}

export async function getPaises() {
    const res = await fetch(`${BASE}/publico/paises`)
    return manejarRespuesta(res)
}

export async function getMonedas() {
    const res = await fetch(`${BASE}/publico/monedas`)
    return manejarRespuesta(res)
}

export async function registrarEmpresa(datos) {
    const res = await fetch(`${BASE}/publico/registro-empresa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    })
    return manejarRespuesta(res)
}

export async function registrarOferente(datos) {
    const res = await fetch(`${BASE}/publico/registro-oferente`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    })
    return manejarRespuesta(res)
}

// EMPRESA
export async function getDashboardEmpresa(token) {
    const res = await fetch(`${BASE}/empresa/dashboard`, { headers: headers(token) })
    return manejarRespuesta(res)
}

export async function getMisPuestos(token) {
    const res = await fetch(`${BASE}/empresa/mis-puestos`, { headers: headers(token) })
    return manejarRespuesta(res)
}

export async function publicarPuesto(datos, token) {
    const res = await fetch(`${BASE}/empresa/publicar-puesto`, {
        method: 'POST',
        headers: headers(token),
        body: JSON.stringify(datos)
    })
    return manejarRespuesta(res)
}

export async function agregarRequisito(idPuesto, datos, token) {
    const res = await fetch(`${BASE}/empresa/requisitos-puesto/${idPuesto}`, {
        method: 'POST',
        headers: headers(token),
        body: JSON.stringify(datos)
    })
    return manejarRespuesta(res)
}

export async function eliminarRequisito(idPuesto, idCarac, token) {
    const res = await fetch(`${BASE}/empresa/requisitos-puesto/${idPuesto}/${idCarac}`, {
        method: 'DELETE',
        headers: headers(token)
    })
    return manejarRespuesta(res)
}

export async function desactivarPuesto(id, token) {
    const res = await fetch(`${BASE}/empresa/desactivar-puesto/${id}`, {
        method: 'PUT',
        headers: headers(token)
    })
    return manejarRespuesta(res)
}

export async function activarPuesto(id, token) {
    const res = await fetch(`${BASE}/empresa/activar-puesto/${id}`, {
        method: 'PUT',
        headers: headers(token)
    })
    return manejarRespuesta(res)
}

export async function buscarCandidatos(puestoId, token) {
    const res = await fetch(`${BASE}/empresa/buscar-candidatos?puestoId=${puestoId}`, {
        headers: headers(token)
    })
    return manejarRespuesta(res)
}

export async function getDetalleCandidato(id, token) {
    const res = await fetch(`${BASE}/empresa/detalle-candidato/${id}`, {
        headers: headers(token)
    })
    return manejarRespuesta(res)
}

export async function verCvCandidato(id, token) {
    const res = await fetch(`${BASE}/empresa/cv-candidato/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!res.ok) throw new Error('CV no disponible')
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
}

export async function getSolicitantes(idPuesto, token) {
    const res = await fetch(`${BASE}/empresa/solicitantes/${idPuesto}`, {
        headers: headers(token)
    })
    return manejarRespuesta(res)
}

// OFERENTE
export async function getDashboardOferente(token) {
    const res = await fetch(`${BASE}/oferente/dashboard`, { headers: headers(token) })
    return manejarRespuesta(res)
}

export async function getHabilidades(token) {
    const res = await fetch(`${BASE}/oferente/habilidades`, { headers: headers(token) })
    return manejarRespuesta(res)
}

export async function guardarHabilidad(datos, token) {
    const res = await fetch(`${BASE}/oferente/habilidades`, {
        method: 'POST',
        headers: headers(token),
        body: JSON.stringify(datos)
    })
    return manejarRespuesta(res)
}

export async function eliminarHabilidad(idCaracteristica, token) {
    const res = await fetch(`${BASE}/oferente/habilidades/${idCaracteristica}`, {
        method: 'DELETE',
        headers: headers(token)
    })
    return manejarRespuesta(res)
}

export async function subirCV(archivo, token) {
    const formData = new FormData()
    formData.append('archivo', archivo)
    const res = await fetch(`${BASE}/oferente/cv`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
    })
    return manejarRespuesta(res)
}

export async function solicitarPuesto(idPuesto, token) {
    const res = await fetch(`${BASE}/oferente/solicitar-puesto/${idPuesto}`, {
        method: 'POST',
        headers: headers(token)
    })
    return manejarRespuesta(res)
}

export async function getMisSolicitudes(token) {
    const res = await fetch(`${BASE}/oferente/mis-solicitudes`, { headers: headers(token) })
    return manejarRespuesta(res)
}

// ADMIN
export async function getEmpresasPendientes(token) {
    const res = await fetch(`${BASE}/admin/empresas-pendientes`, { headers: headers(token) })
    return manejarRespuesta(res)
}

export async function autorizarEmpresa(id, token) {
    const res = await fetch(`${BASE}/admin/autorizar-empresa/${id}`, {
        method: 'PUT',
        headers: headers(token)
    })
    return manejarRespuesta(res)
}

export async function getOferentesPendientes(token) {
    const res = await fetch(`${BASE}/admin/oferentes-pendientes`, { headers: headers(token) })
    return manejarRespuesta(res)
}

export async function autorizarOferente(id, token) {
    const res = await fetch(`${BASE}/admin/autorizar-oferente/${id}`, {
        method: 'PUT',
        headers: headers(token)
    })
    return manejarRespuesta(res)
}

export async function getCaracteristicasAdmin(token) {
    const res = await fetch(`${BASE}/admin/caracteristicas`, { headers: headers(token) })
    return manejarRespuesta(res)
}

export async function crearCaracteristica(datos, token) {
    const res = await fetch(`${BASE}/admin/caracteristicas`, {
        method: 'POST',
        headers: headers(token),
        body: JSON.stringify(datos)
    })
    return manejarRespuesta(res)
}

export async function descargarReporteMeses(meses, todosMeses, token) {
    const params = new URLSearchParams()
    if (todosMeses) {
        params.append('todosMeses', 'true')
    } else {
        meses.forEach(m => params.append('meses', m))
    }
    const res = await fetch(`${BASE}/admin/reporte-meses?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!res.ok) throw new Error('Error al generar reporte')
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
}

export async function descargarReporteSalarios(token) {
    const res = await fetch(`${BASE}/admin/reporte-salarios`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!res.ok) throw new Error('Error al generar reporte')
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
}