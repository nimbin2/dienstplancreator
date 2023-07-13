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
$data       = json_decode(file_get_contents("php://input"));

$roster_person_info->remove($_SESSION["data_id"], $data->id, $data->yearweek, $data->day_id);
echo json_encode($data->id)
?>
