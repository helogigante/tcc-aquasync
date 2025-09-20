<?php
    private $conn;
    private $table_name = "sensores";
    
    public $sensor_id, $sensor_name, $register_state, $tariff_value;

    public function __construct($db) {
        $this->conn = $db;
    }
    function read(){

    }
    function create(){

    }
    function update(){

    }
    function delete(){
        
    }
?>