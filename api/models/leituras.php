<?php
    class Leitura() {
        private $conn;
        private $table_name = "leituras";
        
        public $sensor, $period, $day, $month, $year, $status = array(true),
               $average_consumption, $total_consumption, $estiamted_cost, $last_record = ["time"=>"", "value"=>0], $highest_consumption = ["time"=>"", "value"=>"0,00"], $lowest_consumption = ["time"=>"", "value"=>""], $timely_consumption = ["time"=>"", "value"=> ""];
    
        public function __construct($db) {
            $this->conn = $db;
        }

        function readActualDay(){

            //consumo total
            $query = "SELECT round(SUM(valor_leitura), 2) AS total_consumption 
                        FROM $this->table_name
                        WHERE id_sensor = :sensor AND DATE(dt_hr_leitura) = CURRENT_DATE;";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":sensor", $this->sensor);
            $stmt->execute();

            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if($row) {
                $this->total_consumption = $row['total_consumption'];
                $status[] = true;
            } else {
                $status[] = false;
            }

            //custo estimado
            $query = "SELECT (sum(valor_leitura) * valor_fatura) AS estimated_cost
                        FROM $this->table_name 
                        INNER JOIN sensor ON $this->table_name.id_sensor = sensor.id_sensor 
                        WHERE $this->table_name.id_sensor = :sensor AND DATE(dt_hr_leitura) = CURRENT_DATE;";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":sensor", $this->sensor);
            $stmt->execute();

            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if($row) {
                $this->estimated_cost = $row['estimated_cost'];
                $status[] = true;
            } else {
                $status[] = false;
            }

            //média de consumo
            $query = "SELECT AVG(avg_c) AS average_consumption 
                        FROM (
                            SELECT round(AVG(valor_leitura), 2) AS avg_c
                            FROM $this->table_name 
                            WHERE id_sensor = :sensor and date(dt_hr_leitura) = CURRENT_DATE 
                            GROUP BY HOUR(dt_hr_leitura)
                        ) AS media;";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":sensor", $this->sensor);
            $stmt->execute();

            if($row) {
                $this->average_consumption = $row['average_consumption'];
                $status[] = true;
            } else {
                $status[] = false;
            }

            //vazão mais recente
            $query = "SELECT time(dt_hr_leitura) AS 'time', valor_leitura AS 'value'
                        FROM $this->table_name 
                        WHERE id_sensor = :sensor and DATE(dt_hr_leitura) = CURRENT_DATE 
                        ORDER BY dt_hr_leitura LIMIT 1;";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":sensor", $this->sensor);
            $stmt->execute();

            if($row) {
                $this->last_record["time"] = $row['time'];
                $this->last_record["value"] = $row['value'];
                $status[] = true;
            } else {
                $status[] = false;
            }

            //maior vazão
            $query = "SELECT time(dt_hr_leitura) AS 'time', valor_leitura AS 'value'
                        FROM $this->table_name 
                        WHERE id_sensor = :sensor and DATE(dt_hr_leitura) = CURRENT_DATE 
                        ORDER BY valor_leitura desc LIMIT 1;";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":sensor", $this->sensor);
            $stmt->execute();

            if($row) {
                $this->highest_consumption["time"] = $row['time'];
                $this->highest_consumption["value"] = $row['value'];
                $status[] = true;
            } else {
                $status[] = false;
            }

            //menor vazão
            $query = "SELECT time(dt_hr_leitura) AS 'time', valor_leitura AS 'value'
                        FROM $this->table_name 
                        WHERE id_sensor = :sensor AND DATE(dt_hr_leitura) = CURRENT_DATE 
                        ORDER BY valor_leitura LIMIT 1;";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":sensor", $this->sensor);
            $stmt->execute();

            if($row) {
                $this->lowest_consumption["time"] = $row['time'];
                $this->lowest_consumption["value"] = $row['value'];
                $status[] = true;
            } else {
                $status[] = false;
            }

            foreach ($status as $response) {
                if(!$response) $status[0] = false;
            }
            return $status[0];
        }

        function readDay(){

            $date = sprintf('%04d-%02d-%02d', $this->year, $this->month, $this->day);

            //consumo total
            $query = "SELECT round(SUM(valor_leitura), 2) AS total_consumption 
                        FROM $this->table_name 
                        WHERE id_sensor = :sensor AND DATE(dt_hr_leitura) = :l_date;";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":sensor", $this->sensor);
            $stmt->bindParam(":l_date", $this->date);
            $stmt->execute();

            if($row) {
                $this->total_consumption = $row['total_consumption'];
                $status[] = true;
            } else {
                $status[] = false;
            }

            //média por hora
            $query = "SELECT AVG(avg_c) AS average_consumption 
                        FROM (SELECT round(AVG(valor_leitura), 2) AS avg_c 
                            FROM $this->table_name 
                            WHERE id_sensor = :sensor and date(dt_hr_leitura) = :l_date 
                            GROUP BY HOUR(dt_hr_leitura)
                        ) AS media;";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":sensor", $this->sensor);
            $stmt->bindParam(":l_date", $this->date);
            $stmt->execute();

            if($row) {
                $this->average_consumption = $row['average_consumption'];
                $status[] = true;
            } else {
                $status[] = false;
            }
            
            //custo total estimado
            $query = "SELECT (sum(valor_leitura) * valor_fatura) AS estimated_cost 
                        FROM $this->table_name 
                        INNER JOIN sensor ON $this->table_name.id_sensor = sensor.id_sensor 
                        WHERE $this->table_name.id_sensor = :sensor AND DATE(dt_hr_leitura) = :l_date;";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":sensor", $this->sensor);
            $stmt->bindParam(":l_date", $this->date);
            $stmt->execute();

            if($row) {
                $this->estimated_cost = $row['estimated_cost'];
                $status[] = true;
            } else {
                $status[] = false;
            }

            //maior vazão
            $query = "SELECT time(dt_hr_leitura) AS 'time', valor_leitura AS 'value'
                        FROM $this->table_name 
                        WHERE id_sensor = :sensor and DATE(dt_hr_leitura) = :l_date 
                        ORDER BY valor_leitura desc LIMIT 1;";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":sensor", $this->sensor);
            $stmt->bindParam(":l_date", $this->date);
            $stmt->execute();

            if($row) {
                $this->highest_consumption["time"] = $row['time'];
                $this->highest_consumption["value"] = $row['value'];
                $status[] = true;
            } else {
                $status[] = false;
            }
            
            //menor vazão
            $query = "SELECT time(dt_hr_leitura) AS 'time', valor_leitura AS 'value'
                        FROM $this->table_name 
                        WHERE id_sensor = :sensor AND DATE(dt_hr_leitura) = :l_date
                        ORDER BY valor_leitura LIMIT 1;";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":sensor", $this->sensor);
            $stmt->bindParam(":l_date", $this->date);
            $stmt->execute();

            if($row) {
                $this->lowest_consumption["time"] = $row['time'];
                $this->lowest_consumption["value"] = $row['value'];
                $status[] = true;
            } else {
                $status[] = false;
            }
            
            //consumo total de cada hora
            $query = "SELECT HOUR(dt_hr_leitura) AS 'time', SUM(valor_leitura) AS 'value'
                        FROM $this->table_name 
                        WHERE id_sensor = :sensor AND DATE(dt_hr_leitura) = :l_date
                        GROUP BY HOUR(dt_hr_leitura);";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":sensor", $this->sensor);
            $stmt->bindParam(":l_date", $this->date);
            $stmt->execute();

            while($row){
                $this->lowest_consumption["time"] = $row['time'];
                $this->lowest_consumption["value"] = $row['value'];
            }

            foreach ($status as $response) {
                if(!$response) $status[0] = false;
            }
            return $status[0];
            /*
            $usuarios = [
                ["nome" => "Alice", "idade" => 25],
                ["nome" => "Bruno", "idade" => 32]
            ];
        echo $usuarios[1]["nome"]; 
        */
            
        }

        function readMonth(){

            $stmt->bindParam(":sensor",$this->sensor);
            $stmt->bindParam(":l_month",$this->month);
            $stmt->bindParam(":l_year",$this->year);


            //consumo total
            $query = "SELECT round(SUM(valor_leitura), 2) AS total_consumption 
                        FROM $this->table_name 
                        WHERE id_sensor = :sensor AND MONTH(dt_hr_leitura) = :l_month AND YEAR(dt_hr_leitura) = :l_year;";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":sensor",$this->sensor);
            $stmt->bindParam(":l_month",$this->month);
            $stmt->bindParam(":l_year",$this->year);
            $stmt->execute();
            
            //média por dia
            $query = "SELECT AVG(avg_c) AS average_consumption 
                        FROM (
                            SELECT round(AVG(valor_leitura), 2) AS avg_c 
                                FROM $this->table_name 
                                WHERE id_sensor = :sensor AND MONTH(dt_hr_leitura) = :l_month AND YEAR(dt_hr_leitura) = :l_year
                                GROUP BY DAY(dt_hr_leitura)
                            ) AS media;";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":sensor",$this->sensor);
            $stmt->bindParam(":l_month",$this->month);
            $stmt->bindParam(":l_year",$this->year);
            $stmt->execute();

            //custo total estimado
            $query = "SELECT (sum(valor_leitura) * valor_fatura) AS estimated_cost 
                        FROM $this->table_name 
                        INNER JOIN sensor ON $this->table_name.id_sensor = sensor.id_sensor 
                        WHERE $this->table_name.id_sensor = :sensor AND MONTH(dt_hr_leitura) = :l_month AND YEAR(dt_hr_leitura) = :l_year;";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":sensor",$this->sensor);
            $stmt->bindParam(":l_month",$this->month);
            $stmt->bindParam(":l_year",$this->year);
            $stmt->execute();

            //maior vazão
            $query = "SELECT DATE(dt_hr_leitura) AS 'time', valor_leitura AS 'value'
                        FROM $this->table_name 
                        WHERE id_sensor = :sensor AND MONTH(dt_hr_leitura) = :l_month AND YEAR(dt_hr_leitura) = :l_year
                        ORDER BY valor_leitura desc LIMIT 1;";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":sensor",$this->sensor);
            $stmt->bindParam(":l_month",$this->month);
            $stmt->bindParam(":l_year",$this->year);
            $stmt->execute();
            
            //menor vazão
            $query = "SELECT date(dt_hr_leitura) AS 'time', valor_leitura AS 'value'
                        FROM $this->table_name 
                        WHERE id_sensor = :sensor AND MONTH(dt_hr_leitura) = :l_month AND YEAR(dt_hr_leitura) = :l_year
                        ORDER BY valor_leitura LIMIT 1;";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":sensor",$this->sensor);
            $stmt->bindParam(":l_month",$this->month);
            $stmt->bindParam(":l_year",$this->year);
            $stmt->execute();
            
            //consumo total de cada dia
            $query = "SELECT DAY(dt_hr_leitura) AS 'time', SUM(valor_leitura) AS 'value'
                        FROM $this->table_name 
                        WHERE id_sensor = :sensor AND MONTH(dt_hr_leitura) = :l_month AND YEAR(dt_hr_leitura) = :l_year
                        GROUP BY DAY(dt_hr_leitura);";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":sensor",$this->sensor);
            $stmt->bindParam(":l_month",$this->month);
            $stmt->bindParam(":l_year",$this->year);
            $stmt->execute();
            
        }
        function readYear(){
            //consumo total
            $query = "SELECT round(SUM(valor_leitura), 2) AS total_consumption 
                        FROM $this->table_name 
                        WHERE id_sensor = :sensor AND YEAR(dt_hr_leitura) = :l_year;";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":sensor",$this->sensor);
            $stmt->bindParam(":l_year",$this->year);
            $stmt->execute();
            
            //média por mes
            $query = "SELECT AVG(avg_c) AS average_consumption 
                        FROM (
                            SELECT round(AVG(valor_leitura), 2) AS avg_c 
                                FROM $this->table_name 
                                WHERE id_sensor = :sensor AND YEAR(dt_hr_leitura) = :l_year 
                                GROUP BY MONTH(dt_hr_leitura)
                            ) AS media;";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":sensor",$this->sensor);
            $stmt->bindParam(":l_year",$this->year);
            $stmt->execute();
            
            //custo total estimado
            $query = "SELECT (sum(valor_leitura) * valor_fatura) AS estimated_cost 
                        FROM $this->table_name 
                        INNER JOIN sensor ON $this->table_name.id_sensor = sensor.id_sensor 
                        WHERE $this->table_name.id_sensor = :sensor AND YEAR(dt_hr_leitura) = :l_year;";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":sensor",$this->sensor);
            $stmt->bindParam(":l_year",$this->year);
            $stmt->execute();

            //maior vazão
            $query = "SELECT DATE(dt_hr_leitura) AS 'time', valor_leitura AS 'value'
                        FROM $this->table_name 
                        WHERE id_sensor = :sensor AND YEAR(dt_hr_leitura) = :l_year
                        ORDER BY valor_leitura desc LIMIT 1;";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":sensor",$this->sensor);
            $stmt->bindParam(":l_year",$this->year);
            $stmt->execute();

            //menor vazão
            $query = "SELECT date(dt_hr_leitura) AS 'time', valor_leitura AS 'value'
                        FROM $this->table_name 
                        WHERE id_sensor = :sensor AND YEAR(dt_hr_leitura) = :l_year
                        ORDER BY valor_leitura LIMIT 1;";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":sensor",$this->sensor);
            $stmt->bindParam(":l_year",$this->year);
            $stmt->execute();
            
            //consumo total de cada mes
            $query = "SELECT MONTH(dt_hr_leitura) AS 'time', SUM(valor_leitura) AS 'value'
                        FROM $this->table_name 
                        WHERE id_sensor = :sensor AND YEAR(dt_hr_leitura) = :l_year 
                        GROUP BY MONTH(dt_hr_leitura);";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":sensor",$this->sensor);
            $stmt->bindParam(":l_year",$this->year);
            $stmt->execute();
        }
    }
?>