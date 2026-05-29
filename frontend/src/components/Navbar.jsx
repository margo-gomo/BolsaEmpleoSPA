import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
    const { usuario, logout } = useAuth()
    const navigate = useNavigate()
    const [menuAbierto, setMenuAbierto] = useState(false)
    const cerrar = () => setMenuAbierto(false)

    function handleLogout() {
        logout()
        navigate('/')
        cerrar()
    }

    const esAdmin = usuario?.tipoUsuario === 'Admin'

    return (
        <nav className="navbar">
            <div className={`nav-container${esAdmin ? ' nav-container-admin' : ''}`}>
                <div className="logo">
                    <NavLink to="/" end onClick={cerrar}>
                        <h2>BolsaEmpleo</h2>
                    </NavLink>
                </div>

                <button
                    type="button"
                    className="nav-toggle-label"
                    onClick={() => setMenuAbierto(!menuAbierto)}
                    aria-label="Menú"
                >
                    <span /><span /><span />
                </button>

                <div className={`nav-links${menuAbierto ? ' open' : ''}`}>

                    {/* ── Sin sesión ── */}
                    {!usuario && (
                        <>
                            <NavLink to="/buscar-puestos" end onClick={cerrar}>Buscar puestos</NavLink>
                            <NavLink to="/registro-empresa" end onClick={cerrar}>Registrar empresa</NavLink>
                            <NavLink to="/registro-oferente" end onClick={cerrar}>Registrarme como oferente</NavLink>
                            <NavLink to="/login" end onClick={cerrar}>Iniciar sesión</NavLink>
                        </>
                    )}

                    {/* ── Empresa ── */}
                    {usuario?.tipoUsuario === 'Empresa' && (
                        <>
                            <NavLink to="/empresa/dashboard" end onClick={cerrar}>Dashboard</NavLink>
                            <NavLink to="/buscar-puestos" end onClick={cerrar}>Buscar puestos</NavLink>
                            <NavLink to="/empresa/publicar-puesto" end onClick={cerrar}>Publicar puesto</NavLink>
                            <NavLink to="/empresa/mis-puestos" end onClick={cerrar}>Mis puestos</NavLink>
                        </>
                    )}

                    {/* ── Oferente ── */}
                    {usuario?.tipoUsuario === 'Oferente' && (
                        <>
                            <NavLink to="/oferente/dashboard" end onClick={cerrar}>Dashboard</NavLink>
                            <NavLink to="/buscar-puestos" end onClick={cerrar}>Buscar puestos</NavLink>
                            <NavLink to="/oferente/habilidades" end onClick={cerrar}>Mis habilidades</NavLink>
                            <NavLink to="/oferente/cv" end onClick={cerrar}>Mi CV</NavLink>
                        </>
                    )}

                    {/* ── Admin ── */}
                    {usuario?.tipoUsuario === 'Admin' && (
                        <>
                            <NavLink to="/admin/dashboard" end onClick={cerrar}>Dashboard</NavLink>
                            <NavLink to="/buscar-puestos" end onClick={cerrar}>Buscar puestos</NavLink>
                            <NavLink to="/admin/empresas-pendientes" end onClick={cerrar}>Empresas pendientes</NavLink>
                            <NavLink to="/admin/oferentes-pendientes" end onClick={cerrar}>Oferentes pendientes</NavLink>
                            <NavLink to="/admin/caracteristicas" end onClick={cerrar}>Características</NavLink>
                            <NavLink to="/admin/reportes" end onClick={cerrar}>Reportes</NavLink>
                        </>
                    )}

                    {usuario && (
                        <>
                            <span className="nav-user-email">{usuario.nombre}</span>
                            <button onClick={handleLogout} className="btn btn-outline btn-sm nav-logout-link">
                                Salir
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}