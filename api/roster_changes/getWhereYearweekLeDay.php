<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  
session_start();

require '../config/db_inc.php';
require '../objects/roster_changes_class.php';

$roster_changes = new Roster_changes();

$data = json_decode(file_get_contents("php://input"));

$data_id    = $_SESSION["data_id"];
$yearweek   = $data->yearweek;
$day_id     = $data->day_id;


echo json_encode($roster_changes->getWhereYearweekLeDay($data_id, $yearweek, $day_id));
?>
