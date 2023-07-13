<?php

require_once 'closingtime_class.php';
require_once 'person_hours_class.php'; 

class Person_vacation
{
	private $data_id;
	private $id;
	private $person_id;
	private $start;
	private $end;
	/* Constructor */
	public function __construct() {
		$this->data_id = NULL;
		$this->id = NULL;
		$this->person_id = NULL;
		$this->start = NULL;
		$this->end = NULL;
	}
	
	/* Destructor */
	public function __destruct() { }

	public function add(int $data_id, int $person_id, string $start, string $end): int {
		global $pdo;
		$data_id	= trim($data_id);
		$person_id	= trim($person_id);
		$start	    = trim($start);
		$end  	    = trim($end);

		$query = 'INSERT INTO datadienstplandb.person_vacations (data_id, person_id, start, end) VALUES (:data_id, :person_id, :start, :end)';

        $values = array(':data_id' => $data_id, ':person_id' => $person_id, ':start' => $start, ':end' => $end);

		try
		{
			$res = $pdo->prepare($query);
			$res->execute($values);
		}
		catch (PDOException $e)
		{
		   throw new Exception('Database query error person_vacation_class.php');
		}


        $set_hours = new Person_hours();
        $set_hours->updateWhereBetweenDate($data_id, $person_id, $start, $end, "should");

		return $pdo->lastInsertId();
	}
    public function getWhereId(int $data_id, int $id) {
        global $pdo;
		$data_id    = trim($data_id);
		$id     	= trim($id);
        $query          = 'SELECT * FROM datadienstplandb.person_vacations WHERE data_id = :data_id AND id = :id';
        $values         = array(':data_id' => $data_id, ':id' => $id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        }
        catch (PDOException $e) {
            throw new Exception('Database query error person_vacation_class.php');
        }

        return array(
            "id"         => (int)$id,
            "person_id"  => (int)$person_id,
            "start"      => $start,
            "end"        => $end
        );
    }

    public function update(int $data_id, int $person_id, int $id, string $start, string $end): int {
        global $pdo;
        $data_id    = trim($data_id);
        $id         = trim($id);
        $person_id  = trim($person_id);
        $start      = trim($start);
        $end        = trim($end);

        $query = 'UPDATE datadienstplandb.person_vacations SET start = :start, end = :end WHERE data_id = :data_id AND id = :id AND person_id = :person_id';

        $values = array(':data_id' => $data_id, ':id' => $id, ':person_id' => $person_id, ':start' => $start, ':end' => $end);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
           throw new Exception('Database query error person_vacation_class.php');
        }

        $set_hours = new Person_hours();
        $set_hours->updateWhereBetweenDate($data_id, $person_id, $start, $end, "should");

        return $pdo->lastInsertId();
    }

    public function get(int $data_id, int $person_id) {
        global $pdo;
		$data_id    = trim($data_id);
		$person_id	= trim($person_id);
        $query          = 'SELECT * FROM datadienstplandb.person_vacations WHERE data_id = :data_id AND person_id = :person_id';
        $values         = array(':data_id' => $data_id, ':person_id' => $person_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        }
        catch (PDOException $e) {
            throw new Exception('Database query error person_vacation_class.php');
        }

        $person_vacations=array();
        $person_vacations["person_vacations"]=array();
        while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
			$person_vacations_item=array(
				"id"         => (int)$id,
				"person_id"  => (int)$person_id,
				"start"      => $start,
				"end"        => $end
			);
			array_push($person_vacations["person_vacations"], $person_vacations_item);
        }

        $query          = "SELECT * FROM datadienstplandb.closingtime_persons WHERE data_id = :data_id AND person_id = :person_id";
        $values         = array(':data_id' => $data_id, ':person_id' => $person_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error person_vacation_class.php');
        }    
        while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
            $closingtime_get = new Closingtime();
            $closingtime = $closingtime_get->get($data_id, $closingtime_id);
            $closingtime_item=array(
                "closingtime_id"    => (int)$closingtime_id,
                "name"              => $closingtime["name"],
                "start"             => $closingtime["start"],
                "end"               => $closingtime["end"],
                "lawful"            => (int)$closingtime["lawful"]
            );
			array_push($person_vacations["person_vacations"], $closingtime_item);
        }

        return $person_vacations;
    }
	public function remove(int $data_id, int $id, int $person_id) {
        global $pdo;

        $data_id   = trim($data_id);
        $id        = trim($id);
        $person_id = trim($person_id);
        $vacation  = $this->getWhereId($data_id, $id);
        $query   = "DELETE FROM datadienstplandb.person_vacations WHERE data_id = :data_id AND id = :id AND person_id = :person_id";
        $values  = array(':data_id' => $data_id, ':id' => $id, ':person_id' => $person_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error person_vacation_class.php');
        }

        $set_hours = new Person_hours();
        $set_hours->updateWhereBetweenDate($data_id, $person_id, $vacation["start"], $vacation["end"], "should");
    }
    public function removeWhereDataId(int $data_id) {
        global $pdo;
        $data_id = trim($data_id);
        $query   = "DELETE FROM datadienstplandb.person_vacations WHERE data_id = :data_id";
        $values  = array(':data_id' => $data_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error person_vacation_class.php');
        }
    } 
}
