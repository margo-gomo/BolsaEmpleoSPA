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

    const [error, setError] = useState(null)
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
        try {
            const lista = await getCantones(idProvincia)
            setCantones(lista)
        } catch (err) {
            console.error('Error cargando cantones', err)
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setError(null)

        if (form.clave !== form.confirmPassword) {
            setError('Las contraseñas no coinciden.')
            return
        }
        if (!form.idProvinciaCanton) {
            setError('Seleccioná un cantón.')
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
            if (err.status === 409) {
                setError('Ese correo ya está registrado.')
            } else {
                setError('Ocurrió un error al registrar. Intentá de nuevo.')
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
                    <h1>Registro de Oferente</h1>

                    {error && <div className="alert error">{error}</div>}

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
                            <label>Identificación</label>
                            <input
                                type="text"
                                name="identificacion"
                                value={form.identificacion}
                                onChange={handleChange}
                                pattern="[0-9]{9}"
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
                            <select
                                name="idPais"
                                value={form.idPais}
                                onChange={handleChange}
                                required
                            >
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
                                disabled={cantones.length === 0}
                            >
                                <option value="">
                                    {form.provinciaId
                                        ? (cantones.length === 0 ? 'Cargando cantones...' : 'Seleccione un cantón')
                                        : 'Primero seleccioná una provincia'}
                                </option>
                                {cantones.map(c => (
                                    <option key={c.id} value={c.id}>{c.nombre}</option>
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
                                placeholder="Ej: nombre.apellido@correo.com"
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
                                placeholder="Mínimo 6 caracteres"
                                minLength="6"
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
                            {cargando ? 'Registrando...' : 'Registrar Oferente'}
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