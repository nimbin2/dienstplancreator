
setPersonMenuCopyMpaToday = (person_id, day_id, el) => { 
    setP = (person) => {
        let block_container = document.createElement("div")
        block_container.classList.add("free", "set-mpa")
        let block_label = document.createElement("label")
        block_label.innerHTML = "Stunden:"
        block_container.appendChild(block_label)
        let block_input = document.createElement("input")
        block_input.setAttribute("id", "Get-menu-mpas-hours")
        block_input.setAttribute("type", "number")
        block_input.setAttribute("step", "0.25")
        block_input.value = person.mpa[day_id]
        block_container.appendChild(block_input)
        let block_button = document.createElement("button")
        block_button.innerHTML = "&#10003;"
        block_button.setAttribute("onClick", `addMpaToday(${person_id}, ${day_id}, document.getElementById("Get-menu-mpas-hours").value)`)
        block_container.appendChild(block_button)
        document.querySelector(`.menu-${person_id}-day-${day_id} div .menu-extras`).insertBefore(block_container, document.querySelector(`.menu-${person_id}-day-${day_id} .add-mpa`))
        el.style.display = "none"
    }
    getActivePersonById(person_id).then(person => setP(person))

}

setPersonMenuCopyBettermentToday = async (person_id, day_id, el) => { 
    let block_container = document.createElement("div")
    block_container.classList.add("free", "set-betterment")
    let block_label = document.createElement("label")
    block_label.innerHTML = "Stunden:"
    block_container.appendChild(block_label)
    let block_input = document.createElement("input")
    block_input.setAttribute("id", "Get-menu-betterments-hours")
    block_input.setAttribute("type", "number")
    block_input.setAttribute("step", "0.25")
    block_input.value = 8
    block_container.appendChild(block_input)
    let block_button = document.createElement("button")
    block_button.innerHTML = "&#10003;"
    block_button.setAttribute("onClick", `addBettermentToday(${person_id}, ${day_id}, document.getElementById("Get-menu-betterments-hours").value)`)
    block_container.appendChild(block_button)
    document.querySelector(`.menu-${person_id}-day-${day_id} div .menu-extras`).insertBefore(block_container, document.querySelector(`.menu-${person_id}-day-${day_id} .add-betterment`))
    el.style.display = "none"
}

createPersonMenuCopyExtras = (person_id, day_id) => {
    let block_menu_extras = document.createElement("div")
    block_menu_extras.classList.add("menu-extras")

    let block_mpa = document.createElement("button")
    block_mpa.innerHTML = getRenames("m").t
    block_mpa.setAttribute("onClick", `setPersonMenuCopyMpaToday(${person_id}, ${day_id}, this)`)
    block_mpa.setAttribute("title", `Einmalig mpa hinzufügen,- nur für diesen Tag.`)
    block_mpa.classList.add("free", "add-mpa")
    block_menu_extras.appendChild(block_mpa)

    let block_ill = document.createElement("button")
    block_ill.innerHTML = getRenames("i").t
    block_ill.setAttribute("onClick", `addIllnesToday(${person_id}, ${day_id})`)
    block_ill.classList.add("free")
    block_menu_extras.appendChild(block_ill)

    let block_betterment = document.createElement("button")
    block_betterment.innerHTML = getRenames("b").t
    block_betterment.setAttribute("onClick", `setPersonMenuCopyBettermentToday(${person_id}, ${day_id}, this)`)
    block_betterment.classList.add("free", "add-betterment")
    block_menu_extras.appendChild(block_betterment)
    return block_menu_extras
}
createPersonMenuCopyTo = (person_id, day_id) => {
    let person = PERSONS.find(p => p.id === person_id)
    let block_menu = document.createElement("div")
    let block_title = document.createElement("p")
    let block_remove = document.createElement("button")
    block_title.innerHTML = "Schicht übertragen nach:"
    block_remove.innerHTML = "Schicht löschen"
    block_remove.setAttribute("onClick", "closeRosterPersonMenu("+person_id+", "+day_id+"),removePersonFromShiftDay("+person_id+", "+day_id+")")
    block_remove.classList.add("remove", "button-remove")
    block_menu.appendChild(block_remove)

    let blocks_day = []
    let shifts = person.shifts.filter(s => s.day_id === day_id)
    if (shifts.length === 0) return
    let onclick_string_all = ""
    for (let d_id=0; d_id<DAYS.length;d_id++) {
        let day = DAYS[d_id]
        if (d_id === day_id) continue
        let cf = person.freedays[day_id]
        if (cf) continue
        let block_day = document.createElement("button")
        block_day.innerHTML = day

        let onclick_string = ""
        let add_function
        let noshifts_reload = true
        shifts.forEach((shift, sid) => {
            if (sid === shifts.length-1) {noshifts_reload = false}
            if (sid === 0) {add_function = `addNewShiftToRoster(${person_id}, ${d_id}, ${shift.start}, ${shift.end}, "${DATE_YEAR_WEEK}", ${noshifts_reload})`}
            else {add_function = `addShift("${DATE_YEAR_WEEK}", ${d_id}, ${person_id}, ${shift.start}, ${shift.end}, ${noshifts_reload})`}
            onclick_string = onclick_string+`${add_function}; `
        })
        onclick_string_all = onclick_string_all+onclick_string

        block_day.setAttribute("onClick", `closeRosterPersonMenu(${person_id}, ${day_id}); ${onclick_string}`)
        blocks_day.push(block_day)
    }
    if (blocks_day.length > 0) {
        block_menu.appendChild(block_title)
        blocks_day.forEach(block => block_menu.appendChild(block))
    }
    let block_all = document.createElement("button")
    block_all.innerHTML = "Alle"
    block_all.setAttribute("onClick", `closeRosterPersonMenu(${person_id}, ${day_id}); ${onclick_string_all}`)
    block_menu.appendChild(block_all)

    let onclick_string_next_week = ""
    let should_delete = true
    shifts.forEach((shift, sid) => {
        if (sid === 0) {add_function = `addNewShiftToRoster(${person_id}, ${day_id}, ${shift.start}, ${shift.end}, "${DATE_YEAR_WEEK_AFTER}")`}
        else {add_function = `addShift("${DATE_YEAR_WEEK_AFTER}", ${day_id}, ${person_id}, ${shift.start}, ${shift.end})`}
        onclick_string_next_week = onclick_string_next_week+`${add_function}; `
    })
    let block_next_week = document.createElement("button")
    block_next_week.classList.add("prev-next")
    block_next_week.innerHTML = "Nächste Woche"
    block_next_week.setAttribute("onClick", "closeRosterPersonMenu("+person_id+", "+day_id+"); "+onclick_string_next_week)
    block_menu.appendChild(block_next_week)


    block_menu.appendChild(createPersonMenuCopyExtras(person_id, day_id))

    return block_menu
}

createPersonMenuCopyFrom = (person_id, day_id) => {
    let person = PERSONS.find(p => p.id === person_id)
    let block_menu = document.createElement("div")
    let block_title = document.createElement("p")
    block_title.innerHTML = "Schicht kopieren von:"
    block_menu.appendChild(block_title)

    cretePreWeek = async (roster, date, str) => {
        if (typeof roster !== "undefined") {
            return dbGet_shifts_where_yearweek_and_day_and_person(date, day_id, person_id).then(shifts => {
                if (shifts.length === 0) {return}
                let onclick_string = ""
                let html_string = str+" Woche "
                let break_d = true
                callback = () => {
                    let add_function
                    let noshifts_reload = true
                    shifts.forEach((shift, sid) => {
                        if (shifts.length === 0) return
                        if (sid === shifts.length-1) {noshifts_reload = false}
                        if (sid === 0) {add_function = `addNewShiftToRoster(${person_id}, ${day_id}, ${shift.start}, ${shift.end}, "${DATE_YEAR_WEEK}", ${noshifts_reload})`}
                        else {add_function = `addShift("${DATE_YEAR_WEEK}", ${day_id}, ${person_id}, ${shift.start}, ${shift.end}, ${noshifts_reload})`}
                        onclick_string = onclick_string+`${add_function}; `
                        html_string = html_string+"("+timeToHHMM(shift.start)+"-"+timeToHHMM(shift.end)+") "
                        break_d = false
                    })
                    let block_button_last_week = document.createElement("button")
                    block_button_last_week.classList.add("prev-next")
                    block_button_last_week.innerHTML = html_string
                    block_button_last_week.setAttribute("onClick", `closeRosterPersonMenu(${person_id}, ${day_id}); ${onclick_string}`)
                    block_menu.appendChild(block_button_last_week)
                    return
                }
                return callback()
            })
        }
    }
    DAYS.forEach((day, d_id) => {
        if (d_id === day_id) return
        let block_day = document.createElement("button")
        let shifts = person.shifts.filter(s => s.day_id === d_id)
        if (shifts.length === 0) return
        let onclick_string = ""
        let html_string = ""
        let break_d = true
        let add_function
        let noshifts_reload = true
        shifts.forEach((shift, sid) => {
            if (sid === shifts.length-1) {noshifts_reload = false}
            if (sid === 0) {add_function = `addNewShiftToRoster(${person_id}, ${day_id}, ${shift.start}, ${shift.end}, "${DATE_YEAR_WEEK}", ${noshifts_reload})`}
            else {add_function = `addShift("${DATE_YEAR_WEEK}", ${day_id}, ${person_id}, ${shift.start}, ${shift.end}, ${noshifts_reload})`}
            onclick_string = onclick_string+`${add_function}; `
            html_string = html_string+day+" ("+timeToHHMM(shift.start)+"-"+timeToHHMM(shift.end)+") "
            break_d = false
        })
        if (break_d) return
        block_day.innerHTML = html_string
        block_day.setAttribute("onClick", `closeRosterPersonMenu(${person_id}, ${day_id}); ${onclick_string};`)
        block_menu.appendChild(block_day)
    })


    return cretePreWeek(ROSTER_WEEK_BEFORE, DATE_YEAR_WEEK_BEFORE, "Letzte").then(() => {
        return cretePreWeek(ROSTER_WEEK_BEFORE_WEEK, DATE_YEAR_WEEK_BEFORE_WEEK,  "Vorletzte").then(() => {
            block_menu.appendChild(createPersonMenuCopyExtras(person_id, day_id))
            return block_menu
        })
    })

}

openRosterPersonMenu = async (person_id, day_id) => {
    document.getElementById("Td-name-"+person_id+"-day-"+day_id).classList.add("active")
    let block_menu = document.getElementsByClassName("menu-"+person_id+"-day-"+day_id)[0]
    let person = PERSONS.find(p => p.id === person_id)
    let shifts = person.shifts.filter(s => s.day_id === day_id)
    let block_entry = shifts.length === 0 ?
    (await createPersonMenuCopyFrom(person_id, day_id)) :
    createPersonMenuCopyTo(person_id, day_id)

    block_menu.style.top = 0
    block_menu.innerHTML = ""
    block_menu.appendChild(block_entry)

    block_menu.classList.add("active")

    let ar = document.querySelector(`#Table-${day_id}-container tbody`).getBoundingClientRect().top
    let am = document.getElementsByClassName(`menu-${person_id}-day-${day_id}`)[0].getBoundingClientRect().top
    let ah = document.getElementsByClassName(`menu-${person_id}-day-${day_id}`)[0].getBoundingClientRect().height
    let br = document.querySelector(`#Table-${day_id}-container .table-times`).getBoundingClientRect().bottom
    let bm = document.getElementsByClassName(`menu-${person_id}-day-${day_id}`)[0].getBoundingClientRect().bottom
    let bb = br-bm-60
    let aa = ar-am+ah
    let block_h = document.querySelector(`#Td-name-${person_id}-day-${day_id}`)
    if (bb < 0 && aa < 0) {
        block_menu.style = `top: ${bb}px; bottom: unset;`
    } else {
        block_menu.style = "top: 0; bottom: unset;"
    }

    window.setTimeout(() => {
        document.body.onclick = (e) => eventListenerPersonMenu(e, person_id, day_id)
    }, 100)
}

closeRosterPersonMenu = (person_id, day_id) => {
    document.getElementById("Td-name-"+person_id+"-day-"+day_id).classList.remove("active")
    let block_menu = document.getElementsByClassName("menu-"+person_id+"-day-"+day_id)[0]
    block_menu.classList.remove("active")
    block_menu.innerHTML = ""
    document.body.onclick = null
}
eventListenerPersonMenu = (evt, person_id, day_id) => {
    let clickEl = document.getElementsByClassName("menu-"+person_id+"-day-"+day_id)[0]
    if (!clickEl.contains(evt.target)){ 
        closeRosterPersonMenu(person_id, day_id)
    }
}
