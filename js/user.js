createUserVacations = (vacations) => {
    let block_vacations = document.createElement("div")
    block_vacations.setAttribute("id", "User-vacations")
    block_vacations.classList.add("table-two")
    block_vacations.innerHTML = '<h2 class="title">Urlaub</h2><div class="title">Datum</div><div class="title">Name</div>'
    vacations = vacations.sort((a,b) => b.start.localeCompare(a.start))
    vacations.forEach((v) => {
        let block_date = document.createElement("div")
        if (v.start === v.end) {
            block_date.innerHTML = convertDate(v.start)
        } else {
            block_date.innerHTML = `${convertDate(v.start)} - ${convertDate(v.end)}`
        }
        block_vacations.appendChild(block_date)
        let block_name = document.createElement("div")
        if (typeof v.name !== "undefined") { block_name.innerHTML = v.name }
        block_vacations.appendChild(block_name)
    })
    let br = document.createElement("div")
    br.appendChild(block_vacations)
    return br
}
createUserBetterments = (betterments) => {
    let block_betterments = document.createElement("div")
    block_betterments.setAttribute("id", "User-betterments")
    block_betterments.classList.add("table-two")
    block_betterments.innerHTML = '<h2 class="title">Weiterbildung</h2><div class="title">Datum</div><div class="title">Stunden</div>'
    betterments = betterments.sort((a,b) => b.start.localeCompare(a.start))
    betterments.forEach((v) => {
        let block_date = document.createElement("div")
        if (v.start === v.end) {
            block_date.innerHTML = convertDate(v.start)
        } else {
            block_date.innerHTML = `${convertDate(v.start)} - ${convertDate(v.end)}`
        }
        block_betterments.appendChild(block_date)
        let block_name = document.createElement("div")
        block_name.innerHTML = v.hours
        block_betterments.appendChild(block_name)
    })
    let br = document.createElement("div")
    br.appendChild(block_betterments)
    return br
}
createUserIllnesses = (illnesses) => {
    let block_illnesses = document.createElement("div")
    block_illnesses.setAttribute("id", "User-illnesses")
    block_illnesses.classList.add("table-one")
    block_illnesses.innerHTML = '<h2 class="title">Krankschreibung</h2><div class="title">Datum</div>'
    illnesses = illnesses.sort((a,b) => b.start.localeCompare(a.start))
    illnesses.forEach((v) => {
        let block_date = document.createElement("div")
        if (v.start === v.end) {
            block_date.innerHTML = convertDate(v.start)
        } else {
            block_date.innerHTML = `${convertDate(v.start)} - ${convertDate(v.end)}`
        }
        block_illnesses.appendChild(block_date)
    })
    let br = document.createElement("div")
    br.appendChild(block_illnesses)
    return br
}
createUserOvertimes = (overtimes, overtimes_manual) => {
    let block_overtimes = document.createElement("div")
    block_overtimes.setAttribute("id", "User-overtimes")
    block_overtimes.classList.add("table-three")
    block_overtimes.innerHTML = '<h2 class="title">Überstunden</h2><div class="title">Woche</div><div class="title">Automatisch</div><div class="title">Manuell</div>'
    overtimes = overtimes.sort((a,b) => b.yearweek.localeCompare(a.yearweek))
    let last_yw
    let bl_total_name = document.createElement("div")
    bl_total_name.innerHTML = "Insgesamt"
    block_overtimes.appendChild(bl_total_name)
    let bl_total_val = document.createElement("div")
    bl_total_val.classList.add("font-number")
    block_overtimes.appendChild(bl_total_val)
    let bl_total_m_val = document.createElement("div")
    bl_total_m_val.classList.add("font-number")
    block_overtimes.appendChild(bl_total_m_val)
    let total = 0
    let total_m = 0
    for (let v=0; v<overtimes.length; v++) {
        overtime = overtimes[v]
        if (overtime.yearweek < DATE_YEAR_WEEK_OLDEST) {continue}
        let block_date = document.createElement("div")
        block_date.innerHTML = overtime.yearweek
        block_overtimes.appendChild(block_date)
        let block_overtime = document.createElement("div")
        block_overtime.classList.add("font-number")
        let oo = parseFloat((overtime.hours_is-overtime.hours_should).toFixed(2))
        let om = overtimes_manual.find(o => o.yearweek === overtime.yearweek)?.overtime
        if (om) { total_m = parseFloat((total_m+(om)).toFixed(2))}
        if (om) { oo = parseFloat((oo-(om)).toFixed(2))}
        total = parseFloat((total+(oo)).toFixed(2))
        if (oo === 0) {oo = " 0"}
        else if (oo > 0) {oo = `+${oo}`}
        block_overtime.innerHTML = oo
        block_overtimes.appendChild(block_overtime)
        let block_overtime_m = document.createElement("div")
        block_overtime_m.classList.add("font-number")
        if (om === 0) {om = " 0"}
        else if (om > 0) {om = `+${om}`}
        block_overtime_m.innerHTML = om || ""
        block_overtimes.appendChild(block_overtime_m)
    }
    let to = Math.round(total* 100)/100
    if (to >0) {to = `+${to}`}
    else if (to === 0) {to = ` ${to}`}
    bl_total_val.innerHTML = to
    let tm = Math.round(total_m* 100)/100
    if (tm >0) {tm = `+${tm}`}
    else if (tm === 0) {tm = ` ${tm}`}
    bl_total_m_val.innerHTML = tm
    let br = document.createElement("div")
    br.appendChild(block_overtimes)
    return br
}
renderUserDetails = async () => {
    let response_person = await fetch("/api/persons_active/getUserActive.php", {
        method: "POST",
        body: JSON.stringify({yearweek: DATE_YEAR_WEEK}),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })
	let person = await response_person.json()
    let overtimes = await dbGet_person_overtimes_yearweeks(person.id)
    let block = document.querySelector("#User-details")
    block.appendChild(createUserOvertimes(overtimes, person.overtimes_manual))
    block.appendChild(createUserVacations(person.vacations))
    block.appendChild(createUserBetterments(person.betterments))
    block.appendChild(createUserIllnesses(person.illnesses))
    document.querySelector(`.Roster-week-tr-${person.id}`).classList.add("active")
}
