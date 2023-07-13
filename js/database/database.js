
dbCreate_database = () => { DATA = {} }
dbCreate_database_default = () => {
    dbCreate_settings_version()
    dbSet_settings_version(VERSION_DEFAULT)

    dbCreate_settings_label()
    dbAdd_settings_label(0, 'mpA', 'MPA')
    dbAdd_settings_label(1, 'Krank', 'Krank')
    dbAdd_settings_label(2, 'Weiterbildung', 'W')
    dbAdd_settings_label(3, 'Urlaub', 'Urlaub')
    dbCreate_shift_label()
    dbAdd_shift_label("Frei", "Frei")
    dbAdd_shift_label("Schule", "S")
    dbCreate_settings_label_text = (id) => { DATA.n[id].t }

    dbCreat_settings_departments()
    dbAdd_settings_department("")
    dbAdd_settings_department("Elementar")
    dbAdd_settings_department("Kleinkind")

    dbCreate_settings_sort_days()
    dbAdd_settings_sort_days("n-d")
    dbCreate_settings_sort_weeks()
    dbAdd_settings_sort_weeks("n-d")

    dbCreate_settings_overtime_default()
    dbCreate_settings_edit_cell_default()
    dbCreate_settings_edit_row_top_default()
    dbCreate_settings_edit_row_bottom_default()

    dbCreate_settings_printmode()

    dbCreate_settings_zoom_print_h()
    dbCreate_settings_zoom_print_v()
    dbCreate_settings_zoom_web()

    dbCreate_closingtimes()

    dbCreate_persons()
    dbCreate_person_changes()
    dbCreate_rosters()
    dbCreate_roster_changes()
}
