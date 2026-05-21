ALTER TABLE usuario
    MODIFY COLUMN autorizado VARCHAR(2) NOT NULL DEFAULT 'No';
ALTER TABLE oferente_puesto
MODIFY fecha_solicitud DATE DEFAULT (CURRENT_DATE);
ALTER TABLE puesto
ADD CONSTRAINT ck_puesto_activo
CHECK (activo IN ('Sí','No'));
ALTER TABLE puesto
MODIFY activo varchar(5) default ('Sí');
INSERT INTO moneda (id, codigo, nombre, simbolo) VALUES
(1,'CRC','Colón','₡'),
(2,'USD','Dólar','$'),
(3,'EUR','Euro','€');
commit;
-- Insertar usuario admin
INSERT INTO usuario (correo, clave, tipo_usuario, autorizado)
VALUES ('admin@bolsaempleo.com', '$2a$10$ISb8nr6gpjzV65h6aVTe/OPhzgAJmjQKVBIhticDPABaETrtwF6mi', 'Admin','Sí');

COMMIT;
INSERT INTO pais (id, nombre) VALUES
(1,'Costa Rica'),
(2,'Nicaragua'),
(3,'Estados Unidos');
commit;
INSERT INTO prefijo_tel (id, prefijo, id_pais) VALUES
(1,'+506',1),
(2,'+505',2),
(3,'+1',3);
commit;
INSERT INTO provincia_canton (id, nombre, id_provincia) VALUES
(1,'San José',NULL),
(2,'Alajuela',NULL),
(3,'Cartago',NULL),
(4,'Heredia',NULL),
(5,'Guanacaste',NULL),
(6,'Puntarenas',NULL),
(7,'Limón',NULL),
(101,'San José',1),
(102,'Desamparados',1),
(103,'Goicoechea',1),
(201,'Alajuela',2),
(202,'San Carlos',2),
(203,'San Ramón',2),
(301,'Cartago',3),
(302,'La Unión',3),
(303,'Paraíso',3),
(401,'Heredia',4),
(402,'San Pablo',4),
(403,'Santo Domingo',4),
(501,'Liberia',5),
(502,'Santa Cruz',5),
(503,'Nicoya',5),
(601,'Puntarenas',6),
(602,'Buenos Aires',6),
(603,'Quepos',6),
(701,'Limón',7),
(702,'Pococí',7),
(703,'Siquirres',7);
commit;
ALTER TABLE usuario
ADD CONSTRAINT ck_tipo_usuario
CHECK (tipo_usuario IN ('Admin','Empresa','Oferente'));
ALTER TABLE puesto
ADD CONSTRAINT ck_tipo_puesto
CHECK (tipo IN ('Pública','Privada'));
