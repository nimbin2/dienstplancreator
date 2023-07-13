dbAdd_settings = (database_version, default_overtime, default_edit_cell_right, default_row_top, default_row_bottom, sort_days, sort_week, printmode, zoom_web, zoom_print_h, zoom_print_v) => {
    let data = { database_version: database_version.toString(), default_overtime: default_overtime ? 1 : 0, default_edit_cell_right: default_edit_cell_right ? 1 : 0, default_row_top: default_row_top ? 1 : 0, default_row_bottom: default_row_bottom ? 1 : 0, sort_days: sort_days.toString(), sort_week: sort_week.toString(), printmode: printmode, zoom_web: parseFloat(zoom_web), zoom_print_h: zoom_print_h, zoom_print_v: zoom_print_v }
    fetch("/api/settings/add.php", {
		method: "POST",
		body: JSON.stringify(data),
		headers: {
		"Content-Type": "application/json; charset=UTF-8"
		}
    })
}
dbSet_settings_where = async (name, value) => {
	let data = {name: name, value: value}
    let response = await fetch("/api/settings/update.php", {
		method: "POST",
		body: JSON.stringify(data),
		headers: {
		"Content-Type": "application/json; charset=UTF-8"
		}
    })
    return await response.json()
}
dbGet_settings = async () => {
	let response = await fetch("/api/settings/getAll.php", {
		method: "POST",
		headers: {
		"Content-Type": "application/json; charset=UTF-8"
		}
	})
	return await response.json()
}
dbGet_settings_where = async (name) => {
    let response = await fetch("/api/settings/get.php", {
		method: "POST",
		body: JSON.stringify({name: name}),
		headers: {
		"Content-Type": "application/json; charset=UTF-8"
		}
	})
	return await response.json()
}

dbSet_settings_edit_cell_default    = (value) => { dbSet_settings_where("default_edit_cell_right", value) }

dbSet_settings_edit_row_top_default    = (value) => { dbSet_settings_where("default_row_top", value) }

dbSet_settings_edit_row_bottom_default    = (value) => { dbSet_settings_where("default_row_bottom", value) }

// [{t: string, a: string},..]
dbAdd_settings_label = (id, name, cut) => { 
    let label = {id: id, name: name, cut: cut}
    fetch("/api/settings_labels/add.php", {
		method: "POST",
		body: JSON.stringify(label),
		headers: {
		"Content-Type": "application/json; charset=UTF-8"
		}
    })
}
dbGet_settings_labels = async () => { 
    let data
	return await fetch("/api/settings_labels/get.php", {
		method: "POST",
		body: JSON.stringify(data),
		headers: {
		"Content-Type": "application/json; charset=UTF-8"
		}
	})
	.then((response) => {return response.json()})
    .then((data) => { return data.labels})
}
dbGet_settings_label        = (id) => { return SETTINGS_LABELS.find(l => l.id === id)}
dbGet_settings_label_text   = (id) => { return dbGet_settings_label(id).name }
dbGet_settings_label_cut    = (id) => { return dbGet_settings_label(id).cut }
dbSet_settings_label_text   = async (id, text) => { 
    let l = dbGet_settings_label(id) 
    let data = {id: l.id, name: text, cut: l.cut}
	return await fetch("/api/settings_labels/update.php", {
		method: "POST",
		body: JSON.stringify(data),
		headers: {
		"Content-Type": "application/json; charset=UTF-8"
		}
	})
}
dbSet_settings_label_cut    = async (id, cut) => { 
    let l = dbGet_settings_label(id) 
    let data = {id: l.id, name: l.name, cut: cut}
	return await fetch("/api/settings_labels/update.php", {
		method: "POST",
		body: JSON.stringify(data),
		headers: {
		"Content-Type": "application/json; charset=UTF-8"
		}
	}) 
}

// boolean
dbSet_settings_overtime_default    = (value) => { dbSet_settings_where("default_overtime", value ? 1 : 0) }
dbGet_settings_overtime_default    = async () => { return (await dbGet_settings_where("default_overtime")) === "0" ? false : true }

// 0 || 1
dbSet_settings_printmode    = (value) => { dbSet_settings_where("printmode", value) }
dbGet_settings_printmode    = async () => { return await dbGet_settings_where("printmode") }

// ["string", "string"]
dbSet_settings_sort_days    = async (value) => { return await dbSet_settings_where("sort_days", value.toString())}
dbGet_settings_sort_days    = async () => { return (await dbGet_settings_where("sort_days")) }

// decimal
dbSet_settings_version    = (value) => { dbSet_settings_where("database_version", value) }
dbGet_settings_version    = () => { dbGet_settings_where("database_version")}

// ["string", "string"]
dbSet_settings_sort_week    = async (value) => {return await dbSet_settings_where("sort_week", value.toString())}
dbGet_settings_sort_week    = async () => { return (await dbGet_settings_where("sort_week")) }

// decimal
dbSet_settings_zoom_web    = (value) => { dbSet_settings_where("zoom_web", value) }
dbGet_settings_zoom_web    = async () => { return await dbGet_settings_where("zoom_web") }

// decimal
dbSet_settings_zoom_print_h    = (value) => { dbSet_settings_where("zoom_print_h", value) }
dbGet_settings_zoom_print_h    = async () => { return await dbGet_settings_where("zoom_print_h") }

// decimal
dbSet_settings_zoom_print_v    = (value) => { dbSet_settings_where("zoom_print_v", value) }
dbGet_settings_zoom_print_v    = async () => { return await dbGet_settings_where("zoom_print_v") }
