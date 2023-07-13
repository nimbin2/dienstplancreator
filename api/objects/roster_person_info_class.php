<?php

class Roster_person_info
{
	private $data_id;
	private $id;
	private $yearweek;
	private $day_id;
	private $text;
	/* Constructor */
	public function __construct() {
		$this->data_id = NULL;
		$this->id = NULL;
		$this->yearweek = NULL;
		$this->day_id = NULL;
		$this->text = NULL;
	}
	
	/* Destructor */
	public function __destruct() { }

	public function add(int $data_id, string $id, string $yearweek, int $day_id, string $text): int {
		global $pdo;
		$data_id	= trim($data_id);
		$id	= trim($id);
		$yearweek	= trim($yearweek);
		$day_id 	= trim($day_id);
		$text	    = trim($text);

		$query = 'INSERT INTO datadienstplandb.roster_person_info (data_id, id, yearweek, day_id, text) VALUES (:data_id, :id, :yearweek, :day_id, :text)';

        $values = array(':data_id' => $data_id, ':id' => $id, ':yearweek' => $yearweek, ':day_id' => $day_id, ':text' => $text);

		try
		{
			$res = $pdo->prepare($query);
			$res->execute($values);
		}
		catch (PDOException $e)
		{
		   throw new Exception('Database query error roster_person_info_class.php');
		}

		return $pdo->lastInsertId();
	}
    public function getAll(int $data_id, string $yearweek) {
        global $pdo;
		$data_id    = trim($data_id);
		$yearweek	= trim($yearweek);
        $query          = 'SELECT * FROM datadienstplandb.roster_person_info WHERE data_id = :data_id AND yearweek = :yearweek';
        $values         = array(':data_id' => $data_id, ':yearweek' => $yearweek);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        }
        catch (PDOException $e) {
            throw new Exception('Database query error roster_person_info_class.php');
        }
        $infos=array();
        $infos["infos"]=array();
        while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
            $infos_item=array(
                "id"        => (string)$id,
                "yearweek"  => (string)$yearweek,
                "day_id"    => (int)$day_id,
                "text"      => (string)$text
            );
            array_push($infos["infos"], $infos_item);
        }
        return $infos;
    }
    public function get(int $data_id, string $id, string $yearweek, int $day_id) {
        global $pdo;
		$data_id    = trim($data_id);
		$id     	= trim($id);
		$yearweek	= trim($yearweek);
		$day_id 	= trim($day_id);
        $query          = 'SELECT * FROM datadienstplandb.roster_person_info WHERE data_id = :data_id AND id = :id AND yearweek = :yearweek AND day_id = :day_id';
        $values         = array(':data_id' => $data_id, ':id' => $id, ':yearweek' => $yearweek, ':day_id' => $day_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        }
        catch (PDOException $e) {
            throw new Exception('Database query error roster_person_info_class.php');
        }

        return $res->fetch(PDO::FETCH_ASSOC);
    }
    public function update(int $data_id, string $id, string $yearweek, int $day_id, string $text) {
        global $pdo;
        $data_id    = trim($data_id);
        $id         = trim($id);
        $yearweek   = trim($yearweek);
        $day_id     = trim($day_id);
        $text	    = trim($text);
		$query = 'INSERT INTO datadienstplandb.roster_person_info (data_id, id, yearweek, day_id, text) VALUES (:data_id, :id, :yearweek, :day_id, :text) ON DUPLICATE KEY UPDATE text = :text';

        $values = array(':data_id' => $data_id, ':id' => $id, ':yearweek' => $yearweek, ':day_id' => $day_id, ':text' => $text);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error roster_person_info_class.php');
        }
    }   
	public function remove(int $data_id, string $id, string $yearweek, int $day_id) {
        global $pdo;

        $data_id   = trim($data_id);
        $id        = trim($id);
        $yearweek  = trim($yearweek);
        $day_id    = trim($day_id);
        $query     = "DELETE FROM datadienstplandb.roster_person_info WHERE data_id = :data_id AND id = :id AND yearweek = :yearweek AND day_id = :day_id";
        $values = array(':data_id' => $data_id, ':id' => $id, ':yearweek' => $yearweek, ':day_id' => $day_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error roster_person_info_class.php');
        }
    }
    public function removeWhereDataId(int $data_id) {
        global $pdo;
        $data_id = trim($data_id);
        $query   = "DELETE FROM datadienstplandb.roster_person_info WHERE data_id = :data_id";
        $values  = array(':data_id' => $data_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error roster_person_info_class.php');
        }
    } 
}
