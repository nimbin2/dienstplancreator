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
require '../objects/roster_changes_class.php';

$roster_changes = new Roster_changes();

$data = json_decode(file_get_contents("php://input"));

$data_id    = $_SESSION["data_id"];
$yearweek   = $data->yearweek;
$day_id     = $data->day_id;
$start      = $data->start;
$end        = $data->end;
$amount     = $data->amount;


try {
	$roster_changes->update($data_id, $yearweek, $day_id, $start, $end, $amount);
} catch (Exception $e) {
	error_log($e->getMessage());
	die();
}   
echo json_encode($year_week)
?>
