<?php

require_once 'closingtime_person_class.php';
require_once 'department_class.php';
require_once 'person_class.php';
require_once 'person_vacation_class.php';
require_once 'person_illnes_class.php';
require_once 'roster_changes_class.php';
require_once 'roster_class.php';
require_once 'roster_editable_cell_right_class.php';
require_once 'roster_editable_row_bottom_class.php';
require_once 'roster_editable_row_top_class.php';
require_once 'roster_person_info_class.php';
require_once 'settings_class.php';
require_once 'settings_labels_class.php';
require_once 'shift_labels_class.php';

class Institution {
	private $data_id;
    private $name;
	/* Constructor */
	public function __construct() {
		$this->data_id = NULL;
		$this->name = NULL;
	}
	
	/* Destructor */
	public function __destruct() { }

	public function addClean(string $name, string $yearweek): int {
		global $pdo;
		$name	    = trim($name);
		$yearweek	= trim($yearweek);
		$query  = 'INSERT INTO datadienstplandb.institutions (name) VALUES (:name)';
        $values = array('name' => $name);

		try {
			$res = $pdo->prepare($query);
			$res->execute($values);
		} catch (PDOException $e) {
		   throw new Exception('Database query error institution_class.php');
		}
		return $pdo->lastInsertId();
    }
	public function add(string $name, string $yearweek): int {
		global $pdo;
		$name	    = trim($name);
		$yearweek	= trim($yearweek);
		$query  = 'INSERT INTO datadienstplandb.institutions (name) VALUES (:name)';
        $values = array('name' => $name);

		try {
			$res = $pdo->prepare($query);
			$res->execute($values);
		} catch (PDOException $e) {
		   throw new Exception('Database query error institution_class.php');
		}
		$data_id = $pdo->lastInsertId();
    // add settings
        //($data_id, $database_version, $default_overtime, $default_edit_cell_right, $default_row_top, $default_row_bottom, $sort_days, $sort_week, $printmode, $zoom_web, $zoom_print_h, $zoom_print_v)
        $settings = new Settings();
        $settings->addSettings($data_id, 2.35, 1, 0, 0, 0, "n-d", "n-d", 0, 100, 100, 100);
    // add settings_labels
        //add(int $data_id, int $id, string $name, string $cut)
        $settings_l = new Settings_labels;
        $settings_l->add($data_id, 0, "mpA", "MPA");
        $settings_l->add($data_id, 1, "Krank", "Krank");
        $settings_l->add($data_id, 2, "Weiterbildung", "W");
        $settings_l->add($data_id, 3, "Urlaub", "Urlaub");
    // add shift_labels
        $shift_labels = new Shift_labels();
        $shift_labels->add($data_id, "Frei", "Frei");
        $shift_labels->add($data_id, "Schule", "S");
	// add roster
		//($data_id, $yearweek, $time_step, $break_60, $break_90, $days)
		$roster = new Roster();
		$roster->update($data_id, $yearweek, 0.25, 0.5, 0.25, "Montag,Dienstag,Mittwoch,Donnerstag,Freitag");
    // add roster_change
        $roster_c = new Roster_changes();
        $roster_c->update($data_id, $yearweek, 0, 7, 17, "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0");
        $roster_c->update($data_id, $yearweek, 1, 7, 17, "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0");
        $roster_c->update($data_id, $yearweek, 2, 7, 17, "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0");
        $roster_c->update($data_id, $yearweek, 3, 7, 17, "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0");
        $roster_c->update($data_id, $yearweek, 4, 7, 17, "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0");
    // add departments
        $department = new Department();
        $department->add($data_id, "");
        $department->add($data_id, "Elementar");
        $department->add($data_id, "Kleinkind");


        return $data_id;
	}
    public function get(int $id) {
        global $pdo;
		$data_id	= trim($data_id);
		$name  	    = trim($name);
        $query      = 'SELECT :name FROM datadienstplandb.institutions WHERE id = :id';
        $values     = array(':data_id' => $data_id, ':name' => $name);
        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error institution_class.php');
        }

        $institution =  $res->fetch(PDO::FETCH_ASSOC);
        return $institution["name"];
    }
    public function getAll() {
        global $pdo;
        $query      = 'SELECT * FROM datadienstplandb.institutions';
        $values=array();
        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error institution_class.php');
        }

        $institutions=array();
        while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
            $institutions_item=array(
                "id"    => (int)$row["id"],
                "name"  => (string)$row["name"]
            );
            array_push($institutions, $institutions_item);
        }
        return $institutions;
    }
    public function switchInstitution(int $data_id) {
        global $pdo;
		$data_id	= trim($data_id);
		$user_id	= $_SESSION["user_id"];
        $_SESSION["data_id"] = $data_id;
        $query = 'UPDATE datadienstplandb.users SET data_id = :data_id WHERE id = :user_id';
        $values = array(':data_id' => $data_id, ':user_id' => $user_id);
        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error institution_class.php');
        }
        return TRUE;
    }
    public function switchAsInstitution(int $data_id, string $as) {
        $_SESSION["administration"] = $as;
        $this->switchInstitution($data_id);
        return TRUE;
    }
    public function removeInstitution(int $data_id) {
        global $pdo;

        $data_id = trim($data_id);
        $query   = "DELETE FROM datadienstplandb.institutions WHERE id = :data_id";
        $values  = array(':data_id' => $data_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error institution_class.php');
        }
    }
    public function remove(int $data_id, string $password) {
        global $pdo;
        // check pass
        $password = trim($password);
        $query = 'SELECT * FROM datadienstplandb.users WHERE (id = :user_id)';
        $values = array(':user_id' => $_SESSION["user_id"]);

        try {
            $res_u = $pdo->prepare($query);
            $res_u->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error institution_class.php');
        }
        $row_u = $res_u->fetch(PDO::FETCH_ASSOC);
        if (is_array($row_u)) {
            if (!password_verify($password, $row_u['password'])) {
                return FALSE;
            }
        }
        $query   = "SELECT * FROM datadienstplandb.users WHERE data_id = :data_id";
        $values = array(':data_id' => $data_id);

        try {
            $res_a = $pdo->prepare($query);
            $res_a->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error institution_class.php');
        }
        while ($row = $res_a->fetch(PDO::FETCH_ASSOC)) {
            if ($row["role"] !== "superadmin") {
                $query  = "DELETE FROM datadienstplandb.users WHERE id = :user_id";
                $values = array(':user_id' => $row["id"]);
                try {
                    $res_r = $pdo->prepare($query);
                    $res_r->execute($values);
                } catch (PDOException $e) {
                    throw new Exception('Database query error institution_class.php');
                }
                $query  = "DELETE FROM datadienstplandb.user_sessions WHERE user_id = :user_id";
                $values = array(':user_id' => $row["id"]);
                try {
                    $res_s = $pdo->prepare($query);
                    $res_s->execute($values);
                } catch (PDOException $e) {
                    throw new Exception('Database query error institution_class.php');
                }
            }
        }

		$data_id	= trim($data_id);
        $settings = new Settings();
        $settings->removeWhereDataId($data_id);
        $settings_l = new Settings_labels();
        $settings_l->removeWhereDataId($data_id);
        $roster = new Roster();
        $roster->removeWhereDataId($data_id);
        $closingtime = new Closingtime();
        $closingtime->removeWhereDataId($data_id);
        $closingtime_p = new Closingtime_person();
        $closingtime_p->removeWhereDataId($data_id);
        $department = new Department();
        $department->removeWhereDataId($data_id);
        $person = new Person();
        $person->removeWhereDataId($data_id);
        $person_b = new Person_betterment();
        $person_b->removeWhereDataId($data_id);
        $person_c = new Person_change();
        $person_c->removeWhereDataId($data_id);
        $person_v = new Person_vacation();
        $person_v->removeWhereDataId($data_id);
        $person_h = new Person_hours();
        $person_h->removeWhereDataId($data_id);
        $roster_c = new Roster_changes();
        $roster_c->removeWhereDataId($data_id);
        $roster = new Roster();
        $roster->removeWhereDataId($data_id);
        $roster_ecr = new Roster_editable_cell_right();
        $roster_ecr->removeWhereDataId($data_id);
        $roster_pi = new Roster_person_info();
        $roster_pi->removeWhereDataId($data_id);
        $roster_pi = new Roster_person_info();
        $roster_pi->removeWhereDataId($data_id);
        $shift = new Shift();
        $shift->removeWhereDataId($data_id);
        $shift_l = new Shift_labels();
        $shift_l->removeWhereDataId($data_id);
		$this->removeInstitution($data_id);
        return TRUE;
    }
}
