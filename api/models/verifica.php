<?php
    class Verifica {
        private $conn;
        private $table_name = "leituras";
    
        public $sensor;

        public function __construct($db) {
            $this->conn = $db;
        }
        function verificar(){

        }
    }
?>