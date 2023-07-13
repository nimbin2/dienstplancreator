<?php

class Roster_changes
{
	private $data_id;
	private $yearweek;
	private $day_id;
	private $start;
	private $end;
	private $amount;
	/* Constructor */
	public function __construct() {
		$this->data_id = NULL;
		$this->yearweek = NULL;
		$this->day_id = NULL;
		$this->start = NULL;
		$this->end = NULL;
		$this->amount = NULL;
	}
	
	/* Destructor */
	public function __destruct() { }

    public function getWhereYearweek(int $data_id, string $yearweek) {
        global $pdo;
		$data_id    = trim($data_id);
		$yearweek	= trim($yearweek);
        $query          = 'SELECT * FROM datadienstplandb.roster_changes WHERE data_id = :data_id AND yearweek = :yearweek';
        $values         = array(':data_id' => $data_id, ':yearweek' => $yearweek);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        }
        catch (PDOException $e) {
            throw new Exception('Database query error roster_changes_class.php');
        }
        $roster_changes=array();
        $roster_changes["roster_changes"]=array();
        while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
            $amount = explode(',', $amount);
            $amount = array_map('floatval', $amount);
            $roster_changes_item=array(
                "yearweek"   => (string)$yearweek,
                "day_id"     => (int)$day_id,
                "start" 	 => (float)$start,
                "end" 		 => (float)$end,
                "amount"     => $amount
            );
            array_push($roster_changes["roster_changes"], $roster_changes_item);
        }
        return $roster_changes;
    }
    public function getWhereYearweekDay(int $data_id, string $yearweek, int $day_id) {
        global $pdo;
		$data_id    = trim($data_id);
		$yearweek	= trim($yearweek);
		$day_id 	= trim($day_id);
        $query          = 'SELECT * FROM datadienstplandb.roster_changes WHERE data_id = :data_id AND yearweek = :yearweek AND day_id = :day_id';
        $values         = array(':data_id' => $data_id, ':yearweek' => $yearweek, ':day_id' => $day_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        }
        catch (PDOException $e) {
            throw new Exception('Database query error roster_changes_class.php');
        }
        return $res->fetch(PDO::FETCH_ASSOC);
    }
    public function getWhereYearweekLeDay(int $data_id, string $yearweek, int $day_id) {
        global $pdo;
		$data_id    = trim($data_id);
		$yearweek	= trim($yearweek);
		$day_id 	= trim($day_id);
        $query      = 'SELECT * FROM datadienstplandb.roster_changes WHERE data_id = :data_id AND yearweek <= :yearweek AND day_id = :day_id ORDER BY yearweek DESC';
        $values     = array(':data_id' => $data_id, ':yearweek' => $yearweek, ':day_id' => $day_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        }
        catch (PDOException $e) {
            throw new Exception('Database query error roster_changes_class.php');
        }
        $row = $res->fetch(PDO::FETCH_ASSOC);
        extract($row);
        return array(
            "yearweek"   => (string)$yearweek,
            "day_id"     => (int)$day_id,
            "start" 	 => (float)$start,
            "end" 		 => (float)$end,
            "amount"     => explode(',', $amount)
        );
    }
    public function update(int $data_id, string $yearweek, int $day_id, float $start, float $end, string $amount) {
        global $pdo;
        $data_id    = trim($data_id);
        $yearweek   = trim($yearweek);
        $day_id     = trim($day_id);
        $start	    = trim($start);
        $end	    = trim($end);
        $amount	    = trim($amount);
		$query = 'INSERT INTO datadienstplandb.roster_changes (data_id, yearweek, day_id, start, end, amount) VALUES (:data_id, :yearweek, :day_id, :start, :end, :amount) ON DUPLICATE KEY UPDATE start = :start, end = :end, amount = :amount';

        $values = array(':data_id' => $data_id, ':yearweek' => $yearweek, ':day_id' => $day_id, ':start' => $start, ':end' => $end, ':amount' => $amount);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error roster_changes_class.php');
        }
    }   
	public function remove(int $data_id, string $yearweek) {
        global $pdo;

        $data_id   = trim($data_id);
        $yearweek  = trim($yearweek);
        $query     = "DELETE FROM datadienstplandb.roster_changes WHERE data_id = :data_id AND yearweek = :yearweek";
        $values = array(':data_id' => $data_id, ':yearweek' => $yearweek);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error roster_changes_class.php');
        }
    }
    public function removeWhereDataId(int $data_id) {
        global $pdo;
        $data_id = trim($data_id);
        $query   = "DELETE FROM datadienstplandb.roster_changes WHERE data_id = :data_id";
        $values  = array(':data_id' => $data_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error roster_changes_class.php');
        }
    } 
}
