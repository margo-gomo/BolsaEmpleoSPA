import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getCaracteristicasAdmin, crearCaracteristica } from '../../api/api'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function Caracteristicas() {
    const { token } = useAuth()

    const [arbol, setArbol]           = useState([])
    const [actualId, setActualId]     = useState(null)
    const [breadcrumb, setBreadcrumb] = useState([])
    const [hijos, setHijos]           = useState([])
    const [nombre, setNombre]         = useState('')
    const [mensaje, setMensaje]       = useState('')
    const [errorMsg, setErrorMsg]     = useState('')

    const encontrarHijas = useCallback((nodos, padreId) => {
        if (padreId === null) return nodos
        for (const nodo of nodos) {
            if (nodo.id === padreId) return nodo.hijas || []
            if (nodo.hijas) {
                const res = encontrarHijas(nodo.hijas, padreId)
                if (res.length > 0 || nodo.id === padreId) return res
            }
        }
        return []
    }, [])


    const cargarArbol = useCallback((mantenerActualId = null, mantenerBc = []) => {
        getCaracteristicasAdmin(token).then(data => {
            setArbol(data)
            setActualId(mantenerActualId)
            setBreadcrumb(mantenerBc)
            setHijos(encontrarHijas(data, mantenerActualId))
        }).catch(console.error)
    }, [token, encontrarHijas])

    useEffect(() => { cargarArbol(null, []) }, [token])

    const entrar = (nodo) => {
        const nuevoBc = [...breadcrumb, { id: nodo.id, nombre: nodo.nombre }]
        setActualId(nodo.id)
        setBreadcrumb(nuevoBc)
        setHijos(encontrarHijas(arbol, nodo.id))
    }

    const volverARaices = () => {
        setActualId(null)
        setBreadcrumb([])
        setHijos(encontrarHijas(arbol, null))
    }

    const irNivel = (item, i) => {
        const bc = breadcrumb.slice(0, i + 1)
        setActualId(item.id)
        setBreadcrumb(bc)
        setHijos(encontrarHijas(arbol, item.id))
    }

    const handleAgregar = async (e) => {
        e.preventDefault()
        setMensaje('')
        setErrorMsg('')
        try {
            await crearCaracteristica({ nombre, idPadre: actualId }, token)
            setNombre('')
            setMensaje('La característica fue registrada correctamente.')
            setTimeout(() => setMensaje(''), 3000)
            cargarArbol(actualId, breadcrumb)
        } catch (err) {
            setErrorMsg(
                err.message.includes('409') || err.message.toLowerCase().includes('conflict')
                    ? 'Ya existe una característica con ese nombre.'
                    : 'Error al crear la característica.'
            )
        }
    }

    const rutaActual = breadcrumb.map(b => b.nombre).join(' / ') || null

    return (
        <>
            <Navbar />
            <main className="page-container admin-page-container">
            <section className="admin-header">
                <h1>Características</h1>
            </section>

            {mensaje  && <div className="message-box success">{mensaje}</div>}
            {errorMsg && <div className="message-box error">{errorMsg}</div>}

            <section className="admin-caracteristicas-layout">

                <article className="admin-caracteristicas-panel">

                    <div className="admin-ruta-box">
                        <strong>Ruta:</strong>
                        <div className="ruta-tags">
              <span
                  className="ruta-tag"
                  style={{ cursor: 'pointer' }}
                  onClick={volverARaices}>
                Raíces
              </span>
                            {breadcrumb.map((item, i) => (
                                <span key={item.id}>
                  {' / '}
                                    <span
                                        className="ruta-tag"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => irNivel(item, i)}>
                    {item.nombre}
                  </span>
                </span>
                            ))}
                        </div>
                    </div>

                    <p className="section-mini-title">
                        {actualId === null ? 'Categorías raíz' : 'Subcategorías'}
                    </p>

                    <table className="table-clean admin-subcat-table">
                        <tbody>
                        {hijos.length === 0 ? (
                            <tr><td>No hay subcategorías disponibles.</td></tr>
                        ) : (
                            hijos.map(c => (
                                <tr key={c.id}>
                                    <td>{c.nombre}</td>
                                    <td className="admin-action-cell">
                                        <button
                                            className="btn btn-outline btn-sm"
                                            onClick={() => entrar(c)}>
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
                            <button className="btn btn-secondary btn-action" onClick={volverARaices}>
                                Volver a raíces
                            </button>
                        </div>
                    )}
                </article>
                <article className="admin-caracteristicas-panel admin-caracteristicas-form-panel">
                    <h3>Agregar característica</h3>

                    <form onSubmit={handleAgregar} className="admin-caracteristicas-form">
                        <div className="form-group">
                            <label htmlFor="nombre">Característica</label>
                            <input
                                type="text"
                                id="nombre"
                                placeholder="Ingrese el nombre de la característica"
                                value={nombre}
                                onChange={e => setNombre(e.target.value)}
                                required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="padreInfo">Padre</label>
                            <input
                                type="text"
                                id="padreInfo"
                                value={rutaActual ?? 'Raíces'}
                                disabled />
                        </div>

                        <button type="submit" className="btn btn-primary btn-action">
                            Agregar
                        </button>
                    </form>
                </article>

            </section>
        </main>
            <Footer />
        </>
    )
}
