import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getMonedas, publicarPuesto } from '../../api/api'

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
            const res = await publicarPuesto(
                { descripcion, salario: parseFloat(salario), monedaId: parseInt(monedaId), tipo },
                token
            )
            navigate(`/empresa/requisitos-puesto/${res.id ?? res.puestoId}`)
        } catch {
            setError('Error al publicar el puesto.')
        }
    }

    return (
        <main className="page-container">
            <section className="page-header">
                <h1>Publicar puesto</h1>
                <p>Complete la información general del puesto.</p>
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
                            value={descripcion}
                            onChange={e => setDescripcion(e.target.value)}
                            required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="salario">Salario</label>
                        <input
                            type="number"
                            step="0.01"
                            id="salario"
                            className="form-control"
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
                                <option key={m.id} value={m.id}>{m.nombre}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="tipo">Tipo</label>
                        <select
                            id="tipo"
                            className="form-control"
                            value={tipo}
                            onChange={e => setTipo(e.target.value)}
                            required>
                            <option value="Pública">Pública</option>
                            <option value="Privada">Privada</option>
                        </select>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary">
                            Guardar y continuar
                        </button>
                        <button type="button" className="btn btn-light"
                                onClick={() => navigate('/empresa/mis-puestos')}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </section>
        </main>
    )
}