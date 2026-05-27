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

    const [errores, setErrores] = useState([])
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

    function validar() {
        const msgs = []
        if (form.clave !== form.confirmPassword)
            msgs.push('Las contraseñas no coinciden.')
        if (form.clave.length < 6)
            msgs.push('La contraseña debe tener al menos 6 caracteres.')
        if (form.telefono.length !== 8 || isNaN(form.telefono))
            msgs.push('El teléfono debe tener exactamente 8 dígitos.')
        return msgs
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setErrores([])

        const msgsLocales = validar()
        if (msgsLocales.length > 0) {
            setErrores(msgsLocales)
            window.scrollTo({ top: 0, behavior: 'smooth' })
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
                setErrores(['Ese correo ya está registrado. Intentá con otro.'])
            } else if (err.body?.errores) {
                setErrores(err.body.errores)
            } else if (err.body?.mensaje) {
                setErrores([err.body.mensaje])
            } else {
                setErrores(['Ocurrió un error al registrar la empresa. Revisá los datos e intentá de nuevo.'])
            }
            window.scrollTo({ top: 0, behavior: 'smooth' })
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
                            <strong>¡Registro exitoso!</strong><br />
                            Tu cuenta está pendiente de aprobación por el administrador.
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

                    {errores.length > 0 && (
                        <div className="alert error">
                            {errores.length === 1
                                ? errores[0]
                                : <ul style={{ margin: 0, paddingLeft: 18 }}>
                                    {errores.map((e, i) => <li key={i}>{e}</li>)}
                                </ul>
                            }
                        </div>
                    )}

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
                            <label>Teléfono (8 dígitos)</label>
                            <input
                                type="text"
                                name="telefono"
                                value={form.telefono}
                                onChange={handleChange}
                                inputMode="numeric"
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
                            />
                        </div>

                        <div className="form-group">
                            <label>Contraseña (mínimo 6 caracteres)</label>
                            <input
                                type="password"
                                name="clave"
                                value={form.clave}
                                onChange={handleChange}
                                placeholder="••••••••"
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
                                placeholder="••••••••"
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