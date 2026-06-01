import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getMonedas, publicarPuesto } from '../../api/api'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function PublicarPuesto() {
    const { token } = useAuth()
    const navigate  = useNavigate()

    const [monedas, setMonedas]         = useState([])
    const [descripcion, setDescripcion] = useState('')
    const [salario, setSalario]         = useState('')
    const [monedaId, setMonedaId]       = useState('')
    const [tipo, setTipo]               = useState('Pública')
    const [error, setError]             = useState('')

    useEffect(() => {
        getMonedas().then(setMonedas).catch(console.error)
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            const puestoId = await publicarPuesto(
                {
                    descripcion,
                    salario: parseFloat(salario),
                    idMoneda: parseInt(monedaId),
                    tipo
                },
                token
            )
            navigate(`/empresa/requisitos-puesto/${puestoId}`)
        } catch {
            setError('Error al publicar el puesto. Verificá los datos e intentá de nuevo.')
        }
    }

    return (
        <>
            <Navbar />
            <main className="page-container">
                <section className="page-header">
                    <h1>Publicar puesto</h1>
                    <p>Complete la información general del puesto. Luego podrá agregar los requisitos.</p>
                </section>

                {error && <div className="message-box error">{error}</div>}

                <section className="form-section">
                    <form onSubmit={handleSubmit}>

                        <div className="form-group">
                            <label htmlFor="descripcion">Descripción del puesto</label>
                            <input
                                type="text"
                                id="descripcion"
                                className="form-control"
                                placeholder="Ej: Desarrollador Full Stack"
                                value={descripcion}
                                onChange={e => setDescripcion(e.target.value)}
                                required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="salario">Salario ofrecido</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                id="salario"
                                className="form-control"
                                placeholder="Ej: 1500.00"
                                value={salario}
                                onChange={e => setSalario(e.target.value)}
                                required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="monedaId">Moneda</label>
                            <select
                                id="monedaId"
                                className="form-control"
                                value={monedaId}
                                onChange={e => setMonedaId(e.target.value)}
                                required>
                                <option value="">Seleccione una moneda</option>
                                {monedas.map(m => (
                                    <option key={m.id} value={m.id}>
                                        {m.simbolo} {m.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="tipo">Tipo de publicación</label>
                            <select
                                id="tipo"
                                className="form-control"
                                value={tipo}
                                onChange={e => setTipo(e.target.value)}
                                required>
                                <option value="Pública">Pública — visible para todos</option>
                                <option value="Privada">Privada — solo oferentes registrados</option>
                            </select>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary">
                                Guardar y agregar requisitos
                            </button>
                            <button type="button" className="btn btn-light"
                                    onClick={() => navigate('/empresa/mis-puestos')}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                </section>
            </main>
            <Footer />
        </>
    )
}