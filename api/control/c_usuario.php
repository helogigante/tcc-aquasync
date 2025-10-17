<?php
    // esse trechinho é para evitar warnings e erros no output JSON
    ob_start();
    error_reporting(0);
    header_remove();
    
    header("Access-Control-Allow-Origin: *");//aceita chamadas de todos outros domínios
    header("Content-Type: application/json");//tipo de dados da resposta
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
    header("Access-Control-Max-Age: 6000"); 
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

    // limpa qualquer saída anterior (warnings, erros, etc)
    ob_clean();

    require_once '../config/database.php';
    require_once '../models/usuarios.php';

    $database = new Database();
    $db = $database->getConnection();
    $usuario = new Usuario($db);

    $method = $_SERVER['REQUEST_METHOD'];//supervariável global "$_XXX"

    switch($method) {
        case 'GET':
            if(isset($_GET['user_id'])) {
                $usuario->user_id = $_GET['user_id'];
                if($usuario->read()) {
                    $usuario_arr = array (
                        "id"=>$usuario->user_id,
                        "email"=>$usuario->email,
                        "nome"=>$usuario->name,
                        "telefone"=>$usuario->phone
                    );
                    http_response_code(200);
                    echo json_encode($usuario_arr);
                } else {
                    http_response_code(404);
                    echo json_encode(array("message"=>"Usuário não encontrado."));      
                }
            } else {
                http_response_code(404);
                echo json_encode(array("message"=>"ID não recebido.")); 
            }

        break;

        case 'POST':
            $data = json_decode(file_get_contents("php://input"));
            
            if (!$data) {
                http_response_code(400);
                echo json_encode(array("message" => "Erro: dados não recebidos."));
                exit;
            }

            // login
            $loginInput = isset($data->login) ? trim($data->login) : '';
            $passwordInput = isset($data->password) ? $data->password : '';
            
            if(isset($data->action) && $data->action === "login") {
                if($usuario->login($data->login, $data->password)) {
                    http_response_code(200);
                    echo json_encode(array(
                        "message" => "Login realizado com sucesso.",
                        "user_id" => $usuario->user_id
                    ));
                } else {
                    http_response_code(401);
                    echo json_encode(array("message" => "Usuário (email) ou senha incorretos."));
                }
                exit;
            }

            // cadastro
            // se $data->name existe e não é null, usa $data->name... senão, usa uma string vazia
            $usuario->name = isset($data->name) ? $data->name : '';
            $usuario->email = isset($data->email) ? $data->email : '';
            $usuario->phone = isset($data->phone) ? $data->phone : '';
            $usuario->password = isset($data->password) ? $data->password : '';

            if($usuario->create()) {
                http_response_code(200);
                echo json_encode(array("message"=>"Usuário cadastrado com sucesso."));
            } else {
                http_response_code(503);
                echo json_encode(array("message"=>"Falha no cadastro do usuário."));
            }

        break;

        case 'PUT':
            $data = json_decode(file_get_contents("php://input"));
            $usuario->user_id = $data->user_id;
            $usuario->name = $data->name;
            $usuario->email = $data->email;
            $usuario->phone = $data->phone;
            if($usuario->update()) {
                http_response_code(200);
                echo json_encode(array("message"=>"Usuário atualizado com sucesso."));
            } else {
                http_response_code(503);
                echo json_encode(array("message"=>"Falha na atualização do usuário."));
            }
        
        break;

        case 'DELETE':
            $data = json_decode(file_get_contents("php://input"));

            if (!$data || !isset($data->user_id)) {
                http_response_code(400);
                echo json_encode(array("message" => "Erro: ID do usuário não recebido."));
                exit;
            }

            $usuario->user_id = $data->user_id;
            
            if ($usuario->delete()) {
                http_response_code(200);
                echo json_encode(array("success" => true, "message" => "Usuário excluído com sucesso."));
                exit;
            } else {
                http_response_code(503);
                echo json_encode(array("success" => false, "message" => "Falha na exclusão do usuário."));
                exit;
            }

        break;
    }
?>