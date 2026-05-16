import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

// Páginas públicas
import Inicio from './pages/publico/Inicio'
import BuscarPuestos from './pages/publico/BuscarPuestos'
import RegistroEmpresa from './pages/publico/RegistroEmpresa'
import RegistroOferente from './pages/publico/RegistroOferente'
import Login from './pages/publico/Login'

// Páginas empresa
import EmpresaDashboard from './pages/empresa/Dashboard'
import PublicarPuesto from './pages/empresa/PublicarPuesto'
import RequisitosPuesto from './pages/empresa/RequisitosPuesto'
import MisPuestos from './pages/empresa/MisPuestos'
import BuscarCandidatos from './pages/empresa/BuscarCandidatos'
import DetalleCandidato from './pages/empresa/DetalleCandidato'

// Páginas oferente
import OferenteDashboard from './pages/oferente/Dashboard'
import Habilidades from './pages/oferente/Habilidades'
import CV from './pages/oferente/CV'

// Páginas admin
import AdminDashboard from './pages/admin/Dashboard'
import EmpresasPendientes from './pages/admin/EmpresasPendientes'
import OferentesPendientes from './pages/admin/OferentesPendientes'
import Caracteristicas from './pages/admin/Caracteristicas'
import Reportes from './pages/admin/Reportes'

// Ruta protegida: redirige al login si no hay token o el rol no coincide
function RutaProtegida({ children, rol }) {
    const { token, usuario } = useAuth()
    if (!token) return <Navigate to="/login" />
    if (rol && usuario?.tipoUsuario !== rol) return <Navigate to="/" />
    return children
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Públicas */}
                    <Route path="/" element={<Inicio />} />
                    <Route path="/buscar-puestos" element={<BuscarPuestos />} />
                    <Route path="/registro-empresa" element={<RegistroEmpresa />} />
                    <Route path="/registro-oferente" element={<RegistroOferente />} />
                    <Route path="/login" element={<Login />} />

                    {/* Empresa */}
                    <Route path="/empresa/dashboard" element={<RutaProtegida rol="Empresa"><EmpresaDashboard /></RutaProtegida>} />
                    <Route path="/empresa/publicar-puesto" element={<RutaProtegida rol="Empresa"><PublicarPuesto /></RutaProtegida>} />
                    <Route path="/empresa/requisitos-puesto/:id" element={<RutaProtegida rol="Empresa"><RequisitosPuesto /></RutaProtegida>} />
                    <Route path="/empresa/mis-puestos" element={<RutaProtegida rol="Empresa"><MisPuestos /></RutaProtegida>} />
                    <Route path="/empresa/buscar-candidatos" element={<RutaProtegida rol="Empresa"><BuscarCandidatos /></RutaProtegida>} />
                    <Route path="/empresa/detalle-candidato/:id" element={<RutaProtegida rol="Empresa"><DetalleCandidato /></RutaProtegida>} />

                    {/* Oferente */}
                    <Route path="/oferente/dashboard" element={<RutaProtegida rol="Oferente"><OferenteDashboard /></RutaProtegida>} />
                    <Route path="/oferente/habilidades" element={<RutaProtegida rol="Oferente"><Habilidades /></RutaProtegida>} />
                    <Route path="/oferente/cv" element={<RutaProtegida rol="Oferente"><CV /></RutaProtegida>} />

                    {/* Admin */}
                    <Route path="/admin/dashboard" element={<RutaProtegida rol="Admin"><AdminDashboard /></RutaProtegida>} />
                    <Route path="/admin/empresas-pendientes" element={<RutaProtegida rol="Admin"><EmpresasPendientes /></RutaProtegida>} />
                    <Route path="/admin/oferentes-pendientes" element={<RutaProtegida rol="Admin"><OferentesPendientes /></RutaProtegida>} />
                    <Route path="/admin/caracteristicas" element={<RutaProtegida rol="Admin"><Caracteristicas /></RutaProtegida>} />
                    <Route path="/admin/reportes" element={<RutaProtegida rol="Admin"><Reportes /></RutaProtegida>} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}