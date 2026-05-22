import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import {
    getHabilidades,
    getCaracteristicas,
    guardarHabilidad,
    eliminarHabilidad
} from '../../api/api'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function Habilidades() {
    const { token } = useAuth()

    const [habilidades, setHabilidades] = useState([])

    const [arbol, setArbol] = useState([])

    const [pila, setPila] = useState([])

    const [nodosActuales, setNodosActuales] = useState([])

    const [caracSeleccionada, setCaracSeleccionada] = useState('')
    const [nivel, setNivel] = useState(1)

    const [mensaje, setMensaje] = useState(null) // { tipo, texto }
    const [cargando, setCargando] = useState(false)

    useEffect(() => {
        cargarHabilidades()
        getCaracteristicas()
            .then(raices => {
                setArbol(raices)
                setNodosActuales(raices)
            })
            .catch(console.error)
    }, [])

    function cargarHabilidades() {
        getHabilidades(token).then(setHabilidades).catch(console.error)
    }

    function entrar(nodo) {
        setPila(prev => [...prev, nodo])
        setNodosActuales(nodo.hijas)
        setCaracSeleccionada('')
    }

    function volverRaiz() {
        setPila([])
        setNodosActuales(arbol)
        setCaracSeleccionada('')
    }

    function volverA(index) {
        const nuevaPila = pila.slice(0, index + 1)
        const nodoDestino = nuevaPila[nuevaPila.length - 1]
        setPila(nuevaPila)
        setNodosActuales(nodoDestino.hijas)
        setCaracSeleccionada('')
    }

    const nodosHoja = nodosActuales.filter(n => !n.hijas || n.hijas.length === 0)
    const nodosCategoria = nodosActuales.filter(n => n.hijas && n.hijas.length > 0)

    const tituloSeccion = pila.length === 0
        ? 'Categorías raíz'
        : `Subcategorías de ${pila[pila.length - 1].nombre}`

    async function handleAgregar(e) {
        e.preventDefault()
        setMensaje(null)
        if (!caracSeleccionada) {
            setMensaje({ tipo: 'error', texto: 'Seleccioná una característica.' })
            return
        }
        setCargando(true)
        try {
            await guardarHabilidad(
                { idCaracteristica: parseInt(caracSeleccionada), nivel: parseInt(nivel) },
                token
            )
            setMensaje({ tipo: 'success', texto: 'Habilidad guardada correctamente.' })
            setCaracSeleccionada('')
            setNivel(1)
            cargarHabilidades()
        } catch (err) {
            setMensaje({ tipo: 'error', texto: 'Error al guardar la habilidad.' })
        } finally {
            setCargando(false)
        }
    }

    async function handleEliminar(idCaracteristica) {
        setMensaje(null)
        try {
            await eliminarHabilidad(idCaracteristica, token)
            setMensaje({ tipo: 'success', texto: 'Habilidad eliminada.' })
            cargarHabilidades()
        } catch {
            setMensaje({ tipo: 'error', texto: 'Error al eliminar la habilidad.' })
        }
    }

    return (
        <>
            <Navbar />
            <main className="page-container">
                <section className="skills-page-header">
                    <h1>Mis habilidades</h1>
                </section>

                {mensaje && (
                    <div className={`alert ${mensaje.tipo}`}>{mensaje.texto}</div>
                )}

                <section className="skills-layout skills-layout-habilidades">

                    <article className="skills-panel skills-panel-wide">
                        <h3>Habilidades registradas</h3>
                        <table className="table-clean skills-table">
                            <thead>
                            <tr>
                                <th>Característica</th>
                                <th>Nivel</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {habilidades.length === 0 ? (
                                <tr>
                                    <td colSpan="3">Aún no has registrado habilidades.</td>
                                </tr>
                            ) : (
                                habilidades.map(h => (
                                    <tr key={h.id}>
                                        <td>{h.caracteristica}</td>
                                        <td>{h.nivel}</td>
                                        <td className="actions-cell actions-cell-right">
                                            <button
                                                className="btn btn-outline btn-sm"
                                                onClick={() => handleEliminar(
                                                    parseInt(h.id.split('_')[1])
                                                )}
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </article>

                    <article className="skills-panel skills-panel-wide">
                        <div className="skills-ruta-header">
                            <span className="ruta-label">Ruta:</span>
                            <div className="ruta-tags">
                                <button
                                    type="button"
                                    className="ruta-tag"
                                    onClick={volverRaiz}
                                >
                                    Raíces
                                </button>
                                {pila.map((nodo, i) => (
                                    <span key={nodo.id}>
                                        {' / '}
                                        <button
                                            type="button"
                                            className="ruta-tag"
                                            onClick={() => volverA(i)}
                                        >
                                            {nodo.nombre}
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <p className="section-mini-title">{tituloSeccion}</p>

                        <table className="table-clean skills-table">
                            <tbody>
                            {nodosActuales.length === 0 && (
                                <tr>
                                    <td>No hay categorías disponibles en este nivel.</td>
                                </tr>
                            )}

                            {nodosCategoria.map(c => (
                                <tr key={c.id}>
                                    <td>{c.nombre}</td>
                                    <td className="actions-cell actions-cell-right">
                                        <button
                                            type="button"
                                            className="btn btn-outline btn-sm"
                                            onClick={() => entrar(c)}
                                        >
                                            Entrar
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {nodosHoja.map(c => (
                                <tr key={c.id}>
                                    <td>{c.nombre}</td>
                                    <td className="actions-cell actions-cell-right">
                                        <span className="ruta-tag">Hoja</span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        {pila.length > 0 && (
                            <div className="back-section">
                                <button
                                    type="button"
                                    className="btn btn-secondary btn-action"
                                    onClick={volverRaiz}
                                >
                                    Volver a raíces
                                </button>
                            </div>
                        )}
                    </article>

                    <article className="skills-panel skills-panel-form">
                        <h3>Agregar Habilidad</h3>
                        <form className="skills-form" onSubmit={handleAgregar}>
                            <div className="form-group">
                                <label>Característica</label>
                                <select
                                    value={caracSeleccionada}
                                    onChange={e => setCaracSeleccionada(e.target.value)}
                                    required
                                >
                                    <option value="">Seleccione una característica</option>
                                    {nodosHoja.map(c => (
                                        <option key={c.id} value={c.id}>{c.nombre}</option>
                                    ))}
                                </select>
                                {nodosHoja.length === 0 && (
                                    <small style={{ color: 'var(--text-soft)', marginTop: 6 }}>
                                        Navegá hasta una categoría hoja para agregar.
                                    </small>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Nivel (1-5)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={nivel}
                                    onChange={e => setNivel(e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-action"
                                disabled={cargando || nodosHoja.length === 0}
                            >
                                {cargando ? 'Guardando...' : 'Agregar'}
                            </button>
                        </form>
                    </article>

                </section>
            </main>
            <Footer />
        </>
    )
}