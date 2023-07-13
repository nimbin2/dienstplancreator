<?php

require_once 'person_hours_class.php';
require_once 'closingtime_class.php';

class Closingtime_person
{
	private $data_id;
	private $id;
	private $closingtime_id;
	private $person_id ;
	/* Constructor */
	public function __construct() {
		$this->data_id = NULL;
		$this->id = NULL;
		$this->closingtime_id = NULL;
		$this->person_id = NULL;
	}
	
	/* Destructor */
	public function __destruct() { }

	public function add(int $data_id, string $closingtime_id, string $person_id): int {
		global $pdo;
		$data_id	    = trim($data_id);
		$closingtime_id	= trim($closingtime_id);
		$person_id	    = trim($person_id);

		$query = 'INSERT INTO datadienstplandb.closingtime_persons (data_id, closingtime_id, person_id) VALUES (:data_id, :closingtime_id, :person_id)';

		$values = array(':data_id' => $data_id, ':closingtime_id' => $closingtime_id, ':person_id' => $person_id);

		try
		{
			$res = $pdo->prepare($query);
			$res->execute($values);
		}
		catch (PDOException $e)
		{
		   /* If there is a PDO exception, throw a standard exception */
		   throw new Exception('Database query error closingtime_person_class.php');
		}



        $closingtime = new Closingtime();
        $cl = $closingtime->get($data_id, $closingtime_id);
        $set_hours = new Person_hours();
        $set_hours->updateWhereBetweenDate($data_id, $person_id, $cl["start"], $cl["end"], "should");

		return $pdo->lastInsertId();
	}
    public function get(int $data_id, int $closingtime_id) {
        global $pdo;
		$data_id	    = trim($data_id);
		$closingtime_id	= trim($closingtime_id);
        $query          = "SELECT * FROM datadienstplandb.closingtime_persons WHERE (data_id = :data_id) AND closingtime_id = :closingtime_id";
        $values         = array(':data_id' => $data_id, ':closingtime_id' => $closingtime_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error closingtime_person_class.php');
        }    
        $persons=array();
        while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
            $persons_item=array(
                "id"         	 => (int)$id,
                "closingtime_id" => (int)$closingtime_id,
                "person_id"		 => (int)$person_id
            );
            array_push($persons, $persons_item);
        }
        return $persons;
    }
    public function getWherePerson(int $data_id, int $person_id) {
        global $pdo;
		$data_id	    = trim($data_id);
		$person_id  	= trim($person_id);
        $query          = "SELECT * FROM datadienstplandb.closingtime_persons WHERE data_id = :data_id AND person_id = :person_id";
        $values         = array(':data_id' => $data_id, ':person_id' => $person_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error closingtime_person_class.php');
        }    
        $closingtimes=array();
        $closingtimes["closingtimes"]=array();
        while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
            $persons_item=array(
                "id"         	 => (int)$id,
                "closingtime_id" => (int)$closingtime_id,
                "person_id"		 => (int)$person_id
            );
            array_push($closingtimes["closingtimes"], $persons_item);
        }
        return $closingtimes;
    }
   	public function remove(int $data_id, int $closingtime_id, int $person_id) {
        global $pdo;

        $data_id        = trim($data_id);
        $closingtime_id = trim($closingtime_id);
        $person_id      = trim($person_id);

        $cl = new Closingtime();
        $closingtime = $cl->get($data_id, $closingtime_id);

        $query          = "DELETE FROM datadienstplandb.closingtime_persons WHERE (data_id = :data_id) AND closingtime_id = :closingtime_id AND person_id = :person_id";
        $values         = array(':data_id' => $data_id, ':closingtime_id' => $closingtime_id, ':person_id' => $person_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error closingtime_person_class.php');
        }

        $set_hours = new Person_hours();
        $set_hours->updateWhereBetweenDate($data_id, $person_id, $closingtime["start"], $closingtime["end"], "should");
    }
   	public function removeAllWherePerson(int $data_id, int $person_id) {
        global $pdo;

        $data_id        = trim($data_id);
        $person_id      = trim($person_id);

        $query          = "DELETE FROM datadienstplandb.closingtime_persons WHERE data_id = :data_id AND person_id = :person_id";
        $values         = array(':data_id' => $data_id, ':person_id' => $person_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error closingtime_person_class.php');
        }
    }
	public function removeAll(int $data_id, int $closingtime_id) {
        global $pdo;

        $data_id        = trim($data_id);
        $closingtime_id = trim($closingtime_id);

        $closingtime = new Closingtime();
        $closingtime->get($data_id, $closingtime_id);

        $query          = "DELETE FROM datadienstplandb.closingtime_persons WHERE (data_id = :data_id) AND closingtime_id = :closingtime_id";
        $values         = array(':data_id' => $data_id, ':closingtime_id' => $closingtime_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error closingtime_person_class.php');
        }

        $persons = $this->get($data_id, $closingtime_id);
        foreach($persons["persons"] as $key=> $value) {
            $person_id = $value["person_id"];
            $set_hours = new Person_hours();
            $set_hours->updateWhereBetweenDate($data_id, $person_id, $closingtime["start"], $closingtime["end"], "should");
        }
    }
    public function removeWhereDataId(int $data_id) {
        global $pdo;
        $data_id = trim($data_id);
        $query   = "DELETE FROM datadienstplandb.closingtime_persons WHERE data_id = :data_id";
        $values  = array(':data_id' => $data_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error closingtime_person_class.php');
        }
    } 
}
