<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  
session_start();


require '../config/db_inc.php';
require '../objects/institution_class.php';

if ($_SESSION["user_role"] !== "superadmin") { return; }
$institution = new Institution();

$data = json_decode(file_get_contents("php://input"));

try {
    $institution->add($data->name, $data->yearweek);
} catch (Exception $e) {
	error_log($e->getMessage());
	die();
}   
echo json_encode($data->name)
?>
