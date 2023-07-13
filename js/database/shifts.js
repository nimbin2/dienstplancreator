dbAdd_shift = async (year_week, day_id, person_id, start, end) => {
    let response = await fetch("/api/shifts/add.php", {
        method: "POST",
        body: JSON.stringify({yearweek: year_week, day_id: day_id, person_id: person_id, start: start, end: end}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })

    let shift_id = await response.json()
    return shift_id
}
dbSet_shift_where_id = async (id, start, end) => {
	let response = await fetch("/api/shifts/updateWhereId.php", {
        method: "POST",
        body: JSON.stringify({id: id, start: start, end: end}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })
    let shift_id = await response.json()
    return shift_id 
}
dbSet_shifts_where_yearweek_and_start_lt = (year_week, value) => {
	fetch("/api/shifts/updateStartWhereYearweekStartLt.php", {
        method: "POST",
        body: JSON.stringify({yearweek: year_week, start: value, end: end, value: value}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })
}
dbSet_shifts_where_yearweek_and_end_gt = (year_week, value) => {
	fetch("/api/shifts/updateEndWhereYearweekEndGt.php", {
        method: "POST",
        body: JSON.stringify({yearweek: year_week, start: start, end: value, value: value}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })
}

dbGet_shifts_where_person = async (person_id) => {
    let response = await fetch("/api/shifts/getWherePerson.php", {
        method: "POST",
        body: JSON.stringify({person_id: person_id}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })  
    let shifts = await response.json()
    return shifts.shifts
}
dbGet_shifts_where_yearweek = async (year_week) => {
    let response = await fetch("/api/shifts/getWhereYearweek.php", {
        method: "POST",
        body: JSON.stringify({yearweek: year_week}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })  
    let shifts = await response.json()
    return shifts.shifts
}
dbGet_shifts_where_yearweek_and_person = async (year_week, person_id) => {
    let response = await fetch("/api/shifts/getWhereYearweekPerson.php", {
        method: "POST",
        body: JSON.stringify({yearweek: year_week, person_id: person_id}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })  
    let shifts = await response.json()
    return shifts.shifts
}
dbGet_shifts_where_yearweek_and_day = async (year_week, day_id) => {
    let response = await fetch("/api/shifts/getWhereYearweekDay.php", {
        method: "POST",
        body: JSON.stringify({yearweek: year_week, day_id: day_id}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })  
    let shifts = await response.json()
    return shifts.shifts
}
dbGet_shifts_where_yearweek_and_day_and_person = async (year_week, day_id, person_id) => {
    let response = await fetch("/api/shifts/getWhereYearweekDayPerson.php", {
        method: "POST",
        body: JSON.stringify({yearweek: year_week, day_id: day_id, person_id: person_id}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })  
    let shifts = await response.json()
    return shifts.shifts
}

dbRemove_shift_where_id = async (id) => {
	let response = await fetch("/api/shifts/removeWhereId.php", {
        method: "POST",
        body: JSON.stringify({id: id}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })
    return await response.json()
}
dbRemove_shift_where_person_and_day = async (person_id, day_id) => {
	let response = await fetch("/api/shifts/removeWhereDayPerson.php", {
        method: "POST",
        body: JSON.stringify({day_id: day_id, person_id: person_id}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })
    return await response.json()
}
dbRemove_shift_where_person_and_year_week_and_day = async (person_id, year_week, day_id) => {
	let response = await fetch("/api/shifts/removeWhereYearweekDayPerson.php", {
        method: "POST",
        body: JSON.stringify({yearweek: year_week, day_id: day_id, person_id: person_id}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })
    return await response.json()
}
dbRemove_shift_where_person_and_year_week_ge_and_day = async (person_id, year_week, day_id) => {
	let response = await fetch("/api/shifts/removeWhereYearweekGeDayPerson.php", {
        method: "POST",
        body: JSON.stringify({yearweek: year_week, day_id: day_id, person_id: person_id}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })
    return await response.json()
}
dbRemove_shift_where_person_and_year_week_and_day_and_start = async (person_id, year_week, day_id, start) => {
	let response = await fetch("/api/shifts/removeWhereYearweekDayPersonStart.php", {
        method: "POST",
        body: JSON.stringify({yearweek: year_week, day_id: day_id, person_id: person_id, start: start}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })
    return await response.json()
}
dbRemove_shift_where_year_week_and_day = async (year_week, day_id) => {
	let response = await fetch("/api/shifts/removeWhereYearweekDay.php", {
        method: "POST",
        body: JSON.stringify({yearweek: year_week, day_id: day_id}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })
    return await response.json()
}
