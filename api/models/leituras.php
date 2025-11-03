<?php
    class Leitura {
        private $conn;
        private $table_name = "leituras";
    
        public $sensor, $period, $day, $month, $year, $date,
               $average_consumption, $total_consumption, $estimated_cost,
               $report = array(
                    "average_consumption" => "",
                    "total_consumption" => "",
                    "estimated_cost" => "",
                    "last_record" => array("time" => "", "value" => ""),
                    "highest_consumption" => array("time" => "", "value" => ""),
                    "lowest_consumption" => array("time" => "", "value" => ""),
                    "timely_consumption" => array()
                );

        public function __construct($db) {
            $this->conn = $db;
        }

        function readActualDay(){
            $status = array(true);

            // consumo total
            $query = "SELECT round(SUM(valor_leitura), 2) AS total_consumption 
                        FROM $this->table_name
                        WHERE id_sensor = :sensor AND DATE(dt_hr_leitura) = CURRENT_DATE;";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":sensor", $this->sensor);
            $stmt->execute();

            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if($row && $row['total_consumption'] !== null) {
                $this->report["total_consumption"] = strval(number_format($row['total_consumption'], 2, ',', '.'));
                $status[] = true;
            } else {
                $status[] = false;
            }

            // consumo total de cada hora
            $query = "SELECT HOUR(dt_hr_leitura) AS 'time', SUM(valor_leitura) AS 'value'
                        FROM $this->table_name
                        WHERE id_sensor = :sensor AND DATE(dt_hr_leitura) = CURRENT_DATE
                        GROUP BY HOUR(dt_hr_leitura);";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":sensor", $this->sensor);
            $stmt->execute();

            $this->report["timely_consumption"] = array();
            $hourlyStatus = true;

            while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                if($row['time'] !== null) {
                    $this->report["timely_consumption"][] = [
                        "time" => $row['time'],
                        "value" => number_format($row['value'], 2, ',', '.')
                    ];
                } else {
                    $hourlyStatus = false;
                    break;
                }
            }
            $status[] = $hourlyStatus;

            // custo total
            $query = "SELECT (SUM(l.valor_leitura) * s.valor_fatura) AS estimated_cost
                FROM $this->table_name AS l
                INNER JOIN sensor AS s ON l.id_sensor = s.id_sensor
                WHERE l.id_sensor = :sensor AND DATE(l.dt_hr_leitura) = CURRENT_DATE;";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":sensor", $this->sensor);
            $stmt->execute();

            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if($row && $row['estimated_cost'] !== null) {
                $this->report["estimated_cost"] = strval(number_format($row['estimated_cost'], 2, ',', '.'));
                $status[] = true;
            } else {
                $status[] = false;
            }

            // média de consumo
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

            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if($row && $row['average_consumption'] !== null) {
                $this->report["average_consumption"] = strval(number_format($row['average_consumption'], 2, ',', '.'));
                $status[] = true;
            } else {
                $status[] = false;
            }

            // vazão mais recente
            $query = "SELECT time(dt_hr_leitura) AS 'time', valor_leitura AS 'value'
                        FROM $this->table_name 
                        WHERE id_sensor = :sensor and DATE(dt_hr_leitura) = CURRENT_DATE 
                        ORDER BY dt_hr_leitura DESC LIMIT 1;";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":sensor", $this->sensor);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if($row) {
                $this->report["last_record"]["time"] = $row['time'];
                $this->report["last_record"]["value"] = strval(number_format($row['value'], 2, ',', '.'));
                $status[] = true;
            } else {
                $status[] = false;
            }

            // maior vazão
            $query = "SELECT time(dt_hr_leitura) AS 'time', valor_leitura AS 'value'
                        FROM $this->table_name 
                        WHERE id_sensor = :sensor and DATE(dt_hr_leitura) = CURRENT_DATE 
                        ORDER BY valor_leitura desc LIMIT 1;";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":sensor", $this->sensor);
            $stmt->execute();

            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if($row) {
                $this->report["highest_consumption"]["time"] = $row['time'];
                $this->report["highest_consumption"]["value"] = strval(number_format($row['value'], 2, ',', '.'));
                $status[] = true;
            } else {
                $status[] = false;
            }

            // menor vazão
            $query = "SELECT time(dt_hr_leitura) AS 'time', valor_leitura AS 'value'
                        FROM $this->table_name 
                        WHERE id_sensor = :sensor AND DATE(dt_hr_leitura) = CURRENT_DATE 
                        ORDER BY valor_leitura LIMIT 1;";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":sensor", $this->sensor);
            $stmt->execute();
            
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if($row) {
                $this->report["lowest_consumption"]["time"] = $row['time'];
                $this->report["lowest_consumption"]["value"] = strval(number_format($row['value'], 2, ',', '.'));
                $status[] = true;
            } else {
                $status[] = false;
            }

            return !in_array(false, $status);          
        }
        

        function readDay(){
            $status = array(true);

            //consumo total
            $query = "SELECT round(SUM(valor_leitura), 2) AS total_consumption 
                        FROM $this->table_name 
                        WHERE id_sensor = :sensor AND DATE(dt_hr_leitura) = :l_date;";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":sensor", $this->sensor);
            $stmt->bindParam(":l_date", $this->date);
            $stmt->execute();

            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if($row && $row['total_consumption'] !== null) {
                $this->report["total_consumption"] = strval(number_format($row['total_consumption'], 2, ',', '.'));
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
            
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if($row && $row['average_consumption'] !== null) {
                $this->report["average_consumption"] = strval(number_format($row['average_consumption'], 2, ',', '.'));
                $status[] = true;
            } else {
                $status[] = false;
            }
            
            //custo total estimado
            $query = "SELECT (SUM(l.valor_leitura) * s.valor_fatura) AS estimated_cost
                        FROM $this->table_name AS l
                        INNER JOIN sensor AS s ON l.id_sensor = s.id_sensor
                        WHERE l.id_sensor = :sensor AND DATE(l.dt_hr_leitura) = :l_date;";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":sensor", $this->sensor);
            $stmt->bindParam(":l_date", $this->date);
            $stmt->execute();

            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if($row && $row['estimated_cost'] !== null) {
                $this->report["estimated_cost"] = strval(number_format($row['estimated_cost'], 2, ',', '.'));
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

            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if($row) {
                $this->report["highest_consumption"]["time"] = $row['time'];
                $this->report["highest_consumption"]["value"] = strval(number_format($row['value'], 2, ',', '.'));
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

            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if($row) {
                $this->report["lowest_consumption"]["time"] = $row['time'];
                $this->report["lowest_consumption"]["value"] = strval(number_format($row['value'], 2, ',', '.'));
                $status[] = true;
            } else {
                $status[] = false;
            }

            // último registro
            $query = "SELECT time(dt_hr_leitura) AS 'time', valor_leitura AS 'value'
                    FROM $this->table_name 
                    WHERE id_sensor = :sensor AND DATE(dt_hr_leitura) = :l_date
                    ORDER BY dt_hr_leitura DESC LIMIT 1;";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":sensor", $this->sensor);
            $stmt->bindParam(":l_date", $this->date);
            $stmt->execute();

            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if($row) {
                $this->report["last_record"]["time"] = $row['time'];
                $this->report["last_record"]["value"] = strval(number_format($row['value'], 2, ',', '.'));
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
                        
            $this->report["timely_consumption"] = array();
            $hourlyStatus = true;

            while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                if($row['time'] !== null) {
                    $this->report["timely_consumption"][] = [
                        "time" => $row['time'],
                        "value" => number_format($row['value'], 2, ',', '.')
                    ];
                } else {
                    $hourlyStatus = false;
                    break;
                }       
            }  
            $status[] = $hourlyStatus;

            $allSuccess = true;
            foreach ($status as $response) {
                if (!$response) {
                    $allSuccess = false;
                    break;
                }
            }
            return $allSuccess;
        }

        function readMonth(){

            $status = array(true);

            //consumo total
            $query = "SELECT round(SUM(valor_leitura), 2) AS total_consumption 
                        FROM $this->table_name 
                        WHERE id_sensor = :sensor AND MONTH(dt_hr_leitura) = :l_month AND YEAR(dt_hr_leitura) = :l_year;";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":sensor",$this->sensor);
            $stmt->bindParam(":l_month",$this->month);
            $stmt->bindParam(":l_year",$this->year);
            $stmt->execute();

            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if($row && $row['total_consumption'] !== null) {
                $this->report["total_consumption"] = strval(number_format($row['total_consumption'], 2, ',', '.'));
                $status[] = true;
            } else {
                $status[] = false;
            }
            
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

            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if($row && $row['average_consumption'] !== null) {
                $this->report["average_consumption"] = strval(number_format($row['average_consumption'], 2, ',', '.'));
                $status[] = true;
            } else {
                $status[] = false;
            }
            //custo total estimado
            $query = "SELECT (SUM(l.valor_leitura) * s.valor_fatura) AS estimated_cost 
                FROM $this->table_name AS l
                INNER JOIN sensor AS s ON l.id_sensor = s.id_sensor
                WHERE l.id_sensor = :sensor AND MONTH(l.dt_hr_leitura) = :l_month AND YEAR(l.dt_hr_leitura) = :l_year;";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":sensor",$this->sensor);
            $stmt->bindParam(":l_month",$this->month);
            $stmt->bindParam(":l_year",$this->year);
            $stmt->execute();

            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if($row && $row['estimated_cost'] !== null) {
                $this->report["estimated_cost"] = strval(number_format($row['estimated_cost'], 2, ',', '.'));
                $status[] = true;
            } else {
                $status[] = false;
            }

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

            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if($row) {
                $this->report["highest_consumption"]["time"] = $row['time'];
                $this->report["highest_consumption"]["value"] = strval(number_format($row['value'], 2, ',', '.'));
                $status[] = true;
            } else {
                $status[] = false;
            }
            
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

            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if($row) {
                $this->report["lowest_consumption"]["time"] = $row['time'];
                $this->report["lowest_consumption"]["value"] = strval(number_format($row['value'], 2, ',', '.'));
                $status[] = true;
            } else {
                $status[] = false;
            }
            
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

            $this->report["timely_consumption"] = array();
            $hourlyStatus = true;

            while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                if($row['time'] !== null) {
                    $this->report["timely_consumption"][] = [
                        "time" => $row['time'],
                        "value" => number_format($row['value'], 2, ',', '.')
                    ];
                } else {
                    $hourlyStatus = false;
                    break;
                }       
            }  
            $status[] = $hourlyStatus;

            $allSuccess = true;
            foreach ($status as $response) {
                if(!$response) $allSuccess = false;
                break;
            }
            return $allSuccess;
        }

        function readYear(){

            $status = array(true);

            //consumo total
            $query = "SELECT round(SUM(valor_leitura), 2) AS total_consumption 
                        FROM $this->table_name 
                        WHERE id_sensor = :sensor AND YEAR(dt_hr_leitura) = :l_year;";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":sensor",$this->sensor);
            $stmt->bindParam(":l_year",$this->year);
            $stmt->execute();

            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if($row && $row['total_consumption'] !== null) {
                $this->report["total_consumption"] = strval(number_format($row['total_consumption'], 2, ',', '.'));
                $status[] = true;
            } else {
                $status[] = false;
            }
            
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

            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if($row && $row['average_consumption'] !== null) {
                $this->report["average_consumption"] = strval(number_format($row['average_consumption'], 2, ',', '.'));
                $status[] = true;
            } else {
                $status[] = false;
            }
            
            //custo total estimado
            $query = "SELECT (sum(valor_leitura) * valor_fatura) AS estimated_cost 
                        FROM $this->table_name 
                        INNER JOIN sensor AS s ON l.id_sensor = s.id_sensor
                        WHERE $this->table_name.id_sensor = :sensor AND YEAR(dt_hr_leitura) = :l_year;";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":sensor",$this->sensor);
            $stmt->bindParam(":l_year",$this->year);
            $stmt->execute();

            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if($row && $row['estimated_cost'] !== null) {
                $this->report["estimated_cost"] = strval(number_format($row['estimated_cost'], 2, ',', '.'));
                $status[] = true;
            } else {
                $status[] = false;
            }

            //maior vazão
            $query = "SELECT DATE(dt_hr_leitura) AS 'time', valor_leitura AS 'value'
                        FROM $this->table_name 
                        WHERE id_sensor = :sensor AND YEAR(dt_hr_leitura) = :l_year
                        ORDER BY valor_leitura desc LIMIT 1;";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":sensor",$this->sensor);
            $stmt->bindParam(":l_year",$this->year);
            $stmt->execute();

            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if($row) {
                $this->report["highest_consumption"]["time"] = $row['time'];
                $this->report["highest_consumption"]["value"] = strval(number_format($row['value'], 2, ',', '.'));
                $status[] = true;
            } else {
                $status[] = false;
            }

            //menor vazão
            $query = "SELECT date(dt_hr_leitura) AS 'time', valor_leitura AS 'value'
                        FROM $this->table_name
                        WHERE id_sensor = :sensor AND YEAR(dt_hr_leitura) = :l_year
                        ORDER BY valor_leitura LIMIT 1;";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":sensor",$this->sensor);
            $stmt->bindParam(":l_year",$this->year);
            $stmt->execute();
            
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if($row) {
                $this->report["lowest_consumption"]["time"] = $row['time'];
                $this->report["lowest_consumption"]["value"] = strval(number_format($row['value'], 2, ',', '.'));
                $status[] = true;
            } else {
                $status[] = false;
            }
            
            //consumo total de cada mes
            $query = "SELECT MONTH(dt_hr_leitura) AS 'time', SUM(valor_leitura) AS 'value'
                        FROM $this->table_name 
                        WHERE id_sensor = :sensor AND YEAR(dt_hr_leitura) = :l_year 
                        GROUP BY MONTH(dt_hr_leitura);";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":sensor",$this->sensor);
            $stmt->bindParam(":l_year",$this->year);
            $stmt->execute();

            $this->report["timely_consumption"] = array();
            $hourlyStatus = true;

            while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                if($row['time'] !== null) {
                    $this->report["timely_consumption"][] = [
                        "time" => $row['time'],
                        "value" => number_format($row['value'], 2, ',', '.')
                    ];
                } else {
                    $hourlyStatus = false;
                    break;
                }       
            }  
            $status[] = $hourlyStatus;

            $allSuccess = true;
            foreach ($status as $response) {
                if(!$response) $allSuccess = false;
                break;
            }
            return $allSuccess;
        }
    }
?>