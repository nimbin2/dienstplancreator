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
require '../objects/roster_person_info_class.php';

$roster_person_info = new Roster_person_info();

$data = json_decode(file_get_contents("php://input"));

$data_id    = $_SESSION["data_id"];
$id  = $data->id;
$yearweek   = $data->yearweek;
$day_id     = $data->day_id;
$text       = $data->text;


try {
	$roster_person_info->update($data_id, $id, $yearweek, $day_id, $text);
} catch (Exception $e) {
	error_log($e->getMessage());
	die();
}   
?>
