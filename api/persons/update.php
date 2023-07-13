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
require '../objects/person_class.php';


$data = json_decode(file_get_contents("php://input"));

$data_id    = $_SESSION["data_id"];
$name       = $data->name;
$activated  = $data->activated;
$department = $data->department;
$hours      = $data->hours;
$mpa        = $data->mpa;



try {
    $res = $person->update($data_id, $name, $activated, $department, $hours, $mpa);
} catch (Exception $e) {
    error_log($e->getMessage());
    die();
}   
echo json_encode($res);
?>
