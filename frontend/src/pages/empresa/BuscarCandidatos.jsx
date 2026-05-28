import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { buscarCandidatos } from '../../api/api'

export default function BuscarCandidatos() {
    const { token }    = useAuth()
    const { puestoId } = useParams()
    const navigate     = useNavigate()
    const [candidatos, setCandidatos] = useState([])
    const [error, setError]           = useState('')

    useEffect(() => {
        buscarCandidatos(puestoId, token)
            .then(setCandidatos)
            .catch(() => setError('Error al cargar candidatos.'))
    }, [token, puestoId])

    return (
        <main className="page-container">
            <section className="page-header">
                <h1>Candidatos para el puesto</h1>
            </section>

            {error && <div className="message-box error">{error}</div>}

            <section className="table-section">
                <table className="table-clean">
                    <thead>
                    <tr>
                        <th>Oferente</th>
                        <th>Requisitos cumplidos</th>
                        <th>% Coincidencia</th>
                        <th>Acción</th>
                    </tr>
                    </thead>
                    <tbody>
                    {candidatos.length === 0 ? (
                        <tr><td colSpan="4">No hay candidatos disponibles para este puesto.</td></tr>
                    ) : (
                        candidatos.map(c => (
                            <tr key={c.oferenteId}>
                                <td>{c.nombre} {c.primerApellido}</td>
                                <td>
                                    {c.cumple} / {c.total}
                                    <small style={{ color: '#6b7280', fontSize: '11px' }}> (coincidencia)</small>
                                </td>
                                <td>{c.porcentaje}%</td>
                                <td>
                                    <button className="btn btn-outline btn-sm"
                                            onClick={() => navigate(`/empresa/detalle-candidato/${c.oferenteId}?puestoId=${puestoId}`)}>
                                        Ver detalle
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </section>

            <section className="back-section">
                <button className="btn btn-light"
                        onClick={() => navigate('/empresa/mis-puestos')}>
                    Volver
                </button>
            </section>
        </main>
    )
}