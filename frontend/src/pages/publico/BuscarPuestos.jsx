import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import {
    getCaracteristicas,
    buscarPuestos,
    getRequisitosPuesto,
    solicitarPuesto
} from '../../api/api'
import ArbolCaracteristicas from '../../components/ArbolCaracteristicas'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function BuscarPuestos() {
    const { usuario, token } = useAuth()
    const esOferente = usuario?.tipoUsuario === 'Oferente'
    const mensajeRef = useRef(null)

    const [categorias, setCategorias] = useState([])
    const [seleccionadas, setSeleccionadas] = useState([])
    const [esAND, setEsAND] = useState(true)
    const [resultados, setResultados] = useState([])
    const [requisitosMap, setRequisitosMap] = useState({})
    const [buscado, setBuscado] = useState(false)
    const [mensaje, setMensaje] = useState(null)
    const [cargando, setCargando] = useState(false)
    const [solicitando, setSolicitando] = useState(null)

    useEffect(() => {
        getCaracteristicas().then(setCategorias).catch(console.error)
    }, [])

    useEffect(() => {
        if (mensaje && mensajeRef.current) {
            mensajeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
    }, [mensaje])

    function toggleSeleccionada(id) {
        setSeleccionadas(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        )
    }

    async function handleBuscar(e) {
        e.preventDefault()
        if (seleccionadas.length === 0) {
            setMensaje({ tipo: 'warning', texto: 'Seleccioná al menos una característica para buscar.' })
            return
        }
        setMensaje(null)
        setCargando(true)
        try {
            const logeado = !!usuario
            const lista = await buscarPuestos(seleccionadas, esAND, logeado, token)

            const vistos = new Set()
            const unicos = lista.filter(r => {
                if (vistos.has(r.puestoId)) return false
                vistos.add(r.puestoId)
                return true
            })
            setResultados(unicos)
            setBuscado(true)

            if (unicos.length === 0) {
                setMensaje({ tipo: 'warning', texto: 'No se encontraron puestos con esas características.' })
            }

            const mapa = {}
            await Promise.all(
                unicos.map(async (r) => {
                    try {
                        mapa[r.puestoId] = await getRequisitosPuesto(r.puestoId)
                    } catch (_) {
                        mapa[r.puestoId] = []
                    }
                })
            )
            setRequisitosMap(mapa)
        } catch (err) {
            setMensaje({ tipo: 'error', texto: 'Ocurrió un error al realizar la búsqueda. Intentá de nuevo.' })
        } finally {
            setCargando(false)
        }
    }

    function handleLimpiar() {
        setSeleccionadas([])
        setEsAND(true)
        setResultados([])
        setRequisitosMap({})
        setBuscado(false)
        setMensaje(null)
    }

    async function handleSolicitar(puestoId) {
        setMensaje(null)
        setSolicitando(puestoId)
        try {
            await solicitarPuesto(puestoId, token)
            setMensaje({ tipo: 'success', texto: 'Solicitud enviada correctamente.' })
        } catch (err) {
            if (err.status === 409) {
                setMensaje({ tipo: 'warning', texto: 'Ya habías solicitado este puesto anteriormente.' })
            } else {
                setMensaje({ tipo: 'error', texto: 'No fue posible enviar la solicitud. Intentá de nuevo.' })
            }
        } finally {
            setSolicitando(null)
        }
    }

    return (
        <>
            <Navbar />

            <main className="page-container">
                <section className="page-header buscar-header">
                    <h1>Buscar puestos</h1>
                    <p>Seleccioná las características que te interesan y buscá puestos disponibles.</p>
                </section>

                {mensaje && (
                    <div ref={mensajeRef} className={`alert ${mensaje.tipo}`}>
                        {mensaje.texto}
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 22, alignItems: 'start' }}>

                    {/* ── Panel izquierdo: filtros ── */}
                    <article className="buscar-panel">
                        <h2>Filtros</h2>
                        <form className="buscar-form" onSubmit={handleBuscar}>

                            <div className="buscar-tree-box">
                                <ArbolCaracteristicas
                                    categorias={categorias}
                                    seleccionadas={seleccionadas}
                                    onToggle={toggleSeleccionada}
                                />
                            </div>

                            {seleccionadas.length > 0 && (
                                <p style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600 }}>
                                    {seleccionadas.length} característica{seleccionadas.length > 1 ? 's' : ''} seleccionada{seleccionadas.length > 1 ? 's' : ''}
                                </p>
                            )}

                            <div className="modo-coincidencia">
                                <p>Modo de coincidencia</p>
                                <label className="radio-option">
                                    <input
                                        type="radio"
                                        name="esAND"
                                        checked={esAND === true}
                                        onChange={() => setEsAND(true)}
                                    />
                                    <span>Todas las seleccionadas</span>
                                </label>
                                <label className="radio-option">
                                    <input
                                        type="radio"
                                        name="esAND"
                                        checked={esAND === false}
                                        onChange={() => setEsAND(false)}
                                    />
                                    <span>Cualquiera de las seleccionadas</span>
                                </label>
                            </div>

                            <div className="buscar-actions">
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-action"
                                    disabled={cargando}
                                >
                                    {cargando ? 'Buscando...' : 'Buscar'}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary btn-action"
                                    onClick={handleLimpiar}
                                >
                                    Limpiar
                                </button>
                            </div>
                        </form>
                    </article>

                    <article className="buscar-panel">
                        <h2>
                            Resultados
                            {buscado && resultados.length > 0 && (
                                <span style={{ fontSize: 15, fontWeight: 400, color: 'var(--text-soft)', marginLeft: 10 }}>
                                    ({resultados.length} puesto{resultados.length > 1 ? 's' : ''})
                                </span>
                            )}
                        </h2>

                        {!buscado && (
                            <p className="empty-state">
                                Seleccioná características y presioná Buscar para ver resultados.
                            </p>
                        )}

                        {buscado && resultados.length > 0 && (
                            <div className="resultados-lista">
                                {resultados.map(r => (
                                    <div key={r.puestoId} className="resultado-card">
                                        <div className="resultado-empresa">{r.empresa}</div>
                                        <div className="resultado-titulo">{r.descripcion}</div>

                                        <div className="resultado-salario">
                                            <strong>Salario: </strong>{r.simbolo} {r.salario}
                                        </div>
                                        <div className="resultado-tipo">
                                            <strong>Tipo: </strong>{r.tipo}
                                        </div>

                                        {requisitosMap[r.puestoId]?.length > 0 && (
                                            <div className="resultado-caracteristicas">
                                                <p><strong>Características requeridas</strong></p>
                                                <ul>
                                                    {requisitosMap[r.puestoId].map(c => (
                                                        <li key={c.id}>
                                                            {c.caracteristica} (nivel {c.nivel})
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {esOferente && (
                                            <div className="resultado-actions">
                                                <button
                                                    className="btn btn-primary btn-action"
                                                    onClick={() => handleSolicitar(r.puestoId)}
                                                    disabled={solicitando === r.puestoId}
                                                >
                                                    {solicitando === r.puestoId ? 'Enviando...' : 'Solicitar'}
                                                </button>
                                            </div>
                                        )}

                                        {!usuario && (
                                            <div className="resultado-actions">
                                                <p style={{ fontSize: 13, color: 'var(--text-soft)' }}>
                                                    <a href="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                                                        Iniciá sesión
                                                    </a>{' '}como oferente para solicitar este puesto.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </article>

                </div>
            </main>

            <Footer />
        </>
    )
}