<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  
session_start();

require '../config/db_inc.php';
require '../objects/closingtime_class.php';

$closingtime = new Closingtime();
$data = json_decode(file_get_contents("php://input"));
echo json_encode($closingtime->get($_SESSION["data_id"], $data->id));
?>
