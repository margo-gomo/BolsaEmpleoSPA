import { useState } from 'react'

function Nodo({ nodo, seleccionadas, onToggle, nivel = 0 }) {
    const [expandido, setExpandido] = useState(nivel === 0)
    const tieneHijos = nodo.hijas && nodo.hijas.length > 0

    return (
        <div style={{ marginLeft: nivel * 16 }}>
            <div className="arbol-nodo">
                {tieneHijos && (
                    <button
                        type="button"
                        className="arbol-toggle"
                        onClick={() => setExpandido(!expandido)}
                    >
                        {expandido ? '▼' : '▶'}
                    </button>
                )}
                {!tieneHijos && (
                    <label className="arbol-hoja">
                        <input
                            type="checkbox"
                            checked={seleccionadas.includes(nodo.id)}
                            onChange={() => onToggle(nodo.id)}
                        />
                        <span>{nodo.nombre}</span>
                    </label>
                )}
                {tieneHijos && <span className="arbol-categoria">{nodo.nombre}</span>}
            </div>
            {tieneHijos && expandido && (
                <div className="arbol-hijos">
                    {nodo.hijas.map(h => (
                        <Nodo
                            key={h.id}
                            nodo={h}
                            seleccionadas={seleccionadas}
                            onToggle={onToggle}
                            nivel={nivel + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default function ArbolCaracteristicas({ categorias, seleccionadas, onToggle }) {
    return (
        <div className="arbol-categorias">
            {categorias.map(cat => (
                <Nodo
                    key={cat.id}
                    nodo={cat}
                    seleccionadas={seleccionadas}
                    onToggle={onToggle}
                    nivel={0}
                />
            ))}
        </div>
    )
}