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

$data_id   = $_SESSION["data_id"];
$yearweek  = $data->yearweek;
$time_step = $data->time_step;
$break_60  = $data->break_60;
$break_90  = $data->break_90;
$days      = $data->days;


try {
	$roster_id = $roster->update($data_id, $yearweek, $time_step, $break_60, $break_90, $days);
} catch (Exception $e) {
	error_log($e->getMessage());
	die();
}   
echo json_encode($roster_id);
?>
