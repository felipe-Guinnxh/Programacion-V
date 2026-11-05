-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 30-10-2026 a las 16:31:41
-- Versión del servidor: 10.4.27-MariaDB
-- Versión de PHP: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `proyectos`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ciudades`
--

CREATE TABLE `ciudades` (
  `id` bigint(20) NOT NULL,
  `ciudad` varchar(80) NOT NULL,
  `pais` varchar(80) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ciudades`
--

INSERT INTO `ciudades` (`id`, `ciudad`, `pais`) VALUES
(1, 'Guayaquil', 'Ecuador'),
(2, 'Guadalajara', 'México'),
(3, 'São Paulo', 'Brasil'),
(4, 'Lima', 'Perú'),
(5, 'Toluca', 'México'),
(6, 'Santiago', 'Chile'),
(7, 'La Habana', 'Cuba'),
(8, 'Ciudad de México', 'México'),
(9, 'Valencia', 'España'),
(10, 'Santiago de Cali', 'Colombia'),
(11, 'Monterrey', 'México'),
(12, 'Caracas', 'Venezuela'),
(13, 'Maracaibo', 'Venezuela'),
(14, 'San Salvador', 'El Salvador'),
(15, 'Santa Cruz de la Sierra', 'Bolivia'),
(16, 'Rio de Janeiro', 'Brasil'),
(17, 'Medellín', 'Colombia'),
(18, 'Trujillo', 'Perú'),
(19, 'Quito', 'Ecuador'),
(20, 'New York', 'Estados Unidos'),
(21, 'Sevilla', 'España'),
(22, 'Managua', 'Nicaragua'),
(23, 'Buenos Aires', 'Argentina'),
(24, 'La Paz', 'Bolivia'),
(25, 'Puebla', 'México'),
(26, 'Madrid', 'España'),
(27, 'Barranquilla', 'Colombia'),
(28, 'San José', 'Costa Rica'),
(29, 'Tegucigalpa', 'Honduras'),
(30, 'Montevideo', 'Uruguay'),
(31, 'Los Ángeles', 'Estados Unidos'),
(32, 'Ciudad de Guatemala', 'Guatemala'),
(33, 'Santo Domingo', 'República Dominicana'),
(34, 'Miami', 'Estados Unidos'),
(35, 'San Juan', 'Puerto Rico'),
(36, 'Córdoba', 'Argentina'),
(37, 'Barcelona', 'España'),
(38, 'Bogotá', 'Colombia'),
(39, 'Asunción', 'Paraguay');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id` bigint(20) NOT NULL,
  `ciudad_id` bigint(20) NOT NULL,
  `nombre` varchar(80) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `segmento` enum('persona','empresa') NOT NULL DEFAULT 'persona'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`id`, `ciudad_id`, `nombre`, `telefono`, `segmento`) VALUES
(1, 1, 'Adams, Fernando', '67512190', 'persona'),
(2, 2, 'Adams, Wyatt', '67724330', 'persona'),
(3, 3, 'Alexander, Emily', '66940078', 'persona'),
(4, 4, 'Allen, Charles', '48304569', 'persona'),
(5, 5, 'Alonso, Julio', '80405557', 'persona'),
(6, 6, 'Alvarez, Alberto', '81363709', 'persona'),
(7, 7, 'Alvarez, Sheila', '58135816', 'persona'),
(8, 8, 'Ana, Maria', '53065439', 'persona'),
(9, 9, 'Anderson, Brianna', '86393127', 'persona'),
(10, 10, 'Anderson, Nicholas', '83221116', 'persona'),
(11, 9, 'Arthur, Jermaine', '82424111', 'persona'),
(12, 11, 'Bailey, Angel', '63479237', 'persona'),
(13, 12, 'Bailey, Cole', '51800292', 'persona'),
(14, 5, 'Bailey, Emma', '75940504', 'persona'),
(15, 7, 'Bailey, Timothy', '67369683', 'persona'),
(16, 13, 'Baileya, Angela', '68855373', 'persona'),
(17, 14, 'Baker, Edward', '68335158', 'persona'),
(18, 6, 'Baker, Katelyn', '83661824', 'persona'),
(19, 15, 'Baker, Marcus', '62160307', 'persona'),
(20, 16, 'Baker, Morgan', '68446515', 'persona'),
(21, 17, 'Barnes, Christian', '68750364', 'persona'),
(22, 18, 'Barnes, Christine', '52115908', 'persona'),
(23, 19, 'Barnes, Connor', '84042464', 'persona'),
(24, 20, 'Barnes, Pamela', '56004925', 'persona'),
(25, 21, 'Barrett, Tiffany', '87691237', 'persona'),
(26, 22, 'Bates, Joshua', '67210556', 'persona'),
(27, 23, 'Bates, Megan', '48666010', 'persona'),
(28, 24, 'Baxter, Michael', '50667654', 'persona'),
(29, 25, 'Becker, Jamie', '75710865', 'persona'),
(30, 26, 'Bell, Austin', '63491001', 'persona'),
(31, 27, 'Bell, Jill', '77047056', 'persona'),
(32, 28, 'Bennett, Danielle', '85227986', 'persona'),
(33, 29, 'Bennett, Eric', '56609576', 'persona'),
(34, 30, 'Bennett, Julie', '77464244', 'persona'),
(35, 31, 'Bennett, Laura', '52483436', 'persona'),
(36, 32, 'Benson, Jason', '77216646', 'persona'),
(37, 33, 'Berg, Ashley', '62208776', 'persona'),
(38, 34, 'Berry, Lisa', '53029679', 'persona'),
(39, 35, 'Best, Morgan', '70231896', 'persona'),
(40, 36, 'Bishop, Christina', '60691664', 'persona'),
(41, 37, 'Black, Jacob', '87711676', 'persona'),
(42, 38, 'Blair, Lisa', '77108372', 'persona'),
(43, 39, 'Blake, Amber', '76303194', 'persona'),
(44, 1, 'Blake, Chelsea', '61369090', 'persona'),
(45, 2, 'Blake, Courtney', '71492905', 'persona'),
(46, 3, 'Blake, Cynthia', '66792923', 'persona'),
(47, 4, 'Blake, Heather', '68639043', 'persona'),
(48, 5, 'Blake, Meagan', '87562185', 'persona'),
(49, 6, 'Blake, Melissa', '84902702', 'persona'),
(50, 7, 'Blake, Michelle', '50799140', 'persona'),
(51, 8, 'Blake, Patricia', '59914098', 'persona'),
(52, 9, 'Blake, Scott', '51677355', 'persona'),
(53, 10, 'Blake, Shawn', '66849923', 'persona'),
(54, 11, 'Blake, Thomas', '71170991', 'persona'),
(55, 12, 'Blake, Tyler', '79513741', 'persona'),
(56, 13, 'Blake, William', '63263935', 'persona'),
(57, 14, 'Boone, Michael', '57287980', 'persona'),
(58, 15, 'Booth, Barbara', '65197866', 'persona'),
(59, 16, 'Bowers, Brandon', '85888435', 'persona'),
(60, 17, 'Bowman, Daniel', '52867841', 'persona'),
(61, 18, 'Boyd, Amy', '66260103', 'persona'),
(62, 19, 'Boyd, Jeffrey', '68127815', 'persona'),
(63, 20, 'Boyle, Karen', '68387554', 'persona'),
(64, 21, 'Brady, Daniel', '61910249', 'persona'),
(65, 22, 'Brady, Diana', '80719058', 'persona'),
(66, 23, 'Brady, Heather', '82747251', 'persona'),
(67, 24, 'Brady, Steven', '73898368', 'persona'),
(68, 25, 'Brady, Susan', '81123954', 'persona'),
(69, 26, 'Brady, Tracy', '59092566', 'persona'),
(70, 27, 'Brandon, Ashley', '66293672', 'persona'),
(71, 28, 'Brandt, Anthony', '51032888', 'persona'),
(72, 29, 'Brandt, Connor', '76254357', 'persona'),
(73, 30, 'Brandt, Dylan', '71685358', 'persona'),
(74, 31, 'Brandt, Jessica', '53032998', 'persona'),
(75, 32, 'Brandt, Kevin', '87332719', 'persona'),
(76, 33, 'Brandt, Nicholas', '63886462', 'persona'),
(77, 34, 'Brandt, Robert', '68711396', 'persona'),
(78, 35, 'Brandt, Sherri', '84996555', 'persona'),
(79, 36, 'Brandt, Timothy', '70078274', 'persona'),
(80, 37, 'Brandt, Travis', '55173123', 'persona'),
(81, 38, 'Brandt, Vincent', '84621324', 'persona'),
(82, 39, 'Brandt, Zachary', '72387910', 'persona'),
(83, 1, 'Briggs, Ashley', '72860931', 'persona'),
(84, 2, 'Brooks, Brian', '87721195', 'persona'),
(85, 3, 'Brooks, Brittany', '52864011', 'persona'),
(86, 4, 'Brooks, David', '64351454', 'persona'),
(87, 5, 'Brooks, Deborah', '85815286', 'persona'),
(88, 6, 'Brown, Andrea', '73923407', 'persona'),
(89, 7, 'Brown, Brian', '74056968', 'persona'),
(90, 8, 'Brown, Brittany', '83477211', 'persona'),
(91, 9, 'Brown, Christopher', '65062975', 'persona'),
(92, 10, 'Brown, Danielle', '82003633', 'persona'),
(93, 11, 'Brown, David', '65090424', 'persona'),
(94, 12, 'Brown, Derek', '52221636', 'persona'),
(95, 13, 'Brown, Elizabeth', '78801339', 'persona'),
(96, 14, 'Brown, Emily', '51683698', 'persona'),
(97, 15, 'Brown, Hannah', '81338140', 'persona'),
(98, 16, 'Brown, Jason', '63977369', 'persona'),
(99, 17, 'Brown, Jennifer', '60700599', 'persona'),
(100, 18, 'Brown, Jessica', '73703228', 'persona'),
(101, 19, 'Brown, John', '61156992', 'persona'),
(102, 20, 'Brown, Jonathan', '54286144', 'persona'),
(103, 21, 'Brown, Jordan', '85301254', 'persona'),
(104, 22, 'Brown, Joshua', '54290015', 'persona'),
(105, 23, 'Brown, Justin', '80874942', 'persona'),
(106, 24, 'Brown, Kayla', '58164027', 'persona'),
(107, 25, 'Brown, Kevin', '59490215', 'persona'),
(108, 26, 'Brown, Kyle', '66785452', 'persona'),
(109, 27, 'Brown, Lauren', '72783022', 'persona'),
(110, 28, 'Brown, Madison', '55168063', 'persona'),
(111, 29, 'Brown, Matthew', '78276776', 'persona'),
(112, 30, 'Brown, Megan', '75046492', 'persona'),
(113, 31, 'Brown, Michael', '51367940', 'persona'),
(114, 32, 'Brown, Michelle', '77970462', 'persona'),
(115, 33, 'Brown, Nicholas', '71985861', 'persona'),
(116, 34, 'Brown, Nicole', '78443919', 'persona'),
(117, 35, 'Brown, Ryan', '87007574', 'persona'),
(118, 36, 'Brown, Samantha', '73972103', 'persona'),
(119, 37, 'Brown, Sarah', '85830009', 'persona'),
(120, 38, 'Brown, Shelby', '55848643', 'persona'),
(121, 39, 'Brown, Steven', '50103045', 'persona'),
(122, 1, 'Brown, Taylor', '79077163', 'persona'),
(123, 2, 'Brown, Tyler', '79015705', 'persona'),
(124, 3, 'Brown, William', '73329274', 'persona'),
(125, 4, 'Bryant, Amber', '65868616', 'persona'),
(126, 5, 'Bryant, Brian', '68438112', 'persona'),
(127, 6, 'Bryant, Brittany', '62307280', 'persona'),
(128, 7, 'Bryant, Danielle', '55682119', 'persona'),
(129, 8, 'Bryant, David', '73490409', 'persona'),
(130, 9, 'Bryant, Derek', '69328828', 'persona'),
(131, 10, 'Bryant, Emily', '58590028', 'persona'),
(132, 11, 'Bryant, Hannah', '57751326', 'persona'),
(133, 12, 'Bryant, Jason', '68082446', 'persona'),
(134, 13, 'Bryant, Jennifer', '68107653', 'persona'),
(135, 14, 'Bryant, Jessica', '76595100', 'persona'),
(136, 15, 'Bryant, John', '78357631', 'persona'),
(137, 16, 'Bryant, Jonathan', '85476317', 'persona'),
(138, 17, 'Bryant, Jordan', '87314726', 'persona'),
(139, 18, 'Bryant, Joshua', '52320113', 'persona'),
(140, 19, 'Bryant, Justin', '78466620', 'persona'),
(141, 20, 'Bryant, Kayla', '61009098', 'persona'),
(142, 21, 'Bryant, Kevin', '60497963', 'persona'),
(143, 22, 'Bryant, Kyle', '82981733', 'persona'),
(144, 23, 'Bryant, Lauren', '68910610', 'persona'),
(145, 24, 'Bryant, Madison', '64337116', 'persona'),
(146, 25, 'Bryant, Matthew', '79965279', 'persona'),
(147, 26, 'Bryant, Megan', '87545733', 'persona'),
(148, 27, 'Bryant, Michael', '74208725', 'persona'),
(149, 28, 'Bryant, Michelle', '80111416', 'persona'),
(150, 29, 'Bryant, Nicholas', '62503249', 'persona'),
(151, 30, 'Bryant, Nicole', '87600261', 'persona'),
(152, 31, 'Bryant, Ryan', '75145462', 'persona'),
(153, 32, 'Bryant, Samantha', '60749950', 'persona'),
(154, 33, 'Bryant, Sarah', '57142541', 'persona'),
(155, 34, 'Bryant, Shelby', '59781710', 'persona'),
(156, 35, 'Bryant, Steven', '60407402', 'persona'),
(157, 36, 'Bryant, Taylor', '74589003', 'persona'),
(158, 37, 'Bryant, Tyler', '58893048', 'persona'),
(159, 38, 'Bryant, William', '87456313', 'persona'),
(160, 39, 'Buchanan, Amy', '67845875', 'persona'),
(161, 1, 'Buchanan, Ashley', '84908002', 'persona'),
(162, 2, 'Buchanan, Brian', '73024010', 'persona'),
(163, 3, 'Buchanan, Brittany', '62198399', 'persona'),
(164, 4, 'Buchanan, Christopher', '77631021', 'persona'),
(165, 5, 'Buchanan, David', '52486749', 'persona'),
(166, 6, 'Buchanan, Derek', '61198158', 'persona'),
(167, 7, 'Buchanan, Emily', '87582628', 'persona'),
(168, 8, 'Buchanan, Hannah', '72833441', 'persona'),
(169, 9, 'Buchanan, Jason', '53448906', 'persona'),
(170, 10, 'Buchanan, Jennifer', '80641910', 'persona'),
(171, 11, 'Buchanan, Jessica', '56394168', 'persona'),
(172, 12, 'Buchanan, John', '80585160', 'persona'),
(173, 13, 'Buchanan, Jonathan', '87236486', 'persona'),
(174, 14, 'Buchanan, Jordan', '79564753', 'persona'),
(175, 15, 'Buchanan, Joshua', '60333038', 'persona'),
(176, 16, 'Buchanan, Justin', '60842946', 'persona'),
(177, 17, 'Buchanan, Kayla', '78686440', 'persona'),
(178, 18, 'Buchanan, Kevin', '86473569', 'persona'),
(179, 19, 'Buchanan, Kyle', '70077557', 'persona'),
(180, 20, 'Buchanan, Lauren', '61760473', 'persona'),
(181, 21, 'Buchanan, Madison', '64304189', 'persona'),
(182, 22, 'Buchanan, Matthew', '66940816', 'persona'),
(183, 23, 'Buchanan, Megan', '63466364', 'persona'),
(184, 24, 'Buchanan, Michael', '72321568', 'persona'),
(185, 25, 'Buchanan, Michelle', '76474888', 'persona'),
(186, 26, 'Buchanan, Nicholas', '55822104', 'persona'),
(187, 27, 'Buchanan, Nicole', '55540293', 'persona'),
(188, 28, 'Buchanan, Ryan', '87521116', 'persona'),
(189, 29, 'Buchanan, Samantha', '64218873', 'persona'),
(190, 30, 'Buchanan, Sarah', '72796027', 'persona'),
(191, 31, 'Buchanan, Shelby', '60752572', 'persona'),
(192, 32, 'Buchanan, Steven', '64224516', 'persona'),
(193, 33, 'Buchanan, Taylor', '73588587', 'persona'),
(194, 34, 'Buchanan, Tyler', '50092686', 'persona'),
(195, 35, 'Buchanan, William', '76161675', 'persona'),
(196, 36, 'Burns, Amanda', '62441623', 'persona'),
(197, 37, 'Burns, Andrew', '60306446', 'persona'),
(198, 38, 'Burns, Anthony', '75208247', 'persona'),
(199, 39, 'Burns, Ashley', '61216486', 'persona'),
(200, 1, 'Burns, Brandon', '74842980', 'persona'),
(201, 2, 'Burns, Brittany', '68110807', 'persona'),
(202, 3, 'Burns, Charles', '65591150', 'persona'),
(203, 4, 'Burns, Christina', '52783797', 'persona'),
(204, 5, 'Burns, Christopher', '80269765', 'persona'),
(205, 6, 'Burns, Daniel', '86420346', 'persona'),
(206, 7, 'Burns, David', '52009901', 'persona'),
(207, 8, 'Burns, Deborah', '85348702', 'persona'),
(208, 9, 'Burns, Derek', '78209769', 'persona'),
(209, 10, 'Burns, Donald', '82106446', 'persona'),
(210, 11, 'Burns, Edward', '82119521', 'persona'),
(211, 12, 'Burns, Elizabeth', '65532599', 'persona'),
(212, 13, 'Burns, Emily', '75651326', 'persona'),
(213, 14, 'Burns, Eric', '85522824', 'persona'),
(214, 15, 'Burns, Hannah', '70763820', 'persona'),
(215, 16, 'Burns, Jacob', '78521479', 'persona'),
(216, 17, 'Burns, James', '55995118', 'persona'),
(217, 18, 'Burns, Jason', '53977064', 'persona'),
(218, 19, 'Burns, Jeffrey', '62230094', 'persona'),
(219, 20, 'Burns, Jennifer', '82144839', 'persona'),
(220, 21, 'Burns, Jessica', '65999955', 'persona'),
(221, 22, 'Burns, John', '50581922', 'persona'),
(222, 23, 'Burns, Jonathan', '68769325', 'persona'),
(223, 24, 'Burns, Jordan', '80201149', 'persona'),
(224, 25, 'Burns, Joshua', '61774840', 'persona'),
(225, 26, 'Burns, Justin', '86409856', 'persona'),
(226, 27, 'Burns, Kayla', '68206106', 'persona'),
(227, 28, 'Burns, Kevin', '65325726', 'persona'),
(228, 29, 'Burns, Kyle', '60006787', 'persona'),
(229, 30, 'Burns, Lauren', '59892352', 'persona'),
(230, 31, 'Burns, Madison', '68078408', 'persona'),
(231, 32, 'Burns, Matthew', '73711713', 'persona'),
(232, 33, 'Burns, Megan', '67268841', 'persona'),
(233, 34, 'Burns, Michael', '59983596', 'persona'),
(234, 35, 'Burns, Michelle', '60035204', 'persona'),
(235, 36, 'Burns, Nicholas', '60101950', 'persona'),
(236, 37, 'Burns, Nicole', '72414528', 'persona'),
(237, 38, 'Burns, Ryan', '66180573', 'persona'),
(238, 39, 'Burns, Samantha', '68230322', 'persona'),
(239, 1, 'Burns, Sarah', '66749977', 'persona'),
(240, 2, 'Burns, Shelby', '51441372', 'persona'),
(241, 3, 'Burns, Steven', '76094928', 'persona'),
(242, 4, 'Burns, Taylor', '58633968', 'persona'),
(243, 5, 'Burns, Tyler', '75925341', 'persona'),
(244, 6, 'Burns, William', '69773044', 'persona'),
(245, 7, 'Cantu, Joshua', '75478989', 'persona'),
(246, 8, 'Cantu, Lauren', '56417517', 'persona'),
(247, 9, 'Cantu, Madison', '72783932', 'persona'),
(248, 10, 'Cantu, Matthew', '69671212', 'persona'),
(249, 11, 'Cantu, Megan', '73506528', 'persona'),
(250, 12, 'Cantu, Michael', '83267672', 'persona'),
(251, 13, 'Cantu, Michelle', '86637150', 'persona'),
(252, 14, 'Cantu, Nicholas', '61399795', 'persona'),
(253, 15, 'Cantu, Nicole', '61548267', 'persona'),
(254, 16, 'Cantu, Ryan', '86934025', 'persona'),
(255, 17, 'Cantu, Samantha', '85746204', 'persona'),
(256, 18, 'Cantu, Sarah', '64839127', 'persona'),
(257, 19, 'Cantu, Shelby', '82252072', 'persona'),
(258, 20, 'Cantu, Steven', '85724780', 'persona'),
(259, 21, 'Cantu, Taylor', '73163546', 'persona'),
(260, 22, 'Cantu, Tyler', '66524806', 'persona'),
(261, 23, 'Cantu, William', '58072292', 'persona'),
(262, 24, 'Ward, Zachary', '83515238', 'persona'),
(263, 25, 'Watson, Cameron', '68704725', 'persona'),
(264, 26, 'Watson, Daniel', '63791333', 'persona'),
(265, 27, 'Watson, Madison', '55283867', 'persona'),
(266, 28, 'Watson, Megan', '58583984', 'persona'),
(267, 29, 'Watson, Michael', '72445957', 'persona'),
(268, 30, 'Watson, Nicole', '65874836', 'persona'),
(269, 31, 'Watson, Ryan', '72511319', 'persona'),
(270, 32, 'Watson, Samantha', '72833632', 'persona'),
(271, 33, 'Watson, Sarah', '87284146', 'persona'),
(272, 34, 'Watts, Andrew', '64881279', 'persona'),
(273, 35, 'Watts, Daniel', '81069406', 'persona'),
(274, 36, 'Watts, Madison', '80067833', 'persona'),
(275, 37, 'Watts, Megan', '55640203', 'persona'),
(276, 38, 'Watts, Michael', '60298156', 'persona'),
(277, 39, 'Watts, Nicole', '57332329', 'persona'),
(278, 1, 'Watts, Ryan', '81022135', 'persona'),
(279, 2, 'Watts, Samantha', '65530809', 'persona'),
(280, 3, 'Watts, Sarah', '71281990', 'persona'),
(281, 4, 'Weaver, Ashley', '87284596', 'persona'),
(282, 5, 'Weaver, Brian', '53572377', 'persona'),
(283, 6, 'Weaver, Brittany', '58124519', 'persona'),
(284, 7, 'Weaver, Christopher', '58447477', 'persona'),
(285, 8, 'Weaver, David', '54045885', 'persona'),
(286, 9, 'Weaver, Derek', '57416912', 'persona'),
(287, 10, 'Weaver, Emily', '73430485', 'persona'),
(288, 11, 'Weaver, Hannah', '66553352', 'persona'),
(289, 12, 'Weaver, Jason', '72687772', 'persona'),
(290, 13, 'Weaver, Jennifer', '87570079', 'persona'),
(291, 14, 'Weaver, Jessica', '64126719', 'persona'),
(292, 15, 'Weaver, John', '85590647', 'persona'),
(293, 16, 'Weaver, Jonathan', '72766944', 'persona'),
(294, 17, 'Weaver, Jordan', '87229105', 'persona'),
(295, 18, 'Weaver, Joshua', '75074251', 'persona'),
(296, 19, 'Weaver, Justin', '83225300', 'persona'),
(297, 20, 'Weaver, Kayla', '63456017', 'persona'),
(298, 21, 'Weaver, Kevin', '73375222', 'persona'),
(299, 22, 'Weaver, Kyle', '69924438', 'persona'),
(300, 23, 'Weaver, Lauren', '71310358', 'persona'),
(301, 24, 'Weaver, Madison', '85815548', 'persona'),
(302, 25, 'Weaver, Matthew', '63020433', 'persona'),
(303, 26, 'Weaver, Megan', '66577666', 'persona'),
(304, 27, 'Weaver, Michael', '50046549', 'persona'),
(305, 28, 'Weaver, Michelle', '77173760', 'persona'),
(306, 29, 'Weaver, Nicholas', '78587221', 'persona'),
(307, 30, 'Weaver, Nicole', '54286855', 'persona'),
(308, 31, 'Weaver, Ryan', '50000505', 'persona'),
(309, 32, 'Weaver, Samantha', '60964662', 'persona'),
(310, 33, 'Weaver, Sarah', '53108893', 'persona'),
(311, 34, 'Weaver, Shelby', '84380400', 'persona'),
(312, 35, 'Weaver, Steven', '75740507', 'persona'),
(313, 36, 'Weaver, Taylor', '66015771', 'persona'),
(314, 37, 'Weaver, Tyler', '85085344', 'persona'),
(315, 38, 'Weaver, William', '80306387', 'persona'),
(316, 37, 'Yang, Christian', '62646724', 'persona'),
(317, 29, 'Yang, Micah', '51927712', 'persona'),
(318, 16, 'Yang, Robert', '81133920', 'persona'),
(319, 8, 'Young, Jonathan', '87232491', 'persona'),
(320, 36, 'Zeng, Omar', '61186549', 'persona');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `oficinas`
--

CREATE TABLE `oficinas` (
  `id` bigint(20) NOT NULL,
  `nombre` varchar(80) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `oficinas`
--

INSERT INTO `oficinas` (`id`, `nombre`) VALUES
(1, 'Oficina Chile'),
(2, 'Oficina Buenos Aires'),
(3, 'Oficina México'),
(4, 'Oficina Madrid');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proyectos`
--

CREATE TABLE `proyectos` (
  `id` bigint(20) NOT NULL,
  `cliente_id` bigint(20) NOT NULL,
  `oficina_id` bigint(20) NOT NULL,
  `Proyecto` varchar(80) NOT NULL,
  `FechaInicioProyecto` timestamp NOT NULL DEFAULT current_timestamp(),
  `FechaFinProyecto` date DEFAULT NULL,
  `CostoProyecto` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `ciudades`
--
ALTER TABLE `ciudades`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ciudad_id` (`ciudad_id`);

--
-- Indices de la tabla `oficinas`
--
ALTER TABLE `oficinas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `proyectos`
--
ALTER TABLE `proyectos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `oficina_id` (`oficina_id`),
  ADD KEY `cliente_id` (`cliente_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `ciudades`
--
ALTER TABLE `ciudades`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=324;

--
-- AUTO_INCREMENT de la tabla `oficinas`
--
ALTER TABLE `oficinas`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `proyectos`
--
ALTER TABLE `proyectos`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD CONSTRAINT `clientes_ibfk_1` FOREIGN KEY (`ciudad_id`) REFERENCES `ciudades` (`id`);

--
-- Filtros para la tabla `proyectos`
--
ALTER TABLE `proyectos`
  ADD CONSTRAINT `proyectos_ibfk_1` FOREIGN KEY (`oficina_id`) REFERENCES `oficinas` (`id`),
  ADD CONSTRAINT `proyectos_ibfk_2` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
