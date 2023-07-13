<?php

class Roster_editable_row_top
{
	private $data_id;
	private $id;
	private $yearweek;
	private $text;
	/* Constructor */
	public function __construct() {
		$this->data_id = NULL;
		$this->id = NULL;
		$this->yearweek = NULL;
		$this->text = NULL;
	}
	
	/* Destructor */
	public function __destruct() { }

	public function add(int $data_id, string $id, string $yearweek, string $text): int {
		global $pdo;
		$data_id	= trim($data_id);
		$id     	= trim($id);
		$yearweek	= trim($yearweek);
		$text	    = trim($text);

		$query = 'INSERT INTO datadienstplandb.roster_editable_row_top (data_id, id, yearweek, text) VALUES (:data_id, :id, :yearweek, :text)';

        $values = array(':data_id' => $data_id, ':id' => $id, ':yearweek' => $yearweek, ':text' => $text);

		try
		{
			$res = $pdo->prepare($query);
			$res->execute($values);
		}
		catch (PDOException $e)
		{
		   throw new Exception('Database query error roster_editable_row_top_class.php');
		}

		return $pdo->lastInsertId();
	}
    public function get(int $data_id, string $yearweek) {
        global $pdo;
		$data_id    = trim($data_id);
		$yearweek	= trim($yearweek);
        $query          = 'SELECT * FROM datadienstplandb.roster_editable_row_top WHERE data_id = :data_id AND yearweek = :yearweek';
        $values         = array(':data_id' => $data_id, ':yearweek' => $yearweek);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        }
        catch (PDOException $e) {
            throw new Exception('Database query error roster_editable_row_top_class.php');
        }

        $roster_editable_row_top=array();
        $roster_editable_row_top["roster_editable_row_top"]=array();
        while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
			$roster_editable_row_top_item=array(
				"id"        => $id,
				"yearweek"  => $yearweek,
				"text"      => $text
			);
			array_push($roster_editable_row_top["roster_editable_row_top"], $roster_editable_row_top_item);
        }
        return $roster_editable_row_top;
    }
    public function getWhereId(int $data_id, $yearweek, $id) {
        global $pdo;
		$data_id    = trim($data_id);
		$yearweek	= trim($yearweek);
        $query          = 'SELECT * FROM datadienstplandb.roster_editable_row_top WHERE data_id = :data_id AND yearweek = :yearweek AND id = :id';
        $values         = array(':data_id' => $data_id, ':yearweek' => $yearweek, ':id' => $id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        }
        catch (PDOException $e) {
            throw new Exception('Database query error roster_editable_row_top_class.php');
        }
        return $res->fetch(PDO::FETCH_ASSOC);
    }
    public function update(int $data_id, string $yearweek, string $id, string $text) {
        global $pdo;
        $data_id    = trim($data_id);
        $yearweek   = trim($yearweek);
        $id         = trim($id);
        $text       = trim($text);

        $query = 'INSERT INTO datadienstplandb.roster_editable_row_top (data_id, yearweek, id, text) VALUES (:data_id, :yearweek, :id, :text) ON DUPLICATE KEY UPDATE text = :text';

        $values = array(':data_id' => $data_id, ':yearweek' => $yearweek, ':id' => $id, ':text' => $text);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error roster_editable_row_top_class.php');
        }
    }   
	public function remove(int $data_id, string $yearweek) {
        global $pdo;

        $data_id  = trim($data_id);
        $yearweek = trim($yearweek);
        $query   = "DELETE FROM datadienstplandb.roster_editable_row_top WHERE data_id = :data_id AND yearweek = :yearweek";
        $values  = array(':data_id' => $data_id, ':yearweek' => $yearweek);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error roster_editable_row_top_class.php');
        }
    }
    public function removeWhereDataId(int $data_id) {
        global $pdo;
        $data_id = trim($data_id);
        $query   = "DELETE FROM datadienstplandb.roster_editable_row_top WHERE data_id = :data_id";
        $values  = array(':data_id' => $data_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error roster_editable_row_top_class.php');
        }
    } 
}
