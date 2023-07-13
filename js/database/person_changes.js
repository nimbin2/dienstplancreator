dbAdd_person_change_where_yearweek_and_person_and_key = (year_week, id, key, value) => {
    fetch("/api/person_changes/add.php", {
        method: "POST",
        body: JSON.stringify({person_id: id, yearweek: year_week, day_id: 999, change_key: key, value: value}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })
}
dbAdd_person_change_where_yearweek_and_day_and_person_and_key = async (year_week, day_id, id, key, value) => {
    let response = await fetch("/api/person_changes/add.php", {
        method: "POST",
        body: JSON.stringify({person_id: id, yearweek: year_week, day_id: day_id, change_key: key, value: value}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })
    return await response.json()
}

dbGet_person_changes = async () => {
    let response = await fetch("/api/person_changes/get.php", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })  
    let changes = await response.json()
    return changes.person_changes
}
dbGet_person_changes_where_key = async (id, key) => {
    let response = await fetch("/api/person_changes/getWhereKey.php", {
        method: "POST",
		body: JSON.stringify({person_id: id, change_key: key}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })  
    let changes = await response.json()
    return changes.person_changes
}
dbGet_person_changes_where_key_and_value = async (key, value) =>  {
    let response = await fetch("/api/person_changes/getWhereKeyValue.php", {
        method: "POST",
		body: JSON.stringify({change_key: key, value: value }),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })  
    let changes = await response.json()
    return changes.person_changes
}
dbGet_person_changes_where_yearweek_and_person_and_key = async (year_week, id, key) =>  {
    let response = await fetch("/api/person_changes/getWhereYearweekKey.php", {
        method: "POST",
		body: JSON.stringify({person_id: id, yearweek: year_week, change_key: key }),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })  
    let changes = await response.json()
    return changes.person_changes
}
dbGet_person_change_where_yearweek_and_day_and_person_and_key = async (year_week, day_id, id, key) => {
    let response = await fetch("/api/person_changes/getWhereYearweekDayKey.php", {
        method: "POST",
		body: JSON.stringify({person_id: id, yearweek: year_week, day_id: day_id, change_key: key }),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })  
    let changes = await response.json()
    return changes.person_changes
}

dbSet_person_changes_where_person_and_key = async (id, key, value) =>  {
    let response = await fetch("/api/person_changes/updateWhereKey.php", {
        method: "POST",
		body: JSON.stringify({person_id: id, change_key: key, value: value}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })  
    return await response.json()
}
dbSet_person_change_where_yearweek_and_person_and_key = async (year_week, id, key, value) => {
    let response = await fetch("/api/person_changes/updateWhereYearweekKey.php", {
        method: "POST",
		body: JSON.stringify({person_id: id, yearweek: year_week, change_key: key, value: value}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })  
    return await response.json()
}
dbSet_person_changes_where_day_and_person_and_key = async (day_id, id, key, value) => {
    let response = await fetch("/api/person_changes/updateWhereDayKey.php", {
        method: "POST",
		body: JSON.stringify({person_id: id, day_id: day_id, change_key: key, value: value}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })
    return await response.json()
}
dbSet_person_change_where_yearweek_day_and_person_and_key = async (year_week, day_id, person_id, key, value) => {
    let response = await fetch("/api/person_changes/updateWhereYearweekDayKey.php", {
        method: "POST",
		body: JSON.stringify({person_id: person_id, yearweek: year_week, day_id: day_id, change_key: key, value: value}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })
    return await response.json()
}
dbSet_person_changes_where_yearweek_is_ge_and_person_and_key = async (year_week, id, key, value) => {
    let response = await fetch("/api/person_changes/updateWhereYearweekGeKey.php", {
        method: "POST",
		body: JSON.stringify({person_id: id, yearweek: year_week, change_key: key, value: value}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })
    return await response.json()
}
dbSet_person_changes_where_yearweek_is_ge_and_day_and_person_and_key = async (year_week, day_id, id, key, value) => {
    let response = await fetch("/api/person_changes/updateWhereYearweekGeDayKey.php", {
        method: "POST",
		body: JSON.stringify({person_id: id, yearweek: year_week, day_id: day_id, change_key: key, value: value}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })
    return await response.json()
}


dbRemove_person_changes_where_person_and_key = async (id, key) => {
    let response = await fetch("/api/person_changes/removeWhereKey.php", {
        method: "POST",
		body: JSON.stringify({person_id: id, change_key: key}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })
    return await response.json()
}
dbRemove_person_change_where_yearweek_and_day_and_person_and_key = (year_week, day_id, id, key) => {
    fetch("/api/person_changes/removeWhereYearweekDayKey.php", {
        method: "POST",
		body: JSON.stringify({person_id: id, yearweek: year_week, day_id: day_id, change_key: key}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })
}
