<!DOCTYPE html>
<?php

session_start();

require './api/config/db_inc.php';
require './api/objects/account_class.php';

$account = new Account();
$login = FALSE;

// 1. Insert a new account (execute twice to test the "already existing" account error)
/*
try {
    $newId = $account->addAccount('test', 'test123123', 'admin', '1', "false");
} catch (Exception $e)
{
    echo $e->getMessage();
    die();
}

echo 'The new account ID is ' . $newId;
*/

if (!$account->sessionLogin()) {
    if (!$account->isAuthenticated()) {
        header('Location: login.php');
        die();
    }
}

if ($_SESSION['user_role'] === "superadmin") {
    header('Location: admin.php');
    die();
}
?>
<html lang=de-DE>
    <head>
	<meta charset="utf-8">
    <title>Dienstplan</title>
    <link rel="stylesheet" href="style-colors.css">
    <link rel="stylesheet" href="style-defaults.css">
    <link rel="stylesheet" href="style.css">
<?php if ($_SESSION["user_role"] !== "admin") { ?>
    <link rel="stylesheet" href="style-visitor.css">
<?php } ?>
<?php if ($_SESSION["user_role"] === "user") { ?>
    <link rel="stylesheet" href="style-user.css">
	<script src="js/user.js" defer></script>
<?php } ?>
	<script src="js/settings.js" defer></script>
	<script src="js/database/database.js" defer></script>
	<script src="js/database/settings.js" defer></script>
	<script src="js/database/departments.js" defer></script>
	<script src="js/database/persons.js" defer></script>
	<script src="js/database/person_changes.js" defer></script>
	<script src="js/database/roster.js" defer></script>
	<script src="js/database/roster-changes.js" defer></script>
	<script src="js/database/shifts.js" defer></script>
	<script src="js/database/shift-labels.js" defer></script>
	<script src="js/database/closingtime.js" defer></script>
	<script src="js/database/data-to-database.js" defer></script>
	<script src="js/scroll.js" defer></script>
	<script src="js/popup.js" defer></script>
	<script src="js/startpage.js" defer></script>
	<script src="js/person.js" defer></script>
	<script src="js/roster.js" defer></script>
	<script src="js/roster-person-menu.js" defer></script>
	<script src="js/closing-time.js" defer></script>
	<script src="js/vacations-overview.js" defer></script>
	<script src="js/copy-person-shifts.js" defer></script>
	<script src="js/shortcuts.js" defer></script>
	<script src="js/get-lawful-vacations.js" defer></script>
	<script src="js/console.js" defer></script>
<script>
    let DATA = {sd: [], sw: []}
let DISABLE_WINDOW_RELOAD = true
/*REPLACE
window.addEventListener('beforeunload', (event) => {
// Cancel the event as stated by the standard.
if (DISABLE_WINDOW_RELOAD) return
event.preventDefault();
// Chrome requires returnValue to be set.
event.returnValue = '';
});

REPLACE*/


if (typeof structuredClone !== "function") {
   structuredClone = (obj) => {
      if(typeof obj !== 'object' || obj === null) {
         return obj;
      }

      if(obj instanceof Date) {
         return new Date(obj.getTime());
      }

      if(obj instanceof Array) {
         return obj.reduce((arr, item, i) => {
            arr[i] = structuredClone(item);
            return arr;
         }, []);
      }

      if(obj instanceof Object) {
         return Object.keys(obj).reduce((newObj, key) => {
            newObj[key] = structuredClone(obj[key]);
            return newObj;
         }, {})
      }
   }
}

let colors_red_orange_green = [ "#ff4949", "#ff7a4c", "#ffaa4f", "#fbc966", "#c0c666", "#8ec678", "#6fba5c" ]

let CLOSINGTIMES

let CONSOLE = false
let CONSOLE_INPUT = []
let CONSOLE_OPTIONS = []

const DAYS = [ "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag" ]

let EDITABLE_TABLES = []
let EDITABLE_ROW = false
let EDITABLE_ROWS_TOP
let EDITABLE_ROW_BOTTOM = false
let EDITABLE_ROWS_BOTTOM
let EDITABLE_CELL = false
let EDITABLE_CELLS_RIGHT
let DISPLAY_OVERTIME = false
let EDITABLE_TD_0 = ""
DAYS.forEach((day, day_id) => { let id = day_id+1; eval("EDITABLE_TD_"+id+" = ''")})

let DEPARTMENTS = [ {id: 1, v: ""}, {id: 2, v: "Elementar"}, {id: 3, v:"Kleinkind"}]
let DEPARTMENT_COLORS = [ "#ffffff", "#ecf5ff", "#f9f9ee", "#ecfffb", "#ecfff0", "#ffeeec", "#ffecfc", "#ecedff", "#ecfbff"]

NOWEEKEDIT = false

let SHIFT_LABELS = [{i: 0, n: "Frei", c: "Frei"}, {i: 1, n: "Schule", c: "S"}]

let SETTINGS_LABELS

let PRINT_ZOOM = [100, 78]

let DATA_LAST_CREATED = -1

let INVIEW = ""
let ROSTERS = []
let ROSTERS_YEARWEEK
let ROSTER_TABLES
let ROSTER_TABLE_WEEK
let ROSTER_PERSON_INFOS
let ROSTER_PERSON_INFOS_FROM
let ROSTER_PERSON_INFOS_TO
let LOADED_TABLES
let LOADINGS = []

let HOURS_DEFAULT = 39.5


let PERSONS_ALL
let PERSONS_DEFAULT = []
let PERSONS = []
let PERSONS_ROSTER = []
let PERSONS_WEEK = []
let PERSONS_TABLE_TO = []
let PERSONS_TABLE_FROM = []
let PERSON_NEW_ID

let TIMES = []
let DAYBREAK_1 = 0.5
let DAYBREAK_2 = 0.25

let VERSIONS = [1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 1.11, 1.12, 1.13, 1.14, 1.15, 1.16, 1.17, 1.18, 1.19, 1.21, 2.1, 2.2, 2.21, 2.22, 2.23, 2.24, 2.25, 2.26, 2.27, 2.28, 2.29, 2.3 ,2.31, 2.32, 2.33, 2.34, 2.35]
let VERSION_DEFAULT = VERSIONS[VERSIONS.length-1]
let VERSION 

let ROSTER_DEFAULT = []
let ROSTER = []
let ROSTER_TABLE_FROM = []
let ROSTER_TABLE_TO = []
let ACTIVE_ROSTERS_MAPPED = []

Date.prototype.getWeek = function(){
    var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    var dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil((((d - yearStart) / 86400000) + 1)/7)
};


let DATE = new Date()
let DATE_YEAR = DATE.getFullYear();
let DATE_WEEK = DATE.getWeek();
let DATE_YEAR_WEEK = DATE_YEAR+"-"+DATE_WEEK
let DATE_YEAR_WEEK_OLD
let DATE_YEAR_WEEK_NEWEST
let DATE_YEAR_WEEK_AFTER
let DATE_YEAR_WEEK_OLDEST
let DATE_YEAR_WEEK_BEFORE
let DATE_YEAR_WEEK_BEFORE_WEEK
let DATE_YEAR_WEEK_TABLE_TO
let DATE_YEAR_WEEK_TABLE_FROM
let DATE_START

let PRINT_MODES = ["Hochformat", "Querformat"]


// a: activeSince(2022-49), n: name h: hours, d: department, f: freedays, m: mpa, i: ill, v: vacations, c: changes  [{ d: "2022-49", k: "n", v: "nameBefore49"], sl: [schicht_labels per day], sf: [freedays], sa: [average]]
const PERSONS_DEFAULT_LAYOUT = { activated: DATE_YEAR_WEEK, name: "", hours: HOURS_DEFAULT, department: 0, mpa: []}
DAYS.forEach(d => {PERSONS_DEFAULT_LAYOUT.mpa.push(0)})


</script>
	</head>
<?php if ($_SESSION["user_role"] === "admin") { ?>
   <body class="noscroll" onload="startRoster()">
<?php } else if ($_SESSION["user_role"] === "user") { ?>
    <body class="noscroll" onload="startVisitor().then(() => renderUserDetails())">
<?php } else { ?>
   <body class="noscroll" onload="startVisitor()">
<?php } if ($_SESSION["user_role"] === "superadmin") { ?>
        <button id="Superadmin-back-button" onClick='window.location="/admin.php"'>Zurück</button>
<?php } ?>

       <div class="main-container" onscroll="checkHideSettingsMenu()">
          
            <div id="Settings" class="page">
<?php if ($_SESSION["user_role"] === "admin") { ?>
               <div id="Menu-settings" class="active">
                   <h3>Dienstplan</h3>
                   <button class="toggle-menu d-none" onClick="toggleSettingsMenu()">
                       <img class="icon left" src="/fontawesome/bundle/solid/chevron-left.svg"/>
                       <img class="icon right" src="/fontawesome/bundle/solid/chevron-right.svg"/>
                   </button>
                   <button class="Menu-Person-container" onClick="renderPerson()">
                        <img class="icon" src="/fontawesome/bundle/solid/user.svg"/>
                   </button>
                   <div class="Menu-Closingtimes Menu-Vacations-overview dropdown">
                        <img class="icon" style="height: 18px;" src="/pngs/icons8-island-32.png"/>
                        <div class="d-none">
                            <button class="closingtime" onClick="openClosingTime()">Schließzeiten</button>
                            <button class="vacation" onClick="openVacationsOverview()">Urlaubsübersicht</button>
                        </div>
                   </div>
                   <button class="Menu-Settings-default" onClick="renderSettings()">
                       <img class="icon" src="/fontawesome/bundle/solid/gear.svg"/>
                   </button>
                   <button onCLick="visiteAdministration()">
                       <img class="icon" src="/fontawesome/bundle/solid/user-gear.svg"/>
                   </button>
                   <button class="Menu-Help" onClick="renderHelp()">
                       <img class="icon" style="font-weight: bold;"src="/fontawesome/bundle/solid/question.svg"/>
                   </button>
                   <button id="Logout-button" onClick="logout()">
                       <img class="icon" src="/fontawesome/bundle/solid/right-from-bracket.svg"/>
                   </button>
               </div>
               <div id="Settings-container">
                   <div id="Person-container" class="settings-box active d-none">
                       <h2>Personen</h2>
                       <div id="Person-list-buttons">
                           <button onClick="setSelectRenderPerson(this, 'active')" title="Alle in dieser woche aktiven Personen anzeigen" class="person-active active">Aktiv</button>
                           <button onClick="setSelectRenderPerson(this, 'all')" title="Alle aktiven Personen anzeigen"  class="person-all">Alle</button>
                           <button onClick="setSelectRenderPerson(this, 'removed')" title="Alle gelöschten Personen anzeigen" class="person-removed">Gelöscht</button>
                       </div>
                       <table id="Person">
                           <thead>
                               <tr>
                                   <th>Name</th>
                                   <th>Stunden</th>
                                   <th>Bereich</th>
                                   <th id="Person-table-freedays">Frei</th>
                                   <th id="Person-table-labels">Labels</th>
                                   <th id="Person-table-mpa" title="mittelbar pädagogische Arbeit">mpA</th>
                                   <th id="Person-table-illnes">Krank</th>
                                   <th id="Person-table-betterment" class="td-overflow"><div>Weiterbildung</div></th>
                                   <th id="Person-table-vacation">Urlaub</th>
                                   <th id="Person-table-overtime" title="Überstunden bis einschließlich dieser Woche">Überstunden</th>
                               </tr>
                           </thead>
                           <tbody><tr><td>Mitarbeiter hinzufügen</td></tr></tbody>
                       </table>
                       <button onClick='addPerson()' class="button-add-person button-whitegreen">Hinzufügen</button>
                       <div id="Week-select" class="settings-box">
                           <input type="date" name="date" id="Roster-week-input" onChange="changeDate(this.value)" required>
                           <button onClick="changeDate('prev')">vorherige Woche</button>
                           <button onClick="changeDate(new Date())">diese Woche</button>
                           <button onClick="changeDate('next')">nächste Woche</button>
                           <label id="Week-select-overview" class="chevron-select chevron-down"></label>
                       </div>
                   </div>
                   <div id="Vacations-overview"  class="settings-box d-none"></div>
                   <div id="Closingtimes" class="settings-box d-none"></div>
                   <div id="Settings-default" class="settings-box active d-none">
                       <h2>Einstellungen</h2>
                       <div class="container">
                           <div class="container-buttons">
                               <button id="Settings-weekly-button" class="active" onClick="changeSettingsView(this, 'weekly')">Wöchentlich</button>
                               <button id="Settings-global-button" onClick="changeSettingsView(this, 'global')">Allgemein</button>
                           </div>
                           <div id="Settings-weekly">
                               <div class="timesteps-container settings-item"></div>
                               <div class="daybreaks-container settings-item"></div>
                               <div class="timestart-container settings-item"></div>
                               <div class="timeend-container settings-item"></div>
                               <div class="specialstart-container settings-item"></div>
                               <div id="Settings-day-time-change"></div>
                           </div>
                           <div id="Settings-global" class="d-none"></div>
                       </div>
                   </div>
               </div>

<?php } ?>
           </div>
<?php if ($_SESSION["user_role"] === "admin") { ?>
            <div id="Roster-days-container" class="page">
               <div id="Sort-roster-by" class="settings-box">
                   <div class="sort-box">
                       <button id="Sort-roster-by-name" class="sort-roster-by sort" name="n" onClick="sortRosterBy('days', this)">Name</button>
                       <button id="Sort-roster-by-department" class="sort-roster-by sort" name="d" onClick="sortRosterBy('days', this)">Bereich</button>
                       <button id="Sort-roster-by-hours" class="sort-roster-by sort" name="h" onClick="sortRosterBy('days', this)">Stunden</button>
                   </div>
               </div>
            </div>
<?php } ?>
<?php if ($_SESSION["user_role"] === "user") { ?>
<div id="User-details" class="page"> 
    <h2 class="main-title">Dienstplan</h2>
</div>
<?php } ?>
           <div id="Roster-container-week" class="page">
<?php if ($_SESSION["user_role"] === "admin") { ?>
               <div id="Roster-week-view-settings">
                   <button id="Roster-week-view-settings-toggle-button" class="button-orange" onClick='this.parentNode.classList.toggle("active"); this.classList.toggle("active");'>Einstellungen Wochenübersicht</button>
                   <div class="settings">
                       <div class="row">
                           <div id="Roster-week-display-overtime">
                               <button onClick="rosterWeekDisplayOvertime(this)">Überstunden anzeigen</button>
                           </div>
                           <div id="Roster-week-print-mode">
                               <label>Druckausrichtung: </label>
                               <button onClick="changePrintMode(this)" title="Druckeinstellung für die Ausrichtung.&#010;Die Ausrichtung muss ebenfalls in den Druckeinstellungen, welche sich nach drücken auf 'Drucken' öffnen, geändert werden">Hochformat</button>
                           </div>
                           <div id="Roster-week-print-zoom">
                               <label>Druckvergrößerung: </label>
                               <div>
                                   <button title="verkleinern" onClick="setPrintZoomLevelValue(-1)">-</button>
                                   <input type="range" min="40" max="120">
                                   <button title="vergrößern" onClick="setPrintZoomLevelValue(+1)">+</button>
                                   <div class="zoom-value"></div>
                               </div>
                           </div>
                       </div>
                       <div class="row">
                           <div id="Roster-week-add-editable-row">
                               <button onClick="rosterWeekAddEditableRow(this)" class="row-top" title="Die Standarteinstellung kann in den Einstellungen -> Allgemein, eingestellt werden.">Bearbeitbare Zeile einfügen - oben</button>
                               <button onClick="rosterWeekAddEditableRowBottom(this)" class="row-bottom" title="Die Standarteinstellung kann in den Einstellungen -> Allgemein, eingestellt werden.">Bearbeitbare Zeile einfügen - unten</button>
                           </div>
                           <div id="Roster-week-add-editable-cell">
                               <button onClick="rosterWeekAddEditableCell(this)" title="Die Standarteinstellung kann in den Einstellungen -> Allgemein, eingestellt werden.">Bearbeitbare Spalte einfügen</button>
                           </div>
                           <button id="Roster-week-week-info" onClick="toggleSetWeekInfo(this)">Wocheninformation</button>
                       </div>
                       <div class="row">
                           <div id="Set-week-info-container" class="d-none">
                               <textarea rows="10" cols="50" onchange="setWeekInfo(this.value)"></textarea>
                           </div>
                       </div>
                   </div>
               </div>
               <div id="Roster-week-buttons-edit-sort">
                   <button id="Table-week-editable-button" onClick="this.classList.toggle('active'); toggleTableWeekEditeable('Roster-week-table')" title="Hiermit kannst du in der Tabelle die Zeiten ändern.">Schichten bearbeiten</button>
                   <div id="Sort-week-by">
                       <div  class="sort-box">
                           <button id="Sort-week-by-name" class="sort-week-by sort" name="n" onClick="sortRosterBy('week', this)">Name</button>
                           <button id="Sort-week-by-department" class="sort-week-by sort" name="d" onClick="sortRosterBy('week', this)">Bereich</button>
                           <button id="Sort-week-by-hours" class="sort-week-by sort" name="h" onClick="sortRosterBy('week', this)">Stunden</button>
                       </div>
                   </div>
               </div>
<?php } ?>

               <div id="Roster-week-container"></div>
               <div class="Footer">
                   <a title="Impressum" href="https://www.christianimmanuel.de">Impressum</a>
                   <a title="Datenschutz" href="https://www.christianimmanuel.de">Datenschutz</a>
               </div>
           </div>
       </div>
       <div id="Menu">
           <div id="Menu-item-week">
               <button id="Menu-week" onClick='document.getElementById("Roster-week-container")?.scrollIntoView(); closePopup()'>Woche</button>
               <label id="Menu-week-select" class="chevron-select chevron-down"></label>
<?php if ($_SESSION["user_role"] === "admin") { ?>
               <button id="Roster-copy-person-from">
                   <img class="icon" src="/fontawesome/bundle/solid/calendar.svg"/>
                   <img class="icon" src="/fontawesome/bundle/solid/arrow-right.svg"/>
                   <img class="icon" src="/fontawesome/bundle/regular/calendar.svg"/>
               </button>
<?php } ?>
           </div>
<?php if ($_SESSION["user_role"] === "admin") { ?>
           <div class="menu-item-days-container">
               <button class="chevron-left" title="letze Woche" onClick="changeDate('prev')"></button>
               <div id="Menu-item-days"></div>
               <button class="chevron-right" title="nächste Woche" onClick="changeDate('next')"></button>
           </div>
           <input id="Zoom-roster" title="Dienstplan Tagesübersichten zoomen" type="range" min="50" max="100" value="100" oninput="changeZoomLevel(this.value)">
<?php } else { ?>
           <div id="Week-select" class="settings-box">
               <button onClick="changeDate('prev')">vorherige Woche</button>
               <button onClick="changeDate(new Date())">diese Woche</button>
               <button onClick="changeDate('next')">nächste Woche</button>
           </div>
           <button id="Logout-button" onClick="logout()"><img class="icon" src="/fontawesome/bundle/solid/right-from-bracket.svg"/></button>
<?php } ?>
       </div>
       <div id="Edit-person">
           <div id="Edit-person-container">
               <div class="remove"><button class="button-remove">löschen</button></div>
               <div class="person-container edit-box">
                   <div class="container">
                       <div class="select-assign-container"></div>
                       <div class="name"><label class="title">Name:</label><input/></div>
                       <div class="hours"><label class="title">Stunden:</label><input type="number" min="0" max="168" step="0.5"/></div>
                       <div class="department"><label class="title">Bereich:</label></div>
                   </div>
                   <div class="activation" title="Einstellungs KW"><label class="title">Aktiviert:</label><div class="input-container"></div></div>
               </div>
               <div id="Edit-person-shift-settings" class="edit-box">
                   <label class="title">Schichteinstellung</label><div class="select-assign-container"></div><div class="container"></div>
               </div>
               <div id="Edit-person-mpa" class="edit-box">
                   <label class="title">MPA:</label><div class="select-assign-container"></div><div class="container"></div>
               </div>
               <div id="Edit-person-illnesses" class="edit-person-table-container edit-box">
                   <label class="title">Krank:</label><div class="container"></div><div class="container-add"></div>
               </div>
               <div id="Edit-person-betterments" class="edit-person-table-container edit-box">
                   <label class="title">Weiterbildung:</label><div class="container"></div><div class="container-add"></div>
               </div>
               <div id="Settings-vacations" class="edit-person-table-container edit-box">
                   <label class="title">Urlaub:</label><div class="container"></div><div class="container-add"></div>
               </div>
               <div id="Edit-person-overtime" class="edit-box">
                   <label class="title">Überstunden:</label><div class="container-add"></div><div class="container"></div>
               </div>
               <button class="button-save edit-close">Fertig</button>
           </div>
       </div>
       <div id="Popup"><div id="Popup-container"></div></div>
       <div id="Loading-screen" class="d-none"><div>.</div><div>.</div><div>.</div></div>
       <div id="Console" class="d-none font-number">
           <div id="Console-help"></div>
           <div id="Console-input" ></div>
       </div>
      <script>

logout = () => {
    fetch("/api/logout.php", {
        method: "POST",
        headers: {
        "Content-Type": "application/json; charset=UTF-8"
        }
    }).then(() => {window.location = "login.php"})
}

let BLOCK_MENU_DAYS = document.getElementById("Menu-item-days")
renderMenuWeeks = () => {
   DAYS.forEach((day, day_id) =>{
      let block_menu_week_button = document.createElement("button")
      block_menu_week_button.setAttribute("onClick", 'document.getElementById("Roster-'+day_id+'")?.scrollIntoView(); closePopup()')
      block_menu_week_button.innerHTML = day
      BLOCK_MENU_DAYS.appendChild(block_menu_week_button)
   })
}

exportRoster = () => {
   window.setTimeout(() => {
      let data = { DATA }
      let filename = "Dienstplan_"+DATE_YEAR_WEEK_NEWEST+".json"
      let blob = new Blob([JSON.stringify(data)], {type: "application/json;charset=utf-8"})
      let url = URL.createObjectURL(blob);
      let elem = document.createElement("a");
      elem.href = url;
      elem.download = filename;
      document.body.appendChild(elem);
      elem.click();
      document.body.removeChild(elem);
   }, 100)
}

setRosterFromFile = (e) => {
   showLoading(); window.setTimeout(() => {
      ALL = JSON.parse(e.target.result).DATA
      if (typeof ALL === "undefined") {ALL = JSON.parse(e.target.result)}
      startRoster(ALL)
      hideLoading()
   },1)
}
importRoster = (ev) => {
   DISABLE_WINDOW_RELOAD = false
   let reader = new FileReader()
   reader.onload = setRosterFromFile
   let content = reader.readAsText(ev.target.files[0])
}

printTable = (table, year_week) => {
   if (EDITABLE_TABLES.indexOf("Roster-week-table") > -1) {
      document.getElementById("Table-week-editable-button").classList.remove("active")
      toggleTableWeekEditeable('Roster-week-table')
   }
let style = "#Roster-week-container> button {display: none;}" +
"body {font-family: Arial, Helvetica, sans-serif; margin: auto; width: 200mm; }" +
".font-number { font-family: Arial, Helvetica, monospace}" +
".v-bottom { vertical-align: bottom !important; }" +
"#Print-container { margin: 40px 40px 20px; }" +
"* { box-sizing: border-box; -moz-box-sizing: border-box; }" +
"#Roster-week-container { transform-origin: top left;}" +
"table { border-collapse: collapse;}" +
"table, th, td { border: 1px solid; }" +
"tbody td {vertical-align: top;}" +
"p {margin: 0; padding: 6px;}" +
".tr-empty td {height: 5px !important;}" +
"#Roster-week-container .tr-editable td, #Roster-week-container .tr-editable th { font-weight: normal; padding: 8px 6px; white-space: pre; vertical-align: top; }" +
"#Roster-week-container .Roster-week-td.free { vertical-align: middle;}" +
"#Roster-week-container .Roster-week-td.free p { margin: auto; font-size: 19px; }" +
"#Roster-week-container .Roster-week-td.free p.time { max-width: 100px; overflow: hidden; }" +
".Roster-week-td { height: 0; vertical-align: top;}" +
".Roster-week-td:first-child { vertical-align: middle;}" +
".Roster-week-td .container { display: grid; font-family: Arial, Helvetica, monospace; min-width: max-content; grid-template-areas: 'time time time' 'break mpa duration'; grid-template-columns: 1fr auto 1fr; gap: 0; white-space: pre; }" +
".Roster-week-td .container p {padding: 0 4px;}" +
".Roster-week-td .time {     margin-top: 6px; grid-area: time; text-align: center; }" +
".Roster-week-td .time >div { display: flex; }" +
".Roster-week-td .time p {   margin-bottom: 3px; margin-top: 0; }" +
".Roster-week-td .duration { justify-content: flex-end; grid-area: duration;}" +
".Roster-week-td .mpa { grid-area: mpa; margin-top: 2px; text-align: center; font-size: 12px; padding: 0 2px 0 4px;}" +
".Roster-week-td .label { grid-area: label; text-align: center; font-size: 19px; margin: auto; display: flex; padding: 0 4px 0 2px; }" +
".Roster-week-td .info { max-width: fit-content; font-size: 12px; white-space: break-spaces;}" +
".Roster-week-td .info >div { margin: 0 4px 4px;}" +
".break {text-align: right; }" +
".td-name { display: grid; gap: 6px 0; grid-template-areas: 'name overtime' 'hours breaks'; margin-top: 4px; }" +
".td-name p:first-child { grid-area: name; padding-bottom: 3px;}" +
".td-name p:nth-child(2) { font-size: 10px; grid-area: overtime; text-align: right; }" +
".td-name p:nth-child(3) { font-size: 14px; grid-area: hours; padding-right: 0; }" +
".td-name p:nth-child(4) { font-size: 14px; grid-area: breaks; text-align: right; }" +
".td-name p { margin: 0; padding: 2px 8px 6px; }" +
".duration, .break {display: flex; align-items: flex-end; margin: 7px 0 5px; }" +
".td-editable-cell {border-left: 4px double black; font-weight: normal; padding: 5px 3px; min-width: 60px; vertical-align: top; white-space: pre; text-align: left; }" +
"#Roster-week-info { max-width: fit-content; white-space: break-spaces; margin-top: 40px; }"
let zoom
if (SETTINGS.printmode === 1) {
    zoom = SETTINGS.zoom_print_v
    if (navigator.userAgent.search("Firefox") === -1) {
    style = style+` @media print{@page {size: landscape} } body {zoom: ${zoom}%;}` +
    "td { padding: 4px 13px !important;}"
    } else {
    style = style+` @media print{@page {size: landscape} }` +
    `#Roster-week-container {transform: scale(${zoom*0.01})}` +
    "td { padding: 4px 13px !important;}"
    }
} else if (SETTINGS.printmode === 0) {
    zoom = SETTINGS.zoom_print_h
    if (navigator.userAgent.search("Firefox") === -1) {
    style = style+ `body {zoom: ${zoom}%;}`
    } else {
    style = style+ `#Roster-week-container {transform: scale(${zoom*0.01})}`
    }
}

let divContents = document.getElementById(table).innerHTML;
let a = window.open('', '', 'height=500, width=500');
a.document.write('<html>');
a.document.write('<head>');
a.document.write(`<title>Dienstplan_${year_week}</title>`);

a.document.write('<style>'+style+'</style>');
a.document.write('</head>');
a.document.write('<body style="background: white;" >');
a.document.write('<div id="Print-container">');
a.document.write('<div id="Roster-week-container">');
a.document.write(divContents);
if (SETTINGS.printmode === 0) {
	let zoom_string = '<script>let zoom = `${((document.body.offsetWidth-84)/document.getElementById("Roster-week-table").offsetWidth)*100}`; zoom = `${(('+zoom+'*zoom)/100)}`; if (navigator.userAgent.search("Firefox") === -1) { document.getElementById("Roster-week-container").style.zoom = `${zoom}%`; } else {document.getElementById("Roster-week-table").style = `transform: scale(${zoom*0.01}); transform-origin: inherit`;console.log(zoom)} </'+'script>';
	a.document.write(zoom_string);
}
a.document.write('</div>');
a.document.write('</div>');
a.document.write('</body></html>');
a.document.close();
a.print();
}

hhMMToTime = (time) => {
   let time_string = time.toString()
if (time_string.length === 4) {time_string = `0${time_string}`}
   if(time_string.indexOf(":15") >= 0) {
      time_string = time_string.replace(":15", ".25")
   } else if(time_string.indexOf(":30") >= 0) {
      time_string = time_string.replace(":30", ".5")
   } else if(time_string.indexOf(":45") >= 0) {
      time_string = time_string.replace(":45", ".75")
   } else {
      time_string = time_string.replace(":00", "")
   }
console.log(time_string)
   return parseFloat(time_string)
}
timeToHHMM = (time) => {
   let time_string = time.toString()
   if(time_string.indexOf(".25") >= 0) {
   return time_string.replace(".25", ":15")
   } else if(time_string.indexOf(".5") >= 0) {
   return time_string.replace(".5", ":30")
   } else if(time_string.indexOf(".75") >= 0) {
   return time_string.replace(".75", ":45")
   } else {
   return time_string+":00"
   }
}
timeToFullHHMM = (time) => {
   let text = timeToHHMM(time)
   if (text.length === 4) {return `0${text}`}
   else {return text}
}


            </script>

   </body>
</html>
