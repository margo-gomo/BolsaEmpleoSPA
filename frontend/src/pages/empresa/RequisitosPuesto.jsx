import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
    getCaracteristicasAdmin,
    getRequisitosPuesto,
    agregarRequisito,
    eliminarRequisito
} from '../../api/api'

export default function RequisitosPuesto() {
    const { token }    = useAuth()
    const { puestoId } = useParams()
    const navigate     = useNavigate()

    const [arbol, setArbol]       = useState([])
    const [actualId, setActualId] = useState(null)
    const [breadcrumb, setBc]     = useState([])
    const [hijas, setHijas]       = useState([])
    const [requisitos, setReqs]   = useState([])
    const [caracId, setCaracId]   = useState('')
    const [nivel, setNivel]       = useState('')
    const [error, setError]       = useState('')

    const encontrarHijas = useCallback((nodos, padreId) => {
        if (padreId === null) return nodos
        for (const n of nodos) {
            if (n.id === padreId) return n.hijas || []
            if (n.hijas) {
                const r = encontrarHijas(n.hijas, padreId)
                if (r.length > 0) return r
            }
        }
        return []
    }, [])

    const cargarArbol = useCallback(() => {
        getCaracteristicasAdmin(token).then(data => {
            setArbol(data)
            setHijas(encontrarHijas(data, null))
        })
    }, [token, encontrarHijas])

    const cargarRequisitos = useCallback(() => {
        getRequisitosPuesto(puestoId).then(setReqs).catch(console.error)
    }, [puestoId])

    useEffect(() => { cargarArbol(); cargarRequisitos() }, [token, puestoId])

    const entrar = (nodo) => {
        const bc = [...breadcrumb, { id: nodo.id, nombre: nodo.nombre }]
        setBc(bc)
        setActualId(nodo.id)
        setHijas(encontrarHijas(arbol, nodo.id))
    }

    const volver = () => {
        setBc([]); setActualId(null)
        setHijas(encontrarHijas(arbol, null))
    }

    const irNivel = (item, i) => {
        const bc = breadcrumb.slice(0, i + 1)
        setBc(bc); setActualId(item.id)
        setHijas(encontrarHijas(arbol, item.id))
    }

    const handleAgregar = async (e) => {
        e.preventDefault(); setError('')
        try {
            await agregarRequisito(puestoId, { caracteristicaId: parseInt(caracId), nivel: parseInt(nivel) }, token)
            setCaracId(''); setNivel('')
            cargarRequisitos()
        } catch { setError('Error al agregar el requisito.') }
    }

    const handleEliminar = async (r) => {
        if (!window.confirm('¿Eliminar este requisito?')) return
        const idCarac = r.caracteristicaId ?? r.id
        try {
            await eliminarRequisito(puestoId, idCarac, token)
            cargarRequisitos()
        } catch { setError('Error al eliminar el requisito.') }
    }

    return (
        <main className="page-container">
            <section className="skills-page-header">
                <h1>Requisitos del puesto</h1>
            </section>

            {error && <div className="message-box error">{error}</div>}

            <section className="skills-layout skills-layout-habilidades">

                <article className="skills-panel skills-panel-wide">
                    <h3>Requisitos registrados</h3>
                    <table className="table-clean skills-table">
                        <thead><tr><th>Característica</th><th>Nivel</th><th></th></tr></thead>
                        <tbody>
                        {requisitos.length === 0 ? (
                            <tr><td colSpan="3">Aún no hay requisitos para este puesto.</td></tr>
                        ) : (
                            requisitos.map((r, i) => (
                                <tr key={i}>
                                    <td>{r.caracteristica}</td>
                                    <td>{r.nivel}</td>
                                    <td className="actions-cell actions-cell-right">
                                        <button className="btn btn-danger btn-sm"
                                                onClick={() => handleEliminar(r)}>
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                    <div className="back-section">
                        <button className="btn btn-secondary btn-action"
                                onClick={() => navigate('/empresa/mis-puestos')}>
                            Finalizar
                        </button>
                    </div>
                </article>

                <article className="skills-panel skills-panel-wide">
                    <div className="skills-ruta-header">
                        <span className="ruta-label">Ruta:</span>
                        <div className="ruta-tags">
                            <span className="ruta-tag" style={{ cursor: 'pointer' }} onClick={volver}>Raíces</span>
                            {breadcrumb.map((b, i) => (
                                <span key={b.id}>
                  {' / '}
                                    <span className="ruta-tag" style={{ cursor: 'pointer' }}
                                          onClick={() => irNivel(b, i)}>{b.nombre}</span>
                </span>
                            ))}
                        </div>
                    </div>

                    <p className="section-mini-title">
                        {actualId === null ? 'Categorías disponibles' : 'Subcategorías'}
                    </p>

                    <table className="table-clean skills-table">
                        <tbody>
                        {hijas.length === 0 ? (
                            <tr><td>No hay categorías en este nivel.</td></tr>
                        ) : (
                            hijas.map(c => (
                                <tr key={c.id}>
                                    <td>{c.nombre}</td>
                                    <td className="actions-cell actions-cell-right">
                                        <button className="btn btn-outline btn-sm" onClick={() => entrar(c)}>
                                            Entrar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>

                    {actualId !== null && (
                        <div className="back-section">
                            <button className="btn btn-secondary btn-action" onClick={volver}>
                                Volver a raíces
                            </button>
                        </div>
                    )}
                </article>

                <article className="skills-panel skills-panel-form">
                    <h3>Agregar Requisito</h3>
                    <form onSubmit={handleAgregar} className="skills-form">
                        <div className="form-group">
                            <label htmlFor="caracId">Característica</label>
                            <select id="caracId" value={caracId}
                                    onChange={e => setCaracId(e.target.value)} required>
                                <option value="">Seleccione una característica</option>
                                {hijas.map(c => (
                                    <option key={c.id} value={c.id}>{c.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="nivel">Nivel (1-5)</label>
                            <input type="number" id="nivel" min="1" max="5"
                                   value={nivel} onChange={e => setNivel(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn btn-primary btn-action">Agregar</button>
                    </form>
                </article>

            </section>
        </main>
    )
}
