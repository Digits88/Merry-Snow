<?php 

	include("connection.php");

	$cardId = file_get_contents('php://input');

    $searchCard = $connexion->prepare('SELECT * FROM cards WHERE publicID = ?');
	$searchCard->execute(array($cardId));
	$card = $searchCard->fetchAll(PDO::FETCH_ASSOC);

	print_r(json_encode( $card[0], JSON_NUMERIC_CHECK ));

?>