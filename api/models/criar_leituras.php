<?php
    // Importa a configuração do banco
    include_once '../config/db.php';

    // Cria conexão
    $database = new Database();
    $conn = $database->getConnection();

    class CriarLeitura {
        private $conn;
        private $table_name = "leituras";

        // Construtor recebe a conexão (PDO)
        public function __construct($db) {
            $this->conn = $db;
        }

        // Insere uma leitura
        public function inserirLeitura($valor, $id_sensor) {
            try {
                $sql = "INSERT INTO " . $this->table_name . " (dt_hr_leitura, valor_leitura, id_sensor) 
                        VALUES (NOW(), :valor, :id_sensor)";
                $stmt = $this->conn->prepare($sql);

                // Bind dos parâmetros
                // Bind é usado para prevenir SQL Injection
                //SQL Injection é uma técnica onde se insere código SQL em campos de entrada para manipular o banco de dados
                
                $stmt->bindParam(":valor", $valor);
                $stmt->bindParam(":id_sensor", $id_sensor);

                if ($stmt->execute()) {
                    return "OK";
                } else {
                    return "Erro ao inserir leitura.";
                }
            } catch (PDOException $e) {
                return "Erro: " . $e->getMessage();
            }
        }
    }

    if (isset($_GET['valor']) && isset($_GET['id_sensor'])) {
        $valor = $_GET['valor'];
        $id_sensor = $_GET['id_sensor'];

        $leitura = new CriarLeitura($conn);
        echo $leitura->inserirLeitura($valor, $id_sensor);
    } else {
        echo "Erro: Dados incompletos.";
    }
?>