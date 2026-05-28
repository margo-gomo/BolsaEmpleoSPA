import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getMisPuestos, desactivarPuesto, activarPuesto } from '../../api/api'

export default function MisPuestos() {
    const { token } = useAuth()
    const navigate  = useNavigate()
    const [puestos, setPuestos] = useState([])
    const [error, setError]     = useState('')

    const cargar = () =>
        getMisPuestos(token).then(setPuestos).catch(console.error)

    useEffect(() => { cargar() }, [token])

    const toggleActivo = async (p) => {
        try {
            if (p.activo === 'Sí') await desactivarPuesto(p.id, token)
            else                   await activarPuesto(p.id, token)
            cargar()
        } catch {
            setError('Error al cambiar estado del puesto.')
        }
    }

    return (
        <main className="page-container">
            <section className="page-header">
                <h1>Mis puestos</h1>
            </section>

            {error && <div className="message-box error">{error}</div>}

            <section className="toolbar-section">
                <button className="btn btn-primary btn-action"
                        onClick={() => navigate('/empresa/publicar-puesto')}>
                    Publicar puesto
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
                        <tr><td colSpan="7">Todavía no tenés puestos registrados.</td></tr>
                    ) : (
                        puestos.map(p => (
                            <tr key={p.id}>
                                <td>{p.id}</td>
                                <td>{p.descripcion}</td>
                                <td>{p.salario}</td>
                                <td>{p.idMoneda?.nombre ?? '-'}</td>
                                <td>{p.tipo}</td>
                                <td>
                    <span className={p.activo === 'Sí' ? 'badge-activo' : 'badge-inactivo'}>
                      {p.activo}
                    </span>
                                </td>
                                <td className="actions-cell">
                                    <button
                                        className={`btn btn-sm ${p.activo === 'Sí' ? 'btn-danger' : 'btn-secondary'}`}
                                        onClick={() => toggleActivo(p)}>
                                        {p.activo === 'Sí' ? 'Desactivar' : 'Reactivar'}
                                    </button>
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
    )
}