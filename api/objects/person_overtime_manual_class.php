<?php

require_once 'person_hours_class.php';

class Person_overtime_manual
{
	private $data_id;
	private $person_id;
	private $yearweek;
	private $overtime;
	/* Constructor */
	public function __construct() {
		$this->data_id = NULL;
		$this->person_id = NULL;
		$this->yearweek = NULL;
		$this->overtime = NULL;
	}
	
	/* Destructor */
	public function __destruct() { }

	public function add(int $data_id, int $person_id, string $yearweek, float $overtime): int {
		global $pdo;
		$data_id	= trim($data_id);
		$person_id	= trim($person_id);
		$yearweek   = trim($yearweek);
		$overtime   = trim($overtime);

		$query = 'INSERT INTO datadienstplandb.person_overtimes_manual (data_id, person_id, yearweek, overtime) VALUES (:data_id, :person_id, :yearweek, :overtime)';

        $values = array(':data_id' => $data_id, ':person_id' => $person_id, ':yearweek' => $yearweek, ':overtime' => $overtime);

		try
		{
			$res = $pdo->prepare($query);
			$res->execute($values);
		}
		catch (PDOException $e)
		{
		   throw new Exception('Database query error person_overtime_manual_class.php');
		}

        $set_hours = new Person_hours();
        $set_hours->updateWhere($data_id, $person_id, $yearweek, "is");

		return $pdo->lastInsertId();
	}
    public function get(int $data_id, int $person_id) {
        global $pdo;
		$data_id    = trim($data_id);
		$person_id	= trim($person_id);
        $query          = 'SELECT * FROM datadienstplandb.person_overtimes_manual WHERE data_id = :data_id AND person_id = :person_id';
        $values         = array(':data_id' => $data_id, ':person_id' => $person_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        }
        catch (PDOException $e) {
            throw new Exception('Database query error person_overtime_manual_class.php');
        }

        $person_overtimes_manual=array();
        $person_overtimes_manual["person_overtimes_manual"]=array();
        while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
			$person_overtime_item=array(
				"person_id"  => (int)$person_id,
				"yearweek"   => $yearweek,
				"overtime"   => (float)$overtime
			);
			array_push($person_overtimes_manual["person_overtimes_manual"], $person_overtime_item);
        }
        return $person_overtimes_manual;
    }
    public function getWhereYearweek(int $data_id, int $person_id, string $yearweek) {
        global $pdo;
		$data_id    = trim($data_id);
		$person_id	= trim($person_id);
        $query          = 'SELECT * FROM datadienstplandb.person_overtimes_manual WHERE data_id = :data_id AND person_id = :person_id AND yearweek = :yearweek';
        $values         = array(':data_id' => $data_id, ':person_id' => $person_id, ':yearweek' => $yearweek);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        }
        catch (PDOException $e) {
            throw new Exception('Database query error person_overtime_manual_class.php');
        }

        $person_overtimes_manual=array();
        $person_overtimes_manual["person_overtimes_manual"]=array();
        $row = $res->fetch(PDO::FETCH_ASSOC);
        return (float)$row["overtime"];
    }
    public function getWhereYearweekLe(int $data_id, int $person_id, string $yearweek) {
        global $pdo;
		$data_id    = trim($data_id);
		$person_id	= trim($person_id);
		$yearweek	= trim($yearweek);
        $query          = 'SELECT * FROM datadienstplandb.person_overtimes_manual WHERE data_id = :data_id AND person_id = :person_id AND yearweek <= :yearweek';
        $values         = array(':data_id' => $data_id, ':person_id' => $person_id, ':yearweek' => $yearweek);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        }
        catch (PDOException $e) {
            throw new Exception('Database query error person_overtime_manual_class.php');
        }

        $person_overtimes_manual=array();
        $person_overtimes_manual["person_overtimes_manual"]=array();
        while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
			$person_overtime_item=array(
				"id"         => (int)$id,
				"person_id"  => (int)$person_id,
				"yearweek"   => $yearweek,
				"overtime"   => (float)$overtime
			);
			array_push($person_overtimes_manual["person_overtimes_manual"], $person_overtime_item);
        }
        return $person_overtimes_manual;
    }
    public function updateWhereYearweek(int $data_id, int $person_id, string $yearweek, float $overtime) {
        global $pdo;
        $data_id    = trim($data_id);
        $person_id  = trim($person_id);
        $yearweek   = trim($yearweek);
        $overtime   = trim($overtime);
        $query   = "INSERT INTO datadienstplandb.person_overtimes_manual (data_id, person_id, yearweek, overtime) VALUES (:data_id, :person_id, :yearweek, :overtime) ON DUPLICATE KEY UPDATE overtime = :overtime";
        $values  = array(':data_id' => $data_id, ':person_id' => $person_id, ':overtime' => $overtime, ':yearweek' => $yearweek);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error person_overtime_manual_class.php');
		}

        $set_hours = new Person_hours();
        $set_hours->updateWhere($data_id, $person_id, $yearweek, "is");
	}
      
	public function remove(int $data_id, int $person_id, string $yearweek) {
        global $pdo;

        $data_id   = trim($data_id);
        $person_id = trim($person_id);
        $yearweek  = trim($yearweek);
        $query   = "DELETE FROM datadienstplandb.person_overtimes_manual WHERE data_id = :data_id AND person_id = :person_id AND yearweek = :yearweek";
        $values  = array(':data_id' => $data_id, ':person_id' => $person_id, ':yearweek' => $yearweek);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error person_overtime_manual_class.php');
        }

        $set_hours = new Person_hours();
        $set_hours->updateWhere($data_id, $person_id, $yearweek, "is");
    }
	public function removeWhereYearweekLt(int $data_id, int $person_id, string $yearweek) {
        global $pdo;

        $data_id   = trim($data_id);
        $person_id = trim($person_id);
        $yearweek  = trim($yearweek);
        $query   = "DELETE FROM datadienstplandb.person_overtimes_manual WHERE data_id = :data_id AND person_id = :person_id AND yearweek < :yearweek";
        $values  = array(':data_id' => $data_id, ':person_id' => $person_id, ':yearweek' => $yearweek);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error person_overtime_manual_class.php');
        }

        $set_hours = new Person_hours();
        $set_hours->updateWhereLt($data_id, $person_id, $yearweek, "is");
    }
    public function removeWhereDataId(int $data_id) {
        global $pdo;
        $data_id = trim($data_id);
        $query   = "DELETE FROM datadienstplandb.person_overtimes_manual WHERE data_id = :data_id";
        $values  = array(':data_id' => $data_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error person_overtime_manual_class.php');
        }
    } 
}
