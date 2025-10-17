<?php
    class Sensor{
        private $conn;
        private $table_name = "sensor";
        
        public $user_id $sensor_id, $name, $state, $tariff_value;
    
        public function __construct($db) {
            $this->conn = $db;
        }

        function readOne(){

        }
        function read(){
            $query = "SELECT * from $this->table_name where id_sensor = :sensor_id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":sensor_id",$this->sensor_id);
            return $stmt->execute();

            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if($row) {
                
            } else {
                return false;
            }
        }
        function create(){
            $query = "insert into $this->table_nome (id_sensor, nome_sensor, estado_registro, valor_fatura) values 
            (':user_id', ':email', ':nome', ':telefone', ':senha')";
            $stmt = $this->conn->prepare($query);
            //$this->senha = password_hash($this->senha, PASSWORD_BCRYPT);
            $stmt->bindParam(":user_id",$this->user_id);
            $stmt->bindParam(":email",$this->email);
            $stmt->bindParam(":nome",$this->nome);
            $stmt->bindParam(":telefone",$this->telefone);
            $stmt->bindParam(":senha",$this->senha);
            return $stmt->execute();
        }
        function update(){
    
        }
        function delete(){
    
        }
    }
?>