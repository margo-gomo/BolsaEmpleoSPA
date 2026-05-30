import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getPuestosRecientes, getRequisitosPuesto } from '../../api/api'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function Inicio() {
    const { usuario } = useAuth()
    const [puestos, setPuestos] = useState([])
    const [requisitos, setRequisitos] = useState({})
    const [cargandoPuestos, setCargandoPuestos] = useState(true)

    useEffect(() => {
        getPuestosRecientes()
            .then(async (lista) => {
                setPuestos(lista)
                const mapa = {}
                await Promise.all(
                    lista.map(async (p) => {
                        try {
                            mapa[p.id] = await getRequisitosPuesto(p.id)
                        } catch (_) {
                            mapa[p.id] = []
                        }
                    })
                )
                setRequisitos(mapa)
            })
            .catch(console.error)
            .finally(() => setCargandoPuestos(false))
    }, [])

    return (
        <>
            <Navbar />

            <main className="home-main">

                <section className="home-hero">
                    <div className="register-card home-card">

                        {!usuario && (
                            <>
                                <h1>Bienvenido a BolsaEmpleo</h1>
                                <p>Tu plataforma de búsqueda de empleo y reclutamiento.</p>
                                <div className="actions-row">
                                    <Link to="/registro-empresa" className="btn btn-primary">
                                        Soy una empresa
                                    </Link>
                                    <Link to="/registro-oferente" className="btn btn-outline btn-home-outline">
                                        Soy un oferente
                                    </Link>
                                    <Link to="/login" className="btn btn-outline btn-home-outline">
                                        Iniciar sesión
                                    </Link>
                                </div>
                            </>
                        )}

                        {usuario?.tipoUsuario === 'Oferente' && (
                            <>
                                <h1>¡Hola, {usuario.nombre}!</h1>
                                <p>Explorá puestos recientes, administrá tus habilidades y mantené tu currículo actualizado.</p>
                                <div className="actions-row">
                                    <Link to="/oferente/dashboard" className="btn btn-primary">
                                        Ir a mi dashboard
                                    </Link>
                                    <Link to="/buscar-puestos" className="btn btn-outline btn-home-outline">
                                        Buscar puestos
                                    </Link>
                                    <Link to="/oferente/habilidades" className="btn btn-outline btn-home-outline">
                                        Mis habilidades
                                    </Link>
                                    <Link to="/oferente/cv" className="btn btn-outline btn-home-outline">
                                        Mi CV
                                    </Link>
                                </div>
                            </>
                        )}

                        {usuario?.tipoUsuario === 'Empresa' && (
                            <>
                                <h1>¡Hola, {usuario.nombre}!</h1>
                                <p>Gestioná tus publicaciones, revisá candidatos y dá seguimiento a tus puestos disponibles.</p>
                                <div className="actions-row">
                                    <Link to="/empresa/dashboard" className="btn btn-primary">
                                        Ir a mi dashboard
                                    </Link>
                                    <Link to="/empresa/publicar-puesto" className="btn btn-outline btn-home-outline">
                                        Publicar puesto
                                    </Link>
                                    <Link to="/empresa/mis-puestos" className="btn btn-outline btn-home-outline">
                                        Mis puestos
                                    </Link>
                                </div>
                            </>
                        )}

                        {usuario?.tipoUsuario === 'Admin' && (
                            <>
                                <h1>¡Hola, {usuario.nombre}!</h1>
                                <p>Supervisá registros pendientes, administrá características y revisá el estado del sistema.</p>
                                <div className="actions-row">
                                    <Link to="/admin/dashboard" className="btn btn-primary">
                                        Ir a mi dashboard
                                    </Link>
                                    <Link to="/admin/empresas-pendientes" className="btn btn-outline btn-home-outline">
                                        Empresas pendientes
                                    </Link>
                                    <Link to="/admin/oferentes-pendientes" className="btn btn-outline btn-home-outline">
                                        Oferentes pendientes
                                    </Link>
                                    <Link to="/admin/caracteristicas" className="btn btn-outline btn-home-outline">
                                        Características
                                    </Link>
                                </div>
                            </>
                        )}

                    </div>
                </section>

                <section className="recent-jobs">
                    <h2>Puestos recientes</h2>

                    {cargandoPuestos && (
                        <p style={{ color: 'var(--text-soft)', fontSize: 15 }}>Cargando puestos...</p>
                    )}

                    <div className="jobs-container">
                        {!cargandoPuestos && puestos.length === 0 && (
                            <p style={{ color: 'var(--text-soft)', gridColumn: '1/-1' }}>
                                No hay puestos publicados aún.
                            </p>
                        )}

                        {puestos.map(p => (
                            <div key={p.id} className="job-card">
                                <h3>{p.descripcion}</h3>
                                <p className="job-company">{p.empresa}</p>
                                <p className="job-salary">{p.simbolo} {p.salario}</p>

                                <div className="job-hover">
                                    <p><strong>Características requeridas</strong></p>
                                    {requisitos[p.id]?.length > 0 ? (
                                        <ul className="job-hover-list">
                                            {requisitos[p.id].map(c => (
                                                <li key={c.id}>
                                                    {c.caracteristica} (nivel {c.nivel})
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p style={{ marginTop: 8, opacity: 0.85 }}>
                                            Sin características registradas.
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </main>

            <Footer />
        </>
    )
}