<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET, POST");
    header("Access-Control-Max-Age: 3600"); 
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, XRequested-Width;");

    require_once '../config/database.php';
    require_once '../models/alertas.php';

    $database = new Database();
    $db = $database->getConnection();
    $alerta = new Alerta($db);

    $method = $_SERVER['REQUEST_METHOD'];//supervariável global "$_XXX"

    switch($method) {
        case 'GET':
           
        break;
        case 'PUT':
            
        break;
    }
?>