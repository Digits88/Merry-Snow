<?php

	$host = 'mysql:host=localhost;dbname=merrySnow';
	$user = 'root';
	$password = 'mysql';

	// $host = 'mysql:host=localhost;dbname=merrySnow';
	// $user = 'root';
	// $password = 'mysql';
	
	try {
		$connexion =  new PDO($host, $user, $password);
		$connexion->query('SET NAMES utf8');

	}
		  
	catch(Exception $e) {
		die('Erreur : ' . $e->getMessage());
	}

?>