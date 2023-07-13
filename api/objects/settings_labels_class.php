<?php

class Settings_labels
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

	public function add(int $data_id, int $id, string $name, string $cut): int {
		global $pdo;
		$data_id	= trim($data_id);
		$id   	    = trim($id);
		$name   	= trim($name);
		$cut        = trim($cut);

		$query = 'INSERT INTO datadienstplandb.settings_labels (data_id, id, name, cut) VALUES (:data_id, :id, :name, :cut)';

		$values = array(':data_id' => $data_id, ':id' => $id, ':name' => $name, ':cut' => $cut);

		try
		{
			$res = $pdo->prepare($query);
			$res->execute($values);
		}
		catch (PDOException $e)
		{
		   /* If there is a PDO exception, throw a standard exception */
		   throw new Exception('Database query error settings_labels_class.php');
		}

		return $pdo->lastInsertId();
	}
    public function get(int $data_id) {
        global $pdo;
		$data_id	= trim($data_id);
        $query      = 'SELECT * FROM datadienstplandb.settings_labels WHERE data_id = :data_id';
        $values     = array(':data_id' => $data_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        }
        catch (PDOException $e) {
            throw new Exception('Database query error settings_labels_class.php');
        }

        $labels=array();
        $labels["labels"]=array();
        while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
			$labels_item=array(
				"id" => (int)$id,
				"name" => $name,
				"cut" => $cut
			);
			array_push($labels["labels"], $labels_item);
        }
		return $labels;
    }
	public function update(int $data_id, int $id, string $name, string $cut)
    {
        global $pdo;
        $data_id = trim($data_id);
        $id      = trim($id);
        $name    = trim($name);
        $cut   = trim($cut);
        $query   = "UPDATE datadienstplandb.settings_labels SET name = :name, cut = :cut WHERE data_id = :data_id AND id = :id";
        $values  = array(':data_id' => $data_id, ':id' => $id, ':name' => $name, ':cut' => $cut);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error settings_labels_class.php');
        }
    }
    public function removeWhereDataId(int $data_id) {
        global $pdo;
        $data_id = trim($data_id);
        $query   = "DELETE FROM datadienstplandb.settings_labels WHERE data_id = :data_id";
        $values  = array(':data_id' => $data_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error settings_labels_class.php');
        }
    } 
}
