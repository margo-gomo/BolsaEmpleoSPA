-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema bolsa_empleo
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema bolsa_empleo
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `bolsa_empleo` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `bolsa_empleo` ;

-- -----------------------------------------------------
-- Table `bolsa_empleo`.`caracteristica`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bolsa_empleo`.`caracteristica` (
                                                               `id` INT NOT NULL AUTO_INCREMENT,
                                                               `nombre` VARCHAR(45) NOT NULL,
    `id_carac_padre` INT NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `nombre_UNIQUE` (`nombre` ASC) VISIBLE,
    INDEX `fk_caracteristica_caracteristica1_idx` (`id_carac_padre` ASC) VISIBLE,
    CONSTRAINT `fk_caracteristica_caracteristica1`
    FOREIGN KEY (`id_carac_padre`)
    REFERENCES `bolsa_empleo`.`caracteristica` (`id`))
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `bolsa_empleo`.`pais`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bolsa_empleo`.`pais` (
                                                     `id` INT NOT NULL,
                                                     `nombre` VARCHAR(45) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `nombre_UNIQUE` (`nombre` ASC) VISIBLE)
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `bolsa_empleo`.`prefijo_tel`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bolsa_empleo`.`prefijo_tel` (
                                                            `id` INT NOT NULL,
                                                            `prefijo` VARCHAR(10) NOT NULL,
    `id_pais` INT NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `fk_prefijo_tel_pais1_idx` (`id_pais` ASC) VISIBLE,
    CONSTRAINT `fk_prefijo_tel_pais1`
    FOREIGN KEY (`id_pais`)
    REFERENCES `bolsa_empleo`.`pais` (`id`))
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `bolsa_empleo`.`provincia_canton`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bolsa_empleo`.`provincia_canton` (
                                                                 `id` INT NOT NULL,
                                                                 `nombre` VARCHAR(45) NOT NULL,
    `id_provincia` INT NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    INDEX `fk_provincia_canton_provincia_canton1_idx` (`id_provincia` ASC) VISIBLE,
    CONSTRAINT `fk_provincia_canton_provincia_canton1`
    FOREIGN KEY (`id_provincia`)
    REFERENCES `bolsa_empleo`.`provincia_canton` (`id`))
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `bolsa_empleo`.`usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bolsa_empleo`.`usuario` (
                                                        `id` INT NOT NULL AUTO_INCREMENT,
                                                        `correo` VARCHAR(45) NOT NULL,
    `clave` VARCHAR(255) NULL DEFAULT NULL,
    `tipo_usuario` VARCHAR(10) NOT NULL,
    `Autorizado` VARCHAR(2) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `correo_UNIQUE` (`correo` ASC) VISIBLE)
    ENGINE = InnoDB
    AUTO_INCREMENT = 2
    DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `bolsa_empleo`.`empresa`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bolsa_empleo`.`empresa` (
                                                        `usuario_id` INT NOT NULL,
                                                        `nombre` VARCHAR(45) NOT NULL,
    `id_provincia_canton` INT NOT NULL,
    `telefono` INT NOT NULL,
    `id_prefijo_tel` INT NOT NULL,
    `descripcion` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`usuario_id`),
    INDEX `fk_empresa_prefijo_tel1_idx` (`id_prefijo_tel` ASC) VISIBLE,
    INDEX `fk_empresa_provincia_canton1_idx` (`id_provincia_canton` ASC) VISIBLE,
    CONSTRAINT `fk_empresa_prefijo_tel1`
    FOREIGN KEY (`id_prefijo_tel`)
    REFERENCES `bolsa_empleo`.`prefijo_tel` (`id`),
    CONSTRAINT `fk_empresa_provincia_canton1`
    FOREIGN KEY (`id_provincia_canton`)
    REFERENCES `bolsa_empleo`.`provincia_canton` (`id`),
    CONSTRAINT `fk_empresa_usuario1`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `bolsa_empleo`.`usuario` (`id`))
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `bolsa_empleo`.`moneda`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bolsa_empleo`.`moneda` (
                                                       `id` INT NOT NULL,
                                                       `codigo` VARCHAR(5) NOT NULL,
    `nombre` VARCHAR(10) NOT NULL,
    `simbolo` VARCHAR(1) NOT NULL,
    PRIMARY KEY (`id`))
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `bolsa_empleo`.`oferente`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bolsa_empleo`.`oferente` (
                                                         `usuario_id` INT NOT NULL,
                                                         `identificacion` VARCHAR(45) NOT NULL,
    `nombre` VARCHAR(45) NOT NULL,
    `primer_apellido` VARCHAR(45) NOT NULL,
    `id_pais` INT NOT NULL,
    `prefijo_tel_id` INT NOT NULL,
    `telefono` INT NOT NULL,
    `id_provincia_canton` INT NOT NULL,
    `ruta_cv` VARCHAR(45) NULL DEFAULT NULL,
    PRIMARY KEY (`usuario_id`),
    UNIQUE INDEX `identificacion_UNIQUE` (`identificacion` ASC) VISIBLE,
    INDEX `fk_oferente_pais1_idx` (`id_pais` ASC) VISIBLE,
    INDEX `fk_oferente_prefijo_tel1_idx` (`prefijo_tel_id` ASC) VISIBLE,
    INDEX `fk_oferente_provincia_canton1_idx` (`id_provincia_canton` ASC) VISIBLE,
    CONSTRAINT `fk_oferente_pais1`
    FOREIGN KEY (`id_pais`)
    REFERENCES `bolsa_empleo`.`pais` (`id`),
    CONSTRAINT `fk_oferente_prefijo_tel1`
    FOREIGN KEY (`prefijo_tel_id`)
    REFERENCES `bolsa_empleo`.`prefijo_tel` (`id`),
    CONSTRAINT `fk_oferente_provincia_canton1`
    FOREIGN KEY (`id_provincia_canton`)
    REFERENCES `bolsa_empleo`.`provincia_canton` (`id`),
    CONSTRAINT `fk_oferente_usuario1`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `bolsa_empleo`.`usuario` (`id`))
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `bolsa_empleo`.`oferente_carac`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bolsa_empleo`.`oferente_carac` (
                                                               `oferente_usuario_id` INT NOT NULL,
                                                               `caracteristica_id` INT NOT NULL,
                                                               `nivel` INT NOT NULL,
                                                               PRIMARY KEY (`oferente_usuario_id`, `caracteristica_id`),
    INDEX `fk_oferente_carac_caracteristica1_idx` (`caracteristica_id` ASC) VISIBLE,
    CONSTRAINT `fk_oferente_carac_caracteristica1`
    FOREIGN KEY (`caracteristica_id`)
    REFERENCES `bolsa_empleo`.`caracteristica` (`id`),
    CONSTRAINT `fk_oferente_carac_oferente1`
    FOREIGN KEY (`oferente_usuario_id`)
    REFERENCES `bolsa_empleo`.`oferente` (`usuario_id`))
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `bolsa_empleo`.`puesto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bolsa_empleo`.`puesto` (
                                                       `id` INT NOT NULL AUTO_INCREMENT,
                                                       `id_empresa` INT NOT NULL,
                                                       `descripcion` VARCHAR(50) NOT NULL,
    `id_moneda` INT NOT NULL,
    `salario` DECIMAL(10,2) NOT NULL,
    `tipo` VARCHAR(10) NOT NULL,
    `activo` VARCHAR(2) NOT NULL DEFAULT 'Sí',
    PRIMARY KEY (`id`),
    INDEX `fk_puesto_empresa1_idx` (`id_empresa` ASC) VISIBLE,
    INDEX `fk_puesto_moneda1_idx` (`id_moneda` ASC) VISIBLE,
    CONSTRAINT `fk_puesto_empresa1`
    FOREIGN KEY (`id_empresa`)
    REFERENCES `bolsa_empleo`.`empresa` (`usuario_id`),
    CONSTRAINT `fk_puesto_moneda1`
    FOREIGN KEY (`id_moneda`)
    REFERENCES `bolsa_empleo`.`moneda` (`id`))
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `bolsa_empleo`.`oferente_puesto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bolsa_empleo`.`oferente_puesto` (
                                                                `oferente_usuario_id` INT NOT NULL,
                                                                `puesto_id` INT NOT NULL,
                                                                `fecha_solicitud` DATE NOT NULL,
                                                                PRIMARY KEY (`oferente_usuario_id`, `puesto_id`),
    INDEX `fk_oferente_puesto_puesto1_idx` (`puesto_id` ASC) VISIBLE,
    CONSTRAINT `fk_oferente_puesto_oferente1`
    FOREIGN KEY (`oferente_usuario_id`)
    REFERENCES `bolsa_empleo`.`oferente` (`usuario_id`),
    CONSTRAINT `fk_oferente_puesto_puesto1`
    FOREIGN KEY (`puesto_id`)
    REFERENCES `bolsa_empleo`.`puesto` (`id`))
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = utf8mb4
    COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `bolsa_empleo`.`puesto_carac`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bolsa_empleo`.`puesto_carac` (
                                                             `puesto_id` INT NOT NULL,
                                                             `caracteristica_id` INT NOT NULL,
                                                             `nivel` INT NOT NULL,
                                                             PRIMARY KEY (`puesto_id`, `caracteristica_id`),
    INDEX `fk_puesto_carac_caracteristica1_idx` (`caracteristica_id` ASC) VISIBLE,
    CONSTRAINT `fk_puesto_carac_caracteristica1`
    FOREIGN KEY (`caracteristica_id`)
    REFERENCES `bolsa_empleo`.`caracteristica` (`id`),
    CONSTRAINT `fk_puesto_carac_puesto1`
    FOREIGN KEY (`puesto_id`)
    REFERENCES `bolsa_empleo`.`puesto` (`id`))
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = utf8mb3;

CREATE TABLE IF NOT EXISTS `bolsa_empleo`.`log_actividad` (
    `id`            INT NOT NULL AUTO_INCREMENT,
    `usuario_id`    INT NOT NULL,
    `tipo_usuario`  VARCHAR(10) NOT NULL,
    `accion`        VARCHAR(100) NOT NULL,
    `detalle`       VARCHAR(255) NULL,
    `fecha`         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `fk_log_actividad_usuario_idx` (`usuario_id` ASC),
    CONSTRAINT `fk_log_actividad_usuario`
        FOREIGN KEY (`usuario_id`)
        REFERENCES `bolsa_empleo`.`usuario` (`id`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
