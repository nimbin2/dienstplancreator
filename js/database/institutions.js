dbAdd_institution = async (name, yearweek) => {
    let response = await fetch("/api/institution/add.php", {
		method: "POST",
		body: JSON.stringify({name: name, yearweek: yearweek}),
		headers: {
		"Content-Type": "application/json; charset=UTF-8"
		}
    })
    return await response.json()
}
dbGet_institution = async (id) => {
	let response = await fetch("/api/institution/get.php", {
		method: "POST",
		body: JSON.stringify({id: id}),
		headers: {
		"Content-Type": "application/json; charset=UTF-8"
		}
	})
	return await response.json()
}
dbGet_institutions = async () => {
    let response = await fetch("/api/institution/getAll.php", {
		method: "POST",
		headers: { "Content-Type": "application/json; charset=UTF-8" }
	})
	return await response.json()
}
dbSwitch_institution = async (id) => {
	let response = await fetch("/api/institution/switch.php", {
		method: "POST",
		body: JSON.stringify({id: id}),
		headers: { "Content-Type": "application/json; charset=UTF-8" }
	})
	return await response.json()
}
dbSwitchAs_institution = async (id, as) => {
	let response = await fetch("/api/institution/switchAs.php", {
		method: "POST",
		body: JSON.stringify({id: id, as: as}),
		headers: { "Content-Type": "application/json; charset=UTF-8" }
	})
	return await response.json()
}
dbRemove_institution = async (data_id, password) => {
    let response = await fetch("/api/institution/remove.php", {
		method: "POST",
		body: JSON.stringify({data_id: data_id, password: password}),
		headers: {
		"Content-Type": "application/json; charset=UTF-8"
		}
    })
	return await response.json()
}
