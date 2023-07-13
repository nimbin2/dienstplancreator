dbAdd_department = async (name) => {
    let response = await fetch("/api/departments/add.php", {
        method: "POST",
        body: JSON.stringify({name: name}),
        headers: {
        "Content-Type": "application/json; charset=UTF-8"
        }
    })
    return await response.json()
}
dbGet_departments = async () => {
    return await fetch("/api/departments/get.php", {
        method: "POST",
        headers: {
        "Content-Type": "application/json; charset=UTF-8"
        }
    })  
    .then((response) => {return response.json()})
    .then((data) => { return data.departments})
}
dbGet_department_where_id  = (id) => {return DEPARTMENTS.find(d => d.id === id).name}
dbSet_department = async (id, value) => {
    let response = await fetch("/api/departments/update.php", {
        method: "POST",
        body: JSON.stringify({id: id, name: value}),
        headers: {
        "Content-Type": "application/json; charset=UTF-8"
        }
    }) 
    return await response.json()
}
dbRemove_department = async (id) => {
    let response = await fetch("/api/departments/remove.php", {
        method: "POST",
        body: JSON.stringify({id: id}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    }) 
    return await response.json()
}
