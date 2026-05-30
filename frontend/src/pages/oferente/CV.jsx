import { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { getDashboardOferente, subirCV } from '../../api/api'
import { useAuth } from '../../context/AuthContext'

export default function CV() {
    const { token } = useAuth()
    const [perfil, setPerfil] = useState(null)
    const [archivo, setArchivo] = useState(null)
    const [mensaje, setMensaje] = useState(null) // { tipo, texto }
    const [cargando, setCargando] = useState(false)

    useEffect(() => {
        getDashboardOferente(token)
            .then(d => setPerfil(d))
            .catch(() => {})
    }, [token])

    function handleArchivo(e) {
        const file = e.target.files[0]
        if (!file) return
        if (file.type !== 'application/pdf') {
            setMensaje({ tipo: 'error', texto: 'Solo se permiten archivos PDF.' })
            setArchivo(null)
            e.target.value = ''
            return
        }
        setArchivo(file)
        setMensaje(null)
    }

    async function handleSubir(e) {
        e.preventDefault()
        if (!archivo) return
        setCargando(true)
        setMensaje(null)
        try {
            await subirCV(archivo, token)
            setMensaje({ tipo: 'success', texto: 'CV subido correctamente.' })
            setArchivo(null)
            // Refrescar perfil para actualizar el estado del CV
            getDashboardOferente(token).then(d => setPerfil(d)).catch(() => {})
        } catch {
            setMensaje({ tipo: 'error', texto: 'Error al subir el CV. Intentá de nuevo.' })
        } finally {
            setCargando(false)
        }
    }

    return (
        <>
            <Navbar />
            <div className="page-container">
                <div className="page-header">
                    <h1>Mi Currículum</h1>
                    <p>Subí tu CV en formato PDF para que las empresas puedan verlo.</p>
                </div>

                <div className="cv-layout">
                    {/* Estado actual */}
                    <div className="cv-panel">
                        <h3>Estado actual</h3>
                        <div className="cv-status-box">
                            {perfil === null && (
                                <p style={{ color: 'var(--text-soft)' }}>Cargando...</p>
                            )}
                            {perfil !== null && !perfil.rutaCv && (
                                <p style={{ color: 'var(--text-soft)' }}>
                                    No tenés ningún CV cargado todavía.
                                </p>
                            )}
                            {perfil !== null && perfil.rutaCv && (
                                <>
                                    <p>
                                        <strong>Archivo:</strong>{' '}
                                        <span style={{ color: 'var(--primary)', fontWeight: 600 }}>
                                            {perfil.rutaCv}
                                        </span>
                                    </p>
                                    <p style={{ marginTop: 8, color: 'var(--text-soft)', fontSize: 14 }}>
                                        Podés reemplazarlo subiendo un nuevo archivo.
                                    </p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Formulario de subida */}
                    <div className="cv-panel">
                        <h3>{perfil?.rutaCv ? 'Reemplazar CV' : 'Subir CV'}</h3>

                        {mensaje && (
                            <div className={`alert ${mensaje.tipo}`}>{mensaje.texto}</div>
                        )}

                        <form className="cv-form" onSubmit={handleSubir}>
                            <div className="form-group">
                                <label>Archivo PDF</label>
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={handleArchivo}
                                />
                            </div>

                            {archivo && (
                                <p className="cv-note">
                                    Archivo seleccionado: <strong>{archivo.name}</strong>{' '}
                                    ({(archivo.size / 1024).toFixed(0)} KB)
                                </p>
                            )}

                            <div className="actions-section" style={{ marginTop: 16 }}>
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-action"
                                    disabled={!archivo || cargando}
                                >
                                    {cargando ? 'Subiendo...' : 'Subir CV'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}