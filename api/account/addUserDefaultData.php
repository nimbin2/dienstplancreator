<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  
session_start();

if ($_SESSION['user_role'] !== 'admin' ) {return;}


require '../config/db_inc.php';
require '../objects/account_class.php';

$account = new Account();

$data       = json_decode(file_get_contents("php://input"));
$role       = $data->role;
$connected  = $data->connected;
$data_id    = $_SESSION["data_id"];

$check = FALSE;
if ($role === "admin") {$check = TRUE;}
else if (($role === "user") && ($connected != "false")){$check = TRUE;}
if (!$check) {return;}

try {
    $newId = $account->addAccount($data->name, $data->password, $role, $data_id, $connected);
}
catch (Exception $e) {
    $newId = $e->getMessage();
}
echo json_encode($newId);
?>
