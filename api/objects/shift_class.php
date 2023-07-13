<?php

require_once 'person_hours_class.php'; 

class Shift
{
	private $data_id;
	private $id;
	private $yearweek;
	private $day_id;
	private $person_id;
	private $start;
	private $end;
	private $break;
	/* Constructor */
	public function __construct() {
		$this->data_id = NULL;
		$this->id = NULL;
		$this->yearweek = NULL;
		$this->day_id = NULL;
		$this->person_id = NULL;
		$this->start = NULL;
		$this->end = NULL;
		$this->break = NULL;
	}
	
	/* Destructor */
	public function __destruct() { }

    public function getShiftBreaks($data_id, $yearweek, $start, $end) {
        global $pdo;
        $query      = "SELECT break_60, break_90 FROM datadienstplandb.rosters WHERE data_id = :data_id AND yearweek = :yearweek;";
        $values     = array(':data_id' => $data_id, ':yearweek' => $yearweek);
        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error shift_class.php');
        }
        $breaks     = $res->fetch(PDO::FETCH_ASSOC);
        $break      = 0;
        if ($end-$start > 9) {
            $break  = $breaks["break_60"]+$breaks["break_90"];
        } elseif ($end-$start > 6) {
            $break  = $breaks["break_60"];
        } 
        return $break;
    }
	public function add(int $data_id, string $yearweek, int $day_id, int $person_id, float $start, float $end) {
		global $pdo;
		$data_id	= trim($data_id);
		$yearweek	= trim($yearweek);
		$day_id 	= trim($day_id);
		$person_id	= trim($person_id);
		$start	    = trim($start);
		$end  	    = trim($end);
        $break      = $this->getShiftBreaks($data_id, $yearweek, $start, $end);
        $break      = (float)trim($break);

		$query = 'INSERT INTO datadienstplandb.shifts (data_id, yearweek, day_id, person_id, start, end, breaks) VALUES (:data_id, :yearweek, :day_id, :person_id, :start, :end, :break)';

        $values = array(':data_id' => $data_id, ':yearweek' => $yearweek, ':day_id' => $day_id, ':person_id' => $person_id, ':start' => $start, ':end' => $end, ':break' => $break);

		try {
			$res = $pdo->prepare($query);
			$res->execute($values);
		} catch (PDOException $e) {
		   throw new Exception('Database query error shift_class.php');
		}

        $shift_id = $pdo->lastInsertId();
        $set_hours = new Person_hours();
        $set_hours->updateWhere($data_id, $person_id, $yearweek, "is");
        return array(
            "id"        => (int)$shift_id,
            "yearweek"  => (string)$yearweek,
            "day_id"    => (int)$day_id,
            "person_id" => (int)$person_id,
            "start"     => (float)$start,
            "end"       => (float)$end,
            "breaks"    => (float)$break
        );
	}
    public function getWhereId(int $data_id, int $id) {
        global $pdo;
		$data_id    = trim($data_id);
		$id     	= trim($id);
        $query          = 'SELECT * FROM datadienstplandb.shifts WHERE data_id = :data_id AND id = :id';
        $values         = array(':data_id' => $data_id, ':id' => $id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error shift_class.php');
        }

        $row = $res->fetch(PDO::FETCH_ASSOC);
        extract($row);
        return array(
            "id"         => (int)$id,
            "yearweek"   => (string)$yearweek,
            "day_id"     => (int)$day_id,
            "person_id"  => (int)$person_id,
            "start"      => (float)$start,
            "end"        => (float)$end,
            "hours"      => (float)$end-(float)$start-(float)$breaks,
            "breaks"      => (float)$breaks
        );
    }
    public function getWherePerson(int $data_id, int $person_id) {
        global $pdo;
		$data_id    = trim($data_id);
		$person_id	= trim($person_id);
        $query          = 'SELECT * FROM datadienstplandb.shifts WHERE data_id = :data_id AND person_id = :person_id';
        $values         = array(':data_id' => $data_id, ':person_id' => $person_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        }
        catch (PDOException $e) {
            throw new Exception('Database query error shift_class.php');
        }

        $shifts=array();
        $shifts["shifts"]=array();
        while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
			$shifts_item=array(
				"id"         => (int)$id,
				"yearweek"   => (string)$yearweek,
				"day_id"     => (int)$day_id,
				"person_id"  => (int)$person_id,
				"start"      => (float)$start,
				"end"        => (float)$end,
				"hours"      => (float)$end-(float)$start-(float)$breaks,
				"breaks"      => (float)$breaks
			);
			array_push($shifts["shifts"], $shifts_item);
        }
        return $shifts;
    }
    public function getWhereYearweek(int $data_id, string $yearweek) {
        global $pdo;
		$data_id    = trim($data_id);
		$yearweek	= trim($yearweek);
        $query          = 'SELECT * FROM datadienstplandb.shifts WHERE data_id = :data_id AND yearweek = :yearweek';
        $values         = array(':data_id' => $data_id, ':yearweek' => $yearweek);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        }
        catch (PDOException $e) {
            throw new Exception('Database query error shift_class.php');
        }

        $shifts=array();
        $shifts["shifts"]=array();
        while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
			$shifts_item=array(
				"id"         => (int)$id,
				"yearweek"   => (string)$yearweek,
				"day_id"     => (int)$day_id,
				"person_id"  => (int)$person_id,
				"start"      => (float)$start,
				"end"        => (float)$end,
				"hours"      => (float)$end-(float)$start-(float)$breaks,
				"breaks"      => (float)$breaks
			);
			array_push($shifts["shifts"], $shifts_item);
        }
        return $shifts;
    }
    public function getWhereYearweekPerson(int $data_id, string $yearweek, int $person_id) {
        global $pdo;
		$data_id    = trim($data_id);
		$yearweek	= trim($yearweek);
		$person_id 	= trim($person_id);
        $query          = 'SELECT * FROM datadienstplandb.shifts WHERE data_id = :data_id AND yearweek = :yearweek AND person_id = :person_id';
        $values         = array(':data_id' => $data_id, ':yearweek' => $yearweek, ':person_id' => $person_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        }
        catch (PDOException $e) {
            throw new Exception('Database query error shift_class.php');
        }

        $shifts=array();
        $shifts["shifts"]=array();
        while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
			$shifts_item=array(
				"id"         => (int)$id,
				"yearweek"   => (string)$yearweek,
				"day_id"     => (int)$day_id,
				"person_id"  => (int)$person_id,
				"start"      => (float)$start,
				"end"        => (float)$end,
				"hours"      => (float)$end-(float)$start-(float)$breaks,
				"breaks"      => (float)$breaks
			);
			array_push($shifts["shifts"], $shifts_item);
        }
        return $shifts;
    }
    public function getWhereYearweekDay(int $data_id, string $yearweek, int $day_id) {
        global $pdo;
		$data_id    = trim($data_id);
		$yearweek	= trim($yearweek);
		$day_id 	= trim($day_id);
        $query          = 'SELECT * FROM datadienstplandb.shifts WHERE data_id = :data_id AND yearweek = :yearweek AND day_id = :day_id';
        $values         = array(':data_id' => $data_id, ':yearweek' => $yearweek, ':day_id' => $day_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        }
        catch (PDOException $e) {
            throw new Exception('Database query error shift_class.php');
        }

        $shifts=array();
        $shifts["shifts"]=array();
        while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
			$shifts_item=array(
				"id"         => (int)$id,
				"yearweek"   => (string)$yearweek,
				"day_id"     => (int)$day_id,
				"person_id"  => (int)$person_id,
				"start"      => (float)$start,
				"end"        => (float)$end,
				"hours"      => (float)$end-(float)$start-(float)$breaks,
				"breaks"      => (float)$breaks
			);
			array_push($shifts["shifts"], $shifts_item);
        }
        return $shifts;
    }
    public function getWhereYearweekDayPerson(int $data_id, string $yearweek, int $day_id, int $person_id) {
        global $pdo;
		$data_id    = trim($data_id);
		$yearweek	= trim($yearweek);
		$day_id 	= trim($day_id);
		$person_id	= trim($person_id);
        $query          = 'SELECT * FROM datadienstplandb.shifts WHERE data_id = :data_id AND yearweek = :yearweek AND day_id = :day_id AND person_id = :person_id';
        $values         = array(':data_id' => $data_id, ':yearweek' => $yearweek, ':day_id' => $day_id, ':person_id' => $person_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        }
        catch (PDOException $e) {
            throw new Exception('Database query error shift_class.php');
        }

        $shifts=array();
        $shifts["shifts"]=array();
        while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
			$shifts_item=array(
				"id"         => (int)$id,
				"yearweek"   => (string)$yearweek,
				"day_id"     => (int)$day_id,
				"person_id"  => (int)$person_id,
				"start"      => (float)$start,
				"end"        => (float)$end,
				"hours"      => (float)$end-(float)$start-(float)$breaks,
				"breaks"      => (float)$breaks
			);
			array_push($shifts["shifts"], $shifts_item);
        }
        return $shifts;
    }

    public function updateWhereId(int $data_id, int $id, float $start, float $end) {
        global $pdo;
        $data_id    = trim($data_id);
		$id     	= trim($id);
        $start	    = trim($start);
        $end        = trim($end);
        $shift      = $this->getWhereId($data_id, $id);
        $break      = $this->getShiftBreaks($data_id, $shift["yearweek"], $start, $end);
        $query = 'UPDATE datadienstplandb.shifts SET start = :start, end = :end , breaks = :break WHERE data_id = :data_id AND id = :id';

        $values     = array(':data_id' => $data_id, ':id' => $id, ':start' => $start, ':end' => $end, ':break' => $break);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error shift_class.php');
        }
        $set_hours = new Person_hours();
        $set_hours->updateWhere($data_id, $shift["person_id"], $shift["yearweek"], "is");
        return array(
            "id"        => (int)$id,
            "day_id"    => (int)$shift["day_id"],
            "person_id" => (int)$shift["person_id"],
            "start"     => (float)$start,
            "end"       => (float)$end,
            "breaks"    => (float)$break
        );
    } 
    public function updateStartWhereYearweekDayPersonStart(int $data_id, string $yearweek, int $day_id, int $person_id, float $start, float $end, float $value) {
        global $pdo;
        $data_id    = trim($data_id);
		$yearweek	= trim($yearweek);
		$day_id 	= trim($day_id);
		$person_id	= trim($person_id);
        $start	    = trim($start);
        $end	    = trim($end);
        $value      = trim($value);
        $break      = $this->getShiftBreaks($data_id, $yearweek, $start, $end);
        $query = 'UPDATE datadienstplandb.shifts SET start = :value, breaks = :break WHERE data_id = :data_id AND yearweek = :yearweek AND day_id = :day_id AND person_id = :person_id AND start = :start';

        $values     = array(':data_id' => $data_id, ':yearweek' => $yearweek, ':day_id' => $day_id, ':person_id' => $person_id, ':start' => $start, ':value' => $value, ':break' => $break);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error shift_class.php');
        }
        $set_hours = new Person_hours();
        $set_hours->updateWhere($data_id, $person_id, $yearweek, "is");
    } 
    public function updateStartWhereYearweekStartLt(int $data_id, string $yearweek, float $start, float $end, float $value) {
        global $pdo;
        $data_id    = trim($data_id);
		$yearweek	= trim($yearweek);
        $start	    = trim($start);
        $end	    = trim($end);
        $value      = trim($value);
        $break      = $this->getShiftBreaks($data_id, $yearweek, $start, $end);
        $query = 'UPDATE datadienstplandb.shifts SET start = :value, breaks = :break WHERE data_id = :data_id AND yearweek = :yearweek AND start < :start';

        $values     = array(':data_id' => $data_id, ':yearweek' => $yearweek, ':day_id' => $day_id, ':person_id' => $person_id, ':start' => $start, ':value' => $value, ':break' => $break);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error shift_class.php');
        }
        $set_hours = new Person_hours();
        $set_hours->updateAllPersonsWhere($data_id, $yearweek, "is");
    }
    public function updateEndWhereYearweekDayPersonStart(int $data_id, string $yearweek, int $day_id, int $person_id, float $start, float $end, float $value) {
        global $pdo;
        $data_id    = trim($data_id);
		$yearweek	= trim($yearweek);
		$day_id 	= trim($day_id);
		$person_id	= trim($person_id);
        $start	    = trim($start);
        $end	    = trim($end);
        $value      = trim($value);
        $break      = $this->getShiftBreaks($data_id, $yearweek, $start, $end);
        $query = 'UPDATE datadienstplandb.shifts SET end = :value, breaks = :break WHERE data_id = :data_id AND yearweek = :yearweek AND day_id = :day_id AND person_id = :person_id AND start = :start';

        $values         = array(':data_id' => $data_id, ':yearweek' => $yearweek, ':day_id' => $day_id, ':person_id' => $person_id, ':start' => $start, ':value' => $value, ':break' => $break);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error shift_class.php');
        }
        $set_hours = new Person_hours();
        $set_hours->updateWhere($data_id, $person_id, $yearweek, "is");
    }  
    public function updateEndWhereYearweekEndGt(int $data_id, string $yearweek, float $start, float $end, float $value) {
        global $pdo;
        $data_id    = trim($data_id);
		$yearweek	= trim($yearweek);
        $start	    = trim($start);
        $end	    = trim($end);
        $value      = trim($value);
        $break      = $this->getShiftBreaks($data_id, $yearweek, $start, $end);
        $query = 'UPDATE datadienstplandb.shifts SET end = :value, breaks = :break WHERE data_id = :data_id AND yearweek = :yearweek AND end > :end';

        $values         = array(':data_id' => $data_id, ':yearweek' => $yearweek, ':day_id' => $day_id, ':person_id' => $person_id, ':end' => $end, ':value' => $value, ':break' => $break);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error shift_class.php');
        }

        $set_hours = new Person_hours();
        $set_hours->updateAllPersonsWhere($data_id, $yearweek, "is");
    }
	public function removeWhereId(int $data_id, int $id) {
        global $pdo;

        $data_id   = trim($data_id);
        $id 	   = trim($id);
        $shift     = $this->getWhereId($data_id, $id);
        $query   = "DELETE FROM datadienstplandb.shifts WHERE data_id = :data_id AND id = :id";
        $values  = array(':data_id' => $data_id, ':id' => $id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error shift_class.php');
        }
        $set_hours = new Person_hours();
        $set_hours->updateWhere($data_id, $shift["person_id"], $shift["yearweek"], "is");
        return $id;
    }
	public function removeWhereDayPerson(int $data_id, int $day_id, int $person_id) {
        global $pdo;

        $data_id   = trim($data_id);
        $day_id	   = trim($day_id);
        $person_id = trim($person_id);
        $query   = "DELETE FROM datadienstplandb.shifts WHERE data_id = :data_id AND day_id = :day_id AND person_id = :person_id";
        $values  = array(':data_id' => $data_id, ':day_id' => $day_id, ':person_id' => $person_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error shift_class.php');
        }
        $set_hours = new Person_hours();
        $set_hours->updateAllWherePerson($data_id, $person_id, "is");
        return $person_id;
    }
	public function removeWhereYearweekDayPerson(int $data_id, string $yearweek, int $day_id, int $person_id) {
        global $pdo;

        $data_id   = trim($data_id);
        $yearweek  = trim($yearweek);
        $day_id	   = trim($day_id);
        $person_id = trim($person_id);
        $query   = "DELETE FROM datadienstplandb.shifts WHERE data_id = :data_id AND yearweek = :yearweek AND day_id = :day_id AND person_id = :person_id";
        $values  = array(':data_id' => $data_id, ':yearweek' => $yearweek, ':day_id' => $day_id, ':person_id' => $person_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error shift_class.php');
        }
        $set_hours = new Person_hours();
        $set_hours->updateWhere($data_id, $person_id, $yearweek, "is");
        return $person_id;
    }
	public function removeWhereYearweekGeDayPerson(int $data_id, string $yearweek, int $day_id, int $person_id) {
        global $pdo;
        $data_id   = trim($data_id);
        $yearweek  = trim($yearweek);
        $day_id	   = trim($day_id);
        $person_id = trim($person_id);
        $query   = "DELETE FROM datadienstplandb.shifts WHERE data_id = :data_id AND yearweek >= :yearweek AND day_id = :day_id AND person_id = :person_id";
        $values  = array(':data_id' => $data_id, ':yearweek' => $yearweek, ':day_id' => $day_id, ':person_id' => $person_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error shift_class.php');
        }
        $set_hours = new Person_hours();
        $set_hours->updateWhereGe($data_id, $person_id, $yearweek, "is");
        return $person_id;
    }
	public function removeWhereYearweekDayPersonStart(int $data_id, string $yearweek, int $day_id, int $person_id, float $start) {
        global $pdo;

        $data_id   = trim($data_id);
        $yearweek  = trim($yearweek);
        $day_id	   = trim($day_id);
        $person_id = trim($person_id);
        $start	   = trim($start);
        $query   = "DELETE FROM datadienstplandb.shifts WHERE data_id = :data_id AND yearweek = :yearweek AND day_id = :day_id AND person_id = :person_id AND start = :start";
        $values  = array(':data_id' => $data_id, ':yearweek' => $yearweek, ':day_id' => $day_id, ':person_id' => $person_id, ':start' => $start);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error shift_class.php');
        }
        $set_hours = new Person_hours();
        $set_hours->updateWhere($data_id, $person_id, $yearweek, "is");
        return $person_id;
    }
	public function removeWhereYearweekDay(int $data_id, string $yearweek, int $day_id) {
        global $pdo;

        $data_id   = trim($data_id);
        $yearweek  = trim($yearweek);
        $day_id	   = trim($day_id);
        $query   = "DELETE FROM datadienstplandb.shifts WHERE data_id = :data_id AND yearweek = :yearweek AND day_id = :day_id";
        $values  = array(':data_id' => $data_id, ':yearweek' => $yearweek, ':day_id' => $day_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error shift_class.php');
        }
        $set_hours = new Person_hours();
        $set_hours->updateAllPersonsWhere($data_id, $yearweek, "is");
        return $day_id;
    }
    public function removeWhereDataId(int $data_id) {
        global $pdo;
        $data_id = trim($data_id);
        $query   = "DELETE FROM datadienstplandb.shifts WHERE data_id = :data_id";
        $values  = array(':data_id' => $data_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error shift_class.php');
        }
    } 
}
