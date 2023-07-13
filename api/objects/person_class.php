<?php
require_once 'person_change_class.php';
require_once 'shift_class.php';
require_once 'person_hours_class.php';
require_once 'person_betterment_class.php';
require_once 'person_overtime_manual_class.php';
require_once 'roster_class.php';
require_once 'closingtime_person_class.php';

class Person
{
	private $data_id;
	private $id;
	private $name;
	private $activated;
	private $department;
	private $hours;
	private $mpa;
	/* Constructor */
	public function __construct() {
		$this->data_id    = NULL;
		$this->id         = NULL;
		$this->name       = NULL;
		$this->activated  = NULL;
		$this->department = NULL;
		$this->hours      = NULL;
		$this->mpa        = NULL;
	}
	
	/* Destructor */
	public function __destruct() { }

	
	public function add(int $data_id, string $name, string $activated, int $department, float $hours, string $mpa): int {
		global $pdo;
        $data_id	= trim($data_id);
		$name	    = trim($name);
		$activated	= trim($activated);
		$department	= trim($department);
		$hours  	= trim($hours);
		$mpa	    = trim($mpa);
        $query = 'INSERT INTO datadienstplandb.persons (data_id, name, activated, department, hours, mpa) VALUES (:data_id, :name, :activated, :department, :hours, :mpa)';

        $values = array(':data_id' => $data_id, ':name' => $name, ':activated' => $activated, ':department' => $department, ':hours' => $hours, ':mpa' => $mpa,);

		try {
			$res = $pdo->prepare($query);
			$res->execute($values);
		} catch (PDOException $e) {
		   throw new Exception('Database query error person_class.php');
		}

        $id = $pdo->lastInsertId();
        $yearweeks_c = new Roster();
        $yearweeks = $yearweeks_c->getYearweeks($data_id);
        $person_hours = new Person_hours();
        foreach ($yearweeks as &$yw) {
            if ($yw["yearweek"] >= $activated) {
                $person_hours->setHoursWhereYearweek($data_id, $yw["yearweek"], $id);
            }
        }
		return $id;
	}
    public function get(int $data_id, int $id) {
        global $pdo;
		$data_id	    = trim($data_id);
		$id	= trim($id);
        $query          = 'SELECT * FROM datadienstplandb.persons WHERE data_id = :data_id AND id = :id';
        $values         = array(':data_id' => $data_id, ':id' => $id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error person_class.php');
        }

        $person = $res->fetch(PDO::FETCH_ASSOC);
        extract($person);
        return array(
            "id"    	 => (int)$id,
            "name"	     => (string)$name,
            "activated"	 => (string)$activated,
            "department" => (int)$department,
            "hours"	     => (float)$hours,
            "mpa"	     => (string)$mpa
        );
    }

    public function getAll(int $data_id) {
        global $pdo;
		$data_id	= trim($data_id);
        $query      = 'SELECT * FROM datadienstplandb.persons WHERE data_id = :data_id';
        $values     = array(':data_id' => $data_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        }
        catch (PDOException $e) {
            throw new Exception('Database query error person_class.php');
        }

        $persons=array();
        $persons["persons"]=array();
        while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
			$persons_item=array(
                "id"    	 => (int)$id,
                "name"	     => (string)$name,
                "activated"	 => (string)$activated,
                "department" => (int)$department,
                "hours"	     => (float)$hours,
                "mpa"	     => (string)$mpa
			);
			array_push($persons["persons"], $persons_item);
        }
		return $persons;
    }

	public function update(int $data_id, int $id, string $name, string $activated, int $department, float $hours, string $mpa) {
        global $pdo;
        $data_id	= trim($data_id);
        $id	        = trim($id);
		$name	    = trim($name);
		$activated	= trim($activated);
		$department	= trim($department);
		$hours  	= trim($hours);
		$mpa	    = trim($mpa);

        $query = 'UPDATE datadienstplandb.persons SET (data_id, name, activated, department, hours, mpa) VALUES (:data_id, :name, :activated, :department, :hours, :mpa) WHERE id = :id AND data_id = :data_id';

        $values = array(':data_id' => $data_id, ':id' => $id, ':name' => $name, ':activated' => $activated, ':department' => $department, ':hours  ' => $hours  , ':mpa' => $mpa,);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error person_class.php');
        }
    }
	public function updateWhereDepartment(int $data_id, int $dep_id, int $new_id) {
        global $pdo;
        $data_id	= trim($data_id);
        $dep_id     = trim($dep_id);
        $new_id     = trim($new_id);

        $query = 'UPDATE datadienstplandb.persons SET department = :new_id WHERE data_id = :data_id AND department = :dep_id';
        $values = array(':data_id' => $data_id, ':dep_id' => $dep_id, ':new_id' => $new_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error person_class.php');
        }
    }
    public function updateWhere(int $data_id, int $id, string $name, $value) {   
        global $pdo;
        $data_id = trim($data_id);
        $id 	 = trim($id);
        $name    = trim($name);
        if ($name === "mpa") {$value = implode(",", $value);};
        $value   = trim($value);
        $query   = "UPDATE datadienstplandb.persons SET `".$name."` = :value WHERE data_id = :data_id AND id = :id";
        $values  = array(':data_id' => $data_id, ':id' => $id, ':value' => $value);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error person_class.php');
        }
        if ($name === "activated") {
			$yearweeks_c = new Roster();
			$yearweeks = $yearweeks_c->getYearweeks($data_id);
			$person_hours = new Person_hours();
			foreach ($yearweeks as &$yw) {
				if ($yw["yearweek"] >= $value) {
					$person_hours->setHoursWhereYearweek($data_id, $yw["yearweek"], $id);
				}
			}
			$person_hours->removeWhereYwLt($data_id, $id, $value);
        }
		
		return $id;
    }   
	public function remove(int $data_id, int $id) {
        global $pdo;

        $data_id = trim($data_id);
        $id      = trim($id);
        $query   = "DELETE FROM datadienstplandb.persons WHERE (data_id = :data_id) AND (id = :id)";
        $values  = array(':data_id' => $data_id, ':id' => $id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error person_class.php');
        }
        $person_c = new Person_change();
        $person_c->removeWherePerson($data_id, $id);
        $closingtime_p = new Closingtime_person();
        $closingtime_p->removeAllWherePerson($data_id, $id);
        $person_h = new Person_hours();
        $person_h->removeWherePerson($data_id, $id);
        return $id;
    }
    public function removeWhereDataId(int $data_id) {
        global $pdo;
        $data_id = trim($data_id);
        $query   = "DELETE FROM datadienstplandb.persons WHERE data_id = :data_id";
        $values  = array(':data_id' => $data_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error person_class.php');
        }
    } 
}
