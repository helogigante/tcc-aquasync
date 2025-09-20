<?php
    private $conn;
    private $table_name = "leituras";
    
    public $read_id, $dt_time_read, $value, $sensor_id;

    public function __construct($db) {
        $this->conn = $db;
    }
    function readOne(){

    }
    function readActualDay(){

    }
    function readDay(){

    }
    function readMonth(){

    }
    function readYear(){

    }
?>