import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { descargarReporteMeses, descargarReporteSalarios } from '../../api/api'
import Navbar from "../../components/Navbar.jsx";
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
const MESES = [
    'Enero','Febrero','Marzo','Abril','Mayo','Junio',
    'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
]

export default function Reportes() {
    const { token } = useAuth()

    const [vista, setVista] = useState('menu') // 'menu' | 'mes' | 'salarios'
    const [mesesSel, setMesesSel] = useState([])
    const [todosMeses, setTodosMeses] = useState(false)
    const [cargando, setCargando] = useState(false)
    const [error, setError] = useState('')

    const toggleMes = (num) => {
        setMesesSel(prev =>
            prev.includes(num) ? prev.filter(m => m !== num) : [...prev, num]
        )
    }

    const handleReporteMes = async (e) => {
        e.preventDefault()
        setError('')
        if (!todosMeses && mesesSel.length === 0) {
            setError('Seleccione al menos un mes.')
            return
        }
        setCargando(true)
        try {
            await descargarReporteMeses(mesesSel, todosMeses, token)
        } catch {
            setError('Error al generar el reporte.')
        } finally {
            setCargando(false)
        }
    }

    const handleReporteSalarios = async () => {
        setError('')
        setCargando(true)
        try {
            await descargarReporteSalarios(token)
        } catch {
            setError('Error al generar el reporte.')
        } finally {
            setCargando(false)
        }
    }

    if (vista === 'menu') {
        return (
            <>
            <Navbar />
            <main className="page-container admin-page-container">
                <section className="admin-header">
                    <h1>Reportes</h1>
                    <p>Consulta y generación de reportes Bolsa de Empleo</p>
                </section>

                <section className="admin-dashboard-actions">
                    <div
                        className="admin-table-card admin-reporte-card"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setVista('mes')}>
                        <h3>Reporte de puestos solicitados por mes</h3>
                        <p>Consulte cuántas solicitudes recibió cada puesto durante el mes o meses seleccionados.</p>
                    </div>

                    <div
                        className="admin-table-card admin-reporte-card"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setVista('salarios')}>
                        <h3>Reporte de puestos con salarios más altos</h3>
                        <p>Ranking de puestos activos ordenados por salario equivalente en colones.</p>
                    </div>
                </section>
            </main>
                <Footer />
            </>
        )
    }

    if (vista === 'mes') {
        return (
            <main className="page-container admin-page-container">
                <section className="admin-header">
                    <h1>Reporte de puestos solicitados por mes</h1>
                </section>

                {error && <div className="message-box error">{error}</div>}

                <section className="admin-caracteristicas-layout">
                    <article className="admin-caracteristicas-panel admin-caracteristicas-form-panel">
                        <h3>Filtrar por mes</h3>

                        <form onSubmit={handleReporteMes} className="admin-caracteristicas-form">
                            <div className="form-group">
                                <label>Meses seleccionados</label>
                                <select
                                    multiple
                                    size="12"
                                    value={mesesSel.map(String)}
                                    onChange={e => {
                                        const sel = Array.from(e.target.selectedOptions, o => parseInt(o.value))
                                        setMesesSel(sel)
                                    }}
                                    disabled={todosMeses}>
                                    {MESES.map((nombre, i) => (
                                        <option key={i+1} value={i+1}>{nombre}</option>
                                    ))}
                                </select>
                                <small>Mantenga Ctrl para seleccionar varios meses.</small>
                            </div>

                            <div className="form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={todosMeses}
                                        onChange={e => {
                                            setTodosMeses(e.target.checked)
                                            if (e.target.checked) setMesesSel([])
                                        }} />
                                    {' '}Todos los meses
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-action"
                                disabled={cargando}>
                                {cargando ? 'Generando...' : 'Generar PDF'}
                            </button>
                        </form>
                    </article>
                </section>

                <div className="back-section">
                    <button className="btn btn-secondary btn-action" onClick={() => setVista('menu')}>
                        Volver
                    </button>
                </div>
            </main>
        )
    }

    return (
        <main className="page-container admin-page-container">
            <section className="admin-header">
                <h1>Reporte de puestos con salarios más altos</h1>
            </section>

            {error && <div className="message-box error">{error}</div>}

            <section className="admin-reportes-layout">
                <article className="admin-reportes-panel admin-reportes-filter">
                    <h3>Tipos de cambio aplicados</h3>

                    <table className="table-clean" style={{ marginTop: '0.5rem' }}>
                        <thead>
                        <tr><th>Moneda</th><th>Equivalencia en ₡</th></tr>
                        </thead>
                        <tbody>
                        <tr><td>₡ Colón (CRC)</td><td>₡ 1.00</td></tr>
                        <tr><td>$ Dólar (USD)</td><td>₡ 530.00</td></tr>
                        <tr><td>€ Euro (EUR)</td><td>₡ 580.00</td></tr>
                        </tbody>
                    </table>

                    <p style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
                        Los salarios en moneda extranjera se convierten a colones para permitir la comparación entre puestos.
                    </p>

                    <div className="admin-reportes-actions" style={{ marginTop: '1.5rem' }}>
                        <button
                            className="btn btn-outline btn-action"
                            disabled={cargando}
                            onClick={handleReporteSalarios}>
                            {cargando ? 'Generando...' : 'Generar PDF'}
                        </button>
                    </div>
                </article>
            </section>

            <div className="back-section">
                <button className="btn btn-secondary btn-action" onClick={() => setVista('menu')}>
                    Volver
                </button>
            </div>
        </main>
    )
}