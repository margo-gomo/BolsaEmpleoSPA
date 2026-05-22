import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { login as loginApi } from '../../api/api'
import Navbar from '../../components/Navbar'

export default function Login() {
    const [correo, setCorreo] = useState('')
    const [clave, setClave] = useState('')
    const [error, setError] = useState(null)
    const { login } = useAuth()
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        setError(null)
        try {
            const datos = await loginApi(correo, clave)
            login(datos.token, { tipoUsuario: datos.rol, id: datos.id, nombre: datos.nombre })

            // Redirigir según rol
            if (datos.rol === 'Empresa') navigate('/empresa/dashboard')
            else if (datos.rol === 'Oferente') navigate('/oferente/dashboard')
            else if (datos.rol === 'Admin') navigate('/admin/dashboard')
            else navigate('/')
        } catch (err) {
            setError('Correo o clave incorrectos, o usuario no autorizado.')
        }
    }

    return (
        <>
            <Navbar />
            <main>
                <section className="register-card">
                    <h1>Iniciar sesión</h1>
                    {error && <div className="alert error">{error}</div>}
                    <form className="register-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Correo electrónico</label>
                            <input type="email" value={correo} onChange={e => setCorreo(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>Clave</label>
                            <input type="password" value={clave} onChange={e => setClave(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn btn-primary">Ingresar</button>
                    </form>
                </section>
            </main>
        </>
    )
}