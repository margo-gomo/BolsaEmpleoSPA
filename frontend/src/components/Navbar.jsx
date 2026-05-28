import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
    const { usuario, logout } = useAuth()
    const navigate = useNavigate()

    function handleLogout() {
        logout()
        navigate('/')
    }

    return (
        <header className="navbar">
            <div className="nav-container nav-container-admin">

                <div className="logo">
                    <Link to="/"><h2>BolsaEmpleo</h2></Link>
                </div>

                <input type="checkbox" id="menu-toggle" className="nav-toggle" />
                <label htmlFor="menu-toggle" className="nav-toggle-label">
                    <span></span>
                    <span></span>
                    <span></span>
                </label>

                <nav className="nav-links">

                    {!usuario && (
                        <>
                            <Link to="/buscar-puestos">Buscar</Link>
                            <Link to="/registro-empresa">Empresa</Link>
                            <Link to="/registro-oferente">Oferente</Link>
                            <Link to="/login">Login</Link>
                        </>
                    )}

                    {usuario?.tipoUsuario === 'Empresa' && (
                        <>
                            <Link to="/empresa/dashboard">Dashboard</Link>
                            <Link to="/buscar-puestos">Buscar puestos</Link>
                            <Link to="/empresa/publicar-puesto">Publicar puesto</Link>
                            <Link to="/empresa/mis-puestos">Mis puestos</Link>
                            <span className="nav-user-email">{usuario.nombre}</span>
                        </>
                    )}

                    {usuario?.tipoUsuario === 'Oferente' && (
                        <>
                            <Link to="/oferente/dashboard">Dashboard</Link>
                            <Link to="/buscar-puestos">Buscar puestos</Link>
                            <Link to="/oferente/habilidades">Habilidades</Link>
                            <Link to="/oferente/cv">Mi CV</Link>
                            <span className="nav-user-email">{usuario.nombre}</span>
                        </>
                    )}

                    {usuario?.tipoUsuario === 'Admin' && (
                        <>
                            <Link to="/admin/dashboard">Dashboard</Link>
                            <Link to="/buscar-puestos">Buscar puestos</Link>
                            <Link to="/admin/empresas-pendientes">Empresas pendientes</Link>
                            <Link to="/admin/oferentes-pendientes">Oferentes pendientes</Link>
                            <Link to="/admin/caracteristicas">Características</Link>
                            <Link to="/admin/reportes">Reportes</Link>
                            <span className="nav-user-email">{usuario.nombre}</span>
                        </>
                    )}

                    {usuario && (
                        <button onClick={handleLogout} className="btn btn-outline nav-logout-link">
                            Salir
                        </button>
                    )}

                </nav>
            </div>
        </header>
    )
}