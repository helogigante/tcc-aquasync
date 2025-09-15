<?php
    $servername = "127.0.0.1";
    $username = "root";
    $password = "";
    $dbname = "aquasync-tcc";

    // Cria conexão
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Verificar conexão
    if ($conn->connect_error) {
        die("Erro na conexão: " . $conn->connect_error);
    }

    // Decodificar o corpo da requisição JSON
    $data = json_decode(file_get_contents('php://input'), true);

    // Verificar se os dados foram enviados corretamente
    if (isset($data['valor']) && isset($data['id_sensor'])) {
        $valor = $data['valor'];
        $id_sensor = $data['id_sensor'];

        // Inserir na tabela leituras
        $sql = "INSERT INTO leituras (dt_hr_leitura, valor_leitura, id_sensor) 
                VALUES (NOW(), '$valor', '$id_sensor')";

        if ($conn->query($sql) === TRUE) {
            echo "OK";
        } else {
            echo "Erro: " . $sql . "<br>" . $conn->error;
        }
    } else {
        echo "Erro: Dados incompletos.";
    }

    $conn->close();
?>