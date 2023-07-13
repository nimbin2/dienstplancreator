<?php

class Roster
{
	private $data_id;
	private $id;
	private $yearweek;
	private $time_step;
	private $break_60;
	private $break_90;
	private $days;
	/* Constructor */
	public function __construct() {
		$this->data_id   = NULL;
		$this->id        = NULL;
		$this->yearweek  = NULL;
		$this->time_step = NULL;
		$this->break_60  = NULL;
		$this->break_90  = NULL;
		$this->days      = NULL;
	}
	
	/* Destructor */
	public function __destruct() { }

	public function update(int $data_id, string $yearweek, float $time_step, float $break_60, float $break_90, string $days) {
		global $pdo;
		$data_id	= trim($data_id);
		$yearweek	= trim($yearweek);
		$time_step	= trim($time_step);
		$break_60  	= trim($break_60);
		$break_90  	= trim($break_90);
		$days     	= trim($days);

		$query = 'INSERT INTO datadienstplandb.rosters (data_id, yearweek, time_step, break_60, break_90, days) VALUES (:data_id, :yearweek, :time_step, :break_60, :break_90, :days) ON DUPLICATE KEY UPDATE time_step = :time_step, break_60 = :break_60, break_90 = :break_90, days = :days';

        $values = array(':data_id' => $data_id, ':yearweek' => $yearweek, ':time_step' => $time_step, ':break_60' => $break_60, ':break_90' => $break_90, ':days' => $days);

		try {
			$res = $pdo->prepare($query);
			$res->execute($values);
		} catch (PDOException $e) {
		   throw new Exception('Database query error roster_class.php');
		}

		return $yearweek;
	}
    public function get(int $data_id, string $yearweek) {
        global $pdo;
		$data_id    = trim($data_id);
		$yearweek	= trim($yearweek);
        $query          = 'SELECT * FROM datadienstplandb.rosters WHERE data_id = :data_id AND yearweek = :yearweek';
        $values         = array(':data_id' => $data_id, ':yearweek' => $yearweek);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        }
        catch (PDOException $e) {
            throw new Exception('Database query error roster_class.php');
        }
        $row = $res->fetch(PDO::FETCH_ASSOC);
        extract($row);
        return array(
            "yearweek"  => $row["yearweek"],
            "time_step" => (float)$row["time_step"],
            "break_60"  => (float)$row["break_60"],
            "break_90"  => (float)$row["break_90"],
            "days"      => explode(',', $row["days"])
        );
    }
    public function getYearweeks(int $data_id) {
        global $pdo;
		$data_id    = trim($data_id);
        $query          = 'SELECT yearweek FROM datadienstplandb.rosters WHERE data_id = :data_id';
        $values         = array(':data_id' => $data_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        }
        catch (PDOException $e) {
            throw new Exception('Database query error roster_class.php');
        }
		return $res->fetchAll(PDO::FETCH_ASSOC);
    }
	public function remove(int $data_id, string $yearweek) {
        global $pdo;

        $data_id   = trim($data_id);
        $yearweek  = trim($yearweek);
        $query     = "DELETE FROM datadienstplandb.rosters WHERE data_id = :data_id AND yearweek = :yearweek";
        $values    = array(':data_id' => $data_id, ':yearweek' => $yearweek);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error roster_class.php');
        }
    }
    public function removeWhereDataId(int $data_id) {
        global $pdo;
        $data_id = trim($data_id);
        $query   = "DELETE FROM datadienstplandb.rosters WHERE data_id = :data_id";
        $values  = array(':data_id' => $data_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error roster_class.php');
        }
    } 
}
