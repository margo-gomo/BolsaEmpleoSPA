import { useState } from 'react'

export default function CampoPassword({ name, value, onChange, placeholder = '••••••••', autoComplete }) {
    const [visible, setVisible] = useState(false)

    return (
        <div className="password-wrapper">
            <input
                type={visible ? 'text' : 'password'}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                autoComplete={autoComplete}
                required
            />
            <button
                type="button"
                className="password-toggle"
                onClick={() => setVisible(!visible)}
                tabIndex={-1}
                aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
                {visible ? '‿' : '👁'}
            </button>
        </div>
    )
}