<?php

class Test {
    public function getAll(int $data_id) {
        global $pdo;
		$data_id	= trim($data_id);
        $query      = 'SELECT * FROM datadienstplandb.settings WHERE data_id = :data_id';
        $values     = array(':data_id' => $data_id);
        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        }
        catch (PDOException $e) {
            throw new Exception('Database query error test_class.php');
        }

        return $res->fetch(PDO::FETCH_ASSOC);
    }
}
