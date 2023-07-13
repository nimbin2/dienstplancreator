transferCopyPersonTable = () => {
    showLoading("transferCopyPersonTable")
    let transfer_shifts = document.querySelectorAll(`#Roster-week-table-from .Roster-week-td.active`)
    if (transfer_shifts.length === 0) {
        hideLoading("transferCopyPersonTable")
    }
    let all_shifts = []
    for (let i=0; i<transfer_shifts.length; i++) {
        let block_shift = transfer_shifts[i]
        all_shifts.push({person_id: parseFloat(transfer_shifts[i].getAttribute("person_id")), day_id: parseFloat(transfer_shifts[i].getAttribute("day_id"))})
    }
    all_shifts = all_shifts.sort((a,b) => b.person_id-a.person_id)
    let unique_persons = [...new Set(all_shifts.map(item => item.person_id))]
    setS = async (shifts) => {
        for (let s=0; s<shifts.length; s++) {
            reloadPersonDayData(shifts[s].person_id, shifts[s].day_id, DATE_YEAR_WEEK_TABLE_TO , "Roster-week-table-to")
        }
    }
    setP = (spid) => {
        let shifts = all_shifts.filter(d => d.person_id === spid)
        return dbGet_person_active(DATE_YEAR_WEEK_TABLE_TO, spid).then(new_person => {
            let pid = PERSONS_TABLE_TO.map(p => p.id).indexOf(new_person.id)
            PERSONS_TABLE_TO[pid] = new_person
            if (DATE_YEAR_WEEK_TABLE_TO === DATE_YEAR_WEEK) {
                let pwid = PERSONS_WEEK.map(p => p.id).indexOf(new_person.id)
                PERSONS_WEEK[pwid] = new_person
                let prid = PERSONS_ROSTER.map(p => p.id).indexOf(new_person.id)
                PERSONS_ROSTER[prid] = new_person
                let ppid = PERSONS.map(p => p.id).indexOf(new_person.id)
                PERSONS[ppid] = new_person
            }
            setS(shifts)

        })
    }
    setAll = async () => {
        for (let u=0; u<unique_persons.length; u++) {
            setP(unique_persons[u])
        }
        hideLoading("transferCopyPersonTable")
    }
    for (let i=0; i<transfer_shifts.length; i++) {
        let block_shift = transfer_shifts[i]
        let person_id = parseFloat(block_shift.getAttribute("person_id"))
        let person = PERSONS_TABLE_TO.find(p => p.id === person_id)
        let day_id = parseFloat(block_shift.getAttribute("day_id"))
        let shifts = PERSONS_TABLE_FROM.find(p => p.id === person_id).shifts.filter(s => s.day_id === day_id)
        checkIfPersonDayIsFree(person_id, day_id, DATE_YEAR_WEEK_TABLE_TO).then(cfree => {
            if (cfree === false) {
                removePersonFromShiftDay(person.id, day_id, DATE_YEAR_WEEK_TABLE_TO, true).then(() => {
                    shifts.forEach((shift, s_d) => {
                        addShift(DATE_YEAR_WEEK_TABLE_TO, day_id, person_id, shift.start, shift.end, true).then(() => {
                            if (s_d === shifts.length-1 && i === transfer_shifts.length-1) setAll()
                        })
                    })
                })
            }
        })
    }
    let change_tds = document.querySelectorAll("#Popup.roster-copy-person-table .Roster-week-table-copy-person td.active")
    for (let ic=0; ic<change_tds.length; ic++) {
        let change_td = change_tds[ic]
        if (change_td.classList.contains("active")) { 
            change_td.classList.remove("active")
            change_td.classList.add("inactive")
            change_td.setAttribute("onClick", "")
        }
    }
    let change_ths = document.querySelectorAll("#Popup.roster-copy-person-table .Roster-week-table-copy-person th.active")
    for (let ih=0; ih<change_ths.length; ih++) {
        let change_th = change_ths[ih]
        if (change_th.classList.contains("active")) { 
            change_th.classList.remove("active")
            change_th.classList.add("inactive")
            change_th.setAttribute("onClick", "")
        }
    }
}

toggleCopyPersonActiveDays = (el) => {
   let day_id = el.getAttribute("day_id")
   if (day_id === "all") {
      let block_buttons = document.querySelectorAll("#Popup.roster-copy-person .item-days button")
      if (el.classList.contains("active")) {
         for (let i=0; i< block_buttons.length; i++) block_buttons[i].classList.remove("active")
         
      } else {
         for (let i=0; i< block_buttons.length; i++) block_buttons[i].classList.add("active")
      }
      return
   }
   if (el.classList.contains("active")) {
      document.querySelector("#Popup.roster-copy-person .item-days button.button-all").classList.remove("active")
      el.classList.remove("active")
   } else {
      el.classList.add("active")
   }
}
toggleCopyPersonActivePerson = (el) => {
   let person_id = el.getAttribute("person_id")
   if (person_id === "all") {
      let block_buttons = document.querySelectorAll("#Popup.roster-copy-person .item-person button")
      if (el.classList.contains("active")) {
         for (let i=0; i< block_buttons.length; i++) block_buttons[i].classList.remove("active")
         
      } else {
         for (let i=0; i< block_buttons.length; i++) block_buttons[i].classList.add("active")
      }
      return
   }
   if (el.classList.contains("active")) {
      document.querySelector("#Popup.roster-copy-person .item-days button.button-all").classList.remove("active")
      el.classList.remove("active")
   } else {
      el.classList.add("active")
   }
}
toggleCopyPersonTableToButton = (person_id, day_id, set_active) => {
    person_id = parseFloat(person_id)
    day_id = parseFloat(day_id)
    if (!document.querySelector(`#Roster-week-table-to .Roster-week-td-name-${person_id}-day-${day_id}`)) return
    if (!document.querySelector(`#Roster-week-table-from .Roster-week-td-name-${person_id}-day-${day_id}`)) return
    let free_from = PERSONS_TABLE_FROM.find(p => p.id === person_id).freedays[day_id]
    if (!free_from) {free_from = PERSONS_TABLE_FROM.find(p => p.id === person_id).sf[day_id]}
    let free_to = PERSONS_TABLE_TO.find(p => p.id === person_id).freedays[day_id]
    if (!free_to) {free_to = PERSONS_TABLE_TO.find(p => p.id === person_id).sf[day_id]}
    if ((free_from !== false) || (free_to !== false)) return
    if (typeof set_active === "undefined") {
        document.querySelector(`#Roster-week-table-to .Roster-week-td-name-${person_id}-day-${day_id}`).classList.toggle("active")
    } else if (set_active) {
        document.querySelector(`#Roster-week-table-to .Roster-week-td-name-${person_id}-day-${day_id}`).classList.add("active")
    } else if (!set_active) {
        document.querySelector(`#Roster-week-table-to .Roster-week-td-name-${person_id}-day-${day_id}`).classList.remove("active")
    }
}
toggleCopyPersonTableButton = (el, set) => {
    el = document.querySelector(`#Popup.roster-copy-person-table #Roster-week-table-from .Roster-week-td-name-${el.getAttribute("person_id")}-day-${el.getAttribute("day_id")}`)
    el_to = document.querySelector(`#Popup.roster-copy-person-table #Roster-week-table-to .Roster-week-td-name-${el.getAttribute("person_id")}-day-${el.getAttribute("day_id")}`)
    if (!el) return
    if (!el_to) return
    if (el.classList.contains("free")) return
    if (el.classList.contains("inactive")) return
    if (el_to.classList.contains("free")) return
    if (el_to.classList.contains("inactive")) return
    let person_id = parseFloat(el.getAttribute("person_id"))
    let day_id = parseFloat(el.getAttribute("day_id"))

    let free_from = PERSONS_TABLE_FROM.find(p => p.id === person_id).freedays[day_id]
    if (!free_from) {free_from = PERSONS_TABLE_FROM.find(p => p.id === person_id).sf[day_id]}
    let free_to = PERSONS_TABLE_TO.find(p => p.id === person_id).freedays[day_id]
    if (!free_to) {free_to = PERSONS_TABLE_TO.find(p => p.id === person_id).sf[day_id]}
    if ((free_from !== false) || (free_to !== false)) return
    if (EDITABLE_TABLES.indexOf("Roster-week-table-to") > -1 && !el_to.classList.contains("active")) return

    if (typeof set === "undefined") {
        el.classList.toggle("active")
    } else if (set) {
        el.classList.add("active")
    } else {
        el.classList.remove("active")
    }
    toggleCopyPersonTableToButton(el.getAttribute("person_id"), el.getAttribute("day_id"), set)
    toggleCopyPersonTitleButton(el.getAttribute("person_id"), el.getAttribute("day_id"))
}
toggleCopyPersonTableNameButton = (el) => {
    if (EDITABLE_TABLES.indexOf("Roster-week-table-to") > -1 && !el.classList.contains("active")) return
    let block_tds = document.querySelectorAll(`#Popup.roster-copy-person-table #Roster-week-table-from .Roster-week-td[person_id="${el.getAttribute("person_id")}"]`)
    if (el.classList.contains("active")) { 
        for (let i=0; i< block_tds.length; i++) {
            toggleCopyPersonTableButton(block_tds[i], false)
        }
    } else { 
        for (let i=0; i< block_tds.length; i++) {
            toggleCopyPersonTableButton(block_tds[i], true)
        }
    }
}
toggleCopyPersonTableDayNameButton = (el) => {
    let block_tds = document.querySelectorAll("#Popup.roster-copy-person-table .Roster-week-table-copy-person .Roster-week-td-name")
    let set_active = el.classList.contains("active")
    if (EDITABLE_TABLES.indexOf("Roster-week-table-to") > -1 && !set_active) return

    let block_all_active = document.querySelectorAll("#Popup.roster-copy-person-table table.Roster-week-table-copy-person .active")
    for (let i=0; i<block_all_active .length; i++) block_all_active[i].classList.remove("active")
    if (set_active) {
        el.classList.remove("active")
    } else {
        el.classList.add("active")
        let block_ths = document.querySelectorAll("#Popup.roster-copy-person-table #Roster-week-table-from .Roster-week-th")
        for (let i=0; i<block_ths .length; i++) toggleCopyPersonTableDayButton(block_ths[i])

    }
}
toggleCopyPersonTableDayButton = (el) => {
    if (EDITABLE_TABLES.indexOf("Roster-week-table-to") > -1 && !el.classList.contains("active")) return
    let block_tds = document.querySelectorAll(`#Popup.roster-copy-person-table #Roster-week-table-from .Roster-week-td[day_id="${el.getAttribute("day_id")}"]`)
    if (el.classList.contains("active")) { 
        for (let i=0; i< block_tds.length; i++) {
            toggleCopyPersonTableButton(block_tds[i], false)
        }
    } else { 
        for (let i=0; i< block_tds.length; i++) {
            toggleCopyPersonTableButton(block_tds[i], true)
        }
    }
}


toggleCopyPersonTitleButton = (person_id, day_id) => {
    toggleName = () => {
        if (person_id !== null) {
            let block_from_person      = document.querySelector(`#Roster-week-table-from .Roster-week-tr-${person_id} .Roster-week-td-name`)
            let block_to_person        = document.querySelector(`#Roster-week-table-to .Roster-week-tr-${person_id} .Roster-week-td-name`) 
            if (!block_from_person) return
            if (!block_to_person) return
            let blocks_from_tds_person = document.querySelectorAll(`#Roster-week-table-from tbody .Roster-week-tr-${person_id} .Roster-week-td:not(.free):not(.inactive)`)
            let set_active = true
            for (let i=0; i<blocks_from_tds_person.length; i++) {
                let td_from = blocks_from_tds_person[i]
                if (!td_from.classList.contains("active")) {
                    let day_id = td_from.getAttribute("day_id")
                    let person_id = td_from.getAttribute("person_id")
                    let block_to = document.querySelector(`#Roster-week-table-to .Roster-week-td[day_id="${day_id}"][person_id="${person_id}"]:not(.free):not(.inactive)`)
                    if ((block_to) && (!block_to.classList.contains("active"))) {
                        set_active = false
                        break
                    }
                }
            }
            if (set_active) {
                block_from_person.classList.add("active")
                block_to_person.classList.add("active")
            } else {
                block_from_person.classList.remove("active")
                block_to_person.classList.remove("active")
            }
        }
    }
    toggleDay = () => {
        if (day_id !== null) {
            let block_from_days        = document.querySelector(`#Roster-week-table-from .Roster-week-th[day_id="${day_id}"]`) 
            let block_to_days          = document.querySelector(`#Roster-week-table-to .Roster-week-th[day_id="${day_id}"]`) 
            let blocks_from_tds_days   = document.querySelectorAll(`#Roster-week-table-from .Roster-week-td[day_id="${day_id}"]:not(.free):not(.inactive)`)
            set_active = true
            for (let i=0; i<blocks_from_tds_days.length; i++) {
                let td = blocks_from_tds_days[i]
                if (!td.classList.contains("active")) {
                    let day_id = td.getAttribute("day_id")
                    let person_id = td.getAttribute("person_id")
                    let block_to = document.querySelector(`#Roster-week-table-to .Roster-week-td[day_id="${day_id}"][person_id="${person_id}"]:not(.free):not(.inactive)`)
                    if ((block_to) && (!block_to.classList.contains("active"))) {
                        set_active = false
                        break
                    }
                }
            }
            if (set_active) {
                block_from_days.classList.add("active")
                block_to_days.classList.add("active")
            } else {
                block_from_days.classList.remove("active")
                block_to_days.classList.remove("active")
            }
        }
    }
    toggleName()
    toggleDay()
}

reloadCopyPersonSelects = (year_week_from, year_week_to) => {
   let block_select_from = document.querySelector(".roster-copy-person-table .item-table-from .select-roster")
   let block_select_to = document.querySelector(".roster-copy-person-table .item-table-to .select-roster")
   if (typeof year_week_from === "undefined") { year_week_from = block_select_from.value }
   if (typeof year_week_to === "undefined") { year_week_to = block_select_to.value }

   let options_from = []
   let options_to = []

   loadOption = (block_select, rosters, year_week) => {
      block_select.innerHTML = ""
      rosters.forEach((r, r_id) => {
         let block_roster_option = document.createElement("option")
         if (year_week === r) {block_roster_option.defaultSelected = true}
         block_roster_option.innerHTML = r
         block_roster_option.setAttribute("value", r)
         block_select.appendChild(block_roster_option)
      })
   }
   let rosters_from = [...ROSTERS_YEARWEEK]
   loadOption(block_select_from, rosters_from, year_week_from)
   let rosters_to = [...ROSTERS_YEARWEEK]
   rosters_to = [ getYearWeekNewestAfterWeek(), getYearWeekNewestAfter(), ...rosters_to ]
   loadOption(block_select_to, rosters_to, year_week_to)
}
reloadCopyPersonWeekData = async (year_week, table_id) => {
    showLoading("reloadCopyPersonWeekData")
    let el = document.querySelector(`#${table_id}`)
    let block = el.parentNode
    let block_tds_inactive = el.querySelectorAll(".inactive")
    let shift_check = false

    DATA_LAST_CREATED = undefined
    block.removeChild(el)
    return createBlockRosterTableWeek(year_week, table_id).then(block_table => {
        block_table.classList.add("Roster-week-table-copy-person")
        block.appendChild(block_table)
        renderCopyPersonPopupTitle()
        reloadCopyPersonSelects()
        let remove_classes = [...document.querySelectorAll(".Roster-week-table-copy-person td"), ...document.querySelectorAll(".Roster-week-table-copy-person th")]
        for (i=0; i<remove_classes.length;i++) {
            remove_classes[i].classList.remove("active", "inactive", "hover")
        }
        hideLoading("reloadCopyPersonWeekData")
        return
    })
}
hoverCopyPersonTdOver = (e) => {
    hoverCopyPersonTd(e, "over")
}
hoverCopyPersonTdOut = (e) => {
    hoverCopyPersonTd(e, "out")
}
hoverCopyPersonTd = (e, in_out) => {
   let block_td = e.target.closest("td")
   if (block_td === null) {block_td = e.target.closest("th")}
   if (block_td === null) {return}
   let name
   let day_id = block_td.getAttribute("day_id")
   let person_id = block_td.getAttribute("person_id")
   if (day_id === null) { name = `Roster-week-td-name[person_id="${person_id}"]` }
   else if (person_id === null) { name = `Roster-week-th[day_id="${day_id}"]` }
   else if (day_id !== null && person_id !== null){ name = `Roster-week-td-name-${person_id}-day-${day_id}` }
   else if (block_td.classList.contains("Roster-week-th-name")) {name = "Roster-week-th-name"}
   else return
   let block_tds = document.querySelectorAll(`#Popup.roster-copy-person-table .Roster-week-table-copy-person .${name}`)
   if (in_out === "over") {
      for (let i=0; i<block_tds.length; i++) {block_tds[i].classList.add("hover")}
   } else if (in_out === "out")  {
      for (let i=0; i<block_tds.length; i++) {block_tds[i].classList.remove("hover")}
   }

}
loadCopyPersonWeekData = (year_week, table_id) => {
    let block_table_from = document.querySelector(`#${table_id}`)
    let blocks_set_onclick = block_table_from.querySelectorAll(".Roster-week-td")
    for (let i = 0; i<blocks_set_onclick.length; i++ ) {
        blocks_set_onclick[i].setAttribute("onClick", "toggleCopyPersonTableButton(this)")
        blocks_set_onclick[i].addEventListener('mouseover', hoverCopyPersonTdOver);
        blocks_set_onclick[i].addEventListener('mouseout', hoverCopyPersonTdOut);
    }

    let blocks_set_onclick_name = block_table_from.querySelectorAll(".Roster-week-td-name")
    for (let i = 0; i<blocks_set_onclick_name.length; i++ ) {
        blocks_set_onclick_name[i].setAttribute("onClick", "toggleCopyPersonTableNameButton(this)")
        blocks_set_onclick_name[i].addEventListener('mouseover', hoverCopyPersonTdOver);
        blocks_set_onclick_name[i].addEventListener('mouseout', hoverCopyPersonTdOut);
    }
    let blocks_set_onclick_ths = block_table_from.querySelectorAll(".Roster-week-th")
    for (let i = 0; i<blocks_set_onclick_ths.length; i++ ) {
        blocks_set_onclick_ths[i].setAttribute("onClick", "toggleCopyPersonTableDayButton(this)")
        blocks_set_onclick_ths[i].addEventListener('mouseover', hoverCopyPersonTdOver);
        blocks_set_onclick_ths[i].addEventListener('mouseout', hoverCopyPersonTdOut);
    }
    let block_set_onclick_th_name = block_table_from.querySelector(".Roster-week-th-name")
    block_set_onclick_th_name.setAttribute("onClick", "toggleCopyPersonTableDayNameButton(this)")
    block_set_onclick_th_name.addEventListener('mouseover', hoverCopyPersonTdOver);
    block_set_onclick_th_name.addEventListener('mouseout', hoverCopyPersonTdOut);
}
changeCopyPersonDate = (from_to, direction) => {
    showLoading("changeCopyPersonDate")
    let year_week_is = document.querySelector(`#Popup.roster-copy-person-table .item-table-${from_to} .select-roster`).value
    let year_week
    let year_week_from
    let year_week_to
    if (from_to === "from") {
        let year_weeks_all = [...ROSTERS_YEARWEEK]
        if (direction === "prev") {
            year_week = year_weeks_all[year_weeks_all.indexOf(year_week_is)+1]
            if (typeof year_week === "undefined") {year_week = year_weeks_all[0]}
        } else if (direction === "next") {
            year_week = year_weeks_all[year_weeks_all.indexOf(year_week_is)-1]
            if (typeof year_week === "undefined") {year_week = year_weeks_all[year_weeks_all.length-1]}
        } else {
            year_week = direction
        }
        year_week_from = year_week
    } else if (from_to === "to") {
        if (direction === "prev") {
            year_week = getDateToRosterDate(new Date(new Date(getDateOfISOWeek(year_week_is)).getTime() - 7 * 24 * 60 * 60 * 1000))[0]
            if (year_week < DATE_YEAR_WEEK_OLDEST) {
                hideLoading("changeCopyPersonDate")
                return
            }
        } else if (direction === "next") {
            year_week = getDateToRosterDate(new Date(new Date(getDateOfISOWeek(year_week_is)).getTime() + 7 * 24 * 60 * 60 * 1000))[0]
        } else {
            year_week = direction
        }
        year_week_to = year_week
    }
    getCopyPersonValues(year_week_from, year_week_to).then(() => {
        reloadCopyPersonWeekData(year_week, `Roster-week-table-${from_to}`).then(() => {
            reloadCopyPersonSelects(year_week_from, year_week_to)
            renderCopyPersonPopupTitle()
            if (from_to === "from") {
                loadCopyPersonWeekData(year_week_from, `Roster-week-table-${from_to}`)
            } else {
                loadCopyPersonWeekData(year_week_to, `Roster-week-table-${from_to}`)
            }
            hideLoading("changeCopyPersonDate")
        })
    })
}
getCopyPersonValues = async (year_week_from, year_week_to) => {
    showLoading("getCopyPersonValues")
    getIfTo = () => {
        if (typeof year_week_to !== "undefined") {
            callback = () => {
                DATE_YEAR_WEEK_TABLE_TO = year_week_to
                if (DATE_YEAR_WEEK_TABLE_TO === DATE_YEAR_WEEK) {
                    PERSONS_TABLE_TO = PERSONS_WEEK
                    ROSTER_PERSON_INFOS_TABLE_TO = ROSTER_PERSON_INFOS
                    ROSTER_TABLE_TO = ROSTER
                    hideLoading("getCopyPersonValues")
                    return
                } else if (DATE_YEAR_WEEK_TABLE_TO === DATE_YEAR_WEEK_TABLE_FROM ) {
                    PERSONS_TABLE_TO = PERSONS_TABLE_TO 
                    ROSTER_PERSON_INFOS_TABLE_TO = ROSTER_PERSON_INFOS_TABLE_FROM 
                    ROSTER_TABLE_TO = ROSTER_TABLE_FROM 
                    hideLoading("getCopyPersonValues")
                    return
                } else {
                    return getSortedPersonRosterWeek(1, year_week_to).then(pt => {
                        PERSONS_TABLE_TO = pt
                        return dbGet_roster_info_where_yearweek(year_week_to).then(rpi => {
                            ROSTER_PERSON_INFOS_TABLE_TO = rpi
                            return getDataRosterToRoster(year_week_to).then(rt => {
                                ROSTER_TABLE_TO = rt
                                hideLoading("getCopyPersonValues")
                                return
                            })
                        })
                    })
                }
            }
            if (ROSTERS_YEARWEEK.indexOf(year_week_to) === -1) {
                let get_yw
                if (ROSTERS_YEARWEEK[0] < year_week_to) { get_yw = ROSTERS_YEARWEEK[0]}
                else if (ROSTERS_YEARWEEK[ROSTERS_YEARWEEK.length-1] > year_week_to) { get_yw = ROSTERS_YEARWEEK[ROSTERS_YEARWEEK.length-1]}
                else { get_yw = ROSTERS_YEARWEEK.find(y => y < year_week_to)}
                return dbGet_roster_where_yearweek(get_yw).then(roster_old => {
                    setR = (changes) => {
                        return dbSet_roster(year_week_to, roster_old.time_step, [roster_old.break_60, roster_old.break_90]).then(() => {
                            callA = () => { 
                                return dbGet_rosters_yearweek().then(year_weeks => {
                                    ROSTERS_YEARWEEK = year_weeks
                                    DATE_YEAR_WEEK_NEWEST = ROSTERS_YEARWEEK[0]
                                    DATE_YEAR_WEEK_OLDEST = ROSTERS_YEARWEEK[ROSTERS_YEARWEEK.length-1] 
                                    return callback()
                                })
                            }
                            if (year_week_to < DATE_YEAR_WEEK_OLDEST) { 
                                changes.forEach((c, ci) => dbSet_roster_change_where_yearweek_and_day(year_week_to, c.day_id, c.start, c.end, c.amount).then(() => {
                                    if (ci === changes.length-1) { return callA() }
                                }))
                            } else {
                                return callA()
                            }
                        }) 
                    }
                    if (year_week_to < DATE_YEAR_WEEK_OLDEST) { 
                        return dbGet_roster_changes_where_yearweek(DATE_YEAR_WEEK_OLDEST).then(changes => {
                            return setR(changes)
                        })
                    } else {
                        return setR()
                    }
                })
            } else {
                return callback()
            }
        } else { 
            hideLoading("getCopyPersonValues")
            return 
        }
    }
    if (typeof year_week_from !== "undefined") {
        DATE_YEAR_WEEK_TABLE_FROM = year_week_from
        if (DATE_YEAR_WEEK_TABLE_FROM === DATE_YEAR_WEEK) {
            PERSONS_TABLE_FROM = PERSONS_WEEK
            ROSTER_PERSON_INFOS_TABLE_FROM = ROSTER_PERSON_INFOS
            ROSTER_TABLE_FROM = ROSTER
            return getIfTo()
        } else if (DATE_YEAR_WEEK_TABLE_FROM === DATE_YEAR_WEEK_TABLE_TO ) {
            PERSONS_TABLE_FROM = PERSONS_TABLE_TO 
            ROSTER_PERSON_INFOS_TABLE_FROM = ROSTER_PERSON_INFOS_TABLE_TO 
            ROSTER_TABLE_FROM = ROSTER_TABLE_TO 
            return getIfTo()
        } else {
            return getSortedPersonRosterWeek(1, year_week_from).then(pf => {
                PERSONS_TABLE_FROM = pf
                return dbGet_roster_info_where_yearweek(year_week_from).then(rpi => {
                    ROSTER_PERSON_INFOS_TABLE_FROM = rpi
                    return getDataRosterToRoster(year_week_from).then(rf => {
                        ROSTER_TABLE_FROM = rf
                        return getIfTo()
                    })
                })
            })
        }
    } else {
        return getIfTo()
    }
}
openCopyPersonTablePopup = async (year_week_from, year_week_to) => {
    showLoading("openCopyPersonTablePopup")
    if (typeof year_week_to === "undefined") { year_week_to = DATE_YEAR_WEEK}
    createB = async () => {
        document.body.classList.add("noscroll")
        let block = document.getElementById("Popup")
        block.onclick = (e) => eventListenerClosePopup(e, "copypersonselect")
        block.classList.add("roster-copy-person-table","active")
        let block_container = document.getElementById("Popup-container")

        let block_close = document.createElement("button")
        block_close.setAttribute("onClick", "closeCopyPersonPopupSelect()")
        block_close.classList.add("button-x")
        block_container.appendChild(block_close)

        let block_header = document.createElement("h2")
        block_header.innerHTML = `Schichten übertragen`
        block_container.appendChild(block_header)
        let block_box = document.createElement("div")
        block_box.classList.add("box")

        let block_box_rosters = document.createElement("div")
        addDragToScroll(block_box_rosters)
        block_box_rosters.classList.add("item" , "item-table", "item-table-from")
        let rosters = [...ROSTERS_YEARWEEK]
        let roster_from_id = rosters.indexOf(year_week_to)+1
        if (roster_from_id === rosters.length) {roster_from_id = 0}
        let roster_date = structuredClone(rosters[roster_from_id])

        let block_box_roster_header = document.createElement("div")
        block_box_roster_header.classList.add("item-header")
        let block_roster_select_label = document.createElement("label")
        block_roster_select_label.classList.add("select-roster-label", "chevron-down", "chevron-select")
        let block_roster_select = document.createElement("select")
        block_roster_select.classList.add("select-roster")
        block_roster_select.setAttribute("onchange", `changeCopyPersonDate("from", this.value)`)
        rosters.forEach((r, r_id) => {
            let block_roster_option = document.createElement("option")
            if (roster_date === r) {block_roster_option.defaultSelected = true}
            block_roster_option.innerHTML = r
            block_roster_option.setAttribute("value", r)
            block_roster_select.appendChild(block_roster_option)
        })
        block_roster_select_label.appendChild(block_roster_select)
        block_box_roster_header.appendChild(block_roster_select_label)

        let block_change_date = document.createElement("div")
        block_change_date.classList.add("change-date")
        let block_change_prev = document.createElement("button")
        block_change_prev.setAttribute("onClick", `changeCopyPersonDate("from", "prev")`)
        block_change_prev.setAttribute("title", `Vorherige Woche`)
        block_change_prev.classList.add("chevron-left")
        let block_change_next = document.createElement("button")
        block_change_next.setAttribute("onClick", `changeCopyPersonDate("from", "next")`)
        block_change_next.setAttribute("title", `Vorherige Woche`)
        block_change_next.classList.add("chevron-right")
        block_change_date.appendChild(block_change_prev)
        block_change_date.appendChild(block_change_next)
        block_box_roster_header.appendChild(block_change_date)
        block_box_rosters.appendChild(block_box_roster_header)

        let block_table_from_container = document.createElement("div")
        block_table_from_container .classList.add("container")
        let block_table_from = await createBlockRosterTableWeek(roster_date, "Roster-week-table-from")
        block_table_from.classList.add("Roster-week-table-copy-person")
        block_table_from_container.appendChild(block_table_from)

        block_box_rosters.appendChild(block_table_from_container)
        block_box.appendChild(block_box_rosters)

        let block_box_roster_to = document.createElement("div")
        let block_save = document.createElement("button")
        block_save.innerHTML = "Übertragen"
        block_save.classList.add("button-save")
        block_save.setAttribute("onClick", "transferCopyPersonTable()")
        block_box_roster_to .appendChild(block_save)
        let block_roster_to_container = document.createElement("div")
        block_roster_to_container.classList.add("container")
        addDragToScroll(block_roster_to_container )
        let block_box_to_roster_header = document.createElement("div")
        block_box_to_roster_header.classList.add("item-header")

        let block_edit_shift_button = document.createElement("button")
        block_edit_shift_button.innerHTML = "Tabelle bearbeiten"
        block_edit_shift_button.setAttribute("title", "Hiermit kannst du in der Tabelle die Zeiten ändern.")
        block_edit_shift_button.classList.add("edit-shift")
        block_edit_shift_button.setAttribute("onClick", "this.classList.toggle('active'); toggleTableWeekEditeable('Roster-week-table-to')")
        block_box_to_roster_header.appendChild(block_edit_shift_button)
        let block_to_change_date = document.createElement("div")
        block_to_change_date.classList.add("change-date")
        let block_to_change_prev = document.createElement("button")
        block_to_change_prev.setAttribute("onClick", `changeCopyPersonDate("to", "prev")`)
        block_to_change_prev.setAttribute("title", `Vorherige Woche`)
        block_to_change_prev.classList.add("chevron-left")
        let block_to_change_next = document.createElement("button")
        block_to_change_next.setAttribute("onClick", `changeCopyPersonDate("to", "next")`)
        block_to_change_next.setAttribute("title", `Nächste Woche`)
        block_to_change_next.classList.add("chevron-right")
        block_to_change_date.appendChild(block_to_change_prev)
        block_to_change_date.appendChild(block_to_change_next)
        block_box_to_roster_header.appendChild(block_to_change_date)

        let rosters_to = [...ROSTERS_YEARWEEK]
        rosters_to = [ getYearWeekNewestAfterWeek(), getYearWeekNewestAfter(), ...rosters_to ]
        let block_roster_to_select_label = document.createElement("label")
        block_roster_to_select_label.classList.add("select-roster-label", "chevron-down", "chevron-select")
        let block_roster_to_select = document.createElement("select")
        block_roster_to_select.classList.add("select-roster")
        block_roster_to_select.setAttribute("onchange", `changeCopyPersonDate("to", this.value)`)
        rosters_to.forEach((r, r_id) => {
            let block_roster_to_option = document.createElement("option")
            if (r === DATE_YEAR_WEEK) {block_roster_to_option.defaultSelected = true}
            block_roster_to_option.innerHTML = r
            block_roster_to_option.setAttribute("value", r)
            block_roster_to_select.appendChild(block_roster_to_option)
        })
        block_roster_to_select_label.appendChild(block_roster_to_select)
        block_box_to_roster_header.appendChild(block_roster_to_select_label)
        block_box_roster_to.appendChild(block_box_to_roster_header)

        block_box_roster_to.classList.add("item", "item-table", "item-table-to")
        let block_table_to = await createBlockRosterTableWeek(DATE_YEAR_WEEK, "Roster-week-table-to")
        block_table_to.classList.add("Roster-week-table-copy-person")

        block_roster_to_container.appendChild(block_table_to)
        block_box_roster_to.appendChild(block_roster_to_container)
        block_box.appendChild(block_box_roster_to)

        block_container.appendChild(block_box)

    }
    getCopyPersonValues(year_week_from, year_week_to).then(() => {
        createB().then(() => {
            loadCopyPersonWeekData(year_week_from, "Roster-week-table-from")
            loadCopyPersonWeekData(year_week_to, "Roster-week-table-to")
            renderCopyPersonPopupTitle()
            hideLoading("openCopyPersonTablePopup")
        })
    })
}
closeCopyPersonPopup = () => { 
    closePopup()
}
closeCopyPersonPopupSelect = () => { 
    if (EDITABLE_TABLES.indexOf("Roster-week-table-to") > -1) EDITABLE_TABLES.splice(EDITABLE_TABLES.indexOf("Roster-week-table-to"))
        let year_week = document.querySelector("#Popup.roster-copy-person-table .item-table-to .select-roster").value
    changeDate(getDateOfISOWeek(year_week))
    closePopup()
}
renderCopyPersonPopupTitle = () => {
    let from_yw = DATE_YEAR_WEEK_TABLE_FROM
    let to_yw = DATE_YEAR_WEEK_TABLE_TO
    document.querySelector("#Popup.roster-copy-person-table #Popup-container > h2").innerHTML = `Schichten übertragen von <b>${from_yw}</bold> nach <bold>${to_yw}</bold>`
}
