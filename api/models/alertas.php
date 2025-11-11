<?php
    class Alerta {
        private $conn;
        private $table_name = "alertas";

        public $alert_id, $dt_time, $user_id, $sensor_id, $id_alert_type, $period, $my, $condition,
                $report = array();
    
        public function __construct($db) {
            $this->conn = $db;
        }
        function create(){
            $query = "INSERT INTO alertas (dt_hr_alerta, id_tipo_alerta, id_sensor, id_usuario) 
                        VALUES (NOW(), :alert_type, :sensor_id, :user_id);";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":user_id", $this->user_id);
            $stmt->bindParam(":sensor_id", $this->sensor_id);
            $stmt->bindParam(":alert_type", $this->alert_type);
            return $stmt->execute();
        }
        
        function readAll(){
            $status = array(true);

            $query = "SELECT id_alerta, dt_hr_alerta, nome_tipo, descricao_tipo, nome_sensor
                        FROM v_alertas 
                        WHERE id_usuario = :user_id;";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":user_id", $this->user_id);
            $stmt->execute();

            $c = false;
            while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                if($row && $row['nome_tipo'] !== null) {
                    $this->report[] = [
                        "alert_id" => $row['id_alerta'],
                        "dt_time" => $row['dt_hr_alerta'],
                        "title" => $row['nome_tipo'],
                        "description" => $row['descricao_tipo'],
                        "sensor_name" => $row['nome_sensor']
                    ];
                    $c = true;
                } else {
                    $c = false;
                    break;
                }
            }
            $status[] = $c;
            return !in_array(false, $status);   
        }

        function read(){
            $status = array(true);

            switch ($this->period){
                case 'day': // dia
                    $condition = "AND DATE(dt_hr_alerta) = DATE(:time)";
                    $params[':time'] = $this->time;
                    break;
                case 'month': // mês
                    $condition = "AND MONTH(dt_hr_alerta) = MONTH(:time) AND YEAR(dt_hr_alerta) = YEAR(:time)";
                    $params[':time'] = $this->time;
                    break;
                case '': // ano
                    $condition = "AND YEAR(dt_hr_alerta) = :time";
                    $params[':time'] = $this->time;
                    break;
                default:
                    $condition = "";
            }
    
        $query = "SELECT dt_hr_alerta, nome_tipo, descricao_tipo, nome_sensor
                    FROM v_alertas 
                    WHERE id_usuario = :user_id
                    AND id_sensor = :sensor_id 
                    $condition;";


            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":user_id", $this->user_id);
            $stmt->bindParam(":sensor_id", $this->sensor_id);

            foreach ($params as $key => $value) {
                $stmt->bindParam($key, $value);
            }

            $stmt->execute();

            $c = false;
            while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                if($row && $row['nome_tipo'] !== null) {
                    $this->report[] = [
                        "dt_time" => $row['dt_hr_alerta'],
                        "title" => $row['nome_tipo'],
                        "description" => $row['descricao_tipo'],
                        "sensor_name" => $row['nome_sensor']
                    ];
                    $c = true;
                } else {
                    $c = false;
                    break;
                }
            }
            $status[] = $c;
            return !in_array(false, $status);   
        }
    }
?>