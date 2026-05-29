import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function AdminDashboard() {
    const navigate = useNavigate()

    return (
        <>
            <Navbar />
            <main className="page-container admin-page-container">
            <section className="admin-header">
                <h1>Administrador</h1>
                <p>Aprobaciones, catálogo de características y reportes</p>
            </section>

            <section className="admin-dashboard-actions">
                <button className="btn btn-primary btn-action"
                        onClick={() => navigate('/admin/empresas-pendientes')}>
                    Empresas pendientes
                </button>
                <button className="btn btn-primary btn-action"
                        onClick={() => navigate('/admin/oferentes-pendientes')}>
                    Oferentes pendientes
                </button>
                <button className="btn btn-primary btn-action"
                        onClick={() => navigate('/admin/caracteristicas')}>
                    Características
                </button>
                <button className="btn btn-primary btn-action"
                        onClick={() => navigate('/admin/reportes')}>
                    Reportes
                </button>
            </section>
        </main>
            <Footer />
        </>
    )
}