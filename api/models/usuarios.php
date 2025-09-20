<?php
 private $conn;
 private $table_name = "alertas";
 
 public $user_id, $name, $email, $phone, $password;

 public function __construct($db) {
     $this->conn = $db;
 }
?>