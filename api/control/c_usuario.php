<?php
    header("Access-Control-Allow-Origin: *");//aceita chamadas de todos outros domínios
    header("Content-Type: application/json");//tipo de dados da resposta
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
    header("Access-Control-Max-Age: 6000"); 
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, XRequested-Width;");

    require_once '../config/database.php';
    require_once '../models/usuarios.php';

    $database = new Database();
    $db = $database->getConnection();

    $usuario = new Usuario($db);
//  $user_id, $name, $email, $phone, $password;
    $method = $_SERVER['REQUEST_METHOD'];//supervariável global "$_XXX"

    switch($method) {
        case 'GET':
            if(isset($_GET['id'])) {
                $usuario->id = $_GET['id'];
                $usuario->readOne();
                if($usuario->nome != null) {
                    $usuario_arr=array(
                        "id"->$usuario->$id,
                        "nome"->$usuario->$nome,
                        "email"->$usuario->$email,
                        "ra"->$usuario->$ra,
                        "celular"->$usuario->$celular
                    );
                    http_response_code(200);
                    echo json_encode($usuario_arr);
                } else {
                    http_response_code(404);
                    echo json_encode(array("message"=>"usuario não cadastado."));      
                }
            } else {
                $stmt = $usuario->read();
                $usuarios = $stmt->fetchAll(PDO:: FETCH_ASSOC);
                if(!empty($usuarios)) {
                    http_response_code(200);
                    echo json_encode(array("records"=>$usuarios)); 
                } else {
                    http_response_code(404);
                    echo json_encode(array("message"=>"usuario não cadastado.")); 
                }
            }
        break;
        case 'POST':
            $data = json_decode(file_get_contents("php://input"));
            $usuario->id = $data->id;
            $usuario->nome = $data->usuario;
            $usuario->email = $data->email;
            $usuario->ra = $data->ra;
            $usuario->celular = $data->celular;      
            if($usuario->create()) {
                http_response_code(200);
                echo json_encode(array("message"=>"Usuário cadastrado com sucesso."));
            } else {
                http_response_code(503);
                echo json_encode(array("message"=>"Falha na inclusão de dados."));
            }
        break;
        case 'PUT':
            $data = json_decode(file_get_contents("php://input"));
            $usuario->id = $data->id;
            $usuario->nome = $data->usuario;
            $usuario->email = $data->email;
            $usuario->ra = $data->ra;
            $usuario->celular = $data->celular;
            if($usuario->update()) {
                http_response_code(200);
                echo json_encode(array("message"=>"Usuário atualizado com sucesso."));
            } else {
                http_response_code(503);
                echo json_encode(array("message"=>"Falha na atualização de dados."));
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