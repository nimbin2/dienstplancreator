// [{}]
dbAdd_person = async (person) => {
	let person_is = {name: person.name, activated: person.activated, department: person.department, hours: person.hours, mpa: person.mpa.toString()}
    let response = await fetch("/api/persons/add.php", {
        method: "POST",
        body: JSON.stringify(person_is),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })  
    let person_id = await response.json()
    return person_id
}
dbGet_persons = async () => {
    let response = await fetch("/api/persons/getAll.php", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    }) 
    let persons = await response.json()
    return persons.persons
}
// [id: int, a: string, n: string, h: decimal, d: int, m: [int], c: [{d: string, k: string, v: [{d: int, v|a|l|f: boolean}]}], b: [str]}
dbGet_person = async (id) => {
    let response = await fetch("/api/persons/get.php", {
        method: "POST",
        body: JSON.stringify({id: id}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    }) 
    return await response.json()
}
dbSet_person_where = async (id, name, value) => {
    let response = await fetch("/api/persons/updateWhere.php", {
        method: "POST",
        body: JSON.stringify({id: id, name: name, value: value}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })  
    return await response.json()
}
dbRemove_person = async (id) => {
    let response = await fetch("/api/persons/remove.php", {
        method: "POST",
        body: JSON.stringify({id: id}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })  
    return await response.json()
}

dbSet_person_hours = async (person_id, yearweek) => {
    let response = await fetch("/api/person_hours/update.php", {
        method: "POST",
        body: JSON.stringify({person_id: person_id, yearweek: yearweek}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })  
    return await response.json()
}

dbAdd_person_illnes = async (person_id, start, end) => {
    let response = await fetch("/api/person_illnes/add.php", {
        method: "POST",
        body: JSON.stringify({person_id: person_id, start: start, end: end}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })  
    return await response.json()
}
dbSet_person_illnes = async (id, person_id, start, end) => {
    let response = await fetch("/api/person_illnes/add.php", {
        method: "POST",
        body: JSON.stringify({id: id, person_id: person_id, start: start, end: end}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })  
    return await response.json()
}
dbGet_person_illnesses = async (person_id) => {
    /*let response = await fetch("/api/person_illnes/get.php", {
        method: "POST",
        body: JSON.stringify({person_id: person_id}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })  
    let person_illnes = await response.json()
    return person_illnes?.person_illnes */
    return PERSONS.find(p => p.id === person_id).illnesses
}
dbRemove_person_illnes = async (id, person_id) => {
    let response = await fetch("/api/person_illnes/remove.php", {
        method: "POST",
        body: JSON.stringify({id: id, person_id: person_id}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })  
    return await response.json()
}
dbAdd_person_vacation = async (person_id, start, end) => {
    let response = await fetch("/api/person_vacations/add.php", {
        method: "POST",
        body: JSON.stringify({person_id: person_id, start: start, end: end}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })  
    return await response.json()
}
dbSet_person_vacation = async (person_id, id, start, end) => {
    let response = await fetch("/api/person_vacations/update.php", {
        method: "POST",
        body: JSON.stringify({person_id: person_id, id: id, start: start, end: end}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })  
    return await response.json()
}
dbGet_person_vacations = async (person_id) => {
    /*let response = await fetch("/api/person_vacations/get.php", {
        method: "POST",
        body: JSON.stringify({person_id: person_id}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })  
    let person_vacations = await response.json()
    return person_vacations?.person_vacations*/
    return PERSONS.find(p => p.id === person_id).vacations
}
dbRemove_person_vacation = async (id, person_id) => {
    let response = await fetch("/api/person_vacations/remove.php", {
        method: "POST",
        body: JSON.stringify({id: id, person_id: person_id}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })  
    return await response.json()
}

dbAdd_person_betterment = async (person_id, start, end, hours) => {
    let response = await fetch("/api/person_betterments/add.php", {
        method: "POST",
        body: JSON.stringify({person_id: person_id, start: start, end: end, hours: hours}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })  
    return await response.json()
}
dbGet_person_betterments = async (person_id) => {
    /*let response = await fetch("/api/person_betterments/get.php", {
        method: "POST",
        body: JSON.stringify({person_id: person_id}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })  
    let person_betterments = await response.json()
    return person_betterments?.person_betterments 
    */
    return PERSONS.find(p => p.id === person_id).betterments
}
dbGet_person_betterments_where_date  = async (person_id, date) => {
    /*
    let response = await fetch("/api/person_betterments/getWhereDate.php", {
        method: "POST",
        body: JSON.stringify({person_id: person_id, date: date}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })  
    let person_betterment = await response.json()
    */
    return PERSONS.find(p => p.id === person_id).betterments?.find(b => b.start <= date && b.end >= date)
}
dbRemove_person_betterment = async (id, person_id) => {
    let response = await fetch("/api/person_betterments/remove.php", {
        method: "POST",
        body: JSON.stringify({id: id, person_id: person_id}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })  
    return await response.json()
}

dbGet_person_overtimes_yearweeks = async (person_id) => {
    let response = await fetch("/api/person_hours/getAll.php", {
        method: "POST",
        body: JSON.stringify({person_id: person_id}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })  
    let person_overtime = await response.json()
    return person_overtime
}

dbAdd_person_overtime_manual = async (yearweek, person_id, overtime) => {
    let response = await fetch("/api/person_overtimes_manual/add.php", {
        method: "POST",
        body: JSON.stringify({person_id: person_id, yearweek: yearweek, overtime: overtime ? overtime : 0}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })  
    return await response.json()
}
dbGet_person_overtime_manual_where_yearweek = async (yearweek, person_id) => {
    let response = await fetch("/api/person_overtimes_manual/getWhereYearweek.php", {
        method: "POST",
        body: JSON.stringify({person_id: person_id, yearweek: yearweek}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })  
    return await response.json()
}
dbGet_person_overtimes_manual_where_yearweek_le = async (yearweek, person_id) => {
    let response = await fetch("/api/person_overtimes_manual/getWhereYearweekLe.php", {
        method: "POST",
        body: JSON.stringify({person_id: person_id, yearweek: yearweek}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })  
    let person_overtime = await response.json()
    return person_overtime.person_overtimes_manual
}
dbSet_person_overtime_manual_where_yearweek = async (yearweek, person_id, overtime) => {
    overtime = overtime ? overtime : 0
    let response = await fetch("/api/person_overtimes_manual/update.php", {
        method: "POST",
        body: JSON.stringify({person_id: person_id, yearweek: yearweek, overtime: overtime}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })  
    return await response.json()
}
dbRemove_person_overtime_manual_where_yearweek = async (yearweek, person_id) => {
    let response = await fetch("/api/person_overtimes_manual/remove.php", {
        method: "POST",
        body: JSON.stringify({person_id: person_id, yearweek: yearweek}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })  
    return await response.json()
}
dbRemove_person_overtime_manual_where_yearweek_lt = async (person_id, yearweek) =>{
    let response = await fetch("/api/person_overtimes_manual/removeWhereYearweekLt.php", {
        method: "POST",
        body: JSON.stringify({person_id: person_id, yearweek: yearweek}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })  
    return await response.json()
}




dbGet_persons_active_where_yearweek = async (yearweek) => {
    let response = await fetch("/api/persons_active/getAllActive.php", {
        method: "POST",
        body: JSON.stringify({yearweek: yearweek}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    }) 
    let persons = await response.json()
    return persons.persons
}
dbGet_person_active = async (yearweek, person_id) => {
    let response = await fetch("/api/persons_active/getActive.php", {
        method: "POST",
        body: JSON.stringify({yearweek: yearweek, person_id: person_id}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    }) 
    let persons = await response.json()
    return persons
}
dbSet_person_person_activated = async (person_id, yearweek) => {
    let response = await fetch("/api/persons/updateWhere.php", {
        method: "POST",
        body: JSON.stringify({id: person_id, name: "activated", value: yearweek}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })  
    return await response.json()
}
dbGet_person_removed = async (yearweek, person_id) =>  {
    let response = await fetch("/api/persons_active/getRemoved.php", {
        method: "POST",
        body: JSON.stringify({yearweek: yearweek, person_id: person_id}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })  
    return await response.json()
}
dbGet_persons_removed = async (yearweek) =>  {
    let response = await fetch("/api/persons_active/getAllRemoved.php", {
        method: "POST",
        body: JSON.stringify({yearweek: yearweek}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })  
    return await response.json()
}


dbSet_persons_departments_where_id = (department_id, value) => 
        {PERSONS_ALL.forEach(p => {p.d === department_id && (p.d = value)})}
