import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [token, setToken] = useState(sessionStorage.getItem('token'))
    const [usuario, setUsuario] = useState(
        JSON.parse(sessionStorage.getItem('usuario') || 'null')
    )

    function login(nuevoToken, datosUsuario) {
        sessionStorage.setItem('token', nuevoToken)
        sessionStorage.setItem('usuario', JSON.stringify(datosUsuario))
        setToken(nuevoToken)
        setUsuario(datosUsuario)
    }

    async function logout() {
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('usuario')
        setToken(null)
        setUsuario(null)
    }

    return (
        <AuthContext.Provider value={{ token, usuario, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}