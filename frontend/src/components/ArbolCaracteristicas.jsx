import { useState } from 'react'

function Nodo({ nodo, seleccionadas, onToggle, nivel = 0 }) {
    const [expandido, setExpandido] = useState(nivel === 0)
    const tieneHijos = nodo.hijas && nodo.hijas.length > 0

    return (
        <div style={{ marginLeft: nivel * 16 }}>
            <div className="tree-option">

                {/* Checkbox para TODOS los nodos, tengan o no hijos */}
                <input
                    type="checkbox"
                    checked={seleccionadas.includes(nodo.id)}
                    onChange={() => onToggle(nodo.id)}
                    id={`nodo-${nodo.id}`}
                />

                {/* Si tiene hijos: botón expandir + label clicable */}
                {tieneHijos ? (
                    <>
                        <label
                            htmlFor={`nodo-${nodo.id}`}
                            style={{ cursor: 'pointer', fontWeight: 600, userSelect: 'none' }}
                        >
                            {nodo.nombre}
                        </label>
                        <button
                            type="button"
                            onClick={() => setExpandido(!expandido)}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '0 4px',
                                fontSize: 13,
                                color: 'var(--primary)',
                                fontWeight: 700,
                                lineHeight: 1,
                            }}
                            title={expandido ? 'Colapsar' : 'Expandir'}
                        >
                            {expandido ? '−' : '+'}
                        </button>
                    </>
                ) : (
                    /* Sin hijos: solo label */
                    <label htmlFor={`nodo-${nodo.id}`} style={{ cursor: 'pointer', userSelect: 'none' }}>
                        {nodo.nombre}
                    </label>
                )}
            </div>

            {/* Hijos — solo si está expandido */}
            {tieneHijos && expandido && (
                <div style={{ marginLeft: 16 }}>
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