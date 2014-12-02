<?php 

    include("connection.php");

    $postdata = file_get_contents('php://input');
    $request = json_decode($postdata);
    $card = $request -> {"card"};


    $publicID           = $card -> publicID;
    $message            = $card -> message;
    $messageColor       = $card -> messageColor;
    $messageSize        = $card -> messageSize;
    $messageFont        = $card -> messageFont;
    $messageColor       = $card -> messageColor;
    $messagePositionX   = $card -> messagePositionX;
    $messagePositionY   = $card -> messagePositionY;
    $color              = $card -> color;
    $opacity            = $card -> opacity;
    $speed              = $card -> speed;
    $size               = $card -> size;
    $maxParticles       = $card -> maxParticles;
    $thresholdColor     = $card -> thresholdColor;
    $thresholdIntensity = $card -> thresholdIntensity;
    $bgAnimate          = $card -> bgAnimate;
    $image              = $card -> image;
    $dataUrl            = $card -> dataUrl;
    $isImage            = $card -> isImage;
    $localTime               = date("Y-m-d H:i:s");

    //Convert data64 image to file
    list($type, $dataUrl) = explode(';', $dataUrl);
    list(, $dataUrl)      = explode(',', $dataUrl);
    $dataUrl = base64_decode($dataUrl);

    file_put_contents("../uploads/".$publicID.".png", $dataUrl);


    $req = $connexion->prepare("INSERT INTO cards VALUES(
        :id,
        :publicID,
        :message,
        :messageColor,
        :messageSize,
        :messageFont,
        :messagePositionX,
        :messagePositionY,
        :maxParticles,
        :color,
        :opacity,
        :speed,
        :size,
        :thresholdIntensity,
        :thresholdColor,
        :bgAnimate,
        :image,
        :date
        )");
    $req->execute(array(
        ":id" => "" ,
        ":publicID" => $publicID,
        ":message" => $message,
        ":messageColor" => $messageColor,
        ":messageSize" => $messageSize,
        ":messageFont" => $messageFont,
        ":messagePositionX" => $messagePositionX,
        ":messagePositionY" => $messagePositionY,
        ":maxParticles" => $maxParticles,
        ":color" => $color,
        ":opacity" => $opacity,
        ":speed" => $speed,
        ":size" => $size,
        ":thresholdIntensity" => $thresholdIntensity,
        ":thresholdColor" => $thresholdColor,
        ":bgAnimate" => $bgAnimate,
        ":image" => $image,
        ":date" => $localTime
    ));

?>