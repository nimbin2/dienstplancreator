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
require '../objects/roster_editable_row_top_class.php';

$roster_editable_row_top = new Roster_editable_row_top();

$data = json_decode(file_get_contents("php://input"));

$data_id  = $_SESSION["data_id"];
$yearweek = $data->yearweek;
$id       = $data->id;
$text     = $data->text;

try {
	$roster_editable_row_top->update($data_id, $yearweek, $id, $text);
} catch (Exception $e) {
	echo $e->getMessage();
	die();
}   
?>