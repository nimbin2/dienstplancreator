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
require '../objects/person_change_class.php';

$person_change = new Person_change();
$data       = json_decode(file_get_contents("php://input"));

$person_change->removeWhereYearweekDayKey($_SESSION["data_id"], $data->person_id, $data->yearweek, $data->day_id, $data->change_key);
?>
