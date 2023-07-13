<?php

require_once 'person_hours_class.php';

class Person_betterment
{
	private $data_id;
	private $id;
	private $person_id;
	private $start;
	private $end;
	private $hours;
	/* Constructor */
	public function __construct() {
		$this->data_id   = NULL;
		$this->id        = NULL;
		$this->person_id = NULL;
		$this->start     = NULL;
		$this->end       = NULL;
		$this->hours     = NULL;
	}
	
	/* Destructor */
	public function __destruct() { }

	public function add(int $data_id, int $person_id, string $start, string $end, float $hours): int {
		global $pdo;
		$data_id	= trim($data_id);
		$person_id	= trim($person_id);
		$start	    = trim($start);
		$end  	    = trim($end);
		$hours 	    = trim($hours);

		$query = 'INSERT INTO datadienstplandb.person_betterments (data_id, person_id, start, end, hours) VALUES (:data_id, :person_id, :start, :end, :hours)';

        $values = array(':data_id' => $data_id, ':person_id' => $person_id, ':start' => $start, ':end' => $end, ':hours' => $hours);

		try
		{
			$res = $pdo->prepare($query);
			$res->execute($values);
		}
		catch (PDOException $e)
		{
		   throw new Exception('Database query error person_betterment_class.php');
		}

        $set_hours = new Person_hours();
        $set_hours->updateWhereBetweenDate($data_id, $person_id, $start, $end, "is");

		return $pdo->lastInsertId();
	}
    public function getWhereId(int $data_id, int $id) {
        global $pdo;
		$data_id    = trim($data_id);
		$id     	= trim($id);
        $query          = 'SELECT * FROM datadienstplandb.person_betterments WHERE data_id = :data_id AND id = :id';
        $values         = array(':data_id' => $data_id, ':id' => $id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error person_betterment_class.php');
        }

        $row = $res->fetch(PDO::FETCH_ASSOC);
        extract($row);
        return array(
            "id"         => (int)$id,
            "person_id"  => (int)$person_id,
            "start"      => $start,
            "end"        => $end,
            "hours"      => (float)$hours
        );
    }
    public function get(int $data_id, int $person_id) {
        global $pdo;
		$data_id    = trim($data_id);
		$person_id	= trim($person_id);
        $query          = 'SELECT * FROM datadienstplandb.person_betterments WHERE data_id = :data_id AND person_id = :person_id ORDER BY start DESC';
        $values         = array(':data_id' => $data_id, ':person_id' => $person_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        }
        catch (PDOException $e) {
            throw new Exception('Database query error person_betterment_class.php');
        }

        $person_betterments=array();
        $person_betterments["person_betterments"]=array();
        while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
			$person_betterments_item=array(
				"id"         => (int)$id,
				"person_id"  => (int)$person_id,
				"start"      => $start,
				"end"        => $end,
				"hours"      => (float)$hours
			);
			array_push($person_betterments["person_betterments"], $person_betterments_item);
        }
        return $person_betterments;
    }
    public function getWhereDate(int $data_id, int $person_id, string $date) {
        global $pdo;
		$data_id    = trim($data_id);
		$person_id	= trim($person_id);
		$date   	= trim($date);
        $query      = 'SELECT * FROM datadienstplandb.person_betterments WHERE data_id = :data_id AND person_id = :person_id AND start <= :date AND end >= :date';
        $values     = array(':data_id' => $data_id, ':person_id' => $person_id, ':date' => $date);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        }
        catch (PDOException $e) {
            throw new Exception('Database query error person_betterment_class.php');
        }
        $person_betterment = $res->fetch(PDO::FETCH_ASSOC);
        return $person_betterment;
    }
	public function remove(int $data_id, int $id, int $person_id) {
        global $pdo;

        $data_id   = trim($data_id);
        $id        = trim($id);
        $person_id = trim($person_id);

        $betterment = $this->getWhereId($data_id, $id);

        $query   = "DELETE FROM datadienstplandb.person_betterments WHERE data_id = :data_id AND id = :id AND person_id = :person_id";
        $values  = array(':data_id' => $data_id, ':id' => $id, ':person_id' => $person_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error person_betterment_class.php');
        }


        $set_hours = new Person_hours();
        $set_hours->updateWhereBetweenDate($data_id, $person_id, $betterment["start"], $betterment["end"], "is");
    }
    public function removeWhereDataId(int $data_id) {
        global $pdo;
        $data_id = trim($data_id);
        $query   = "DELETE FROM datadienstplandb.person_betterments WHERE data_id = :data_id";
        $values  = array(':data_id' => $data_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error person_betterment_class.php');
        }
    } 
}
