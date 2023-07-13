<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  
session_start();

if ($_SESSION['administration'] === 'visitor' ) {return;}


if ($_SESSION['administration'] === 'visitor' ) {return;}

require '../config/db_inc.php';
require '../objects/person_change_class.php';

$person_change = new Person_change();

$data = json_decode(file_get_contents("php://input"));

$data_id    = $_SESSION["data_id"];
$person_id  = $data->person_id;
$change_key = $data->change_key;
$value      = $data->value;


try {
	$person_change ->updateWhereKey($data_id, $person_id, $change_key, $value);
} catch (Exception $e) {
	echo $e->getMessage();
	die();
}   

echo json_encode($person_id);
?>
