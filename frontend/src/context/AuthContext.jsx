import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [usuario, setUsuario] = useState(
        JSON.parse(localStorage.getItem('usuario') || 'null')
    )

    function login(nuevoToken, datosUsuario) {
        localStorage.setItem('token', nuevoToken)
        localStorage.setItem('usuario', JSON.stringify(datosUsuario))
        setToken(nuevoToken)
        setUsuario(datosUsuario)
    }

    function logout() {
        localStorage.removeItem('token')
        localStorage.removeItem('usuario')
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