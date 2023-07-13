<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  
session_start();

require '../config/db_inc.php';
require '../objects/roster_class.php';

$data = json_decode(file_get_contents("php://input"));
$roster = new Roster();
echo json_encode($roster->get($_SESSION["data_id"], $data->yearweek));
?>
