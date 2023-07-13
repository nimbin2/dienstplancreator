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
} 
?>
<html>
    <head>
    <link rel="stylesheet" href="style-colors.css">
    <link rel="stylesheet" href="style-defaults.css">
    <link rel="stylesheet" href="style-login.css">
    <script src="js/settings.js" defer></script>
    <script src="js/database/shifts.js" defer></script>
<script>

login = (event) => {
    event.preventDefault();
    let name = document.getElementById("Login-input-name").value
    let password = document.getElementById("Login-input-password").value
	let data_id = document.querySelector("#Login-select-institution").value
	let login_data = {name: name, password: password, data_id: data_id}
    fetch("/api/login.php", {
        method: "POST",
        body: JSON.stringify(login_data),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })
    .then(response => response.json()).then(data => { 
        if (data === "mismatch") {
            document.querySelector(".container .errormessage").innerHTML = "Passwort und Name stimmen nicht überein."
        } else {
            window.location = "/redirect.php" 
        }
    })
    .catch(error => {
        fetch("/api/login.php", {
            method: "POST",
            body: JSON.stringify(login_data),
            headers: { "Content-Type": "application/json; charset=UTF-8" }
        })
        .then(response_a => response_a.json()).then(data => { 
            if (data === "mismatch") {
                document.querySelector(".container .errormessage").innerHTML = "Passwort und Name stimmen nicht überein."
            } else {
                window.location = "/redirect.php" 
            }
        })
    })
}

dbGet_institutions = async () => {
    let response = await fetch("/api/institution/getAll.php", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })
    return await response.json()
}

renderInstitutions = () => {
let el = document.querySelector("#Login-select-institution")
	el.innerHTML = '<option value="superadmin">Administrator</option>'
	dbGet_institutions().then(institutions => {
		institutions.forEach((inst, i) => {
			let block = document.createElement("option")
			if (i === 0) {
				block.setAttribute("selected", "selected")
			}
			block.setAttribute("value", inst.id)
			block.innerHTML = inst.name
			el.appendChild(block)
		})
	})
}

</script>
    </head>
    <body>
        <div class="container">
            <h1 class="title">Dienstplan Login</h1>
            <form id="Login-form" method="post">
                <label>Name</label><input value="" autofocus id="Login-input-name">
                <label>Passwort</label><input value="" type="password" id="Login-input-password">
				<label>Einrichtung</label>
				<label><select id="Login-select-institution"></select></label>
                <input class="button-login" type="submit" value="Login"/>
            </form>
            <p class="errormessage"></p>
        </div>
<script>
let form = document.getElementById("Login-form");
form.addEventListener("submit", login, true);
renderInstitutions()
</script>
    </body>
</html>
