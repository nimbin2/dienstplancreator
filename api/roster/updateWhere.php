<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  
session_start();

if ($_SESSION['administration'] === 'visitor' ) {return;}


require '../config/db_inc.php';
require '../objects/roster_class.php';

$roster = new Roster();

$data = json_decode(file_get_contents("php://input"));

$data_id = $_SESSION["data_id"];
$name    = $data->name;
$value   = $data->value;

try {
	$roster->updateSettingsWhere($data_id, $name, $value);
} catch (Exception $e) {
	echo $e->getMessage();
	die();
}   
?>