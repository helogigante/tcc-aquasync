<?php
    ob_start();
    error_reporting(0);
    header_remove();

    header("Access-Control-Allow-Origin: *");//aceita chamadas de todos outros domínios
    header("Content-Type: application/json");//tipo de dados da resposta
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
    header("Access-Control-Max-Age: 3600"); 
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    ob_clean();

    require_once '../config/database.php';
    require_once '../models/sensores.php';

    $database = new Database();
    $db = $database->getConnection();
    $sensor = new Sensor($db);

    $method = $_SERVER['REQUEST_METHOD'];

    switch($method){

        case 'GET':
            if(isset($_GET['user_id'])){

                $sensor->user_id = $_GET['user_id'];

                if(isset($_GET['sensor_id'])){
                    $sensor->sensor_id = $_GET['sensor_id'];
                    if($sensor->readOne()){
                        $sensor_arr = array (
                            "sensor_id"=>$sensor->sensor_id,
                            "sensor_name"=>$sensor->sensor_name,
                            "register_state"=>$sensor->register_state,
                            "tariff_value"=>$sensor->tariff_value
                        );
                        http_response_code(200);
                        echo json_encode($sensor_arr);
                    } else {
                        http_response_code(404);
                        echo json_encode(array("message"=>"Não foi possível fazer a leitura dos dados."));       
                    }
                } else {
                    if($sensor->read()){
                        $sensor_arr = $sensor->report;                  
                        http_response_code(200);
                        echo json_encode($sensor_arr);
                    } else {
                        http_response_code(404);
                        echo json_encode(array("message"=>"Não foi possível fazer a leitura dos dados."));       
                    }
                }
            } else {
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
            }

            $sensor->user_id = isset($data->user_id) ? $data->user_id : '';
            $sensor->sensor_id = isset($data->sensor_id) ? $data->sensor_id : '';
            $sensor->sensor_name = isset($data->sensor_name) ? $data->sensor_name : '';
            $sensor->register_state = isset($data->register_state) ? $data->register_state : '';
            $sensor->tariff_value = isset($data->tariff_value) ? $data->tariff_value : '';

            if($sensor->create()) {
                http_response_code(201);
                echo json_encode(array("message"=>"Sensor cadastrado com sucesso."));
            } else {
                http_response_code(503);
                echo json_encode(array("message"=>"Falha no cadastro do sensor."));
            }

        break;

        case 'PUT':
            $data = json_decode(file_get_contents("php://input"));

            if (!$data) {
                http_response_code(400);
                echo json_encode(array("message" => "Erro: dados não recebidos."));
                exit;
            }

            $sensor->sensor_id = $data->sensor_id;
            $sensor->sensor_name = $data->sensor_name;
            $sensor->tariff_value = $data->tariff_value;
            $sensor->register_state = $data->register_state;

            if($sensor->update()) {
                http_response_code(200);
                echo json_encode(array("message"=>"Sensor atualizado com sucesso."));
            } else {
                http_response_code(503);
                echo json_encode(array("message"=>"Falha na atualização do sensor."));
            }
        break;

        case 'DELETE':
            $data = json_decode(file_get_contents("php://input"));
            
            if (!$data || !isset($data->sensor_id)) {
                http_response_code(400);
                echo json_encode(array("message" => "Erro: ID do sensor não recebido."));
                exit;
            }

            $sensor->sensor_id = $data->sensor_id;

            if ($sensor->delete()) {
                http_response_code(200);
                echo json_encode(array("success" => true, "message" => "Sensor despareado com sucesso."));
                exit;
            } else {
                http_response_code(503);
                echo json_encode(array("success" => false, "message" => "Falha no despareamento do sensor."));
                exit;
            }
        break;
    }
?>