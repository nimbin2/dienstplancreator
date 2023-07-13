<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  
session_start();

if (($_SESSION['user_role'] === 'superadmin') || ($_SESSION['user_role'] === 'admin')) {
    require '../config/db_inc.php';
    require '../objects/account_class.php';

    $account = new Account();

    $data = json_decode(file_get_contents("php://input"));


    $data_id = $_SESSION["data_id"];
    try {
        $newName = $account->updateName($data_id, $data->id, $data->name );
    } catch (Exception $e) {
        $newName = $e->getMessage();
    }
    echo json_encode($newName);
}
?>
