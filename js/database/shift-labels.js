//[{}]
dbAdd_shift_label = async (name, cut) => { 
	let sl = {name: name, cut: cut}
	let response = await fetch("/api/shift_labels/add.php", {
        method: "POST",
        body: JSON.stringify(sl),
        headers: {
        "Content-Type": "application/json; charset=UTF-8"
        }
    })
    return await response.json()
}
dbGet_shift_labels     = async() => { 
    let response = await fetch("/api/shift_labels/get.php", {
        method: "POST",
        headers: {
        "Content-Type": "application/json; charset=UTF-8"
        }
    })  
    let shift_labels = await response.json()
    return shift_labels.shift_labels
}
// {i: int, n: string, c: string}
dbGet_shift_label      = (id) => { return SHIFT_LABELS.find(l => l.id === id)}
dbGet_shift_label_text = (id) => { return dbGet_shift_label(id)?.name }
dbSet_shift_label_text = (id, value) => {
    let sl = {id: id, name: value, cut: dbGet_shift_label_cut(id)}
    console.log("##", sl)
	fetch("/api/shift_labels/update.php", {
        method: "POST",
        body: JSON.stringify(sl),
        headers: {
        "Content-Type": "application/json; charset=UTF-8"
        }
    })
}
dbGet_shift_label_cut  = (id) => { return dbGet_shift_label(id)?.cut }
dbSet_shift_label_cut  = (id, value) => { 
    let sl = {id: id, name: dbGet_shift_label_text(id), cut: value}
	fetch("/api/shift_labels/update.php", {
        method: "POST",
        body: JSON.stringify(sl),
        headers: {
        "Content-Type": "application/json; charset=UTF-8"
        }
    }) 
}
dbRemove_shift_label   = (id) => { 
	fetch("/api/shift_labels/remove.php", {
        method: "POST",
        body: JSON.stringify({id: id}),
        headers: {
        "Content-Type": "application/json; charset=UTF-8"
        }
    }) 
}

