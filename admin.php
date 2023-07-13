<!DOCTYPE html>
<?php

session_start();

require './api/config/db_inc.php';
require './api/objects/account_class.php';

$account = new Account();

if (!$account->sessionLogin()) {
    if (!$account->isAuthenticated()) {
        header('Location: login.php');
        die();
    }   
}

if ($_SESSION["user_role"] !== "superadmin" ) {
    header('Location: /');
    die();
}

?>
<html>
    <head>
        <link rel="stylesheet" href="style-colors.css">
        <link rel="stylesheet" href="style-defaults.css">
        <link rel="stylesheet" href="style-admin.css">
        <script src="js/database/institutions.js" defer></script>
        <script src="js/database/account.js" defer></script>
        <script src="js/administration.js" defer></script>
<script>
Date.prototype.getWeek = function(){
    var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    var dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil((((d - yearStart) / 86400000) + 1)/7)
}
    let DATE = new Date();
    let DATE_YEAR = new Date().getFullYear().toString();
    let DATE_WEEK = new Date().getWeek().toString();
    DATE_WEEK.length === 1 && (DATE_WEEK = "0"+DATE_WEEK)
    let DATE_YEAR_WEEK = `${DATE_YEAR}-${DATE_WEEK}`
</script>
    </head>
    <body id="Administration" onload="renderInstitutions(); renderUsers()">
        <button id="Logout-button" onClick="logout()">Logout</button>
        <h1>Administration</h1>
        <div class="container">
            <div class="container-institutions">
                <h2>Einrichtungen</h2>
                <div id="Institutions"></div>
            </div>
            <div class="container-users">
                <h2>Benutzer</h2>
                <div class="role-hints">
                    <div>Benutzer:</div><div>Kann Schichtpläne einsehen.</div>
                    <div>Einrichtungs-Administrator:</div><div>Kann Schichtpläne erstellen und bearbeiten.<br>Kann Benutzer und Einrichtungs-Administratoren hinzufügen.</div>
                    <div>Super-Administrator:</div><div>Kann Einrichtungen hinzufügen</br>Kann Einrichtungs-Administratoren und Super-Administratoren hinzufügen</div>
                </div>
                <div id="Users"></div>
            </div>
        </div>
        <div class="Popup Popup-add-new">
            <div class="Popup-container">
                <div class="container">
                    <h2 class="title">Einrichtung hinzufügen</h2>
                    <div class="container-input">
                        <label>Name</label>
                        <input class="name">
                    </div>
                    <div class="container-buttons">
                        <button class="abort" onClick="closePopup()">Abbrechen</button>
                        <button class="cofirm" onClick="addNewInstitution()">Hinzufügen</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="Popup Popup-add-new-user">
            <div class="Popup-container">
                <h2 class="title">Benutzer hinzufügen</h2>
                <div class="container">
                    <label>Name: </label><input class="name">
                    <label>Passwort: </label><input class="password" type="password">
                    <label>Passwort wiederholung: </label><input class="password-confirm"type="password">
                    <label class="label-institution">Einrichtung: </label>
                    <label class="label-select-institution chevron-select chevron-down">
                        <select class="select-institution"> </select>
                    </label>
                    <label>Rolle: </label>
                    <label class="chevron-select chevron-down">
                        <select class="select-role" onchange="changeSelectRole(this.value)">
                            <option value="admin" selected="selected">Einrichtungs-Administrator</option>
                            <option value="superadmin">Super-Administrator</option>
                        </select>
                    </label>
                    <div class="container-buttons">
                        <button class="abort" onClick="closePopup()">Abbrechen</button>
                        <button class="cofirm" onClick="addNewUser()">Hinzufügen</button>
                    </div>
                    <p class="hint"></p>
                </div>
            </div>
        </div>
        <div class="Popup Popup-request-remove-institution">
            <div class="Popup-container">
                <div class="container-title">
                    <h2 class="title">Einrichtung </h2>
                    <h2 class="name"></h2>
                    <h2 class="title"> löschen</h2>
                </div>
                <div class="container">
                    <div class="container-password"><label>Passwort: </label><input class="password" type="password"></div>
                    <p class="hint"></p>
                    <div class="container-buttons">
                        <button class="abort" onClick="closePopup()">Abbrechen</button>
                        <button class="confirm">Löschen</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="Popup Popup-remove-user">
            <div class="Popup-container">
                <div class="container-title">
                    <h2 class="title">Benutzer </h2>
                    <h2 class="name"></h2>
                    <h2 class="title"> löschen</h2>
                </div>
                <div class="container">
                    <div class="container-password"><label>Passwort: </label><input class="password" type="password"></div>
                    <p class="hint"></p>
                    <div class="container-buttons">
                        <button class="abort" onClick="closePopup()">Abbrechen</button>
                        <button class="confirm" onClick="removeUser()">Löschen</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="Popup Popup-edit-user">
            <div class="Popup-container">
                <div class="container-title">
                    <h2 class="title">Benuter </h2>
                    <h2 class="name"></h2>
                    <h2 class="title"> bearbeiten</h2>
                </div>
                <div class="container">
                    <div class="container-name">
                        <h3>Name ändern</h3>
                        <input class="name"/>
                        <div class="container-buttons">
                            <button class="abort" onClick="closePopup()">Abbrechen</button>
                            <button class="confirm" onClick="changeName()">Ändern</button>
                        </div>
                    </div>
                    <p class="hint hint-name"></p>
                    <div class="container-password">
                        <h3>Neues Passwort</h3>
                        <label>Passwort: </label><input class="password_1" type="password">
                        <label>Passwort wiederholung: </label><input class="password_2" type="password">
                        <button class="abort" onClick="closePopup()">Abbrechen</button>
                        <button class="confirm" onClick="changePassword()">Ändern</button>
                    </div>
                    <p class="hint hint-password"></p>
                </div>
            </div>
        </div>
    </body>
</html>
