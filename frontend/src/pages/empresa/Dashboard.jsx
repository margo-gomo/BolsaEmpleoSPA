import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getMisPuestos } from '../../api/api'

export default function EmpresaDashboard() {
    const { token, usuario } = useAuth()
    const navigate = useNavigate()
    const [stats, setStats] = useState({ total: 0, activos: 0, inactivos: 0 })

    useEffect(() => {
        getMisPuestos(token).then(puestos => {
            const activos   = puestos.filter(p => p.activo === 'Sí').length
            const inactivos = puestos.filter(p => p.activo === 'No').length
            setStats({ total: puestos.length, activos, inactivos })
        }).catch(console.error)
    }, [token])

    return (
        <main className="page-container">
            <section className="page-header">
                <h1>Bienvenido, {usuario?.nombre ?? 'Empresa'}</h1>
                <p>Desde aquí podés administrar tus puestos y buscar candidatos.</p>
            </section>

            <section className="dashboard-stats">
                <div className="stat-card">
                    <h3>Puestos totales</h3>
                    <span className="stat-value">{stats.total}</span>
                </div>
                <div className="stat-card">
                    <h3>Puestos activos</h3>
                    <span className="stat-value">{stats.activos}</span>
                </div>
                <div className="stat-card">
                    <h3>Puestos inactivos</h3>
                    <span className="stat-value">{stats.inactivos}</span>
                </div>
            </section>

            <section className="actions-section">
                <button className="btn btn-primary btn-action"
                        onClick={() => navigate('/empresa/mis-puestos')}>
                    Ver mis puestos
                </button>
                <button className="btn btn-secondary btn-action"
                        onClick={() => navigate('/empresa/publicar-puesto')}>
                    Publicar nuevo puesto
                </button>
            </section>
        </main>
    )
}
