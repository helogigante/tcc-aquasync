<?php
    header("Access-Control-Allow-Origin: *");//aceita chamadas de todos outros domínios
    header("Content-Type: application/json");//tipo de dados da resposta
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
    header("Access-Control-Max-Age: 6000"); 
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-Width;");

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
                $usuario->read();
                if($usuario->user_id != null) {
                    $usuario_arr = array (
                        "id"=>$usuario->$user_id,
                        "nome"=>$usuario->$name,
                        "email"=>$usuario->$email,
                        "telefone"=>$usuario->$phone,
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
            //falar que ta devolvendo json
            $usuario->user_id = $data->user_id;
            $usuario->name = $data->name;
            $usuario->email = $data->email;
            $usuario->phone = $data->phone;
            $usuario->password = $data->password;      
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
            $usuario->password = $data->password;    
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
            $usuario->id = $data->id;
            if($usuario->delete()) {
                http_response_code(200);
                echo json_encode(array("message"=>"Usuário excluído com sucesso.")); 
            } else {
                http_response_code(503);
                echo json_encode(array("message"=>"Falha na atualização de dados."));
            }

        break;
    }
?>