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
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">BolsaEmpleo</Link>
            </div>
            <div className="navbar-links">
                <Link to="/buscar-puestos">Buscar</Link>

                {!usuario && (
                    <>
                        <Link to="/registro-empresa">Empresa</Link>
                        <Link to="/registro-oferente">Oferente</Link>
                        <Link to="/login">Login</Link>
                    </>
                )}

                {usuario?.tipoUsuario === 'Empresa' && (
                    <>
                        <Link to="/empresa/dashboard">Dashboard</Link>
                        <Link to="/empresa/publicar-puesto">Publicar Puesto</Link>
                        <Link to="/empresa/mis-puestos">Mis Puestos</Link>
                        <Link to="/empresa/buscar-candidatos">Candidatos</Link>
                    </>
                )}

                {usuario?.tipoUsuario === 'Oferente' && (
                    <>
                        <Link to="/oferente/dashboard">Dashboard</Link>
                        <Link to="/oferente/habilidades">Habilidades</Link>
                        <Link to="/oferente/cv">Mi CV</Link>
                    </>
                )}

                {usuario?.tipoUsuario === 'Admin' && (
                    <>
                        <Link to="/admin/dashboard">Dashboard</Link>
                        <Link to="/admin/empresas-pendientes">Empresas</Link>
                        <Link to="/admin/oferentes-pendientes">Oferentes</Link>
                        <Link to="/admin/caracteristicas">Características</Link>
                    </>
                )}

                {usuario && (
                    <button onClick={handleLogout} className="btn btn-outline">Salir</button>
                )}
            </div>
        </nav>
    )
}