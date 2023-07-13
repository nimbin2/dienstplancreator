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

$data_id  = $_SESSION["data_id"];
$settings = new Settings();

echo json_encode($settings->getAll($data_id));
?>
