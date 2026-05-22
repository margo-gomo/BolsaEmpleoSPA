const BASE = '/api'

function headers(token) {
    const h = { 'Content-Type': 'application/json' }
    if (token) h['Authorization'] = `Bearer ${token}`
    return h
}

// ───── AUTH ─────
export async function login(correo, clave) {
    const res = await fetch(`${BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, clave })
    })
    if (!res.ok) throw new Error('Credenciales incorrectas')
    return res.json() // { token, rol, nombre, id }
}

// ───── PÚBLICO ─────
export async function getPuestosRecientes() {
    const res = await fetch(`${BASE}/publico/puestos-recientes`)
    return res.json()
}

export async function getCaracteristicas() {
    const res = await fetch(`${BASE}/publico/caracteristicas`)
    return res.json()
}

export async function buscarPuestos(ids, esAND, token) {
    const params = new URLSearchParams()
    ids.forEach(id => params.append('ids', id))
    params.append('esAND', esAND)
    if (token) params.append('logeado', 'true')
    const res = await fetch(`${BASE}/publico/buscar-puestos?${params}`, {
        headers: token ? headers(token) : {}
    })
    return res.json()
}

export async function getDetallePuesto(id) {
    const res = await fetch(`${BASE}/publico/detalle-puesto/${id}`)
    return res.json()
}

export async function getRequisitosPuesto(id) {
    const res = await fetch(`${BASE}/publico/requisitos-puesto/${id}`)
    return res.json()
}

export async function getProvincias() {
    const res = await fetch(`${BASE}/publico/provincias`)
    return res.json()
}

export async function getCantones(idProvincia) {
    const res = await fetch(`${BASE}/publico/cantones/${idProvincia}`)
    return res.json()
}

export async function registrarEmpresa(datos) {
    const res = await fetch(`${BASE}/publico/registro-empresa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    })
    if (!res.ok) throw new Error('Error al registrar empresa')
    return res.json()
}

export async function registrarOferente(datos) {
    const res = await fetch(`${BASE}/publico/registro-oferente`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    })
    if (!res.ok) throw new Error('Error al registrar oferente')
    return res.json()
}

export async function getPrefijosTel() {
    const res = await fetch(`${BASE}/publico/prefijos-tel`)
    return res.json()
}

export async function getPaises() {
    const res = await fetch(`${BASE}/publico/paises`)
    return res.json()
}

export async function getMonedas() {
    const res = await fetch(`${BASE}/publico/monedas`)
    return res.json()
}

// ───── EMPRESA ─────
export async function publicarPuesto(datos, token) {
    const res = await fetch(`${BASE}/empresa/publicar-puesto`, {
        method: 'POST',
        headers: headers(token),
        body: JSON.stringify(datos)
    })
    if (!res.ok) throw new Error('Error al publicar puesto')
    return res.json()
}

export async function getMisPuestos(token) {
    const res = await fetch(`${BASE}/empresa/mis-puestos`, {
        headers: headers(token)
    })
    return res.json()
}

export async function desactivarPuesto(id, token) {
    const res = await fetch(`${BASE}/empresa/desactivar-puesto/${id}`, {
        method: 'PUT',
        headers: headers(token)
    })
    if (!res.ok) throw new Error('Error al desactivar puesto')
    return res.json()
}

export async function activarPuesto(id, token) {
    const res = await fetch(`${BASE}/empresa/activar-puesto/${id}`, {
        method: 'PUT',
        headers: headers(token)
    })
    if (!res.ok) throw new Error('Error al activar puesto')
    return res.json()
}

export async function agregarRequisito(puestoId, datos, token) {
    const res = await fetch(`${BASE}/empresa/requisitos-puesto/${puestoId}`, {
        method: 'POST',
        headers: headers(token),
        body: JSON.stringify(datos)
    })
    if (!res.ok) throw new Error('Error al agregar requisito')
    return res.json()
}

// DELETE /api/empresa/requisitos-puesto/{idPuesto}/{idCarac}
export async function eliminarRequisito(idPuesto, idCarac, token) {
    const res = await fetch(`${BASE}/empresa/requisitos-puesto/${idPuesto}/${idCarac}`, {
        method: 'DELETE',
        headers: headers(token)
    })
    if (!res.ok) throw new Error('Error al eliminar requisito')
    return res.json()
}

// GET /api/empresa/buscar-candidatos?puestoId=5
export async function buscarCandidatos(puestoId, token) {
    const res = await fetch(`${BASE}/empresa/buscar-candidatos?puestoId=${puestoId}`, {
        headers: headers(token)
    })
    return res.json()
}

export async function getDetalleCandidato(id, token) {
    const res = await fetch(`${BASE}/empresa/detalle-candidato/${id}`, {
        headers: headers(token)
    })
    return res.json()
}

// GET /api/empresa/cv-candidato/{id} — devuelve PDF binario, se abre en nueva pestaña
export function getCvCandidatoUrl(id) {
    return `${BASE}/empresa/cv-candidato/${id}`
}

// Para descargar con token: usa fetch y crea un object URL
export async function verCvCandidato(id, token) {
    const res = await fetch(`${BASE}/empresa/cv-candidato/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!res.ok) throw new Error('CV no disponible')
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
}

// GET /api/empresa/solicitantes/{idPuesto}
export async function getSolicitantes(idPuesto, token) {
    const res = await fetch(`${BASE}/empresa/solicitantes/${idPuesto}`, {
        headers: headers(token)
    })
    return res.json()
}

// ───── OFERENTE ─────
export async function getHabilidades(token) {
    const res = await fetch(`${BASE}/oferente/habilidades`, {
        headers: headers(token)
    })
    return res.json()
}

export async function guardarHabilidad(datos, token) {
    const res = await fetch(`${BASE}/oferente/habilidades`, {
        method: 'POST',
        headers: headers(token),
        body: JSON.stringify(datos)
    })
    if (!res.ok) throw new Error('Error al guardar habilidad')
    return res.json()
}

// DELETE /api/oferente/habilidades/{idCaracteristica}
export async function eliminarHabilidad(idCaracteristica, token) {
    const res = await fetch(`${BASE}/oferente/habilidades/${idCaracteristica}`, {
        method: 'DELETE',
        headers: headers(token)
    })
    if (!res.ok) throw new Error('Error al eliminar habilidad')
    return res.json()
}

export async function subirCV(archivo, token) {
    const formData = new FormData()
    formData.append('archivo', archivo)
    const res = await fetch(`${BASE}/oferente/cv`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }, // sin Content-Type, FormData lo pone solo
        body: formData
    })
    if (!res.ok) throw new Error('Error al subir CV')
    return res.json()
}

// POST /api/oferente/solicitar-puesto/{idPuesto}
export async function solicitarPuesto(idPuesto, token) {
    const res = await fetch(`${BASE}/oferente/solicitar-puesto/${idPuesto}`, {
        method: 'POST',
        headers: headers(token)
    })
    if (!res.ok) throw new Error('Error al solicitar puesto')
    return res.json()
}

// GET /api/oferente/mis-solicitudes
export async function getMisSolicitudes(token) {
    const res = await fetch(`${BASE}/oferente/mis-solicitudes`, {
        headers: headers(token)
    })
    return res.json()
}

// ───── ADMIN ─────
export async function getEmpresasPendientes(token) {
    const res = await fetch(`${BASE}/admin/empresas-pendientes`, {
        headers: headers(token)
    })
    return res.json()
}

export async function autorizarEmpresa(id, token) {
    const res = await fetch(`${BASE}/admin/autorizar-empresa/${id}`, {
        method: 'PUT',
        headers: headers(token)
    })
    if (!res.ok) throw new Error('Error al autorizar empresa')
    return res.json()
}

export async function getOferentesPendientes(token) {
    const res = await fetch(`${BASE}/admin/oferentes-pendientes`, {
        headers: headers(token)
    })
    return res.json()
}

export async function autorizarOferente(id, token) {
    const res = await fetch(`${BASE}/admin/autorizar-oferente/${id}`, {
        method: 'PUT',
        headers: headers(token)
    })
    if (!res.ok) throw new Error('Error al autorizar oferente')
    return res.json()
}

export async function getCaracteristicasAdmin(token) {
    const res = await fetch(`${BASE}/admin/caracteristicas`, {
        headers: headers(token)
    })
    return res.json()
}

export async function crearCaracteristica(datos, token) {
    const res = await fetch(`${BASE}/admin/caracteristicas`, {
        method: 'POST',
        headers: headers(token),
        body: JSON.stringify(datos)
    })
    if (!res.ok) throw new Error('Error al crear característica')
    return res.json()
}