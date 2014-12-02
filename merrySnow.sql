-- phpMyAdmin SQL Dump
-- version 4.2.0
-- http://www.phpmyadmin.net
--
-- Client :  localhost
-- Généré le :  Mar 02 Décembre 2014 à 21:20
-- Version du serveur :  5.6.17
-- Version de PHP :  5.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données :  `merrySnow`
--

-- --------------------------------------------------------

--
-- Structure de la table `cards`
--

CREATE TABLE IF NOT EXISTS `cards` (
`id` int(11) NOT NULL,
  `publicID` text NOT NULL,
  `message` text NOT NULL,
  `messageColor` varchar(7) NOT NULL DEFAULT '#ffffff',
  `messageSize` int(3) NOT NULL DEFAULT '80',
  `messageFont` text NOT NULL,
  `messagePositionX` int(3) NOT NULL DEFAULT '50',
  `messagePositionY` int(3) NOT NULL DEFAULT '50',
  `maxParticles` int(11) NOT NULL DEFAULT '4500',
  `color` text NOT NULL,
  `opacity` int(11) NOT NULL DEFAULT '8',
  `speed` int(11) NOT NULL DEFAULT '10',
  `size` int(11) NOT NULL DEFAULT '8',
  `thresholdIntensity` int(11) NOT NULL,
  `thresholdColor` varchar(7) NOT NULL,
  `bgAnimate` tinyint(1) NOT NULL DEFAULT '1',
  `image` int(11) NOT NULL DEFAULT '2',
  `date` datetime NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=137 ;

--
-- Index pour les tables exportées
--

--
-- Index pour la table `cards`
--
ALTER TABLE `cards`
 ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `cards`
--
ALTER TABLE `cards`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=137;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
