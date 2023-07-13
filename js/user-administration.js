
logout = () => {
    fetch("/api/logout.php", {
        method: "POST",
        headers: {
        "Content-Type": "application/json; charset=UTF-8"
        }
    }).then(() => {window.location = "login.php"})
}
addNewUser = () => {
    let block = document.querySelector(".Popup-add-new-user")
    let block_hint = block.querySelector(".hint")
    let password = block.querySelector(".password").value
    let password_1 = block.querySelector(".password-confirm").value
    let role = block.querySelector(".select-role").value
    let connected = block.querySelector(".connect").checked
    let name
    let connected_id
    if (role === "admin" && !connected) {
        name = block.querySelector(".name").value
    } else { 
        connected_id = parseFloat(block.querySelector(".name").value)
        name = PERSONS.find(p => p.id === connected_id).name
    }
    if (password !== password_1) {
        block_hint.innerHTML = "Passwörter stimmen nicht überein."
        return
    } 
    if (password.length < 8) {
        block_hint.innerHTML = "Das passwort sollte mindestens 8 stellen haben."
        return
    }
    addU = async () => {
        connected = connected_id ? connected_id : "false"
		let response = await fetch("/api/account/addUserDefaultData.php", {
			method: "POST",
			body: JSON.stringify({name: name, password: password, role: role, connected: connected}),
			headers: { "Content-Type": "application/json; charset=UTF-8" }
		})  
		let user_id = await response.json()
		if (isNaN(user_id)) {
			block_hint.innerHTML = user_id
		} else {
			renderUsers()
			closeAddUser()
		}
    }
	addU()
}
closeAddUser = () => {
    let block = document.querySelector(".Popup-add-new-user")
    block.querySelector(".hint").innerHTML = ""
    block.querySelector(".name").value = ""
    block.querySelector(".password").value = ""
    block.querySelector(".password-confirm").value = ""
	block.classList.remove("active")
}
changeConnected = (value) => {
    if (value) {
        renderNameSelect()
    } else {
        let block = document.querySelector(".Popup-add-new-user")
        let block_name_container = block.querySelector(".container-name")
        let block_name = document.createElement("input")
        block_name.classList.add("name")
        block_name_container.innerHTML = ""
        block_name_container.appendChild(block_name)
    }
}
changeRoleSelect = (value) => {
    let block = document.querySelector(".Popup-add-new-user")
    let block_input_connect = block.querySelector(".connect")
    let block_label_connect = block.querySelector(".connect-label")
    if (value === "admin" && PERSONS.length === 0) {
        block.querySelector(".hint-user").innerHTML = ""
        block_input_connect.classList.add("d-none")
        block_label_connect.classList.add("d-none")
        changeConnected(false)
        block.querySelector(".connect").checked = false
        block.querySelector(".confirm").classList.remove("d-none")
    } else if (value === "admin") {
        block.querySelector(".hint-user").innerHTML = ""
        block_input_connect.classList.remove("d-none")
        block_label_connect.classList.remove("d-none")
    } else {
        changeConnected(true)
        block_input_connect.classList.add("d-none")
        block_label_connect.classList.add("d-none")
    }
}
renderNameSelect = () => {
    let block = document.querySelector(".Popup-add-new-user")
    block.querySelector(".hint-user").innerHTML = ""
    block.querySelector(".confirm").classList.remove("d-none")
    if (PERSONS.length === 0) {
        block.querySelector(".hint-user").innerHTML = "Um Benutzer hinzufügen zu können musst du im Schichtplan Personen hinzufügen."
        block.querySelector(".confirm").classList.add("d-none")
    }
    let block_select_container = block.querySelector(".container-name")
    block_select_container.innerHTML = ""
    let block_select_label = document.createElement("label")
    block_select_label.classList.add("chevron-select", "chevron-down")
    let block_select_name = document.createElement("select")
    block_select_name.classList.add("name")
    for (let i=0; i<PERSONS.length; i++) {
        let person = PERSONS[i]
        if (USERS.map(u => u.connected_person).indexOf(person.id) > -1) {continue}
        let block_option = document.createElement("option")
        block_option.setAttribute("value", person.id)
        block_option.innerHTML = person.name
        block_select_name.appendChild(block_option)
    }
    block_select_label.appendChild(block_select_name)
    block_select_container.appendChild(block_select_label)
}
renderAddUser = async () => {
    let block = document.querySelector(".Popup-add-new-user")
    if (PERSONS.length === 0) {
        changeRoleSelect("admin")
        document.querySelector(".Popup-add-new-user .select-role").value = "admin"
    } else {
        renderNameSelect()
    }
    block.classList.add("active")
}
changePassword = () => {
    let block = document.querySelector(".Popup-edit-user")
    let user_id = parseFloat(block.getAttribute("user_id"))
    let pw_1 = block.querySelector(".password_1").value
    let pw_2 = block.querySelector(".password_2").value
    if (pw_1 !== pw_2) {
        block.querySelector(".hint-password").innerHTML = "Die Passwörter stimmen nicht überein."
        return
    }
    fetch("/api/account/updatePassword.php", {
        method: "POST",
        body: JSON.stringify({id: user_id, password: pw_1}),
        headers: {
        "Content-Type": "application/json; charset=UTF-8"
        }
    }).then((response) => response.json()).then(data => {
        if (data === user_id) {
            window.location = "/useradmin.php"
        } else {
            block.querySelector(".hint-password").innerHTML = data
        }
    })
    
}
changeName = () => {
    let block = document.querySelector(".Popup-edit-user")
    let user_id = parseFloat(block.getAttribute("user_id"))
    let user_name = block.querySelector(".container-name .name").value
    fetch("/api/account/updateName.php", {
        method: "POST",
        body: JSON.stringify({id: user_id, name: user_name}),
        headers: {
        "Content-Type": "application/json; charset=UTF-8"
        }
    }).then((response) => response.json()).then(data => {
        if (data === user_name) {
            window.location = "/useradmin.php"
        } else {
            block.querySelector(".hint-name").innerHTML = data
        }
    })
    
}
getPersons = async () => {
    let response_persons = await fetch("/api/persons_active/getAllActiveIdAndName.php", {
        method: "POST",
        body: JSON.stringify({yearweek: DATE_YEAR_WEEK}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })
    let persons = await response_persons.json()
    return persons.sort((a,b) => a.name.localeCompare(b.name))
}
renderEditUser = (user_id, user_name) => {
    let block = document.querySelector(".Popup-edit-user")
    let block_title_name = block.querySelector("h2.name")
    block_title_name.innerHTML = user_name
    block.classList.add("active")
    block.setAttribute("user_id", user_id)
    block.querySelector("input.name").value = user_name
}
renderUsers = async () => {
    PERSONS = await getPersons()
    let ROLES = [{c: "user", n: "Benutzer"}, {c: "admin", n: "Einrichtungs-Administrator"}]
    USERS = await dbGet_users()
    let block = document.querySelector("#Users")
    block.innerHTML = ""
    let block_name_title = document.createElement("div")
    block_name_title.innerHTML = "Name"
    block_name_title.classList.add("title")
    block.appendChild(block_name_title)
    let block_role_title = document.createElement("div")
    block_role_title.innerHTML = "Rolle"
    block_role_title.classList.add("title")
    block.appendChild(block_role_title)
    let block_created_title = document.createElement("div")
    block_created_title.innerHTML = "Erstellt"
    block_created_title.classList.add("title")
    block.appendChild(block_created_title)
    let block_edit_title = document.createElement("div")
    block_edit_title.classList.add("title")
    block.appendChild(block_edit_title)
    USERS.forEach(user => {
        let block_name = document.createElement("div")
        block_name.innerHTML = user.name
        block.appendChild(block_name)
        let block_role = document.createElement("div")
        block_role.innerHTML = ROLES.find(r => r.c === user.role).n
        block.appendChild(block_role)
        let block_created = document.createElement("div")
        block_created.innerHTML = `${user.created_at.substring(8, 10)}.${user.created_at.substring(5, 7)}.${user.created_at.substring(0, 4)}`
        block.appendChild(block_created)
        let block_edit = document.createElement("button")
        block_edit.innerHTML = "Bearbeiten"
        block_edit.setAttribute("onClick", `renderEditUser(${user.id}, "${user.name}")`)
        block.appendChild(block_edit)
    })
    let block_add = document.createElement("button")
    block_add.setAttribute("onClick", `renderAddUser()`)
    block_add.setAttribute("id", "Users-add-button")
    block_add.innerHTML = "Hinzufügen"
    block.appendChild(block_add)

}

closePopup = () => {
    let popups = document.querySelectorAll(".Popup.active")
    for (let i=0; i<popups.length; i++) {
        popups[i].classList.remove("active")
    }
    let clear_inputs = document.querySelectorAll(".Popup input")
    for (i=0; i<clear_inputs.length; i++) {
        clear_inputs[i].value = ""
    }
}
