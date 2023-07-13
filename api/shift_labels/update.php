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
$id         = $data->id;
$name       = $data->name;
$cut        = $data->cut;


try {
	$shift_labels->update($data_id, $id, $name, $cut);
} catch (Exception $e) {
	echo $e->getMessage();
	die();
}   

?>
