<?php
    class Usuario {
        private $conn;
        private $table_name = "usuario";
        
        public $user_id, $name, $email, $phone, $password;

        public function __construct($db) {
            $this->conn = $db;
        }
        function read(){
            $query = "SELECT id_usuario, email, nome, telefone, senha from $this->table_name where id_usuario = :user_id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":user_id",$this->user_id);
            return $stmt->execute();
        }
        function create(){
            $query = "insert into $this->table_nome (id_usuario, email, nome, telefone, senha) values
            (:user_id, ':email', ':nome', ':telefone', ':senha')";
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
            $query ="update $this->table_name set email = ':email', nome = ':nome', telefone = ':telefone', senha = ':senha' where id_usuario = :user_id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":user_id",$this->user_id);
            $stmt->bindParam(":email",$this->email);
            $stmt->bindParam(":nome",$this->nome);
            $stmt->bindParam(":telefone",$this->telefone);
            $stmt->bindParam(":senha",$this->senha);
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