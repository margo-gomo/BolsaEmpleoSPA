import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { getDashboardOferente, getHabilidades, getMisSolicitudes } from '../../api/api'
import { useAuth } from '../../context/AuthContext'

export default function OferenteDashboard() {
    const { token } = useAuth()
    const [perfil, setPerfil] = useState(null)
    const [cantHabilidades, setCantHabilidades] = useState(0)
    const [cantSolicitudes, setCantSolicitudes] = useState(0)

    useEffect(() => {
        getDashboardOferente(token)
            .then(d => setPerfil(d))
            .catch(() => {})

        getHabilidades(token)
            .then(d => setCantHabilidades(d?.length ?? 0))
            .catch(() => {})

        getMisSolicitudes(token)
            .then(d => setCantSolicitudes(d?.length ?? 0))
            .catch(() => {})
    }, [token])

    return (
        <>
            <Navbar />
            <div className="page-container">
                <div className="page-header">
                    <h1>
                        Bienvenido, {perfil ? `${perfil.nombre} ${perfil.primerApellido}` : '...'}
                    </h1>
                    <p>Panel de oferente — gestioná tu perfil y postulate a puestos.</p>
                </div>

                {/* Estadísticas */}
                <div className="dashboard-stats">
                    <div className="stat-card">
                        <h3>Habilidades registradas</h3>
                        <div className="stat-value">{cantHabilidades}</div>
                    </div>
                    <div className="stat-card">
                        <h3>Puestos solicitados</h3>
                        <div className="stat-value">{cantSolicitudes}</div>
                    </div>
                </div>

                {/* Datos del perfil */}
                {perfil && (
                    <div className="detail-card" style={{ marginBottom: 24 }}>
                        <h3 style={{ marginBottom: 14 }}>Mis datos</h3>
                        <p><strong>Identificación:</strong> {perfil.identificacion}</p>
                        <p><strong>Nombre:</strong> {perfil.nombre} {perfil.primerApellido}</p>
                        <p><strong>Teléfono:</strong> {perfil.telefono}</p>
                        <p>
                            <strong>CV:</strong>{' '}
                            {perfil.rutaCv
                                ? <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Cargado ✓</span>
                                : <span style={{ color: 'var(--text-soft)' }}>No cargado aún</span>
                            }
                        </p>
                    </div>
                )}

                {/* Acciones */}
                <div className="actions-section">
                    <Link to="/oferente/habilidades" className="btn btn-primary btn-action">
                        Mis habilidades
                    </Link>
                    <Link to="/oferente/cv" className="btn btn-outline btn-action">
                        {perfil?.rutaCv ? 'Actualizar CV' : 'Subir CV'}
                    </Link>
                    <Link to="/buscar-puestos" className="btn btn-outline btn-action">
                        Buscar puestos
                    </Link>
                </div>
            </div>
            <Footer />
        </>
    )
}