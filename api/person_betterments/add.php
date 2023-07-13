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
require '../objects/person_betterment_class.php';

$person_betterment = new Person_betterment();

$data = json_decode(file_get_contents("php://input"));

$data_id    = $_SESSION["data_id"];
$person_id  = $data->person_id;
$start      = $data->start;
$end        = $data->end;
$hours      = $data->hours;


try {
	$person_betterment->add($data_id, $person_id, $start, $end, $hours);
} catch (Exception $e) {
	error_log($e->getMessage());
	die();
}   

echo json_encode($person_id);
?>
