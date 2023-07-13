<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  
session_start();

if ($_SESSION['administration'] === 'visitor' ) {return;}


require '../config/db_inc.php';
require '../objects/shift_labels_class.php';

$shift_labels = new Shift_labels();

$data = json_decode(file_get_contents("php://input"));

$data_id    = $_SESSION["data_id"];
$name	    = $data->name;
$cut        = $data->cut;

$sid;
try {
	$sid = $shift_labels->add($data_id, $name, $cut);
} catch (Exception $e) {
	error_log($e->getMessage());
	die();
}   
echo json_encode($sid);
?>
