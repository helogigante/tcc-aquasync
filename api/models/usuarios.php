<?php
    class Usuario {
        private $conn;
        private $table_name = "usuario";
        public $user_id, $name, $email, $phone, $password;

        public function __construct($db) {
            $this->conn = $db;
        }

        // aqui vai pegar o id anterior no banco e adicionar +1
        function getNextUserId() {
            $query = "SELECT MAX(id_usuario) as max_id FROM $this->table_name";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            return $row['max_id'] + 1;
        }

        function read(){          
            $query = "SELECT id_usuario, email, nome, telefone from $this->table_name where id_usuario = :user_id";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":user_id",$this->user_id);
            $stmt->execute();

            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if($row) {
                $this->user_id = $row['id_usuario'];
                $this->email = $row['email'];
                $this->name = $row['nome'];
                $this->phone = $row['telefone'];
                return true;
            } else {
                return false;
            }
        }
        
        function create(){            
            $this->user_id = $this->getNextUserId();
            
            $query = "INSERT INTO $this->table_name (id_usuario, email, nome, telefone, senha) VALUES
            (:user_id, :email, :name, :phone, :password)";
            
            $stmt = $this->conn->prepare($query);
            //$this->senha = password_hash($this->senha, PASSWORD_BCRYPT);
            $stmt->bindParam(":user_id", $this->user_id);
            $stmt->bindParam(":email", $this->email);
            $stmt->bindParam(":name", $this->name);
            $stmt->bindParam(":phone", $this->phone);
            $stmt->bindParam(":password", $this->password);
            
            if ($stmt->execute()) {
                return true;
            } else {
                return false;
            }
        }
        
        function update(){
            $query ="UPDATE $this->table_name SET email = :email, nome = :name, telefone = :phone, senha = :password WHERE id_usuario = :user_id";
            
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
            $query = "DELETE FROM $this->table_name WHERE id_usuario = :user_id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":user_id",$this->user_id);
            return $stmt->execute();
        }

        function login($login, $senha) {
            $query = "SELECT id_usuario, email, nome, telefone, senha FROM $this->table_name WHERE email = :login OR nome = :login LIMIT 1";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":login", $login);
            $stmt->execute();

            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($row && trim($row['senha']) === trim($senha)) { 
                $this->user_id = $row['id_usuario'];
                $this->email = $row['email'];
                $this->name = $row['nome'];
                $this->phone = $row['telefone'];
                return true;
            }
            return false;
        }
    }
?>