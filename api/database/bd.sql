-- --------------------------------------------------------
-- Servidor:                     127.0.0.1
-- Versão do servidor:           10.4.32-MariaDB - mariadb.org binary distribution
-- OS do Servidor:               Win64
-- HeidiSQL Versão:              10.2.0.5599
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Copiando estrutura do banco de dados para aquasync-tcc
CREATE DATABASE IF NOT EXISTS `aquasync-tcc` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `aquasync-tcc`;

-- Copiando estrutura para tabela aquasync-tcc.alertas
CREATE TABLE IF NOT EXISTS `alertas` (
  `id_alerta` varchar(20) NOT NULL,
  `dt_hr_alerta` datetime NOT NULL,
  `descricao_alerta` varchar(200) NOT NULL,
  `id_usuario` varchar(20) NOT NULL,
  `id_tipo_alerta` varchar(20) NOT NULL,
  PRIMARY KEY (`id_alerta`),
  KEY `FK_alerta_usuario` (`id_usuario`),
  KEY `FK_alerta_tipo_alerta` (`id_tipo_alerta`),
  CONSTRAINT `FK_alerta_tipo_alerta` FOREIGN KEY (`id_tipo_alerta`) REFERENCES `tipo_alerta` (`id_tipo_alerta`),
  CONSTRAINT `FK_alerta_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela aquasync-tcc.alertas: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `alertas` DISABLE KEYS */;
/*!40000 ALTER TABLE `alertas` ENABLE KEYS */;

-- Copiando estrutura para tabela aquasync-tcc.leituras
CREATE TABLE IF NOT EXISTS `leituras` (
  `id_leitura` int(11) NOT NULL AUTO_INCREMENT,
  `dt_hr_leitura` datetime NOT NULL,
  `valor_leitura` decimal(10,2) NOT NULL,
  `id_sensor` varchar(20) NOT NULL,
  PRIMARY KEY (`id_leitura`),
  KEY `FK_leituras_sensor` (`id_sensor`),
  CONSTRAINT `FK_leituras_sensor` FOREIGN KEY (`id_sensor`) REFERENCES `sensor` (`id_sensor`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela aquasync-tcc.leituras: ~1 rows (aproximadamente)
/*!40000 ALTER TABLE `leituras` DISABLE KEYS */;
INSERT INTO `leituras` (`id_leitura`, `dt_hr_leitura`, `valor_leitura`, `id_sensor`) VALUES
	(2, '2025-09-14 19:25:36', 100.00, '1'),
	(3, '2025-09-14 19:32:34', 100.00, '1');
/*!40000 ALTER TABLE `leituras` ENABLE KEYS */;

-- Copiando estrutura para tabela aquasync-tcc.sensor
CREATE TABLE IF NOT EXISTS `sensor` (
  `id_sensor` varchar(20) NOT NULL,
  `nome_sensor` varchar(100) NOT NULL,
  `estado_registro` tinyint(1) NOT NULL,
  `valor_fatura` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_sensor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela aquasync-tcc.sensor: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `sensor` DISABLE KEYS */;
INSERT INTO `sensor` (`id_sensor`, `nome_sensor`, `estado_registro`, `valor_fatura`) VALUES
	('1', 'Valdecyr', 1, 1.20);
/*!40000 ALTER TABLE `sensor` ENABLE KEYS */;

-- Copiando estrutura para tabela aquasync-tcc.tipo_alerta
CREATE TABLE IF NOT EXISTS `tipo_alerta` (
  `id_tipo_alerta` varchar(20) NOT NULL,
  `descricao_tipo_alerta` varchar(255) NOT NULL,
  PRIMARY KEY (`id_tipo_alerta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela aquasync-tcc.tipo_alerta: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `tipo_alerta` DISABLE KEYS */;
/*!40000 ALTER TABLE `tipo_alerta` ENABLE KEYS */;

-- Copiando estrutura para tabela aquasync-tcc.usuario
CREATE TABLE IF NOT EXISTS `usuario` (
  `id_usuario` varchar(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `telefone` varchar(100) NOT NULL,
  `senha` varchar(100) NOT NULL,
  PRIMARY KEY (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela aquasync-tcc.usuario: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;

-- Copiando estrutura para tabela aquasync-tcc.usuario_sensor
CREATE TABLE IF NOT EXISTS `usuario_sensor` (
  `id_usuario` varchar(20) NOT NULL,
  `id_sensor` varchar(20) NOT NULL,
  KEY `FK_usuario_sensor_usuario` (`id_usuario`),
  KEY `FK_usuario_sensor_sensor` (`id_sensor`),
  CONSTRAINT `FK_usuario_sensor_sensor` FOREIGN KEY (`id_sensor`) REFERENCES `sensor` (`id_sensor`),
  CONSTRAINT `FK_usuario_sensor_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela aquasync-tcc.usuario_sensor: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `usuario_sensor` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuario_sensor` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
