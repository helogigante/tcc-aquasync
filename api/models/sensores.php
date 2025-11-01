<?php
    class Sensor {
        private $conn;
        private $table_name = "sensor", $view_table = "v_usuario_sensor";
        
        public $user_id, $sensor_id, $sensor_name, $register_state, $tariff_value,
            $report = array(
                "sensor_id" => "",
                "sensor_name" => "",
                "register_state" => "",
                "tariff_value" => ""
            );
    
        public function __construct($db) {
            $this->conn = $db;
        }

        function read(){
            $status = array(true);

            $query = "SELECT id_sensor, nome_sensor, estado_registro, valor_fatura FROM $this->view_table WHERE id_usuario = :user_id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":user_id", $this->user_id);
            $stmt->execute();

            while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                if($row['nome_sensor'] !== null) {
                    $this->report[] = [
                        "sensor_id" => $row['id_sensor'],
                        "sensor_name" => $row['nome_sensor'],
                        "register_state" => $row['estado_registro'], 
                        "tariff_value" => number_format($row['valor_fatura'], 2, ',', '.')
                    ];
                } else {
                    $status = false;
                    exit;
                }       
            }  

            return !in_array(false, $status);   
        }

        function readOne(){
            $status = array(true);

            $query = "SELECT id_sensor, nome_sensor, estado_registro, valor_fatura from $this->view_table where id_sensor = :sensor_id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":sensor_id", $this->sensor_id);
            $stmt->execute();

            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if($row && $row['estado_registro'] !== null) {
                $this->report["sensor_id"] = $row['id_sensor'];
                $this->report["sensor_name"] = $row['nome_sensor'];
                $this->report["register_state"] = $row['estado_registro'];
                $this->report["tariff_value"] = number_format($row['valor_fatura'], 2, ',', '.');
                $status[] = true;
            } else {
                $status[] = false;
            }

            return !in_array(false, $status);           
        }

        function create(){

            if(readOne()){//sensor já foi cadastrado
                return false;
            }

            $status = array(true);
            
            $query = "INSERT INTO $this->table_name (id_sensor, nome_sensor, estado_registro, valor_fautra) VALUES
            (:sensor_id, :sensor_name, 1, :tariff_value)";
            
            $stmt = $this->conn->prepare($query);

            $stmt->bindParam(":sensor_id", $this->sensor_id);
            $stmt->bindParam(":sensor_name", $this->sensor_name);
            $stmt->bindParam(":tariff_value", $this->tariff_value);
            
            if ($stmt->execute()) {
                $status[true];
            } else {
                $status[false];
            }

            $query = "INSERT INTO usuario_sensor (id_usuario, id_sensor) VALUES
            (:user_id, :sensor_id)";
            
            $stmt = $this->conn->prepare($query);

            $stmt->bindParam(":user_id", $this->user_id);
            $stmt->bindParam(":sensor_id", $this->sensor_id);
            
            if ($stmt->execute()) {
                $status[true];
            } else {
                $status[false];
            }

            return !in_array(false, $status);   
        }

        function update(){
            $query ="UPDATE $this->table_name SET nome_sensor = ':sensor_name', estado_registro = :register_state, valor_fatura = :tariff_value WHERE id_sensor = :sensor_id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":sensor_id", $this->sensor_id);
            $stmt->bindParam(":sensor_name", $this->sensor_name);
            $stmt->bindParam(":tariff_value", $this->tariff_value);
            $stmt->bindParam(":register_state", $this->register_state);
            return $stmt->execute();
        }

        function delete(){
            $query = "DELETE FROM usuario_sensor WHERE id_sensor = :sensor_id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":sensor_id",$this->sensor_id);
            if ($stmt->execute()) {
                $status[true];
            } else {
                $status[false];
            }
            $query = "DELETE FROM leituras WHERE id_sensor = :sensor_id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":sensor_id",$this->sensor_id);
            if ($stmt->execute()) {
                $status[true];
            } else {
                $status[false];
            }
            $query = "DELETE FROM $this->table_name WHERE id_sensor = :sensor_id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":sensor_id",$this->sensor_id);
            if ($stmt->execute()) {
                $status[true];
            } else {
                $status[false];
            }
            return !in_array(false, $status); 
        }
    }
?>