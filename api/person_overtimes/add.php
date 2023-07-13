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
require '../objects/person_overtime_class.php';

$person_overtime = new Person_overtime();

$data = json_decode(file_get_contents("php://input"));

$data_id    = $_SESSION["data_id"];
$person_id  = $data->person_id;
$yearweek   = $data->yearweek;
$overtime   = $data->overtime;


try {
	$person_overtime->add($data_id, $person_id, $yearweek, $overtime);
} catch (Exception $e) {
	error_log($e->getMessage());
	die();
}   
?>
