<?php
    header("Access-Control-Allow-Origin: *");//aceita chamadas de todos outros domínios
    header("Content-Type: application/json");//tipo de dados da resposta
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
    header("Access-Control-Max-Age: 3600"); 
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, XRequested-Width;");

    require_once '../config/database.php';
    require_once '../models/criar_leituras.php';

    $database = new Database();
    $db = $database->getConnection();

    // Verifica se o método da requisição é POST
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Lê o corpo da requisição
        $inputData = file_get_contents("php://input");
        $data = json_decode($inputData, true);

        // Verifica se os dados necessários foram enviados
        if (isset($data['vazao']) && isset($data['timestamp'])) {
            $vazao = $data['vazao'];
            $timestamp = $data['timestamp'];

            // Aqui você pode salvar os dados no banco de dados ou processá-los
            
            // Exemplo de resposta de sucesso
            http_response_code(200);
            echo json_encode([
                "status" => "success",
                "message" => "Dados recebidos com sucesso",
                "data" => [
                    "vazao" => $vazao,
                    "timestamp" => $timestamp
                ]
            ]);
        } else {
            // Resposta de erro caso os dados estejam incompletos
            http_response_code(400);
            echo json_encode([
                "status" => "error",
                "message" => "Dados incompletos. Envie 'vazao' e 'timestamp'."
            ]);
        }
    } else {
        // Resposta de erro caso o método não seja POST
        http_response_code(405);
        echo json_encode([
            "status" => "error",
            "message" => "Método não permitido. Use POST."
        ]);
    }
?>