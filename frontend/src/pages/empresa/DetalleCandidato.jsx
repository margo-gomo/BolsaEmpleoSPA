import { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getDetalleCandidato, verCvCandidato } from '../../api/api'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function DetalleCandidato() {
    const { token }          = useAuth()
    const { id }             = useParams()
    const [searchParams]     = useSearchParams()
    const puestoId           = searchParams.get('puestoId')
    const navigate           = useNavigate()

    const [oferente, setOferente] = useState(null)
    const [cargando, setCargando] = useState(true)
    const [error, setError]       = useState('')
    const [cvError, setCvError]   = useState('')

    useEffect(() => {
        getDetalleCandidato(id, token)
            .then(data => setOferente(data))
            .catch(() => setError('Error al cargar el candidato.'))
            .finally(() => setCargando(false))
    }, [id, token])

    const verCV = async () => {
        setCvError('')
        try {
            await verCvCandidato(id, token)
        } catch {
            setCvError('Este candidato no tiene CV disponible.')
        }
    }

    if (cargando) {
        return (
            <>
                <Navbar />
                <main className="page-container"><p>Cargando...</p></main>
                <Footer />
            </>
        )
    }

    if (error || !oferente) {
        return (
            <>
                <Navbar />
                <main className="page-container">
                    <div className="message-box error">{error || 'Candidato no encontrado.'}</div>
                    <button className="btn btn-light"
                            onClick={() => navigate(puestoId ? `/empresa/buscar-candidatos/${puestoId}` : '/empresa/mis-puestos')}>
                        Volver
                    </button>
                </main>
                <Footer />
            </>
        )
    }

    return (
        <>
            <Navbar />
            <main className="page-container">
                <section className="page-header">
                    <h1>Detalle del candidato</h1>
                </section>

                {cvError && <div className="message-box error">{cvError}</div>}

                <section className="detail-card">
                    <h2>{oferente.nombre} {oferente.primerApellido}</h2>
                    <div className="detail-grid">
                        <div>
                            <p><strong>Identificación:</strong> {oferente.identificacion}</p>
                            <p><strong>Correo:</strong> {oferente.correo ?? 'No disponible'}</p>
                            <p><strong>Teléfono:</strong> {oferente.prefijo} {oferente.telefono}</p>
                        </div>
                        <div>
                            <p><strong>Residencia:</strong> {oferente.localidad ?? 'No especificada'}</p>
                            <p>
                                <strong>CV:</strong>{' '}
                                {oferente.rutaCv ? (
                                    <button className="btn btn-outline btn-sm" onClick={verCV}>
                                        Ver CV (PDF)
                                    </button>
                                ) : (
                                    'No ha subido CV'
                                )}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="back-section">
                    <button className="btn btn-light"
                            onClick={() =>
                                navigate(puestoId
                                    ? `/empresa/buscar-candidatos/${puestoId}`
                                    : '/empresa/mis-puestos')
                            }>
                        Volver a candidatos
                    </button>
                </section>
            </main>
            <Footer />
        </>
    )
}