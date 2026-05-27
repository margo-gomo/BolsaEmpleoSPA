import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    registrarOferente,
    getPaises,
    getProvincias,
    getCantones,
    getPrefijosTel
} from '../../api/api'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function RegistroOferente() {
    const navigate = useNavigate()

    const [form, setForm] = useState({
        nombre: '',
        identificacion: '',
        primerApellido: '',
        telefono: '',
        correo: '',
        clave: '',
        confirmPassword: '',
        idPais: '',
        idProvinciaCanton: '',
        idPrefijoTel: '',
        provinciaId: '',
    })

    const [paises, setPaises] = useState([])
    const [provincias, setProvincias] = useState([])
    const [cantones, setCantones] = useState([])
    const [prefijos, setPrefijos] = useState([])
    const [cargandoCantones, setCargandoCantones] = useState(false)

    const [errores, setErrores] = useState([]) // lista de errores del backend
    const [exito, setExito] = useState(false)
    const [cargando, setCargando] = useState(false)

    useEffect(() => {
        getPaises().then(setPaises).catch(console.error)
        getProvincias().then(setProvincias).catch(console.error)
        getPrefijosTel().then(setPrefijos).catch(console.error)
    }, [])

    function handleChange(e) {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    async function handleProvinciaChange(e) {
        const idProvincia = e.target.value
        setForm(prev => ({ ...prev, provinciaId: idProvincia, idProvinciaCanton: '' }))
        setCantones([])
        if (!idProvincia) return
        setCargandoCantones(true)
        try {
            const lista = await getCantones(idProvincia)
            setCantones(lista)
        } catch (err) {
            setErrores(['No se pudieron cargar los cantones. Intentá de nuevo.'])
        } finally {
            setCargandoCantones(false)
        }
    }

    // Validaciones del lado del cliente antes de enviar
    function validar() {
        const msgs = []
        if (form.clave.length < 6)
            msgs.push('La clave debe tener al menos 6 caracteres.')
        if (form.clave !== form.confirmPassword)
            msgs.push('Las contraseñas no coinciden.')
        if (!form.idProvinciaCanton)
            msgs.push('Seleccioná un cantón.')
        if (form.telefono.length !== 8 || isNaN(form.telefono))
            msgs.push('El teléfono debe tener exactamente 8 dígitos.')
        if (form.identificacion.length !== 9 || isNaN(form.identificacion))
            msgs.push('La identificación debe tener exactamente 9 dígitos.')
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
            await registrarOferente({
                nombre: form.nombre,
                identificacion: form.identificacion,
                primerApellido: form.primerApellido,
                telefono: parseInt(form.telefono),
                correo: form.correo,
                clave: form.clave,
                idPais: parseInt(form.idPais),
                idPrefijoTel: parseInt(form.idPrefijoTel),
                idProvinciaCanton: parseInt(form.idProvinciaCanton),
            })
            setExito(true)
            setTimeout(() => navigate('/login'), 3000)
        } catch (err) {
            // El backend puede devolver:
            // 409 → { mensaje: "El correo ya está registrado" }
            // 400 → { errores: ["campo: mensaje", ...] }
            // 500 → { mensaje: "Error interno..." }
            if (err.status === 409) {
                setErrores(['Ese correo ya está registrado. Intentá con otro.'])
            } else if (err.body?.errores) {
                // Errores de validación del backend — los mostramos tal cual
                setErrores(err.body.errores)
            } else if (err.body?.mensaje) {
                setErrores([err.body.mensaje])
            } else {
                setErrores(['Ocurrió un error al registrar. Revisá los datos e intentá de nuevo.'])
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
                    <h1>Registro de Oferente</h1>

                    {/* Errores — puede haber varios */}
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
                            <label>Nombre</label>
                            <input
                                type="text"
                                name="nombre"
                                value={form.nombre}
                                onChange={handleChange}
                                placeholder="Ej: Carlos"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Identificación (9 dígitos)</label>
                            <input
                                type="text"
                                name="identificacion"
                                value={form.identificacion}
                                onChange={handleChange}
                                inputMode="numeric"
                                maxLength="9"
                                placeholder="Ej: 123456789"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Primer apellido</label>
                            <input
                                type="text"
                                name="primerApellido"
                                value={form.primerApellido}
                                onChange={handleChange}
                                placeholder="Ej: Rodríguez"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Nacionalidad</label>
                            <select name="idPais" value={form.idPais} onChange={handleChange} required>
                                <option value="">Seleccione su país</option>
                                {paises.map(p => (
                                    <option key={p.id} value={p.id}>{p.nombre}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Provincia</label>
                            <select
                                name="provinciaId"
                                value={form.provinciaId}
                                onChange={handleProvinciaChange}
                                required
                            >
                                <option value="">Seleccione una provincia</option>
                                {provincias.map(p => (
                                    <option key={p.id} value={p.id}>{p.nombre}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Cantón</label>
                            <select
                                name="idProvinciaCanton"
                                value={form.idProvinciaCanton}
                                onChange={handleChange}
                                required
                                disabled={!form.provinciaId || cargandoCantones}
                            >
                                <option value="">
                                    {!form.provinciaId
                                        ? 'Primero seleccioná una provincia'
                                        : cargandoCantones
                                            ? 'Cargando cantones...'
                                            : 'Seleccione un cantón'}
                                </option>
                                {cantones.map(c => (
                                    <option key={c.id} value={c.id}>{c.nombre}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Prefijo telefónico</label>
                            <select name="idPrefijoTel" value={form.idPrefijoTel} onChange={handleChange} required>
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
                                placeholder="Ej: nombre@correo.com"
                                required
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
                            {cargando ? 'Registrando...' : 'Registrar'}
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