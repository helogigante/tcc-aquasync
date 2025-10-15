<?php
    header("Access-Control-Allow-Origin: *");//aceita chamadas de todos outros domínios
    header("Content-Type: application/json");//tipo de dados da resposta
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600"); 
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, XRequested-Width;");

    require_once '../config/database.php';
    require_once '../models/leituras.php';

    $database = new Database();
    $db = $database->getConnection();
    $leitura = new Leitura($db);

    $method = $_SERVER['REQUEST_METHOD'];

    if(isset($_GET['period']) || isset($_GET['sensor'])){
        $leitura->period = $_GET['period'];
        $leitura->sensor = $_GET['sensor'];

        switch($leitura->period) {
            case 'day':
                if(isset($_GET['day']) || isset($_GET['month']) || isset($_GET['year'])){
                    $leitura->day = intval(trim($_GET['day'], "'"));
                    $leitura->month = intval(trim($_GET['month'], "'"));
                    $leitura->year = intval(trim($_GET['year'], "'"));
                    $date = sprintf('%04d-%02d-%02d', $leitura->year, $leitura->month, $leitura->day);
                    $leitura->date = $date;                
                    if($date === date("Y-m-d")){
                        if($leitura->readActualDay()){
                            $leitura_arr = $leitura->report;                  
                            http_response_code(200);
                            echo json_encode($leitura_arr);
                        } else {
                            http_response_code(404);
                            echo json_encode(array("message"=>"Não foi possível fazer a leitura dos dados."));       
                        }
                    } else {
                        if($leitura->readDay()){
                            $leitura_arr = $leitura->report;                  
                            http_response_code(200);
                            echo json_encode($leitura_arr);
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
            case 'month':
                if(isset($_GET['month']) || isset($_GET['year'])){
                    $leitura->month = intval(trim($_GET['month'], "'"));
                    $leitura->year = intval(trim($_GET['year'], "'"));               
                        if($leitura->readMonth()){
                            $leitura_arr = $leitura->report;                  
                            http_response_code(200);
                            echo json_encode($leitura_arr);
                        } else {
                            http_response_code(404);
                            echo json_encode(array("message"=>"Não foi possível fazer a leitura dos dados."));       
                        } 
                } else {
                    http_response_code(404);
                    echo json_encode(array("message"=>"Parâmetros não foram recebidos.")); 
                }
            break;

            case 'year':
                if(isset($_GET['year'])){
                    $leitura->year = intval(trim($_GET['year'], "'"));               
                        if($leitura->readYear()){
                            $leitura_arr = $leitura->report;                  
                            http_response_code(200);
                            echo json_encode($leitura_arr);
                        } else {
                            http_response_code(404);
                            echo json_encode(array("message"=>"Não foi possível fazer a leitura dos dados."));       
                        }
                } else {
                    http_response_code(404);
                    echo json_encode(array("message"=>"Parâmetros não foram recebidos.")); 
                }
            break;
        }
    } else {
        http_response_code(404);
        echo json_encode(array("message"=>"Parâmetros não foram recebidos.")); 
    }
?>