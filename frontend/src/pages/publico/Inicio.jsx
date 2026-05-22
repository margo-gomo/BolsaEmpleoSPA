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

    useEffect(() => {
        getPuestosRecientes()
            .then(async (lista) => {
                setPuestos(lista)
                const mapa = {}
                await Promise.all(
                    lista.map(async (p) => {
                        try {
                            const reqs = await getRequisitosPuesto(p.id)
                            mapa[p.id] = reqs
                        } catch (_) {
                            mapa[p.id] = []
                        }
                    })
                )
                setRequisitos(mapa)
            })
            .catch(console.error)
    }, [])

    return (
        <>
            <Navbar />

            <main className="home-main">

                {/* ── Panel izquierdo: bienvenida según rol ── */}
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
                                </div>
                            </>
                        )}

                        {usuario?.tipoUsuario === 'Oferente' && (
                            <>
                                <h1>Bienvenido de nuevo</h1>
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
                                <h1>Bienvenida empresa</h1>
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
                                <h1>Bienvenido administrador</h1>
                                <p>Supervisá registros pendientes, administrá características y revisá el estado general del sistema.</p>
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

                {/* ── Panel derecho: últimos 5 puestos ── */}
                <section className="recent-jobs">
                    <h2>Puestos recientes</h2>
                    <div className="jobs-container">
                        {puestos.map(p => (
                            <div key={p.id} className="job-card">
                                <h3>{p.descripcion}</h3>
                                <p className="job-company">{p.empresa}</p>
                                <p className="job-salary">{p.moneda} {p.salario}</p>

                                <div className="job-hover">
                                    <p><strong>Características requeridas</strong></p>
                                    {requisitos[p.id] && requisitos[p.id].length > 0 ? (
                                        <ul className="job-hover-list">
                                            {requisitos[p.id].map(c => (
                                                <li key={c.id}>
                                                    {c.caracteristica} (nivel {c.nivel})
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>Sin características registradas.</p>
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