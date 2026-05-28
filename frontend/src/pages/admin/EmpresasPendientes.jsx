import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getEmpresasPendientes, autorizarEmpresa } from '../../api/api'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function EmpresasPendientes() {
    const { token } = useAuth()
    const [usuarios, setUsuarios] = useState([])
    const [mensaje, setMensaje] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {
        getEmpresasPendientes(token).then(setUsuarios).catch(console.error)
    }, [token])

    const handleAutorizar = async (id) => {
        try {
            await autorizarEmpresa(id, token)
            setUsuarios(prev => prev.filter(u => u.id !== id))
            setMensaje('La empresa fue autorizada correctamente.')
            setTimeout(() => setMensaje(''), 3000)
        } catch {
            setError('Error al autorizar la empresa.')
        }
    }

    return (
        <>
            <Navbar />
        <main className="page-container admin-page-container">
            <section className="admin-header">
                <h1>Empresas pendientes</h1>
            </section>

            {mensaje && <div className="message-box success">{mensaje}</div>}
            {error   && <div className="message-box error">{error}</div>}

            <section className="admin-table-card">
                <table className="table-clean admin-table">
                    <thead>
                    <tr>
                        <th>Usuario</th>
                        <th className="admin-action-col">Acción</th>
                    </tr>
                    </thead>
                    <tbody>
                    {usuarios.length === 0 ? (
                        <tr><td colSpan="2">No hay empresas pendientes.</td></tr>
                    ) : (
                        usuarios.map(u => (
                            <tr key={u.id}>
                                <td>{u.correo}</td>
                                <td className="admin-action-cell">
                                    <button
                                        className="btn btn-success btn-sm"
                                        onClick={() => handleAutorizar(u.id)}>
                                        Aprobar
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </section>
        </main>
            <Footer />
        </>
    )
}
