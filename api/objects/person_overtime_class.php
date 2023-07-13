<?php

class Person_overtime
{
	private $data_id;
	private $id;
	private $person_id;
	private $yearweek;
	private $overtime;
	/* Constructor */
	public function __construct() {
		$this->data_id = NULL;
		$this->id = NULL;
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

		$query = 'INSERT INTO datadienstplandb.person_overtimes (data_id, person_id, yearweek, overtime) VALUES (:data_id, :person_id, :yearweek, :overtime)';

        $values = array(':data_id' => $data_id, ':person_id' => $person_id, ':yearweek' => $yearweek, ':overtime' => $overtime);

		try
		{
			$res = $pdo->prepare($query);
			$res->execute($values);
		}
		catch (PDOException $e)
		{
		   throw new Exception('Database query error person_overtime_class.php');
		}

		return $pdo->lastInsertId();
	}
    public function getWhereYearweek(int $data_id, int $person_id, string $yearweek) {
        global $pdo;
		$data_id    = trim($data_id);
		$person_id	= trim($person_id);
        $query          = 'SELECT * FROM datadienstplandb.person_overtimes WHERE data_id = :data_id AND person_id = :person_id AND yearweek = :yearweek';
        $values         = array(':data_id' => $data_id, ':person_id' => $person_id, ':yearweek' => $yearweek);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        }
        catch (PDOException $e) {
            throw new Exception('Database query error person_overtime_class.php');
        }

        $person_overtimes=array();
        $person_overtimes["person_overtimes"]=array();
        while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
			$person_overtime_item=array(
				"id"         => (int)$id,
				"person_id"  => (int)$person_id,
				"yearweek"   => $yearweek,
				"overtime"   => (float)$overtime
			);
			array_push($person_overtimes["person_overtimes"], $person_overtime_item);
        }
        return $person_overtimes;
    }
    public function getWhereYearweekLe(int $data_id, int $person_id, string $yearweek) {
        global $pdo;
		$data_id    = trim($data_id);
		$person_id	= trim($person_id);
		$yearweek	= trim($yearweek);
        $query          = 'SELECT * FROM datadienstplandb.person_overtimes WHERE data_id = :data_id AND person_id = :person_id AND yearweek <= :yearweek';
        $values         = array(':data_id' => $data_id, ':person_id' => $person_id, ':yearweek' => $yearweek);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        }
        catch (PDOException $e) {
            throw new Exception('Database query error person_overtime_class.php');
        }

        $person_overtimes=array();
        $person_overtimes["person_overtimes"]=array();
        while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
			$person_overtime_item=array(
				"id"         => (int)$id,
				"person_id"  => (int)$person_id,
				"yearweek"   => $yearweek,
				"overtime"   => (float)$overtime
			);
			array_push($person_overtimes["person_overtimes"], $person_overtime_item);
        }
        return $person_overtimes;
    }
    public function update(int $data_id, int $person_id, string $yearweek, float $overtime) {
        global $pdo;
        $data_id    = trim($data_id);
        $person_id  = trim($person_id);
        $yearweek   = trim($yearweek);
        $overtime   = trim($overtime);
        $query = 'INSERT INTO datadienstplandb.person_overtimes  (data_id, yearweek, person_id, overtime) VALUES (:data_id, :yearweek, :person_id, :overtime) ON DUPLICATE KEY UPDATE overtime = :overtime';
        $values  = array(':data_id' => $data_id, ':person_id' => $person_id, ':overtime' => $overtime, ':yearweek' => $yearweek);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error person_overtime_class.php');
		}
	}
      
	public function remove(int $data_id, int $id, int $person_id, string $yearweek) {
        global $pdo;

        $data_id   = trim($data_id);
        $id        = trim($id);
        $person_id = trim($person_id);
        $yearweek  = trim($yearweek);
        $query   = "DELETE FROM datadienstplandb.person_overtimes WHERE data_id = :data_id AND id = :id AND person_id = :person_id AND yearweek = :yearweek";
        $values  = array(':data_id' => $data_id, ':id' => $id, ':person_id' => $person_id, ':yearweek' => $yearweek);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error person_overtime_class.php');
        }
    }
	public function removeWhereYearweekLt(int $data_id, int $id, int $person_id, string $yearweek) {
        global $pdo;

        $data_id   = trim($data_id);
        $id        = trim($id);
        $person_id = trim($person_id);
        $yearweek  = trim($yearweek);
        $query   = "DELETE FROM datadienstplandb.person_overtimes WHERE data_id = :data_id AND id = :id AND person_id = :person_id AND yearweek < :yearweek";
        $values  = array(':data_id' => $data_id, ':id' => $id, ':person_id' => $person_id, ':yearweek' => $yearweek);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error person_overtime_class.php');
        }
    }
}
