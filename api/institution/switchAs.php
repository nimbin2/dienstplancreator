<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  
session_start();

if ($_SESSION["user_role"] !== "superadmin") { return; }

require '../config/db_inc.php';
require '../objects/institution_class.php';

$institution = new Institution();
$data = json_decode(file_get_contents("php://input"));
echo json_encode($institution->switchAsInstitution($data->id, $data->as));
?>
