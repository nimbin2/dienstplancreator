<?php
class Settings {
	private $data_id;
    private $database_version;
    private $default_overtime;
    private $default_edit_cell_right;
    private $default_row_top;
    private $default_row_bottom;
    private $sort_days;
    private $sort_week;
    private $printmode;
    private $zoom_web;
    private $zoom_print_h;
    private $zoom_print_v;
	/* Constructor */
	public function __construct() {
		$this->data_id = NULL;
		$this->database_version = NULL;
		$this->default_overtime = NULL;
		$this->default_edit_cell_right = NULL;
		$this->default_row_top = NULL;
		$this->default_row_bottom = NULL;
		$this->sort_days = NULL;
		$this->sort_week = NULL;
		$this->printmode = NULL;
		$this->zoom_web = NULL;
		$this->zoom_print_h = NULL;
		$this->zoom_print_v = NULL;
	}
	
	/* Destructor */
	public function __destruct() { }

	public function addSettings(int $data_id, string $database_version, int $default_overtime, int $default_edit_cell_right, int $default_row_top, int $default_row_bottom, string $sort_days, string $sort_week, int $printmode, int $zoom_web, int $zoom_print_h, int $zoom_print_v): int {
		global $pdo;
		$data_id	= trim($data_id);
		$database_version	= trim($database_version);
		$default_overtime	= trim($default_overtime);
		$default_edit_cell_right = trim($default_edit_cell_right);
		$default_row_top	= trim($default_row_top);
		$default_row_bottom	= trim($default_row_bottom);
		$sort_days	= trim($sort_days);
		$sort_week	= trim($sort_week);
		$printmode	= trim($printmode);
		$zoom_web	= trim($zoom_web);
		$zoom_print_h	= trim($zoom_print_h);
		$zoom_print_v	= trim($zoom_print_v);


		$query = 'INSERT INTO datadienstplandb.settings (data_id, database_version, default_overtime, default_edit_cell_right, default_row_top, default_row_bottom, sort_days, sort_week, printmode, zoom_web, zoom_print_h, zoom_print_v) VALUES (:data_id, :database_version, :default_overtime, :default_edit_cell_right, :default_row_top, :default_row_bottom, :sort_days, :sort_week, :printmode, :zoom_web, :zoom_print_h, :zoom_print_v)';

		$values = array('data_id' => $data_id, 'database_version' => $database_version, 'default_overtime' => $default_overtime, 'default_edit_cell_right' => $default_edit_cell_right, 'default_row_top' => $default_row_top, 'default_row_bottom' => $default_row_bottom, 'sort_days' => $sort_days, 'sort_week' => $sort_week, 'printmode' => $printmode, 'zoom_web' => $zoom_web, 'zoom_print_h' => $zoom_print_h, 'zoom_print_v' => $zoom_print_v);

		try
		{
			$res = $pdo->prepare($query);
			$res->execute($values);
		}
		catch (PDOException $e)
		{
		   /* If there is a PDO exception, throw a standard exception */
		   throw new Exception('Database query error settings_class.php');
		}

		return $pdo->lastInsertId();
	}
    public function getWhereName(int $data_id, string $name) {
        global $pdo;
		$data_id	= trim($data_id);
		$name  	    = trim($name);
        $query      = 'SELECT * FROM datadienstplandb.settings WHERE data_id = :data_id';
        $values     = array(':data_id' => $data_id);
        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        }
        catch (PDOException $e) {
            throw new Exception('Database query error settings_class.php');
        }

        $settings =  $res->fetch(PDO::FETCH_ASSOC);
        $value;
        if ($name === "database_version")           { $value = (float)$settings["database_version"]; }
        else if ($name === "default_edit_cell_right")    { $value = (int)$settings["default_edit_cell_right"]; }
        else if ($name === "default_overtime")           { $value = (int)$settings["default_overtime"]; }
        else if ($name === "default_row_bottom")         { $value = (int)$settings["default_row_bottom"]; }
		else if ($name === "default_row_top")            { $value = (int)$settings["default_row_top"]; }
		else if ($name === "printmode")                  { $value = (int)$settings["printmode"]; }
		else if ($name === "sort_days")                  { $value = explode(',', $settings["sort_days"]); }
		else if ($name === "sort_week")                  { $value = explode(',', $settings["sort_week"]); }
		else if ($name === "zoom_print_h")               { $value = (float)$settings["zoom_print_h"]; }
		else if ($name === "zoom_print_v")               { $value = (float)$settings["zoom_print_v"]; }
        else if ($name === "zoom_web")                   { $value = (float)$settings["zoom_web"]; };
        return $value;
    }
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
            throw new Exception('Database query error settings_class.php');
        }

        $settings =  $res->fetch(PDO::FETCH_ASSOC);
        $query    = 'SELECT name FROM datadienstplandb.institutions WHERE id = :data_id';
        $values   = array(':data_id' => $data_id);
        try {
            $res_i = $pdo->prepare($query);
            $res_i->execute($values);
        } catch (PDOException $e) { throw new Exception('Database query error settings_class.php'); }

        $institution = $res_i->fetch(PDO::FETCH_ASSOC);
        return array(
            "database_version"          => (int)$settings["database_version"],
            "default_edit_cell_right"   => (int)$settings["default_edit_cell_right"],
            "default_overtime"          => (int)$settings["default_overtime"],
            "default_row_bottom"        => (int)$settings["default_row_bottom"],
            "default_row_top"           => (int)$settings["default_row_top"],
            "institution"               => (string)$institution["name"],
            "printmode"                 => (int)$settings["printmode"],
            "sort_days"                 => explode(',', $settings["sort_days"]),
            "sort_week"                 => explode(',', $settings["sort_week"]),
            "zoom_print_h"              => (float)$settings["zoom_print_h"],
            "zoom_print_v"              => (float)$settings["zoom_print_v"],
            "zoom_web"                  => (float)$settings["zoom_web"]
        );
    }
	public function updateSettingsWhere(int $data_id, string $name, $value) {
        global $pdo;
        $data_id = trim($data_id);
        $name    = trim($name);
        $value   = trim($value);
        $query   = "UPDATE datadienstplandb.settings SET `".$name."` = :value WHERE data_id = :data_id";
        $values  = array(':data_id' => $data_id, ':value' => $value);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error settings_class.php');
        }
        return explode(',', $value);
    }
	public function removeWhereDataId(int $data_id) {
        global $pdo;
        $data_id = trim($data_id);
        $query   = "DELETE FROM datadienstplandb.settings WHERE data_id = :data_id";
        $values  = array(':data_id' => $data_id);

        try {
            $res = $pdo->prepare($query);
            $res->execute($values);
        } catch (PDOException $e) {
            throw new Exception('Database query error settings_class.php');
        }
    }
}
