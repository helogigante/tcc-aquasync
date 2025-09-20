<?php
    private $table_name = "leituras";

    // Classe construtora da conexão
    public function __construct($db) {
        $this->conn = $db;
    }
    // Verifica conexão
    if ($conn->connect_error) {
        die("Erro na conexão: " . $conn->connect_error);
    }

    if (isset($_GET['valor']) && isset($_GET['id_sensor'])) {
        $valor = $_GET['valor'];
        $id_sensor = $_GET['id_sensor'];

        $sql = "INSERT INTO $this->table_name (dt_hr_leitura, valor_leitura, id_sensor) 
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