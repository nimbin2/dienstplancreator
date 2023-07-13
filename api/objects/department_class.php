<?php

require_once 'person_change_class.php';
require_once 'person_class.php';

class Department
{
	private $data_id;
	private $id;
	private $name;
	/* Constructor */
	public function __construct() {
		$this->data_id = NULL;
		$this->id = NULL;
		$this->name = NULL;
	}
	
	/* Destructor */
	public function __destruct() { }

	public function add(int $data_id, string $name): int {
		global $pdo;
		$data_id	= trim($data_id);
		$name   	= trim($name);

		$query = 'INSERT INTO datadienstplandb.departments (data_id, name) VALUES (:data_id, :name)';
		$values = array(':data_id' => $data_id, ':name' => $name);

		try {
			$res = $pdo->prepare($query);
			$res->execute($values);
		} catch (PDOException $e) {
		   throw new Exception('Database query error department_class.php');
		}

		return $pdo->lastInsertId();
	}
    public function get(int $data_id) {
        global $pdo;
		$data_id	= trim($data_id);
        $query      = 'SELECT * FROM datadienstplandb.departments WHERE data_id = :data_id';
        $values     = array(':data_id' => $data_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        }
        catch (PDOException $e) {
            throw new Exception('Database query error department_class.php');
        }

        $departments=array();
        $departments["departments"]=array();
        while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
			$departments_item=array(
				"id" => (int)$id,
				"name" => $name,
			);
			array_push($departments["departments"], $departments_item);
        }
		return $departments;
    }
	public function update(int $data_id, int $id, string $name) {
        global $pdo;
        $data_id = trim($data_id);
        $id      = trim($id);
        $name    = trim($name);
        $query   = "UPDATE datadienstplandb.departments SET name = :name WHERE data_id = :data_id AND id = :id";
        $values  = array(':data_id' => $data_id, ':id' => $id, ':name' => $name);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error department_class.php');
        }
        return $id;
    }
	public function remove(int $data_id, int $id) {
        global $pdo;

        $data_id = trim($data_id);
        $id      = trim($id);
        $query   = "DELETE FROM datadienstplandb.departments WHERE (data_id = :data_id) AND (id = :id)";
        $values  = array(':data_id' => $data_id, ':id' => $id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error department_class.php');
        }
        $query   = 'SELECT * FROM departments WHERE data_id = :data_id AND name = ""';
        $values  = array(':data_id' => $data_id);

        try {
            $res_n = $pdo->prepare($query);
            $res_n->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error department_class.php');
        }
        $dep_new = $res_n->fetch(PDO::FETCH_ASSOC);
        $new_id = $dep_new["id"];
        $persons = new Person();
        $persons->updateWhereDepartment($data_id, $id, $new_id);
        $persons_c = new Person_change();
        $persons_c->updateWhereDepartment($data_id, $id, $new_id);

        return $id;
    }
    public function removeWhereDataId(int $data_id) {
        global $pdo;
        $data_id = trim($data_id);
        $query   = "DELETE FROM datadienstplandb.departments WHERE data_id = :data_id";
        $values  = array(':data_id' => $data_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error department_class.php');
        }
    } 
}
