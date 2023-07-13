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

$closingtime_person->remove($_SESSION["data_id"], $data->closingtime_id, $data->person_id);
?>
