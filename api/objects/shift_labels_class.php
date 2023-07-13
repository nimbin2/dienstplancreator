<?php

class Shift_labels
{
	private $data_id;
	private $id;
	private $name;
	private $cut;
	/* Constructor */
	public function __construct() {
		$this->data_id = NULL;
		$this->id = NULL;
		$this->name = NULL;
		$this->cut = NULL;
	}
	
	/* Destructor */
	public function __destruct() { }

	public function add(int $data_id, string $name, string $cut): int {
		global $pdo;
		$data_id	= trim($data_id);
		$name   	= trim($name);
		$cut    	= trim($cut);

		$query = 'INSERT INTO datadienstplandb.shift_labels (data_id, name, cut) VALUES (:data_id, :name, :cut)';

        $values = array(':data_id' => $data_id, ':name' => $name, ':cut' => $cut);

		try
		{
			$res = $pdo->prepare($query);
			$res->execute($values);
		}
		catch (PDOException $e)
		{
		   throw new Exception('Database query error shift_labels_class.php');
		}

		return $pdo->lastInsertId();
	}
    public function get(int $data_id) {
        global $pdo;
		$data_id	= trim($data_id);
        $query      = 'SELECT * FROM datadienstplandb.shift_labels WHERE data_id = :data_id';
        $values     = array(':data_id' => $data_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        }
        catch (PDOException $e) {
            throw new Exception('Database query error shift_labels_class.php');
        }

        $shift_labels=array();
        $shift_labels["shift_labels"]=array();
        while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
			$shift_labels_item=array(
				"id"         => (int)$id,
				"name"       => $name,
                "cut"        => $cut
			);
			array_push($shift_labels["shift_labels"], $shift_labels_item);
        }
		return $shift_labels;
    }
	public function update(int $data_id, int $id, string $name, string $cut) {
        global $pdo;
        $data_id    = trim($data_id);
        $id         = trim($id);
        $name       = trim($name);
        $cut        = trim($cut);
        $query   = "UPDATE datadienstplandb.shift_labels SET name = :name, cut = :cut WHERE data_id = :data_id AND id = :id";
        $values  = array(':data_id' => $data_id, ':id' => $id, ':name' => $name, ':cut' => $cut);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error shift_labels_class.php');
        }
    }
	public function remove(int $data_id, int $id) {
        global $pdo;

        $data_id = trim($data_id);
        $id      = trim($id);
        $query   = "DELETE FROM datadienstplandb.shift_labels WHERE (data_id = :data_id) AND (id = :id)";
        $values  = array(':data_id' => $data_id, ':id' => $id);

        if ($id === 1) {
            return FALSE;
        }
        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error shift_labels_class.php');
        }
    }
    public function removeWhereDataId(int $data_id) {
        global $pdo;
        $data_id = trim($data_id);
        $query   = "DELETE FROM datadienstplandb.shift_labels WHERE data_id = :data_id";
        $values  = array(':data_id' => $data_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error shift_labels_class.php');
        }
    } 
}
