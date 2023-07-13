<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  
session_start();

require '../config/db_inc.php';
require '../objects/person_active_class.php';

$person = new Person_active();
$data = json_decode(file_get_contents("php://input"));
echo json_encode($person->getActive($_SESSION["data_id"], $data->yearweek, $_SESSION["connected_person"], FALSE, FALSE));
?>
