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
require '../objects/closingtime_person_class.php';

$closingtime_person = new Closingtime_person();

$data = json_decode(file_get_contents("php://input"));

$data_id        = $_SESSION["data_id"];
$closingtime_id = $data->closingtime_id ;
$person_id      = $data->person_id;

try {
	$cid = $closingtime_person->add($data_id, $closingtime_id, $person_id);
} catch (Exception $e) {
	echo $e->getMessage();
	die();
}   
echo json_encode($cid)
?>
