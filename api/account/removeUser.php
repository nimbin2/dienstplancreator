<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  
session_start();

require '../config/db_inc.php';
require '../objects/account_class.php';

$user = new Account();
$data        = json_decode(file_get_contents("php://input"));
if ($_SESSION["user_role"] === "superadmin") { 
    $data_id = $data->data_id;
} else if ($_SESSION["user_role"] === "admin") { 
    $data_id = $_SESSION["data_id"];
} else {return;}

echo json_encode($user->deleteAccount($data->user_id, $data_id, $data->password));
?>
