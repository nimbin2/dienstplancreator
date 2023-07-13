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
require '../objects/roster_editable_row_bottom_class.php';

$roster_editable_row_bottom = new Roster_editable_row_bottom();

$data = json_decode(file_get_contents("php://input"));

$data_id    = $_SESSION["data_id"];
$yearweek   = $data->yearweek;
$id         = $data->id;
$text       = $data->text;


try {
	$roster_editable_row_bottom->add($data_id, $id, $yearweek, $text);
} catch (Exception $e) {
	error_log($e->getMessage());
	die();
}   
?>
