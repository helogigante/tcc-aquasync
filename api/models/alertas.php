<?php
 private $conn;
 private $table_name = "alertas";
 
 public $alert_id, $dt_time, $user_id, $id_alert_type;

 public function __construct($db) {
     $this->conn = $db;
 }
?>