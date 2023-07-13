<?php

require_once 'closingtime_person_class.php';

class Closingtime
{
	private $data_id;
	private $id;
	private $name;
	private $start;
	private $end;
	private $lawful;
	/* Constructor */
	public function __construct() {
		$this->data_id = NULL;
		$this->id = NULL;
		$this->name = NULL;
		$this->start = NULL;
		$this->end = NULL;
		$this->lawful = NULL;
	}
	
	/* Destructor */
	public function __destruct() { }

	public function add(int $data_id, string $name, string $start, string $end, int $lawful, array $persons): array {
		global $pdo;
		$data_id	= trim($data_id);
		$name   	= trim($name);
		$start	    = trim($start);
		$end  	    = trim($end);
		$lawful  	= trim($lawful);

		$query = 'INSERT INTO datadienstplandb.closingtimes (data_id, name, start, end, lawful) VALUES (:data_id, :name, :start, :end, :lawful)';

        $values = array(':data_id' => $data_id, ':name' => $name, ':start' => $start, ':end' => $end, ':lawful' => $lawful);

		try {
			$res = $pdo->prepare($query); $res->execute($values);
		} catch (PDOException $e) {
		   throw new Exception('Database query error closingtime_class.php');
		}
        $id = $pdo->lastInsertId();
        foreach ($persons as $pid) {
            $cp = new Closingtime_person();
            $cp->add($data_id, $id, $pid);
        }

        return array(
            'id'    => $id,
            'name'  => $name,
            'start' => $start,
            'end'   => $end,
            'lawful'    => $lawful,
            'persons'   => $persons
        );
	}
    public function get(int $data_id, int $id) {
        global $pdo;
		$data_id	    = trim($data_id);
		$id	= trim($id);
        $query          = 'SELECT * FROM datadienstplandb.closingtimes WHERE data_id = :data_id AND id = :id';
        $values         = array(':data_id' => $data_id, ':id' => $id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        }
        catch (PDOException $e) {
            throw new Exception('Database query error closingtime_class.php');
        }

        $row = $res->fetch(PDO::FETCH_ASSOC);
        extract($row);
        $cp = new Closingtime_person();
        $closingtime_person = $cp->get($data_id, $id);
        $persons=array();
        foreach ($closingtime_person as $key=>$value) {
            array_push($persons, $value["person_id"]);
        }
        return array(
				"id"         => (int)$id,
				"name"       => $name,
				"start"      => $start,
				"end"        => $end,
                "lawful"     => (int)$lawful,
                "persons"    => $persons
			);
    }
    public function getAll(int $data_id) {
        global $pdo;
		$data_id	= trim($data_id);
        $query      = 'SELECT * FROM datadienstplandb.closingtimes WHERE data_id = :data_id';
        $values     = array(':data_id' => $data_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        }
        catch (PDOException $e) {
            throw new Exception('Database query error closingtime_class.php');
        }

        $closingtimes=array();
        while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
            $cp = new Closingtime_person();
            $closingtime_person = $cp->get($data_id, $id);
            $persons=array();
            foreach ($closingtime_person as $key=>$value) {
                array_push($persons, $value["person_id"]);
            }
			$closingtimes_item=array(
				"id"         => (int)$id,
				"name"       => $name,
				"start"      => $start,
				"end"        => $end,
				"lawful"     => (int)$lawful,
                "persons"    => $persons
			);
			array_push($closingtimes, $closingtimes_item);
        }
		return $closingtimes;
    }
    public function getLawful(int $data_id) {
        global $pdo;
		$data_id	= trim($data_id);
        $query      = 'SELECT * FROM datadienstplandb.closingtimes WHERE data_id = :data_id AND lawful = 1';
        $values     = array(':data_id' => $data_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        }
        catch (PDOException $e) {
            throw new Exception('Database query error closingtime_class.php');
        }

        $closingtimes=array();
        $closingtimes["closingtimes"]=array();
        while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
			$closingtimes_item=array(
				"id"         => (int)$id,
				"name"       => $name,
				"start" => $start,
				"end"   => $end,
				"lawful"     => $lawful
			);
			array_push($closingtimes["closingtimes"], $closingtimes_item);
        }
		return $closingtimes;
    }
	public function update(int $data_id, int $id, string $name, string $start, string $end, int $lawful) {
        global $pdo;
        $data_id    = trim($data_id);
        $id         = trim($id);
        $name       = trim($name);
        $start = trim($start);
        $end   = trim($end);
        $lawful     = trim($lawful);
        $query   = "UPDATE datadienstplandb.closingtimes SET name = :name, start = :start, end = :end, lawful = :lawful WHERE data_id = :data_id AND id = :id";
        $values  = array(':data_id' => $data_id, ':id' => $id, ':name' => $name, ':start' => $start, ':end' => $end, ':lawful' => $lawful);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error closingtime_class.php');
        }
    }
	public function remove(int $data_id, int $id) {
        global $pdo;

        $data_id = trim($data_id);
        $id      = trim($id);
        $query   = "DELETE FROM datadienstplandb.closingtimes WHERE (data_id = :data_id) AND (id = :id)";
        $values  = array(':data_id' => $data_id, ':id' => $id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error closingtime_class.php');
        }
        $cp = new Closingtime_person();
        $cp->removeAll($data_id, $id);
    }
    public function removeWhereDataId(int $data_id) {
        global $pdo;
        $data_id = trim($data_id);
        $query   = "DELETE FROM datadienstplandb.closingtimes WHERE data_id = :data_id";
        $values  = array(':data_id' => $data_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error closingtime_class.php');
        }
    } 
}
