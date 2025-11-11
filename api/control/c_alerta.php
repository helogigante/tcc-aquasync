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
            if (isset($_GET['case'])) {

                $case = $_GET['case'];

                if ($case == 1) {
                    if (isset($_GET['user_id']) || isset($_GET['sensor_id']) || isset($_GET['period']) || isset($_GET['time'])) {

                        $alerta->user_id = $_GET['user_id'];
                        $alerta->sensor_id = $_GET['sensor_id'];
                        $alerta->period = $_GET['period'];
                        $alerta->time = $_GET['time'];


                        if ($alerta->read()) {
                            $alerta_arr = $alerta->report;                  
                            http_response_code(200);
                            echo json_encode($alerta_arr);
                        } else {
                            http_response_code(404);
                            echo json_encode(array("message"=>"Não foi possível fazer a leitura dos dados."));       
                        }
                    }
                }
                if ($case == 2) {
                    if (isset($_GET['user_id'])) {
        
                        $alerta->user_id = $_GET['user_id'];
        
                        if ($alerta->readAll()) {
                            $alerta_arr = $alerta->report;                  
                            http_response_code(200);
                            echo json_encode($alerta_arr);
                        } else {
                            http_response_code(404);
                            echo json_encode(array("message"=>"Não foi possível fazer a leitura dos dados."));       
                        }
                    } else {
                        http_response_code(404);
                        echo json_encode(array("message"=>"Parâmetros não foram recebidos.")); 
                    }
                } 
            }else {
                http_response_code(404);
                echo json_encode(array("message"=>"Parâmetros não foram recebidos.")); 
            }

        break;
        
        case 'POST':
            $data = json_decode(file_get_contents("php://input"));
            if (!$data) {
                http_response_code(400);
                echo json_encode(array("message" => "Erro: dados não recebidos."));
                exit;
            } else {
                $alerta->user_id = $data->user_id ?? null;
                $alerta->sensor_id = $data->sensor_id ?? null;
                $alerta->alert_type = $data->alert_type ?? null;

                if($alerta->create()) {
                    http_response_code(200);
                    echo json_encode(array("message"=>"Alerta criado com sucesso."));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message"=>"Falha na criação do alerta."));
                }    
            }
        break;
    }
?>