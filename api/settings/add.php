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
require '../objects/settings_class.php';

$settings = new Settings();

$data = json_decode(file_get_contents("php://input"));

$data_id	= $_SESSION["data_id"];
$database_version	= $data->database_version;
$default_overtime	= $data->default_overtime;
$default_edit_cell_right	= $data->default_edit_cell_right;
$default_row_top	= $data->default_row_top;
$default_row_bottom	= $data->default_row_bottom;
$sort_days	= $data->sort_days;
$sort_week	= $data->sort_week;
$printmode	= $data->printmode;
$zoom_web	= $data->zoom_web;
$zoom_print_h	= $data->zoom_print_h;
$zoom_print_v	= $data->zoom_print_v;


try {
	$newId = $settings->addSettings($data_id, $database_version, $default_overtime, $default_edit_cell_right, $default_row_top, $default_row_bottom, $sort_days, $sort_week, $printmode, $zoom_web, $zoom_print_h, $zoom_print_v);
} catch (Exception $e) {
	echo $e->getMessage();
	die();
}   
?>
