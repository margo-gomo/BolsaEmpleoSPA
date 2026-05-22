import { useState, useEffect } from 'react'
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

    const [categorias, setCategorias] = useState([])
    const [seleccionadas, setSeleccionadas] = useState([])
    const [esAND, setEsAND] = useState(true)
    const [resultados, setResultados] = useState([])
    const [requisitosMap, setRequisitosMap] = useState({})
    const [buscado, setBuscado] = useState(false)
    const [mensaje, setMensaje] = useState(null)
    const [cargando, setCargando] = useState(false)

    useEffect(() => {
        getCaracteristicas()
            .then(setCategorias)
            .catch(console.error)
    }, [])

    function toggleSeleccionada(id) {
        setSeleccionadas(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        )
    }

    async function handleBuscar(e) {
        e.preventDefault()
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
            setMensaje({ tipo: 'error', texto: 'Error al realizar la búsqueda.' })
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
        try {
            await solicitarPuesto(puestoId, token)
            setMensaje({ tipo: 'success', texto: 'Solicitud enviada correctamente.' })
        } catch (err) {
            if (err.status === 409) {
                setMensaje({ tipo: 'warning', texto: 'Ya habías solicitado este puesto.' })
            } else {
                setMensaje({ tipo: 'error', texto: 'No fue posible procesar la solicitud.' })
            }
        }
    }

    return (
        <>
            <Navbar />

            <main className="page-container">
                <section className="page-header buscar-header">
                    <h1>Buscar puestos</h1>
                    <p>Consultá oportunidades disponibles según las características requeridas.</p>
                </section>

                <section className="buscar-layout">

                    <article className="buscar-panel">
                        <h2>Buscar puestos por características</h2>

                        <form className="buscar-form" onSubmit={handleBuscar}>
                            <div className="buscar-tree-box">
                                <ArbolCaracteristicas
                                    categorias={categorias}
                                    seleccionadas={seleccionadas}
                                    onToggle={toggleSeleccionada}
                                />
                            </div>

                            <div className="modo-coincidencia">
                                <p>Modo de coincidencia</p>
                                <label className="radio-option">
                                    <input
                                        type="radio"
                                        name="esAND"
                                        checked={esAND === true}
                                        onChange={() => setEsAND(true)}
                                    />
                                    <span>Todas</span>
                                </label>
                                <label className="radio-option">
                                    <input
                                        type="radio"
                                        name="esAND"
                                        checked={esAND === false}
                                        onChange={() => setEsAND(false)}
                                    />
                                    <span>Cualquiera</span>
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

                    <article className="buscar-panel resultados-panel">
                        <h2>Resultados</h2>

                        {mensaje && (
                            <div className={`alert ${mensaje.tipo}`}>
                                {mensaje.texto}
                            </div>
                        )}

                        {buscado && resultados.length === 0 && (
                            <div className="empty-state">
                                No se encontraron resultados.
                            </div>
                        )}

                        {resultados.length > 0 && (
                            <div className="resultados-lista">
                                {resultados.map(r => (
                                    <div key={r.puestoId} className="resultado-card">
                                        <div className="resultado-empresa">{r.empresa}</div>
                                        <div className="resultado-titulo">{r.descripcion}</div>

                                        <div className="resultado-salario">
                                            <strong>Salario: </strong>
                                            {r.simbolo} {r.salario}
                                        </div>

                                        <div className="resultado-tipo">
                                            <strong>Tipo: </strong>
                                            {r.tipo}
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
                                                >
                                                    Solicitar
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </article>

                </section>
            </main>

            <Footer />
        </>
    )
}