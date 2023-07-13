<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  
session_start();

require '../config/db_inc.php';
require '../objects/roster_person_info_class.php';

$roster_person_info = new Roster_person_info();

$data = json_decode(file_get_contents("php://input"));

$data_id    = $_SESSION["data_id"];
$yearweek   = $data->yearweek;


echo json_encode($roster_person_info->getAll($data_id, $yearweek));
?>
