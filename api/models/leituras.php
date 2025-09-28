<?php
    class Leitura() {
        private $conn;
        private $table_name = "leituras";
        
        public $read_id, $dt_time_read, $value, $sensor_id;
    
        public function __construct($db) {
            $this->conn = $db;
        }
        function readOne(){
                
        }
        function readActualDay(){
            //consumo total de cada hora 
        }
        function readDay(){
            //consumo total de cada hora
            //consumo total
            //custo total estimado
            //média por hora
            //média por dia
            //maior e menor vazão
        }
        function readMonth(){
            //consumo total de cada dia
            //consumo total
            //custo total estimado
            //média por hora
            //média por dia
            //maior e menor vazão
        }
        function readYear(){
            //consumo total de cada mês
            //consumo total
            //custo total estimado
            //média por hora
            //média por dia
            //maior e menor vazão
        }
    }
?>