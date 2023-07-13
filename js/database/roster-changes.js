
dbSet_roster_change_where_yearweek_and_day = async (year_week, day_id, start, end, amount) =>  {
    let response = await fetch("/api/roster_changes/update.php", {
        method: "POST",
        body: JSON.stringify({yearweek: year_week, day_id: day_id, start: start, end: end, amount: amount.toString()}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })  
    return await response.json()
} 
dbGet_roster_changes_where_yearweek = async (year_week) => {
    let response = await fetch("/api/roster_changes/getWhereYearweek.php", {
        method: "POST",
        body: JSON.stringify({yearweek: year_week}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })
    let data = await response.json()
    let rc = data?.roster_changes
	return rc
}
dbGet_roster_change_where_yearweek_and_day = async (year_week, day_id) => {
    let response = await fetch("/api/roster_changes/getWhereYearweekDay.php", {
        method: "POST",
        body: JSON.stringify({yearweek: year_week, day_id: day_id}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })  
    let data = await response.json()
    let c = data?.roster_changes
	c.start	 = parseFloat(c.start)
	c.end	 = parseFloat(c.end)
	c.amount = parseFloat(c.amount.split(",").map(Number))
	return c
}
dbGet_roster_change_where_yearweek_le_and_day = async (year_week, day_id) => {
    let response = await fetch("/api/roster_changes/getWhereYearweekLeDay.php", {
        method: "POST",
        body: JSON.stringify({yearweek: year_week, day_id: day_id}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })  
    let c = await response.json()
	c.start	 = parseFloat(c.start)
	c.end	 = parseFloat(c.end)
	return c
}

dbRemove_roster_changes_where_yeaweek = (year_week) => {
	fetch("/api/roster_changes/remove.php", {
        method: "POST",
        body: JSON.stringify({yearweek: year_week}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })
}
