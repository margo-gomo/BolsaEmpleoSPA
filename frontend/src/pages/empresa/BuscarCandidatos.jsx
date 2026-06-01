import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { buscarCandidatos } from '../../api/api'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function BuscarCandidatos() {
    const { token }    = useAuth()
    const { puestoId } = useParams()
    const navigate     = useNavigate()

    const [candidatos, setCandidatos] = useState([])
    const [cargando, setCargando]     = useState(true)
    const [error, setError]           = useState('')

    useEffect(() => {
        buscarCandidatos(puestoId, token)
            .then(data => {

                const ordenados = [...data].sort((a, b) =>
                    parseFloat(b.porcentaje) - parseFloat(a.porcentaje)
                )
                setCandidatos(ordenados)
            })
            .catch(() => setError('Error al cargar los candidatos.'))
            .finally(() => setCargando(false))
    }, [token, puestoId])

    return (
        <>
            <Navbar />
            <main className="page-container">
                <section className="page-header">
                    <h1>Candidatos para el puesto #{puestoId}</h1>
                    <p>Oferentes ordenados por porcentaje de coincidencia con los requisitos.</p>
                </section>

                {error && <div className="message-box error">{error}</div>}

                <section className="table-section">
                    {cargando ? (
                        <p>Cargando candidatos...</p>
                    ) : (
                        <table className="table-clean">
                            <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Requisitos cumplidos</th>
                                <th>% Coincidencia</th>
                                <th>Acción</th>
                            </tr>
                            </thead>
                            <tbody>
                            {candidatos.length === 0 ? (
                                <tr>
                                    <td colSpan="4">
                                        No hay candidatos que cumplan requisitos para este puesto.
                                    </td>
                                </tr>
                            ) : (
                                candidatos.map(c => (
                                    <tr key={c.id}>
                                        <td>{c.nombre} {c.primerApellido}</td>
                                        <td>{c.cumple} / {c.total}</td>
                                        <td>
                        <span className={
                            parseFloat(c.porcentaje) >= 80 ? 'badge-activo' :
                                parseFloat(c.porcentaje) >= 50 ? 'badge-medio' : 'badge-inactivo'
                        }>
                          {parseFloat(c.porcentaje).toFixed(1)}%
                        </span>
                                        </td>
                                        <td>
                                            <button className="btn btn-outline btn-sm"
                                                    onClick={() =>
                                                        navigate(`/empresa/detalle-candidato/${c.oferenteId}?puestoId=${puestoId}`)
                                                    }>
                                                Ver detalle
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    )}
                </section>

                <section className="back-section">
                    <button className="btn btn-light"
                            onClick={() => navigate('/empresa/mis-puestos')}>
                        Volver a mis puestos
                    </button>
                </section>
            </main>
            <Footer />
        </>
    )
}