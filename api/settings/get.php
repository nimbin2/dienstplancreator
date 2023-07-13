<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  
require '../config/db_inc.php';
require '../objects/settings_class.php';

session_start();

$data = json_decode(file_get_contents("php://input"));

$name = $data->name;


$settings = new Settings();
$data = json_decode(file_get_contents("php://input"));
echo json_encode($settings->getWhereName($_SESSION["data_id"], $data->name));
?>
