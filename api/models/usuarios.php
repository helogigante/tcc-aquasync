<?php
    class Usuario {
        private $conn;
        private $table_name = "usuario";
        
        public $user_id, $name, $email, $phone, $password;

        public function __construct($db) {
            $this->conn = $db;
        }
        function read(){
            $query = "SELECT id_usuario, email, nome, telefone from $this->table_name where id_usuario = :user_id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":user_id",$this->user_id);
            return $stmt->execute();
        }
        function create(){
            $query = "insert into $this->table_nome (id_usuario, email, nome, telefone, senha) values
            (:user_id, ':email', ':name', ':phone', ':password')";
            $stmt = $this->conn->prepare($query);
            //$this->senha = password_hash($this->senha, PASSWORD_BCRYPT);
            $stmt->bindParam(":user_id",$this->user_id);
            $stmt->bindParam(":email",$this->email);
            $stmt->bindParam(":name",$this->name);
            $stmt->bindParam(":phone",$this->phone);
            $stmt->bindParam(":password",$this->password);
            $stmt->execute();

            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if($row) {
                $this->user_id = $row['id_usuario'];
                $this->email = $row['email'];
                $this->name = $row['nome'];
                $this->phone = $row['telefone'];
                $this->password = $row['senha'];
                return true;
            } else {
                return false;
            }
        }
        function update(){
            $query ="update $this->table_name set email = ':email', nome = ':name', telefone = ':phone', senha = ':password' where id_usuario = :user_id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":user_id",$this->user_id);
            $stmt->bindParam(":email",$this->email);
            $stmt->bindParam(":name",$this->name);
            $stmt->bindParam(":phone",$this->phone);
            $stmt->bindParam(":password",$this->password);
            return $stmt->execute();
        }
        function delete(){
            //fazer inner join com a tabela de usuario_sensores
            $query = "delete from $this->table_name where id_usuario = :user_id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":user_id",$this->user_id);
            return $stmt->execute();
        }
    }
?>