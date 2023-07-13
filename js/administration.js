
logout = () => {
    fetch("/api/logout.php", {
        method: "POST",
        headers: {
        "Content-Type": "application/json; charset=UTF-8"
        }
    }).then(() => {window.location = "login.php"})
}
closePopup = () => {
    let block = document.querySelector(".Popup-request-remove-institution")
    block.classList.remove("active")
    block.querySelector(".password").value = ""
    document.querySelector(".Popup-request-remove-institution .hint").innerHTML = ""
}
addNewInstitution = () => {
    let block_name = document.querySelector(".Popup-add-new .name")
    let name = block_name.value
    if (name.length === 0) {return}
    dbAdd_institution(name, DATE_YEAR_WEEK).then(() => {
        block_name.value = ""
        renderInstitutions()
        document.querySelector(".Popup-add-new").classList.remove("active")
    })
}
removeInstitution = async (id) => {
    let check = await dbRemove_institution(id, document.querySelector(".Popup-request-remove-institution .password").value)
    if (check) {
        closePopup()
        renderInstitutions()
        renderUsers()
    } else {
        document.querySelector(".Popup-request-remove-institution .hint").innerHTML = "Passwort stimmt nicht überein."
    }
}
requestRemoveInstitution = (id, name) => {
    let block = document.querySelector(".Popup-request-remove-institution")
    block.classList.add("active")
    let block_name = block.querySelector(".name")
    block_name.innerHTML = name
    let password = block.querySelector(".password").value
    let block_confirm = block.querySelector(".confirm")
    block_confirm.setAttribute("onClick", `removeInstitution(${id})`)
}
visiteInstitution = async (data_id, as) => {
    dbSwitchAs_institution(data_id, as).then(() => {window.location = "/";})
}
renderInstitutions = async () => {
    let institutions = await dbGet_institutions()
    let block = document.querySelector("#Institutions")
    block.innerHTML = ""
    institutions.forEach(institution => {
        let block_name = document.createElement("div")
        block_name.classList.add("name")
        block_name.innerHTML = institution.name
        block.appendChild(block_name)
        /*
        let block_visite_container = document.createElement("div")
        block_visite_container.classList.add("container-visite")
        let block_visite = document.createElement("button")
        block_visite.innerHTML = "Anschauen"
        block_visite.setAttribute("onClick", `visiteInstitution(${institution.id}, "visitor")`)
        block_visite_container.appendChild(block_visite)
        let block_edit = document.createElement("button")
        block_edit.innerHTML = "Bearbeiten"
        block_edit.setAttribute("onClick", `visiteInstitution(${institution.id}, "editor")`)
        block_visite_container.appendChild(block_edit)
        block.appendChild(block_visite_container)
        */
        let block_remove_container = document.createElement("div")
        block_remove_container.classList.add("container-remove")
        let block_remove = document.createElement("button")
        block_remove.setAttribute("onClick", `requestRemoveInstitution(${institution.id}, "${institution.name}")`)
        block_remove.innerHTML = "Löschen"
        block_remove_container.appendChild(block_remove)
        block.appendChild(block_remove_container)
    })
    let block_add = document.createElement("button")
    block_add.setAttribute("onClick", `document.querySelector(".Popup-add-new").classList.add("active")`)
    block_add.setAttribute("id", "Institution-add-button")
    block_add.innerHTML = "Hinzufügen"
    block.appendChild(block_add)
}
changeSelectRole = (role) => {
    if (role === "superadmin") {
        document.querySelector(".Popup-container .label-institution").classList.add("d-none")
        document.querySelector(".Popup-container .label-select-institution").classList.add("d-none")
    } else {
        document.querySelector(".Popup-container .label-institution").classList.remove("d-none")
        document.querySelector(".Popup-container .label-select-institution").classList.remove("d-none")
    }
}
addNewUser = () => {
    let block = document.querySelector(".Popup-add-new-user")
    let block_hint = block.querySelector(".hint")
    let name = block.querySelector(".name").value
    let password = block.querySelector(".password").value
    let password_1 = block.querySelector(".password-confirm").value
    let institution = parseFloat(block.querySelector(".select-institution").value)
    let role = block.querySelector(".select-role").value
    if (password !== password_1) {
        block_hint.innerHTML = "Passwörter stimmen nicht überein."
        return
    } 
    if (password.length < 8) {
        block_hint.innerHTML = "Das passwort sollte mindestens 8 stellen haben."
        return
    }
    addU = async () => {
		let response = await fetch("/api/account/addUser.php", {
			method: "POST",
			body: JSON.stringify({name: name, password: password, role: role, data_id: institution}),
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
renderAddUser = async () => {
    let block = document.querySelector(".Popup-add-new-user")
    let block_select_institutions = block.querySelector(".select-institution")
    block_select_institutions.innerHTML = ""
    let institutions = await dbGet_institutions()
    institutions.forEach((institution, iid) => {
        let block_option = document.createElement("option")
        block_option.innerHTML = institution.name
        block_option.value = institution.id
        if (iid === 0) {
            block_option.setAttribute("selected", "selected")
        }
        block_select_institutions.appendChild(block_option)
    })

    document.querySelector(".Popup-add-new-user").classList.add("active")
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
            window.location = "/admin.php"
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
            window.location = "/admin.php"
        } else {
            block.querySelector(".hint-name").innerHTML = data
        }
    })  
    
}
renderEditUser = (user_id, user_name) => {
    let block = document.querySelector(".Popup-edit-user")
    let block_title_name = block.querySelector("h2.name")
    block_title_name.innerHTML = user_name
    block.classList.add("active")
    block.setAttribute("user_id", user_id)
    block.querySelector("input.name").value = user_name
}
removeUser = (user_id, data_id) => {
    let block = document.querySelector(".Popup-remove-user")
    let password = block.querySelector(".password").value
    fetch("/api/account/removeUser.php", {
        method: "POST",
        body: JSON.stringify({user_id: user_id, data_id: data_id, password: password}),
        headers: {
        "Content-Type": "application/json; charset=UTF-8"
        }
    }).then((response) => response.json()).then(data => {
        if (data === user_id) {
            window.location = "/admin.php"
        } else {
            block.querySelector(".hint").innerHTML = data
        }
    })  
}
renderRemoveUser = (user_id, user_name, data_id) => {
    let block = document.querySelector(".Popup-remove-user")
    block.setAttribute("user_id", user_id)
    block.classList.add("active")
    let block_name = block.querySelector(".name")
    block_name.innerHTML = user_name
    let block_confirm = block.querySelector(".confirm")
    block_confirm.setAttribute("onClick", `removeUser(${user_id}, ${data_id})`)
}
renderUsers = async () => {
    let ROLES = [{c: "user", n: "Benutzer"}, {c: "admin", n: "Einrichtungs-Administrator"}, {c: "superadmin", n: "Super-Administrator"}]
    let users = await dbGet_users()
    let institutions = await dbGet_institutions()
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
    let block_institution_title = document.createElement("div")
    block_institution_title.innerHTML = "Einrichtung"
    block_institution_title.classList.add("title")
    block.appendChild(block_institution_title)
    let block_created_title = document.createElement("div")
    block_created_title.innerHTML = "Erstellt"
    block_created_title.classList.add("title")
    block.appendChild(block_created_title)
    let block_edit_title = document.createElement("div")
    block_edit_title.classList.add("title")
    block.appendChild(block_edit_title)
    let block_remove_title = document.createElement("div")
    block_remove_title.classList.add("title")
    block.appendChild(block_remove_title)
    for (let u=0; u<users.length; u++) {
        let user = users[u]
        if (user.role === "user") { continue }
        let block_name = document.createElement("div")
        block_name.innerHTML = user.name
        block.appendChild(block_name)
        let block_role = document.createElement("div")
        block_role.innerHTML = ROLES.find(r => r.c === user.role).n
        block.appendChild(block_role)
        let block_institution = document.createElement("div")
        block_institution.innerHTML = user.role === "superadmin" ? "" : institutions?.find(i => i.id === user.data_id)?.name
        block.appendChild(block_institution)
        let block_created = document.createElement("div")
        block_created.innerHTML = `${user.created_at.substring(8, 10)}.${user.created_at.substring(5, 7)}.${user.created_at.substring(0, 4)}`
        block.appendChild(block_created)
        let block_edit = document.createElement("button")
        block_edit.innerHTML = "Bearbeiten"
        block_edit.setAttribute("onClick", `renderEditUser(${user.id}, "${user.name}")`)
        block.appendChild(block_edit)
        let block_remove = document.createElement("button")
        block_remove.innerHTML = "Löschen"
        block_remove.setAttribute("onClick", `renderRemoveUser(${user.id}, "${user.name}", ${user.data_id})`)
        block.appendChild(block_remove)
    }
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
