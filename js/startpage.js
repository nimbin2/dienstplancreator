let block_start = document.getElementById("Start")

startRoster = async () => {
    showLoading("startRoster")
    VERSION = 1
    SETTINGS = await dbGet_settings()
    document.querySelector("#Menu-settings > h3").innerHTML = SETTINGS.institution
    //fixDataByVersion()

    DEPARTMENTS = await dbGet_departments()

	SETTINGS_LABELS = await dbGet_settings_labels()

    SHIFT_LABELS = await dbGet_shift_labels()

	DISPLAY_EDITABLE_CELL = SETTINGS.default_edit_cell_right
    if (DISPLAY_EDITABLE_CELL) {EDITABLE_CELL = true} 
    DISPLAY_EDITABLE_ROW = SETTINGS.default_row_top
    if (DISPLAY_EDITABLE_ROW ) {EDITABLE_ROW = true} 
    DISPLAY_EDITABLE_ROW_BOTTOM = SETTINGS.default_row_bottom
    if (DISPLAY_EDITABLE_ROW_BOTTOM ) {EDITABLE_ROW_BOTTOM = true} 
    DISPLAY_OVERTIME = SETTINGS.default_overtime

    DATE_YEAR_WEEK_OLD = DATE_YEAR_WEEK

    CLOSINGTIMES = await dbGet_closingtimes()

    ROSTERS_YEARWEEK = await dbGet_rosters_yearweek()

    renderMenuWeeks()
    setPrintZoomLevel()
    let date = window.location.search.slice(1)
    if (!getDateOfISOWeek(date)) { date = ROSTERS_YEARWEEK[0]}
    setRosterDate(getDateOfISOWeek(date))

    callback = async () => {
        if (SETTINGS.default_overtime) document.querySelector("#Roster-week-display-overtime button").classList.add("active")
        setPerson().then(async () => {
            getActiveRoster().then(() => {
                    document.querySelector("#Roster-copy-person-from").setAttribute("onClick", `openCopyPersonTablePopup("${DATE_YEAR_WEEK_BEFORE}", "${DATE_YEAR_WEEK}"); document.getElementById("Roster-week-container")?.scrollIntoView();`)
                let printmode = SETTINGS.printmode
                document.querySelector("#Roster-week-print-mode button").innerHTML = PRINT_MODES[printmode]

                document.getElementById("Zoom-roster").value = SETTINGS.zoom_web

                setRosterSortButtons(0)
                setRosterSortButtons(1)
                addSettingsGlobal()

                let scroll = window.location.hash
                if (scroll === "#settings") { renderSettings()}
                else if (scroll) { document.querySelector(`${scroll}`)?.scrollIntoView()}
                hideLoading("startRoster")
            })
        })
    }
    if (ROSTERS_YEARWEEK.indexOf(DATE_YEAR_WEEK) === -1) {
        let get_yw
        if (ROSTERS_YEARWEEK[0] < DATE_YEAR_WEEK) { get_yw = ROSTERS_YEARWEEK[0]}
        else if (ROSTERS_YEARWEEK[ROSTERS_YEARWEEK.length-1] > DATE_YEAR_WEEK) { get_yw = ROSTERS_YEARWEEK[ROSTERS_YEARWEEK.length-1]}
        else { get_yw = ROSTERS_YEARWEEK.find(y => y < DATE_YEAR_WEEK)}
		let roster_old = await dbGet_roster_where_yearweek(get_yw)
        let changes
		if (DATE_YEAR_WEEK < DATE_YEAR_WEEK_OLDEST) { 
			changes = await dbGet_roster_changes_where_yearweek(DATE_YEAR_WEEK_OLDEST)
        }
        dbSet_roster(DATE_YEAR_WEEK, roster_old.time_step, [roster_old.break_60, roster_old.break_90]).then(() => {
            if (DATE_YEAR_WEEK < DATE_YEAR_WEEK_OLDEST) { 
                changes.forEach(c => dbSet_roster_change_where_yearweek_and_day(DATE_YEAR_WEEK, c.day_id, c.start, c.end, c.amount))
            }    
            callA = async () => { 
                dbGet_rosters_yearweek().then(year_weeks => {
                    ROSTERS_YEARWEEK = year_weeks
                    DATE_YEAR_WEEK_NEWEST = ROSTERS_YEARWEEK[0]
                    DATE_YEAR_WEEK_OLDEST = ROSTERS_YEARWEEK[ROSTERS_YEARWEEK.length-1] 
                    callback()
                })
            }
            callA()
        })
    } else {
        callback()
    }
}
startVisitor = async () => {
    showLoading("startRoster")
    VERSION = 1
    SETTINGS = await dbGet_settings()
    document.querySelector("h2.main-title").innerHTML = SETTINGS.institution

    DEPARTMENTS = await dbGet_departments()

	SETTINGS_LABELS = await dbGet_settings_labels()

    SHIFT_LABELS = await dbGet_shift_labels()

	DISPLAY_EDITABLE_CELL = SETTINGS.default_edit_cell_right
    DISPLAY_EDITABLE_ROW = SETTINGS.default_row_top
    DISPLAY_EDITABLE_ROW_BOTTOM = SETTINGS.default_row_bottom
    DISPLAY_OVERTIME = SETTINGS.overtime

    DATE_YEAR_WEEK_OLD = DATE_YEAR_WEEK

    CLOSINGTIMES = await dbGet_closingtimes()

    ROSTERS_YEARWEEK = await dbGet_rosters_yearweek()

    setPrintZoomLevel()
    let date = window.location.search.slice(1)
    if ((!getDateOfISOWeek(date)) || (ROSTERS_YEARWEEK.indexOf(date) === -1)) { date = ROSTERS_YEARWEEK[0]}
    setRosterDate(getDateOfISOWeek(date))

    return setPerson().then(async () => {
        return getActiveRosterWeek().then(() => {
            let printmode = SETTINGS.printmode
            setRosterSortButtons(1)
            hideLoading("startRoster")
            return
        })
    })
}
