
dbSet_roster = async (year_week, time_step, breaks) => {
    let days = DAYS.toString()
	let response = await fetch("/api/roster/update.php", {
        method: "POST",
        body: JSON.stringify({yearweek: year_week, time_step: time_step, break_60: breaks[0], break_90: breaks[1], days: days}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })
    return await response.json()
}
dbGet_roster_where_yearweek = async (year_week) => {
    let response = await fetch("/api/roster/get.php", {
        method: "POST",
		body: JSON.stringify({yearweek: year_week}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })  
    let rosters = await response.json()
    return rosters
}
dbGet_rosters_yearweek = async () => {
    let response = await fetch("/api/roster/getYearweeks.php", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })  
    let rosters = await response.json()
    return rosters.map(r => r.yearweek).sort((a,b) => b.localeCompare(a))
}

dbRemove_roster_where_yearweek = (year_week) => {
	fetch("/api/roster/remove.php", {
        method: "POST",
        body: JSON.stringify({yearweek: year_week}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })
}

dbGet_roster_active = async (year_week) => {
    let response = await fetch("/api/roster_active/get.php", {
        method: "POST",
		body: JSON.stringify({yearweek: year_week}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })  
    let rosters = await response.json()
    return rosters
}

dbGet_roster_editable_cells_right = async (year_week) => {
    let response = await fetch("/api/roster_editable_cell_right/get.php", {
        method: "POST",
        body: JSON.stringify({yearweek: year_week}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })  
    let data = await response.json()
    return data.roster_editable_cell_right
}
dbGet_roster_editable_cell_right_where_key = (year_week, key) =>
        {return EDITABLE_CELLS_RIGHT?.find(e => e.id === key.toString())?.text}
dbSet_roster_editable_cells_right_where_key  = (year_week, id, text) => {
	fetch("/api/roster_editable_cell_right/update.php", {
        method: "POST",
        body: JSON.stringify({yearweek: year_week, id: id, text: text}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })
}
dbRemove_roster_editable_cells_right = (year_week) => {
	fetch("/api/roster_editable_cell_right/remove.php", {
        method: "POST",
        body: JSON.stringify({yearweek: year_week}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })
}

dbGet_roster_editable_rows_bottom = async (year_week) => {
    let response = await fetch("/api/roster_editable_row_bottom/get.php", {
        method: "POST",
        body: JSON.stringify({yearweek: year_week}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })  
    let data = await response.json()
    return data.roster_editable_row_bottom
}
dbGet_roster_editable_rows_bottom_where_key = (year_week, key) =>
        {return EDITABLE_ROWS_BOTTOM?.find(e => e.id === key.toString())?.text}
dbSet_roster_editable_rows_bottom_where_key = (year_week, id, text) => {
	fetch("/api/roster_editable_row_bottom/update.php", {
        method: "POST",
        body: JSON.stringify({yearweek: year_week, id: id, text: text}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })
}
dbRemove_roster_editable_rows_bottom   = (year_week) => {
	fetch("/api/roster_editable_row_bottom/remove.php", {
        method: "POST",
        body: JSON.stringify({yearweek: year_week}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })
}

dbGet_roster_editable_rows_top = async (year_week) => {
    let response = await fetch("/api/roster_editable_row_top/get.php", {
        method: "POST",
        body: JSON.stringify({yearweek: year_week}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })  
    let data = await response.json()
    return data.roster_editable_row_top
}
dbGet_roster_editable_rows_top_where_key = (year_week, key) =>
        {return EDITABLE_ROWS_TOP?.find(e => e.id === key.toString())?.text}
dbSet_roster_editable_rows_top_where_key = (year_week, id, text) => {
	fetch("/api/roster_editable_row_top/update.php", {
        method: "POST",
        body: JSON.stringify({yearweek: year_week, id: id, text: text}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })
}
dbRemove_roster_editable_rows_top = (year_week) => {
	fetch("/api/roster_editable_row_top/remove.php", {
        method: "POST",
        body: JSON.stringify({yearweek: year_week}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })
}

dbGet_roster_info_where_yearweek = async (year_week) =>  {
    let response = await fetch("/api/roster_person_info/getAll.php", {
        method: "POST",
        body: JSON.stringify({yearweek: year_week}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })  
    let data = await response.json()
    return data?.infos
}
dbGet_roster_info_where_yearweek_and_day_and_person = async (year_week, day_id, id) =>  {
    let response = await fetch("/api/roster_person_info/get.php", {
        method: "POST",
        body: JSON.stringify({yearweek: year_week, day_id: day_id, id: id.toString()}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })  
    let data = await response.json()
    return data?.text
}
dbSet_roster_info_where_yearweek_and_day_and_person = (year_week, day_id, id, text) => {
    fetch("/api/roster_person_info/update.php", {
        method: "POST",
        body: JSON.stringify({yearweek: year_week, day_id: day_id, id: id.toString(), text: text}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })  
} 
dbRemove_roster_info_where_yearweek_and_day_and_person = async (year_week, day_id, id) => {
    console.log(year_week, day_id, id)
    let response = await fetch("/api/roster_person_info/remove.php", {
        method: "POST",
        body: JSON.stringify({yearweek: year_week, day_id: day_id, id: id.toString()}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })
    return await response.json()
} 

dbSet_roster_shiftbreak_60 = async (year_week, value) => {
    let days = DAYS.toString()
    let time_step = TIME_STEP
    let break_60 = value
    let break_90 = DAYBREAK_2
	let response = await fetch("/api/roster/update.php", {
        method: "POST",
        body: JSON.stringify({yearweek: year_week, time_step: time_step, break_60: break_60, break_90: break_90, days: days}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })
    return await response.json()
}
dbSet_roster_shiftbreak_90 = async (year_week, value) => {
    let days = DAYS.toString()
    let time_step = TIME_STEP
    let break_60 = DAYBREAK_1
    let break_90 = value
	let response = await fetch("/api/roster/update.php", {
        method: "POST",
        body: JSON.stringify({yearweek: year_week, time_step: time_step, break_60: break_60, break_90: break_90, days: days}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })
    return await response.json()
}
dbSet_roster_timestep = async (year_week, value) => {
    let days = DAYS.toString()
    let time_step = value
    let break_60 = DAYBREAK_1
    let break_90 = DAYBREAK_2
	let response = await fetch("/api/roster/update.php", {
        method: "POST",
        body: JSON.stringify({yearweek: year_week, time_step: time_step, break_60: break_60, break_90: break_90, days: days}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })
    return await response.json()
}
