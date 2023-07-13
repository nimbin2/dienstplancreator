<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  
session_start();

require '../config/db_inc.php';
require '../objects/shift_class.php';

$data = json_decode(file_get_contents("php://input"));
$shifts = new Shift();
echo json_encode($shifts->getWhereYearweekDay($_SESSION["data_id"], $data->yearweek, $data->day_id));
?>
