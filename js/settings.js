const TIME_STEPS_VALUES = [ 15, 30, 60 ]
const TIME_STEPS = [ 0.25, 0.5, 1 ]
const MINUTE_STEPS_VALUES = [ 15, 30, 45, 60 ]
const MINUTE_STEPS = [ 0.25, 0.5, 0.75, 1 ]
let TIME_STEP = 0.5
let TIME_START = 7
let TIME_END = 16
let TIME_SPECIALSTART = false

let block_settings = document.getElementById("Settings")

let improvement_texts = [
[false, "geteilte Schichten reparieren"],
[false, "schichtplan sortierbar"],
[false, "MPA einbauen"],
[false, "Einstellungen ausblenden"],
[false, "Personen bearbeiten button"],
[false, "Personenveränderungen nur in der Zukunft"],
[false, "Scroll with drag"],
[false, "Extrainfos für Schichten"],
[false, "Extrainfos für die gesamte Woche"],
[false, "Sort by department and hour"],
[false, "Weiterbildung für Personen"],
[false, "Bereiche umbenennbar in Einstellungen(Bereich, Freie Tage)"],
[false, "MPA in Tabelle anzeigen"],
[false, "Überstunden der letzten Wochen anzeigen"],
[false, "change portrait print scale to zoom"],
[false, "Add roster zoom button(style.zoom)"],
[false, "roster Übertragen nach -> Alle"],
[false, "restructure roster database for times"],
[false, "add user zoom lvl for printing"],
[false, "Schließzeiten"],
[false, "Übersicht der erstelleten Dienstplanwochen"],
[false, "Bearbeiten overlay gegen versehentliches hinzufügen von Schichten?"],
[false, "keep old roster for faster loading"],
[false, "add extrabutton for splitted shift"],
[false, "add Activation of person"],
[false, "reduce use of getActivePerson function"],
[false, "button ->apply person changes on all rosters"],
[false, "create add department in settings"],
[false, "person table -> view all, just ativated, removed"],
[false, "reactivate persons button"],
[false, "rework freedays"],
[false, "add peolpe shift labels"],
[false, "add/remove shift labels"],
[false, "add copy shift to next week"],
[false, "add shift hover info to name field"],
[false, "possibility to display overtime in week table"],
[false, "fix roster menu no overflow"],
[false, "add setting editable row/cell default active"],
[false, "firefox is smashing my tables -> just during print preview,...."],
[false, "fix closingtime adds wrong date in roster"],
[false, "Urlaubs übersicht"],
[false, "info button keeps active also it shouldnt"],
[false, "add dropdown to add persons shifts of prev week"],
[false, "fix stupid date-string comparisons"],
[false, "fix person overview -> all sf not found"],
[false, "clean up the code a bit"],
[false, "add copy shifts from yw to yw table "],
[false, "fix loading screen"],
[false, "add editable row bottom"],
[false, "fix bug split shift sometimes not knowing the end time"],
[false, "keyboard shortcuts for rosters?"],
[false, "add mpa through roster person menu"],
[false, "bug remve shift keeps button extra shift"],
[false, "roster days max 100vh"],
[false, "roster drag vertical"],
[false, "scrollstep for roster"],
[false, "automatically add lawful vacations"],
[false, "lawful vacations add back button"],
[false, "fix if vacation name is too long"],
[false, "add edit shifts from within table view"],
[false, "troll vacations overview is rubbish"],
[true, "css colors to variables"],
[true, "Übertragen nach -> nächste woche"],
[true, "what happens if vacation overwrites vacation?"],
[true, "make inactive person editable"],
[true, "add closingtime edit to vacations-overview"],
[true, "transfer person => add name search"],
[true, "display total vacation days of person"],
[true, "add toggleable legend for cut infos to roster-week"],
[true, "Übersicht der Personen (veränderungen, überstunden pro woche, etc.)"],
[true, "Add button for possibility to display shift info outside of table"],
[true, "warn if copy shift overwrites shift"],
[true, "warn if person change changes roster"],
[true, "better layout for printing settings"],
[true, "weekinfo more customeable (li, h2, fontsize,..)"],
[true, "fix crosshair for zoomlevel"],
[true, "update help section"],
[true, "clean up the code"],
[true, "Layout überarbeiten"],
]
getImprovementText = () => {
    let text = ""
    improvement_texts.reverse().forEach(data => {
        if (data[0]) {text = `${text}<li>${data[1]}</li>`}
        else {text = `${text}<li><del>${data[1]}</del></li>`}
    })
    return text
}

const HELP = [
    ["Personen", `Die <b>Stundenzahl</b> der Personen sollte <b>ohne Pausenzeiten</b> angegeben werden. Pausen werden automatisch hinzugerechnet: 30min nach mehr als 6 Stunden, insgesamt 45min oder eine Stunde (Jeh nach Einstellung) nach 9 Stunden. Die Stunden werden in Stunden und nicht in minuten angegeben. Das bedeutet 1=60min, 0.5=30min.\n\nSollten bereits Schichten vergeben worden sein werden <b>Änderungen</b> in den Bereichen "Name, Stunden, Bereich, Freie Tage, MPA" <b>nicht für vergangene Wochen</b> übernommen. Als beispiel: Die Freien Tage in der Woche 49 werden nicht durch eine Änderung der Freien Tage in der Woche 50 beeinträchtigt.\nDer Berreich <b>mpA</b> bedeutet "mittelbar pädagogische Arbeit" und bezieht sich auf eine Arbeitszeit die <b>unabhängig vom Schichtplan</b> gearbeitet wird. Die Zeit wird wie bei den Stunden vergeben, was bedeutet 1=60min, 0.5=30min.`],
    ["Einstellungen", `Die Einstellungen werden pro Woche gespeichert.\nEs gibt nur eine Einstellungsmöglichkeit für eine Pause nach 9 Stunden. Bei der Angabe ist eine 30 minuten Pause nach 6 Stunden mit eingerechnet.`],
    ["Tastenkürzel", "Um schnell auf der Seite navigieren zu können gibt es die folgenden Tastenkürzel:\nw:\tWochenübersicht\n1-7:\tMo-Fr\np:\tPersonen tablle\ne:\tEinstellungen\nh:\tDatum ändern -> Heute\nn:\tDatum ändern -> nächste Woche\nv:\tDatum ändern -> vorherige Woche\nz:\tzuletzt gesehene Woche\nx:\tExportieren\nd:\tDrucken\n+:\tZoom vergrößern +15\n-:\tZoom verkleinern -15\n0:\tZoom normal"],
    ["Datum ändern", `Zum ändern des Datums findest du in dem Menu unten in der Mitte neben den Wochennamen einen Pfeil nach links um zur vorherigen Woche zu gelangen, sowie einen Pfeil nach links um zur nächsten Woche zu gelangen.\nUnter der Personenübersichtstabelle findest du ein Datumsfeld, in welches du ein Datum eintragen kannst, oder eines auswählen kannst indem du auf das icon links drückst.`],
    ["Schichten", `Um eine neue Schicht <b>hinzuzufügen</b> kannst du auf das große Feld bei der gewünschten Person während der gewünschten Zeit drücken. Eine neue Schicht wird mit der durchschnittlichen Arbeitszeit hinzugefügt. Bei eine Schicht länger als 6 Stunden wird eine Pause von 30min auf die gesamte Arbeitszeit hinzugerechnet, ab 9 Stunden insgesamt 45min oder eine Stunde, abhängig der Angabe in den Einstellungen. Die MPA Zeit wird von der Schicht abgerechnet.\n\nUm eine Schicht zu <b>verlängern</b> findest du vor oder nach der Schicht in der gewüschten Zeit einen Pfeil welcher die Schicht bis dort verlängert.\nUm eine Schicht zu <b>verkürzen</b> findest du während der Schicht in der gewünschten Zeit unten einen Pfeil nach rechts, welcher die Startzeit dort hin setzt, so wie einen Pfeil nach links, welcher die Endzeit verkürzt.\nSollte dein Zeitintervall auf 30min stehen findest im letzten grünen Feld der Schicht im oberen Teil einen Pfeil nach Links, welcher die Endzeit <b>um 15min verkürzt</b>.\n In den mittleren Feldern während einer Schicht findest du oben rechts ein "x" mit welchem du eine <b>geteilte Schicht</b> erstellen kannst. Um die Schichten wieder zusammen zu fügen musst du die zweite Schicht bis zur ersten verlängern.\n\nBeim neu laden von Schichten werden <b>nicht alle Buttons geladen</b>, was mit einer langen Ladezeit zusammen hängt. Um alle Buttons wider zu laden muss eine Schicht veränderert, bzw. erneut angelegt werden`],
    ["Tagesübersicht", `Um schnell zu einem Tag zu gelangen kannst du in dem Menu unten in der Mitte auf einen Tag klicken.\nIn der Tagesübersicht wird der Dienstplan erstellt.\nZum <b>scrollen nach links oder rechts</b> kannst du mit geklickter Maus den Plan verschieben\n<b>Über der Tabelle</b> findest du <b>links zwei Buttons</b> zum kopieren des gesamten Tages, <b>in der Mitte</b> Zahlen um schnell zu einer gewünschten Zeit zu scrollen, <b>rechts</b> einen Button zum löschen des gesamten Tages. In den <b>Namensfeldern</b> findest du unten <b>links</b> die vergenenen Stunden pro Woche/ die maximalen Stunden pro Woche. In der <b>mitte</b>, falls vorhanden, die MPA Zeit. <b>Rechts</b> findest du die Pausenzeit. Der <b>button oben rechts</b> im Namensfeld ist zum kopieren von Schichten\nIn den <b>Zeitfeldern</b> findest du <b>über der Zeit</b> die gewünschte Personenanzahl/die maximal gewünschten Personen. Die Anzahl kann mit den Pfeilen nebendran erhöht oder verringert werden. Um die Anzahl bei mehreren Zeiten gleichzeitig zu erhöhen kannst du mehrerere zahlen markieren indem du auf sie drückst. Um die Markierungen schnell wieder aufzuheben kannst du eine unmarkierte Zahl verändern.\nDie Zeitfelder werden jeh nach Belegung <b>farbig</b> hinterlegt: Rot bedeutet zu wenig vergebene Schichten, grün ist die gewünschte Anzahl, blau ist eine Überbelegung. Zwischen rot und grün gibt es sieben Abstufungen.`],
    ["Wochenübersicht", `Um schnell zu der Wochenübersicht zu gelangen gibt es im Menu unten links einen Button "Woche XY". XY ist die aktuelle Wochennummer (Wochen pro Jahr).\n<b>Unter den Namen</b> findest du <b>links</b> die vergenenen Stunden pro Woche/ die maximalen Stunden pro Woche. Zu den maximalen Stunden werden die Pausenzeiten dazugerechnet.\n<b>Rechts</b> findest du die gesamte Pausenzeit pro Woche.\n<b>In den Zeitfeldern</b> findest du <b>oben</b> die Schichtzeit. <b>Unten links</b> die gesamte Stundenanzahl, in der <b>Mitte</b> die MPA Zeit, <b>unten rechts</b> die Pausenzeit.`],
    ["Drucken", `Zum Drucken eines Dienstplans gibt es ganz unten auf der Seite über der Wochenübersicht einen Button "Drucken". Beim dücken dieses öffnet sich eine neue Seite mit der Wochenübersicht, sowie ein Fenster welches das Drucken oder abspeichern als PDF ermöglicht. Sollte das Format des Druckes nicht passen, hast du die Möglichkeit in dem Druckfenster, welches von deiner Distribution (Linux, Mac, Windows,..) geöffnet wird, die Einstellungen anzupassen. `],
    ["Speichern", `Zum speichern gibt es im Menu unten auf der rechten Seite einen Button <b>"Exportieren"</b>.\nBeim drücken diese wird entweder eine Datei automatisch in deinen Download Ordner gespeichert, oder du wirst aufgefordert einen  Ort zum speichern zu wählen (diese Einstellung lässt sich in deinen Browsereinstellungen ändern).\nDie gespeicherte Datei wird einen namen wie beispielsweise "<b>dienstplan-2022-49.json</b>" bekommen. der Name setzt sich aus dem Jahr und der Wochennummer (Wochen pro jahr) des zuletzt erstellten dienstplans zusammen.\nDie Datei ist eine JSON Datei und beinhaltet die zuvor erstellte Datenbank.`],
    ["Importieren", `Eine Datei welche zuvor gespeichert wurde kann auf der Startseite mit dem Button <b>"Datei importieren"</b>, oder bei einem Diensplan direkt mit dem Button oben rechts über den Einstellungen <b>"Importieren"</b>, importiert werden. Dafür öffnet sich ein Dateifenster in welchem du die gewünschte Datei auswählen kannst.\nDas importieren stellt alle zuvor gespeicherten Daten wieder her. `],
    ["Code", `Der Code dieser Seite ist mit html, javascript und css geschrieben und kann über den Quelltext eingesehen werden. Ich verzichte auf jegliche Zusatzpakete wie jquery, sass oder ähnliche npm/yarn Pakete.\nBei einem Zugriff auf diese Seite werden die folgenden Daten zur abwehr schädlicher Angriffe gespeichert:\n[Datum Zeitzone], IP-Adresse, "Art des Zugriffes", Erfolg(200/404..), Datenmenge\nEin so genannter "Log" sieht wie folgt aus:\n[26/Apr/2022:20:24:54 +0200] 0.0.0.0 "GET / HTTP/1.1" 200 11161.\nIch verzichte auf Cookies, google und co und habe kein interesse an deinen Daten.`],
    ["Zukünftige Verbesserungen", `<ul>${getImprovementText()}</ul>`]]



checkNaturalNumber = (n) => { 
    return n >= 0 && Math.floor(n) === +n;
}

isValidDate = (d) => { 
	return d instanceof Date && !isNaN(d);
}   

toggleSettingsMenu = () => {
    let block = document.querySelector("#Menu-settings")
    block.classList.contains("visible") ?
    block.classList.remove("visible") :
    block.classList.add("visible")
}
checkHideSettingsMenu = () => {
    let check = isElementInViewport(document.querySelector("#Settings"))
    let block_menu = document.querySelector("#Menu-settings")
    if (!block_menu) {return}
    let block_toggle = block_menu.querySelector(".toggle-menu")
    if (check) {
        block_menu.classList.add("active")
        block_menu.classList.remove("visible")}
    else {
        block_menu.classList.remove("active")
        block_menu.classList.remove("visible")
    }
}

checkElementInView = (where) => {
    let elements = []
    let elements_day = []
    DAYS.forEach((day, day_id) => elements_day.push("#Roster-"+day_id))
    if (where === "main") {elements = ["#Settings-default", "#Roster-days-container", "#Person-container", "#Closingtimes", "#Vacations-overview", "#Roster-container-week"]}
    checkEls = (els) => { 
        els.forEach(el_name => {
            let el = document.querySelector(el_name)
            if (el && !el.classList.contains("d-none")) {
                let check = isElementInViewport(el)
                if (check) {
                    if (el_name === "#Roster-days-container") {
                        checkEls(elements_day)
                    } else { 
                        INVIEW = el_name
                        return
                    }
                }
            }
        })
    }   
    checkEls(elements)
}
isElementInViewport = (el) => {
    let rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );  
}

visiteAdministration = () => {
    window.location = "/useradmin.php"
}

showLoading = (loading_function) => {
    LOADINGS.push(loading_function)
    document.getElementById("Loading-screen").classList.remove("d-none")
}
hideLoading = (loading_function) => {
    LOADINGS.splice(LOADINGS.indexOf(loading_function), 1)
    if (LOADINGS.length === 0) document.getElementById("Loading-screen").classList.add("d-none")
}

settingsContainerHideAll = (donthide) => {
    document.querySelector("#Settings").scrollIntoView()
    let blocks_hide = document.querySelectorAll("#Settings-container >*")
    for (let i=0; i<blocks_hide.length; i++) {
        blocks_hide[i].getAttribute("id") === donthide ? 
            blocks_hide[i].classList.remove("d-none") :
            blocks_hide[i].classList.add("d-none")
    }
    let blocks_hide_menu = document.querySelectorAll("#Menu-settings > *")
    for (let i=0; i<blocks_hide_menu.length; i++) {
        if (blocks_hide_menu[i].classList.contains(`Menu-${donthide}`)) {
            blocks_hide_menu[i].classList.add("active")
            if (donthide === "Closingtimes") {
                blocks_hide_menu[i].classList.add("closingtime")
                blocks_hide_menu[i].classList.remove("vacation")
            } else if (donthide === "Vacations-overview") {
                blocks_hide_menu[i].classList.add("vacation")
                blocks_hide_menu[i].classList.remove("closingtime")
            }
        } else {
            blocks_hide_menu[i].classList.remove("active")
        }
    }
}

changePrintZoomLvl = (z_id, el) => {
    if (SETTINGS.printmode === 0) {
        SETTINGS.zoom_print_h = parseFloat(el.value)
        dbSet_settings_zoom_print_h(parseFloat(el.value))
    } else {
        SETTINGS.zoom_print_v = parseFloat(el.value)
        dbSet_settings_zoom_print_v(parseFloat(el.value))
    }
    document.querySelector("#Roster-week-print-zoom .zoom-value").innerHTML = `${el.value}%`
}
setPrintZoomLevelValue = (change) => {
    if (SETTINGS.printmode === 0) {
        SETTINGS.zoom_print_h = SETTINGS.zoom_print_h+(change)
        dbSet_settings_zoom_print_h(SETTINGS.zoom_print_h)
    } else {
        SETTINGS.zoom_print_v = SETTINGS.zoom_print_v+(change)
        dbSet_settings_zoom_print_v(SETTINGS.zoom_print_v)
    }
    setPrintZoomLevel()
}
setPrintZoomLevel = async () => {
    let block_zoom = document.getElementById("Roster-week-print-zoom")
    if (!block_zoom) {return}
    let block_input = block_zoom.querySelector("input")
    let block_value = block_zoom.querySelector(".zoom-value")
    let value = SETTINGS.printmode === 0 ? SETTINGS.zoom_print_h : SETTINGS.zoom_print_v
    block_input.value = value
    block_value.innerHTML = `${value}%`
    block_input.setAttribute("onchange", `changePrintZoomLvl(${SETTINGS.printmode}, this)`)
    block_zoom.setAttribute("title", `${value}%\nVergrößerung, beim Drucken sichtbar.`)
}

changePrintMode = (el) => {
   if (SETTINGS.printmode === 0) {
      dbSet_settings_printmode(1)
      SETTINGS.printmode = 1
   } else {
      dbSet_settings_printmode(0)
      SETTINGS.printmode = 0
   }
   el.innerHTML = PRINT_MODES[SETTINGS.printmode]
   setPrintZoomLevel()
}

hideSettingsWeekly = () => {
    document.getElementById("Settings-weekly-button").classList.remove("active")
    document.getElementById("Settings-weekly").classList.add("d-none")
}
renderSettingsWeekly = (el) => {
    el.classList.add("active")
    document.getElementById("Settings-weekly").classList.remove("d-none")
    hideSettingsGlobal()  
}

hideSettingsGlobal = () => {
    document.getElementById("Settings-global-button").classList.remove("active")
    document.getElementById("Settings-global").classList.add("d-none")
}
renderSettingsGlobal = (el) => {
    el.classList.add("active")
    document.getElementById("Settings-global").classList.remove("d-none")
    hideSettingsWeekly()  
}

getRenames = (value) => {
    if (value === "m") {return {t: dbGet_settings_label_text(0), a: dbGet_settings_label_cut(0)}}
    else if (value === "i") {return {t: dbGet_settings_label_text(1), a: dbGet_settings_label_cut(1)}}
    else if (value === "b") {return {t: dbGet_settings_label_text(2), a: dbGet_settings_label_cut(2)}}
    else if (value === "v") {return {t: dbGet_settings_label_text(3), a: dbGet_settings_label_cut(3)}}
} 

renameFields = (field_id, field_value, value) => {
    if (value === "") return
    setN = async () => {
        SETTINGS_LABELS = await dbGet_settings_labels()
        if (field_id === 0 && field_value === "t") {
            document.getElementById("Person-table-mpa").innerHTML = getRenames("m").t
            document.querySelector("#Edit-person-mpa .title").innerHTML = getRenames("m").t
        } else if (field_id === 1 && field_value === "t") {
            document.getElementById("Person-table-illnes").innerHTML = getRenames("i").t
            document.querySelector("#Edit-person-illnesses .title").innerHTML = getRenames("i").t
        } else if (field_id === 2 && field_value === "t") {
            document.getElementById("Person-table-betterment").innerHTML = getRenames("b").t
            document.querySelector("#Edit-person-betterments .title").innerHTML = getRenames("b").t
        } else if (field_id === 3 && field_value === "t") {
            document.getElementById("Person-table-vacation").innerHTML = getRenames("v").t
            document.querySelector("#Settings-vacations .title").innerHTML = getRenames("v").t
        }
        getActiveRoster().then(() => {
            renderSettings()
            changeSettingsView(document.querySelector("#Settings-global-button"), 'global')
        })
    }
    if (field_value === "t") {dbSet_settings_label_text(field_id, value).then(() => setN())}
    else if (field_value === "a") {dbSet_settings_label_cut(field_id, value).then(() => setN())}

}

removeDepartment = (d_id) => {
    dbRemove_department(d_id).then(() => {
        dbGet_departments().then(dep => {
            DEPARTMENTS = dep
            setPerson().then(() => {
                renderPerson()
                addSettingsGlobal()
                getActiveRoster().then(() => {
                    renderSettings()
                    changeSettingsView(document.querySelector("#Settings-global-button"), 'global')
                })
            })
        })
})
}
renderAddDepartment = () => {
    document.querySelector("#Settings-global .add-department").classList.remove("d-none")
}
addDepartment = () => {
    let name = document.querySelector("#Settings-global .add-department input")?.value
    if (name.length === 0) {return}
    dbAdd_department(name).then(() => {
        dbGet_departments().then((d) => {
            DEPARTMENTS = d
            addSettingsGlobal()
        }) 
    })
}
changeShiftLabel = async (l_id, key, value) => {
    showLoading("changeShiftLabel")
    if (key === "n") dbSet_shift_label_text(l_id, value)
    else if (key === "c") dbSet_shift_label_cut(l_id, value)
    SHIFT_LABELS = await dbGet_shift_labels()
    getActiveRoster().then(() => {
        renderSettings()
        changeSettingsView(document.querySelector("#Settings-global-button"), 'global')
        hideLoading("changeShiftLabel")
    })
}
removeShiftLabel = async (l_id) => {
    showLoading("removeShiftLabel")
    dbGet_person_changes_where_key_and_value("sl", l_id).then((changes) => {
        let free_id = SHIFT_LABELS.sort((a,b) => a.id-b.id).find(l => l.name === "Frei").id
        for (let c=0; c<changes.length; c++) {
            let change = changes[c]
            dbGet_person_change_where_yearweek_and_day_and_person_and_key(change.yearweek, change.day_id, change.person_id, "sf").then((change_sf) => {
                    if (change_sf.length > 0 && (change_sf[0].value === "true" || change_sf[0].value === "1")) {
                        dbSet_person_change_where_yearweek_day_and_person_and_key(change.yearweek, change.day_id, change.person_id, "sl", free_id) 
                    } else {
                        dbRemove_person_change_where_yearweek_and_day_and_person_and_key(change.yearweek, change.day_id, change.person_id, "sl")
                    }
            })
        }

        dbRemove_shift_label(l_id)
        dbGet_shift_labels().then(l => {
            SHIFT_LABELS = l
            setPerson().then(() => {
                renderSettingsShiftLables()
                renderPerson().then(() => {
                    getActiveRoster().then(() => {
                        renderSettings()
                        changeSettingsView(document.querySelector("#Settings-global-button"), 'global')
                        hideLoading("removeShiftLabel")
                    })
                })
            })
        })

    })
}
addShiftLabel = () => {
    let block_title = document.querySelector("#Settings-global-labels .add-shiftlabel .title")
    let block_cut = document.querySelector("#Settings-global-labels .add-shiftlabel .cut")
    if ((block_title.value.length === 0) || (block_cut.value.length === 0)) {return}
    dbAdd_shift_label(block_title.value, block_cut.value).then(() => {
        dbGet_shift_labels().then(l => {
            SHIFT_LABELS = l
            renderSettingsShiftLables()
            block_title.value = ""
            block_cut.value = ""
            document.querySelector("#Settings-global-labels .add-shiftlabel").classList.add("d-none")
        })
    })
}
setEditableCellTrue = () => {
   EDITABLE_CELL = true
   document.querySelector("#Roster-week-add-editable-cell button").classList.add("active")
}
toggleEditableCellDefault = (el) => {
    if (SETTINGS.default_edit_cell_right) {
        SETTINGS.default_edit_cell_right = 0
        dbSet_settings_edit_cell_default(0)
        el.classList.remove("active")
    } else {
        SETTINGS.default_edit_cell_right = 1
        dbSet_settings_edit_cell_default(1)
        el.classList.add("active")
        if (!EDITABLE_CELL) {
            setEditableCellTrue()
            loadRosterTableWeek()
        }
    }
} 
setEditableRowTrue = () => {
    EDITABLE_ROW = true
    document.querySelector("#Roster-week-add-editable-row button.row-top").classList.add("active")
} 
setEditableRowBottomTrue = () => {
    EDITABLE_ROW_BOTTOM = true
    document.querySelector("#Roster-week-add-editable-row button.row-bottom").classList.add("active")
}
toggleEditableRowDefault = async (el) => {
    if (SETTINGS.default_row_top) {
        SETTINGS.default_row_top = 0
        dbSet_settings_edit_row_top_default(0)
        el.classList.remove("active")
    } else {
        SETTINGS.default_row_top = 1
        dbSet_settings_edit_row_top_default(1)
        el.classList.add("active")
        if (!EDITABLE_ROW) {
            setEditableRowTrue()
            loadRosterTableWeek()
        }
    }
}
toggleEditableRowBottomDefault = async (el) => {
    if (SETTINGS.default_row_bottom) {
        SETTINGS.default_row_bottom = 0
        dbSet_settings_edit_row_bottom_default(0)
        el.classList.remove("active")
    } else {
        SETTINGS.default_row_bottom = 1
        dbSet_settings_edit_row_bottom_default(1)
        el.classList.add("active")
        if (!EDITABLE_ROW_BOTTOM) {
            setEditableRowBottomTrue()
            loadRosterTableWeek()
        }
    }
}

renderSettingsToggleEditableWeek = async () => {
    let block_editable_container = document.getElementById("Settings-global-editable-week")
    block_editable_container.innerHTML = ""

    let block_editable_title = document.createElement("h4")
    block_editable_title.innerHTML = "Wochenübersicht editierbare Zellen"
    block_editable_container.appendChild(block_editable_title)

    let block_editable_cell = document.createElement("div")
    let block_cell_button = document.createElement("button")
    block_cell_button.innerHTML = "Spalte aktiv"
    block_cell_button.classList.add("button-default-cell")
    block_cell_button.setAttribute("title", "Die editierbare Spalte ist als Standart eingeblendet.")
    block_cell_button.setAttribute("onCLick", "toggleEditableCellDefault(this)")
    if (SETTINGS.default_edit_row_top) block_cell_button.classList.add("active")
    block_editable_container.appendChild(block_cell_button)

    let block_editable_row = document.createElement("div")
    let block_row_button = document.createElement("button")
    block_row_button.innerHTML = "Zeile oben aktiv"
    block_row_button.setAttribute("title", "Die editierbare Zeile ist als Standart eingeblendet.")
    block_row_button.setAttribute("onCLick", "toggleEditableRowDefault(this)")
    block_row_button.classList.add("button-default-row")
    if (SETTINGS.default_editable_row_top) block_row_button.classList.add("active")
    block_editable_container.appendChild(block_row_button)

    let block_editable_row_bottom = document.createElement("div")
    let block_row_bottom_button = document.createElement("button")
    block_row_bottom_button.innerHTML = "Zeile unten aktiv"
    block_row_bottom_button.setAttribute("title", "Die editierbare Zeile ist als Standart eingeblendet.")
    block_row_bottom_button.setAttribute("onCLick", "toggleEditableRowBottomDefault(this)")
    block_row_bottom_button.classList.add("button-default-row-bottom")
    if (SETTINGS.default_editable_row_bottom) block_row_bottom_button.classList.add("active")
    block_editable_container.appendChild(block_row_bottom_button)
}
renderSettingsShiftLables = () => {
    let block_labels = document.getElementById("Settings-global-labels")
    block_labels.innerHTML = ""
    let block_title_container = document.createElement("div")
    block_title_container.classList.add("title-container")
    let block_labels_title = document.createElement("h4")
    block_labels_title.innerHTML = "Schichtlabels"
    block_title_container.appendChild(block_labels_title)
    let block_add = document.createElement("button")
    block_add.innerHTML = "Hinzufügen"
    block_add.setAttribute("onClick", 'document.querySelector("#Settings-global-labels .add-shiftlabel").classList.remove("d-none")')
    block_add.classList.add("button-whitegreen", "button-add")
    block_title_container.appendChild(block_add)
    let block_labels_add_input = document.createElement("div")
    block_labels_add_input.classList.add("add-shiftlabel", "add-container", "d-none")
    block_labels_add_input.innerHTML = `<button onClick="this.parentNode.classList.add('d-none')" class="cancel button-orange">Abbrechen</button><div><label>Titel</label><input class="title"><label>Abkürzung</label><input class="cut"><button class="button-whitegreen" onClick="addShiftLabel()">Speichern</button></div>`
    block_title_container.appendChild(block_labels_add_input)
    block_labels.appendChild(block_title_container)

    let block_labels_container = document.createElement("div")
    block_labels_container.classList.add("items")

    SHIFT_LABELS.forEach(label => {
        let l_id = label.id
        let block_label_item = document.createElement("div")
        block_label_item.classList.add("item")
        let block_label_text_label = document.createElement("label")
        block_label_text_label.innerHTML = "Titel"
        block_label_item.appendChild(block_label_text_label)
        let block_label_text
        if (label.id === 1) {
            block_label_text = document.createElement("div")
            block_label_text.innerHTML = label.name
        }
        else {
            block_label_text = document.createElement("input")
            block_label_text.setAttribute("onchange", `changeShiftLabel(${l_id}, "n", this.value)`)
            block_label_text.value = label.name
        }
        block_label_item.appendChild(block_label_text)
        let block_label_cut_label = document.createElement("label")
        block_label_cut_label.innerHTML = "Abkürzung"
        block_label_item.appendChild(block_label_cut_label)
        let block_label_cut = document.createElement("input")
        block_label_cut.value = label.cut
        block_label_cut.setAttribute("onchange", `changeShiftLabel(${l_id}, "c", this.value)`)
        block_label_item.appendChild(block_label_cut)
        if (l_id !== 1) {
            let block_remove = document.createElement("button")
            block_remove.innerHTML = "Löschen"
            block_remove.classList.add("button-remove")
            block_remove.setAttribute("onClick", `removeShiftLabel(${l_id})`)
            block_label_item.appendChild(block_remove)
        }
        block_labels_container.appendChild(block_label_item)
    })

    block_labels.appendChild(block_labels_container)
}
addSettingsGlobal = () => {
    let block = document.getElementById("Settings-global")
    block.innerHTML = ""

    let block_editable = document.createElement("div")
    block_editable.setAttribute("id", "Settings-global-editable-week")
    block.appendChild(block_editable)
    renderSettingsToggleEditableWeek()

    let block_labels = document.createElement("div")
    block_labels.setAttribute("id", "Settings-global-labels")
    block.appendChild(block_labels)
    renderSettingsShiftLables()


    let block_rename_label = document.createElement("h4")
    let block_rename_department = document.createElement("div")
    block_rename_department.setAttribute("id", "Settings-global-departments")
    let block_rename_department_label = document.createElement("div")
    let block_department_title_container = document.createElement("div")
    block_department_title_container.classList.add("title-container")
    block_rename_label.innerHTML = "Bereiche:"
    block_department_title_container.appendChild(block_rename_label)
    let block_department_add = document.createElement("button")
    block_department_add.setAttribute("onClick", `renderAddDepartment()`)
    block_department_add.classList.add("button-add", "button-whitegreen")
    block_department_add.innerHTML = "Hinzufügen"
    block_department_title_container.appendChild(block_department_add)
    let block_department_add_input = document.createElement("div")
    block_department_add_input.classList.add("add-department", "add-container", "d-none")
    block_department_add_input.innerHTML = `<button class="cancel button-orange" onClick="this.parentNode.classList.add('d-none')">Abbrechen</button><div><input placehlder="Name"><button class="button-whitegreen" onClick="addDepartment(this)">Speichern</button></div>`
    block_department_title_container.appendChild(block_department_add_input)
    block_rename_department.appendChild(block_department_title_container)

    DEPARTMENTS.forEach(department => {
        if (department.name === "") return
        let block_department_container = document.createElement("div")
        let block_department = document.createElement("input")
        block_department.value = department.name
        block_department.setAttribute("onchange", `changeDepartmentName(${department.id}, this.value)`)
        block_department_container.appendChild(block_department)
        let block_department_remove = document.createElement("button")
        block_department_remove.setAttribute("onClick", `removeDepartment(${department.id})`)
        block_department_remove.classList.add("button-remove")
        block_department_remove.innerHTML = "Löschen"
        block_department_container.appendChild(block_department_remove)
        block_rename_department.appendChild(block_department_container)
    })
    block.appendChild(block_rename_department)

    let block_rename_feelds = document.createElement("div")
    block_rename_feelds.setAttribute("id", "Settings-global-rename-fields")
    let block_rename_feelds_label = document.createElement("h4")
    block_rename_feelds_label.innerHTML = "Felder"
    block_rename_feelds.appendChild(block_rename_feelds_label)

    SETTINGS_LABELS.forEach((data, data_id) => {
        let block_rename = document.createElement("div")
        block_rename.classList.add("item")
        let block_rename_label = document.createElement("div")
        block_rename_label.innerHTML = dbGet_settings_label_text(data_id)

        
        let block_rename_title_container = document.createElement("div")
        block_rename_title_container.setAttribute("title", "in der Personentabelle als überschrift sichtbar")
        let block_rename_text_label = document.createElement("label")
        block_rename_text_label.innerHTML = "Titel"
        let block_rename_text_input = document.createElement("input")
        block_rename_text_input.setAttribute("onchange", `renameFields(${data_id}, "t", this.value)`)
        block_rename_text_input.value = dbGet_settings_label_text(data_id)
        block_rename_title_container.appendChild(block_rename_text_label)
        block_rename_title_container.appendChild(block_rename_text_input)
        block_rename.appendChild(block_rename_title_container)

        let block_rename_cut_container = document.createElement("div")
        block_rename_cut_container.setAttribute("title", "im Schichtplan sichtbar")
        let block_rename_cut_label = document.createElement("label")
        block_rename_cut_label.innerHTML = "Abkürzung"
        let block_rename_cut_input = document.createElement("input")
        block_rename_cut_input.setAttribute("onchange", `renameFields(${data_id}, "a", this.value)`)
        block_rename_cut_input.value = dbGet_settings_label_cut(data_id)
        block_rename_cut_container.appendChild(block_rename_cut_label)
        block_rename_cut_container.appendChild(block_rename_cut_input)
        block_rename.appendChild(block_rename_cut_container)

        block_rename_feelds.appendChild(block_rename)
    })

    block.appendChild(block_rename_feelds)
}

changeDepartmentName = (department_id, value) => {
    if (value === "") return
    dbSet_department(department_id, value)
    renderPerson()
} 

changeSettingsView = (el, value) => {
    if (value === "weekly") {
        renderSettingsWeekly(el)
    } else {
        renderSettingsGlobal(el)
    }
}

changeZoomLevel = (value) => {
    dbSet_settings_zoom_web(value)
    setZoomLevel(value)
}
setZoomLevel  = (value) => {
    showLoading("setZoomLevel")
    window.setTimeout(() => {
        let items = document.querySelectorAll("#Roster-days-container .tables-container")
        for (i=0; i<items.length; i++) {
            items[i].style.zoom = `${value}%`
        }
        if (value !== 100) {
            let lines = document.querySelectorAll(".line-cursor")
            for (i=0; i<lines.length; i++) {lines[i].classList.add("d-none")}
        }
        hideLoading("setZoomLevel")
    },50)
}

getTimeAsMinute = (a) => {
	let b = Math.ceil(a)
	let minutes = MINUTE_STEPS_VALUES[MINUTE_STEPS.indexOf(1-(b-a))]
	if (minutes === 60) minutes = "00"
	return Math.floor(a)+":"+minutes
} 

createTimeSteps = () => {
	let block_timesteps_container = block_settings.getElementsByClassName("timesteps-container")[0]
	let block_timesteps_label = document.createElement("label")
	let block_timesteps_select_label = document.createElement("label")
	let block_timesteps_select = document.createElement("select")

    if (!block_timesteps_container) {return }
	block_timesteps_container.innerHTML = ""
	TIME_STEPS_VALUES.forEach((step, step_id) => {
		let block_timesteps_option = document.createElement("option")
        block_timesteps_option.setAttribute("value", TIME_STEPS[step_id])
		block_timesteps_option.innerHTML = step+" min"
        if (parseFloat(TIME_STEP) === TIME_STEPS[step_id]) block_timesteps_option.defaultSelected = true
		block_timesteps_select.appendChild(block_timesteps_option)
	})
	block_timesteps_label.innerHTML = "Zeitintervall:"
    block_timesteps_select_label.classList.add("chevron-down", "chevron-select")
	block_timesteps_select.setAttribute("onchange", "setTimeStep(this.value)")
	block_timesteps_container.appendChild(block_timesteps_label)
	block_timesteps_select_label.appendChild(block_timesteps_select)
	block_timesteps_container.appendChild(block_timesteps_select_label)
}

changeDayBreak = (value) => {
    showLoading("changeDayBreak")
    dbSet_roster_shiftbreak_90(DATE_YEAR_WEEK, parseFloat(value)).then(() => {
        DAYBREAK_2 = parseFloat(value)
        window.location = "/#settings"
        location.reload()
    })
}

createDayBreaks = () => {
	let block_daybreaks_container = block_settings.getElementsByClassName("daybreaks-container")[0]
    if (!block_daybreaks_container) {return}
    block_daybreaks_container.innerHTML = ""

	let block_daybreaks_label = document.createElement("label")
	block_daybreaks_label.innerHTML = "Pause nach 9h:"
    block_daybreaks_container.appendChild(block_daybreaks_label)

	let block_daybreaks_label_container = document.createElement("label")
    block_daybreaks_label_container.classList.add("chevron-down", "chevron-select")

	let block_daybreaks_select = document.createElement("select")
    block_daybreaks_select.setAttribute("onchange", `changeDayBreak(this.value)`)



    let block_option_0 = document.createElement("option")
    block_option_0.innerHTML = "30 min"
    block_option_0.setAttribute("value", "0")
    if (DAYBREAK_2 === 0) block_option_0.defaultSelected = true
    block_daybreaks_select.appendChild(block_option_0)

    let block_option_1 = document.createElement("option")
    block_option_1.innerHTML = "45 min"
    block_option_1.setAttribute("value", "0.25")
    if (DAYBREAK_2 === 0.25) block_option_1.defaultSelected = true
    block_daybreaks_select.appendChild(block_option_1)

    let block_option_2 = document.createElement("option")
    block_option_2.innerHTML = "60 min"
    block_option_2.setAttribute("value", "0.5")
    if (DAYBREAK_2 === 0.5) block_option_2.defaultSelected = true
    block_daybreaks_select.appendChild(block_option_2)

    block_daybreaks_label_container.appendChild(block_daybreaks_select)
    block_daybreaks_container.appendChild(block_daybreaks_label_container)
}



createTimeOption = (value, text) => {
	let option = document.createElement('option');
	if (text.toString().length === 1) text = "0"+text
	option.text = text;
	option.value = value;
	return option;
}

toggleHelpText = (el) => {
    let close_els = document.querySelectorAll("#Popup .container.active")
    let close_els_buttons = document.querySelectorAll("#Popup .container button.active")
    for (i=0; i< close_els.length; i++) {close_els[i].classList.remove("active")} 
    for (i=0; i< close_els_buttons.length; i++) {close_els_buttons[i].classList.remove("active")} 
    el.classList.toggle('active')
    el.parentNode.classList.toggle('active')
    el.parentNode.scrollIntoView({block: "nearest", inline: "center"})
}

renderHelp = () => {
    let block_popup = document.getElementById("Popup")
    block_popup.classList.add("help")
    block_popup.onclick = (e) => eventListenerClosePopup(e, "help")
    block_popup.classList.add("active")
    document.body.classList.add("noscroll")
    let block = document.getElementById("Popup-container")
    let block_close = document.createElement("button")
    block_close.setAttribute("onClick", "closeHelp()")
    block_close.classList.add("button-x")
    block.appendChild(block_close)
    HELP.forEach(data => {
        let title = data[0]
        let text = data[1]
        let block_container = document.createElement("div")
        let block_title_button = document.createElement("button")
        let block_title = document.createElement("h3")
        let block_text = document.createElement("p")
        block_title_button.setAttribute("onCLick", "toggleHelpText(this)")
        block_title.innerHTML = title
        block_text.innerHTML = text
        block_title_button.appendChild(block_title)
        block_container.classList.add("container")
        block_container.appendChild(block_title_button)
        block_container.appendChild(block_text)
        block.appendChild(block_container)
    })
}

closeHelp = () => {
    closePopup()
}

toggleHelp = (el) => {
    let block_popup = document.getElementById("Popup")
    if (el.classList.contains("active")) {
        closeHelp()
    } else {
        el.classList.add("active")
        renderHelp()
        block_popup.onclick = (e) => eventListenerClosePopup(e, "help")
        block_popup.classList.add("active")
        document.body.classList.add("noscroll")
    }
}


toggleEditPerson = (el) => {
    let block_person = document.getElementById("Person-container")
    if (el.classList.contains("active")) {
        el.classList.remove("active")
        block_person.classList.remove("active")
    } else {
        el.classList.add("active")
        block_person.classList.add("active")
    }
}

renderSettings = () => {
    settingsContainerHideAll("Settings-default")
    document.getElementsByClassName("settings-box")[0].scrollIntoView({block: "nearest", inline: "center"})
}

createRosterSelect = () => {
    let block_select = document.createElement("select")
    block_select.setAttribute("onchange", "changeDate(getDateOfISOWeek(this.value))")
    let year_weeks = ROSTERS_YEARWEEK
    year_weeks.forEach(year_week => {
        let block_option = document.createElement("option")
        block_option.innerHTML = year_week
        block_option.setAttribute("value", year_week)
        if (year_week === DATE_YEAR_WEEK) { block_option.defaultSelected = true }
        block_select.appendChild(block_option)
    })
    return block_select
}

getSettings = async () => {
    ROSTER = await getDataRosterToRoster(DATE_YEAR_WEEK)
    ROSTER_WEEK_BEFORE = await getRosterBefore(1)
    ROSTER_WEEK_BEFORE_WEEK = await getRosterBefore(2)

    let block_person_mpa_label = document.getElementById("Person-table-mpa")
    if (block_person_mpa_label) {block_person_mpa_label.innerHTML = getRenames("m").t}
	createTimeSteps()
    createDayBreaks()
    createRosterDayTimes()
    block_yws = document.getElementById("Week-select-overview")
    if (block_yws) {
        block_yws.innerHTML = ""
        block_yws.appendChild(createRosterSelect())
    }
    block_yws = document.getElementById("Menu-week-select")
    block_yws.innerHTML = ""
    block_yws.appendChild(createRosterSelect())
}

setTimeStep = (step_value) => {
    showLoading("setTimeStep")
    TIME_STEP = step_value
    dbSet_roster_timestep(DATE_YEAR_WEEK, parseFloat(step_value)).then(() => {
        let specials = []

        //createRosterDayTimes()
        ROSTER.forEach((day, day_id) => {
            times = []
            TIMES = []
            let block_container = document.getElementById(`Settings-day-time-change-${day_id}`)
            let block_start = block_container.getElementsByClassName("select-start")[0]
            let start = day.d[0].t
            let end = day.d[day.d.length-1].t
            
            let duration = end-start
            let duration_steps = duration*(1/TIME_STEP)
            for (let i=0; i<=duration_steps; i++) {
                time = { t: TIME_START+(i*TIME_STEP), a: PERSONS.length}
                TIMES.push(time)
                times.push({time: TIME_START+(i*TIME_STEP), amount: PERSONS.length})
            }
            day.d = TIMES
            setDataAC(DATE_YEAR_WEEK, day_id, times).then(() => {
                if (day_id === ROSTER.length-1) {
                    window.location = "/#settings"
                    location.reload()
                }
            })
        })
    })
}

createRosterDefault = (times) => {
    ROSTER_DEFAULT = []
    ROSTER = []
    DAYS.forEach((day, index) => {
        ROSTER_DEFAULT.push({n: day, d: []})
        times.forEach((times) => {
            ROSTER_DEFAULT[index].d.push({t: times.t, a: 0})
        })
    })
    ROSTER = structuredClone(ROSTER_DEFAULT)
}


getYearWeekNewest = () => {
    return ROSTERS_YEARWEEK[0]
}
getYearWeekNewestAfter = () => {
    let year_week_newest = getYearWeekNewest()
    let date_week_after = new Date(getDateOfISOWeek(year_week_newest ))
    date_week_after.setDate(date_week_after.getDate() + 1 * 7)
    return `${date_week_after.getFullYear()}-${date_week_after.getWeek()}`
}
getYearWeekNewestAfterWeek = () => {
    let year_week_newest = getYearWeekNewest()
    let date_week_after_week = new Date(getDateOfISOWeek(year_week_newest))
    date_week_after_week.setDate(date_week_after_week.getDate() + 2 * 7)
    return `${date_week_after_week.getFullYear()}-${date_week_after_week.getWeek()}`
}
getDateValues = () => {
    DATE_YEAR = DATE.getFullYear().toString();
    DATE_WEEK = DATE.getWeek().toString();
    DATE_WEEK.length === 1 && (DATE_WEEK = "0"+DATE_WEEK)
    DATE_YEAR_WEEK_OLD = DATE_YEAR_WEEK
    DATE_YEAR_WEEK = `${DATE_YEAR}-${DATE_WEEK}`
    if (DATE_YEAR_WEEK_OLD.length === 0) {DATE_YEAR_WEEK_OLD = DATE_YEAR_WEEK}
    let date_week_before = new Date(DATE - 7 * 24 * 60 * 60 * 1000)
    let date_week_before_week_before = new Date(date_week_before - 7 * 24 * 60 * 60 * 1000)

    let date_week_before_week = date_week_before.getWeek().toString()
    if (date_week_before_week.length === 1) {date_week_before_week = `0${date_week_before_week}`}

    let date_week_before_week_before_week = date_week_before_week_before.getWeek().toString()
    if (date_week_before_week_before_week.length === 1) {date_week_before_week_before_week = `0${date_week_before_week_before_week}`}

    DATE_YEAR_WEEK_BEFORE = `${date_week_before.getFullYear()}-${date_week_before_week}`
    DATE_YEAR_WEEK_BEFORE_WEEK = `${date_week_before_week_before.getFullYear()}-${date_week_before_week_before_week}`
    let date_week_after = new Date(DATE.getTime() + 7 * 24 * 60 * 60 * 1000)
    let date_week_after_week = date_week_after.getWeek().toString()
    if (date_week_after_week.length === 1) {date_week_after_week = `0${date_week_after_week}`}
    DATE_YEAR_WEEK_AFTER = `${date_week_after.getFullYear()}-${date_week_after_week}`
    let yws = ROSTERS_YEARWEEK
    if (yws.length === 0) {
        DATE_YEAR_WEEK_OLDEST = DATE_YEAR_WEEK
        DATE_YEAR_WEEK_NEWEST = DATE_YEAR_WEEK
    } else {
        DATE_YEAR_WEEK_OLDEST = yws[yws.length-1]
        DATE_YEAR_WEEK_NEWEST = yws[0]
    }
    let date_week_after_newest = new Date(getDateOfISOWeek(DATE_YEAR_WEEK_NEWEST))
    date_week_after_newest.setDate(date_week_after_newest.getDate() + 1 * 7)
    let date_week_after_newest_week = new Date(getDateOfISOWeek(DATE_YEAR_WEEK_NEWEST))
    date_week_after_newest_week.setDate(date_week_after_newest_week.getDate() + 2 * 7)
    DATE_YEAR_WEEK_NEWEST_AFTER = `${date_week_after_newest.getFullYear()}-${date_week_after_newest.getWeek()}`
    DATE_YEAR_WEEK_NEWEST_AFTER_WEEK = `${date_week_after_newest_week.getFullYear()}-${date_week_after_newest_week.getWeek()}`

    document.getElementById("Menu-item-week").getElementsByTagName("button")[0].innerHTML = "Woche "+DATE_WEEK
}

getDateOfISOWeek = (year_week) => {
    let y = parseFloat(year_week.substring(0,4))
    let w = parseFloat(year_week.substring(5))
    if ((isNaN(y)) || (isNaN(w))) return false
    var simple = new Date(y, 0, 1 + (w - 1) * 7);
    var dow = simple.getDay();
    var ISOweekStart = simple;
    if (dow <= 4)
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else
        ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());

    return new Date(ISOweekStart.getTime() - ISOweekStart.getTimezoneOffset()*60000).toISOString().substring(0, 10)
}

getDateToRosterDate = (date) => {
    date = new Date(date)
    let date_monday = structuredClone(date)
    date_monday = new Date(date_monday.setDate(date_monday.getDate() - (date_monday.getDay() + 6) % 7))
    let difference = date.getTime() - date_monday.getTime();
    let day_id = difference / (1000 * 3600 * 24);
    let year_week = `${date_monday.getFullYear()}-${date_monday.getWeek()}`
    year_week = year_week.length === 6 ? (year_week.substring(0,5)+"0"+year_week.substring(5)) : year_week

    return [year_week, day_id]
}

convertDate = (date) => {
    let year = date.substring(0,4)
    let month = date.substring(5,7)
    let day = date.substring(8,10)
    return `${day}.${month}.${year}`
}

changeDate = (date) => {
    checkElementInView("main")
    let new_date 
    let new_d
    if (date === "next") {
        new_date = DATE_YEAR_WEEK_AFTER
    } else if (date === "prev") {
        new_date = DATE_YEAR_WEEK_BEFORE
    } else {
        new_date = new Date(date)
        new_date = getDateToRosterDate(new_date)[0]
    }
    window.setTimeout(() => {
        window.location = `?${new_date}${INVIEW}`
    },50)
}

setRosterDate = (new_date) => {
    new_date = new Date(new_date)
    new_date.setDate(new_date.getDate() - (new_date.getDay() + 6) % 7)
    new_date.setHours(1)
    new_date.setMinutes(1)
    new_date.setSeconds(1)
    DATE = new_date
    getDateValues()
    let block_input = document.getElementById("Roster-week-input")
    block_input && (block_input.valueAsDate = DATE)
}

createTimeRange = (day_id, time_start, time_end, time_specialstart) => {
	let duration = time_end-time_start
	let duration_steps = duration*(1/TIME_STEP)
	times = []
    let amount = 0
    if (ROSTER[day_id].d[0].t === time_start) { amount = ROSTER[day_id].d[0].a }

    if (time_specialstart && time_start !== 0) times.push({ time: time_start-TIME_STEPS[TIME_STEPS.indexOf(TIME_STEP)-1], amount: amount})
	for (let i=0; i<=duration_steps; i++) {
        let time_t = time_start+(i*TIME_STEP)
        let roster_time_id = ROSTER[day_id].d.map(d => {return d.t}).indexOf(time_t)
        amount = 0
        if (roster_time_id > -1 && ROSTER[day_id].d[roster_time_id].t === time_t) { amount = ROSTER[day_id].d[roster_time_id].a }
		time = { time: time_t, amount: amount}
		times.push(time)
	}
    return times
}

changeTimeOfDay = (day_id, direction) => {
    showLoading("changeTimeOfDay")
    window.setTimeout(() => {
        let block_container = document.getElementById("Settings-day-time-change-"+day_id)
        let block_start = block_container.getElementsByClassName("select-start")[0].getElementsByTagName("select")[0]
        let block_end = block_container.getElementsByClassName("select-end")[0].getElementsByTagName("select")[0]
        let name = DAYS[day_id]
        let time_default = 0
        let time_start = parseFloat(block_start.value)
        let time_end = parseFloat(block_end.value)-TIME_STEP
        let block_time_specialstart = document.getElementById("Settings-special-time-input-"+day_id)
        let time_specialstart = false
        if (block_time_specialstart) { time_specialstart = block_time_specialstart.checked }
        let times = createTimeRange(day_id, time_start, time_end, time_specialstart)
        let new_roster_data = []
        times.forEach((time, time_id) => {
            let is_data = ROSTER[day_id].d.filter(ti => {return ti.t === time.time})
            if (is_data.length > 0) { time_default = is_data[0].a }
            new_roster_data.push({t: time.time, a: time_default})
        }) 

    // FIX ME !!
        /*direction === "start" ?
            dbSet_shifts_where_yearweek_and_start_lt(DATE_YEAR_WEEK, time_start) :
            dbSet_shifts_where_yearweek_and_end_gt(DATE_YEAR_WEEK, time_end)
        */

        createEndSelect(day_id)


        setDataAC(DATE_YEAR_WEEK, day_id, times).then(() => {
            window.location = "/#settings"
            location.reload()
            hideLoading("changeTimeOfDay")
        })
    }, 50)
}

createStartSelect = (day_id) => {
	let block_timestart_select_label = document.createElement("label")
	let block_timestart_select = document.createElement("select")

    block_timestart_select_label.classList.add("chevron-down", "chevron-select")
    block_timestart_select.setAttribute("onchange", `changeTimeOfDay(${day_id}, "start")`)
	for(let i = 0; i <= 24; i++){
		let text_i = i.toString()
		if (text_i.length === 1) text_i = "0"+i
		for(let n = 0; n < 60; n += TIME_STEPS_VALUES[TIME_STEPS.indexOf(TIME_STEP)]) {
			let text_n = n.toString()
			let value_n = n
			if (text_n.length === 1) text_n = "0"+n
			if (value_n !== 0) value_n = MINUTE_STEPS[MINUTE_STEPS_VALUES.indexOf(value_n)]
			value_n = i+value_n
			let block_option = createTimeOption(value_n, text_i+":"+text_n)
            let check_t
            if (ROSTER.length > 0) {
                check_t = ROSTER[day_id].d[0].t
                let check_tt = ROSTER[day_id].d[1].t
                if (check_tt-check_t !== TIME_STEP) check_t = check_tt
            } else {
                check_t = TIME_START
            }
			if (check_t === value_n) block_option.defaultSelected = true
			block_timestart_select.add(block_option);
		}
	}

	block_timestart_select_label.appendChild(block_timestart_select)
    return block_timestart_select_label
}

createEndSelect = (day_id) => {
	let block_timeend_select_label = document.createElement("label")
	let block_timeend_select = document.createElement("select")

    block_timeend_select_label.classList.add("chevron-down", "chevron-select")
	block_timeend_select.setAttribute("onchange", `changeTimeOfDay(${day_id}, "end")`)

    let block_start = document.getElementById("Settings-day-time-change-"+day_id).getElementsByClassName("select-start")[0].querySelector("select")

    let start = block_start.value
    if (ROSTER.length > 0) { start = Math.floor(ROSTER[day_id].d[0].t+1) }
	if (start === TIME_START) start = start+1

	for(let i = start; i <= 24; i++){
		let text_i = i.toString()
		if (text_i.length === 1) text_i = "0"+i
		for(let n = 0; n < 60; n += TIME_STEPS_VALUES[TIME_STEPS.indexOf(TIME_STEP)]) {
            if (i === 24 && n > 0) continue
			let text_n = n.toString()
			let value_n = n
			if (text_n.length === 1) text_n = "0"+n
			if (value_n !== 0) value_n = MINUTE_STEPS[MINUTE_STEPS_VALUES.indexOf(value_n)]
			value_n = i+value_n
			let block_option = createTimeOption(value_n, text_i+":"+text_n)
            if (ROSTER.length > 0) {
                if (ROSTER[day_id].d[ROSTER[day_id].d.length -1].t+TIME_STEP === value_n) block_option.defaultSelected = true
            } else {
                if (TIME_END+TIME_STEP === value_n) block_option.defaultSelected = true
            }
			block_timeend_select.add(block_option);
		}
	}

	block_timeend_select_label.appendChild(block_timeend_select)
    return block_timeend_select_label
}

createRosterDayTimes = () => {
    let block = document.getElementById("Settings-day-time-change")
    if (!block) {return}
    block.innerHTML = ""
    DAYS.forEach((day, day_id) => {
        let block_select_start_end = document.createElement("div")
        block_select_start_end.setAttribute("id", "Settings-day-time-change-"+day_id)
        block_select_start_end.classList.add("select-start-end")

        let block_select_name = document.createElement("p")
        block_select_name.classList.add("select-name")
        block_select_name.innerHTML = day

        let block_select_start = createStartSelect(day_id)
        block_select_start.classList.add("select-start") 


        block.appendChild(block_select_name)
        block_select_start_end.appendChild(block_select_start)
        block.appendChild(block_select_start_end)

        let block_select_end = createEndSelect(day_id)
        block_select_end.classList.add("select-end")
        block_select_start_end.appendChild(block_select_end)
      
    })

}

getIsoStringFromDay = (day_id, year_week) => {
    let date = new Date(getDayDateByDayid(day_id, getDateOfISOWeek(year_week || DATE_YEAR_WEEK)))
    return date.toISOString().substr(0, 10)
}
getDayDateByDayid = (day_id, start) => {
    if (typeof start === "undefined") start = getDateOfISOWeek(DATE_YEAR_WEEK)
    let date = new Date(start)
    date.setDate(date.getDate()+day_id)
    return date.toISOString().substr(0, 10)
}

sortPersonRosterWeek = async (period_id) => {
    return getSortedPersonRosterWeek(period_id).then(persons => {
        if (period_id === 0) {PERSONS_ROSTER = persons;}
        if (period_id === 1) {PERSONS_WEEK = persons;}
        return persons
    })
}
getSortedPersonRosterWeek = async (period_id, year_week) => {
    if (typeof year_week === "undefined") {year_week = DATE_YEAR_WEEK}
    let sort_all = period_id === 0 ? SETTINGS.sort_days : SETTINGS.sort_week
	if (sort_all.length === 0) return

    let person_all
    if (year_week === DATE_YEAR_WEEK) {
        person_all = structuredClone(PERSONS)
    } else {
        person_all = await dbGet_persons_active_where_yearweek(year_week)
    }
	let person
	sortD = (d_id) => {
		person.sort((a, b) => {
			let v = sort_all[d_id].split('-')
			let n = v[0]
            if (n === "n") {nn = "name"}
            else if (n === "h") {nn = "hours"}
            else if (n === "d") {nn = "department"}
			let d = v[1]
			let d_0
			let d_1
			let a_d = eval(`a.${nn}`)
			let b_d = eval(`b.${nn}`)
			if (d === "u") {d_0 = 1; d_1 = -1}
			if (d === "d") {d_0 = -1; d_1 = 1}

			if (a_d < b_d) { return d_0; }
			if (a_d > b_d) { return d_1; }
			return 0;
		})
	}
	let d_n = false
	let d_d
	let n_n = false
	let n_d
	let h_n = false
	let h_d
	sort_all.forEach((c, c_id) => { 
		if (c.split('-')[0] === "d") {d_n = c_id; d_d = c.split('-')[1]} 
		if (c.split('-')[0] === "n") {n_n = c_id; n_d = c.split('-')[1]} 
		if (c.split('-')[0] === "h") {h_n = c_id; h_d = c.split('-')[1]} 
	})

	person = person_all
	if (sort_all.length === 1) { sortD(0) }
	else {
		let person_new = []
        departments = structuredClone(DEPARTMENTS)
        d_d === "u" ? departments.sort((a, b) => a.name.localeCompare(b.name)) : departments.sort((a, b) => b.name.localeCompare(a.name))
        
		departments.forEach(name => {	
			let n_id = name.id
			person = structuredClone(person_all.filter(a => {return a.department === n_id}))
			if (n_n) sortD(n_n)
			else if (h_n) sortD(h_n)
			person.forEach(p => {person_new.push(p)})
		})
		person_all = person_new
	}
		
   return person_all
}

setRosterSortButtons = async (period_id) => {
    let period_n
    if (period_id === 0) { period_n = "roster" }
    if (period_id === 1) { period_n = "week" }
    let block = document.getElementById(`Sort-${period_n}-by`)
    if (!block) {return}
    let all_els = block.querySelectorAll(`.sort-${period_n}-by`)
    for (i=0; i<all_els.length; i++) {
        all_els[i].classList.remove("active", "chevron-down", "chevron-up")
    }
    let sort = period_id === 0 ? SETTINGS.sort_days : SETTINGS.sort_week
    sort.forEach(name => {
        let name_split = name.split('-')
        let n = name_split[0]
        let d = name_split[1]
        let d_n = "chevron-up"
        let el
        for (i=0; i<all_els.length; i++) { if (all_els[i].getAttribute("name") === n) {el = all_els[i]; continue}}
        if (d === "u") {d_n = "chevron-down"}
        el.classList.add("active", d_n)
    })
}

sortRosterBy = (period, el) => {
    checkElementInView("main")

    let selector
    let period_id
    if (period === "days") { period_id = 0; selector = "roster" }
    else if (period === "week") { period_id = 1; selector = "week" }
    let name = el.getAttribute("name")
    let sort = period_id === 0 ? SETTINGS.sort_days : SETTINGS.sort_week

    let l_id = sort.map(i => i.split("-")[0]).indexOf(name)
    let dir = sort[l_id]?.split("-")[1]
    next_dir = dir === "u" ? "d" : "u"

    if (name === "n") {
        r_id = sort.map(i => i.split("-")[0]).indexOf("h")
        r_id > -1 && sort.splice(r_id, 1)
        l_id > -1 ? (sort[l_id] = `n-${next_dir}`) : sort.push("n-d")
    } else if (name === "h") {
        r_id = sort.map(i => i.split("-")[0]).indexOf("n")
        r_id > -1 && sort.splice(r_id, 1)
        l_id > -1 ? (sort[l_id] = `h-${next_dir}`) : sort.push("h-d")
    } else if (name === "d") {
        if (l_id === -1) {
            sort.push("d-u")
        } else if (dir === "u") {
            sort[l_id] = `d-d`
        } else if (dir === "d") {
            sort.splice(l_id, 1)
        }
    }

    if (period_id === 0) {
        dbSet_settings_sort_days(sort)
        SETTINGS.sort_days = sort
    } else {
        dbSet_settings_sort_week(sort)
        SETTINGS.sort_week = sort
    }

    setRosterSortButtons(period_id)

	sortPersonRosterWeek(period_id)
    if (period === "week") {
        loadRosterTableWeek()
    } else {
        getActiveRoster(true).then(() => {
            if (INVIEW.length > 0) document.querySelector(INVIEW)?.scrollIntoView()
        })
    }
}

setWeekInfo = (text) => {
    dbSet_roster_info_where_yearweek_and_day_and_person(DATE_YEAR_WEEK, 999, "all", text)

    let info = ROSTER_PERSON_INFOS.find(i => i.day_id === 999 && i.id === "all")
    if (typeof info !== "undefined") {info.text = text}
    else ROSTER_PERSON_INFOS.push({id: "all", yearweek: DATE_YEAR_WEEK, day_id: 999, text: text})

    if (text.length > 0) {
        let block_text = document.createElement("div")
        block_text.innerHTML = text
        let block = document.getElementById("Roster-week-info")
        block.innerHTML = ""
        block.appendChild(block_text)
    }
}

toggleSetWeekInfo = async (el) => {
    let block_info = document.getElementById("Set-week-info-container")
    if (el.classList.contains("active")) {
        el.classList.remove("active")
        block_info.classList.add("d-none")
        document.querySelector("#Roster-week-info").innerHTML = ""
        dbRemove_roster_info_where_yearweek_and_day_and_person(DATE_YEAR_WEEK, 999, "all").then(() => {
            ROSTER_PERSON_INFOS = ROSTER_PERSON_INFOS.filter(i => i.id !== "all")
        })
    } else {
        el.classList.add("active")
        block_info.classList.remove("d-none")
        let info = await dbGet_roster_info_where_yearweek_and_day_and_person(DATE_YEAR_WEEK, 999, "all")
        if (info) (document.getElementById("Set-week-info-container").querySelector("textarea").value = info.text ? info.text : "")
    }
}

setDataAC = async (year_week, key, value) => {
    let s = value[0].time
    let e = value[value.length-1].time
    let a = value.map(t => t.amount)
    let response = await dbSet_roster_change_where_yearweek_and_day(year_week, key, s, e, a)
    return response
}


