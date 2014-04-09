-- phpMyAdmin SQL Dump
-- version 4.1.9
-- http://www.phpmyadmin.net
--
-- Host: localhost:8889
-- Generation Time: 09-04-2014 a les 14:23:22
-- Server version: 5.5.34
-- PHP Version: 5.5.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `idkpong`
--

-- --------------------------------------------------------

--
-- Estructura de la taula `matches`
--

CREATE TABLE `matches` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `winner` int(11) NOT NULL,
  `loser` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `winnerpoints` int(11) NOT NULL,
  `loserpoints` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

-- --------------------------------------------------------

--
-- Estructura de la taula `players`
--

CREATE TABLE `players` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `fullName` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

-- --------------------------------------------------------

--
-- Estructura de la taula `results`
--

CREATE TABLE `results` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `winnerpoints` int(11) NOT NULL,
  `loserpoints` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
