

let EDIT_PERSONS_ACTIVATION
let EDIT_PERSONS_MPA
let EDIT_PERSONS_FREEDAYS
let EDIT_PERSONS_NAME
let EDIT_PERSONS_HOURS
let EDIT_PERSONS_DEPARTMENT
let EDIT_PERSONS_SHIFT_ACTIVATION
let EDIT_PERSONS_SHIFT_LABEL_ACTIVATION
let EDIT_PERSONS_SHIFT_LABEL
let EDIT_PERSONS_SHIFT_FREE
let EDIT_PERSONS_SHIFT_AVERAGE_ACTIVATION
let EDIT_PERSONS_SHIFT_AVERAGE

resetEditPersonCheckValues = () => {
    EDIT_PERSONS_ACTIVATION = undefined
    EDIT_PERSONS_MPA = undefined
    EDIT_PERSONS_FREEDAYS = undefined
    EDIT_PERSONS_NAME = undefined
    EDIT_PERSONS_HOURS = undefined
    EDIT_PERSONS_DEPARTMENT = undefined
    EDIT_PERSONS_SHIFT_ACTIVATION = undefined
    EDIT_PERSONS_SHIFT_LABEL_ACTIVATION = undefined
    EDIT_PERSONS_SHIFT_LABEL = undefined
    EDIT_PERSONS_SHIFT_FREE = undefined
    EDIT_PERSONS_SHIFT_AVERAGE_ACTIVATION = undefined
    EDIT_PERSONS_SHIFT_AVERAGE = undefined
}

getPersonById = async (person_id) => {
    return getActivePersonById(person_id).then(person => {
        if (typeof person === "undefined") {
            return dbGet_person_removed(DATE_YEAR_WEEK, person_id).then(person => {return person})
        } else {
            return person
        }
    })
}
getActivePersonById = async (person_id, year_week) => {
    if ((PERSONS.length > 0) && ((typeof year_week === "undefined") || (year_week === DATE_YEAR_WEEK))) {
        return PERSONS.find(a => a.id === parseFloat(person_id))
    } else if (year_week === DATE_YEAR_WEEK_TABLE_FROM) {
        return PERSONS_TABLE_FROM.find(a => a.id === parseFloat(person_id))
    } else if (year_week === DATE_YEAR_WEEK_TABLE_TO) {
        return PERSONS_TABLE_TO.find(a => a.id === parseFloat(person_id))
    } else {
        return await dbGet_person_active(year_week, parseFloat(person_id))
    }
}

setPerson = async () => {
    return dbGet_persons_active_where_yearweek(DATE_YEAR_WEEK).then(persons => {
        PERSONS = persons
        return sortPersonRosterWeek(0).then(() => {
            return sortPersonRosterWeek(1)
        })
    })
}
setActivePerson = (person_id, year_week) => {
    if ((year_week === DATE_YEAR_WEEK) || (typeof year_week === "undefined")) {
        return dbGet_person_active(DATE_YEAR_WEEK, person_id).then(person => {
            let ppid = PERSONS.map(p => p.id).indexOf(person_id)
            let pwid = PERSONS_WEEK.map(p => p.id).indexOf(person_id)
            let prid = PERSONS_ROSTER.map(p => p.id).indexOf(person_id)
            if (person) {
                PERSONS[ppid] = person
                PERSONS_WEEK[pwid] = person
                PERSONS_ROSTER[prid] = person
            } else {
                PERSONS = PERSONS.filter(p => p.id !== person_id)
                PERSONS_WEEK = PERSONS_WEEK.filter(p => p.id !== person_id)
                PERSONS_ROSTER = PERSONS_ROSTER.filter(p => p.id !== person_id)
            }
            return person
        })
    } else if (year_week === DATE_YEAR_WEEK_TABLE_TO) {
        return dbGet_person_active(year_week, person_id).then(person => {
            let ppid = PERSONS_TABLE_TO.map(p => p.id).indexOf(person_id)
            if (typeof person === "undefined") {
                PERSONS_TABLE_TO = PERSONS_TABLE_TO.filter(p => p.id !== person_id)
            } else {
                PERSONS_TABLE_TO[ppid] = person
            }
            return person
        })
    }
}

addPerson = () => {
    showLoading("addPerson")
	let person_new = {activated: DATE_YEAR_WEEK, name: "", hours: HOURS_DEFAULT, department: DEPARTMENTS[0].id, mpa: []}
    DAYS.forEach(d => {person_new.mpa.push(0)})
    callback = () => {
        setPerson().then(() => {
            editPerson(PERSON_NEW_ID, true).then(() => hideLoading("addPerson") )
        })
    }
    dbAdd_person(person_new).then(pni => {
        PERSON_NEW_ID = pni
        person_new.id = PERSON_NEW_ID
        let cl = dbGet_closingtimes_lawful()
        if (cl.length === 0) {
            callback()
        } else {
            cl.forEach((c, c_id) => {
                if (getDateToRosterDate(c.end)[0] >= DATE_YEAR_WEEK) {
                    dbAdd_closingtime_person(c.id, PERSON_NEW_ID).then(() => {
                        if (c_id === cl.length-1) {
                            callback()
                        }
                    })
                } else {
                    if (c_id === cl.length-1) {
                        callback()
                    }
                }
            })
        }
    })
}

removePerson = (person_id) => {
    getActivePersonById(person_id).then(person => {
        let block = document.getElementById("Edit-person")
        block.classList.remove("active")
        block.setAttribute("person", "")
        block.classList.remove("active")

        block.setAttribute("person", "")

        DAYS.forEach((day, day_id) => removePersonFromShiftDay(person.id, day_id))

        dbGet_shifts_where_person(person_id).then(shifts => {
            if (shifts.length > 0) { 
                dbSet_person_change_where_yearweek_day_and_person_and_key(DATE_YEAR_WEEK, 999, person_id, "r", true).then(() => {
                    window.location = ""
                })
            } else {
                dbRemove_person(person_id).then(() => {
                    window.location = ""
                })
            }
        })
    })
} 

setPersonChange = (person_id, assign_to, key, year_week, day_id, value) => {
    return getActivePersonById(person_id, year_week).then(person_active => {
        let old_v
        if (key === "sl") {old_v = person_active.sl[day_id]}
        else if (key === "sa") {old_v = person_active.sa[day_id]}
        else if (key === "sf") {old_v = person_active.sf[day_id]}

        if (assign_to === "all") {
            return dbSet_person_changes_where_yearweek_is_ge_and_day_and_person_and_key(person_active.activated, day_id, person_id, key, value).then(() => {
                return dbSet_person_changes_where_day_and_person_and_key(day_id, person_id, key, value).then(() => {
                    return dbSet_person_change_where_yearweek_day_and_person_and_key(person_active.activated, day_id, person_id, key, value).then(() => {
                        if (key === "sf" && value) { return dbRemove_shift_where_person_and_day(person_id, day_id).then(() => {return}) }
                        else {return}
                    })
                })
            })
        } else if (assign_to === "ongoing") {
            return dbSet_person_changes_where_yearweek_is_ge_and_day_and_person_and_key(year_week, day_id, person_id, key, value).then(() => {
                return dbSet_person_change_where_yearweek_day_and_person_and_key(year_week, day_id, person_id, key, value).then(() => {
                    if (key === "sf" && value) { return dbRemove_shift_where_person_and_year_week_ge_and_day(person_id, year_week, day_id).then(() => {return})}
                    else {return}
                })
            })
        } else if (assign_to === "justthis") {
            let next_yw = getDateToRosterDate(new Date(new Date(getDateOfISOWeek(year_week)).getTime() + 7 * 24 * 60 * 60 * 1000))[0]
            return dbGet_person_change_where_yearweek_and_day_and_person_and_key(next_yw, day_id, person_id, key).then(change_n => {
                callS = () => {
                    return dbSet_person_change_where_yearweek_day_and_person_and_key(year_week, day_id, person_id, key, value).then(() => {
                        if (key === "sf" && value) {return dbRemove_shift_where_person_and_year_week_and_day(person_id, year_week, day_id).then(() => {return })}
                        else {return}
                    })
                }
                if (change_n.length === 0) {
                    return dbAdd_person_change_where_yearweek_and_day_and_person_and_key(next_yw, day_id, person_id, key, old_v).then(() => {
                        return callS()
                    })
                } else {
                    return callS()
                }
            })

        }
    })
}

setPersonShiftActivation = async (person_id) => {
    for (let i=0; i<EDIT_PERSONS_SHIFT_ACTIVATION.length; i++) {
        let activation = EDIT_PERSONS_SHIFT_ACTIVATION[i]
        if (activation.v) continue
        let day_id = activation.d
        let assign_to = document.querySelector("#Edit-person-shift-settings .select-assign-container select").value
        if (i === EDIT_PERSONS_SHIFT_ACTIVATION.length-1) {
            return setPersonChange(person_id, assign_to, "sl", DATE_YEAR_WEEK, day_id, false).then(() => {
                return setPersonChange(person_id, assign_to, "sf", DATE_YEAR_WEEK, day_id, false).then(() => {
                    return setPersonChange(person_id, assign_to, "sa", DATE_YEAR_WEEK, day_id, false).then(() => {
                        if (i === EDIT_PERSONS_SHIFT_ACTIVATION.length-1) {return}
                    })
                })
            })
        } else {
            await setPersonChange(person_id, assign_to, "sl", DATE_YEAR_WEEK, day_id, false).then(() => {return})
            await setPersonChange(person_id, assign_to, "sf", DATE_YEAR_WEEK, day_id, false).then(() => {return})
            await setPersonChange(person_id, assign_to, "sa", DATE_YEAR_WEEK, day_id, false).then(() => {return})
        }
    }
    
}
setPersonShiftLabelActivation = async (person_id) => {
    let assign_to = document.querySelector("#Edit-person-shift-settings .select-assign-container select").value
    for (let i=0; i<EDIT_PERSONS_SHIFT_LABEL_ACTIVATION.length; i++) {
        let activation = EDIT_PERSONS_SHIFT_LABEL_ACTIVATION[i]
        if (activation.v && i === EDIT_PERSONS_SHIFT_LABEL_ACTIVATION.length-1) {return}
        if (activation.v) continue
        if (i === EDIT_PERSONS_SHIFT_LABEL_ACTIVATION.length-1) {
            return setPersonChange(person_id, assign_to, "sl", DATE_YEAR_WEEK, activation.d, false).then(() => { return})
        } else {
            await setPersonChange(person_id, assign_to, "sl", DATE_YEAR_WEEK, activation.d, false).then(() => {return})
        }
    }
} 
setPersonShiftLabel = async (person_id) => {
    let assign_to = document.querySelector("#Edit-person-shift-settings .select-assign-container select").value
    for (let i=0; i<EDIT_PERSONS_SHIFT_LABEL.length; i++) {
        let label = EDIT_PERSONS_SHIFT_LABEL[i]
        if (i === EDIT_PERSONS_SHIFT_LABEL.length-1) {
            return setPersonChange(person_id, assign_to, "sl", DATE_YEAR_WEEK, label.d, label.v).then(() => {return})
        } else {
            await setPersonChange(person_id, assign_to, "sl", DATE_YEAR_WEEK, label.d, label.v).then(() => {return})
        }
    }
}
setPersonShiftFree = async (person_id) => {
    let assign_to = document.querySelector("#Edit-person-shift-settings .select-assign-container select").value
    for (let i=0; i<EDIT_PERSONS_SHIFT_FREE.length; i++) {
        let free = EDIT_PERSONS_SHIFT_FREE[i]
        if (i === EDIT_PERSONS_SHIFT_FREE.length-1) {
            return setPersonChange(person_id, assign_to, "sf", DATE_YEAR_WEEK, free.d, free.v).then(() => {return})
        } else {
            await setPersonChange(person_id, assign_to, "sf", DATE_YEAR_WEEK, free.d, free.v).then(() => {return})
        }
    }
}
setPersonShiftAverage = async (person_id) => {
    let assign_to = document.querySelector("#Edit-person-shift-settings .select-assign-container select").value

    for (let i=0; i<EDIT_PERSONS_SHIFT_AVERAGE.length; i++) {
        let average = EDIT_PERSONS_SHIFT_AVERAGE[i]
        if (i === EDIT_PERSONS_SHIFT_AVERAGE.length-1) {
            return setPersonChange(person_id, assign_to, "sa", DATE_YEAR_WEEK, average.d, average.v).then(() => {return})
        } else {
            await setPersonChange(person_id, assign_to, "sa", DATE_YEAR_WEEK, average.d, average.v).then(() => {return})
        }
    }
}
eventListenerEditPerson = (evt, is_new) => {
    let block_container = document.getElementById("Edit-person-container")
    let targetEl = evt.target
    do {
        if (block_container.contains(targetEl)) return
        else {targetEl = ""}
    } while (targetEl);
    closeEditPerson(is_new)
}

closeEditPerson = async (is_new) => {
    showLoading("closeEditPerson")
    let block = document.getElementById("Edit-person")
    let person_id = parseFloat(block.getAttribute("person"))
    let reload = false
    let name = block.getElementsByClassName("name")[0].querySelector("input").value
    let hours = block.getElementsByClassName("hours")[0].querySelector("input").value
    if (is_new && name.length === 0) {
        dbRemove_person(person_id)
        window.location = ""
        return
    }
    if ((name.length === 0) || (hours.length === 0)) {
        hideLoading("closeEditPerson")
        return
    }

    funA = async () => {if (typeof EDIT_PERSONS_ACTIVATION !== "undefined") { reload = true; return await setPersonActivationValue(person_id)}}
    funB = async () => {if (typeof EDIT_PERSONS_MPA !== "undefined") { reload = true; return await setPersonMpaValue(person_id) }}
    funC = async () => {if (typeof EDIT_PERSONS_NAME !== "undefined") { reload = true; return await setPersonNameValue(person_id) }}
    funD = async () => {if (typeof EDIT_PERSONS_HOURS !== "undefined") { reload = true; return await setPersonHoursValue(person_id) }}
    funE = async () => {if (typeof EDIT_PERSONS_DEPARTMENT !== "undefined") { reload = true; return await setPersonDepartmentValue(person_id) }}
    funF = async () => {if (typeof EDIT_PERSONS_SHIFT_ACTIVATION !== "undefined") { reload = true; return await setPersonShiftActivation(person_id) }}
    funG = async () => {if (typeof EDIT_PERSONS_SHIFT_LABEL_ACTIVATION !== "undefined") { reload = true; return await setPersonShiftLabelActivation(person_id) }}
    funH = async () => {if (typeof EDIT_PERSONS_SHIFT_LABEL !== "undefined") { reload = true; return await setPersonShiftLabel(person_id) }}
    funI = async () => {if (typeof EDIT_PERSONS_SHIFT_FREE !== "undefined") { reload = true; return await setPersonShiftFree(person_id) }}
    funJ = async () => {if (typeof EDIT_PERSONS_SHIFT_AVERAGE !== "undefined") { reload = true; return await setPersonShiftAverage(person_id) }}
    Promise.all([funA(), funB(), funC(), funD(), funE(), funF(), funG(), funH(), funI(), funJ()]).then(() => {
        if (is_new) {
            window.location = ""
            return
        } else if (reload) { 
            setActivePerson(person_id).then((person) => {
                resetEditPersonCheckValues()
                if (person) reloadPersonData(person_id)
                else getActiveRoster()
            })
        }
        document.body.onclick = null
        document.body.classList.remove("noscroll")

        block.classList.remove("active")
        block.setAttribute("person", "")
        block.classList.remove("active")
        document.getElementById("Edit-person-container").removeEventListener('click', (e) => { e.stopPropagation() })

        block.setAttribute("person", "")
        hideLoading("closeEditPerson")
    })


}
setPersonNameValue = async () => {
    let assign_to = document.querySelector("#Edit-person .person-container .select-assign-to select").value
    return changePersonValue(EDIT_PERSONS_NAME.p, "name", EDIT_PERSONS_NAME.d, undefined, assign_to).then(() => {
        if (assign_to === "all") {return dbSet_person_where(EDIT_PERSONS_NAME.p, "name", EDIT_PERSONS_NAME.d).then(() => {return})} 
    })
}
setPersonHoursValue = async () => {
    let assign_to = document.querySelector("#Edit-person .person-container .select-assign-to select").value
    return changePersonValue(EDIT_PERSONS_HOURS.p, "hours", EDIT_PERSONS_HOURS.d, undefined, assign_to).then(() => {
        if (assign_to === "all") {return dbSet_person_where(EDIT_PERSONS_HOURS.p, "hours", EDIT_PERSONS_HOURS.d).then(() => {return})} 
    })
}
setPersonDepartmentValue = async () => {
    let assign_to = document.querySelector("#Edit-person .person-container .select-assign-to select").value
    return changePersonValue(EDIT_PERSONS_DEPARTMENT.p, "department", EDIT_PERSONS_DEPARTMENT.d, undefined, assign_to).then(() => {
        if (assign_to === "all") {return dbSet_person_where(EDIT_PERSONS_DEPARTMENT.p, "department", EDIT_PERSONS_DEPARTMENT.d).then(() => {return})} 
    })
}
setPersonMpaValue = async () => {
    let assign_to = document.querySelector("#Edit-person-mpa .select-assign-to select").value
    let new_mpa
    if (assign_to === "all") {
        new_mpa = PERSONS.find(p => p.id === EDIT_PERSONS_MPA[0].p).mpa
    } 
    for (let e=0; e<EDIT_PERSONS_MPA.length; e++) {
        let data = EDIT_PERSONS_MPA[e]
        if (e === EDIT_PERSONS_MPA.length-1) {
            return changePersonValue(data.p, "mpa", data.v, data.d, assign_to).then(() => {
                if (assign_to === "all") {
                    new_mpa[data.d] = data.v
                    return dbSet_person_where(EDIT_PERSONS_MPA[0].p, "mpa", new_mpa).then(() => {return})
                }
            })
        } else {
            await changePersonValue(data.p, "mpa", data.v, data.d, assign_to)
            if (assign_to === "all") {new_mpa[data.d] = data.v}
        }
    }
}
setPersonActivationValue = async (person_id) => {
    let value = EDIT_PERSONS_ACTIVATION
    let date = getDateToRosterDate(value)
    let year_week = date[0]
    if (date[1] > DAYS.length-1) {
        year_week = getDateToRosterDate(new Date(value.getTime() + 7 * 24 * 60 * 60 * 1000))[0]
    }
    let start = new Date(getDateOfISOWeek(DATE_YEAR_WEEK_OLDEST))
    let end = new Date(getDateOfISOWeek(year_week))
    end = new Date(end.getTime() - 1 * 24 * 60 * 60 * 1000);
    removePersonShiftsBetweenDate(person_id, start, end, true)
    return await dbSet_person_person_activated(person_id, year_week)
}

renderChangePersonActivationInput = (person_id) => {
    let block_activation_input_container = document.querySelector("#Edit-person-container .activation .input-container")
    let block_dnone = document.querySelector("#Edit-person-container .select-activation")
    block_dnone.classList.add("d-none")
    let block_input = document.createElement("input")
    block_input.setAttribute("type", "date")
    block_input.setAttribute("onchange", `EDIT_PERSONS_ACTIVATION = new Date(this.value)`)
    block_input.value = getDateOfISOWeek(DATE_YEAR_WEEK).toISOString().substring(0,10)
    block_activation_input_container.appendChild(block_input)
}
checkChangePersonActivation = (person_id, value) => { 
    if (value === "Andere") {
        renderChangePersonActivationInput(person_id)
        return
    }
    EDIT_PERSONS_ACTIVATION = getDateOfISOWeek(value)
}

renderChangePersonActivationSelect = async (person_id) => {
    let person = await getActivePersonById(person_id)
    let block_activation_input_container = document.querySelector("#Edit-person-container .activation .input-container")
    block_activation_input_container.innerHTML = ""
    let block_activation_select_label = document.createElement("label")
    block_activation_select_label.classList.add("chevron-down", "chevron-select")
    let block_activation_select = document.createElement("select")
    block_activation_select.classList.add("select-activation")
    block_activation_select.setAttribute("onChange", `checkChangePersonActivation(${person_id}, this.value)`)
    let activation_options = [...ROSTERS_YEARWEEK]
    if (activation_options.indexOf(person.activated) === -1) {activation_options.push(person.activated)}
    activation_options.sort((a, b) => getDateOfISOWeek(b) - getDateOfISOWeek(a))
    activation_options = ["Andere",...activation_options]
    activation_options.forEach( a_year_week => {
        let block_option = document.createElement("option")
        block_option.innerHTML = a_year_week === "Andere" ? "Datum wählen" : a_year_week
        if (a_year_week === person.activated) {block_option.defaultSelected = true}
        block_activation_select.appendChild(block_option)
    })
    block_activation_select_label.appendChild(block_activation_select)
    block_activation_input_container.appendChild(block_activation_select_label)

}
changePersonName = (person_id, value) => {
    EDIT_PERSONS_NAME = {p: person_id, d: value}
}
changePersonHours = (person_id, value) => {
    EDIT_PERSONS_HOURS = {p: person_id, d: value}
}
changePersonDepartment = (person_id, value) => {
    EDIT_PERSONS_DEPARTMENT = {p: person_id, d: value}
}
changePersonFreedays = (el, person_id, value) => {
    el.classList.toggle("active")
    if (typeof EDIT_PERSONS_FREEDAYS === "undefined") {
        EDIT_PERSONS_FREEDAYS = [{p: person_id, d: value}]
    } else {
        let remove = EDIT_PERSONS_FREEDAYS.indexOf(value)
        if (remove > -1) EDIT_PERSONS_FREEDAYS.splice(remove, 1)
        else EDIT_PERSONS_FREEDAYS.push({p: person_id, d: value})
    }
}
changePersonMpa = (person_id, value, day_id) => {
    value = parseFloat(value)
    if (typeof EDIT_PERSONS_MPA === "undefined") {
        EDIT_PERSONS_MPA = [{p: person_id, v: value, d: day_id}]
    } else {
        let edit_id = EDIT_PERSONS_MPA.map(m => m.d).indexOf(day_id)
        if (edit_id === -1) {
            EDIT_PERSONS_MPA.push({p: person_id, v: value, d: day_id})
        } else {
            EDIT_PERSONS_MPA[edit_id].v = value
        }
    }
}
changePersonValue = async (person_id, name, value, day_id, assign_to) => {
    let year_week = DATE_YEAR_WEEK
    let person = await getActivePersonById(person_id)
    let change_id
    let add_change

    setChange = async (key, old_value, day_id) => {
        if (assign_to === "all") {
            return dbSet_person_changes_where_yearweek_is_ge_and_day_and_person_and_key(person.activated, day_id, person_id, key, value).then(() => {
                return dbSet_person_changes_where_person_and_key(person_id, key, value)
            })
        } else if (assign_to === "ongoing") {
            return dbSet_person_changes_where_yearweek_is_ge_and_day_and_person_and_key(year_week, day_id, person_id, key, value).then(() => {
                return dbSet_person_change_where_yearweek_day_and_person_and_key(year_week, day_id, person_id, key, value)
            })
        } else if (assign_to === "justthis") {
            let next_yw = DATE_YEAR_WEEK_AFTER
            let change_n = await dbGet_person_change_where_yearweek_and_day_and_person_and_key(next_yw, day_id, person_id, key)
            return dbSet_person_change_where_yearweek_day_and_person_and_key(year_week, day_id, person_id, key, value).then(() => {
                if (change_n?.length === 0) {
                    return dbSet_person_change_where_yearweek_day_and_person_and_key(next_yw, day_id, person_id, key, old_value).then(() => {return})
                } else {return}
            })
        }
    }
    if (name === "name") {
        return setChange("n", person.name, 999)
    } else if (name === "hours") {
        value = parseFloat(value)
        return setChange("h", person.hours, 999)
    } else if (name === "department") {
        value = parseFloat(value)
        return setChange("d", person.department, 999)
    } else if (name === "mpa") {
        value = parseFloat(value)
        return setChange("m", person.mpa[day_id], day_id)
    }
}


createMpaItems = async (person_id) => {
    let block = document.createElement("div")
    block.classList.add("container")
    let person = await getActivePersonById(person_id)
    if (typeof person === "undefined") {person = await getPersonById(person_id)}
    createB = () => {
        DAYS.forEach((day, day_id) => {
            let block_item = document.createElement("div")
            let block_name = document.createElement("label")
            let block_input = document.createElement("input")
            block_item.classList.add("item")
            block_name.innerHTML = day.substring(0,2)
            block_input.setAttribute("onchange", `changePersonMpa(${person_id}, this.value, ${day_id})`)
            block_input.setAttribute("type", "number")
            block_input.setAttribute("min", "0")
            block_input.setAttribute("step", "0.5")
            block_input.value = person.mpa[day_id]
            block_item.appendChild(block_name)
            block_item.appendChild(block_input)
            block.appendChild(block_item)
        })
        return block
    }
    return createB()
}
addOvertime = async (person_id, year_week, time) => {
    time = parseFloat(time)
    return dbGet_person_overtime_manual_where_yearweek(year_week, person_id).then(overtime => {
        if (typeof overtime === "undefined" && time === 0) {return}
        return dbSet_person_overtime_manual_where_yearweek(year_week, person_id, time).then(() => {
            return setActivePerson(person_id).then(() => {
                return reloadPersonData(person_id)
            })
        })
    })
}
saveOvertime = (person_id) => {
    let block = document.getElementById("Edit-person-overtime")
    let block_add = block.getElementsByClassName("container-add")[0]
    let block_save = block_add.getElementsByClassName("button-add")[0]
    let block_year_week_label = block_add.querySelector("label")
    let block_year_week = block_year_week_label.querySelector("select")
    let block_time = block_add.querySelector("input")

    addOvertime(person_id, block_year_week.value, block_time.value).then(() => {
        block_save.setAttribute("onClick", `renderAddOvertime(${person_id})`)
        block_add.removeChild(block_year_week_label)
        block_add.removeChild(block_time)
        block_save.innerHTML = "Hinzufügen"
        renderOvertimes(person_id)
    })
}
setOvertimeInputValue = async (person_id, year_week) => {
    let block_add = document.querySelector("#Edit-person-overtime .container-add")
    let block_time = block_add.querySelector("input")
    return dbGet_person_overtime_manual_where_yearweek(year_week, person_id).then(overtime => {
        if (typeof overtime === "undefined") {overtime = 0}
        block_time.value = overtime
        return
    })
}
cancelAddOvertime = (el, person_id) => {
    block = el.parentNode
    block.classList.remove("active")
    window.setTimeout(() => {
        block.innerHTML = `<button class="button-add button-whitegreen" onclick="renderAddOvertime(${person_id})">Hinzufügen</button>`
    },50)
}
renderAddOvertime = (person_id) => {
    let block_container = document.getElementById("Edit-person-overtime")
    let block_add = block_container.getElementsByClassName("container-add")[0]
    block_add.classList.add("active")
    let block_cancel = document.createElement("button")
    block_cancel.classList.add("button-cancel", "button-orange")
    block_cancel.innerHTML = "Abbrechen"
    block_cancel.setAttribute("onClick", `cancelAddOvertime(this, ${person_id})`)
    block_add.appendChild(block_cancel)
    let block_save = block_add.getElementsByClassName("button-add")[0]
    block_save.setAttribute("onClick", `saveOvertime(${person_id})`)
    block_save.innerHTML = "Speichern"

    let block_label_year_week = document.createElement("label")
    block_label_year_week.classList.add("chevron-select", "chevron-down")
    let block_select_year_week = document.createElement("select")
    block_select_year_week.setAttribute("onchange", `setOvertimeInputValue(${person_id}, this.value)`)

    let year_weeks = [...ROSTERS_YEARWEEK]
    year_weeks.sort((a, b) => getDateOfISOWeek(b) - getDateOfISOWeek(a))
    year_weeks.forEach(year_week => {
        let block_option_year_week = document.createElement("option")
        block_option_year_week.innerHTML = year_week
        block_option_year_week.setAttribute("value", year_week)
        if (year_week === DATE_YEAR_WEEK) {block_option_year_week.defaultSelected = true}
        block_select_year_week.appendChild(block_option_year_week)
    })

    let block_input = document.createElement("input")
    block_input.setAttribute("type", "number")
    block_input.setAttribute("step", "0.25")

    block_label_year_week.appendChild(block_select_year_week)
    block_add.appendChild(block_label_year_week)
    block_add.appendChild(block_input)

    setOvertimeInputValue(person_id, DATE_YEAR_WEEK)
}

renderOvertimes = async (person_id) => {
    return getActivePersonById(person_id).then(person => {
        let block_overtime = document.getElementById("Edit-person-overtime")
        let block_overtime_container = block_overtime.querySelector(".container")
        block_overtime_container.innerHTML = ""

        let block_table = document.createElement("table")
        let block_thead = document.createElement("thead")
        let block_thead_tr = document.createElement("tr")

        let block_thead_th_y = document.createElement("th")
        block_thead_th_y.innerHTML = "Woche"
        block_thead_tr.appendChild(block_thead_th_y)
        let block_thead_th_a = document.createElement("th")
        block_thead_th_a.innerHTML = "Automatisch"
        block_thead_th_a.setAttribute("title", "Die Stunden ergeben sich durch die hinzugefügten Schichten.")
        block_thead_tr.appendChild(block_thead_th_a)
        let block_thead_th_m = document.createElement("th")
        block_thead_th_m.innerHTML = "Manuell"
        block_thead_th_m.setAttribute("title", "Die Stunden wurden manuell hinzugefügt.")
        block_thead_tr.appendChild(block_thead_th_m)

        block_thead.appendChild(block_thead_tr)
        block_table.appendChild(block_thead)

        let block_tbody = document.createElement("tbody")
        block_table.appendChild(block_tbody)

        let year_weeks = [...ROSTERS_YEARWEEK]
        createB = (overtimes) => {
            let block_tr_t = document.createElement("tr")
            let block_td_t_y = document.createElement("td")
            block_td_t_y.innerHTML = "Insgesamt"
            block_tr_t.appendChild(block_td_t_y)
            let block_td_t_a = document.createElement("td")
            block_tr_t.appendChild(block_td_t_a)
            let block_td_t_m = document.createElement("td")
            block_tr_t.appendChild(block_td_t_m)
            block_tbody.appendChild(block_tr_t)
            let total_a = 0
            let total_m = 0
            for (let ywi=0; ywi<year_weeks.length; ywi++) {
                let year_week = year_weeks[ywi]
                if (person.activated > year_week) continue
                let ot = overtimes.find(o => o.yearweek === year_week)
                if (typeof ot === "undefined") continue
                let overtime = parseFloat((ot.hours_is-ot.hours_should).toFixed(2))
                let overtime_m = person.overtimes_manual.find(o => o.yearweek === year_week)

                let block_tr = document.createElement("tr")

                let block_td_y = document.createElement("td")
                block_td_y.innerHTML = year_week
                block_tr.appendChild(block_td_y)

                let block_td_a = document.createElement("td")
                if (typeof overtime_m !== "undefined") {
                    overtime = parseFloat((overtime-(overtime_m.overtime)).toFixed(2))
                    total_m = parseFloat((total_m+(overtime_m.overtime)).toFixed(2))
                }
                total_a = parseFloat((total_a+(overtime)).toFixed(2))
                if (overtime > 0) {overtime = `+${overtime}`}
                block_td_a.innerHTML = overtime
                block_tr.appendChild(block_td_a)

                let block_td_m = document.createElement("td")
                if (typeof overtime_m === "undefined") {overtime_m = ""}
                else {overtime_m = overtime_m.overtime}
                if (overtime_m > 0) overtime_m = `+${overtime_m}`
                block_td_m.innerHTML = overtime_m
                block_tr.appendChild(block_td_m)

                block_tbody.appendChild(block_tr)
            }
            if (total_a > 0) {total_a = `+${total_a}`}
            else if (total_a === 0) {total_a = ` ${total_a}`}
            if (total_m > 0) {total_m = `+${total_m}`}
            else if (total_m === 0) {total_m = ` ${total_m}`}
            block_td_t_a.innerHTML = total_a
            block_td_t_m.innerHTML = total_m
            block_overtime_container.appendChild(block_table)
            return 
        }
        return dbGet_person_overtimes_yearweeks(person.id).then(overtimes => {
            return createB(overtimes)
        })
    })
}

renderBlockAssignEditPersonTo = (person_id, is_new) => {
    let values = [{t: "Fortlaufend", v: "ongoing"}]
    let default_selected = "all"
    values.push({t: "Einmalig", v: "justthis"})
    values.push({t: "Alle", v: "all"})
    if (DATE_YEAR_WEEK === DATE_YEAR_WEEK_NEWEST) {default_selected = "ongoing"}
    else {default_selected = "justthis"}
    let block_label_select = document.createElement("label")
    block_label_select.classList.add("select-assign-to", "chevron-down", "chevron-select")
    block_label_select.setAttribute("title", "Die Änderung wird auf den folgenden Zeitraum übertragen.\nAlle: Vergangene und zukünftige Dienspläne\nFortlaufend: Aktueller und zukünftige Dienspläne.\nEinmalig: nur aktuelle Dienstplanwoche")
    let block_select = document.createElement("select")
    if (is_new) {
        block_select.setAttribute("disabled", "disabled")
    }
    values.forEach(data => {
        let block_option = document.createElement("option")
        block_option.innerHTML = data.t
        block_option.value = data.v
        if (is_new && data.v === "all") {block_option.defaultSelected = true}
        else if (data.v === default_selected) {block_option.defaultSelected = true}
        block_select.appendChild(block_option)
    })
    block_label_select.appendChild(block_select)
    return block_label_select
}
reactivatePerson = (person_id) => {
    dbRemove_person_changes_where_person_and_key(person_id, "r").then(() => {
        window.location = ""
    })
}

activateShiftSettingAverage = (day_id) => {
    let block_container = document.querySelector(`#Edit-person-shift-settings-${day_id}`)
    let block_button_hours = block_container.querySelector(".button-average")
    let block_item_hours = block_container.querySelector(".item-average")
    let block_item_hours_input = block_item_hours.querySelector("input")
    if (block_button_hours.classList.contains("active")) {
        changePersonShiftSettingsAverage(day_id, undefined)
        block_item_hours.classList.remove("active")
        block_button_hours.classList.remove("active")
        block_item_hours_input.classList.add("d-none")
    } else {
        block_item_hours.classList.add("active")
        block_button_hours.classList.add("active")
        block_item_hours_input.classList.remove("d-none")
    }
}
activateShiftSettingLabel = (day_id) => {
    let block_container = document.querySelector(`#Edit-person-shift-settings-${day_id}`)
    let block_item_label = block_container.querySelector(".item-label")
    let block_button_label = block_container.querySelector(".button-label")
    let block_select_label = block_container.querySelector(".select-label-label")
    let block_select = block_container.querySelector(".select-label")
    let block_free = block_container.querySelector(".button-free")
    let block_average = block_container.querySelector(".item-average")
    let value
    if (block_button_label.classList.contains("active")) {
        value = false
        block_button_label.classList.remove("active")
        block_item_label.classList.remove("active")
        block_select_label.classList.add("d-none")
        block_free.classList.add("d-none")
        block_free.classList.remove("active")
        block_average.classList.remove("d-none")
    } else {
        value = true
        block_button_label.classList.add("active")
        block_item_label.classList.add("active")
        block_select_label.classList.remove("d-none")
        changePersonShiftSettingsLabel(day_id)
    }
    if (typeof EDIT_PERSONS_SHIFT_LABEL_ACTIVATION === "undefined") {EDIT_PERSONS_SHIFT_LABEL_ACTIVATION = []}
    let a_id = EDIT_PERSONS_SHIFT_LABEL_ACTIVATION.map(a => a.d).indexOf(day_id)
    if (a_id > -1) {EDIT_PERSONS_SHIFT_LABEL_ACTIVATION[a_id].v = value}
    else EDIT_PERSONS_SHIFT_LABEL_ACTIVATION.push({v: value, d: day_id})
    let l_id = -1
    if (typeof EDIT_PERSONS_SHIFT_LABEL !== "undefined") {l_id = EDIT_PERSONS_SHIFT_LABEL.map(a => a.d).indexOf(day_id)}
    if (typeof EDIT_PERSONS_SHIFT_LABEL === "undefined") {EDIT_PERSONS_SHIFT_LABEL = []}
    if (value) {
        if (l_id > -1) {
            EDIT_PERSONS_SHIFT_LABEL[l_id].v = SHIFT_LABELS[0].id
        } else EDIT_PERSONS_SHIFT_LABEL.push({d: day_id, v: SHIFT_LABELS[0].id})
    } else {
        if (l_id > -1) {
            EDIT_PERSONS_SHIFT_LABEL[l_id].v = false
        } else {
            EDIT_PERSONS_SHIFT_LABEL.push({d: day_id, v: false})
        }
        let f_id = -1
        if (typeof EDIT_PERSONS_SHIFT_FREE !== "undefined") {f_id = EDIT_PERSONS_SHIFT_FREE.map(f => f.d).indexOf(day_id)}
        if (typeof EDIT_PERSONS_SHIFT_FREE === "undefined") {EDIT_PERSONS_SHIFT_FREE = []}
        if (l_id > -1) {
            EDIT_PERSONS_SHIFT_FREE[l_id].v = false
        } else {
            EDIT_PERSONS_SHIFT_FREE.push({d: day_id, v: false})
        }
    }
}
changePersonShiftSettingsLabel = (day_id) => {
    let block_container = document.querySelector(`#Edit-person-shift-settings-${day_id}`)
    let block_select = block_container.querySelector(".select-label")
    let block_free = block_container.querySelector(".button-free")
    let block_average = block_container.querySelector(".item-average")
    let value = parseFloat(block_select.value)
    block_free.classList.remove("d-none")
    if (typeof EDIT_PERSONS_SHIFT_LABEL === "undefined") {EDIT_PERSONS_SHIFT_LABEL = []}
    let l_id = EDIT_PERSONS_SHIFT_LABEL.map(a => a.d).indexOf(day_id)
    let free_id = SHIFT_LABELS.find(l => l.name = "Frei").id
    if (l_id > -1) {
        EDIT_PERSONS_SHIFT_LABEL[l_id].v = value
    } else EDIT_PERSONS_SHIFT_LABEL.push({d: day_id, v: value})

    if (value === free_id) {
        changePersonShiftSettingsFree(day_id, true)
        block_free.classList.add("d-none")
    } else {
        changePersonShiftSettingsFree(day_id, false)
    }
}
changePersonShiftSettingsFree = (day_id, value) => {
    let block_container = document.querySelector(`#Edit-person-shift-settings-${day_id}`)
    let block_average = block_container.querySelector(".item-average")
    let block_free = block_container.querySelector(".button-free")
    if (value) {
        block_free.classList.add("active")
        block_average.classList.add("d-none")
    } else {
        block_free.classList.remove("active")
        block_average.classList.remove("d-none")
    }
    if (typeof EDIT_PERSONS_SHIFT_FREE === "undefined") {EDIT_PERSONS_SHIFT_FREE = []}
    let change_id = EDIT_PERSONS_SHIFT_FREE.map(f => f.d).indexOf(day_id)
    if (change_id === -1) EDIT_PERSONS_SHIFT_FREE.push({d: day_id, v: value})
    else {EDIT_PERSONS_SHIFT_FREE[change_id].v = value}
}
changePersonShiftSettingsAverage = (day_id, value) => {
    if (typeof EDIT_PERSONS_SHIFT_AVERAGE === "undefined") {EDIT_PERSONS_SHIFT_AVERAGE = []}
    let change_id = EDIT_PERSONS_SHIFT_AVERAGE.map(a => a.d).indexOf(day_id)
    if (change_id === -1) EDIT_PERSONS_SHIFT_AVERAGE.push({d: day_id, v: value})
    else {EDIT_PERSONS_SHIFT_AVERAGE[change_id].v = value}
} 
togglePersonShiftSettingsFree = (day_id) => {
    let block_container = document.querySelector(`#Edit-person-shift-settings-${day_id}`)
    let block_free = block_container.querySelector(".button-free")
    if (block_free.classList.contains("active")) {
        changePersonShiftSettingsFree(day_id, false)
    } else {
        changePersonShiftSettingsFree(day_id, true)
    }
}
activateShiftSetting = (el, day_id) => {
    let block_container = el.parentNode.parentNode.querySelector(".items")
    if (typeof EDIT_PERSONS_SHIFT_ACTIVATION === "undefined") {EDIT_PERSONS_SHIFT_ACTIVATION = []}
    let value
    if (el.classList.contains("active")) {
        value = false
        el.classList.remove("active")
        block_container.classList.add("d-none")
    } else {
        value = true
        el.classList.add("active")
        block_container.classList.remove("d-none")
    }
    let c_id = EDIT_PERSONS_SHIFT_ACTIVATION.map(c => c.d).indexOf(day_id)
    if (c_id > -1) {EDIT_PERSONS_SHIFT_ACTIVATION[c_id].v = value}
    else EDIT_PERSONS_SHIFT_ACTIVATION.push({v: value, d: day_id})
}
renderEditRemovedPerson = async (person_id) => {
    dbGet_person_removed(DATE_YEAR_WEEK, person_id).then(person => {
        let block = document.getElementById("Popup")
        block.onclick = (e) => eventListenerClosePopup(e)
        let block_container = document.getElementById("Popup-container")
        block.classList.add("active", "reactivate-person")
        let block_name = document.createElement("h3")
        block_name.innerHTML = person.name
        block_container.appendChild(block_name)

        let block_activated_date = document.createElement("div")
        block_activated_date.innerHTML = `Aktiviert: ${person.activated}`
        block_container.appendChild(block_activated_date)
        let block_removed_date = document.createElement("div")
        dbGet_person_changes_where_key(person_id, "r").then(r_date => {
            r_date = r_date[0].yearweek
            block_removed_date.innerHTML = `Gelöscht: ${r_date }`
            block_container.appendChild(block_removed_date)

            let block_reactivate = document.createElement("button")
            block_reactivate.innerHTML = "Reaktivieren"
            block_reactivate.setAttribute("onClick", `reactivatePerson(${person_id})`)
            block_container.appendChild(block_reactivate)
        })
    })
}
editPerson = async (person_id, is_new) => {
    resetEditPersonCheckValues()
    let person = await getActivePersonById(person_id)
    if (typeof person === "undefined") {person = await getPersonById(person_id)}

    let is_removed = await dbGet_person_changes_where_key(person_id, "r")
    is_removed = is_removed[0]
    if (typeof is_removed !== "undefined" && getDateOfISOWeek(is_removed.yearweek) <= getDateOfISOWeek(DATE_YEAR_WEEK)) {
        renderEditRemovedPerson(person_id)
        return
    }

    document.body.classList.add("noscroll")
    let block = document.getElementById("Edit-person")
    let block_container = document.getElementById("Edit-person-container")
    block.classList.add("active")
	block.setAttribute("person", person_id)

    let block_close = block.getElementsByClassName("edit-close")[0]
    block_close.setAttribute("onClick", `closeEditPerson(${is_new})`)

    let blockName = block.getElementsByClassName("name")[0].querySelector("input")
    blockName.value = person.name
    blockName.setAttribute("onChange", `changePersonName(${person_id}, this.value)`)

    let blockRemove = block.getElementsByClassName("remove")[0].querySelector("button")
    blockRemove.setAttribute("onClick", 'removePerson('+person_id+'); document.body.onclick = null')

    let blockHours = block.getElementsByClassName("hours")[0].querySelector("input")
    blockHours.value = person.hours
    blockHours.setAttribute("onChange", `changePersonHours(${person_id}, parseFloat(this.value))`)


    let block_select_label = document.createElement("label")
    let block_select = document.createElement("select")
    block_select_label.classList.add("chevron-down", "chevron-select")

    let block_department = block.getElementsByClassName("department")[0]
    block_department.innerHTML = "" 
    let block_department_label = document.createElement("label")
    block_department_label.innerHTML = "Bereich:" 
    block_department_label.classList.add("title")
    block_department.appendChild(block_department_label)
    DEPARTMENTS.forEach(department => {
        let block_option = document.createElement("option")
        block_option.value = department.id
        block_option.innerHTML = department.name
        block_select.appendChild(block_option)
    })
    block_select.value = person.department
    block_select.setAttribute("onChange", `changePersonDepartment(${person_id}, parseFloat(this.value))`)
    block_select_label.appendChild(block_select)
    block_department.appendChild(block_select_label)

    let block_person_assign_container = document.querySelector("#Edit-person-container .person-container .select-assign-container")
    block_person_assign_container.innerHTML = ""
    let block_person_assign_to = renderBlockAssignEditPersonTo(person_id, is_new)
    block_person_assign_container.appendChild(block_person_assign_to)


    renderChangePersonActivationSelect(person_id)

    let block_shift_setting = document.getElementById("Edit-person-shift-settings")
    let block_shift_setting_assign_container = block_shift_setting.querySelector(".select-assign-container")
    block_shift_setting_assign_container.innerHTML = ""
    let block_shift_setting_assign_to = renderBlockAssignEditPersonTo(person_id, is_new)
    block_shift_setting_assign_container.appendChild(block_shift_setting_assign_to)
    let block_shift_setting_container = block_shift_setting.querySelector(".container")
    block_shift_setting_container.innerHTML = ""
    for (let day_id=0;day_id<DAYS.length;day_id++) {
        let day = DAYS[day_id]
        let setting_day_sl = person.sl[day_id]
        let setting_day_sa = person.sa[day_id]
        let setting_day_sf = person.sf[day_id]
        let setting_day_active = true
        if ((setting_day_sl === false || typeof setting_day_sl === "undefined") && !setting_day_sa && !setting_day_sf) {setting_day_active = false}
        let block_s_container = document.createElement("div")
        block_s_container.setAttribute("id", `Edit-person-shift-settings-${day_id}`)
        block_s_container.classList.add("edit-person-shift-settings-day")
        let block_name_container = document.createElement("div")
        block_name_container.classList.add("button-activate-container")
        let block_name = document.createElement("button")
        block_name.innerHTML = day
        block_name.classList.add("button-activate")
        if (setting_day_active) block_name.classList.add("active")
        block_name.setAttribute("title", "Schichteinstellung aktivieren")
        block_name.setAttribute("onClick", `activateShiftSetting(this, ${day_id})`)
        block_name_container.appendChild(block_name)
        block_s_container.appendChild(block_name_container)

        let block_s_items = document.createElement("div")
        block_s_items.classList.add("items")
        if (!setting_day_active) block_s_items.classList.add("d-none")
        let block_shift_label_container = document.createElement("div")
        block_shift_label_container.classList.add("item", "item-label")
        if ((setting_day_sl !== false && typeof setting_day_sl !== "undefined")) block_shift_label_container.classList.add("active")
        block_shift_label_container.setAttribute("title", "Bezeichnung aktivieren.\nIn den Einstellungen können neue Bezeichnungen hinzugefügt werden.\nDie Bezeichnung erscheint in der Legende der Dienstplanwoche,\ndie Abkürzung erscheint im Schichtplan")
        let block_shift_label = document.createElement("button")
        block_shift_label.innerHTML = "Bezeichnung"
        block_shift_label.classList.add("button-label")
        if ((setting_day_sl !== false && typeof setting_day_sl !== "undefined")) block_shift_label.classList.add("active")
        block_shift_label.setAttribute("onClick", `activateShiftSettingLabel(${day_id})`)
        block_shift_label_container.appendChild(block_shift_label)
        let block_shift_label_select_label = document.createElement("label")
        block_shift_label_select_label.classList.add("chevron-down", "chevron-select", "select-label-label")
        if ((setting_day_sl === false || typeof setting_day_sl === "undefined")) block_shift_label_select_label.classList.add("d-none")
        let block_shift_label_select = document.createElement("select")
        block_shift_label_select.classList.add("select-label")
        block_shift_label_select.setAttribute("onchange", `changePersonShiftSettingsLabel(${day_id})`)
        let longest_option_length = SHIFT_LABELS.map(d => d.name).reduce((a, b) => a.length > b.length ? a : b, '').length
        SHIFT_LABELS.forEach(l => {
            let block_option = document.createElement("option")
            block_option.classList.add("font-number")
            block_option.innerHTML = `${l.name}${"&nbsp;".repeat(longest_option_length-l.name.length+1)}| ${l.cut}`
            block_option.setAttribute("value", l.id)
            if (setting_day_sl === l.id) {block_option.defaultSelected = true}
            block_shift_label_select.appendChild(block_option)
        })
        block_shift_label_select_label.appendChild(block_shift_label_select)
        block_shift_label_container.appendChild(block_shift_label_select_label)
        block_s_items.appendChild(block_shift_label_container)

        let block_free = document.createElement("button")
        block_free.classList.add("item", "button-free", "d-none")
        block_free.innerHTML = "Frei"
        block_free.setAttribute("title", "Hiermit kann an diesem Tag keine Schicht vergeben werden.")
        block_free.setAttribute("onClick", `togglePersonShiftSettingsFree(${day_id})`)
        let free_id = SHIFT_LABELS.find(l => l.name = "Frei").id
        if (setting_day_sf) {block_free.classList.add("active"); block_free.classList.remove("d-none")}
        if (setting_day_sl === free_id) {block_free.classList.add("d-none")}
        else if ((setting_day_sl !== false && typeof setting_day_sl !== "undefined")) block_free.classList.remove("d-none")
        block_s_items.appendChild(block_free)

        let block_hours_container = document.createElement("div")
        block_hours_container.classList.add("item", "item-average")
        if (setting_day_sa) block_hours_container.classList.add("active")
        block_hours_container.setAttribute("title", "Benutzerdefinierte durchschnittliche Arbeitszeit aktivieren.")
        let block_hours_label = document.createElement("button")
        block_hours_label.setAttribute("onClick", `activateShiftSettingAverage(${day_id})`)
        block_hours_label.classList.add("button-average")
        if (setting_day_sa) block_hours_label.classList.add("active")
        block_hours_label.innerHTML = "&#216; Stunden"
        block_hours_container.appendChild(block_hours_label)
        let block_hours = document.createElement("input")
        if (!setting_day_sa) block_hours.classList.add("d-none")
        block_hours.setAttribute("type", "number")
        block_hours.setAttribute("step", TIME_STEP)
        block_hours.setAttribute("onchange", `changePersonShiftSettingsAverage(${day_id}, parseFloat(this.value))`)
        let pav = await getPersonAverageHoursDefault(person_id, day_id)
        block_hours.value = pav
        if (setting_day_sa) {block_hours.value = setting_day_sa}
        block_hours_container.appendChild(block_hours)
        block_s_items.appendChild(block_hours_container)

        block_s_container.appendChild(block_s_items)
        block_shift_setting_container.appendChild(block_s_container)
    }

    let block_mpa = document.getElementById("Edit-person-mpa")
    let block_mpa_assign_container = block_mpa.querySelector(".select-assign-container")
    block_mpa_assign_container.innerHTML = ""
    let block_mpa_assign_to = renderBlockAssignEditPersonTo(person_id, is_new)
    block_mpa_assign_container.appendChild(block_mpa_assign_to)
    block_mpa.appendChild(block_mpa_assign_container)
    let block_mpa_container = block_mpa.getElementsByClassName("container")[0]
    let block_mpa_items = await createMpaItems(person_id)
    if (block_mpa_container) block_mpa.removeChild(block_mpa_container)
    block_mpa.appendChild(block_mpa_items)

    let block_vacation = document.getElementById("Settings-vacations")
    let block_vacation_container_add = block_vacation.getElementsByClassName("container-add")[0]
    let block_vacation_button = document.createElement("button")
    renderVacations(person_id)
    block_vacation_button.classList.add("button-add", "button-whitegreen")
    block_vacation_button.setAttribute("onClick", `renderAddVacation(${person_id})`)
    block_vacation_button.innerHTML = "Hinzugügen"
    block_vacation_container_add.innerHTML = ""
    block_vacation_container_add.appendChild(block_vacation_button)

    let block_illnes = document.getElementById("Edit-person-illnesses")
    let block_illnes_container_add = block_illnes.getElementsByClassName("container-add")[0]
    let block_illnes_button = document.createElement("button")
    renderIllnesses(person_id)
    block_illnes_button.classList.add("button-add", "button-whitegreen")
    block_illnes_button.setAttribute("onClick", `renderAddIllnes(${person_id})`)
    block_illnes_button.innerHTML = "Hinzugügen"
    block_illnes_container_add.innerHTML = ""
    block_illnes_container_add.appendChild(block_illnes_button)


    let block_betterment = document.getElementById("Edit-person-betterments")
    let block_betterment_container_add = block_betterment.getElementsByClassName("container-add")[0]
    let block_betterment_button = document.createElement("button")
    renderBetterments(person_id)
    block_betterment_button.classList.add("button-add", "button-whitegreen")
    block_betterment_button.setAttribute("onClick", `renderAddBetterment(${person_id})`)
    block_betterment_button.innerHTML = "Hinzugügen"
    block_betterment_container_add.innerHTML = ""
    block_betterment_container_add.appendChild(block_betterment_button)

    let block_overtime = document.getElementById("Edit-person-overtime")
    let block_overtime_container_add = block_overtime.querySelector(".container-add")
    renderOvertimes(person_id)
    let block_overtime_button = document.createElement("button")
    block_overtime_button.classList.add("button-add", "button-whitegreen")
    block_overtime_button.setAttribute("onClick", `renderAddOvertime(${person_id})`)
    block_overtime_button.innerHTML = "Hinzugügen"
    block_overtime_container_add.innerHTML = ""
    block_overtime_container_add.appendChild(block_overtime_button)

    window.setTimeout(() => {
        document.body.onclick = (e) => eventListenerEditPerson(e, is_new)
    }, 100)
}

getVacationsMonth = (vacation) => {
    let start = new Date(vacation[0]).toLocaleString('default', { month: 'long' }) 
    let end = new Date(vacation[1]).toLocaleString('default', { month: 'long' })
    start = start.substring(0,3)
    end = end.substring(0,3)
    if (start === end) { return start 
    } else { return `${start}-${end}` }
}

renderVacations = async (person_id) => {
    let block = document.getElementById("Settings-vacations")
    let block_vacation_container = block.getElementsByClassName("container")[0]
    let block_vacations = await createBlockVacations(person_id)
    if (block_vacation_container) block.removeChild(block_vacation_container)
    if (block_vacations) block.appendChild(block_vacations)
}


createBlockVacations = async (person_id) => {
    let person = await getActivePersonById(person_id)
    let vacations = person.vacations.sort((a,b) => b.start.localeCompare(a.start))
    let block = document.createElement("div")
    block.classList.add("container")

    cB = () => {
        let year_old
        let block_container_year
        let block_year_title
        let block_year_items
        for (let vs=0; vs<vacations.length;vs++) {
            let vacation = vacations[vs]
            let year = vacation.start.substring(0,4)
            if (year !== year_old) {
                year_old = year
                block_container_year = document.createElement("div")
                block_year_title = document.createElement("div")
                block_year_items = document.createElement("div")
                block_year_title.classList.add("year")
                block_year_title.innerHTML = year
                block_year_items.classList.add("container-items")
                block_container_year.setAttribute("id", `Vacations-container-${year}`)
                block_container_year.classList.add("container-data", "font-number")
                block_container_year.appendChild(block_year_title)
                block_container_year.appendChild(block_year_items)
                block.appendChild(block_container_year)
            }

            let start = vacation.start
            let end = vacation.end
            let description = vacation.name

            let block_container = document.createElement("div")
            let block_label = document.createElement("div")

            block_container.classList.add("item")


            let text_start_day = parseFloat(start.substring(8,10))
            let text_start_month = start.substring(5,7)
            if (text_start_day.toString().length === 1) { text_start_day = ` ${text_start_day}` }
            let text_start = `${text_start_day}.${text_start_month}`

            let text_end_day = parseFloat(end.substring(8,10))
            let text_end_month = end.substring(5,7)
            if (text_end_day.toString().length === 1) { text_end_day = ` ${text_end_day}` }
            let text_end = `${text_end_day}.${text_end_month}`
            block_label.classList.add("date")
            block_label.innerHTML = `${text_start} - ${text_end}.${end.substring(0,4)}`

            block_container.appendChild(block_label)

            if (typeof vacation.closingtime_id !== "undefined" && vacation.lawful === 0) {
                let block_remove = document.createElement("button")
                block_remove.innerHTML = "löschen"
                block_remove.classList.add("button-remove")
                block_remove.setAttribute("onClick", `removeVacation(${person_id}, ${vacation.closingtime_id}, true)`)
                block_container.appendChild(block_remove)
            } else if (typeof vacation.id !== "undefined") {
                let block_remove = document.createElement("button")
                block_remove.innerHTML = "löschen"
                block_remove.classList.add("button-remove")
                block_remove.setAttribute("onClick", `removeVacation(${person_id}, ${vacation.id})`)
                block_container.appendChild(block_remove)
            } else {
                let block_remove = document.createElement("div")
                block_container.appendChild(block_remove)
            }
            let block_description = document.createElement("div")
            if (typeof description !== "undefined") {
                block_description.classList.add("description")
                block_description.innerHTML = description
            }
            block_container.appendChild(block_description)
            block_year_items.appendChild(block_container)

        }
        return block
    }
    return cB()
}

removeVacation = async (person_id, vacation_id, is_closing) => {
    return getActivePersonById(person_id).then((person) => {
        let vacation
        if (is_closing) {
            vacation = person.vacations.find(v => v.closingtime_id === vacation_id)
        } else {
            vacation = person.vacations.find(v => v.id === vacation_id)
        }
        callback = () => {
            return setActivePerson(person_id).then((person_n) => {
                if (getDateToRosterDate(new Date(vacation.start))[0] <= DATE_YEAR_WEEK && getDateToRosterDate(new Date(vacation.end))[0] >= DATE_YEAR_WEEK) {
                    renderVacations(person_id)
                    reloadPersonData(person_id)
                } else {
                    renderVacations(person_id)
                }
                return
            })
        }
        if (is_closing && vacation.lawful === 0) {
            return dbRemove_closingtime_person(vacation_id, person_id).then(() => {return callback()})
        } else {
            return dbRemove_person_vacation(vacation_id, person_id).then(() => { return callback() })
        }
    })
}

saveVacation = async (person_id, start, end) => {
    return getActivePersonById(person_id).then(person => {
        let already_set = person.vacations.find(v => v.start <= start && v.end >= end)
        let update = person.vacations.find(v => (v.start >= start && v.end <= start) || (v.start >= end && v.end <= end))

        callback = () => {
            removePersonShiftsBetweenDate(person_id, new Date(start), new Date(end))
            return setActivePerson(person_id).then(() => {
                renderVacations(person_id)
                if (getDateToRosterDate(new Date(start))[0] <= DATE_YEAR_WEEK && getDateToRosterDate(new Date(end))[0] >= DATE_YEAR_WEEK) {
                    reloadPersonData(person_id)
                }
                return 
            })
        }
        if (typeof already_set !== "undefined") { return }
        if (typeof update !== "undefined") {
            return dbSet_person_vacation(person_id, update.id, start, end).then(() => {return callback()})
        } else {
            return dbAdd_person_vacation(person_id, start, end).then(() => {return callback()})
        }
    })

}
editVacation = async (person_id, vacation_id, start, end) => {
    return await dbSet_person_vacation(person_id, vacation_id, start, end).then(() => {
        setActivePerson(person_id).then(() => {return})
    })
}
getSaveVacation = (person_id) => {
    let block = document.getElementById("Settings-vacations")
    let block_add = block.getElementsByClassName("container-add")[0]
    let block_save = block_add.getElementsByClassName("button-add")[0]
    let block_start = block_add.getElementsByClassName("start")[0]
    let block_end = block_add.getElementsByClassName("end")[0]
    let start = block_start.value
    let end = block_end.value

    saveVacation(person_id, start, end)
    cancelAddVacation(block_add.querySelector(".button-cancel"), person_id)
}

setVacationEndDate = (max_date) => {
    let block_container = document.getElementById("Settings-vacations")
    let block_add = block_container.getElementsByClassName("container-add")[0]
    let block_end = block_add.getElementsByClassName("end")[0]
    let tomorrow = new Date(max_date)
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow = new Date(tomorrow.getTime() - tomorrow.getTimezoneOffset() * 60000)

    if (!isValidDate(tomorrow)) {return}
    block_end.setAttribute("min", max_date)
    block_end.value = tomorrow.toISOString().substr(0, 10)
}

checkIfDateIsDuringVacation = async (person_id, date) => {
    return getActivePersonById(person_id).then((person) => {
        let vacations = person.vacations
        if (typeof vacations === "undefined") return false
        let is_true = false
        vacations.forEach(vacation => {
            let start = vacation.start
            let end = vacation.end
            if (date >= start && date <= end) { is_true = true; return }
        })
        return is_true
    })
}

createPersonVacationsTextFuture = (person_id) => {
    return getActivePersonById(person_id).then(person => {
        let vacations = person.vacations.sort((a,b) => a.start.localeCompare(b.start))

        let vacations_text_all = []
        let date = getDateOfISOWeek(DATE_YEAR_WEEK)
        for (let i=0; i<vacations.length; i++) {
            let vacation = vacations[i]
            if (vacation.end < date) {continue} 
            year = vacation.start.substring(0,4)
            month_start = vacation.start.substring(5,7)
            month_end = vacation.end.substring(5,7)
            if (year > DATE_YEAR && vacations_text_all.indexOf(year) === -1) {
                vacations_text_all.push(year)
            } else {
                let value = getVacationsMonth([vacation.start, vacation.end])
                if (vacations_text_all.indexOf(value) === -1) {
                    vacations_text_all.push(value)
                }
            }
        }
        return vacations_text_all.join([separator = ', '])
    })
}

cancelAddVacation = (el, person_id) => {
    block = el.parentNode
    block.classList.remove("active")
    window.setTimeout(() => {
        block.innerHTML = `<button class="button-add button-whitegreen" onclick="renderAddVacation(${person_id})">Hinzufügen</button>`
    },50)
}
renderAddVacation = (person_id) => {
    let block_container = document.getElementById("Settings-vacations")
    let block_add = block_container.getElementsByClassName("container-add")[0]
    block_add.classList.add("active")
    let block_save = block_add.getElementsByClassName("button-add")[0]
    let block_cancel = document.createElement("button")
    block_cancel.classList.add("button-cancel", "button-orange")
    block_cancel.innerHTML = "Abbrechen"
    block_cancel.setAttribute("onClick", `cancelAddVacation(this, ${person_id})`)
    block_add.appendChild(block_cancel)
    let today = new Date()
    today = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    let tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow = new Date(tomorrow.getTime() - tomorrow.getTimezoneOffset() * 60000)


    let block_start = document.createElement("input")
    block_start.classList.add("start")
    block_start.setAttribute("type", "date")
    block_start.setAttribute("onchange", `setVacationEndDate(this.value)`)
    block_start.value = today.toISOString().substr(0, 10)

    let block_end = document.createElement("input")
    block_end.classList.add("end")
    block_end.setAttribute("type", "date")
    block_end.setAttribute("min", today)
    block_end.value = tomorrow.toISOString().substr(0, 10);

    block_add.appendChild(block_start)
    block_add.appendChild(block_end)

    block_save.setAttribute("onClick", `getSaveVacation(${person_id})`)
    block_save.innerHTML = "Speichern"
}

getIllnessesMonth = (illnes) => {
    let start = new Date(illnes.start).toLocaleString('default', { month: 'long' }) 
    let end = new Date(illnes.end).toLocaleString('default', { month: 'long' })
    start = start.substring(0,3)
    end = end.substring(0,3)
    if (start === end) { return start 
    } else { return `${start}-${end}` }
}

sortPeoplIllnessesByYear = async (person_id) => {
    let sorted = []
    let illnesses = await dbGet_person_illnesses(person_id)
    if (illnesses.length === 0) return
    illnesses.sort((a, b) => { return new Date(a.start) - new Date(b.start)})

    illnesses.forEach(illnes => {
        let illnes_id = illnes.id
        let start = new Date(illnes.start)
        let year = start.getFullYear()
        if (sorted.find(data => {return data.year === year})) {
            sorted.find(data => {return data.year === year}).ids.push(illnes_id)
        } else {
            sorted.push({year: year, ids: [illnes_id]})
        }

    })
    sorted.sort((a, b) => { return a.year - b.year })

    return sorted
}

addIllnesToday = (person_id, day_id) => {
    let date = getDayDateByDayid(day_id)
    addIllnesDate(person_id, date, date)
    closeRosterPersonMenu(person_id, day_id)
    setActivePerson(person_id).then(() => {
        reloadPersonData(person_id)
    })
}

addIllnesDate = async (person_id, start, end) => {
    let before_start = new Date(start)
    before_start.setDate(before_start.getDate() - 1)
    before_start = before_start.toISOString().substr(0, 10)
    let after_end = new Date(end)
    after_end.setDate(after_end.getDate() - 1)
    after_end = after_end.toISOString().substr(0, 10)


    let check = true
    let change_start_id
    let change_end_id
    getActivePersonById(person_id).then((person) => {
        let illnesses = person.illnesses
        illnesses.forEach(data => {
            let id = data.id
            if (start >= data.start && end <= data.end) { check = false; return}
            if (before_start === data.end) {change_start_id = id }
            if (after_end === data.start) {change_end_id = id }
        })

        callback = () => {
            removePersonShiftsBetweenDate(person_id, new Date(start), new Date(end))
            setActivePerson(person_id).then(() => {
                renderIllnesses(person_id)
                if (getDateToRosterDate(new Date(start))[0] <= DATE_YEAR_WEEK && getDateToRosterDate(new Date(end))[0] >= DATE_YEAR_WEEK) {
                    reloadPersonData(person_id)
                }
            })
        }
        if (typeof change_start_id !== "undefined") {
            let illnes = illnesses.find(i => i.id === change_start_id)
            dbSet_person_illnes(change_start_id, person_id,  illnes.start, end).then(() => callback())
        } else if (typeof change_end_id !== "undefined") {
            let illnes = illnesses.find(i => i.id === change_end_id)
            dbSet_person_illnes(change_end_id, person_id, start, illnes.end).then(() => callback())
        }
        else if (check) {
            dbAdd_person_illnes(person_id, start, end).then(() => callback())
        }
    })
}

saveIllnes = (person_id) => {
    let block = document.getElementById("Edit-person-illnesses")
    let block_add = block.getElementsByClassName("container-add")[0]
    let block_save = block_add.getElementsByClassName("button-add")[0]
    let block_start = block_add.getElementsByClassName("start")[0]
    let block_end = block_add.getElementsByClassName("end")[0]
    let start = block_start.value
    let end = block_end.value

    addIllnesDate(person_id, start, end)
    cancelAddIllnes(block_add.querySelector(".button-cancel"), person_id)
}

removeIllnes = (person_id, illnes_id) => {
    let illnes = PERSONS.find(p => p.id === person_id).illnesses.find(i => i.id === illnes_id)
    dbRemove_person_illnes(illnes_id, person_id).then(() => {
        setActivePerson(person_id).then(() => {
            renderIllnesses(person_id)
            if (getDateToRosterDate(new Date(illnes.start))[0] <= DATE_YEAR_WEEK && getDateToRosterDate(new Date(illnes.end))[0] >= DATE_YEAR_WEEK) {
                reloadPersonData(person_id)
            }
        })
    })
}

createPersonLabelsText = async (person_id) => {
    let text = ""
    let person = await getActivePersonById(person_id)
    if (typeof person === "undefined") {person = await getPersonById(person_id)}

    person.sl.forEach((sl, sl_d) => {
        if ((sl === false || typeof sl === "undefined")) return
        text = `${text}<div><div>${DAYS[sl_d].substring(0,2)}</div><div>${dbGet_shift_label_cut(sl)}</div></div>`
    })

    return text
}
createPersonMpaText = async (person_id) => {
    let text = ""
    let person = await getActivePersonById(person_id)
    if (typeof person === "undefined") {person = await getPersonById(person_id)}

    person.mpa.forEach((mpa, day_id) => {
        if (mpa === 0) return
        text = `${text}<div><div>${DAYS[day_id].substring(0,2)}</div><div>${mpa}</div></div>`
    })

    return text
}

createPersonIllnessesTextFuture = async (person_id) => {
    let illnesses_sorted = await sortPeoplIllnessesByYear(person_id)
    let illnesses_all = await dbGet_person_illnesses(person_id)

    let illnesses_text_all = []
    if (typeof illnesses_sorted === "undefined") { return illnesses_text_all}
    getI = () => {
        illnesses_sorted.forEach(year_data => {
            let year = year_data.year
            year_data.ids.forEach(illnes_id => { 
                let illnes = illnesses_all.find(il => il.id === illnes_id)
                let checkDate = new Date(new Date(illnes.end).getTime() - new Date(illnes.end).getTimezoneOffset() * 60000)
                if (checkDate.toISOString().substr(0, 10) < new Date(DATE).toISOString().substr(0, 10)) return
                if (year === DATE.getFullYear()) { illnesses_text_all.push(getIllnessesMonth(illnes)) } 
                else { if (illnesses_text_all.indexOf(year) === -1) { illnesses_text_all.push(year) } }
            })
        })
        return illnesses_text_all
    }
    return getI().join([separator = ', '])
}

renderIllnesses = async (person_id) => {
    let block = document.getElementById("Edit-person-illnesses")
    let block_illnes_container = block.getElementsByClassName("container")[0]
    let block_illnesses = await createBlockIllnesses(person_id)
    if (block_illnes_container) block.removeChild(block_illnes_container)
    if (block_illnesses) block.appendChild(block_illnesses)
}

setIllnesEndDate = (max_date) => {
    let block_container = document.getElementById("Edit-person-illnesses")
    let block_add = block_container.getElementsByClassName("container-add")[0]
    let block_end = block_add.getElementsByClassName("end")[0]
    let tomorrow = new Date(max_date)
    if (!isValidDate(tomorrow)) {return}
    tomorrow.setDate(tomorrow.getDate() + 1);

    block_end.setAttribute("min", max_date)
    block_end.value = tomorrow.toISOString().substr(0, 10)
}

checkIfDateIsDuringIllnes = (person_id, date) => {
    return getActivePersonById(person_id).then((person) => {
        let illnesses = person.illnesses
        if (typeof illnesses === "undefined") return false
        let is_true = false
        illnesses.forEach(illnes => {
            let start = illnes.start
            let end = illnes.end
            if (date >= start && date <= end) { is_true = true; return }
        })
        return is_true
    })
}

createBlockIllnesses = async (person_id) => {
    let illnesses = await dbGet_person_illnesses(person_id)
    if ( (typeof illnesses === "undefined") || (illnesses.length === 0) ) return
    let block = document.createElement("div")
    block.classList.add("container")

    let illnesses_sorted = await sortPeoplIllnessesByYear(person_id)
    cB = () => {
        illnesses_sorted.forEach(data => {
            let year = data.year
            let block_container_year = document.createElement("div")
            let block_year_title = document.createElement("div")
            let block_year_items = document.createElement("div")
            block_year_title.classList.add("year")
            block_year_title.innerHTML = year
            block_year_items.classList.add("container-items")
            block_container_year.setAttribute("id", `Illnesses-container-${year}`)
            block_container_year.classList.add("container-data", "font-number")
            block_container_year.appendChild(block_year_title)

            data.ids.forEach(illnes_id => {
                let illnes = illnesses.find(i => i.id === illnes_id)
                let start = new Date(illnes.start)
                let end = new Date(illnes.end)

                let block_container = document.createElement("div")
                let block_label = document.createElement("div")
                let block_remove = document.createElement("button")
                block_remove.classList.add("button-remove")

                block_container.classList.add("item")

                block_remove.innerHTML = "löschen"
                block_remove.setAttribute("onClick", `removeIllnes(${person_id}, ${illnes_id})`)

                let text_start_day = start.getDate()
                let text_start_month = start.getMonth()+1
                if (text_start_day.toString().length === 1) { text_start_day = ` ${text_start_day}` }
                if (text_start_month.toString().length === 1) { text_start_month = `0${text_start_month}` }
                let text_start = `${text_start_day}.${text_start_month}`

                let text_end_day = end.getDate()
                let text_end_month = end.getMonth()+1
                if (text_end_day.toString().length === 1) { text_end_day = ` ${text_end_day}` }
                if (text_end_month.toString().length === 1) { text_end_month = `0${text_end_month}` }
                let text_end = `${text_end_day}.${text_end_month}`
                block_label.classList.add("date")
                block_label.innerHTML = `${text_start} - ${text_end}.${end.getFullYear() % 100}`

                block_container.appendChild(block_label)
                block_container.appendChild(block_remove)
                block_year_items.appendChild(block_container)
            })

            block_container_year.appendChild(block_year_items)
            block.appendChild(block_container_year)
        })
        return block
    }
    return cB()
}


cancelAddIllnes = (el, person_id) => {
    block = el.parentNode
    block.classList.remove("active")
    window.setTimeout(() => {
        block.innerHTML = `<button class="button-add button-whitegreen" onclick="renderAddIllnes(${person_id})">Hinzufügen</button>`
    },50)
}
renderAddIllnes = (person_id) => {
    let block_container = document.getElementById("Edit-person-illnesses")
    let block_add = block_container.getElementsByClassName("container-add")[0]
    block_add.classList.add("active")
    let block_save = block_add.getElementsByClassName("button-add")[0]
    let block_cancel = document.createElement("button")
    block_cancel.classList.add("button-cancel", "button-orange")
    block_cancel.innerHTML = "Abbrechen"
    block_cancel.setAttribute("onClick", `cancelAddIllnes(this, ${person_id})`)
    block_add.appendChild(block_cancel)
    let tomorrow = new Date()
    let after_tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow = new Date(tomorrow.getTime() - tomorrow.getTimezoneOffset() * 60000)
    after_tomorrow.setDate(after_tomorrow.getDate() + 2);
    after_tomorrow = new Date(after_tomorrow.getTime() - after_tomorrow.getTimezoneOffset() * 60000)


    let block_start = document.createElement("input")
    block_start.classList.add("start")
    block_start.setAttribute("type", "date")
    block_start.setAttribute("onchange", `setIllnesEndDate(this.value)`)
    block_start.value = tomorrow.toISOString().substr(0, 10)

    let block_end = document.createElement("input")
    block_end.classList.add("end")
    block_end.setAttribute("type", "date")
    block_end.setAttribute("min", tomorrow)
    block_end.value = after_tomorrow.toISOString().substr(0, 10);

    block_add.appendChild(block_start)
    block_add.appendChild(block_end)

    block_save.setAttribute("onClick", `saveIllnes(${person_id})`)
    block_save.innerHTML = "Speichern"
}


renderBetterments = async (person_id) => {
    let block = document.getElementById("Edit-person-betterments")
    let block_betterment_container = block.getElementsByClassName("container")[0]
    let block_betterments = await createBlockBetterments(person_id)
    if (block_betterment_container) block.removeChild(block_betterment_container)
    if (block_betterments) block.appendChild(block_betterments)
}

setBettermentEndDate = (max_date) => {
    max_date = new Date(max_date)
    if (!isValidDate(max_date)) {return}
    let block_container = document.getElementById("Edit-person-betterments")
    let block_add = block_container.getElementsByClassName("container-add")[0]
    let block_end = block_add.getElementsByClassName("end")[0]

    block_end.setAttribute("min", max_date)
    block_end.value = max_date.toISOString().substr(0, 10)
}

checkIfDateIsDuringBetterment = async (person_id, date) => {
    return getActivePersonById(person_id).then(person => {
        let betterments = person.betterments
        if (typeof betterments === "undefined") return false
        let is_true = false
        betterments.forEach(betterment => {
            let start = betterment.start
            let end = betterment.end
            if (date >= start && date <= end) { is_true = true; return }
        })
        return is_true
    })
}

createBlockBetterments = async (person_id) => {
    let betterments = await dbGet_person_betterments(person_id)
    if ( (typeof betterments === "undefined") || (betterments.length === 0) ) return
    let block = document.createElement("div")
    block.classList.add("container")

    let betterments_sorted = await sortPersonBettermentsByYear(person_id)
    cB = () => {
        betterments_sorted.forEach(data => {
            let year = data.year
            let block_container_year = document.createElement("div")
            let block_year_title = document.createElement("div")
            let block_year_items = document.createElement("div")
            block_year_title.classList.add("year")
            block_year_title.innerHTML = year
            block_year_items.classList.add("container-items")
            block_container_year.setAttribute("id", `Betterments-container-${year}`)
            block_container_year.classList.add("container-data", "font-number")
            block_container_year.appendChild(block_year_title)

            data.ids.forEach(betterment_id => {
                let betterment = betterments.find(b => b.id === betterment_id)
                let start = new Date(betterment.start)
                let end = new Date(betterment.end)

                let block_container = document.createElement("div")
                let block_label = document.createElement("div")
                let block_remove = document.createElement("button")
                block_remove.classList.add("button-remove")

                block_container.classList.add("item")

                block_remove.innerHTML = "löschen"
                block_remove.setAttribute("onClick", `removeBetterment(${person_id}, ${betterment_id})`)

                let text_start_day = start.getDate()
                let text_start_month = start.getMonth()+1
                if (text_start_day.toString().length === 1) { text_start_day = ` ${text_start_day}` }
                if (text_start_month.toString().length === 1) { text_start_month = `0${text_start_month}` }
                let text_start = `${text_start_day}.${text_start_month}`

                let text_end_day = end.getDate()
                let text_end_month = end.getMonth()+1
                if (text_end_day.toString().length === 1) { text_end_day = ` ${text_end_day}` }
                if (text_end_month.toString().length === 1) { text_end_month = `0${text_end_month}` }
                let text_end = `${text_end_day}.${text_end_month}`
                block_label.classList.add("date")
                block_label.innerHTML = `${text_start} - ${text_end}.${end.getFullYear() % 100}`

                let block_hours = document.createElement("div")
                block_hours.innerHTML = betterment.hours

                block_container.appendChild(block_label)
                block_container.appendChild(block_hours)
                block_container.appendChild(block_remove)
                block_year_items.appendChild(block_container)
            })

            block_container_year.appendChild(block_year_items)
            block.appendChild(block_container_year)
        })
        return block
    }
    return cB()
}


cancelAddBetterment = (el, person_id) => {
    block = el.parentNode
    block.classList.remove("active")
    window.setTimeout(() => {
        block.innerHTML = `<button class="button-add button-whitegreen" onclick="renderAddBetterment(${person_id})">Hinzufügen</button>`
    },50)
}
renderAddBetterment = async (person_id) => {
    let person = await getActivePersonById(person_id)
    let block_container = document.getElementById("Edit-person-betterments")
    let block_add = block_container.getElementsByClassName("container-add")[0]
    block_add.classList.add("active")
    let block_save = block_add.getElementsByClassName("button-add")[0]
    let block_cancel = document.createElement("button")
    block_cancel.classList.add("button-cancel", "button-orange")
    block_cancel.innerHTML = "Abbrechen"
    block_cancel.setAttribute("onClick", `cancelAddBetterment(this, ${person_id})`)
    block_add.appendChild(block_cancel)
    let today = new Date()


    let block_start = document.createElement("input")
    block_start.classList.add("start")
    block_start.setAttribute("type", "date")
    block_start.setAttribute("onchange", `setBettermentEndDate(this.value)`)
    block_start.value = today.toISOString().substr(0, 10)
    block_add.appendChild(block_start)

    let block_end = document.createElement("input")
    block_end.classList.add("end")
    block_end.setAttribute("type", "date")
    block_end.setAttribute("min", today)
    block_end.value = today.toISOString().substr(0, 10);
    block_add.appendChild(block_end)

    let block_hours = document.createElement("input")
    block_hours.classList.add("hours")
    block_hours.setAttribute("title", "Stunden pro Tag")
    block_hours.setAttribute("type", "number")
    block_hours.setAttribute("step", "0.25")
    block_hours.value = 8
    block_add.appendChild(block_hours)

    block_save.setAttribute("onClick", `saveBetterment(${person_id})`)
    block_save.innerHTML = "Speichern"
}


getBettermentsMonth = (betterment) => {
    let start = new Date(betterment.start).toLocaleString('default', { month: 'long' }) 
    let end = new Date(betterment.end).toLocaleString('default', { month: 'long' })
    start = start.substring(0,3)
    end = end.substring(0,3)
    if (start === end) { return start 
    } else { return `${start}-${end}` }
}


sortPersonBettermentsByYear = async (person_id) => {
    let sorted = []
    let betterments = await dbGet_person_betterments(person_id)
    betterments.sort((a, b) => { return new Date(a.start) - new Date(b.start)})

    betterments.forEach(betterment => {
        let betterment_id = betterment.id
        let start = new Date(betterment.start)
        let year = start.getFullYear()
        if (sorted.find(data => {return data.year === year})) {
            sorted.find(data => {return data.year === year}).ids.push(betterment_id)
        } else {
            sorted.push({year: year, ids: [betterment_id]})
        }

    })
    sorted.sort((a, b) => { return a.year - b.year })

    return sorted
}
createPersonBettermentsTextFuture = async (person_id) => {
    let betterments_sorted = await sortPersonBettermentsByYear(person_id)
    let betterments_all = await dbGet_person_betterments(person_id)

    let betterments_text_all = []
    if (typeof betterments_sorted === "undefined") { return betterments_text_all}
    getB = () => {
        betterments_sorted.forEach(data => { 
            data.ids.forEach(betterment_id => {
                betterment = betterments_all.find(b => b.id === betterment_id)
                let checkDate = new Date(new Date(betterment.end).getTime() - new Date(betterment.end).getTimezoneOffset() * 60000)
                if (checkDate.toISOString().substr(0, 10) < new Date(DATE).toISOString().substr(0, 10)) return
                let year = new Date(betterment.start).getUTCFullYear()
                if (year === DATE.getFullYear()) { betterments_text_all.push(getBettermentsMonth(betterment)) } 
                else { if (betterments_text_all.indexOf(year) === -1) { betterments_text_all.push(year) } }
            })
        })
        return betterments_text_all
    }
    return getB().join([separator = ', '])

}

addMpaToday = (person_id, day_id, hours) => {
   //let date = getDayDateByDayid(day_id)
   changePersonValue(person_id, "mpa", hours, day_id, "justthis").then(() => {
       setActivePerson(person_id).then(() => {
           reloadPersonData(person_id)
           closeRosterPersonMenu(person_id, day_id)
       })
   })
}

addBettermentToday = (person_id, day_id, hours) => {
   let date = getDayDateByDayid(day_id)
   addBettermentDate(person_id, date, date, hours)
   closeRosterPersonMenu(person_id, day_id)
   getActiveRoster()
}

addBettermentDate = (person_id, start, end, hours) => {
    hours = parseFloat(hours)
    dbAdd_person_betterment(person_id, start, end, hours).then(() => {
        removePersonShiftsBetweenDate(person_id, new Date(start), new Date(end))
        setActivePerson(person_id).then(() => {
            renderBetterments(person_id)
            if (getDateToRosterDate(new Date(start))[0] <= DATE_YEAR_WEEK && getDateToRosterDate(new Date(end))[0] >= DATE_YEAR_WEEK) {
                reloadPersonData(person_id)
            }
        })
    })
}
saveBetterment = (person_id) => {
    let block = document.getElementById("Edit-person-betterments")
    let block_add = block.getElementsByClassName("container-add")[0]
    let block_save = block_add.getElementsByClassName("button-add")[0]
    let block_start = block_add.getElementsByClassName("start")[0]
    let block_end = block_add.getElementsByClassName("end")[0]
    let block_hours = block_add.getElementsByClassName("hours")[0]
    let start = block_start.value
    let end = block_end.value
    let hours = block_hours.value

    addBettermentDate(person_id, start, end, hours)
    cancelAddBetterment(block_add.querySelector(".button-cancel"), person_id)
}

removeBetterment = (person_id, betterment_id) => {
    let betterment = PERSONS.find(p => p.id === person_id).betterments.find(i => i.id === betterment_id)
    dbRemove_person_betterment(betterment_id, person_id).then(() => {
        setActivePerson(person_id).then(() => {
            renderBetterments(person_id)
            if (getDateToRosterDate(new Date(betterment.start))[0] <= DATE_YEAR_WEEK && getDateToRosterDate(new Date(betterment.end))[0] >= DATE_YEAR_WEEK) {
                reloadPersonData(person_id)
            }
        })
    })
}

getIfPersonDayIsFree = async (person_id, day_id, year_week) => {
    if (typeof year_week === "undefined") {year_week = DATE_YEAR_WEEK}
    let is_ture = false
    let day = getIsoStringFromDay(day_id, year_week)
    let person_active = await getActivePersonById(person_id, year_week)
    let closingtime = new Promise((res, rej) => {res(dbGet_closingtime_person_during_date(person_id, day))})
    closingtime = await closingtime 
    let vacations_check = new Promise((res, rej) => {res(checkIfDateIsDuringVacation(person_id, day))})
    vacations_check  = await vacations_check   
    let illnesses_check = new Promise((res, rej) => {res(checkIfDateIsDuringIllnes(person_id, day))})
    illnesses_check = await illnesses_check     
    let betterments_check = new Promise((res, rej) => {res(checkIfDateIsDuringBetterment(person_id, day))})
    betterments_check  = await betterments_check  
    if (closingtime) {is_ture = closingtime.name}
    else if (vacations_check) {is_ture = dbGet_settings_label_cut(3)}
    else if (illnesses_check) {is_ture = dbGet_settings_label_cut(1)}
    else if (betterments_check) {is_ture = dbGet_settings_label_cut(2)}
    else if (person_active.sf[day_id]) {
        is_ture = dbGet_shift_label_cut(person_active.sl[day_id])
    }
    return is_ture
}


checkIfPersonDayIsFree = async (person_id, day_id, year_week) => {
    if (typeof year_week === "undefined") {year_week = DATE_YEAR_WEEK}
    return await getActivePersonById(person_id, year_week).then(person => {
        let free_1 = person.freedays[day_id]
        let free_2 = person.sf[day_id]
        if (free_1) {
            return free_1
        } else if (free_2) {
            if (person.sl[day_id]) {
                return SHIFT_LABELS.find(s => s.id === person.sl[day_id]).cut
            } else {return true}
        } else {
            return false
        }
    })
}

setSelectRenderPerson = (el, value) => {
    let buttons_all = document.querySelectorAll("#Person-list-buttons button")
    for (i=0; i< buttons_all.length; i++) {
        if (el !== buttons_all[i]) buttons_all[i].classList.remove("active")
    }
    if (!el.classList.contains("active")) el.classList.add("active")
    renderPerson(value)
}

getOvertimeTitleText = (overtime, name) => {
	let overtime_t = overtime.toString()
	let firstChar = overtime_t[0];
	if (!Number.isInteger(parseFloat(firstChar))) {
		overtime_t = overtime_t.substr(1)
	}

    if (overtime > 0) {
        return `${name} hat ${overtime_t} Stunden zu lang gearbeitet.`
    } else if ((overtime === 0) || (typeof overtime === "undefined")) {
        return `${name} hat keine Überstunden.`
    } else if (overtime < 0) {
        return `${name} hat ${overtime_t} Stunden zu kurz gearbeitet.`
    }
}

renderPersonTableRow = (person_id) => {
    createR = (person) => {
        let block = document.querySelector(`#Person-table-tr-${person.id}`)
        block.innerHTML = ""
        let nameBlock = document.createElement("td")
        let hoursBlock = document.createElement("td")
        let departmentBlock = document.createElement("td")
        let freedaysBlock = document.createElement("td")
        let block_labels = document.createElement("td")
        let block_mpa = document.createElement("td")
        let block_illnesses = document.createElement("td")
        let block_betterments = document.createElement("td")
        block_betterments.classList.add("td-overflow", "betterment")
        let block_betterments_text  = document.createElement("div")
        let block_vacation = document.createElement("td")
        block_vacation.classList.add("td-overflow", "vacation")
        let block_vacation_text  = document.createElement("div")
        let block_overtime = document.createElement("td")


        nameBlock.innerHTML = person.name
        hoursBlock.innerHTML = person.hours
        departmentBlock.innerHTML = dbGet_department_where_id(person.department)

        block.appendChild(nameBlock)
        block.appendChild(hoursBlock)
        let d_color = DEPARTMENT_COLORS[DEPARTMENTS.map(d => d.id).indexOf(person.department)]
        block.style.background = d_color
        if (PERSONS.map(p => p.id).indexOf(person.id) === -1) { 
            block.classList.add("inactive")
            return
        }

        let freedays = []
        person.sf.forEach((sf, sf_d) => { if (sf) freedays.push(DAYS[sf_d].slice(0,2))})
        freedaysBlock.innerHTML = freedays

        block_labels.classList.add("labels")
        createPersonLabelsText(person.id).then(labels_text => {
            block_labels.innerHTML = labels_text
        })

        block_mpa.classList.add("mpa")
        createPersonMpaText(person.id).then(mpa_text => {
            block_mpa.innerHTML = mpa_text
        })

        createPersonIllnessesTextFuture(person.id).then(illnesses_text => {
            block_illnesses.innerHTML = illnesses_text
        })

        createPersonVacationsTextFuture(person.id).then(vacations_text => {
            block_vacation_text.innerHTML = vacations_text
            block_vacation.appendChild(block_vacation_text)
        })

        createPersonBettermentsTextFuture(person.id).then(betterments_text => {
            block_betterments_text.innerHTML = betterments_text
            block_betterments.appendChild(block_betterments_text)
        })

        let overtime  = person.overtime
        if (overtime > 0) {
            ov_text = `${person.name} hat ${overtime} Stunden zu lang gearbeitet.`
            overtime = `+${overtime}`
        } else if ((overtime === 0) || (typeof overtime === "undefined")) {
            ov_text = `${person.name} hat keine Überstunden.`
        } else if (overtime < 0) {
            ov_text = `${person.name} hat ${overtime.toString().substring(1)} Stunden zu kurz gearbeitet.`
        }
        block_overtime.innerHTML = overtime
        block_overtime.classList.add("td-overtime")
        block_overtime.setAttribute("title", getOvertimeTitleText(overtime, person.name))

        block.appendChild(departmentBlock)
        block.appendChild(freedaysBlock)
        block.appendChild(block_labels)
        block.appendChild(block_mpa)
        block.appendChild(block_illnesses)
        block.appendChild(block_betterments)
        block.appendChild(block_vacation)
        block.appendChild(block_overtime)
    }
    getActivePersonById(person_id).then(person => {
        createR(person)
    })
}

renderPerson = async (selection) => {
    showLoading("renderPerson")
    if (typeof selection === "undefined") {selection = "active"}
    settingsContainerHideAll("Person-container")

    let conPpl = document.getElementById("Person")
    let tb = document.createElement("tbody")
    conPpl.removeChild(conPpl.querySelector("tbody")) &&
    conPpl.appendChild(tb)

    let person_all = []
    if (selection === "active") {person_all = structuredClone(PERSONS)}
    else if (selection === "all") {
        person_all = structuredClone(PERSONS)
        let persons_removed = await dbGet_persons_removed(DATE_YEAR_WEEK)
        persons_removed.forEach(p => person_all.push(p))

    } else if (selection === "removed") {
        let persons_removed = await dbGet_persons_removed(DATE_YEAR_WEEK)
        persons_removed.forEach(p => person_all.push(p))
    }
    if (person_all.length === 0) {
        hideLoading("renderPerson")
        return
    }

    person_all.sort(function (a, b) {
        if (a.n < b.n) {
            return -1;
        }
        if (a.n > b.n) {
            return 1;
        }
        return 0;
    });


    renPe = async (pp) => {
        let ppl = document.createElement("tr")
        tb.appendChild(ppl)
        ppl.setAttribute("class", "Person-tr")
        ppl.setAttribute("id", `Person-table-tr-${pp.id}`)
        ppl.setAttribute("title", `${pp.name} bearbeiten`)
        ppl.setAttribute("onClick", `editPerson(${pp.id})`)
        
        renderPersonTableRow(pp.id)
    }
    person_all.forEach((pp, id) => {
        renPe(pp).then(() => {if (parseFloat(id) === person_all.length-1) hideLoading("renderPerson")})
    })
}

getPersonAverageHoursDefault = async (person_id, day_id, year_week) => {
    let person = await getActivePersonById(person_id, year_week)
    let days_free = 0
    for (let day_id=0; day_id<DAYS.length; day_id++) {
        let cf = new Promise((res, rej) => {res(checkIfPersonDayIsFree(person_id, day_id, year_week))})
        cf = await cf
        if (cf !== false)
        {days = days_free+1}
    }
    return person.hours/(DAYS.length-days_free)
}
getPersonAverageHours = async (person_id, day_id, year_week) => {
    if (typeof year_week === "undefined") {year_week = DATE_YEAR_WEEK}
    return getActivePersonById(person_id, year_week).then(person => {
        if (typeof day_id !== "undefined") {
            let person_sa = person.sa[day_id]
            if (person_sa !== false) {
                let hours = person_sa+TIME_STEP
                return hours
            }
        }
        return getPersonHoursWithFreedays(person_id, year_week).then(async hours => {
            let day_count = DAYS.length
            let sa_check = false
            let s_check = 0
            let roster = await getActiveRosterData(year_week)
            let time_step = roster[day_id].d[1].t-roster[day_id].d[0].t
            for (let d_id=0; d_id<roster.length; d_id++) {
                let free = await checkIfPersonDayIsFree(person_id, d_id, year_week)
                let sa_check = false
                let d_hours = await getPersonDayHoursAndBreaks(person_id, d_id, year_week)[0]
                if (typeof day_id !== "undefined" && !free && d_hours > 0) {
                    sa_check = true
                    hours = hours-d_hours
                } else if (typeof day_id !== "undefined" && !free) {
                    let p_sa = person.sa[d_id]
                    if (typeof p_sa.a !== "undefined") {
                        sa_check = true
                        hours = hours-p_sa.a
                    }
                }
                if ((free !== false) || (sa_check)) {
                    day_count = day_count-1
                    sa_check = false
                    hours = hours-person.mpa[d_id]
                }
            }

            let average
            if ((hours === 0) || (day_count === 0)) {average = TIME_STEP}
            else { average = parseFloat((hours/day_count).toFixed(2)) }

            if (TIME_STEP === 0.25) {
                average = (Math.round(average * 4) / 4).toFixed(2)
            } else if (TIME_STEP === 0.5) {
                average = (Math.round(average * 2) / 2).toFixed(1)
            } else {
                average = Math.round(average)
            }
            average = parseFloat(average)
            if (average < time_step) {average = time_step}
            return average+time_step
        })
    })
}

getPersonHoursWithFreedays = async (person_id, year_week) => {
    if (typeof year_week === "undefined") {year_week = DATE_YEAR_WEEK}
    let person = await getActivePersonById(person_id, year_week)
    let day_count = 0

    let roster = await getActiveRosterData(year_week)
    for (let day_id=0; day_id<roster.length;day_id++) {
        let free = new Promise((res, rej) => {res(checkIfPersonDayIsFree(person_id, day_id, year_week))})
        free = await free
        if (free === dbGet_settings_label_cut(2)) continue
        if (person.sf[day_id]) continue
        if ((free === "Frei") || (!free)) continue
        day_count = day_count+1
    }
    hours = person.hours-day_count*(person.hours/(DAYS.length-person.sf.filter(sf => {return sf === true}).length))
    return parseFloat(hours.toFixed(2))
}


getPersonDayHoursAndBreaks = async (person_id, day_id, year_week) => {
    if (typeof year_week === "undefined") {year_week = DATE_YEAR_WEEK}
    let person = await getActivePersonById(person_id, year_week)
    let hours = person.shifts.filter(s => s.day_id === day_id)?.map(s => s.hours)?.reduce((a,b) => a+b, 0)
    breaks = person.shifts.filter(s => s.day_id ===  day_id).map(s => s.breaks).reduce((a,b) => a+b, 0)
    if ((person.freedays[day_id] === false) && (person.sf[day_id] === false)) {
        hours = hours+person.mpa[day_id]
    }
    let check_date = getIsoStringFromDay(day_id, year_week)
    let betterments = person.betterments.filter(b => b.start <= check_date && b.end >= check_date)
    if (betterments.length > 0) {
        hours = hours+betterments.map(b => b.hours).reduce((a,b) => a+b, 0)
    }
    return [hours, breaks]
}
getOvertimesManualYearweek = (person_id, yearweek) => {
    person = PERSONS.find(p => p.id === person_id)
    return person.overtimes_manual.find(o => o.yearweek === yearweek)?.overtime || 0
}
getPersonHoursAndBreaks = async (person_id, year_week) => {
    let hours = 0
    let breaks = 0
    getD = async () => {
        for (let d=0; d<DAYS.length; d++) {
            let hb = await getPersonDayHoursAndBreaks(person_id, d, year_week)
            hours = hours+hb[0]
            breaks = breaks+hb[1]
            if (d === DAYS.length-1) {hours = hours+getOvertimesManualYearweek(person_id, year_week)} 
        }
        return [ hours, breaks ]
    }
    return await getD()
}

removePersonShiftDuringDate = (person_id, date, noreload) => {
    let date_roster = getDateToRosterDate(date)
    let year_week = date_roster[0]
    let day_id = date_roster[1]

    return removePersonFromShiftDay(person_id, day_id, year_week, noreload)
}

removePersonShiftsBetweenDate = (person_id, start, end, noreload) => {
    start = new Date(start)
    end = new Date(end)
    let date = new Date(structuredClone(start))
    let date_string = date.toISOString().substring(0,10)
    while (date_string >= start.toISOString().substring(0,10) && date_string <= end.toISOString().substring(0,10)) {
        removePersonShiftDuringDate(person_id, date, noreload)
        date.setDate(date.getDate()+1)
        date_string = new Date(date).toISOString().substring(0,10)
    }
}

