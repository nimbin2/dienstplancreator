dbAdd_closingtime = async (name, start, end, person_ids, lawful) => {
	let clos = {name: name, start: start, end: end, lawful: lawful ? 1 : 0, persons: person_ids}
    let response = await fetch("/api/closingtimes/add.php", {
        method: "POST",
        body: JSON.stringify(clos),
        headers: {
        "Content-Type": "application/json; charset=UTF-8"
        }
    })
    return await response.json()
    /*.then(response => {return response.json.then(id => {
        if (person_ids.length === 0) {return}
        for (let i=0; i<person_ids.length; i++) {
            let pid = person_ids[i]
            let per = {closingtime_id: id, person_id: pid}
            fetch("/api/closingtime_persons/add.php", {
                method: "POST",
                body: JSON.stringify(per),
                headers: { "Content-Type": "application/json; charset=UTF-8" }
            }).then(ppid => {
                if (person_ids.length-1 === i) {
                    return ppid
                }
            })
        }
    })})*/
}
dbGet_closingtime_persons = async (closingtime_id) => {
    let data = {closingtime_id: closingtime_id}
    let response = await fetch("/api/closingtime_persons/get.php", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
        "Content-Type": "application/json; charset=UTF-8"
        }
    })
    let persons = await response.json()
    return persons.persons
}
dbGet_closingtime_persons_where_person = async (person_id) => {
    let response = await fetch("/api/closingtime_persons/getWherePerson.php", {
        method: "POST",
        body: JSON.stringify({person_id: person_id}),
        headers: {
        "Content-Type": "application/json; charset=UTF-8"
        }
    })
    let closingtimes = await response.json()
    return closingtimes
}
dbGet_closingtimes = async () => {
    let response = await fetch("/api/closingtimes/getAll.php", {
        method: "POST",
        headers: {
        "Content-Type": "application/json; charset=UTF-8"
        }
    })
    return response.json()
}
dbGet_closingtime = async (id) => {
    let response = await fetch("/api/closingtimes/get.php", {
        method: "POST",
        body: JSON.stringify({id: id}),
        headers: {
        "Content-Type": "application/json; charset=UTF-8"
        }
    })
    return response.json()
}
//dbGet_closingtime = (id) => {return CLOSINGTIMES.find(x => x.id === id)}
dbGet_closingtimes_lawful = () => {return CLOSINGTIMES.filter(x => x.lawful === 1)}
/*dbGet_closingtime = async (id) => {
    let data = {id: id}
    let response = await fetch("/api/closingtimes/get.php", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
        "Content-Type": "application/json; charset=UTF-8"
        }
    })
    let closingtimes = await response.json()
    return closingtimes
}*/
/*dbGet_closingtimes_lawful = async () => {
    let response = await fetch("/api/closingtimes/getLawful.php", {
        method: "POST",
        headers: {
        "Content-Type": "application/json; charset=UTF-8"
        }
    })
    let closingtimes = await response.json()
    return closingtimes.closingtimes
}*/
dbGet_closingtime_person_during_date = (person_id, check_date) => {return CLOSINGTIMES.find(x => x.persons.map(p => p.person_id).indexOf(person_id) > -1 && x.start <= check_date && x.end >= check_date)}
dbAdd_closingtime_person = async (c_id, p_id) => {
    let data = {closingtime_id: c_id, person_id: p_id}
    fetch("/api/closingtime_persons/add.php", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
        "Content-Type": "application/json; charset=UTF-8"
        }
    })
}
dbRemove_closingtime = async (id) => {
    let response = await fetch("/api/closingtimes/remove.php", {
        method: "POST",
        body: JSON.stringify({id: id}),
        headers: {
        "Content-Type": "application/json; charset=UTF-8"
        }
    })
    return await response.json()
}
dbRemove_closingtime_person = async (closingtime_id, person_id) => {
    let data = {closingtime_id: closingtime_id, person_id: person_id}
    fetch("/api/closingtime_persons/remove.php", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
        "Content-Type": "application/json; charset=UTF-8"
        }
    })
}
dbRemove_closingtime_all_persons = async(closingtime_id) => {
    let data = {closingtime_id: closingtime_id}
    let response = await fetch("/api/closingtime_persons/removeAll.php", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
        "Content-Type": "application/json; charset=UTF-8"
        }
    })
    return await response.json()
}
