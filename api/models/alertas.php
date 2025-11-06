<?php
    class Alerta() {
        private $conn;
        private $table_name = "alertas";
        
        public $alert_id, $dt_time, $user_id, $id_alert_type;
    
        public function __construct($db) {
            $this->conn = $db;
        }
        function create(){
    
        }
        function read(){
            $query = "SELECT round(SUM(valor_leitura), 2) AS total_consumption 
            FROM $this->table_name
            WHERE id_sensor = :sensor AND DATE(dt_hr_leitura) = CURRENT_DATE;";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":sensor", $this->sensor);
            $stmt->execute();

            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if($row && $row['total_consumption'] !== null) {
                $this->report["total_consumption"] = strval(number_format($row['total_consumption'], 2, ',', '.'));
                $status[] = true;
            } else {
                $status[] = false;
            }
            return 
        }
    }
?>