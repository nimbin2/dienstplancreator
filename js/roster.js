// get Roster Data ROSTER
getActiveRosterData = async (year_week) => {
    if (year_week === DATE_YEAR_WEEK) {
        return ROSTER
    } else if (year_week === DATE_YEAR_WEEK_TABLE_FROM) {
        return ROSTER_TABLE_FROM
    } else if (year_week === DATE_YEAR_WEEK_TABLE_TO) {
        return ROSTER_TABLE_TO
    } else {
        return getDataRosterToRoster(year_week)
    }
}

getDataRosterToRoster = async (year_week) => {
    let roster = ROSTERS.find(ro => ro.year_week === year_week)?.roster
    pushR = (r) => {
        ROSTERS.push({year_week: year_week, roster: [...r]})
    }
    if (typeof roster !== "undefined") {
        return roster
    } else if (ROSTERS_YEARWEEK.indexOf(year_week) === -1) {
        return createDataA(year_week).then(() => {
            return dbGet_roster_active(year_week).then(r => {pushR(r); return r})
        })
    } else {
        return dbGet_roster_active(year_week).then(r => {pushR(r); return r})
    }
}

getRosterBefore = async (d) => {
    let yws = ROSTERS_YEARWEEK
    let r_id = yws.indexOf(DATE_YEAR_WEEK)+d
    if (r_id && r_id < yws.length) {return await getDataRosterToRoster(yws[r_id]) }
}

// create new Roster
createDataA = async (year_week) => {
    if (!year_week) {year_week = DATE_YEAR_WEEK}
    createR = (changes) => {
        return dbSet_roster(year_week, TIME_STEP, [DAYBREAK_1, DAYBREAK_2]).then(() => {
            if (year_week < DATE_YEAR_WEEK_OLDEST) { 
                changes.forEach(c => dbSet_roster_change_where_yearweek_and_day(year_week, c.day_id, c.start, c.end, c.amount))
            }

            return dbGet_rosters_yearweek().then((yws) => {
                ROSTERS_YEARWEEK = yws
                if (year_week === DATE_YEAR_WEEK) {
                    DATE_YEAR_WEEK_NEWEST = ROSTERS_YEARWEEK[0]
                    DATE_YEAR_WEEK_OLDEST = ROSTERS_YEARWEEK[ROSTERS_YEARWEEK.length-1] 
                }
                return yws
            })
        })
    }
    if (year_week < DATE_YEAR_WEEK_OLDEST) { 
        return dbGet_roster_changes_where_yearweek(DATE_YEAR_WEEK_OLDEST).then((changes) => {
            return createR(changes)
        })
    } else {
        return createR()
    }
}

// get Active Roster
getActiveRoster = async (reload) => {
    showLoading("getActiveRoster")
    EDITABLE_ROWS_TOP = await dbGet_roster_editable_rows_top(DATE_YEAR_WEEK)
    EDITABLE_ROWS_BOTTOM = await dbGet_roster_editable_rows_bottom(DATE_YEAR_WEEK)
    EDITABLE_CELLS_RIGHT = await dbGet_roster_editable_cells_right(DATE_YEAR_WEEK)
    ROSTER_PERSON_INFOS = await dbGet_roster_info_where_yearweek(DATE_YEAR_WEEK)
    let yws = await dbGet_rosters_yearweek()
    let roster_data
    if (yws.indexOf(DATE_YEAR_WEEK) > -1) {
        roster_data = await dbGet_roster_where_yearweek(DATE_YEAR_WEEK)
    } else {
        roster_data = await dbGet_roster_where_yearweek(yws[0])
    }
    DAYBREAK_1 = roster_data.break_60
    DAYBREAK_2 = roster_data.break_90
    TIME_STEP  = roster_data.time_step

    callback_1 = () => {
        return getSettings().then(() => {
            if ((EDITABLE_ROW) || (EDITABLE_ROWS_TOP.length > 0)) {
                setEditableRowTrue()
            } else {document.querySelector("#Roster-week-add-editable-row button.row-top").classList.remove("active")}
            if ((EDITABLE_ROW_BOTTOM) ||(EDITABLE_ROWS_BOTTOM.length > 0)) {
                setEditableRowBottomTrue()
            } else {document.querySelector("#Roster-week-add-editable-row button.row-bottom").classList.remove("active")}
            if ((EDITABLE_CELLS_RIGHT.length > 0) || EDITABLE_CELL) {
                EDITABLE_CELL = true; document.querySelector("#Roster-week-add-editable-cell button").classList.add("active")
            } else if (DISPLAY_EDITABLE_CELL.v) {
                setEditableCellTrue()
            } else {document.querySelector("#Roster-week-add-editable-cell button").classList.remove("active")}

            renderPerson()
            let person_list_buttons = document.querySelectorAll("#Person-list-buttons button")
            for (let i=0; i<person_list_buttons.length; i++) {person_list_buttons[i].classList.remove("active")}
            if (person_list_buttons.length > 0) person_list_buttons[0].classList.add("active")

            loadRosterTableWeek()
            return loadRosterTable().then(() => {
                hideLoading("getActiveRoster")
                setZoomLevel(SETTINGS.zoom_web)
                return
            })
        })
    }
    callback_0 = () => {
        if (ROSTERS_YEARWEEK.indexOf(DATE_YEAR_WEEK) === -1) {
            return createDataA().then(() => {return callback_1()})
        } else {
            return callback_1()
        }
    }
    return callback_0()
}

getActiveRosterWeek = async (reload) => {
    showLoading("getActiveRoster")
    EDITABLE_ROWS_TOP = await dbGet_roster_editable_rows_top(DATE_YEAR_WEEK)
    EDITABLE_ROWS_BOTTOM = await dbGet_roster_editable_rows_bottom(DATE_YEAR_WEEK)
    EDITABLE_CELLS_RIGHT = await dbGet_roster_editable_cells_right(DATE_YEAR_WEEK)
    ROSTER_PERSON_INFOS = await dbGet_roster_info_where_yearweek(DATE_YEAR_WEEK)
    let yws = await dbGet_rosters_yearweek()
    let roster_data
    if (yws.indexOf(DATE_YEAR_WEEK) > -1) {
        roster_data = await dbGet_roster_where_yearweek(DATE_YEAR_WEEK)
    } else {
        roster_data = await dbGet_roster_where_yearweek(yws[0])
    }
    DAYBREAK_1 = roster_data.break_60
    DAYBREAK_2 = roster_data.break_90
    TIME_STEP  = roster_data.time_step
    NOWEEKEDIT = true

    callback_1 = () => {
        return getSettings().then(() => {
            if ((DISPLAY_EDITABLE_ROW.v) || (EDITABLE_ROWS_TOP.length > 0)) {
                EDITABLE_ROW = true
            } else {EDITABLE_ROW = false }
            if ((DISPLAY_EDITABLE_ROW_BOTTOM.v) ||(EDITABLE_ROWS_BOTTOM.length > 0)) {
                EDITABLE_ROW_BOTTOM = true
            } else {EDITABLE_ROW_BOTTOM = false}
            if (EDITABLE_CELLS_RIGHT.length > 0) {
                EDITABLE_CELL = true
            } else if (DISPLAY_EDITABLE_CELL.v) {
                EDITABLE_CELL = true
            } else {EDITABLE_CELL = false}

            loadRosterTableWeek()
            hideLoading("getActiveRoster")
        })
    }
    callback_0 = () => {
        if (ROSTERS_YEARWEEK.indexOf(DATE_YEAR_WEEK) === -1) {
            hideLoading("getActiveRoster")
            return
        } else {
            return callback_1()
        }
    }
    return callback_0()
}

// Roster Amount per day
changeTimeAmount = async (el, day_id, direction, ael) => {
    let roster = ROSTER[day_id]
    let blocks_multiple = document.getElementById(`Table-times-thead-tr-${day_id}`).querySelectorAll(".th-amount-container.active")
    let block_this_active = document.getElementById(`Table-times-thead-tr-${day_id}`).getElementsByClassName("th-amount-container")[ael]
    if (!block_this_active.classList.contains("active")) {
        if (blocks_multiple.length > 0) {
            for (i=0; i< blocks_multiple.length; i++) {
                blocks_multiple[i].classList.remove("active")
            }
            blocks_multiple = []
        }
    }

    if (blocks_multiple.length > 0) {
        for (i=0; i< blocks_multiple.length; i++) {
            let block = blocks_multiple[i]
            let block_time = block.parentNode.parentNode
            let time = parseFloat(block_time.getAttribute("time"))
            let t_id = roster.d.map(a => {return a.t}).indexOf(time)
            let amount = roster.d[t_id].a
            let newAmount = amount
            if (direction === "up") {
                if (amount < PERSONS.length) newAmount = amount+1
            } else {
                if (amount > 0) newAmount = amount-1
            }

            ROSTER[day_id].d[t_id].a = newAmount
            block_time.getElementsByClassName("time-amount-max")[0].innerHTML = newAmount

        }
        setTimeAmountTh(day_id)
        let change_times = structuredClone(ROSTER[day_id].d)
        change_times.forEach(data => {data.time = data.t; data.amount = data.a; delete data.t; delete data.a})
        setDataAC(DATE_YEAR_WEEK, day_id, change_times)
        return
    }
    let amount = roster.d[ael].a
    let newAmount = amount
    if (direction === "up") {
        if (amount < PERSONS.length) newAmount = amount+1
    } else {
        if (amount > 0) newAmount = amount-1
    }

    if (amount === newAmount) return

    ROSTER[day_id].d[ael].a = newAmount
    let change_times = structuredClone(ROSTER[day_id].d)
    change_times.forEach(data => {data.time = data.t; data.amount = data.a; delete data.t; delete data.a})
    setDataAC(DATE_YEAR_WEEK, day_id, change_times)
    document.getElementById("Roster-"+day_id).getElementsByClassName("time-amount-max")[ael].innerHTML = newAmount
    setTimeAmountTh(day_id)
}

getPersonAmountForDay = (day_id) => {
	let amount_day = []
	ROSTER[day_id].d.forEach(time => amount_day.push({ time: time.t, is: getPersonAmountForDayTime(day_id, time.t).length, max:  time.a }) )
	return amount_day
}
getPersonAmountForDayTime = (day_id, time) => {
    let shifts = PERSONS.map(p => p.shifts).flat(1).filter(s => s.day_id === day_id)
    let shifts_in_time = []
    shifts.forEach(shift => {
        if (shift.start <= time && shift.end >= time) shifts_in_time.push(shift)
    })
    return shifts_in_time
}

setTimeAmountTh = async (day_id) => {
    for (let id=0; id<ROSTER[day_id].d.length; id++) {
        let el = ROSTER[day_id].d[id]
        let amount = getPersonAmountForDayTime(day_id, el.t).length
        let color_id = Math.round((amount*colors_red_orange_green.length)/ROSTER[day_id].d[id].a)
        let color = colors_red_orange_green[color_id]
        if (color_id >= colors_red_orange_green.length) color = colors_red_orange_green[colors_red_orange_green.length-1]
        if (amount > ROSTER[day_id].d[id].a) color = "#458caf"
        else if (amount === ROSTER[day_id].d[id].a) color = "#61a64d"

        let block_th = document.getElementById("Table-times-thead-tr-"+day_id).querySelector('[time="'+el.t+'"]')

        block_th.setAttribute("style", `background-color: ${color}; border-color: ${color}87;`)
        block_th.getElementsByClassName("time-amount-is")[0].innerHTML = amount+"/"
    }
}


setTimeAmount = async (person_id) => {
    let person = PERSONS.find(p => p.id === person_id)
    for (let day_id=0; day_id<ROSTER.length; day_id++) {
        let blocks_name = document.querySelectorAll(`#Roster-days-container .tr-name-${person_id}`)

        let hours_breaks = await getPersonDayHoursAndBreaks(person_id, day_id)
		let hours = hours_breaks[0]
		let breaks = hours_breaks[1]

		let hours_breaks_a  = await getPersonHoursAndBreaks(person_id)
		let hours_a = hours_breaks_a[0]
		let breaks_a = hours_breaks_a[1]

        let hours_total  = new Promise((res, rej) => {res(getPersonHoursWithFreedays(person_id))})
        hours_total = await hours_total 
        hours_total = parseFloat(hours_total.toFixed(2))

        for (var i = 0; i < blocks_name.length; i++) {
            blocks_name[i].getElementsByClassName("hours-given")[0].innerHTML = hours_a+"/"+hours_total
        }

        document.querySelector(`#Tr-${person_id}-day-${day_id} .hours-today`).innerHTML = hours-person.mpa[day_id]
        document.querySelector(`#Tr-${person_id}-day-${day_id} .break-today`).innerHTML = breaks
        let block_overtime = document.querySelector(`#Tr-${person_id}-day-${day_id} .td-overtime`)
        let overtime = person.overtime
        if (overtime === 0) {block_overtime.classList.add("green"); block_overtime.classList.remove("orange", "red")}
        else if (overtime > 0) {overtime = `+${overtime}`; block_overtime.classList.add("red"); block_overtime.classList.remove("green", "orange")}
        else if (overtime < 0) {block_overtime.classList.add("orange"); block_overtime.classList.remove("green", "red")}
        block_overtime.innerHTML = overtime

        document.querySelector(`#Person-table-tr-${person_id} .td-overtime`).innerHTML = overtime
        setTimeAmountTh(day_id)
    }
}

getBlockTimeTd = (person_id, day_id, time) => { 
    let block_table_row = document.getElementById(`Tr-${person_id}-day-${day_id}`)
    if (!block_table_row) return
    let block_td = block_table_row.querySelector('[time="'+time+'"]')
    return block_td
}

removePersonFromShiftDay = async (person_id, day_id, year_week, noreload) => {
    if (!year_week) { year_week = DATE_YEAR_WEEK}
    if (day_id >= DAYS.length) return
    if (ROSTERS_YEARWEEK.indexOf(year_week) === -1) return
    let shifts = []
    let year_week_set = false
    return dbRemove_shift_where_person_and_year_week_and_day(person_id, year_week, day_id).then(() => {
        if (year_week !== DATE_YEAR_WEEK) return
        if (!noreload) {
            return setActivePerson(person_id).then((person) => {
                return reloadPersonDayData(person_id, day_id, year_week)
            })
        }
        return
    })
}

// get auto shift
getBestShiftStarts = async (person_id, day_id) => {
    let amount_sortet = getPersonAmountForDay(day_id).sort((a, b) => {return (b.max-b.is)-(a.max-a.is) })
    let average = new Promise((res, rej) => {res(getPersonAverageHours(person_id, day_id))})
    average = await average 
    let best = []
    let max_diff = amount_sortet.map(da => (da.max-da.is))[0]
    getMax = (max, is) => {
        let re = max-is
        if (re < 0) {re = (re*max_diff/100)*max_diff}
        else {re = (re*max_diff/100) }
        return re
    }
    ROSTER[day_id].d.forEach(d => {
        max_diff = amount_sortet.map(da => (da.max-da.is))[0]
        let rank = amount_sortet.filter(da => { return da.time >= d.t  && da.time < d.t+average}).map(da => ((getMax(da.max, da.is)*100)/da.max)).reduce((a, b) => a + b, 0)
        best.push({time: d.t, rank: rank})
    })

    return best.sort((a,b) => b.rank-a.rank)
} 
getAutoTimeStart = async (person_id, day_id) => {
    let average = await getPersonAverageHours(person_id, day_id)
    let start = await getBestShiftStarts(person_id, day_id)
    start = start[0].time
    if (start+average > ROSTER[day_id].d[ROSTER[day_id].d.length-1].t) {start = ROSTER[day_id].d[ROSTER[day_id].d.length-1].t-average}
    if (start < ROSTER[day_id].d[0].t) {start = ROSTER[day_id].d[0].t}
    return start
}
/*
autoAddShifts = async (rerun) => {
    showLoading("autoAddShifts")
    let person_without = new Promise((res, rej) => {res(getPersonWithoutShifts())})
    person_without = await person_without 
    if (person_without.length === 0) return
    while (person_without.length > 0) {
        let max_id = person_without.map(p => p[2] === person_without[0][2]).indexOf(false)-1
        if (!max_id >= 0) {max_id = 0}
        let person_without_id = Math.floor(Math.random() * max_id)
        let person = person_without[person_without_id]
        let person_id = person[0]
        let days = person[1]
        for (let di=0; di<days.length;di++) {
            let day_id = days[di]
            let as = new Promise((res, rej) => {res(getAutoTimeStart(person_id, day_id))})
            as = await as
            addNewShiftToRoster(person_id, day_id, as, undefined, undefined, true)
        }
        person_without.splice(person_without_id, 1)
    }
    getActiveRoster().then(() => hideLoading("autoAddShifts"))
}
        */
addExtrashiftToRoster = (person_id, day_id, time_start, start, end) => {
    let prev_duration
    let average
    getD = async () => {
        prev_duration = await getPersonDayHoursAndBreaks(person_id, day_id)
        prev_duration = prev_duration [0]
        average = new Promise((res, rej) => {res(getPersonAverageHours(person_id, day_id))})
        average = await average 
    }
    setD = () => {
        let duration = average-prev_duration-TIME_STEP
        if (duration < 0) {duration = 2}

        let time_end = time_start+duration
        if (time_start < start) {
            if (time_end > start-(TIME_STEP*2)) {time_end = start-(TIME_STEP*2)}
        }
        if (time_start > end) {
            if (time_end > ROSTER[day_id].d[ROSTER[day_id].d.length-1].t) {time_end = ROSTER[day_id].d[ROSTER[day_id].d.length-1].t}
        }
        if (time_end < time_start) { time_end = time_start}
        
        addShift(DATE_YEAR_WEEK, day_id, person_id, time_start, time_end)
    }
    getD().then(() => setD())
}
addShiftToNextRoster = (person_id, day_id, time_start, time_end, should_delete) => {
    let next_yw = getDateToRosterDate(new Date(getDateOfISOWeek(DATE_YEAR_WEEK).getTime() + 7 * 24 * 60 * 60 * 1000))[0]
    ROSTERS_YEARWEEK.indexOf(next_yw === -1) &&
    createDataA(next_yw)
    should_delete && 
    dbRemove_shift_where_person_and_year_week_and_day(person_id, next_yw, day_id).then(() => {
        dbAdd_shift(next_yw, day_id, person_id, time_start, time_end)
    })
}
getShiftEnd = async (person_id, day_id, time_start, year_week) => {
    if (typeof year_week === "undefined") {year_week = DATE_YEAR_WEEK}
    let roster = await getActiveRosterData(year_week)
    let person_average_hours = await getPersonAverageHours(person_id, day_id, year_week)
    if (person_average_hours > 6) person_average_hours = person_average_hours+DAYBREAK_1
    if (person_average_hours > 9) person_average_hours = person_average_hours+DAYBREAK_2
    let time_end = time_start+person_average_hours-TIME_STEP

    if (time_start === roster[day_id].d[0].t && roster[day_id].d[1].t-roster[day_id].d[0].t !== TIME_STEP) {
        time_end = time_end-TIME_STEPS[TIME_STEPS.indexOf(TIME_STEP)-1]
    }
    if (time_end > roster[day_id].d[roster[day_id].d.length-1].t+TIME_STEP) time_end = roster[day_id].d[roster[day_id].d.length-1].t+TIME_STEP

    return time_end
}
setShift = async (year_week, day_id, person_id, shift_id) => {
    showLoading(`setShift-${shift_id}`)
    if (year_week === DATE_YEAR_WEEK) {
        setActivePerson(person_id, year_week).then((persons) => {
            reloadPersonDayData(person_id, day_id)
            hideLoading(`setShift-${shift_id}`)
        })
    }
    if (document.getElementById("Roster-week-table-to")) {
        setActivePerson(person_id, year_week).then((persons) => {
            reloadPersonDayData(person_id, day_id, year_week, "Roster-week-table-to").then(() => {
                hideLoading(`setShift-${shift_id}`)
            })
        })
    }
}
addShift = async (year_week, day_id, person_id, start, end, noreload) => {
    return dbAdd_shift(year_week, day_id, person_id, start, end).then(shift => {
            if ((year_week === DATE_YEAR_WEEK) || (year_week === DATE_YEAR_WEEK_TABLE_TO)) {
            if (!noreload) {
                return setShift(year_week, day_id, person_id, shift.id)
            }
        }
        return shift.shift_id
    })
}
updateShift = async (shift, start, end, noreload) => {
    dbSet_shift_where_id(shift.id, start, end).then(() => {
        if (!noreload) {
            setShift(shift.yearweek, shift.day_id, shift.person_id, shift.id)
        }
    })
}
addNewShiftToRoster = async (person_id, day_id, time_start, time_end, year_week, noreload) => {
    let person = await getActivePersonById(person_id)
    let year_week_set = false
    if (typeof year_week === "undefined") {year_week = DATE_YEAR_WEEK; year_week_set = true}
    let cif = await checkIfPersonDayIsFree(person_id, day_id, year_week)
    if (cif !== false) return

    let roster = await getActiveRosterData(year_week)
    if (typeof time_end === "undefined") {
        time_end = await getShiftEnd(person_id, day_id, time_start, year_week)
    }
    add = () => {
        ROSTERS_YEARWEEK.indexOf(year_week) === -1 && createDataA(year_week)
        return removePersonFromShiftDay(person.id, day_id, year_week, true).then(() => {
            return addShift(year_week, day_id, person_id, time_start, time_end, noreload)
        })
    }
    return add()
}

splitShift = (person_id, day_id, shift_id, time, start, end) => {
    dbRemove_shift_where_id(shift_id).then(() => {
        addShift(DATE_YEAR_WEEK, day_id, person_id, start, time)
        addShift(DATE_YEAR_WEEK, day_id, person_id, time+TIME_STEP, end)
    })
}

modifyShift = (year_week, day_id, shift_id, person_id, time, direction) => {
	showLoading("modifyShift") 
    getActivePersonById(person_id, year_week).then(person => {
        let shifts = person.shifts.filter(s => s.day_id === day_id)
        let shift = shifts.find(s => s.id === shift_id)
        let shift_b = shifts.find(s => s.start !== shift.start)


        if (time < ROSTER[day_id].d[0].t) {time = ROSTER[day_id].d[0].t}
        else if (time > ROSTER[day_id].d[ROSTER[day_id].d.length-1].t) {time = ROSTER[day_id].d[ROSTER[day_id].d.length-1].t}
        if (direction !== 1 && time > shift.end) {
            addNewShiftToRoster(person_id, day_id, time, undefined, year_week)
            return
        }

        if ((typeof shift_b !== "undefined" && time-TIME_STEP === shift_b.end) || (typeof shift_b !== "undefined" && time+TIME_STEP === shift_b.start)) {
            let start
            let end
            let new_shift
            if (time-TIME_STEP === shift_b.end) {
                start = shift_b.start
                end = shift.end
            } else if (time+TIME_STEP === shift_b.start) {
                start = shift.start
                end = shift_b.end
            }
            addNewShiftToRoster(person_id, day_id, start, end, year_week)
        } else if (direction === 1) {
            updateShift(shift, shift.start, time+TIME_STEP)
        } else {
            updateShift(shift, time, shift.end)
        }
        hideLoading("modifyShift")
    })
}

timeHasShift = (time, shifts) => {
    let has_shift = false
    shifts.forEach(shift => {
        if (shift.start <= time && shift.end > time) has_shift = true
    })
    return has_shift
}

createBlockExtraShift = (person, day_id, time, start, end) => {
    let person_id = person.id
    let block_add = document.createElement("button")
    block_add.innerHTML = "+"
    block_add.classList.add("roster-add-extra-shift")
    block_add.setAttribute("title", `${person.name}\nExtra Schicht hinzufügen\n${timeToHHMM(time)}`)
    block_add.setAttribute("onClick", `addExtrashiftToRoster(${person_id}, ${day_id}, ${time}, ${start}, ${end})`)
    return block_add
}

// load editable Roster
addRosterButtonInnerShiftExtendShort = (person_id, day_id, shift_id, time) => {
    getActivePersonById(person_id).then(person => {
        let shift = person.shifts.find(s => s.id === shift_id)
        let start = shift.start
        let end   = shift.end
        if (end-start <= TIME_STEP) return
        let block_td = getBlockTimeTd(person_id, day_id, time) 
        let block_td_container = block_td.getElementsByClassName("container")[0]

        let block_container = document.createElement("div")
        let block_button_shorten = document.createElement("button")
        let block_button_extend = document.createElement("button")

        let block_container_remove = block_td_container.getElementsByClassName("shiftmodify-buttons-container-inner")[0]
        let block_extend_remove = block_td_container.getElementsByClassName("roster-extend-shift")[0]
        if (typeof block_container_remove !== "undefined") block_container_remove.remove()
        if (typeof block_extend_remove !== "undefined") block_extend_remove.remove()

        block_container.classList.add("shiftmodify-buttons-container-inner")

        if (time !== start) {
            block_button_extend.classList.add("chevron-right")
            block_button_extend.setAttribute("onclick", `modifyShift("${DATE_YEAR_WEEK}", ${day_id}, ${shift_id}, ${person_id}, ${time}, 0)`)
            block_button_extend.setAttribute("title", `${person.name}\nSchichtstart verschieben\n${timeToHHMM(time)}`)
            block_container.appendChild(block_button_extend)
        }

        if (time !== end) {
            block_button_shorten.classList.add("chevron-left")
            block_button_shorten.setAttribute("onclick", `modifyShift("${DATE_YEAR_WEEK}", ${day_id}, ${shift_id}, ${person_id}, ${time}, 1)`)
            block_button_shorten.setAttribute("title", `${person.name}\nSchichtende verschieben\n${timeToHHMM(time+TIME_STEP)}`)
            block_container.appendChild(block_button_shorten)
        }

        block_td_container.appendChild(block_container)


        if (time === start) {
            block_button_shorten.setAttribute("style", "width: 100%;")
        } else if (time === end) {
            block_button_extend.setAttribute("style", "width: 100%;")
        }
    })
}

addRosterButtonExtendShift = (person, day_id, shift_id, time, direction) => {
    let person_id = person.id
    let block_td = getBlockTimeTd(person_id, day_id, time) 
    let block_container = block_td.getElementsByClassName("container")[0]
    let block_container_mod = block_container.getElementsByClassName("shiftmodify-buttons-container")[0]

    if (typeof block_container_mod === "undefined") return
    let block_button = document.createElement("button")
    let chevron = "chevron-left"
    let click = `modifyShift("${DATE_YEAR_WEEK}", ${day_id}, ${shift_id}, ${person_id}, ${time}, 0)`
    let title_text = `${person.name}\nSchichtstart verschieben\n${timeToHHMM(time)}`
    if (direction === 1) {
        chevron = "chevron-right"
        click = `modifyShift("${DATE_YEAR_WEEK}", ${day_id}, ${shift_id}, ${person_id}, ${time}, 1)`
        title_text = `${person.name}\nSchichtende verschieben\n${timeToHHMM(time+TIME_STEP)}`
    }

    block_button.classList.add("roster-extend-shift", chevron)
    block_button.setAttribute("title", title_text)
    block_button.setAttribute("onClick", click)
    block_container_mod.appendChild(block_button)
}

addRosterButtonSplitShift = (person, day_id, shift_id, time, start, end) => {
    let person_id = person.id
    let block_td = getBlockTimeTd(person_id, day_id, time)
    let block_td_container = block_td.getElementsByClassName("container")[0]
    let block_remove_button = block_td.getElementsByClassName("container")[0].getElementsByClassName("shift-split")[0]
    if (block_remove_button) block_td_container.removeChild(block_remove_button)

    let block_button = document.createElement("button")
    block_button.classList.add("shift-split", "button-x", "shiftmodify-button-header")

    block_button.setAttribute("title", `${person.name}\nSchicht teilen\n${timeToHHMM(time)}`)
    block_button.setAttribute("onClick", `splitShift(${person_id}, ${day_id}, ${shift_id}, ${time}, ${start}, ${end})`)
    block_td_container.appendChild(block_button)
}

loadEditablePersonDayShift = (person_id, day_id, noWReload) => {
    showLoading("loadEditablePersonDayShift")
    let person = PERSONS.find(p => p.id === person_id)
    let shifts = person.shifts.filter(s => s.day_id === day_id)
	shifts.sort((a, b) => a.start-b.start)
	let shift  = shifts[0]
    if (shift) {
        // remove extra shift buttons
        let block_tr = document.getElementById(`Tr-${person_id}-day-${day_id}`)
        let remove_splits = block_tr.querySelectorAll(".shift-split")
        let remove_adds = block_tr.querySelectorAll(".roster-add-extra-shift")
        let remove_extend = block_tr.querySelectorAll(".roster-extend-shift")
        let removes_mod_inner = block_tr.querySelectorAll(".shiftmodify-buttons-container-inner")
        let removes = [...remove_splits, ...remove_adds, ...removes_mod_inner, ...remove_extend ]
        for (i=0; i<removes.length; i++) {
            removes[i].parentNode.removeChild(removes[i])
        }

        let is_before	= true
        let is_after	= false
        let is_during	= false
        ROSTER[day_id].d.forEach(data => {
            let time = data.t
            let block_td = getBlockTimeTd(person_id, day_id, time)
            let block_container = block_td.querySelector(".container")
            block_td.classList.remove("assigned")
            let has_shift = timeHasShift(time, shifts)
            if (has_shift) {
                is_during   = true
                is_before	= false
                if (is_after) {is_after = false; shift = shifts[1]}
                block_td.classList.add("assigned")
            } else if (is_during) {
                is_during   = false
                is_after    = true
            }
            if (has_shift) {
                block_td.classList.add("assigned")
                addRosterButtonInnerShiftExtendShort(person_id, day_id, shift.id, time)
                if (shifts.length === 1 && time !== shift.start && time !== shift.end-TIME_STEP)
                    addRosterButtonSplitShift(person, day_id, shifts[0].id, time, shifts[0].start, shifts[0].end)
            } else if (is_before) {
                if (time !== shift.start-TIME_STEP && shifts.length === 1) block_container.appendChild(createBlockExtraShift(person, day_id, time, shift.start, shift.end))
                addRosterButtonExtendShift(person, day_id, shift.id, time)
            } else if (is_after) {
                if (time !== shift.end && shifts.length === 1) block_container.appendChild(createBlockExtraShift(person, day_id, time, shift.start, shift.end))
                addRosterButtonExtendShift(person, day_id, shift.id, time, 1)
            } 
        })
    }
    checkIfPersonDayIsFree(person_id, day_id).then(check_if_free => {
        let h_mpa = check_if_free ? 0 : person.mpa[day_id]
        if (h_mpa === 0) {h_mpa = ""}
        let block_mpa = document.querySelector(`#Tr-${person_id}-day-${day_id} .hours-mpa`)
        if (block_mpa) { block_mpa.innerHTML = `<div>${h_mpa}</div>`}
    })
    hideLoading("loadEditablePersonDayShift")
}

loadEditableDataIntoRosterTable = (el, day_id) => {
    showLoading("loadEditableDataIntoRosterTable")
    window.onmousemove = (e) => eventListenerEditRosterDay(e, day_id)
    el.classList.add("d-none")
    let block = document.querySelector(`#Roster-${day_id}`)
    if (block.classList.contains("editable")) {
        hideLoading("loadEditableDataIntoRosterTable")
        return
    }
    block.classList.add("editable")

    PERSONS.forEach(person => {
        loadEditablePersonDayShift(person.id, day_id)
    })
    hideLoading("loadEditableDataIntoRosterTable")
}

getShiftTimeText = (shift, day_id, table_id) => {
    if (typeof table_id === "undefined") {table_id = "Roster-week-table"}
    let shift_start = shift.start
    let shift_end = shift.end

    let text_start = timeToHHMM(shift_start)
    if (text_start.length === 4) {text_start = " "+text_start}
    let text_end = timeToHHMM(shift_end)
    if (text_end.length === 4) {text_end = " "+text_end}
    if (EDITABLE_TABLES.indexOf(table_id) > -1) {
        return `<input type="time" title="Schichtstart ändern" required onfocusout='modifyShift("${shift.yearweek}", ${day_id}, ${shift.id}, ${shift.person_id}, hhMMToTime(this.value), 0)' value="${timeToFullHHMM(shift_start)}" class="start" time="${shift_start}"><p> - </p><input type="time" title="Schichtende ändern" required onfocusout='modifyShift("${shift.yearweek}", ${day_id}, ${shift.id}, ${shift.person_id} , hhMMToTime(this.value)-TIME_STEP, 1)' value="${timeToFullHHMM(shift_end)}" class="end" time="${shift_end}">`
    } else {
        return `<p class="start" time="${shift_start}">${text_start}</p><p> - </p><p class="end" time="${shift_end}">${text_end}</p>`
    }
}


// reload Person data
reloadPersonData = (person_id, year_week, table_id) => {
    showLoading(`reloadPersonData${person_id}`)
    DAYS.forEach((day, day_id) => {
        reloadPersonDayData(person_id, day_id, year_week, table_id).then(() => {
            hideLoading(`reloadPersonData${person_id}`)
        })
    })
}

reloadPersonDayData = async (person_id, day_id, year_week, table_id) => {
    showLoading(`reloadPersonDayData-${person_id}-${day_id}`)
    if (!year_week) {year_week = DATE_YEAR_WEEK}
    if (!table_id) {table_id = "Roster-week-table"}
    getActivePersonById(person_id, year_week).then(person => {
    // set week
        if (year_week === DATE_YEAR_WEEK && table_id !== "Roster-week-table") {
            renderRosterTableWeekPersonDay(person, day_id, year_week, document.querySelector(`#Roster-week-table .Roster-week-td-name-${person_id}-day-${day_id}`), table_id)
        }
        renderRosterTableWeekPersonDay(person, day_id, year_week, document.querySelector(`#${table_id} .Roster-week-td-name-${person_id}-day-${day_id}`), table_id).then(() => {
    // set week hours and breaks
            let block_name = document.querySelector(`#${table_id} .Roster-week-tr-${person_id} .Roster-week-td-name`)
            if (!block_name) {hideLoading(`reloadPersonDayData-${person_id}-${day_id}`); return}
            let block_td_hours = block_name.querySelector(".hours")
            let block_td_breaks = block_name.querySelector(".breaks")
            getPersonHoursAndBreaks(person_id, year_week).then(hours_breaks_all => {
                let breaks_all = hours_breaks_all[1]
                getPersonHoursWithFreedays(person_id, year_week).then(hours_total => {
                    hours_total = parseFloat(hours_total.toFixed(2))
                    block_td_hours.innerHTML = hours_breaks_all[0]+"/"+hours_total
                    block_td_breaks.innerHTML = hours_breaks_all[1]
                })
            })
        })
        if (year_week === DATE_YEAR_WEEK) {
    // set Person Table row
            renderPersonTableRow(person_id)
    // set roster
            createBlockRosterTablePersonRow(person, ROSTER[day_id], day_id, document.querySelector(`#Tr-${person_id}-day-${day_id}`)).then(() => {
// set roster hours and breaks
                setTimeAmount(person_id)
                loadEditablePersonDayShift(person_id, day_id, true)
                hideLoading(`reloadPersonDayData-${person_id}-${day_id}`)
            })
        } else {
            hideLoading(`reloadPersonDayData-${person_id}-${day_id}`)
        }
    })
}

loadTableWeekPersonData = async (person_id, year_week, table_id) => {
    showLoading(`loadTableWeekPersonData-${person_id}`)
    if (typeof year_week === "undefined") { year_week = DATE_YEAR_WEEK}
    if (typeof table_id === "undefined") { table_id = "Roster-week-table"}

    let person = await getActivePersonById(person_id, year_week)
    let block_table = document.querySelector(`#${table_id}`)
    if (EDITABLE_TABLES.indexOf(table_id) > -1)
        block_table.classList.add("Roster-week-editable")

    for (let day_id=0; day_id<DAYS.length; day_id++) {
        renderRosterTableWeekPersonDay(person, day_id, year_week, document.querySelector(`#${table_id} .Roster-week-td-name-${person_id}-day-${day_id}`), table_id).then(() => {
            if (day_id === DAYS.length-1) hideLoading(`loadTableWeekPersonData-${person_id}`)
        })
    }
}

rosterWeekDisplayOvertime = (el) => {
    if (DISPLAY_OVERTIME) {
        el.classList.remove("active")
        dbSet_settings_overtime_default(false)
        DISPLAY_OVERTIME = false
    } else {
        el.classList.add("active")
        dbSet_settings_overtime_default(true)
        DISPLAY_OVERTIME = true
    }
    loadRosterTableWeek()
}
rosterWeekAddEditableRow = (el) => {
    if (EDITABLE_ROW) {
        el.classList.remove("active")
        EDITABLE_ROW = false
        dbRemove_roster_editable_rows_top(DATE_YEAR_WEEK)
        EDITABLE_ROWS_TOP = []
    } else {
        el.classList.add("active")
        EDITABLE_ROW = true
        EDITABLE_ROWS_TOP = []
        //for (let i=0; i<6; i++) {EDITABLE_ROWS_TOP.push({id: i.toString(), yearweek: DATE_YEAR_WEEK, text: ''})}
    }
    loadRosterTableWeek()
}
rosterWeekAddEditableRowBottom = (el) => {
    if (EDITABLE_ROW_BOTTOM) {
        el.classList.remove("active")
        EDITABLE_ROW_BOTTOM = false
        dbRemove_roster_editable_rows_bottom(DATE_YEAR_WEEK)
        EDITABLE_ROWS_BOTTOM = []
    } else {
        el.classList.add("active")
        EDITABLE_ROW_BOTTOM = true
        EDITABLE_ROWS_BOTTOM = []
        //for (let i=0; i<6; i++) {EDITABLE_ROWS_BOTTOM.push({id: i.toString(), yearweek: DATE_YEAR_WEEK, text: ''})}
    }
    
    loadRosterTableWeek()
}
rosterWeekAddEditableCell = (el) => {
    if (EDITABLE_CELL) {
        el.classList.remove("active")
        EDITABLE_CELL = false
        dbRemove_roster_editable_cells_right(DATE_YEAR_WEEK)
        EDITABLE_CELLS_RIGHT = []
        loadRosterTableWeek()
    } else {
        setEditableCellTrue()
        dbGet_roster_editable_cells_right(DATE_YEAR_WEEK).then(ec => {
            EDITABLE_CELLS_RIGHT = ec
            loadRosterTableWeek()
        })
        /*EDITABLE_CELLS_RIGHT = []
        EDITABLE_CELLS_RIGHT.push({id: "i", yearweek: DATE_YEAR_WEEK, text: ""})
        PERSONS.forEach(person => {
            EDITABLE_CELLS_RIGHT.push({id: person.id, yearweek: DATE_YEAR_WEEK, text: ""})
        })*/
    }
}
setEditableCell = (cell, id, text) => {
    id = id.toString()
    if      (cell === "row_top")    dbSet_roster_editable_rows_top_where_key(DATE_YEAR_WEEK, id, text)
    else if (cell === "row_bottom") dbSet_roster_editable_rows_bottom_where_key(DATE_YEAR_WEEK, id, text)
    else if (cell === "cell_right") dbSet_roster_editable_cells_right_where_key(DATE_YEAR_WEEK, id, text)
}
renderRosterTableWeekPersonDay = async (person, day_id, year_week, block_td, table_id) => {
    if (!block_td) {return}
    block_td.innerHTML = ""
    block_td.classList.remove("v-bottom", "free", "v-bottom")
    let shifts = person.shifts.filter(s => s.day_id === day_id) 
    let person_id = person.id
// set info
    let info_set = false
    setInfo = async (person_id, day_id, block_td) => {
        if (info_set) return
        block_info = document.createElement("div")
        block_info.classList.add("info")
        let info
        if (year_week === DATE_YEAR_WEEK) {
            info = ROSTER_PERSON_INFOS.find(i => i.day_id === day_id && i.id === person_id.toString())?.text
        } else if (year_week === DATE_YEAR_WEEK_TABLE_FROM) {
            info = ROSTER_PERSON_INFOS_TABLE_FROM.find(i => i.day_id === day_id && i.id === person_id.toString())?.text
        } else if (year_week === DATE_YEAR_WEEK_TABLE_TO) {
            info = ROSTER_PERSON_INFOS_TABLE_TO.find(i => i.day_id === day_id && i.id === person_id.toString())?.text
        } else {
            info = await dbGet_roster_info_where_yearweek_and_day_and_person(year_week, day_id, person_id)
        }
        if (typeof info !== "undefined") {
            let block_info_text = document.createElement("div")
            block_info_text.innerHTML = info
            block_info.appendChild(block_info_text)
            block_td.appendChild(block_info) 
        } else {
            block_td.classList.remove("v-bottom")
        }
        info_set = true
    }
// set free
    let ch_free = await checkIfPersonDayIsFree(person_id, day_id, year_week)
    if (ch_free) {
        block_td.classList.add("free")
        let block_free = document.createElement("div")
        block_free.classList.add("free")
        let block_time = document.createElement("p")

        block_time.classList.add("time")
        block_time.innerHTML = ch_free
        block_free.appendChild(block_time)
        block_td.appendChild(block_free)
        if (ch_free === dbGet_settings_label_cut(2)) {
            let block_duration = document.createElement("p")
            block_duration.classList.add("duration")
            //let duration = await getPersonDayHoursAndBreaks(person_id, day_id, year_week)[0]
            block_td.appendChild(block_duration)
        }
        setInfo(person_id, day_id, block_td)
        return
    } else {
        block_td.classList.remove("free")
    }
// set empty shift
    if (shifts.length === 0) {
        block_td.classList.add("no-shift")
        block_td.classList.add("v-bottom")
        setInfo(person_id, day_id, block_td)
        return
    }
// set shift
    let block_td_container = document.createElement("div")
    block_td.appendChild(block_td_container)
    let block_time_container = document.createElement("div")
    if (EDITABLE_TABLES.indexOf(table_id) > -1) {
        getAutoTimeStart(person_id, day_id).then(auto_start => {
            if (shifts.length === 0) block_time_container.setAttribute("onClick", `addNewShiftToRoster(${person_id}, ${day_id}, ${auto_start}, undefined, "${year_week}")`)
        })
    }
    block_time_container.classList.add("time")
    block_td_container.classList.add("container")
    shifts.sort((a, b) => {
        return a.start - b.start;
    });

    let title_shift_text = person.name
    shifts.forEach((shift, shift_id) => {
        let block_time = document.createElement("div")
        let shift_text = getShiftTimeText(shift, day_id, table_id)
        block_time.innerHTML = shift_text
        block_time_container.appendChild(block_time)
    })
    block_td_container.appendChild(block_time_container)
// set hours
    getPersonDayHoursAndBreaks(person_id, day_id, year_week).then(hours_breaks => {
        let duration = hours_breaks[0].toString()
        duration = duration-person.mpa[day_id]
        if (Math.floor(hours_breaks[0]).toString().length === 1) {duration = " "+duration}
        let block_duration = document.createElement("p")
        block_duration.classList.add("duration")
        block_duration.setAttribute("title", "Stunden")
        block_duration.innerHTML = parseFloat(duration) === 0 ? "" : duration
        block_td_container.appendChild(block_duration)
// set break
        let block_break = document.createElement("p")
        let break_day = hours_breaks[1]
        block_break.classList.add("break")
        block_break.setAttribute("title", "Pause")
        if (break_day < 10) {break_day = ` ${break_day} `}
        block_break.innerHTML = parseFloat(duration) === 0 ? "" : break_day
        block_td_container.appendChild(block_break)
    })

// set mpa
    let block_mpa = document.createElement("div")
    let block_mpa_title = document.createElement("div")
    let block_mpa_value = document.createElement("div")
    if (person.mpa[day_id] > 0) {
        if (EDITABLE_TABLES.indexOf(table_id) > -1) {
            block_mpa_value = document.createElement("input")
            block_mpa_value.setAttribute("value", person.mpa[day_id])
            block_mpa_value.setAttribute("title", `${getRenames("m").a} ändern.`)
            block_mpa_value.setAttribute("type", `number`)
            block_mpa_value.setAttribute("step", `0.25`)
            block_mpa_value.setAttribute("onchange", `addMpaToday(${person_id}, ${day_id}, this.value)`)
        } else {
            block_mpa_value.innerHTML = person.mpa[day_id]
        }
        block_mpa_title.innerHTML = getRenames("m").a
    } else {
        if (EDITABLE_TABLES.indexOf(table_id) > -1) {
            block_mpa.setAttribute("onClick", `showLoading("addMpaToday"); window.setTimeout(() => {addMpaToday(${person_id}, ${day_id}, 1); hideLoading("addMpaToday")},50)`)
            block_mpa.setAttribute("title", `${getRenames("m").a} mit 1h für diesen Tag hinzufügen.`)
        }
    }
    block_mpa.classList.add("mpa")
    block_mpa.appendChild(block_mpa_title)
    block_mpa.appendChild(block_mpa_value)
    block_td_container.appendChild(block_mpa)
// set shift label
    let label_sl = person.sl[day_id]
    if (label_sl !== false) {
        block_td_container.style = 'grid-template-areas: "time time time time" "break mpa label duration";'
        let block_sl = document.createElement("div")
        block_sl.classList.add("label")
        block_sl.innerHTML = dbGet_shift_label_cut(label_sl)
        block_td_container.appendChild(block_sl)
    }

    setInfo(person_id, day_id, block_td)
}

createBlockRosterTableWeek = async (year_week, table_id) => {
    if (typeof table_id === "undefined") { 
        table_id = "Roster-week-table"
    }
    if (typeof year_week === "undefined") { 
        year_week = DATE_YEAR_WEEK
    }
    let date = getDateOfISOWeek(year_week)

    let block_table = document.createElement("table")
    block_table.setAttribute("id", table_id)
    if (EDITABLE_TABLES.indexOf(table_id) > -1) block_table.classList.add("Roster-week-editable")

    let block_thead = document.createElement("thead")
    let block_thead_row = document.createElement("tr")
    let block_th = document.createElement("th")
    block_th.classList.add("Roster-week-th-name")
    let block_th_name = document.createElement("p")
    block_th_name.innerHTML = "Name"
    block_th.appendChild(block_th_name)
    block_thead_row.appendChild(block_th)

    let roster = await getActiveRosterData(year_week)
    roster.forEach((roster, day_id) => {
        let day_date = new Date(date)
        day_date.setDate(day_date.getDate() - (day_date.getDay() + 6) % 7 + day_id)

        let block_th = document.createElement("th")
        let block_th_day = document.createElement("p")
        let block_th_day_date = document.createElement("p")

        block_th.classList.add("Roster-week-th")
        block_th.setAttribute("day_id", day_id)
        block_th_day.innerHTML = roster.n
        block_th_day_date.innerHTML = day_date.toLocaleDateString('de', {day: '2-digit', month: '2-digit', year: '2-digit'})
        block_th.appendChild(block_th_day)
        block_th.appendChild(block_th_day_date)
        block_thead_row.appendChild(block_th)
    })
    if (EDITABLE_CELL) {
        let block_th_cell = document.createElement("th")
        block_th_cell.classList.add("td-editable-cell", `Roster-week-td-editable-cell-i`)
        if (!NOWEEKEDIT) block_th_cell.setAttribute("contenteditable", "true")
        block_th_cell.addEventListener('focusout', (e) => setEditableCell("cell_right", "i", e.target.innerHTML))
        if (EDITABLE_ROW) block_th_cell.setAttribute("rowspan", "2")
        block_th_cell.innerHTML = EDITABLE_CELLS_RIGHT.find(c => c.id === "i")?.text || ""
        block_thead_row.appendChild(block_th_cell)
    }

    block_thead.appendChild(block_thead_row)

    let block_tbody = document.createElement("tbody")
    addEmptyRow = () => {
        let block_tbody_row = document.createElement("tr")
        block_tbody_row.classList.add("tr-empty")
        let block_td = document.createElement("td")
        if (EDITABLE_CELL) {
            block_td.setAttribute("colspan", DAYS.length+2)
        } else {
            block_td.setAttribute("colspan", DAYS.length+1)
        }
        block_tbody_row.appendChild(block_td)
        block_tbody.appendChild(block_tbody_row)
    }
    if (table_id === "Roster-week-table" && EDITABLE_ROW) {
        let block_thead_row_1 = document.createElement("tr")
        block_thead_row_1.classList.add("tr-editable")
        for (let i=0; i<6; i++) {
            let block_th_er = document.createElement("th")
            block_th_er.setAttribute("id", `Roster-week-th-editable-${i}`)
            if (!NOWEEKEDIT) block_th_er.setAttribute("contenteditable", `true`)
            block_th_er.addEventListener('focusout', (e) => setEditableCell("row_top", i, e.target.innerHTML))
            block_th_er.innerHTML = EDITABLE_ROWS_TOP.find(c => c.id === i.toString())?.text || ""
            block_thead_row_1.appendChild(block_th_er)
        }
        block_thead.appendChild(block_thead_row_1)
        addEmptyRow()
    }
    block_table.appendChild(block_thead)


    let sort_d = false
    if ((SETTINGS.sort_week.indexOf("d-d") > -1) || (SETTINGS.sort_week.indexOf("d-u") > -1)) {sort_d = true}
    let person_week
    if (year_week === DATE_YEAR_WEEK) {
        person_week = PERSONS_WEEK
    } else if (year_week === DATE_YEAR_WEEK_TABLE_FROM) {
        person_week = PERSONS_TABLE_FROM
    }  else if (year_week === DATE_YEAR_WEEK_TABLE_TO) {
        person_week = PERSONS_TABLE_TO
    } else {
        person_week = await getSortedPersonRosterWeek(1, year_week)
    }
    let sort_d_c = person_week[0].department
    if (typeof sort_d_c === "undefined") return
    for (let pw=0; pw<person_week.length; pw++) {
        let person = person_week[pw]
        if (sort_d && sort_d_c !== person.department) {addEmptyRow(); sort_d_c = person.department}
        let person_id = person.id
        let block_tbody_row = document.createElement("tr")
        let block_td = document.createElement("td")
        let block_td_container = document.createElement("div")
        let block_td_name = document.createElement("p")
        let block_td_overtime = document.createElement("p")
        let block_td_hours = document.createElement("p")
        let block_td_breaks = document.createElement("p")
        block_td.classList.add("Roster-week-td-name")
        block_td.setAttribute("person_id", person_id)
        block_td_name.innerHTML = person.name
        block_td_overtime.classList.add("overtime", "font-number")

        let overtime_t = getOvertimeTitleText(person.overtime, person.name)
        block_td_overtime.setAttribute("title", overtime_t)
        block_td_hours.classList.add("hours", "font-number")
        block_td_hours.setAttribute("title", "Stunden insgesamt")
        block_td_breaks.classList.add("breaks", "font-number")
        block_td_breaks.setAttribute("title", "Pause insgesamt")

        block_td_container.classList.add("td-name")
        block_td_container.appendChild(block_td_name)
        block_td_container.appendChild(block_td_overtime)
        block_td_container.appendChild(block_td_hours)
        block_td_container.appendChild(block_td_breaks)
        block_td.appendChild(block_td_container)
        block_tbody_row.appendChild(block_td)
        block_tbody_row.classList.add("Roster-week-tr-"+person_id)
        block_tbody_row.setAttribute("person_id", person_id)

// set hours and breaks
        let hours_breaks_all = await getPersonHoursAndBreaks(person_id, year_week)
		let breaks_all = hours_breaks_all[1]
		let hours_total = new Promise((res, rej) => {res(getPersonHoursWithFreedays(person_id, year_week))})
		hours_total = await hours_total 
		hours_total = parseFloat(hours_total.toFixed(2))
		block_td_hours.innerHTML = hours_breaks_all[0]+"/"+hours_total
		block_td_breaks.innerHTML = hours_breaks_all[1]

// set overtime
		if (DISPLAY_OVERTIME) {
			block_td_overtime.innerHTML = person.overtime
		}   

        for (let day_id=0; day_id<DAYS.length; day_id++) {
            block_td = document.createElement("td")
            block_td.classList.add("Roster-week-td", `Roster-week-td-name-${person_id}-day-${day_id}`)
            block_td.setAttribute("person_id", person_id)
            block_td.setAttribute("day_id", day_id)
            block_tbody_row.appendChild(block_td)
            renderRosterTableWeekPersonDay(person, day_id, year_week, block_td, table_id)

        }
        if (table_id === "Roster-week-table" && EDITABLE_CELL) {
            let block_td_cell = document.createElement("td")
            block_td_cell.classList.add("td-editable-cell", `Roster-week-td-editable-cell-${person_id}`)
            if (!NOWEEKEDIT) block_td_cell.setAttribute("contenteditable", "true")
            block_td_cell.addEventListener('focusout', (e) => setEditableCell("cell_right", person_id, e.target.innerHTML))
            block_td_cell.innerHTML = EDITABLE_CELLS_RIGHT.find(c => c.id === person_id.toString())?.text || ""
            block_tbody_row.appendChild(block_td_cell)
        }
        block_tbody.appendChild(block_tbody_row)
    }

    if (EDITABLE_ROW_BOTTOM) {
        addEmptyRow()
        let block_tr_editable = document.createElement("tr")
        block_tr_editable.classList.add("tr-editable")
        for (let i=0; i<6; i++) {
            let block_td_ediatable = document.createElement("td")
            block_td_ediatable.setAttribute("id", `Roster-week-td-bottom-editable-${i}`)
            if (!NOWEEKEDIT) block_td_ediatable.setAttribute("contenteditable", `true`)
            block_td_ediatable.addEventListener('focusout', (e) => setEditableCell("row_bottom", i, e.target.innerHTML))
            block_td_ediatable.innerHTML = EDITABLE_ROWS_BOTTOM.find(c => c.id === i.toString())?.text || ""
            block_tr_editable.appendChild(block_td_ediatable)
        }
        block_tbody.appendChild(block_tr_editable)
    }
    block_table.appendChild(block_tbody)

    return block_table
}

loadRosterTableWeekData = async (year_week, table_id) => {
    if (PERSONS.length === 0) return
    showLoading("loadRosterTableWeekData")
    if (typeof year_week === "undefined") { year_week = DATE_YEAR_WEEK }
    if (typeof table_id === "undefined") {
        table_id = "Roster-week-table"
    }
    let person_all
    if (year_week === DATE_YEAR_WEEK) {
        person_all = PERSONS
    } else if (year_week === DATE_YEAR_WEEK_TABLE_TO) {
        person_all = PERSONS_TABLE_TO
    }  else if (year_week === DATE_YEAR_WEEK_TABLE_FROM) {
        person_all = PERSONS_TABLE_FROM
    } else {
        person_all = dbGet_persons_active_where_yearweek(year_week)
    }
    for (let i=0; i<person_all.length; i++) {
        let person_id = person_all[i].id
        loadTableWeekPersonData(person_id, year_week, table_id).then(() => {
            if (i === person_all.length-1) {
                hideLoading("loadRosterTableWeekData")
            }
        })
    }
    DAYS.forEach((day, day_id) => {
        let day_date = new Date(getIsoStringFromDay(day_id, year_week))
        document.querySelectorAll(`#${table_id} .Roster-week-th`)[day_id].querySelectorAll("p")[1].innerHTML = day_date.toLocaleDateString('de', {day: '2-digit', month: '2-digit', year: '2-digit'})
    })
}

loadRosterTableWeek = () => {
    if (PERSONS.length === 0) return
    let block_roster_container = document.getElementById("Roster-week-container")
    let block_header = document.createElement("h2")
    let block_print = document.createElement("button")
    block_roster_container.innerHTML = ""

    block_header.innerHTML = "Woche "+DATE_WEEK
    block_print.innerHTML = "Drucken"
    block_print.classList.add("button-print")
    block_print.setAttribute("onClick", `printTable("Roster-week-container", ${DATE_YEAR_WEEK})`)
    block_roster_container.appendChild(block_header)
    block_roster_container.appendChild(block_print)


    createB = async () => {
        let create_block = new Promise((res, rej) => {res(createBlockRosterTableWeek())})
        create_block = await create_block 
        block_roster_container.appendChild(create_block )
    } 
    createB().then(() => {
        let block_week_info = document.createElement("div")
        block_week_info.setAttribute("id", "Roster-week-info")
        block_week_info.innerHTML = ""
        let info = ROSTER_PERSON_INFOS.find(i => i.day_id === 999 && i.id === "all")?.text
        if (typeof info !== "undefined") { 
            let block_week_info_text = document.createElement("div")
            block_week_info_text.innerHTML = info
            block_week_info.appendChild(block_week_info_text)
            document.querySelector("#Roster-week-week-info").classList.add("active")
            document.getElementById("Set-week-info-container").querySelector("textarea").value = info
            document.getElementById("Set-week-info-container").classList.remove("d-none")
        }
        block_roster_container.appendChild(block_week_info)
    })
}


eventListenerEditRosterDay = (event, day_id) => {
    let block_container = document.getElementById(`Roster-${day_id}`)
    if (!block_container.contains(event.target)) {
        let button = block_container.querySelector(".button-edit-table")
        button.classList.remove("d-none")
        window.onmousemove = null
    }

}


createDaysOption = (day_id) => {
    let blocks = []
    DAYS.forEach((day, d_id) => {
        if (day_id === d_id) return
        let block = document.createElement("option")
        block.value = d_id
        block.innerHTML = day
        blocks.push(block)
    })
    return blocks
}

copyRosterDay = async (day_id, from_id) => {
    showLoading("copyRosterDay")
    setS = async (shifts, did, yw) => {
        let noreload = shifts.length === 1 ? false : true
        if (yw !== DATE_YEAR_WEEK) {noreload = true}
        if (shifts.length === 0) return
        return addNewShiftToRoster(shifts[0].person_id, did, shifts[0].start, shifts[0].end, yw, noreload).then(() => {
            if (shifts.length > 1) { return addShift(yw, did, shifts[1].person_id, shifts[1].start, shifts[1].end) }
            return
        })
    }
	asyncMain = () => {
		let new_roster_data 
		let year_week
		let year_week_to = DATE_YEAR_WEEK
		if (day_id === "all") {
			year_week = DATE_YEAR_WEEK
			from_id = parseFloat(from_id)
            setAs = async() => { 
                for (let p = 0; p<PERSONS.length; p++) {
                    let person = PERSONS[p]
                    let person_id = person.id
                    let shifts = person.shifts.filter(s => s.day_id === from_id)
                    for (let d_id=0; d_id<DAYS.length;d_id++) {
                        if (d_id === from_id) { 
                            if (p === PERSONS.length-1) { hideLoading("copyRosterDay")}
                            continue 
                        }
                        checkIfPersonDayIsFree(person_id, d_id).then(cf => {
                            if (cf === false) {
                                setS(shifts, d_id, year_week_to).then(() => {
                                    if (p === PERSONS.length-1) { hideLoading("copyRosterDay")}
                                })
                            } else if (p === PERSONS.length-1) { hideLoading("copyRosterDay")}
                        })
                    }
                }
            }
            setAs()
        } else {
			if (from_id === "week_before") {
				year_week = DATE_YEAR_WEEK_BEFORE
				from_id = day_id
                day_id = parseFloat(day_id)
			} else if (from_id === "week_before_week") {
				year_week = DATE_YEAR_WEEK_BEFORE
				from_id = day_id
                day_id = parseFloat(day_id)
			} else if (day_id === "next"){
				year_week = DATE_YEAR_WEEK
                year_week_to = DATE_YEAR_WEEK_AFTER
                from_id = parseFloat(from_id)
                day_id = from_id 
            } else {
				year_week = DATE_YEAR_WEEK
				from_id = parseFloat(from_id)
                day_id = parseFloat(day_id)
			}


            loopP = (persons_yw) => {
                for (let p=0; p<persons_yw.length; p++) {
                    let shifts = persons_yw[p].shifts.filter(s => s.day_id === from_id)
                    checkIfPersonDayIsFree(persons_yw[p].id, day_id, year_week_to).then(cf => {
                        if (cf === false) {
                            setS(shifts, day_id, year_week_to).then(() => {
                                if (p === persons_yw.length-1) { hideLoading("copyRosterDay")}
                            })
                        } else if (p === persons_yw.length-1) { hideLoading("copyRosterDay")}
                    })
                }
            }
            if (ROSTERS_YEARWEEK.indexOf(year_week_to) === -1) {
                createDataA(year_week_to).then(() => {
                    loopP(PERSONS)
                })
            } else if (DATE_YEAR_WEEK === year_week) {
                loopP(PERSONS)
            } else {
                dbGet_persons_active_where_yearweek(year_week).then(persons_yw => loopP(persons_yw))
            }
		}
	}
    asyncMain()
}

removeDayShifts = (day_id) => {
    showLoading("removeDayShifts")
    checkElementInView("main")
    dbRemove_shift_where_year_week_and_day(DATE_YEAR_WEEK, day_id).then(() => {
        setPerson().then(() => {
            getActiveRoster().then(() => {
                if (INVIEW.length > 0) document.querySelector(INVIEW)?.scrollIntoView()
                hideLoading("removeDayShifts")
            })
        })
    })
}

requestRemoveDayShifts = (day_id) => {
    document.body.classList.add("noscroll")
    document.getElementById("Popup").classList.add("active", "request-remove")
    let block = document.getElementById("Popup-container")
    block.style.width = "300px"

    let block_text = document.createElement("p")
    block_text.innerHTML = "Sicher dass du alle Schichten für <b>"+DAYS[day_id]+" löschen</b> möchtest?"
    block.appendChild(block_text)

    let block_button_cancel = document.createElement("button")
    block_button_cancel.setAttribute("onClick", "closePopup()")
    block_button_cancel.innerHTML = "abbrechen"
    block.appendChild(block_button_cancel)

    let block_button_remove = document.createElement("button")
    block_button_remove.setAttribute("onClick", "removeDayShifts("+day_id+");closePopup()")
    block_button_remove.innerHTML = "löschen"
    block.appendChild(block_button_remove)
    
    document.getElementById("Popup").onclick = (e) => eventListenerClosePopup(e)
}

scrollTimeIntoView = (day_id, time) => {
    document.getElementById("Table-times-thead-tr-"+day_id).querySelector(`[time="${time}"]`).scrollIntoView({behavior: "smooth", inline: "center", block: "nearest"})
}

addRosterPersonDayInfo = (person_id, day_id, text) => {
    while (text.slice(-1) === "\n") {text = text.substring(0, text.length-1)}

	let info = ROSTER_PERSON_INFOS.find(i => i.day_id === day_id && i.id === person_id.toString())
	if (typeof info !== "undefined") {info.text = text}
	else ROSTER_PERSON_INFOS.push({id: person_id.toString(), yearweek: DATE_YEAR_WEEK, day_id: day_id, text: text})
    dbSet_roster_info_where_yearweek_and_day_and_person(DATE_YEAR_WEEK, day_id, person_id, text)
}

removeRosterPersonDayInfo = (person_id, day_id) => {
    ROSTER_PERSON_INFOS = ROSTER_PERSON_INFOS.filter(i => `${i.id}-${i.day_id}` !== `${person_id}-${day_id}`)
    dbRemove_roster_info_where_yearweek_and_day_and_person(DATE_YEAR_WEEK, day_id, person_id)
}

closePersonDayInfoInput = (person_id, day_id, block) => {
    let block_text = block.querySelector("textarea")
    let text = block_text.value
    if (text.length === 0) {
        removeRosterPersonDayInfo(person_id, day_id)
        block.querySelector("button").classList.remove("set")
    } else if (text.length > 0) {
        block.querySelector("button").classList.add("set")
        addRosterPersonDayInfo(person_id, day_id, text)
    }

    block.removeChild(block_text)
    document.getElementById(`Td-name-${person_id}-day-${day_id}`).classList.remove("active")
    document.body.onclick = null
    reloadPersonDayData(person_id, day_id)
}

eventListenerClosePersonDayInfoInput = (evt, person_id, day_id, block) => {
	let targetEl = evt.target
	let clickEl = block
	do {
		if (targetEl == clickEl) return
		targetEl = targetEl.parentNode;
	} while (targetEl);
	closePersonDayInfoInput(person_id, day_id, block)
}

openPersonDayInfoInput = (person_id, day_id, el) => {
    let block = el.parentNode
    let block_input = document.createElement("textarea")
    document.getElementById(`Td-name-${person_id}-day-${day_id}`).classList.add("active")
    let info = ROSTER_PERSON_INFOS.find(i => i.day_id === day_id && i.id === person_id.toString())?.text
    if (typeof info !== "undefined") block_input.value = info
        block.appendChild(block_input)
    window.setTimeout(() => {
        document.body.onclick = (e) => eventListenerClosePersonDayInfoInput(e, person_id, day_id, block)
    }, 100)
}

createBlockRosterTablePersonRow = async (person, roster, day_id, block_tbody_row) => {
    document.querySelector(`#Roster-${day_id}`).classList.remove("editable")
    let year_week = DATE_YEAR_WEEK
    let person_id = person.id
    let shifts_all = person.shifts
    let shifts = shifts_all.filter(s => s.day_id === day_id)

    block_tbody_row.innerHTML = ""

    // create table name
    let block_name_td = document.createElement("td")
    let block_td_name_hours_container = document.createElement("div")
    block_td_name_hours_container.classList.add("td-name-hours-container")
    let block_name_td_container = document.createElement("div")
    let d_color = DEPARTMENT_COLORS[DEPARTMENTS.map(d => d.id).indexOf(person.department)]
    block_name_td.style.background = `linear-gradient(to right, black 1px, ${d_color} 1px, ${d_color} calc(100% - 1px), black 1px)`
    block_name_td_container.classList.add("td-name-container")
    block_name_td.setAttribute("id", "Td-name-"+person_id+"-day-"+day_id)
    block_name_td.classList.add(`name-${person_id}`, "td-name", "td-name-hours", "td-sticky")

    let block_name_hours = document.createElement("div")
    block_name_hours.classList.add("hours-amount")

    let block_name_td_container_hours = document.createElement("div")
    block_name_td_container_hours.classList.add("hours-container")
    let block_name_td_name = document.createElement("div")
    block_name_td_name.classList.add("name")
    block_name_td_name.innerHTML = person.name
    block_name_td_container.appendChild(block_name_td_name)

    let block_name_td_overtime = document.createElement("div")
    block_name_td_overtime.classList.add("td-overtime")
    let overtime = person.overtime
    let overtime_t = getOvertimeTitleText(overtime, person.name)
    if (overtime === 0) {block_name_td_overtime.classList.add("green"); block_name_td_overtime.classList.remove("orange", "red")}
    else if (overtime > 0) {overtime = `+${overtime}`; block_name_td_overtime.classList.add("red"); block_name_td_overtime.classList.remove("green", "orange")}
    else if (overtime < 0) {block_name_td_overtime.classList.add("orange"); block_name_td_overtime.classList.remove("green", "red")}
    block_name_td_overtime.innerHTML = overtime
    block_name_td_overtime.setAttribute("title", overtime_t)
    block_name_td_container.appendChild(block_name_td_overtime)


    let hours_breaks = await getPersonDayHoursAndBreaks(person_id, day_id, year_week)
    let hours = hours_breaks[0]
    let breaks = hours_breaks[1]
    let hours_total = await getPersonHoursWithFreedays(person_id)
    hours_total = parseFloat(hours_total.toFixed(2))
    let hours_breaks_all = await getPersonHoursAndBreaks(person_id, year_week)
    let hours_a = hours_breaks_all[0]
	let breaks_a = hours_breaks_all[1]
    let block_name_hours_vs_given = document.createElement("div")
    block_name_hours_vs_given.setAttribute("title", "Stunden vergeben/Stunden max")
    block_name_hours_vs_given.classList.add("hours-given")
    block_name_hours_vs_given.innerHTML = hours_a+"/"+hours_total
    block_name_hours.appendChild(block_name_hours_vs_given)


    block_name_td_container_hours.appendChild(block_name_hours)

    block_name_td_container.appendChild(block_name_td_container_hours)
    block_td_name_hours_container.appendChild(block_name_td_container)
    block_name_td.appendChild(block_td_name_hours_container)


    // create table name hours

    // top
    let block_td_top_bottom = document.createElement("div")
    block_td_top_bottom.classList.add("td-top-bottom")
    let block_td_top = document.createElement("div")
    block_td_top.classList.add("td-top")

    let block_name_mpa = document.createElement("div")
    block_name_mpa.setAttribute("title", getRenames("m").a)
    block_name_mpa.classList.add("hours-mpa")
    let mpa = person.mpa[day_id]
    let check_if_free = await checkIfPersonDayIsFree(person_id, day_id)
    if (check_if_free) {mpa = 0}
    let check_betterment = check_if_free === getRenames("b").a ? true : false

    let block_name_mpa_value = document.createElement("div")
    block_name_mpa_value.innerHTML = mpa === 0 ? "" : person.mpa[day_id]
    block_name_mpa.style.zIndex = mpa === 0 ? "-1" : "0"
    block_name_mpa.appendChild(block_name_mpa_value)
    block_td_top.appendChild(block_name_mpa)

    let block_name_td_info = document.createElement("div")
    block_name_td_info.classList.add("td-info")
    let block_name_td_info_button = document.createElement("button")

    let info = ROSTER_PERSON_INFOS.find(i => i.day_id === day_id && i.id === person_id.toString())?.text

    info && info.length > 0 && block_name_td_info_button.classList.add("set")
    block_name_td_info_button.classList.add("button-info")
    block_name_td_info_button.setAttribute("onClick", `openPersonDayInfoInput(${person_id}, ${day_id}, this)`)
    block_name_td_info_button.setAttribute("title", "Informationen zu der Schicht hinzufügen")
    block_name_td_info_button.innerHTML = "i"
    block_name_td_info.appendChild(block_name_td_info_button)
    block_td_top.appendChild(block_name_td_info)

    let block_name_td_menu = document.createElement("div")
    let block_name_td_button = document.createElement("button")
    block_name_td_button.classList.add("button-menu", "hamburger")
    block_name_td_button.innerHTML = "<span></span><span></span><span></span>"
    block_name_td_button.setAttribute("onClick", "openRosterPersonMenu("+person_id+", "+day_id+")")
    block_name_td_menu.classList.add("menu", "menu-"+person_id+"-day-"+day_id)
    block_td_top.appendChild(block_name_td_button)
    if (check_if_free) {
        block_name_td_button.setAttribute("disabled", "true")
    }
    block_td_top.appendChild(block_name_td_menu)

    block_td_top_bottom.appendChild(block_td_top)

    // bottom
    let block_td_bottom = document.createElement("div")
    block_td_bottom.classList.add("td-bottom")

    let block_name_break = document.createElement("div")
    block_name_break.setAttribute("title", "Pause heute")
    block_name_break.classList.add("break-today")
    block_name_break.innerHTML = breaks
    block_td_bottom.appendChild(block_name_break)


    let block_name_hours_today = document.createElement("div")
    block_name_hours_today.setAttribute("title", "Schichtstunden heute ohne MPA")
    block_name_hours_today.classList.add("hours-today")
    block_name_hours_today.innerHTML = check_betterment ? hours : hours-person.mpa[day_id]
    block_td_bottom.appendChild(block_name_hours_today)

    block_td_top_bottom .appendChild(block_td_bottom)
    block_td_name_hours_container.appendChild(block_td_top_bottom)

    // create table time
    block_tbody_row.setAttribute("onmouseover", `this.classList.add("hover");`)
    block_tbody_row.setAttribute("onmouseout", `this.classList.remove("hover");`)

    block_tbody_row.setAttribute("id", `Tr-${person_id}-day-${day_id}`)
    block_tbody_row.classList.add("tr-name-"+person_id)

    block_tbody_row.appendChild(block_name_td)

    // create table td

    callback_r = (name) => {
        let block_td_after = document.createElement("td")
        block_td_after.classList.add("td-name-after")
        block_td_after.innerHTML = name
        return block_td_after
    }

    let label = person.sl[day_id]
    roster.d.forEach((data, time_id) => {
        let time = data.t
        let block_times_td = document.createElement("td")
        let block_times_container = document.createElement("div")
        block_times_container.classList.add("container")
        let block_times_content
        block_times_td.setAttribute("person", person.name)
        block_times_td.setAttribute("time", time)
        block_times_td.classList.add("td-day-time")
        if (check_if_free === false) {
            block_times_content = document.createElement("div")
            block_times_content.classList.add("shiftmodify-buttons-container")
            let block_times_button_shift = document.createElement("button")
            block_times_button_shift.classList.add("roster-add-shift")
            if (label !== false) {
                block_times_button_shift.innerHTML = dbGet_shift_label_cut(label)
            } else {
                block_times_button_shift.innerHTML = ""
            }
            block_times_button_shift.setAttribute("title", `${person.name}\nNeue Schicht\n${timeToHHMM(time)}`)
            block_times_button_shift.setAttribute("onClick", "addNewShiftToRoster("+person_id+", "+day_id+", "+time+")")

            block_times_content.appendChild(block_times_button_shift)
            block_times_container.appendChild(block_times_content)
        } else {
            block_times_td.classList.add("free")
            block_times_content = document.createElement("p")
            block_times_content.innerHTML = check_if_free
            block_times_container.innerHTML = "" 
            block_times_container.appendChild(block_times_content)
        }
        block_times_td.appendChild(block_times_container)
        block_tbody_row.appendChild(block_times_td)
        if (time_id === roster.d.length-1) block_tbody_row.appendChild(callback_r(person.name))
        if (shifts.find(s => s.start <= time && s.end >time)) {
            block_times_td.classList.add("assigned")
        }
    })
}

renderRosterSort = () => {
    let block_roster_container = document.getElementById("Roster-days-container")
    let block = document.createElement("div")
    let block_remove = document.querySelector("#Sort-roster-by")
    block.setAttribute("id", "Sort-roster-by")
    block.classList.add("settings-box")
    let block_box = document.createElement("div")
    block_box.classList.add("sort-box")
    let block_name = document.createElement("button")
    block_name.setAttribute("id", "Sort-roster-by-name")
    block_name.classList.add("sort-roster-by", "sort")
    block_name.setAttribute("name", "n")
    block_name.setAttribute("onClick", "sortRosterBy('days', this)")
    block_name.innerHTML = "Name"
    let block_dep = document.createElement("button")
    block_dep.setAttribute("id", "Sort-roster-by-department")
    block_dep.classList.add("sort-roster-by", "sort")
    block_dep.setAttribute("name", "d")
    block_dep.setAttribute("onClick", "sortRosterBy('days', this)")
    block_dep.innerHTML = "Bereich"
    let block_hou = document.createElement("button")
    block_hou.setAttribute("id", "Sort-roster-by-hours")
    block_hou.classList.add("sort-roster-by", "sort")
    block_hou.setAttribute("name", "h")
    block_hou.setAttribute("onClick", "sortRosterBy('days', this)")
    block_hou.innerHTML = "Stunden"
    if (block_remove) block_roster_container.removeChild(block_remove)
    block_box.appendChild(block_name)
    block_box.appendChild(block_dep)
    block_box.appendChild(block_hou)
    block.appendChild(block_box)
    block_roster_container.appendChild(block)
    setRosterSortButtons(0)
}
loadRosterTable = async () => {
    let block_roster_container = document.getElementById("Roster-days-container")
    block_roster_container.innerHTML = ""
    renderRosterSort()
    let day = structuredClone(DATE)
    day.setDate(day.getDate() - 1)
    for (let day_id=0; day_id<ROSTER.length; day_id++) {
        let roster = ROSTER[day_id]
        day.setDate(day.getDate() + 1)
        let block_container_roster = document.createElement("div")
        let block_container_roster_head = document.createElement("div")
        block_container_roster_head.classList.add("Roster-container-head")

        let block_header_day = document.createElement("h2")
        block_header_day.setAttribute("id", `Roster-${day_id}-title`)

        block_container_roster.setAttribute("id","Roster-"+day_id)
        block_container_roster.classList.add("Roster-container")
        block_container_roster.appendChild(block_header_day)
        addDragToScroll(block_container_roster)


        let block_container_copy_from_to = document.createElement("div")
        block_container_copy_from_to.classList.add("container-copy-from-to")

        let block_button_copy_from = document.createElement("select")
        block_button_copy_from.classList.add("select-copy-from", "select-copy")
        block_button_copy_from.setAttribute("title", "Den gesamten Plan von einem Wochentag, oder selben Tag der Vorwoche kopieren.\nDies löscht alle vorhandenen Schichten des Tages")
        block_button_copy_from.setAttribute("onchange", "copyRosterDay("+day_id+", this.value)")
        block_button_copy_from.innerHTML = '<option disabled="disabled" selected="selected">Übertragen von</option>'

        let block_option_wb = document.createElement("option")
        block_option_wb.value = "week_before"
        block_option_wb.innerHTML = "Letzte Woche"
        block_button_copy_from.appendChild(block_option_wb)
        let block_option_wbw = document.createElement("option")
        block_option_wbw.value = "week_before_week"
        block_option_wbw.innerHTML = "Vorletze Woche"
        block_button_copy_from.appendChild(block_option_wbw)
        createDaysOption(day_id).forEach(block => block_button_copy_from.appendChild(block))
        block_container_copy_from_to.appendChild(block_button_copy_from)

        let block_button_copy_to = document.createElement("select")
        block_button_copy_to.classList.add("select-copy-to", "select-copy")
        block_button_copy_to.setAttribute("title", "Den gesamten Plan dieses Tages, auf einen Anderen Tag übertragen.\nDies löscht alle vorhandenen Schichten des zieltages.")
        block_button_copy_to.setAttribute("onchange", "copyRosterDay(this.value, "+day_id+")")
        block_button_copy_to.innerHTML = '<option disabled="disabled" selected="selected">Übertragen nach</option><option value="next">Nächste Woche</option>'
        createDaysOption(day_id).forEach(block => block_button_copy_to.appendChild(block))
        let block_copy_to_all = document.createElement("option")
        block_copy_to_all.setAttribute("value", "all")
        block_copy_to_all.innerHTML = "Alle"
        block_button_copy_to.appendChild(block_copy_to_all)
        block_container_copy_from_to.appendChild(block_button_copy_to)

        block_container_roster_head.appendChild(block_container_copy_from_to)

        let block_table_container = document.createElement("div")
        block_table_container.setAttribute("id", "Table-"+day_id+"-container")
        block_table_container.classList.add("tables-container")

        let block_button_edit_table = document.createElement("button")
        block_button_edit_table.setAttribute("onClick", `loadEditableDataIntoRosterTable(this, ${day_id})`)
        block_button_edit_table.classList.add("button-edit-table")
        let block_button_edit_table_text = document.createElement("div")
        block_button_edit_table_text.innerHTML = "Bearbeiten"
        block_button_edit_table.appendChild(block_button_edit_table_text)
        block_table_container.appendChild(block_button_edit_table)

        let block_table = document.createElement("table")
        block_table.classList.add("table-times")
        let block_thead = document.createElement("thead")
        let block_tbody = document.createElement("tbody")
        let block_thead_row = document.createElement("tr")
        block_thead_row.setAttribute("id", "Table-times-thead-tr-"+day_id)

        let block_time_scroll = document.createElement("div")
        block_time_scroll.classList.add("time-scroll-container")
        block_container_roster_head.appendChild(block_time_scroll)

        block_container_roster.appendChild(block_container_roster_head)
        let block_button_remove = document.createElement("button")
        block_button_remove.innerHTML = "löschen"
        block_button_remove.classList.add("button-remove-day-shifts", "button-remove")
        block_button_remove.setAttribute("onClick", "requestRemoveDayShifts("+day_id+")")
        block_container_roster_head.appendChild(block_button_remove)
        let block_th_name = document.createElement("th") 
        let block_th_name_day = document.createElement("div") 
        block_th_name_day.innerHTML = DAYS[day_id]
        block_th_name.appendChild(block_th_name_day)
        block_thead_row.appendChild(block_th_name)


        block_thead.appendChild(block_thead_row)
        block_table.appendChild(block_thead)
        block_table.appendChild(block_tbody)
        block_table_container.appendChild(block_table)
        block_container_roster.appendChild(block_table_container)
        block_roster_container.appendChild(block_container_roster)
        for (let time_id=0; time_id<roster.d.length; time_id++) {
            let time = roster.d[time_id]
            if (checkNaturalNumber(time.t)) {
                let button = document.createElement("button")
                button.setAttribute("onClick", `scrollTimeIntoView(${day_id}, ${time.t})`)
                button.setAttribute("title", `Zur Uhrzeit ${time.t}:00 scrollen`)
                button.innerHTML = time.t
                block_time_scroll.appendChild(button)
            }

            let block_th = document.createElement("th") 
            let block_th_time = document.createElement("p")  
            let block_th_amount = document.createElement("div")  
            let block_th_amount_container = document.createElement("div")  
            let block_th_amount_max = document.createElement("p")  
            let block_th_amount_is = document.createElement("p")  
            let block_th_amount_buttons = document.createElement("div")  
            let block_th_amount_button_up = document.createElement("button")  
            let block_th_amount_button_down = document.createElement("button")  
            block_th.setAttribute("time", time.t)
            block_th.classList.add("th-day-time", "font-number")
            block_th.setAttribute("style", "background-color: "+colors_red_orange_green[0]+";")
            block_th_time.classList.add("time", "font-number")
            let time_text = timeToHHMM(time.t)
            if (time_text.length === 4) time_text = ` ${time_text}`
            block_th_time.innerHTML = time_text
            block_th_amount_buttons.classList.add("th-amount-buttons")
            block_th_amount_button_up.classList.add("chevron-up")
            block_th_amount_button_up.setAttribute("onClick", "changeTimeAmount(this, "+day_id+", 'up', "+time_id+")")
            block_th_amount_button_down.classList.add("chevron-down")
            block_th_amount_button_down.setAttribute("onClick", "changeTimeAmount(this, "+day_id+", 'down', "+time_id+")")

            block_th_amount_buttons.appendChild(block_th_amount_button_up)
            block_th_amount_buttons.appendChild(block_th_amount_button_down)

            block_th_amount_container.setAttribute("onClick", "this.classList.toggle('active')")
            block_th_amount_container.setAttribute("title", "vergebene Schichten/Gewünschte Anzahl\nUm mehrere zu erhöhen auf mehrere dieser Zahlen drücken.\nUm alle Markierungen zu entfernen eine unmarkierte Zahl verändern.")
            block_th_amount_container.classList.add("th-amount-container")
            block_th_amount_max.innerHTML = time.a
            block_th_amount_max.classList.add("time-amount-max")
            block_th_amount_is.innerHTML = "0/"
            block_th_amount_is.classList.add("time-amount-is")

            block_th_amount_container.appendChild(block_th_amount_is)
            block_th_amount_container.appendChild(block_th_amount_max)
            block_th_amount.appendChild(block_th_amount_container)
            block_th_amount.appendChild(block_th_amount_buttons)
            block_th_amount.classList.add("time-amount")

            block_th.appendChild(block_th_amount)
            block_th.appendChild(block_th_time)

            block_thead_row.appendChild(block_th)

            let amount = await getPersonAmountForDayTime(day_id, time.t).length
            let color_id = Math.round((amount*colors_red_orange_green.length)/time.a)
            let color = colors_red_orange_green[color_id]
            if (color_id >= colors_red_orange_green.length) color = colors_red_orange_green[colors_red_orange_green.length-1]
            if (amount > time.a) color = "#458caf"
            else if (amount === time.a) color = "#61a64d"


            block_th.setAttribute("style", `background-color: ${color}; border-color: ${color}87;`)
            block_th_amount_is.innerHTML = amount+"/"
        }
        let time_last = timeToHHMM(ROSTER[day_id].d[ROSTER[day_id].d.length-1].t+TIME_STEP)
        let block_th = document.createElement("th") 
        block_th.setAttribute("colspan", "2")
        let block_th_p = document.createElement("p") 

        block_th_p.innerHTML = time_last
        block_th_p.classList.add("time")
        block_th.classList.add("th-day-time")
        block_th.appendChild(block_th_p)
        block_thead_row.appendChild(block_th)

        let log_date = performance.now()
        for (let pr=0; pr<PERSONS_ROSTER.length;pr++) {
            log_date = performance.now()
            let person = PERSONS_ROSTER[pr]
            let block_tbody_row = document.createElement("tr")
            block_tbody.appendChild(block_tbody_row)
            createBlockRosterTablePersonRow(person, roster, day_id, block_tbody_row)
        }

        let day_date = structuredClone(DATE)
        day_date.setDate(day_date.getDate() - (day_date.getDay() + 6) % 7 + day_id)
        block_header_day.innerHTML = roster.n+" "+day_date.toLocaleDateString('de', {day: '2-digit', month: '2-digit', year: '2-digit'})
        addDragToScroll(block_container_roster, day_id)
    }
}

toggleTableWeekEditeable = (table_name) => {
    showLoading("toggleTableWeekEditeable")
    let year_week = DATE_YEAR_WEEK
    let table_id = EDITABLE_TABLES.indexOf(table_name)
    if (table_id > -1) { EDITABLE_TABLES.splice(table_id, 1) } 
    else { 
        EDITABLE_TABLES.push(table_name)
    }
    if (document.querySelector("#Popup .item-table-to .select-roster")) {
        year_week = document.querySelector("#Popup .item-table-to .select-roster").value
    }
    loadRosterTableWeekData(year_week, table_name).then(() => {
        hideLoading("toggleTableWeekEditeable")
    })
}
