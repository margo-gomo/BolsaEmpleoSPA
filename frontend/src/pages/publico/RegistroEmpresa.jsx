import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registrarEmpresa, getProvincias, getPrefijosTel } from '../../api/api'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function RegistroEmpresa() {
    const navigate = useNavigate()

    const [form, setForm] = useState({
        nombre: '',
        descripcion: '',
        telefono: '',
        correo: '',
        clave: '',
        confirmPassword: '',
        idProvinciaCanton: '',
        idPrefijoTel: '',
    })

    const [localizaciones, setLocalizaciones] = useState([])
    const [prefijos, setPrefijos] = useState([])

    const [error, setError] = useState(null)
    const [exito, setExito] = useState(false)
    const [cargando, setCargando] = useState(false)

    useEffect(() => {
        getProvincias().then(setLocalizaciones).catch(console.error)
        getPrefijosTel().then(setPrefijos).catch(console.error)
    }, [])

    function handleChange(e) {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setError(null)

        if (form.clave !== form.confirmPassword) {
            setError('Las contraseñas no coinciden.')
            return
        }

        setCargando(true)
        try {
            await registrarEmpresa({
                nombre: form.nombre,
                descripcion: form.descripcion,
                telefono: parseInt(form.telefono),
                correo: form.correo,
                clave: form.clave,
                idProvinciaCanton: parseInt(form.idProvinciaCanton),
                idPrefijoTel: parseInt(form.idPrefijoTel),
            })
            setExito(true)
            setTimeout(() => navigate('/login'), 3000)
        } catch (err) {
            if (err.status === 409) {
                setError('Ese correo ya está registrado.')
            } else {
                setError('Ocurrió un error al registrar la empresa. Intentá de nuevo.')
            }
        } finally {
            setCargando(false)
        }
    }

    if (exito) {
        return (
            <>
                <Navbar />
                <main className="main-container">
                    <div className="register-card">
                        <div className="alert success">
                            Registro exitoso. Esperá la aprobación del administrador.
                            Serás redirigido al login en unos segundos...
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        )
    }

    return (
        <>
            <Navbar />
            <main className="main-container">
                <div className="register-card">
                    <h1>Registro de Empresa</h1>

                    {error && <div className="alert error">{error}</div>}

                    <form onSubmit={handleSubmit}>

                        <div className="form-group">
                            <label>Nombre de la empresa</label>
                            <input
                                type="text"
                                name="nombre"
                                value={form.nombre}
                                onChange={handleChange}
                                placeholder="Ej: SoftLab S.A."
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Localización</label>
                            <select
                                name="idProvinciaCanton"
                                value={form.idProvinciaCanton}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccione la localización</option>
                                {localizaciones.map(loc => (
                                    <option key={loc.id} value={loc.id}>{loc.nombre}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Prefijo telefónico</label>
                            <select
                                name="idPrefijoTel"
                                value={form.idPrefijoTel}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccione el prefijo</option>
                                {prefijos.map(p => (
                                    <option key={p.id} value={p.id}>{p.prefijo}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Teléfono</label>
                            <input
                                type="tel"
                                name="telefono"
                                value={form.telefono}
                                onChange={handleChange}
                                pattern="[0-9]{8}"
                                maxLength="8"
                                placeholder="Ej: 88881234"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Correo electrónico</label>
                            <input
                                type="email"
                                name="correo"
                                value={form.correo}
                                onChange={handleChange}
                                placeholder="Ej: contacto@empresa.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Descripción de la empresa</label>
                            <textarea
                                name="descripcion"
                                value={form.descripcion}
                                onChange={handleChange}
                                rows="4"
                                placeholder="Describí brevemente la empresa"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Contraseña</label>
                            <input
                                type="password"
                                name="clave"
                                value={form.clave}
                                onChange={handleChange}
                                placeholder="Ingresá una contraseña"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Confirmar contraseña</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                placeholder="Repetí la contraseña"
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={cargando}>
                            {cargando ? 'Registrando...' : 'Registrar Empresa'}
                        </button>
                    </form>

                    <p className="login-link">
                        ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
                    </p>
                </div>
            </main>
            <Footer />
        </>
    )
}