<!DOCTYPE html>
<?php

session_start();

require './api/config/db_inc.php';
require './api/objects/account_class.php';

$account = new Account();
$login = FALSE;

try {
	$login = $account->sessionLogin();
} catch (Exception $e) {
	echo $e->getMessage();
	die();
}

if ($login) {
    if ($_SESSION["user_role"] === "superadmin") {
        header('Location: /admin.php');
    } else {
        header('Location: /');
    }
} else if ($account->isAuthenticated()) {
    if ($_SESSION["user_role"] === "superadmin") {
        header('Location: /admin.php');
    } else {
        header('Location: /');
    }
} else {
    header('Location: /login.php');
}
?>
