
closeVacationOverviewAdd = () => {
    let blocks_r_active = document.querySelectorAll("#Vacations-overview tbody .active")
    for (let i=0; i<blocks_r_active.length; i++) {
        blocks_r_active[i].classList.remove("active")
    }
	let block_remove = document.querySelector("#Vacations-overview .vacations-overview-popup-edit")
	document.querySelector("#Vacations-overview").removeEventListener('click', eventListenerCloseVacationsOverviewEdit);
    window.setTimeout(() => {
        block_remove.parentNode.removeChild(block_remove)
    },50)
}

closeVacationOverviewEditRemove = (person_id, vacation_id, month) => {
    removeVacation(person_id, vacation_id).then(() => {
        closeVacationOverviewAdd()
        let block = document.querySelector(`#Vacations-overview .td-${person_id}-month-${month}`)
        window.setTimeout(() => {
            openVacationsOverview(document.getElementById("Settings-open-vacations-overview"))
        },50)
    })
}

closeVacationOverviewEditSave = (person_id, vacation_id, month) => {
    let start =  document.querySelector(`.td-${person_id}-month-${month} .input-start`).value
    let end = document.querySelector(`.td-${person_id}-month-${month} .input-end`).value
    editVacation(person_id, vacation_id, start, end).then(() => {
        closeVacationOverviewAdd()
        let block = document.querySelector(`#Vacations-overview .td-${person_id}-month-${month}`)
        window.setTimeout(() => {
            openVacationsOverview(document.getElementById("Settings-open-vacations-overview"))
        },50)
    })
}

closeVacationOverviewAddSave = (person_id, month) => {
    let start =  document.querySelector(`.td-${person_id}-month-${month} .input-start`).value
    let end = document.querySelector(`.td-${person_id}-month-${month} .input-end`).value
    saveVacation(person_id, start, end).then(() => {
        setActivePerson(person_id).then(() => {
            closeVacationOverviewAdd()
            let block = document.querySelector(`#Vacations-overview .td-${person_id}-month-${month}`)
            window.setTimeout(() => {
                openVacationsOverview(document.getElementById("Settings-open-vacations-overview"))
            },50)
        })
    })
}
eventListenerCloseVacationsOverviewEdit = (e) => {
	if (! document.querySelector('#Vacations-overview .vacations-overview-popup-edit').contains(e.target)){
		closeVacationOverviewAdd()
	}
}
editNewVacationFromOverview = (el, person_id, vacation_id, month) => {
    let person = PERSONS.find(p => p.id === person_id)
    let vacation = person.vacations.find(v => v.id === vacation_id)
    let block_to_remove = document.querySelector("#Vacations-overview .vacations-overview-popup-edit")
    if (block_to_remove) closeVacationOverviewAdd()
    el.closest("tr").classList.add("active")
    let start = vacation.start
    let end = vacation.end
    let block = document.createElement("div")
    block.classList.add("vacations-overview-popup-edit")
    let block_container = document.createElement("div")
    block_container.classList.add("container")

    let block_name = document.createElement("h4")
    block_name.innerHTML = person.name
    block_container.appendChild(block_name)

    let block_close = document.createElement("button")
    block_close.classList.add("button-x")
    block_close.setAttribute("onCLick", "closeVacationOverviewAdd()")
    block.appendChild(block_close)

    let block_start = document.createElement("input")
    block_start.classList.add("input-start")
    block_start.setAttribute("type", "date")
    block_start.setAttribute("title", "Startdatum")
    block_start.value = start
    block_container.appendChild(block_start)

    let block_end = document.createElement("input")
    block_end.classList.add("input-end")
    block_end.setAttribute("type", "date")
    block_end.setAttribute("title", "Enddatum")
    block_end.value = end
    block_container.appendChild(block_end)

    block.appendChild(block_container)

    let block_remove = document.createElement("button")
    block_remove.classList.add("button-remove")
    block_remove.setAttribute("onClick", `closeVacationOverviewEditRemove(${person_id}, ${vacation_id}, ${month})`)
    block_remove.innerHTML = "Löschen"
    block.appendChild(block_remove)

    let block_save = document.createElement("button")
    block_save.classList.add("button-save", "button-whitegreen")
    block_save.setAttribute("onClick", `closeVacationOverviewEditSave(${person_id}, ${vacation_id}, ${month})`)
    block_save.innerHTML = "Speichern"
    block.appendChild(block_save)

    document.querySelector(`#Vacations-overview .td-${person_id}-month-${month}`).appendChild(block)

	window.setTimeout(() => {
		document.querySelector("#Vacations-overview").addEventListener('click', eventListenerCloseVacationsOverviewEdit);
	}, 100)
}
addNewVacationFromOverview = (person_id, year, month) => {
    let block_remove = document.querySelector("#Vacations-overview .vacations-overview-popup-edit")
    if (block_remove) closeVacationOverviewAdd()
    let month_s = month.toString()
    if (month_s.length === 1) {month_s = `0${month}`}
    let person = PERSONS.find(p => p.id === person_id)
    let start = `${year}-${month_s}-01`
    let end = `${year}-${month_s}-07`
    let block = document.createElement("div")
    block.classList.add("vacations-overview-popup-edit", "add")
    let block_container = document.createElement("div")
    block_container.classList.add("container")

    let block_name = document.createElement("h4")
    block_name.innerHTML = person.name
    block_container.appendChild(block_name)

    let block_close = document.createElement("button")
    block_close.classList.add("button-x")
    block_close.setAttribute("onCLick", "closeVacationOverviewAdd()")
    block.appendChild(block_close)

    let block_start = document.createElement("input")
    block_start.classList.add("input-start")
    block_start.setAttribute("type", "date")
    block_start.setAttribute("title", "Startdatum")
    block_start.value = start
    block_container.appendChild(block_start)

    let block_end = document.createElement("input")
    block_end.classList.add("input-end")
    block_end.setAttribute("type", "date")
    block_end.setAttribute("title", "Enddatum")
    block_end.value = end
    block_container.appendChild(block_end)

    block.appendChild(block_container)

    let block_save = document.createElement("button")
    block_save.classList.add("button-save")
    block_save.setAttribute("onClick", `closeVacationOverviewAddSave(${person_id}, ${month})`)
    block_save.innerHTML = "Speichern"
    block.appendChild(block_save)


    document.querySelector(`#Vacations-overview .td-${person_id}-month-${month}`).appendChild(block)

	window.setTimeout(() => {
		document.querySelector("#Vacations-overview").addEventListener('click', eventListenerCloseVacationsOverviewEdit);
	}, 100)
}
renderVacationsOverviewTableButton = (person_id, name, start, end, isclosing, vacation_id) => {
    let year = DATE_YEAR.toString()
    daysInMonth = (month) => {
        return new Date(year, month, 0).getDate();
    }

    let block_container = document.querySelector("#Vacations-overview .table-container")
    let view = true
    block_container.classList.add("view")

    let year_e = start.slice(0,4)
    let month_s = parseFloat(start.slice(5,7))
    let month_e = parseFloat(end.slice(5,7))
    let day_s = parseFloat(start.slice(8,10))
    let day_e = parseFloat(end.slice(8,10))
    let text = `${day_s}.${month_s}-${day_e}.${month_e}`
    if (day_s === day_e) {text = `${day_s}.${month_s}`}
    let block_button = document.createElement("div")
    block_button.setAttribute("title", `${name}\n${text}`)
    let block_spacer
    let block_text = document.createElement("button")
    block_text.innerHTML = text
    block_button.appendChild(block_text)
    if (year_e === year && month_s === month_e) {
        if (view) {
            let days = daysInMonth(month_s)
            let left = (day_s-1)*100/(days)
            let right = (days-month_e)*100/(days)
            let width = ((day_e-day_s)+1)*100/(days)
            block_button.style = `position: absolute; left: ${left}%; min-width: unset; padding: 0; top: 0; width: ${width}%;`
        } else {
            block_button.innerHTML = text
        }
    } else if (year_e === year) {
        let add_border_width = (month_e-month_s)
        if (view) {
            let days_s = daysInMonth(month_s)
            let days_e = daysInMonth(month_e)
            let add_width = (month_e-month_s-1)*100
            let start_width = ((days_s-(day_s-1))*100)/(days_s)
            let end_width = (day_e*100)/(days_e)
            let left = (day_s-1)*100/(days_s)
            let width = add_width+start_width+end_width
            block_button.style = `position: absolute; left: ${left}%; min-width: unset; padding: 0; top: 0; width: calc(${width}% + ${add_border_width}px);`
        } else {
            block_button.innerHTML = text
            let width = ((month_e-month_s)+1)*100-100
            block_button.style = `position: absolute; min-width: unset; left: 50%; top: 13px; width: calc(${width}% + ${add_border_width}px);`

            block_button.classList.add("button-vacation-overflow")
            for (let i=month_s; i<=month_e; i++) {
                VACATIONS_OVERVIEW_BUTTONS_SPACER.push([person_id,i])
            }
        }
    }
    if (isclosing) block_button.classList.add("isclosing")
    if (!isclosing) block_text.setAttribute("onCLick", `editNewVacationFromOverview(this, ${person_id}, ${vacation_id}, ${month_s})`)
    block_button.classList.add("button-vacation")
    let block_td_active = block_container.querySelector(`.td-${person_id}-month-${month_s}`)
    block_td_active.appendChild(block_button)
}

let VACATIONS_OVERVIEW_BUTTONS_SPACER = []
renderVacationsOverviewTable = async () => {
    VACATIONS_OVERVIEW_BUTTONS_SPACER = []
    let year = DATE_YEAR.toString()
    let block_container = document.querySelector("#Vacations-overview .table-container")
    block_container.innerHTML = ""
    let block_table = document.createElement("table")
    let block_thead = document.createElement("thead")
    let block_thead_tr = document.createElement("tr")
    let block_tbody = document.createElement("tbody")
    let block_th_names = document.createElement("th")
    block_thead_tr.appendChild(block_th_names)

    let block_closingtime_tr = document.createElement("tr")
    block_closingtime_tr.classList.add("tr-x")
    let block_closingtime_td_name = document.createElement("td")
    block_closingtime_td_name.innerHTML = "Schließzeiten"
    block_closingtime_td_name.classList.add("td-name")
    block_closingtime_tr.appendChild(block_closingtime_td_name)
    for (let i=1; i<13; i++) {
        let block_td_c = document.createElement("td")
        block_td_c.classList.add(`td-x-month-${i}`)
        block_closingtime_tr.appendChild(block_td_c)
    }
    block_tbody.appendChild(block_closingtime_tr)

    let person = PERSONS
    for (let i=1; i<13; i++) {
        let month = new Date(`${year}-${i}`).toLocaleString("default", {month: "long"})
        let block_th = document.createElement("th")
        block_th.innerHTML = month
        block_thead_tr.appendChild(block_th)
    }
    person.forEach(pe => {
        let block_tr = document.createElement("tr")
        let block_td = document.createElement("td")
        block_td.classList.add(`td-${pe.id}`, "td-name")
        block_td.innerHTML = pe.name
        block_tr.appendChild(block_td)

        for (let month=1; month<13; month++) {
            let block_td_m = document.createElement("td")
            block_td_m.classList.add(`td-${pe.id}-month-${month}`)
            let button_new = document.createElement("button")
            button_new.innerHTML = "+"
            button_new.classList.add("button-new")
            button_new.setAttribute("onClick", `addNewVacationFromOverview(${pe.id}, ${year}, ${month})`)
            button_new.setAttribute("title", `neuen Urlaub hinzufügen`)
            block_td_m.appendChild(button_new)
            block_tr.appendChild(block_td_m)
        }
        block_tbody.appendChild(block_tr)
    })
    block_thead.appendChild(block_thead_tr)
    block_table.appendChild(block_thead)
    block_table.appendChild(block_tbody)
    block_container.appendChild(block_table)

    closingtimes = CLOSINGTIMES 
    for (let co=0; co<closingtimes.length;co++) {
        let closingtime = closingtimes[co]
        renderVacationsOverviewTableButton("x", closingtime.name, closingtime.start, closingtime.end, true)
    }
    person.forEach(pe => {
        pe.vacations.forEach((vacation, v_id) => {
            if (vacation.start.slice(0,4) !== year) return
            if (typeof vacation.id === "undefined") {
                renderVacationsOverviewTableButton(pe.id, pe.name, vacation.start, vacation.end, true, vacation.closingtime_id)
            } else {
                renderVacationsOverviewTableButton(pe.id, pe.name, vacation.start, vacation.end, false, vacation.id)
            }
        })
    })


    VACATIONS_OVERVIEW_BUTTONS_SPACER.forEach(s => {
            let block_spacer = block_container.querySelector(`.td-${s[0]}-month-${s[1]} .button-vacation:not(.button-vacation-overflow)`)
        if (block_spacer) { block_spacer.style.marginTop = "24px" }
    })
}

openVacationsOverview = (el) => {
    settingsContainerHideAll("Vacations-overview")
    let year = DATE_YEAR.toString()
    let block = document.getElementById("Vacations-overview")
    let block_container = document.getElementById("Vacations-overview")
    block_container.innerHTML = ""
    block.classList.add("active", "vacations-overview")
    let block_name = document.createElement("h2")
    block_name.innerHTML = "Urlaubsübersicht"
    block_container.appendChild(block_name)
    let block_table_container = document.createElement("div")
    block_table_container.classList.add("table-container", "view")
    block_container.appendChild(block_table_container)
    renderVacationsOverviewTable()
}
