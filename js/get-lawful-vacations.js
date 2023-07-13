let LAWFUL_STATES = [["Alle Bundesländer", ""], ["bundesweit", "&all_states=true"], ["Baden-Württemberg", "&states=bw"], ["Bayern", "&states=by"], ["Berlin", "&states=be"], ["Brandenburg", "&states=bb"], ["Bremen", "&states=hb"], ["Hamburg", "&states=hh"], ["Hessen", "&states=he"], ["Mecklenburg-Vorpommern", "&states=mv"], ["Niedersachsen", "&states=ni"], ["Nordrhein-Westfalen", "&states=nw"], ["Rheinland-Pfalz", "&states=rp"], ["Saarland", "&states=sl"], ["Sachsen", "&states=sn"], ["Sachsen-Anhalt", "&states=st"], ["Schleswig-Holstein", "&states=sh"], ["Thüringen", "&states=th"]]

addClosingTimeLawfulVacations = () => {
   let block_popup = document.getElementById("Popup-container")
   block_popup.classList.add("lawful")
   block_popup.innerHTML = ""

	renderPopupButtonClose()

   let block_back = document.createElement("button")
   block_back.innerHTML = "Zurück"
   block_back.classList.add("button-back")
   block_back.setAttribute("onClick", "window.setTimeout(() => {openClosingTime()},50)")
   block_popup.appendChild(block_back)

   let block_text = document.createElement("p")
   block_text.innerHTML = "Beim bestätigen wird eine anfrage an die folgende Seite geschickt: <a href='https://www.api-feiertage.de'>https://www.api-feiertage.de</a>\nDamit erklärs du dich mit den Datenschutzbedingungen dieser Seite einverstanden. Die Datenschutz bedingunen kannst du <a href='https://www.api-feiertage.de/datenschutz.html'>hier</a> einsehen."
   block_popup.appendChild(block_text)

   let block_continue = document.createElement("button")
   block_continue.innerHTML = "Bestätigen"
   block_continue.setAttribute("onClick", "window.setTimeout(() => {continueAddClosingTimeLawfulVacations()}, 50)")
   block_popup.appendChild(block_continue)
}

continueAddClosingTimeLawfulVacations = () => {
   let block_popup = document.getElementById("Popup-container")
   block_popup.innerHTML = ""

	renderPopupButtonClose()

   let block_back = document.createElement("button")
   block_back.innerHTML = "Zurück"
   block_back.classList.add("button-back")
   block_back.setAttribute("onClick", "window.setTimeout(() => {addClosingTimeLawfulVacations()},50)")
   block_popup.appendChild(block_back)

   let block_label_select_year = document.createElement("label")
   let block_select_year = document.createElement("select")
   block_select_year.setAttribute("id", "Lawful-vacations-year")
   let block_select_option_1 = document.createElement("option")
   let year = new Date().getFullYear()
   block_select_option_1.setAttribute("value", year)
   block_select_option_1.innerHTML = year
   block_select_year.appendChild(block_select_option_1)
   let block_select_option_2 = document.createElement("option")
   block_select_option_2.setAttribute("value", year+1)
   block_select_option_2.innerHTML = year+1
   block_select_year.appendChild(block_select_option_2)
   let block_select_option_3 = document.createElement("option")
   block_select_option_3.setAttribute("value", year+2)
   block_select_option_3.innerHTML = year+2
   block_select_year.appendChild(block_select_option_3)
   block_label_select_year.appendChild(block_select_year)
   block_popup.appendChild(block_label_select_year)

   let block_label_select_state = document.createElement("label")
   let block_select_state = document.createElement("select")
   block_select_state.setAttribute("id", "Lawful-vacations-state")
   LAWFUL_STATES.forEach((state, s_id) => {
      let block_option = document.createElement("option")
      block_option.innerHTML = state[0]
      block_option.setAttribute("value", s_id)
      block_select_state.appendChild(block_option)
   })
   block_label_select_state.appendChild(block_select_state)
   block_popup.appendChild(block_label_select_state)

   let block_continue = document.createElement("button")
   block_continue.innerHTML = "Weiter"
   block_continue.setAttribute("onClick", `window.setTimeout(() => {getLawfulVacations(document.getElementById("Lawful-vacations-year").value, document.getElementById("Lawful-vacations-state").value)},50)`)
   block_popup.appendChild(block_continue)
}

createLawfulVacationsDroptown = () => {
	let block_label_select = document.createElement("label")
	let block_select = document.createElement("select")
	LAWFUL_STATES.forEach(name => {
		let block_option = document.createElement("option")
		block_option.value = name[1]
      block_option.innerHTML = name[0]
      block_select.appendChild(block_option)
	})
   block_label_select.appendChild(block_select)
   return block_select
}



getLawfulVacations = (year, s_id) => {
   let state = LAWFUL_STATES[s_id][1]
	fetch(`https://get.api-feiertage.de?years=${year}${state}`)
		.then(res => res.json())
		.then((data) => {
		createLawfulVacationsConfirm(s_id, year, data.feiertage)
	}).catch(err => console.error(err));
}

createLawfulVacationsConfirm = (s_id, year, vacations) => {
	let block_popup = document.getElementById("Popup-container")
	block_popup.innerHTML = ""
	renderPopupButtonClose()	

   let block_back = document.createElement("button")
   block_back.innerHTML = "Zurück"
   block_back.classList.add("button-back")
   block_back.setAttribute("onClick", "window.setTimeout(() => {continueAddClosingTimeLawfulVacations()},50)")
   block_popup.appendChild(block_back)
   
   let block = document.createElement("div")
	block.classList.add("lawful-vacations")
	let block_container = document.createElement("div")
	let block_state = document.createElement("h2")
	block_state.innerHTML = LAWFUL_STATES[s_id][0]
   block.appendChild(block_state)
	let block_year = document.createElement("h2")
	block_year.innerHTML = year
   block.appendChild(block_year)

	vacations.forEach(vacation => {
		let name = vacation.fname
		let date = vacation.date
		let date_local = new Date(date).toLocaleDateString('de', {day: '2-digit', month: '2-digit', year: '2-digit'})
		let block_label = document.createElement("label")
		block_label.innerHTML = name
		block_container.appendChild(block_label)
		let block_date = document.createElement("div")
		block_date.innerHTML = date_local
		block_container.appendChild(block_date)
		let block_check = document.createElement("input")
		block_check.setAttribute("type", "checkbox")
		block_check.setAttribute("checked", "true")
		block_check.setAttribute("name", name)
		block_check.setAttribute("date", date)
		block_container.appendChild(block_check)
	})
	block.appendChild(block_container)
	let block_save = document.createElement("button")
	block_save.innerHTML = "Hinzufügen"
	block_save.setAttribute("onClick", "saveLawfulVacations()")
   block_save.classList.add("button-save")
	block.appendChild(block_save)

	block_popup.appendChild(block)
	return block
}

saveLawfulVacations = () => {
	showLoading("saveLawfulVacations")
	window.setTimeout(() => {
		let items = document.querySelectorAll(".lawful-vacations input:checked")
		items.forEach(item => {
			let name = item.getAttribute("name")
			let date = item.getAttribute("date")
			addClosingTime(name, date, date, true)
		})
		closePopup()
		openClosingTime(document.getElementById("Settings-toggle-closingtime"))

		hideLoading("saveLawfulVacations")
	}, 50)
}
