SET_CLOSING_DATE_CHANGED = false


closeClosingTime = () => {
    document.getElementById("Settings-toggle-closingtime").classList.remove("active")
    closePopup()
    setPerson().then(() => getActiveRoster())
}
rerenderClosingtimes = () => {
    showLoading("rerenderClosingtimes")
    return dbGet_closingtimes().then(cl => {
        CLOSINGTIMES = cl
        renderClosingTimesTable()
        renderBlockButtonAddClosingTime()
        hideLoading("rerenderClosingtimes")
        return
    })
}
removeClosingTime = (year, id) => {
    showLoading("removeClosingTime")
    dbRemove_closingtime(id).then(() => {
        setPerson().then(() => {
            getActiveRoster().then(() => {
                openClosingTime()
                hideLoading("removeClosingTime")
            })
        })
    })
}
saveClosingTime = () => {
    SET_CLOSING_DATE_CHANGED = false
    let block = document.getElementById("Set-closing-time")
    let title = block.querySelector(".title").value
    let start = block.querySelector(".start").value
    let end = block.querySelector(".end").value
    let is_public_holiday = block.querySelector(".button-public-holiday").classList.contains("active")
    addClosingTime(title, start, end, is_public_holiday)
    renderBlockButtonAddClosingTime()
}
addClosingTime = (title, start, end, is_public_holiday) => {
    showLoading("addClosingTime")
    let start_year = new Date(start).getFullYear()
    start_year = start_year.toString()

    let person_ids = []
    if (is_public_holiday) {
        if (ROSTERS_YEARWEEK.indexOf(getDateToRosterDate(new Date(start))[0]) > -1) {
            dbGet_persons_active_where_yearweek(getDateToRosterDate(new Date(start))[0]).then(persons => {
                persons.forEach(p => {removePersonShiftsBetweenDate(p.id, start, end)})
                person_ids = persons.map(p => p.id)
                dbAdd_closingtime(title, start, end, person_ids, is_public_holiday).then(() => {rerenderClosingtimes(); hideLoading("addClosingTime")})
            })
        } else {
            person_ids = PERSONS.map(p => p.id)
            dbAdd_closingtime(title, start, end, person_ids, is_public_holiday).then(() => {rerenderClosingtimes(); hideLoading("addClosingTime")})
        }
    } else {
        dbAdd_closingtime(title, start, end, person_ids, is_public_holiday).then(() => {rerenderClosingtimes(); hideLoading("addClosingTime")})
    }
}
changeClosingTimeBlockDate = (value, dir) => {
    if (SET_CLOSING_DATE_CHANGED) return
    SET_CLOSING_DATE_CHANGED = true
    if (dir === "start") {
        let end = document.querySelector("#Set-closing-time .end").value
        if (value > end) {
            //let  date_end = new Date(value)
            //date_end = new Date((date_end.getTime() + 7 * 24 * 60 * 60 * 1000) - date_end.getTimezoneOffset() * 60000).toISOString().slice(0,10);
            document.querySelector("#Set-closing-time .end").value = value
        }
    } else if (dir === "end") {
        let start = document.querySelector("#Set-closing-time .start").value
        if (value < start) {
            //let date_start = new Date(value)
            //date_start = new Date((date_start.getTime() - 7 * 24 * 60 * 60 * 1000) - date_start.getTimezoneOffset() * 60000).toISOString().slice(0,10);
            document.querySelector("#Set-closing-time .start").value = value
        }
    }

}
createAddClosingTime = () => {
    SET_CLOSING_DATE_CHANGED = false
    let date_start = new Date(getDateOfISOWeek(DATE_YEAR_WEEK))
    date_start = new Date(date_start.getTime() - date_start.getTimezoneOffset() * 60000).toISOString().slice(0,10);
    let date_end = new Date(getDateOfISOWeek(DATE_YEAR_WEEK))
    date_end = new Date((date_end.getTime() + 7 * 24 * 60 * 60 * 1000) - date_end.getTimezoneOffset() * 60000).toISOString().slice(0,10);

    let block_container = document.createElement("div")
    block_container.setAttribute("id", "Set-closing-time")

    let block_title = document.createElement("input")
    block_title.classList.add("title")
    block_title.setAttribute("title", "Bezeichnung")
    block_title.setAttribute("placeholder", "Bezeichnung")
    block_container.appendChild(block_title)

    let block_start = document.createElement("input")
    block_start.setAttribute("type", "date")
    block_start.setAttribute("onchange", "changeClosingTimeBlockDate(this.value, 'start')")
    block_start.setAttribute("title", "Start Datum")
    block_start.classList.add("start")
    block_start.value = date_start
    block_container.appendChild(block_start)

    let block_end = document.createElement("input")
    block_end.setAttribute("type", "date")
    block_end.setAttribute("onchange", "changeClosingTimeBlockDate(this.value, 'end')")
    block_end.setAttribute("title", "End Datum")
    block_end.classList.add("end")
    block_end.value = date_end
    block_container.appendChild(block_end)

    let block_public_holiday = document.createElement("button")
    block_public_holiday.innerHTML = "Feiertag"
    block_public_holiday.classList.add("button-public-holiday")
    block_public_holiday.setAttribute("onclick", "this.classList.toggle('active')")
    block_public_holiday.setAttribute("title", "Die freien Tage werden nich als Urlaub angerechnet.\nAlle nehmen teil.")
    block_container.appendChild(block_public_holiday)

    let block_add = document.createElement("button")
    block_add.innerHTML = "Speichern"
    block_add.setAttribute("onclick", "saveClosingTime()")
    block_add.classList.add("button-whitegreen")
    block_add.setAttribute("title", "Speichern")
    block_container.appendChild(block_add)
    return block_container
}

renderClosingTimesTable = () => {
    let block_closingtimes = document.querySelector("#Add-closingtimes-closingtimes")
    if (!block_closingtimes) return
    block_closingtimes.innerHTML = ""
    block_closingtimes.appendChild(createBlockClosingTimes())
}
togglePersonClosingTime = async (button, person_id, year, date_id) => {
    showLoading("togglePersonClosingTime")
    year = year.toString()
    let closingtime = CLOSINGTIMES.find(c => c.id === date_id)

    let person_all = await dbGet_persons_active_where_yearweek(getDateToRosterDate(new Date(closingtime.start))[0])

    callback = () => {
        let cid = CLOSINGTIMES.map(c => c.id).indexOf(date_id)
        dbGet_closingtime(date_id).then(closingtime => {
            CLOSINGTIMES[cid] = closingtime
            let block_person = document.querySelector(`#Add-closingtimes-closingtimes .td-person-${year}-${date_id}`)
            block_person.innerHTML = ""
            block_person.appendChild(renderCheckPersonClosingTime(year, date_id))
            hideLoading("togglePersonClosingTime")
            if (getDateToRosterDate(new Date(closingtime.start))[0] <= DATE_YEAR_WEEK && getDateToRosterDate(new Date(closingtime.end))[0] >= DATE_YEAR_WEEK) {
                setPerson().then(() => {
                    loadRosterTable()
                    loadRosterTableWeek()
                })
            }
        })
    }
    if (person_id === "all" ) {
        if (closingtime.persons.length === person_all.length) {
            dbRemove_closingtime_all_persons(closingtime.id).then(() => callback())
        } else {
            for (let pa=0; pa<person_all.length; pa++) {
                let person = person_all[pa]
                if (closingtime.persons.indexOf(person.id) === -1) {
                    removePersonShiftsBetweenDate(person.id, closingtime.start, closingtime.end, true)
                    dbAdd_closingtime_person(closingtime.id, person.id).then(() => {
                        if (pa === person_all.length-1) {callback()}
                    })
                } else {
                    if (pa === person_all.length-1) {callback()}
                }
            }
        }
    } else if (closingtime.persons.indexOf(person_id) > -1) {
        dbRemove_closingtime_person(closingtime.id, person_id).then(() => callback())
    } else {
        removePersonShiftsBetweenDate(person_id, closingtime.start, closingtime.end, true)
        dbAdd_closingtime_person(closingtime.id, person_id).then(() => callback())
    }

}
renderCheckPersonClosingTime = (year, date_id) => {
    year = year.toString()
    let closingtime = CLOSINGTIMES.find(c => c.id === date_id)
    let block_container = document.createElement("div")
    let block_person_select_all_container = document.createElement("div")
    block_person_select_all_container.classList.add("all")
    let block_person_select_all = document.createElement("button")
    block_person_select_all.innerHTML = "Alle"
    block_person_select_all.setAttribute("onclick", `togglePersonClosingTime(this, "all", ${year}, ${date_id})`)
    if (closingtime.persons.length === PERSONS.length) {
        block_person_select_all.classList.add("active")
    }
    block_person_select_all_container.appendChild(block_person_select_all)
    block_container.appendChild(block_person_select_all_container)

    let block_person_select_single_container = document.createElement("div")
    block_person_select_single_container.classList.add("container")
    //let person_all = dbGet_persons_active_where_yearweek(getDateToRosterDate(new Date(closingtime.start))[0])
    let person_all = PERSONS
    person_all.forEach(person => {
        let block_button = document.createElement("button")
        block_button.innerHTML = person.name
        block_button.setAttribute("onclick", `window.setTimeout(() => {togglePersonClosingTime(this, ${person.id}, ${year}, ${date_id})}, 50)`)
        if (closingtime.persons.indexOf(person.id) > -1) {
            block_button.classList.add("active")
        }
        block_person_select_single_container.appendChild(block_button)
    })
    block_container.appendChild(block_person_select_single_container)
    return block_container
}
createBlockClosingTimes = () => {
    let block_table = document.createElement("table")

    let block_thead = document.createElement("thead")
    let block_thead_tr = document.createElement("tr")
    let block_th_year = document.createElement("th")
    block_th_year.innerHTML = "Jahr"
    block_thead_tr.appendChild(block_th_year)
    let block_th_date = document.createElement("th")
    block_th_date.innerHTML = "Datum"
    block_thead_tr.appendChild(block_th_date)
    let block_th_name = document.createElement("th")
    block_th_name.innerHTML = "Bezeichnung"
    block_thead_tr.appendChild(block_th_name)
    let block_th_person = document.createElement("th")
    block_th_person.innerHTML = "Personen"
    block_thead_tr.appendChild(block_th_person)
    let block_th_remove = document.createElement("th")
    block_thead_tr.appendChild(block_th_remove)
    block_thead.appendChild(block_thead_tr)

    block_table.appendChild(block_thead)

    let block_tbody = document.createElement("tbody")

    let year_before

    CLOSINGTIMES.sort((a,b) => b.start.localeCompare(a.start)).forEach(date => {
            let date_id = date.id
            let year = date.start.substring(0, 4)
            let block_tr = document.createElement("tr")
            let block_year = document.createElement("td")
            block_year.classList.add("font-number")
            if ((typeof year_before === "undefined") || (year !== year_before) ) {
                year_before = year
                block_year.classList.add("year")
                block_year.innerHTML = year
            }
            block_tr.appendChild(block_year)

            let block_date = document.createElement("td")
            block_date.classList.add("font-number")
            fixDateLength = (d) => {if (d.toString().length === 1) {d = `0${d}`}; return d} 
            let end_year = new Date(date.end).getFullYear().toString()
            checkYear = () => {if (year !== end_year) {return `.${end_year.slice(2,4)}`}; return ""}
            let date_start = `${fixDateLength(new Date(date.start).getDate())}.${fixDateLength(new Date(date.start).getMonth()+1)}`
            let date_end = `${fixDateLength(new Date(date.end).getDate())}.${fixDateLength(new Date(date.end).getMonth()+1)}${checkYear()}`
            if (date_start === date_end) { block_date.innerHTML = date_start }
            else { block_date.innerHTML = `${date_start} - ${date_end}` }

            block_tr.appendChild(block_date)

            let block_title = document.createElement("td")
            block_title.innerHTML = date.name
            block_tr.appendChild(block_title)

            let block_person = document.createElement("td")
            block_person.classList.add("td-person", `td-person-${year}-${date_id}`)
            if (date.lawful === 1) {
                let block_public_holiday = document.createElement("div")
                block_public_holiday.innerHTML = "Feiertag"
                block_person.appendChild(block_public_holiday)
            } else {
                block_person.appendChild(renderCheckPersonClosingTime(year, date_id))

            }
            block_tr.appendChild(block_person)

            let block_remove = document.createElement("td")
            let block_button_remove = document.createElement("button")
            block_button_remove.innerHTML = "löschen"
            block_button_remove.classList.add("button-remove")
            block_button_remove.setAttribute("title", "löschen")
            block_button_remove.setAttribute("onclick", `removeClosingTime(${year}, ${date_id})`)
            block_remove.appendChild(block_button_remove)
            block_tr.appendChild(block_remove)
            block_tbody.appendChild(block_tr)
        })

    block_table.appendChild(block_tbody)
    return block_table
}
renderBlockButtonAddClosingTime = () => {
    let block_container_add = document.querySelector("#Closingtimes .container-add")
    block_container_add.classList.remove("active")
    block_container_add.innerHTML = ""
    let block_button_add = document.createElement("button")
    block_button_add.innerHTML = "Hinzufügen"
    block_button_add.setAttribute("title", "speichern")
    block_button_add.classList.add("button-whitegreen")
    block_button_add.setAttribute("onclick", "renderBlockAddClosingTime()")
    block_container_add.appendChild(block_button_add)

    let block_button_add_lawful = document.createElement("button")
    block_button_add_lawful.innerHTML = "Feiertage automatisch hinzufügen"
    block_button_add_lawful.setAttribute("id", "Lawful-vacations-Automatic-add-request")
    block_button_add_lawful.setAttribute("onclick", "addClosingTimeLawfulVacations()")
    block_container_add.appendChild(block_button_add_lawful)
}
renderBlockAddClosingTime = () => {
    let block_container_add = document.querySelector("#Closingtimes .container-add")
    block_container_add.classList.add("active")
    block_container_add.innerHTML = ""
    let block_cancel = document.createElement("button")
    block_cancel.classList.add("button-orange", "button-cancel")
    block_cancel.setAttribute("onCLick", "renderBlockButtonAddClosingTime()")
    block_cancel.innerHTML = "Abbrechen"
    block_container_add.appendChild(block_cancel)
    let block_add = createAddClosingTime()
    block_container_add.appendChild(block_add)
}
openClosingTime = async () => {
    settingsContainerHideAll("Closingtimes")
    CLOSINGTIMES = await dbGet_closingtimes()
    let popup_container = document.getElementById("Closingtimes")
    popup_container.innerHTML = ""
    popup_container.classList.add("active", "closingtime")

    let block_header = document.createElement("h2")
    block_header.innerHTML = "Schließzeiten"
    popup_container.appendChild(block_header)

    let block_container_add = document.createElement("div")
    block_container_add.classList.add("container-add")
    popup_container.appendChild(block_container_add)
    renderBlockButtonAddClosingTime()

    let block_closingtimes = document.createElement("div")
    block_closingtimes.setAttribute("id", "Add-closingtimes-closingtimes")
    block_closingtimes.appendChild(createBlockClosingTimes())
    popup_container.appendChild(block_closingtimes)

    document.body.classList.add("noscroll")
}
