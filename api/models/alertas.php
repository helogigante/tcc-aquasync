<?php
    class Alerta() {
        private $conn;
        private $table_name = "alertas";
        private $condition = "";

        public $alert_id, $dt_time, $user_id, $id_alert_type, $c, $time,
                $report = array(
                    "dt_time" => "",
                    "title" => "",
                    "description" => ""
                    );
    
        public function __construct($db) {
            $this->conn = $db;
        }
        function create(){
            $query = "INSERT INTO alertas (dt_hr_alerta, id_usuario, id_tipo_alerta) 
                        VALUES (NOW(), :user_id, :alert_type);";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":user_id", $this->user_id);
            $stmt->bindParam(":alert_type", $this->alert_type);
            return $stmt->execute();
        }

        function read(){
            $status = array(true);
            switch ($c){
                case('day'):
                    $condition = "AND DAY(dt_hr_alerta) = DAY($this->time)";
                break;
                case('month'):
                    $condition = "AND MONTH(dt_hr_alerta) = MONTH($this->time)";
                break;
                case('year'):
                    $condition = "AND YEAR(dt_hr_alerta) = YEAR($this->time)";
                break;
                default:
                    $condition = "";
            }
            $query = "SELECT dt_hr_alerta, nome_tipo, descricao_tipo
                        FROM alertas AS a 
                        JOIN tipo_alerta AS t 
                            ON a.id_tipo_alerta = t.id_tipo_alerta $this->condition
                            WHERE id_usuario = :user_id;";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":user_id", $this->user_id);
            $stmt->execute();

            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if($row && $row['nome_tipo'] !== null) {
                $this->report['dt_time'] = $row['dt_hr_alerta'];
                $this->report['title'] = $row['nome_tipo'];
                $this->report['description'] = $row['descricao_tipo'];
                $status[] = true;
            } else {
                $status[] = false;
            }
            return !in_array(false, $status);   
        }
    }
?>