import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { login as loginApi } from '../../api/api'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function Login() {
    const [correo, setCorreo] = useState('')
    const [clave, setClave] = useState('')
    const [error, setError] = useState(null)
    const [cargando, setCargando] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        setError(null)
        setCargando(true)
        try {
            const datos = await loginApi(correo, clave)
            login(datos.token, { tipoUsuario: datos.rol, id: datos.id, nombre: datos.nombre })

            if (datos.rol === 'Empresa') navigate('/empresa/dashboard')
            else if (datos.rol === 'Oferente') navigate('/oferente/dashboard')
            else if (datos.rol === 'Admin') navigate('/admin/dashboard')
            else navigate('/')
        } catch (err) {
            if (err.status === 403) {
                setError('Tu cuenta está pendiente de aprobación por el administrador.')
            } else {
                setError('Correo o clave incorrectos.')
            }
            setClave('')
        } finally {
            setCargando(false)
        }
    }

    return (
        <>
            <Navbar />
            <main className="main-container">
                <div className="login-card">
                    <h1>Iniciar sesión</h1>

                    {error && <div className="alert error">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Correo electrónico</label>
                            <input
                                type="email"
                                value={correo}
                                onChange={e => setCorreo(e.target.value)}
                                placeholder="correo@ejemplo.com"
                                autoComplete="email"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Clave</label>
                            <input
                                type="password"
                                value={clave}
                                onChange={e => setClave(e.target.value)}
                                placeholder="••••••••"
                                autoComplete="current-password"
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={cargando}>
                            {cargando ? 'Ingresando...' : 'Ingresar'}
                        </button>
                    </form>

                    <div className="login-link">
                        ¿No tenés cuenta?{' '}
                        <Link to="/registro-empresa">Registrá tu empresa</Link>
                        {' '}o{' '}
                        <Link to="/registro-oferente">registrate como oferente</Link>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}