import { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getDetalleCandidato, verCvCandidato } from '../../api/api'

export default function DetalleCandidato() {
    const { token }               = useAuth()
    const { id }                  = useParams()
    const [searchParams]          = useSearchParams()
    const puestoId                = searchParams.get('puestoId')
    const navigate                = useNavigate()

    const [oferente, setOferente]     = useState(null)
    const [habilidades, setHabs]      = useState([])
    const [error, setError]           = useState('')

    useEffect(() => {
        getDetalleCandidato(id, token).then(data => {
            setOferente(data.oferente ?? data)
            setHabs(data.habilidades ?? [])
        }).catch(() => setError('Error al cargar el candidato.'))
    }, [id, token])

    const verCV = async () => {
        try { await verCvCandidato(id, token) }
        catch { setError('CV no disponible.') }
    }

    if (!oferente) return <main className="page-container"><p>Cargando...</p></main>

    return (
        <main className="page-container">
            <section className="page-header">
                <h1>Detalle de oferente</h1>
            </section>

            {error && <div className="message-box error">{error}</div>}

            <section className="detail-card">
                <p><strong>{oferente.nombre} {oferente.primerApellido}</strong></p>
                <p><strong>Identificación:</strong> {oferente.identificacion}</p>
                <p><strong>Email:</strong> {oferente.correo}</p>
                <p><strong>Teléfono:</strong> {oferente.prefijo} {oferente.telefono}</p>
                <p><strong>Residencia:</strong> {oferente.localidad}</p>

                {oferente.rutaCv ? (
                    <div className="actions-section">
                        <button className="btn btn-outline btn-sm" onClick={verCV}>
                            Ver CV
                        </button>
                    </div>
                ) : (
                    <p>Este candidato no ha subido su CV.</p>
                )}
            </section>

            <section className="skills-section">
                <h2>Habilidades</h2>
                <table className="table-clean">
                    <thead>
                    <tr><th>Característica</th><th>Nivel</th></tr>
                    </thead>
                    <tbody>
                    {habilidades.length === 0 ? (
                        <tr><td colSpan="2">Este candidato no tiene habilidades registradas.</td></tr>
                    ) : (
                        habilidades.map((h, i) => (
                            <tr key={i}>
                                <td>{h.caracteristica}</td>
                                <td>{h.nivel}</td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </section>

            <section className="back-section">
                <button className="btn btn-light"
                        onClick={() => puestoId
                            ? navigate(`/empresa/buscar-candidatos/${puestoId}`)
                            : navigate('/empresa/mis-puestos')}>
                    Volver
                </button>
            </section>
        </main>
    )
}