renderPopupButtonClose = (onclick) => {
    if (typeof onclick === "undefined") {
        onclick = "closePopup()"
    }
	let block_popup = document.getElementById("Popup-container")
	let block_close = document.createElement("button")
	block_close.classList.add("button-x")
	block_close.setAttribute("onClick", onclick)
	block_popup.appendChild(block_close)
}


closePopup = () => { 
	document.getElementById("Popup-container").innerHTML = "" 
    document.getElementById("Popup-container").style = ""
	document.getElementById("Popup").onclick = null 
	document.getElementById("Popup").removeAttribute("class")
	document.body.classList.remove("noscroll")
}

eventListenerClosePopup = (evt, type) => { 
	let clickEl = document.getElementById("Popup-container")
	let targetEl = evt.target
	do { 
		if (targetEl == clickEl) return
		targetEl = targetEl.parentNode;
	} while (targetEl);


	showLoading("eventListenerClosePopup")
	window.setTimeout(() => {
		if (type === "closingtime") {
			closeClosingTime()
		} else if (type === "copypersonselect"){
			closeCopyPersonPopupSelect()
		} else if (type === "copyperson"){
			closeCopyPersonPopup()
		} else if (type === "help") {
			closeHelp()
		} else {closePopup()}
		hideLoading("eventListenerClosePopup")
	}, 50)
}
