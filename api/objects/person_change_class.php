<?php

require_once 'person_hours_class.php';

class Person_change {
	private $data_id;
	private $id;
	private $person_id;
	private $yearweek;
	private $day_id;
	private $change_key;
	private $value;
	/* Constructor */
	public function __construct() {
		$this->data_id    = NULL;
		$this->id         = NULL;
		$this->person_id  = NULL;
		$this->yearweek   = NULL;
		$this->day_id     = NULL;
		$this->change_key = NULL;
		$this->value      = NULL;
	}
	
	/* Destructor */
	public function __destruct() { }

	public function add(int $data_id, int $person_id, string $yearweek, $day_id, string $change_key, string $value): int {
		global $pdo;
		$data_id	= trim($data_id);
		$person_id	= trim($person_id);
		$yearweek	= trim($yearweek);
		$day_id 	= trim($day_id);
		$change_key = trim($change_key);
		$value      = trim($value);
        
		$query = 'INSERT INTO datadienstplandb.person_changes (data_id, person_id, yearweek, day_id, change_key, value) VALUES (:data_id, :person_id, :yearweek, :day_id, :change_key, :value)';

        $values = array(':data_id' => $data_id, ':person_id' => $person_id, ':yearweek' => $yearweek, ':day_id' => $day_id, ':change_key' => $change_key, ':value' => $value);

		try {
			$res = $pdo->prepare($query);
			$res->execute($values);
		} catch (PDOException $e) {
		   throw new Exception('Database query error person_change_class.php');
		}
        $set_hours = new Person_hours();
        if (($change_key === "h") || ($change_key === "sf")) {
            $set_hours->updateWhere($data_id, $person_id, $yearweek, "should");
        } else if ($change_key === "m") {
            $set_hours->updateWhere($data_id, $person_id, $yearweek, "is");
        }

		return $pdo->lastInsertId();
	}
    public function get(int $data_id) {
        global $pdo;
		$data_id    = trim($data_id);
        $query          = 'SELECT * FROM datadienstplandb.person_changes WHERE data_id = :data_id ORDER BY yearweek DESC';
        $values         = array(':data_id' => $data_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        }
        catch (PDOException $e) {
            throw new Exception('Database query error person_change_class.php');
        }

        $person_changes=array();
        $person_changes["person_changes"]=array();
        while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
			$person_changes_item=array(
				"person_id"  => (int)$person_id,
				"yearweek"   => $yearweek,
				"day_id"     => (int)$day_id,
				"change_key" => $change_key,
				"value"      => $value
			);
			array_push($person_changes["person_changes"], $person_changes_item);
        }
        return $person_changes;
    }
    public function getWhereKey(int $data_id, int $person_id, string $change_key) {
        global $pdo;
		$data_id    = trim($data_id);
		$person_id	= trim($person_id);
		$change_key	= trim($change_key);
        $query          = 'SELECT * FROM datadienstplandb.person_changes WHERE data_id = :data_id AND person_id = :person_id AND change_key = :change_key ORDER BY yearweek DESC';
        $values         = array(':data_id' => $data_id, ':person_id' => $person_id, ':change_key' => $change_key);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        }
        catch (PDOException $e) {
            throw new Exception('Database query error person_change_class.php');
        }

        $person_changes=array();
        $person_changes["person_changes"]=array();
        while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
			$person_changes_item=array(
				"person_id"  => (int)$person_id,
				"yearweek"   => $yearweek,
				"day_id"     => (int)$day_id,
				"change_key" => $change_key,
				"value"      => $value
			);
			array_push($person_changes["person_changes"], $person_changes_item);
        }
        return $person_changes;
    }
    public function getWhereKeyValue(int $data_id, string $change_key, string $value) {
        global $pdo;
		$data_id    = trim($data_id);
		$change_key	= trim($change_key);
		$value      = trim($value);
        $query          = 'SELECT * FROM datadienstplandb.person_changes WHERE data_id = :data_id AND change_key = :change_key AND value = :value ORDER BY yearweek DESC';
        $values         = array(':data_id' => $data_id, ':change_key' => $change_key, ':value' => $value);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        }
        catch (PDOException $e) {
            throw new Exception('Database query error person_change_class.php');
        }

        $person_changes=array();
        $person_changes["person_changes"]=array();
        while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
			$person_changes_item=array(
				"person_id"  => (int)$person_id,
				"yearweek"   => $yearweek,
				"day_id"     => (int)$day_id,
				"change_key" => $change_key,
				"value"      => $value
			);
			array_push($person_changes["person_changes"], $person_changes_item);
        }
        return $person_changes;
    }
    public function getWhereYearweekKey(int $data_id, int $person_id, string $yearweek, string $change_key) {
        global $pdo;
		$data_id    = trim($data_id);
		$person_id	= trim($person_id);
		$yearweek   = trim($yearweek);
		$change_key	= trim($change_key);
        $query          = 'SELECT * FROM datadienstplandb.person_changes WHERE data_id = :data_id AND person_id = :person_id AND yearweek = :yearweek AND change_key = :change_key ORDER BY yearweek DESC';
        $values         = array(':data_id' => $data_id, ':person_id' => $person_id, ':yearweek' => $yearweek, ':change_key' => $change_key);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        }
        catch (PDOException $e) {
            throw new Exception('Database query error person_change_class.php');
        }

        $person_changes=array();
        $person_changes["person_changes"]=array();
        while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
			$person_changes_item=array(
				"person_id"  => (int)$person_id,
				"yearweek"   => $yearweek,
				"day_id"     => $day_id,
				"change_key" => $change_key,
				"value"      => $value
			);
			array_push($person_changes["person_changes"], $person_changes_item);
        }
        return $person_changes;
    }
    public function getWhereYearweekDayKey(int $data_id, int $person_id, string $yearweek, int $day_id, string $change_key) {
        global $pdo;
		$data_id    = trim($data_id);
		$person_id	= trim($person_id);
		$yearweek   = trim($yearweek);
		$day_id     = trim($day_id);
		$change_key	= trim($change_key);
        $query          = 'SELECT * FROM datadienstplandb.person_changes WHERE data_id = :data_id AND person_id = :person_id AND yearweek = :yearweek AND day_id = :day_id AND change_key = :change_key ORDER BY yearweek DESC';
        $values         = array(':data_id' => $data_id, ':person_id' => $person_id, ':yearweek' => $yearweek, ':day_id' => $day_id, ':change_key' => $change_key);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        }
        catch (PDOException $e) {
            throw new Exception('Database query error person_change_class.php');
        }

        $person_changes=array();
        $person_changes["person_changes"]=array();
        while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
			$person_changes_item=array(
				"person_id"  => (int)$person_id,
				"yearweek"   => $yearweek,
				"day_id"     => (int)$day_id,
				"change_key" => $change_key,
				"value"      => $value
			);
			array_push($person_changes["person_changes"], $person_changes_item);
        }
        return $person_changes;
    }


    public function updateWhereKey(int $data_id, int $person_id, string $change_key, string $value) {
        global $pdo;
		$data_id    = trim($data_id);
		$person_id	= trim($person_id);
		$change_key	= trim($change_key);
		$value  	= trim($value);
        $query          = 'UPDATE datadienstplandb.person_changes SET value = :value WHERE data_id = :data_id AND person_id = :person_id AND change_key = :change_key';
        $values         = array(':data_id' => $data_id, ':person_id' => $person_id, ':change_key' => $change_key, ':value' => $value);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error person_change_class.php');
        }
        $set_hours = new Person_hours();
        if (($change_key === "h") || ($change_key === "sf")) {
            $set_hours->updateAllWherePerson($data_id, $person_id, "should");
        } else if ($change_key === "m") {
            $set_hours->updateAllWherePerson($data_id, $person_id, "is");
        }
    }
    public function updateWhereYearweekKey(int $data_id, int $person_id, string $yearweek, string $change_key, string $value) {
        global $pdo;
		$data_id    = trim($data_id);
		$person_id	= trim($person_id);
		$yearweek	= trim($yearweek);
		$change_key	= trim($change_key);
		$value  	= trim($value);
        $query          = 'UPDATE datadienstplandb.person_changes SET value = :value WHERE data_id = :data_id AND person_id = :person_id AND yearweek = : yearweek AND change_key = :change_key';
        $values         = array(':data_id' => $data_id, ':person_id' => $person_id, 'yearweek' => $yearweek, ':change_key' => $change_key, ':value' => $value);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error person_change_class.php');
        }
        $set_hours = new Person_hours();
        if (($change_key === "h") || ($change_key === "sf")) {
            $set_hours->updateWhere($data_id, $person_id, $yearweek, "should");
        } else if ($change_key === "m") {
            $set_hours->updateWhere($data_id, $person_id, $yearweek, "is");
        }
    }
    public function updateWhereDayKey(int $data_id, int $person_id, int $day_id, string $change_key, string $value) {
        global $pdo;
		$data_id    = trim($data_id);
		$person_id	= trim($person_id);
		$day_id 	= trim($day_id);
		$change_key	= trim($change_key);
		$value  	= trim($value);
        $query          = 'UPDATE datadienstplandb.person_changes SET value = :value WHERE data_id = :data_id AND person_id = :person_id AND day_id = :day_id AND change_key = :change_key';
        $values         = array(':data_id' => $data_id, ':person_id' => $person_id, ':day_id' => $day_id, ':change_key' => $change_key, ':value' => $value);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error person_change_class.php');
        }
        $set_hours = new Person_hours();
        if (($change_key === "h") || ($change_key === "sf")) {
            $set_hours->updateAllWherePerson($data_id, $person_id, "should");
        } else if ($change_key === "m") {
            $set_hours->updateAllWherePerson($data_id, $person_id, "is");
        }
    }
    public function updateWhereYearweekDayKey(int $data_id, int $person_id, string $yearweek, int $day_id, string $change_key, string $value) {
        global $pdo;
		$data_id    = trim($data_id);
		$person_id	= trim($person_id);
		$yearweek	= trim($yearweek);
		$day_id 	= trim($day_id);
		$change_key	= trim($change_key);
		$value  	= trim($value);
		$query  = 'INSERT INTO datadienstplandb.person_changes (data_id, person_id, yearweek, day_id, change_key, value) VALUES (:data_id, :person_id, :yearweek, :day_id, :change_key, :value) ON DUPLICATE KEY UPDATE value = :value';
        $values = array(':data_id' => $data_id, ':person_id' => $person_id, 'yearweek' => $yearweek, ':day_id' => $day_id, ':change_key' => $change_key, ':value' => $value);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error person_change_class.php');
        }
        $set_hours = new Person_hours();
        if (($change_key === "h") || ($change_key === "sf")) {
            $set_hours->updateWhere($data_id, $person_id, $yearweek, "should");
        } else if ($change_key === "m") {
            $set_hours->updateWhere($data_id, $person_id, $yearweek, "is");
        }
    }
    public function updateWhereYearweekGeKey(int $data_id, int $person_id, string $yearweek, string $change_key, string $value) {
        global $pdo;
		$data_id    = trim($data_id);
		$person_id	= trim($person_id);
		$yearweek	= trim($yearweek);
		$change_key	= trim($change_key);
		$value  	= trim($value);
        $query          = 'UPDATE datadienstplandb.person_changes SET value = :value WHERE data_id = :data_id AND person_id = :person_id AND yearweek >= : yearweek AND change_key = :change_key';
        $values         = array(':data_id' => $data_id, ':person_id' => $person_id, 'yearweek' => $yearweek, ':change_key' => $change_key, ':value' => $value);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error person_change_class.php');
        }
        $set_hours = new Person_hours();
        if (($change_key === "h") || ($change_key === "sf")) {
            $set_hours->updateWhereGe($data_id, $person_id, $yearweek, "should");
        } else if ($change_key === "m") {
            $set_hours->updateWhereGe($data_id, $person_id, $yearweek, "is");
        }
    }
    public function updateWhereYearweekGeDayKey(int $data_id, int $person_id, string $yearweek, int $day_id, string $change_key, string $value) {
        global $pdo;
		$data_id    = trim($data_id);
		$person_id	= trim($person_id);
		$yearweek	= trim($yearweek);
		$day_id 	= trim($day_id);
		$change_key	= trim($change_key);
		$value  	= trim($value);
        $query          = 'UPDATE datadienstplandb.person_changes SET value = :value WHERE data_id = :data_id AND person_id = :person_id AND yearweek >= :yearweek AND day_id = :day_id AND change_key = :change_key';
        $values         = array(':data_id' => $data_id, ':person_id' => $person_id, ':yearweek' => $yearweek, ':day_id' => $day_id, ':change_key' => $change_key, ':value' => $value);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error person_change_class.php');
        }
        $set_hours = new Person_hours();
        if (($change_key === "h") || ($change_key === "sf")) {
            $set_hours->updateWhereGe($data_id, $person_id, $yearweek, "should");
        } else if ($change_key === "m") {
            $set_hours->updateWhereGe($data_id, $person_id, $yearweek, "is");
        }
    }
    public function updateWhereDepartment(int $data_id, int $dep_id, int $new_id) {
        global $pdo;
		$data_id    = trim($data_id);
		$dep_id 	= trim($dep_id);
		$new_id 	= trim($new_id);
        $query          = 'UPDATE datadienstplandb.person_changes SET value = :new_id WHERE data_id = :data_id AND change_key = "d" AND value = :dep_id';
        $values         = array(':data_id' => $data_id, ':new_id' => $new_id, ':dep_id' => $dep_id);
        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error person_change_class.php');
        }
    }


	public function removeWhereKey(int $data_id, int $person_id, string $change_key) {
        global $pdo;

        $data_id    = trim($data_id);
        $id         = trim($id);
        $person_id  = trim($person_id);
        $change_key = trim($change_key);
        $query   = "DELETE FROM datadienstplandb.person_changes WHERE data_id = :data_id AND person_id = :person_id AND change_key = :change_key";
        $values  = array(':data_id' => $data_id, ':person_id' => $person_id, ':change_key' => $change_key);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error person_change_class.php');
        }
    }
	public function removeWherePerson(int $data_id, int $person_id) {
        global $pdo;
        $data_id    = trim($data_id);
        $person_id  = trim($person_id);
        $query   = "DELETE FROM datadienstplandb.person_changes WHERE data_id = :data_id AND person_id = :person_id";
        $values  = array(':data_id' => $data_id, ':person_id' => $person_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error person_change_class.php');
        }
    }

	public function removeWhereYearweekDayKey(int $data_id, int $person_id, string $yearweek, int $day_id, string $change_key) {
        global $pdo;

        $data_id    = trim($data_id);
        $person_id  = trim($person_id);
        $yearweek   = trim($yearweek);
        $day_id     = trim($day_id);
        $change_key = trim($change_key);
        $query   = "DELETE FROM datadienstplandb.person_changes WHERE data_id = :data_id AND person_id = :person_id AND yearweek = :yearweek AND day_id = :day_id AND change_key = :change_key";
        $values  = array(':data_id' => $data_id, ':person_id' => $person_id, ':yearweek' => $yearweek, ':day_id' => $day_id, ':change_key' => $change_key);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error person_change_class.php');
        }
        $set_hours = new Person_hours();
        if (($change_key === "h") || ($change_key === "sf")) {
            $set_hours->updateWhere($data_id, $person_id, $yearweek, "should");
        } else if ($change_key === "m") {
            $set_hours->updateWhere($data_id, $person_id, $yearweek, "is");
        }
    }
    public function removeWhereDataId(int $data_id) {
        global $pdo;
        $data_id = trim($data_id);
        $query   = "DELETE FROM datadienstplandb.person_changes WHERE data_id = :data_id";
        $values  = array(':data_id' => $data_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error person_change_class.php');
        }
    } 
}
