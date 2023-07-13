<?php

class Person_hours
{
	private $data_id;
	private $person_id;
	private $yearweek;
	private $hours_should;
	/* Constructor */
	public function __construct() {
		$this->data_id    = NULL;
		$this->person_id  = NULL;
		$this->yearweek   = NULL;
		$this->hours_should = NULL;
	}
	
	/* Destructor */
	public function __destruct() { }

    public function checkFreeDay(int $data_id, string $yearweek_for, int $person_id, int $day_id) {
        global $pdo;
        $is_free = FALSE;
        $is_noworkingday = FALSE;
        $dt = new DateTime;
        $check_date = $dt->setISODate(substr($yearweek_for, 0,4), substr($yearweek_for, 5, 7));
        $check_date = date_format($check_date,"Y-m-d");
        $check_date = date("Y-m-d", strtotime($check_date. "+${day_id} days"));
    // check FREE
        //check vacations
        if ($is_free === FALSE) {
            $query  = 'SELECT id FROM datadienstplandb.person_vacations WHERE data_id = :data_id AND person_id = :person_id AND start <= :check_date AND end >= :check_date;';
            $values = array(':data_id' => $data_id, ':person_id' => $person_id, ':check_date' => $check_date);
            try { $res_v = $pdo->prepare($query); $res_v->execute($values); } catch (PDOException $e) { throw new Exception('Database query error person_hours_class.php'); }
            $v = $res_v->fetch(PDO::FETCH_ASSOC);
            if (isset($v["id"])) {
                $is_free = TRUE;
            }
            unset($v);
        }
        //check illnes
        if ($is_free === FALSE) {
            $query  = 'SELECT id FROM datadienstplandb.person_illnes WHERE data_id = :data_id AND person_id = :person_id AND start <= :check_date AND end >= :check_date;';
            $values = array(':data_id' => $data_id, ':person_id' => $person_id, ':check_date' => $check_date);
            try { $res_i = $pdo->prepare($query); $res_i->execute($values); } catch (PDOException $e) { throw new Exception('Database query error person_hours_class.php'); }
            $i = $res_i->fetch(PDO::FETCH_ASSOC);
            if (isset($i["id"])) {
                $is_free = TRUE;
            }
            unset($i);
        }
        //check closingtime
        if ($is_free === FALSE){
            $query  = 'SELECT * FROM datadienstplandb.closingtimes WHERE data_id = :data_id AND start <= :check_date AND end >= :check_date;';
            $values = array(':data_id' => $data_id, ':check_date' => $check_date);
            try { $res_cl = $pdo->prepare($query); $res_cl->execute($values); } catch (PDOException $e) { throw new Exception('Database query error person_hours_class.php'); }
            $c = $res_cl->fetch(PDO::FETCH_ASSOC);
            if (isset($c["id"])) {
                if ((int)$c["lawful"] === 1) {
                    $is_free = TRUE;
                } else {
                    $query  = 'SELECT id FROM datadienstplandb.closingtime_persons WHERE data_id = :data_id AND closingtime_id = :closingtime_id AND person_id = :person_id;';
                    $values = array(':data_id' => $data_id, ':person_id' => $person_id, ':closingtime_id' => $c["id"]);
                    try { $res_cp = $pdo->prepare($query); $res_cp->execute($values); } catch (PDOException $e) { throw new Exception('Database query error person_hours_class.php'); }
                    $cp = $res_cp->fetch(PDO::FETCH_ASSOC);
                    if (isset($cp["id"])) {
                        $is_free = TRUE;
                    }
                    unset($cp);
                }
            }
            unset($c);
        }
        return $is_free;
	}
    public function calculateHoursShould(int $data_id, string $yearweek_for, int $person_id) {
    // get hours should be
        global $pdo;
        $hours_should = 0;
        // get hours
        $hours_week;
        $query      = 'SELECT * FROM datadienstplandb.person_changes WHERE data_id = :data_id AND day_id = 999 AND yearweek <= :yearweek AND change_key = "h" AND person_id = :person_id ORDER BY yearweek DESC';
        $values     = array(':data_id' => $data_id, ':yearweek' => $yearweek_for, ':person_id' => $person_id);
        try { $res_c = $pdo->prepare($query); $res_c->execute($values);
        } catch (PDOException $e) { throw new Exception('Database query error person_hours_class.php'); }
        $h = $res_c->fetch(PDO::FETCH_ASSOC);
        if (isset($h["value"])) { 
            $hours_week = (float)$h["value"];
            unset($h);
        } else {
            $query      = 'SELECT hours FROM datadienstplandb.persons WHERE data_id = :data_id AND id = :person_id;';
            $values     = array(':data_id' => $data_id, ':person_id' => $person_id);
            try { $res_p = $pdo->prepare($query); $res_p->execute($values);
            } catch (PDOException $e) { throw new Exception('Database query error person_hours_class.php');  };
            $hours_week = $res_p->fetch(PDO::FETCH_ASSOC);
            $hours_week = (float)$hours_week["hours"];
        }

        $query = 'SELECT * FROM datadienstplandb.rosters WHERE data_id = :data_id AND yearweek = :yearweek;';
        $values     = array(':data_id' => $data_id, ':yearweek' => $yearweek_for);
        try {
            $res_y = $pdo->prepare($query);
            $res_y->execute($values);
        } catch (PDOException $e) { throw new Exception('Database query error person_hours_class.php'); }
        $row_yearweek = $res_y->fetch(PDO::FETCH_ASSOC);
        $days_for = explode(',', $row_yearweek['days']);
    // get FREE
        $freedays_days = 0;
        $noworkingday_days = 0;

        for ($day_id=0; $day_id < count($days_for); $day_id++) {
            $is_free = FALSE;
            $is_noworkingday = FALSE;
        // check FREE
            //check label

            $query  = 'SELECT value FROM datadienstplandb.person_changes WHERE data_id = :data_id AND day_id = :day_id AND yearweek <= :yearweek_for AND change_key = "sf" AND person_id = :person_id ORDER BY yearweek DESC;';
            $values = array(':data_id' => $data_id, ':yearweek_for' => $yearweek_for, ':day_id' => $day_id, ':person_id' => $person_id);
            try { $res_l = $pdo->prepare($query); $res_l->execute($values); } catch (PDOException $e) { throw new Exception('Database query error person_hours_class.php'); }
            $l = $res_l->fetch(PDO::FETCH_ASSOC);
            if ((isset($l["value"])) && ($l["value"] === "true")) {
                $is_noworkingday = TRUE;
                $noworkingday_days = $noworkingday_days+1; 
            }
            if ($is_noworkingday === FALSE) {
                $is_free = $this->checkFreeDay($data_id, $yearweek_for, $person_id, $day_id);
            };
            if ($is_free === TRUE) {
                $freedays_days = $freedays_days+1;
            }
        }
        $freedays_hours = ($hours_week/(count($days_for)-$noworkingday_days))*$freedays_days;

        $hours_should = $hours_should+$hours_week-$freedays_hours;
        $hours_should = round($hours_should,2);
        return $hours_should;
    }
    public function calculateHoursIs(int $data_id, string $yearweek_for, int $person_id) {
        global $pdo;
    // get hours is
        $hours_is = 0;
        $query = 'SELECT SUM(end-start-breaks) FROM datadienstplandb.shifts WHERE data_id = :data_id AND yearweek = :yearweek AND person_id = :person_id;';
        $values     = array(':data_id' => $data_id, ':yearweek' => $yearweek_for, ':person_id' => $person_id);
        try { $res_is = $pdo->prepare($query); $res_is->execute($values);
        } catch (PDOException $e) { throw new Exception('Database query error person_hours_class.php'); }
        $hours_is = $res_is->fetch(PDO::FETCH_ASSOC);
        $hours_is = $hours_is["SUM(end-start-breaks)"];


        // get mpa_all

        // get overtime_manual
        $query = 'SELECT SUM(overtime) FROM datadienstplandb.person_overtimes_manual WHERE data_id = :data_id AND yearweek = :yearweek AND person_id = :person_id;';
        $values = array(':data_id' => $data_id, ':yearweek' => $yearweek_for, ':person_id' => $person_id);
        try {
            $res_o = $pdo->prepare($query);
            $res_o->execute($values);
        } catch (PDOException $e) { throw new Exception('Database query error person_hours_class.php'); }
        $overtime_m = $res_o->fetch(PDO::FETCH_ASSOC);
        if (!empty($overtime_m)) {
            $hours_is = $hours_is+$overtime_m["SUM(overtime)"];
        }

        $query = 'SELECT * FROM datadienstplandb.rosters WHERE data_id = :data_id AND yearweek = :yearweek;';
        $values     = array(':data_id' => $data_id, ':yearweek' => $yearweek_for);
        try {
            $res_y = $pdo->prepare($query);
            $res_y->execute($values);
        } catch (PDOException $e) { throw new Exception('Database query error person_hours_class.php'); }
        $row_yearweek = $res_y->fetch(PDO::FETCH_ASSOC);
        $days_for = explode(',', $row_yearweek['days']);

        $query      = 'SELECT mpa FROM datadienstplandb.persons WHERE data_id = :data_id AND id = :person_id;';
        $values     = array(':data_id' => $data_id, ':person_id' => $person_id);
        try { $res_person = $pdo->prepare($query); $res_person->execute($values);
        } catch (PDOException $e) { throw new Exception('Database query error person_hours_class.php');  };
        $mpa = $res_person->fetch(PDO::FETCH_ASSOC);
        $mpa = explode(',', $mpa["mpa"]);
        for ($day_id=0; $day_id < count($days_for); $day_id++) {
            $dt = new DateTime;
            $check_date = $dt->setISODate(substr($yearweek_for, 0,4), substr($yearweek_for, 5, 7));
            $check_date = date_format($check_date,"Y-m-d");
            $check_date = date("Y-m-d", strtotime($check_date. "+${day_id} days"));
        //get betterments
            $query  = 'SELECT hours FROM datadienstplandb.person_betterments WHERE data_id = :data_id AND person_id = :person_id AND start <= :check_date AND end >= :check_date;';
            $values = array(':data_id' => $data_id, ':person_id' => $person_id, ':check_date' => $check_date);
            try { $res_b = $pdo->prepare($query); $res_b->execute($values); } catch (PDOException $e) { throw new Exception('Database query error person_hours_class.php'); }
            $b = $res_b->fetch(PDO::FETCH_ASSOC);
            if (isset($b["hours"])) {
                $hours_is = $hours_is+$b["hours"];
            }
            $is_free = $this->checkFreeDay($data_id, $yearweek_for, $person_id, $day_id);
            if ($is_free) {continue;}
        // get mpa_day
            $query='SELECT value FROM datadienstplandb.person_changes WHERE data_id = :data_id AND person_id = :person_id AND change_key = "m" AND day_id = :day_id AND yearweek <= :yearweek ORDER BY yearweek DESC;';
            $values = array(':data_id' => $data_id, ':person_id' => $person_id, ':yearweek' => $yearweek_for, ':day_id' => $day_id);
            try { $res_m = $pdo->prepare($query); $res_m->execute($values); } catch (PDOException $e) { throw new Exception('Database query error person_hours_class.php'); }
            $m = $res_m->fetch(PDO::FETCH_ASSOC);
            if (isset($m["value"])) {
                $hours_is = $hours_is+(float)$m["value"];
            } else {
                $hours_is = $hours_is+(float)$mpa[$day_id];
            }
        }
        $hours_is = round($hours_is, 2);
        return $hours_is;
    }
    public function getHoursTotalWhereYearweek(int $data_id, string $yearweek_for, int $person_id) {
        global $pdo;
        $query = 'SELECT SUM(hours_is), SUM(hours_should), yearweek FROM datadienstplandb.person_hours WHERE data_id = :data_id AND yearweek <= :yearweek AND person_id = :person_id';
        $values = array(':data_id' => $data_id, ':person_id' => $person_id, ':yearweek' => $yearweek_for);
        try { $res_h = $pdo->prepare($query); $res_h->execute($values); } catch (PDOException $e) { throw new Exception('Database query error person_hours_class.php'); }
        $hours=array();
        $row = $res_h->fetch(PDO::FETCH_ASSOC);
        return array(
            "person_id"     => (int)$person_id,
            "hours_is"      => (float)$row["SUM(hours_is)"],
            "hours_should"  => (float)$row["SUM(hours_should)"]
        );
    }
    public function getHoursAll(int $data_id, int $person_id) {
        global $pdo;
        $query = 'SELECT * FROM datadienstplandb.person_hours WHERE data_id = :data_id AND person_id = :person_id';
        $values = array(':data_id' => $data_id, ':person_id' => $person_id);
        try { $res_h = $pdo->prepare($query); $res_h->execute($values); } catch (PDOException $e) { throw new Exception('Database query error person_hours_class.php'); }
        $hours=array();
        while ($row = $res_h->fetch(PDO::FETCH_ASSOC)) {
            $item = array(
                "yearweek"      => (string)$row["yearweek"],
                "person_id"     => (int)$row["person_id"],
                "hours_is"      => (float)$row["hours_is"],
                "hours_should"  => (float)$row["hours_should"]
            );
            array_push($hours, $item);
        }
        return $hours;
    }
    public function getHoursWhereYearweek(int $data_id, string $yearweek_for, int $person_id) {
        global $pdo;
        $query = 'SELECT * FROM datadienstplandb.person_hours WHERE data_id = :data_id AND yearweek = :yearweek AND person_id = :person_id';
        $values = array(':data_id' => $data_id, ':person_id' => $person_id, ':yearweek' => $yearweek_for);
        try { $res_h = $pdo->prepare($query); $res_h->execute($values); } catch (PDOException $e) { throw new Exception('Database query error person_hours_class.php'); }
        $h = $res_h->fetch(PDO::FETCH_ASSOC);
        if (!isset($h["hours_is"])) {
            $h = $this->setHoursWhereYearweek($data_id, $yearweek_for, $person_id);
        }
        if (!isset($h["hours_is"])) {
            return FALSE;
        }
        return array(
            "yearweek"      => (string)$h["yearweek"],
            "person_id"     => (int)$h["person_id"],
            "hours_is"      => (float)$h["hours_is"],
            "hours_should"  => (float)$h["hours_should"]
        );
    }
    public function getHoursWhereYearweekGeLe(int $data_id, string $yearweek_start, string $yearweek_end, int $person_id) {
        global $pdo;
        $query = 'SELECT * FROM datadienstplandb.person_hours WHERE data_id = :data_id AND yearweek >= :yearweek_start AND yearweek <= :yearweek_end AND person_id = :person_id';
        $values = array(':data_id' => $data_id, ':person_id' => $person_id, ':yearweek_start' => $yearweek_start, ':yearweek_end' => $yearweek_end);
        try { $res_h = $pdo->prepare($query); $res_h->execute($values); } catch (PDOException $e) { throw new Exception('Database query error person_hours_class.php'); }
		$hours=array();
        while ($row = $res_h->fetch(PDO::FETCH_ASSOC)) {
			$hours_item = array(
				"yearweek"      => (string)$row["yearweek"],
				"person_id"     => (int)$row["person_id"],
				"hours_is"      => (float)$row["hours_is"],
				"hours_should"  => (float)$row["hours_should"]
			);
			array_push($hours, $hours_item);
		}
		return $hours;
    }
    public function getHoursWhereYearweekGe(int $data_id, string $yearweek_for, int $person_id) {
        global $pdo;
        $query = 'SELECT * FROM datadienstplandb.person_hours WHERE data_id = :data_id AND yearweek >= :yearweek AND person_id = :person_id';
        $values = array(':data_id' => $data_id, ':person_id' => $person_id, ':yearweek' => $yearweek_for);
        try { $res_h = $pdo->prepare($query); $res_h->execute($values); } catch (PDOException $e) { throw new Exception('Database query error person_hours_class.php'); }
        $hours=array();
        while ($row = $res_h->fetch(PDO::FETCH_ASSOC)) {
			$hours_item = array(
				"yearweek"      => (string)$row["yearweek"],
				"person_id"     => (int)$row["person_id"],
				"hours_is"      => (float)$row["hours_is"],
				"hours_should"  => (float)$row["hours_should"]
			);
			array_push($hours, $hours_item);
		}
		return $hours;
    }
    public function getHoursWhereYearweekLt(int $data_id, string $yearweek_for, int $person_id) {
        global $pdo;
        $query = 'SELECT * FROM datadienstplandb.person_hours WHERE data_id = :data_id AND yearweek < :yearweek AND person_id = :person_id';
        $values = array(':data_id' => $data_id, ':person_id' => $person_id, ':yearweek' => $yearweek_for);
        try { $res_h = $pdo->prepare($query); $res_h->execute($values); } catch (PDOException $e) { throw new Exception('Database query error person_hours_class.php'); }
        $hours=array();
        while ($row = $res_h->fetch(PDO::FETCH_ASSOC)) {
			$hours_item = array(
				"yearweek"      => (string)$row["yearweek"],
				"person_id"     => (int)$row["person_id"],
				"hours_is"      => (float)$row["hours_is"],
				"hours_should"  => (float)$row["hours_should"]
			);
			array_push($hours, $hours_item);
		}
		return $hours;
    }
    public function getHoursWhereYearweekLe(int $data_id, string $yearweek_for, int $person_id) {
        global $pdo;
        $query = 'SELECT * FROM datadienstplandb.person_hours WHERE data_id = :data_id AND yearweek <= :yearweek AND person_id = :person_id';
        $values = array(':data_id' => $data_id, ':person_id' => $person_id, ':yearweek' => $yearweek_for);
        try { $res_h = $pdo->prepare($query); $res_h->execute($values); } catch (PDOException $e) { throw new Exception('Database query error person_hours_class.php'); }
        $hours=array();
        while ($row = $res_h->fetch(PDO::FETCH_ASSOC)) {
			$hours_item = array(
				"yearweek"      => (string)$row["yearweek"],
				"person_id"     => (int)$row["person_id"],
				"hours_is"      => (float)$row["hours_is"],
				"hours_should"  => (float)$row["hours_should"]
			);
			array_push($hours, $hours_item);
		}
		return $hours;
    }
    public function getHoursAllPersonsWhereYearweek(int $data_id, string $yearweek_for) {
        global $pdo;
        $query = 'SELECT * FROM datadienstplandb.person_hours WHERE data_id = :data_id AND yearweek = :yearweek';
        $values = array(':data_id' => $data_id, ':yearweek' => $yearweek_for);
        try { $res_h = $pdo->prepare($query); $res_h->execute($values); } catch (PDOException $e) { throw new Exception('Database query error person_hours_class.php'); }
        $hours=array();
        while ($row = $res_h->fetch(PDO::FETCH_ASSOC)) {
			$hours_item = array(
				"yearweek"      => (string)$row["yearweek"],
				"person_id"     => (int)$row["person_id"],
				"hours_is"      => (float)$row["hours_is"],
				"hours_should"  => (float)$row["hours_should"]
			);
			array_push($hours, $hours_item);
		}
		return $hours;
    }
    public function setHoursWhereYearweek(int $data_id, string $yearweek_for, int $person_id) {
        global $pdo;
        $hours_should   = $this->calculateHoursShould($data_id, $yearweek_for, $person_id);
        $hours_is       = $this->calculateHoursIs($data_id, $yearweek_for, $person_id);
        
        
        $query = 'SELECT activated FROM datadienstplandb.persons WHERE data_id = :data_id AND id = :person_id;';
        $values = array(':data_id' => $data_id, ':person_id' => $person_id);
        try { $res_p = $pdo->prepare($query); $res_p->execute($values); } catch (PDOException $e) { throw new Exception('Database query error person_hours_class.php'); }
        $a = $res_p->fetch(PDO::FETCH_ASSOC);
        $test = $a["activated"];
        if ($a["activated"] > $yearweek_for) {return;}


        $query = 'INSERT INTO datadienstplandb.person_hours  (data_id, yearweek, person_id, hours_is, hours_should) VALUES (:data_id, :yearweek, :person_id, :hours_is, :hours_should) ON DUPLICATE KEY UPDATE hours_is = :hours_is, hours_should = :hours_should';
        $values = array(':data_id' => $data_id, ':person_id' => $person_id, ':yearweek' => $yearweek_for, ':hours_is' => $hours_is, ':hours_should' => $hours_should);
        try { $res_h = $pdo->prepare($query); $res_h->execute($values); } catch (PDOException $e) { throw new Exception('Database query error person_hours_class.php'); }
        return array(
            "yearweek"      => (string)$yearweek_for,
            "person_id"     => (int)$person_id,
            "hours_is"      => (float)$hours_is,
            "hours_should"  => (float)$hours_should
        );
    }
 
    public function updateWhere(int $data_id, int $person_id, string $yearweek, string $is_should) {   
        global $pdo;
        $data_id	= trim($data_id);
        $person_id	= trim($person_id);
        $is_should  = trim($is_should);
        $yearweek   = trim($yearweek);

		$query;
        $values;
		if ($is_should === "is") {
			$value  = $this->calculateHoursIs($data_id, $yearweek, $person_id);
            $query  = "UPDATE datadienstplandb.person_hours SET hours_is = :value WHERE data_id = :data_id AND person_id = :person_id AND yearweek = :yearweek";
            $values = array(':data_id' => $data_id, ':person_id' => $person_id, ':yearweek' => $yearweek, ':value' => $value);
		} else if ($is_should === "should") {
			$value  = $this->calculateHoursShould($data_id, $yearweek, $person_id);
            $query  = "UPDATE datadienstplandb.person_hours SET hours_should = :value WHERE data_id = :data_id AND person_id = :person_id AND yearweek = :yearweek";
            $values = array(':data_id' => $data_id, ':person_id' => $person_id, ':yearweek' => $yearweek, ':value' => $value);
		} else if ($is_should === "both") {
			$value_1	= $this->calculateHoursIs($data_id, $yearweek, $person_id);
			$value_2	= $this->calculateHoursShould($data_id, $yearweek, $person_id);
            $query  = "UPDATE datadienstplandb.person_hours SET hours_is = :value_1, hours_should = :value_2 WHERE data_id = :data_id AND person_id = :person_id AND yearweek = :yearweek";
            $values = array(':data_id' => $data_id, ':person_id' => $person_id, ':yearweek' => $yearweek, ':value_1' => $value_1, ':value_2' => $value_2);
		}

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error person_hours_class.php');
        }
    }   
    public function updateWhereGe(int $data_id, int $person_id, string $yearweek, string $is_should) {   
		$set_hours = $this->getHoursWhereYearweekGe($data_id, $yearweek, $person_id);
		foreach($set_hours as $key=>$value) {
            $this->updateWhere($data_id, $person_id, $value['yearweek'], $is_should);
		}
    }
    public function updateWhereLt(int $data_id, int $person_id, string $yearweek, string $is_should) {   
		$set_hours = $this->getHoursWhereYearweekLt($data_id, $yearweek, $person_id);
		foreach($set_hours as $key=>$value) {
            $this->updateWhere($data_id, $person_id, $value['yearweek'], $is_should);
		}
    }
    public function updateWhereBetweenDate(int $data_id, int $person_id, $start, $end, string $is_should) {
        $data_id	= trim($data_id);
        $person_id	= trim($person_id);
        $start	    = trim($start);
        $end	    = trim($end);
        $is_should  = trim($is_should);

		$dt 			= new DateTime($start);
		$week 			= $dt->format("W");
		if (strlen($week) === 1) {$week = "0$week";}
		$year			= substr($start, 0,4);
		$yearweek_start = "$year-$week";

		$dt 			= new DateTime($end);
		$week 			= $dt->format("W");
		if (strlen($week) === 1) {$week = "0$week";}
		$year			= substr($end, 0,4);
		$yearweek_end = "$year-$week";

		$set_hours = $this->getHoursWhereYearweekGeLe($data_id, $yearweek_start, $yearweek_end, $person_id);
		foreach($set_hours as $key=>$value) {
			$yearweek_for = $value['yearweek'];
			if (($yearweek_for >= $yearweek_start) && ($yearweek_for <= $yearweek_end)) {
				$this->updateWhere($data_id, $person_id, $yearweek_for, $is_should);
			}
		}
    }
    public function updateAllWherePerson(int $data_id, int $person_id, string $is_should) {
        $all = $this->getHoursAll($data_id, $person_id);
        foreach($all as $key=>$value) {
            $this->updateWhere($data_id, $person_id, $value["yearweek"], $is_should);
        }
    }
    public function updateAllPersonsWhere(int $data_id, string $yearweek, string $is_should) {   
		$set_hours = $this->getHoursAllPersonsWhereYearweek($data_id, $yearweek);
		foreach($set_hours as $key=>$value) {
            $this->updateWhere($data_id, $value["person_id"], $yearweek, $is_should);
		}
    }
    public function removeWhereYwLt(int $data_id, int $person_id, string $yearweek) {
        global $pdo;
        $data_id = trim($data_id);
        $query   = "DELETE FROM datadienstplandb.person_hours WHERE data_id = :data_id AND person_id = :person_id AND yearweek < :yearweek";
        $values  = array(':data_id' => $data_id, ':person_id' => $person_id, ':yearweek' => $yearweek);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error person_hours_class.php');
        }
    }
    public function removeWherePerson(int $data_id, int $person_id) {
        global $pdo;
        $data_id = trim($data_id);
        $query   = "DELETE FROM datadienstplandb.person_hours WHERE data_id = :data_id AND person_id = :person_id";
        $values  = array(':data_id' => $data_id, ':person_id' => $person_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error person_hours_class.php');
        }
    }
    public function removeWhereDataId(int $data_id) {
        global $pdo;
        $data_id = trim($data_id);
        $query   = "DELETE FROM datadienstplandb.person_hours WHERE data_id = :data_id";
        $values  = array(':data_id' => $data_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error person_hours_class.php');
        }
    }
}
