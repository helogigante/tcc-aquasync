<?php
    class Verifica {
        private $conn;
        private $table_name = "leituras";
        private $zero = 0;
    
        public $sensor, $report, $ex_daily, $ex_monthly, $sus_24h, $sus_closed;

        public function __construct($db) {
            $this->conn = $db;
            $this->ex_daily = false;
            $this->ex_monthly = false;
            $this->sus_closed = false;
            $this->sus_24h = false;
        }

        function verificar(){
            $status = array();

            //ultrapassar a média de consumo diário dos últimos 10 dias a partir de 10%
            $query = "SELECT 
                        (SELECT AVG(m) AS average_consumption
                            FROM (
                                SELECT SUM(valor_leitura) AS m
                                FROM $this->table_name 
                                WHERE id_sensor = :sensor
                                AND DATE(dt_hr_leitura) BETWEEN DATE_SUB(CURDATE(), INTERVAL 11 DAY) 
                                                            AND DATE_SUB(CURDATE(), INTERVAL 1 DAY)
                                GROUP BY DATE(dt_hr_leitura)
                            ) AS ds
                        ) AS previous_days,
                        (SELECT SUM(valor_leitura) 
                        FROM $this->table_name 
                        WHERE id_sensor = :sensor AND DATE(dt_hr_leitura) = CURDATE()
                        ) AS actual_day;";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":sensor", $this->sensor);
            $stmt->execute();

            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if($row !== null && $row['previous_days'] !== null && $row['actual_day'] !== null) {//CONFERIR SE É NULL NOS DOIS ULTIMOS PARAMETROS
                $previous_days = (float)$row['previous_days'];
                $actual_day = (float)$row['actual_day'];
                
                if($previous_days > 0 && $actual_day * 1.1 > $previous_days) {
                    $this->ex_daily = true;
                }
            }
            //ultrapassar o consumo total do mês anterior em 18 dias ou menos
            if(number_format(date("d")) < 18){
                $query = "SELECT 
                            (SELECT SUM(valor_leitura) 
                            FROM $this->table_name 
                            WHERE id_sensor = :sensor
                                AND YEAR(dt_hr_leitura) = YEAR(CURRENT_DATE - INTERVAL 1 MONTH)
                                AND MONTH(dt_hr_leitura) = MONTH(CURRENT_DATE - INTERVAL 1 MONTH)
                            ) AS lastmonth,
                            (SELECT SUM(valor_leitura) 
                            FROM $this->table_name  
                            WHERE id_sensor = :sensor
                                AND MONTH(dt_hr_leitura) = month(NOW())
                            ) AS actualmonth;";

                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(":sensor", $this->sensor);
                $stmt->execute();

                $row = $stmt->fetch(PDO::FETCH_ASSOC);

                if($row !== null && $row['lastmonth'] !== null && $row['actualmonth'] !== null) {//CONFERIR SE É NULL NOS DOIS ULTIMOS PARAMETROS
                    $this->ex_monthly = ((float)$row['actualmonth'] > (float)$row['lastmonth']);
                }
            }
            
            //O registro (tubulação) estiver marcado como “fechado”
            $query = "SELECT valor_leitura
                        FROM $this->table_name AS l
                        JOIN sensor as s ON s.id_sensor = l.id_sensor
                        WHERE l.id_sensor = :sensor 
                        AND estado_registro = $this->zero
                        AND valor_leitura <> $this->zero
                        AND dt_hr_leitura - second(dt_hr_leitura) = NOW() - second(NOW());";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":sensor", $this->sensor);

            $stmt->execute();

            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            $this->sus_closed = ($row !== false);
            
            //Houver vazão ininterrupta por mais de 24 horas 
            $query = "SELECT 
                        CASE WHEN COUNT(*) > 0 THEN TRUE ELSE FALSE END as sus_24h
                        FROM $this->table_name
                        WHERE id_sensor = :sensor 
                            AND dt_hr_leitura >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
                            AND valor_leitura = $this->zero;";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":sensor", $this->sensor);

            $stmt->execute();

            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $v = $row['sus_24h'];
            $this->sus_24h = ($v == 0);

            return !in_array(false, $status);     
        }
    }
?>