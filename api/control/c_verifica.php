<?php
    //ob_start();
    //error_reporting(0);
    //sheader_remove();

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 6000"); 
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

    ob_clean();

    require_once '../config/database.php';
    require_once '../models/verifica.php';

    $database = new Database();
    $db = $database->getConnection();
    $verifica = new Verifica($db);

    $method = $_SERVER['REQUEST_METHOD'];//supervariável global "$_XXX"

    if(isset($_GET['sensor'])){ 
        $verifica->sensor = $_GET['sensor'];
        if($verifica->verificar()){
            $verifica_arr = array (
                "ex_daily"=>$verifica->ex_daily,
                "ex_monthly"=>$verifica->ex_monthly,
                "sus_24h"=>$verifica->sus_24h,
                "sus_closed"=>$verifica->sus_closed
            );             
            http_response_code(200);
            echo json_encode($verifica_arr);
        } else {
            http_response_code(404);
            echo json_encode(array("message"=>"Não foi possível fazer a leitura dos dados."));       
        }
    } else {
        http_response_code(404);
        echo json_encode(array("message"=>"Parâmetros não foram recebidos.")); 
    }
?>