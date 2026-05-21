CREATE OR REPLACE VIEW v_publicaciones_publicas AS
SELECT
    p.id AS id,
    e.nombre AS empresa,
    p.descripcion AS descripcion,
    m.simbolo AS moneda,
    p.salario AS salario
FROM puesto p
JOIN empresa e ON p.id_empresa = e.usuario_id
JOIN moneda m ON p.id_moneda = m.id
WHERE p.tipo = 'Pública'
AND p.activo = 'Sí'
ORDER BY p.id DESC
LIMIT 5;
CREATE OR REPLACE VIEW v_puesto_caracteristicas AS
WITH RECURSIVE jerarquia AS (
    SELECT id, nombre, id_carac_padre, nombre AS ruta
    FROM caracteristica
    WHERE id_carac_padre IS NULL

    UNION ALL

    SELECT c.id, c.nombre, c.id_carac_padre,
           CONCAT(j.ruta, ' / ', c.nombre)
    FROM caracteristica c
    JOIN jerarquia j ON c.id_carac_padre = j.id
)
SELECT
    CONCAT(pc.puesto_id, '_', j.id) AS id,
    pc.puesto_id AS puesto_id,
    j.ruta AS caracteristica,
    pc.nivel AS nivel
FROM puesto_carac pc
JOIN jerarquia j ON pc.caracteristica_id = j.id;
CREATE OR REPLACE VIEW v_busqueda_puestos AS
WITH RECURSIVE jerarquia AS (
    SELECT id AS caracteristicaId, id AS ancestroId, id_carac_padre
    FROM caracteristica

    UNION ALL

    SELECT j.caracteristicaId, c.id AS ancestroId, c.id_carac_padre
    FROM jerarquia j
    JOIN caracteristica c ON j.id_carac_padre = c.id
)
SELECT
    CONCAT(p.id, '_', j.ancestroId) AS id,
    p.id AS puesto_id,
    e.nombre AS empresa,
    p.descripcion,
    m.simbolo AS simbolo,
    p.salario,
    p.tipo,
    j.ancestroId as ancestro_id
FROM puesto p
JOIN empresa e ON p.id_empresa = e.usuario_id
JOIN moneda m ON p.id_moneda = m.id
JOIN puesto_carac pc ON p.id = pc.puesto_id
JOIN jerarquia j ON pc.caracteristica_id = j.caracteristicaId
WHERE p.activo = 'Sí';
CREATE OR REPLACE VIEW v_detalle_oferente AS
WITH RECURSIVE localidad AS (
    SELECT id, nombre, id_provincia, nombre AS ruta
    FROM provincia_canton
    WHERE id_provincia IS NULL

    UNION ALL

    SELECT pc.id, pc.nombre, pc.id_provincia,
           CONCAT(l.ruta, ' / ', pc.nombre)
    FROM provincia_canton pc
    JOIN localidad l ON pc.id_provincia = l.id
)
SELECT
    o.usuario_id AS usuario_id,
    o.identificacion,
    o.nombre,
    o.primer_apellido AS primer_apellido,
    u.correo AS correo,
    pt.prefijo AS prefijo,
    o.telefono,
    l.ruta AS localidad,
    o.ruta_cv AS ruta_cv
FROM oferente o
         JOIN usuario u ON o.usuario_id = u.id
         JOIN prefijo_tel pt ON o.prefijo_tel_id = pt.id
         JOIN localidad l ON o.id_provincia_canton = l.id;
CREATE OR REPLACE VIEW v_habilidades_oferente AS
WITH RECURSIVE jerarquia AS (
    SELECT id, nombre, id_carac_padre, nombre AS ruta
    FROM caracteristica
    WHERE id_carac_padre IS NULL

    UNION ALL

    SELECT c.id, c.nombre, c.id_carac_padre,
           CONCAT(j.ruta,' / ',c.nombre)
    FROM caracteristica c
    JOIN jerarquia j ON c.id_carac_padre = j.id
)
SELECT
    CONCAT(oc.oferente_usuario_id, '_', j.id) AS id,
    oc.oferente_usuario_id AS oferente_usuario_id,
    j.ruta AS caracteristica,
    oc.nivel
FROM oferente_carac oc
JOIN jerarquia j ON oc.caracteristica_id = j.id;
CREATE OR REPLACE VIEW v_hijos_caracteristica AS
SELECT
    id,
    nombre,
    id_carac_padre AS padre_id
FROM caracteristica;
CREATE OR REPLACE VIEW v_candidatos_oferentes AS
SELECT
    CONCAT(p.id, '_', o.usuario_id) AS id,
    p.id AS puesto_id,
    o.usuario_id AS oferente_id,
    o.nombre,
    o.primer_apellido AS primer_apellido,
    COUNT(DISTINCT oc.caracteristica_id) AS cumple,
    (SELECT COUNT(*) FROM puesto_carac pc2 WHERE pc2.puesto_id = p.id) AS total,
    ROUND(
        COUNT(DISTINCT oc.caracteristica_id) * 100.0 /
        NULLIF((SELECT COUNT(*) FROM puesto_carac pc3 WHERE pc3.puesto_id = p.id), 0),
        2
    ) AS porcentaje
FROM puesto p
JOIN puesto_carac pc ON p.id = pc.puesto_id
JOIN oferente_carac oc
    ON pc.caracteristica_id = oc.caracteristica_id
   AND oc.nivel >= pc.nivel
JOIN oferente o ON oc.oferente_usuario_id = o.usuario_id
GROUP BY p.id, o.usuario_id, o.nombre, o.primer_apellido
ORDER BY porcentaje DESC;

CREATE OR REPLACE VIEW v_reporte_salarios_altos AS
SELECT
    p.id AS puesto_id,
    m.codigo AS moneda,
    m.simbolo,
    e.nombre AS empresa,
    p.descripcion AS puesto,
    p.salario,
    p.activo,

    CASE m.codigo
        WHEN 'CRC' THEN p.salario
        WHEN 'USD' THEN p.salario * 530
        WHEN 'EUR' THEN p.salario * 580
    END AS salario_convertido

FROM puesto p
JOIN empresa e ON p.id_empresa = e.usuario_id
JOIN moneda m ON p.id_moneda = m.id
ORDER BY salario_convertido DESC;
		
CREATE OR REPLACE VIEW v_puesto_caracteristicas_reporte AS
SELECT
    CONCAT(pc.puesto_id, '_', c.id) AS id,
    pc.puesto_id AS puesto_id,
    c.nombre AS caracteristica,
    pc.nivel
FROM puesto_carac pc
JOIN caracteristica c ON pc.caracteristica_id = c.id;

CREATE OR REPLACE VIEW v_reporte_puestos_solicitados_mes AS
SELECT
    CONCAT(agr.puesto_id, '_', agr.mes) AS id,
    agr.puesto_id,
    agr.empresa,
    agr.descripcion,
    agr.simbolo,
    agr.salario,
    agr.mes,
    agr.anio,
    agr.cantidad_solicitudes
FROM (
    SELECT
        p.id AS puesto_id,
        e.nombre AS empresa,
        p.descripcion AS descripcion,
        m.simbolo AS simbolo,
        p.salario AS salario,
        MONTH(op.fecha_solicitud) AS mes,
        YEAR(op.fecha_solicitud) AS anio,
        COUNT(*) AS cantidad_solicitudes
    FROM oferente_puesto op
    JOIN puesto p ON op.puesto_id = p.id
    JOIN empresa e ON p.id_empresa = e.usuario_id
    JOIN moneda m ON p.id_moneda = m.id
    WHERE YEAR(op.fecha_solicitud) = YEAR(CURDATE())
    GROUP BY
        p.id,
        e.nombre,
        p.descripcion,
        m.simbolo,
        p.salario,
        MONTH(op.fecha_solicitud),
        YEAR(op.fecha_solicitud)
) agr
ORDER BY agr.mes ASC;

CREATE OR REPLACE VIEW v_detalle_puesto AS
WITH RECURSIVE localidad AS (
    SELECT
        id,
        nombre,
        id_provincia,
        nombre AS ruta
    FROM provincia_canton
    WHERE id_provincia IS NULL

    UNION ALL

    SELECT
        pc.id,
        pc.nombre,
        pc.id_provincia,
        CONCAT(l.ruta, ' / ', pc.nombre)
    FROM provincia_canton pc
    JOIN localidad l
        ON pc.id_provincia = l.id
)

SELECT
    p.id AS id,                         
    e.nombre AS empresa,
    e.usuario_id AS empresa_id,
    CONCAT(pt.prefijo, ' ', e.telefono) AS telefono_empresa,
    l.ruta AS localidad,
    p.descripcion,
    m.simbolo AS simbolo,
    m.codigo AS moneda,
    p.salario,
    p.tipo

FROM puesto p

JOIN empresa e
    ON p.id_empresa = e.usuario_id

JOIN prefijo_tel pt
    ON e.id_prefijo_tel = pt.id

JOIN localidad l
    ON e.id_provincia_canton = l.id

JOIN moneda m
    ON p.id_moneda = m.id;
