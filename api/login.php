<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  
session_start();

require 'config/db_inc.php';
require 'objects/account_class.php';
require 'objects/settings_class.php';

$account = new Account();

$data = json_decode(file_get_contents("php://input"));

$name = $data->name;
$password = $data->password;
$data_id = $data->data_id;
try {
	$login = $account->login($name, $password, $data_id);
} catch (Exception $e) {
	echo json_encode($e->getMessage());
	die();
}   

if ($login) {
    echo json_encode("success");
    //header("Location: ");
} else {
	echo json_encode('mismatch');
}   
?>
