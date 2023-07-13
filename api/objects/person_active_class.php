<?php
require_once 'person_change_class.php';
require_once 'shift_class.php';
require_once 'person_betterment_class.php';
require_once 'person_overtime_manual_class.php';
require_once 'person_illnes_class.php';
require_once 'person_vacation_class.php';
require_once 'settings_labels_class.php';
require_once 'person_hours_class.php';

class Person_active
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

    public function getActive(int $data_id, string $yearweek, int $person_id, bool $get_removed, bool $just_name) {
        global $pdo;
		$data_id	 = trim($data_id);
        $yearweek_is = $yearweek;
        $query       = 'SELECT * FROM datadienstplandb.persons WHERE data_id = :data_id AND id = :person_id';
        $values      = array(':data_id' => $data_id, ':person_id' => $person_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        }
        catch (PDOException $e) {
            throw new Exception('Database query error person_active_class.php');
        }
        $row = $res->fetch(PDO::FETCH_ASSOC);
        extract($row);
        if (($activated > $yearweek_is) && (!$just_name)) {return;}
        $hours_def  = $hours;
    // get removed
        $query      = 'SELECT * FROM datadienstplandb.person_changes WHERE data_id = :data_id AND day_id = 999 AND yearweek <= :yearweek AND change_key = "r" AND person_id = :person_id  ORDER BY yearweek DESC';
        $values     = array(':data_id' => $data_id, ':yearweek' => $yearweek_is, ':person_id' => $person_id);
        try {
            $res_c = $pdo->prepare($query);
            $res_c->execute($values);
        } catch (PDOException $e) { throw new Exception('Database query error person_active_class.php'); }
        $r = $res_c->fetch(PDO::FETCH_ASSOC);
        if ((isset($r["value"])) && (!$get_removed)) { 
            if ($r["value"] <= $yearweek_is) {
                unset($r);
                return;
            }
        } else if ((!isset($r["value"])) && ($get_removed)) { 
            unset($r);
            return;
        } else if ((isset($r["value"])) && ($get_removed)) { 
            if ($r["value"] > $yearweek_is) {
                unset($r);
                return;
            }
        }

        // get name
        $query      = 'SELECT * FROM datadienstplandb.person_changes WHERE data_id = :data_id AND day_id = 999 AND yearweek <= :yearweek AND change_key = "n" AND person_id = :person_id ORDER BY yearweek DESC';
        $values     = array(':data_id' => $data_id, ':yearweek' => $yearweek_is, ':person_id' => $person_id);
        try {
            $res_c = $pdo->prepare($query);
            $res_c->execute($values);
        } catch (PDOException $e) { throw new Exception('Database query error person_active_class.php'); }
        $n = $res_c->fetch(PDO::FETCH_ASSOC);
        if (isset($n["value"])) { 
            $name = $n["value"];
            unset($n);
        }

        if ($just_name) {
            return array(
                "id"    	 => (int)$person_id,
                "name"	     => (string)$name
            );
        }

    // get others
        $shift = new Shift();
        $shifts = $shift->getWhereYearweekPerson($data_id, $yearweek_is, $person_id);
        $person_betterment = new Person_betterment();
        $betterments = $person_betterment->get($data_id, $person_id);
        $person_overtime_manual = new Person_overtime_manual();
        $overtimes_manual = $person_overtime_manual->get($data_id, $person_id);
        $person_illnes = new Person_illnes();
        $illnesses = $person_illnes->get($data_id, $person_id);
        $person_vacation = new Person_vacation();
        $vacations = $person_vacation->get($data_id, $person_id);
        $settings_labels = new Settings_labels();
        $labels = $settings_labels->get($data_id);
        $labels = $labels["labels"];
    // set changes
        $sa = [false, false, false, false, false];
        $sf = [false, false, false, false, false];
        $sl = [false, false, false, false, false];
        $mpa_def = explode(',', $mpa);
        $mpa_def = array_map('floatval', $mpa_def);
        $freedays_this_week=array();

        $query      = 'SELECT days FROM datadienstplandb.rosters WHERE data_id = :data_id AND yearweek = :yearweek';
        $values     = array(':data_id' => $data_id, ':yearweek' => $yearweek_is);
        try {
            $res_r = $pdo->prepare($query);
            $res_r->execute($values);
        } catch (PDOException $e) { throw new Exception('Database query error person_active_class.php'); }
		$days_de = $res_r->fetch(PDO::FETCH_ASSOC);
        $days_def = explode(',', $days_de["days"]);
        for ($day_id=0; $day_id < count($days_def); $day_id++) {
            // get mpa
            $query      = 'SELECT * FROM datadienstplandb.person_changes WHERE data_id = :data_id AND day_id = :day_id AND yearweek <= :yearweek AND change_key = "m" AND person_id = :person_id ORDER BY yearweek DESC';
            $values     = array(':data_id' => $data_id, ':yearweek' => $yearweek_is, ':day_id' => $day_id, ':person_id' => $person_id);
            try {
                $res_c = $pdo->prepare($query);
                $res_c->execute($values);
            } catch (PDOException $e) { throw new Exception('Database query error person_active_class.php'); }
            $m = $res_c->fetch(PDO::FETCH_ASSOC);
            if (isset($m["value"])) { $mpa_def[$day_id] = (float)$m["value"]; unset($m);};
            //
            // get sa
            $query      = 'SELECT * FROM datadienstplandb.person_changes WHERE data_id = :data_id AND day_id = :day_id AND yearweek <= :yearweek AND change_key = "sa" AND person_id = :person_id ORDER BY yearweek DESC';
            $values     = array(':data_id' => $data_id, ':yearweek' => $yearweek_is, ':day_id' => $day_id, ':person_id' => $person_id);
            try {
                $res_c = $pdo->prepare($query);
                $res_c->execute($values);
            } catch (PDOException $e) { throw new Exception('Database query error person_active_class.php'); }
            $a = $res_c->fetch(PDO::FETCH_ASSOC);
            if (isset($a["value"])) { 
                if (is_numeric($a["value"])) {
                    $sa[$day_id] = (float)$a["value"];
                } else {
                    $sa[$day_id] = filter_var($a["value"], FILTER_VALIDATE_BOOLEAN); 
                }
                unset($a);
            };
            // get sf
            $query      = 'SELECT * FROM datadienstplandb.person_changes WHERE data_id = :data_id AND day_id = :day_id AND yearweek <= :yearweek AND change_key = "sf" AND person_id = :person_id ORDER BY yearweek DESC';
            $values     = array(':data_id' => $data_id, ':yearweek' => $yearweek_is, ':day_id' => $day_id, ':person_id' => $person_id);
            try {
                $res_c = $pdo->prepare($query);
                $res_c->execute($values);
            } catch (PDOException $e) { throw new Exception('Database query error person_active_class.php'); }
            $f = $res_c->fetch(PDO::FETCH_ASSOC);
            if (isset($f["value"])) { $sf[$day_id] = filter_var($f["value"], FILTER_VALIDATE_BOOLEAN); unset($f);};
            // get sl
            $query      = 'SELECT * FROM datadienstplandb.person_changes WHERE data_id = :data_id AND day_id = :day_id AND yearweek <= :yearweek AND change_key = "sl" AND person_id = :person_id ORDER BY yearweek DESC';
            $values     = array(':data_id' => $data_id, ':yearweek' => $yearweek_is, ':day_id' => $day_id, ':person_id' => $person_id);
            try {
                $res_c = $pdo->prepare($query);
                $res_c->execute($values);
            } catch (PDOException $e) { throw new Exception('Database query error person_active_class.php'); }
            $l = $res_c->fetch(PDO::FETCH_ASSOC);
            if (isset($l["value"])) { 
                if (is_numeric($l["value"])) {
                    $sl[$day_id] = (float)$l["value"];
                } else {
                    $sl[$day_id] = filter_var($l["value"], FILTER_VALIDATE_BOOLEAN);
                }
                unset($l);
            }
            array_push($freedays_this_week, false);
            $dt = new DateTime;
            $check_date = $dt->setISODate(substr($yearweek_is, 0,4), substr($yearweek_is, 5, 7));
            $check_date = date_format($check_date,"Y-m-d");
            $check_date = date("Y-m-d", strtotime($check_date. "+${day_id} days"));
        // get FREEDAYS vacations
			if ($freedays_this_week[$day_id] === false) {
				$v_keys = array_column($labels, 'id');
				$v_index = array_search('3', $v_keys);
				foreach($vacations["person_vacations"] as $key=>$value) {
					if (($check_date >= $value['start']) && ($check_date <= $value['end'])) {
						if (isset($value["name"])) {
							$freedays_this_week[$day_id] = $value["name"];
						} else {
							$freedays_this_week[$day_id] = $labels[$v_index]["cut"];
						}
						break;
					}
				}
			}
        // get FREEDAYS illness
			if ($freedays_this_week[$day_id] === false) {
				$i_keys = array_column($labels, 'id');
				$i_index = array_search('1', $i_keys);
				foreach($illnesses["person_illnes"] as $key=>$value) {
					if (($check_date >= $value['start']) && ($check_date <= $value['end'])) {
						if ($yearweek_is === $yearweek_is) {$freedays_this_week[$day_id] = $labels[$i_index]["cut"];}
						break;
					}
				}
			}
        // get FREEDAYS betterment
			if ($freedays_this_week[$day_id] === false) {
				$b_keys = array_column($labels, 'id');
				$b_index = array_search('2', $b_keys);
				foreach($betterments["person_betterments"] as $key=>$value) {
					if (($check_date >= $value['start']) && ($check_date <= $value['end'])) {
						if ($yearweek_is === $yearweek_is) {$freedays_this_week[$day_id] = $labels[$b_index]["cut"];}
					}
				}
			}
        }

        // get hours
        $query      = 'SELECT * FROM datadienstplandb.person_changes WHERE data_id = :data_id AND day_id = 999 AND yearweek <= :yearweek AND change_key = "h" AND person_id = :person_id ORDER BY yearweek DESC';
        $values     = array(':data_id' => $data_id, ':yearweek' => $yearweek_is, ':person_id' => $person_id);
        try {
            $res_c = $pdo->prepare($query);
            $res_c->execute($values);
        } catch (PDOException $e) { throw new Exception('Database query error person_active_class.php'); }
        $h = $res_c->fetch(PDO::FETCH_ASSOC);
        if (isset($h["value"])) { 
            $hours_def = (float)$h["value"];
            unset($h);
        }
        // get department
        $query      = 'SELECT * FROM datadienstplandb.person_changes WHERE data_id = :data_id AND day_id = 999 AND yearweek <= :yearweek AND change_key = "d" AND person_id = :person_id ORDER BY yearweek DESC';
        $values     = array(':data_id' => $data_id, ':yearweek' => $yearweek_is, ':person_id' => $person_id);
        try {
            $res_c = $pdo->prepare($query);
            $res_c->execute($values);
        } catch (PDOException $e) { throw new Exception('Database query error person_active_class.php'); }
        $d = $res_c->fetch(PDO::FETCH_ASSOC);
        if (isset($d["value"])) { 
            $department = (float)$d["value"];
            unset($d);
        }


        $pers_h			= new Person_hours;
        $hours_week		= $pers_h->getHoursWhereYearweek($data_id, $yearweek_is, $person_id);
        $hours_total	= $pers_h->getHoursTotalWhereYearweek($data_id, $yearweek_is, $person_id);

        $persons_item=array(
            "id"    	 => (int)$person_id,
            "name"	     => (string)$name,
            "activated"	 => (string)$activated,
            "department" => (int)$department,
            "hours"	     => (float)$hours_def,
            "mpa"	     => $mpa_def,
            "sa"         => $sa,
            "sf"         => $sf,
            "sl"         => $sl,
            "hours_week_is"     => $hours_week["hours_is"],
            "hours_week_should" => $hours_week["hours_should"],
            "hours_is"    		=> $hours_total["hours_is"],
            "hours_should" 		=> $hours_total["hours_should"],
            "overtime"    		=> (float)sprintf ("%.2f", $hours_total["hours_is"]-$hours_total["hours_should"]),
            "overtimes_manual" => $overtimes_manual["person_overtimes_manual"],
            "shifts"      => $shifts["shifts"],
            "betterments" => $betterments["person_betterments"],
            "illnesses"   => $illnesses["person_illnes"],
            "vacations"   => $vacations["person_vacations"],
            "freedays"    => $freedays_this_week
        );

        
		return $persons_item;
    }
    public function getAllActive(int $data_id, string $yearweek) {
        global $pdo;
		$data_id	 = trim($data_id);
		$yearweek	 = trim($yearweek);
        $yearweek_is = $yearweek;
        $query       = 'SELECT * FROM datadienstplandb.persons WHERE data_id = :data_id';
        $values      = array(':data_id' => $data_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        }
        catch (PDOException $e) {
            throw new Exception('Database query error person_active_class.php');
        }

        $persons=array();
        $persons["persons"]=array();
        while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
            $person_id = $id;
            $persons_item=$this->getActive($data_id, $yearweek_is, $person_id, FALSE, FALSE);
            if (!empty($persons_item)) {
                array_push($persons["persons"], $persons_item);
            }
        }
		return $persons;
    }
    public function getAllActiveIdAndName(int $data_id, string $yearweek) {
        global $pdo;
		$data_id	 = trim($data_id);
		$yearweek	 = trim($yearweek);
        $query       = 'SELECT * FROM datadienstplandb.persons WHERE data_id = :data_id';
        $values      = array(':data_id' => $data_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error person_active_class.php');
        }

        $persons=array();
        $persons=array();
        while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
            $person_id = $id;
            $persons_item=$this->getActive($data_id, $yearweek, $person_id, FALSE, TRUE);
            if (!empty($persons_item)) {
                array_push($persons, $persons_item);
            }
        }
		return $persons;
    }
    public function getRemoved(int $data_id, string $yearweek, int $person_id) {
        global $pdo;
		$data_id	 = trim($data_id);
		$person_id	 = trim($person_id);
		$yearweek	 = trim($yearweek);
        $person      = $this->getActive($data_id, $yearweek, $person_id, TRUE, FALSE);
		return $person;
    }
    public function getAllRemoved(int $data_id, string $yearweek) {
        global $pdo;
		$data_id	 = trim($data_id);
		$yearweek	 = trim($yearweek);
        $yearweek_is = $yearweek;
        $query       = 'SELECT * FROM datadienstplandb.persons WHERE data_id = :data_id';
        $values      = array(':data_id' => $data_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        }
        catch (PDOException $e) {
            throw new Exception('Database query error person_active_class.php');
        }

        $persons=array();
        while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
            $person_id = $id;
            $persons_item=$this->getActive($data_id, $yearweek_is, $person_id, TRUE, FALSE);
            if (!empty($persons_item)) {
                array_push($persons, $persons_item);
            }
        }
		return $persons;
    }
}
