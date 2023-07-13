rosterShortcuts = (e) => {
    if (!(e.target.isContentEditable) && !(e.target instanceof HTMLTextAreaElement) && !(e.target instanceof HTMLInputElement)) {
        if (CONSOLE) watchConsole(e)
        else if (e.key === 'w') document.getElementById("Roster-container-week").scrollIntoView()
        else if (e.key === 'p') renderPerson()
        else if (e.key === 'e') renderSettings() 
        else if (e.key === 'v') changeDate('prev')
        else if (e.key === 'h') changeDate(new Date())
        else if (e.key === 'n') changeDate('next')
        else if (e.key === 'z') changeDate(getDateOfISOWeek(DATE_YEAR_WEEK_OLD))
        else if (e.key === 'd') printTable("Roster-week-container", DATE_YEAR_WEEK)
        else if (e.key === '1' && document.getElementById("Roster-0")) document.getElementById("Roster-0").scrollIntoView() 
        else if (e.key === '2' && document.getElementById("Roster-1")) document.getElementById("Roster-1").scrollIntoView() 
        else if (e.key === '3' && document.getElementById("Roster-2")) document.getElementById("Roster-2").scrollIntoView() 
        else if (e.key === '4' && document.getElementById("Roster-3")) document.getElementById("Roster-3").scrollIntoView() 
        else if (e.key === '5' && document.getElementById("Roster-4")) document.getElementById("Roster-4").scrollIntoView() 
        else if (e.key === '6' && document.getElementById("Roster-5")) document.getElementById("Roster-5").scrollIntoView() 
        else if (e.key === '7' && document.getElementById("Roster-6")) document.getElementById("Roster-6").scrollIntoView() 
        else if (e.key === '+') changeZoomLevel(dbGet_settings_zoom_web()+15)
        else if (e.key === '-') changeZoomLevel(dbGet_settings_zoom_web()-15)
        else if (e.key === '0') changeZoomLevel(100)
        else if (e.key === ':') devConsole()
    }
}
document.addEventListener('keyup', rosterShortcuts, false);
