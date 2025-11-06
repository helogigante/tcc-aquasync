<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 6000"); 
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

    require_once '../config/database.php';
    require_once '../models/verifica.php';

    $database = new Database();
    $db = $database->getConnection();
    $verifica = new Verifica($db);

    $method = $_SERVER['REQUEST_METHOD'];//supervariável global "$_XXX"

    switch($method) {
        case 'GET':
           
        break;
    }
?>