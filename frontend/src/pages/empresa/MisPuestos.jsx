import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getMisPuestos, desactivarPuesto, activarPuesto } from '../../api/api'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function MisPuestos() {
    const { token } = useAuth()
    const navigate  = useNavigate()
    const [puestos, setPuestos] = useState([])
    const [mensaje, setMensaje] = useState('')
    const [error, setError]     = useState('')

    const cargar = () =>
        getMisPuestos(token).then(setPuestos).catch(console.error)

    useEffect(() => { cargar() }, [token])

    const handleDesactivar = async (id) => {
        try {
            await desactivarPuesto(id, token)
            setMensaje('Puesto desactivado correctamente.')
            setTimeout(() => setMensaje(''), 3000)
            cargar()
        } catch { setError('Error al desactivar el puesto.') }
    }

    const handleActivar = async (id) => {
        try {
            await activarPuesto(id, token)
            setMensaje('Puesto reactivado correctamente.')
            setTimeout(() => setMensaje(''), 3000)
            cargar()
        } catch { setError('Error al activar el puesto.') }
    }

    return (
        <>
            <Navbar />
            <main className="page-container">
                <section className="page-header">
                    <h1>Mis puestos</h1>
                </section>

                {mensaje && <div className="message-box success">{mensaje}</div>}
                {error   && <div className="message-box error">{error}</div>}

                <section className="toolbar-section">
                    <button className="btn btn-primary btn-action"
                            onClick={() => navigate('/empresa/publicar-puesto')}>
                        Publicar nuevo puesto
                    </button>
                </section>

                <section className="table-section">
                    <table className="table-clean">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Descripción</th>
                            <th>Salario</th>
                            <th>Moneda</th>
                            <th>Tipo</th>
                            <th>Activo</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {puestos.length === 0 ? (
                            <tr>
                                <td colSpan="7">No tenés puestos registrados aún.</td>
                            </tr>
                        ) : (
                            puestos.map(p => (
                                <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td>{p.descripcion}</td>
                                    <td>{p.salario}</td>
                                    <td>{p.idMoneda?.nombre ?? p.moneda ?? '-'}</td>
                                    <td>{p.tipo}</td>
                                    <td>
                      <span className={p.activo === 'Sí' ? 'badge-activo' : 'badge-inactivo'}>
                        {p.activo}
                      </span>
                                    </td>
                                    <td className="actions-cell">
                                        {p.activo === 'Sí' ? (
                                            <button className="btn btn-danger btn-sm"
                                                    onClick={() => handleDesactivar(p.id)}>
                                                Desactivar
                                            </button>
                                        ) : (
                                            <button className="btn btn-secondary btn-sm"
                                                    onClick={() => handleActivar(p.id)}>
                                                Reactivar
                                            </button>
                                        )}
                                        <button className="btn btn-outline btn-sm"
                                                onClick={() => navigate(`/empresa/requisitos-puesto/${p.id}`)}>
                                            Requisitos
                                        </button>
                                        <button className="btn btn-outline btn-sm"
                                                onClick={() => navigate(`/empresa/buscar-candidatos/${p.id}`)}>
                                            Candidatos
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </section>
            </main>
            <Footer />
        </>
    )
}