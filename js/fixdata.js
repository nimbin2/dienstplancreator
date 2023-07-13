// FIX FILE_DATA -->
fixPersonShift = () => {
    getShiftPeriod = (person_id, day_id, roster) => {
        if (typeof roster === "undefined") roster = ROSTER
        let day = roster[day_id].data
        let period = []

        day.forEach((data, time_id) => {
            if (typeof data.person === "undefined") return
            if (data.person.indexOf(person_id) !== -1) period.push(data.time)
        })
        return period
    }
    ROSTER_ALL.forEach((roster, roster_id) => {
        if (roster.length === 0) return
        delete roster.times
        delete roster.timestart
        delete roster.timeend
        if ( typeof roster.person === "undefined" ) return 

        getTI = (time, data) => { return data.map((e) => {return e.time}).indexOf(time)} 

        roster.person.forEach((person, person_id) => {
            delete person.hours_assigned
            delete person.breaks_total
            if (typeof person.shifts !== "undefined") return
            roster.roster.forEach((day, day_id) => {
                let period = getShiftPeriod(person_id, day_id, roster.roster)
                if (typeof person.shifts === "undefined") person.shifts = []
                if (period.length === 0) return
                let dd = day.data
                let start = period[0]
                ROSTER_ALL[roster_id].person[person_id].shifts.push({day: day_id, start: getTI(period[0], dd), end: getTI(period[period.length-1], dd)})
            })
        })
        roster.roster.forEach(day => {
            day.data.forEach(data => {
                delete data.person
            })
        })
        roster.d = roster.date
        roster.t = roster.timestep
        roster.r = structuredClone(roster.roster)
        roster.p = structuredClone(roster.person)
        roster.s = roster.datestart
        delete roster.roster
        delete roster.person
        delete roster.date
        delete roster.timestep
        delete roster.datestart
        roster.r.forEach(roster => {
            roster.n = roster.name
            roster.d = roster.data
            delete roster.name
            delete roster.data
            roster.d.forEach(data => {
                data.t = data.time
                data.a = data.amount
                delete data.time
                delete data.amount
            })
        })
        roster.p.forEach((person) => {
            person.n = person.name
            person.h = person.hours
            person.d = person.department
            person.f = structuredClone(person.freedays)
            person.p = person.preferred
            person.s = structuredClone(person.shifts)
            delete person.name
            delete person.hours
            delete person.department
            delete person.freedays
            delete person.preferred
            delete person.shifts
            person.s.forEach(shift => {
                shift.d = shift.day
                shift.s = shift.start
                shift.e = shift.end
                delete shift.day
                delete shift.start
                delete shift.end
            })
        })
    })
}
fixShiftFromIdToTime = () => {
    ROSTER_ALL.forEach((data, data_id) => {
        let person = data.p
        person.forEach((person, person_id) => {
            person.s.forEach(shift => {
                shift.s = data.r[0].d[shift.s].t
                shift.e = data.r[0].d[shift.e].t
            }) 
        })
    })
}
fixRosterPreVersion = () => {
    ROSTER_ALL = structuredClone(DATA)
    fixPersonShift()
    fixShiftFromIdToTime()
}
fixVersionAddBreakday = () => {
    ROSTER_ALL = structuredClone(DATA.a)
    ROSTER_ALL.forEach(ra => { ra.b = [DAYBREAK_1, DAYBREAK_2] })
}
fixVersionNewDatabase = () => {
    let PERSONS_ALL = []
    ROSTER_ALL = DATA.a
    ROSTER_ALL.forEach((ra, ra_id) => {
        let shifts_all = DATA.a[ra_id].s = []
        ra.p.forEach((pe, pe_id) => {
            let shifts = pe.s
            let person = PERSONS_ALL.filter(a => {return a.n === pe.n })[0]
            let p_id = pe_id
            if (typeof person !== "undefined") { p_id = person.id }
            shifts.forEach(shift => {
                let s_d_id = shifts_all.map(function(e) { return e.d; }).indexOf(shift.d);
                if (s_d_id === -1) {
                    shifts_all.push({d: shift.d, s: []})
                    s_d_id = shifts_all.length-1
                } 
                let s_d = shifts_all[s_d_id].s
                delete shift.d
                shift.p = p_id
                s_d.push(shift)
            })
            if (typeof person === "undefined") {
                let ill = (typeof pe.i === "undefined") ? [] : pe.i
                PERSONS_ALL.push({id: pe_id, a: ROSTER_ALL[0].d, r: false, n: pe.n, h: pe.h, d: pe.d, f: pe.f, i: ill, v: pe.v, c: []})
            }
        })
    })
    //ROSTER_ALL.forEach(all => { delete all.p })
    DATA.p = PERSONS_ALL
    DATA.v = 1.2
}
fixVersionAddMpaToPerson = () => {
    DATA.p.forEach(person => {person.m = []; DAYS.forEach(d => person.m.push(0))})
}
fixVersionAddDataSort = () => {
    DATA.s = ["name", "name"]
}
fixVersionAddDataSortUpDown = () => {
    DATA.s = [[`${DATA.s[0].substring(0, 1)}-d`], [`${DATA.s[1].substring(0, 1)}-d`]]
}
fixVersionPersonDepartmentToFloat = () => {
	DATA.p.forEach(person => {person.d = parseFloat(person.d)})
}
fixVersionAddDataZoom = () => {
    DATA.z = 100
}
fixVersionAddDataDepartment = () => {
    DATA.d = structuredClone(DEPARTMENTS)
    DATA.n = [{t: "Freie Tage", a: "Frei"}, {t: "mpA", a: "MPA"}]
}
fixVersionAddDataBetterment = () => {
    DATA.p.forEach(person => {person.b = []})
}
fixVersionAddDataRenames = () => {
    DATA.n.push({t: "Krank", a: "Krank"})
    DATA.n.push({t: "Weiterbildung", a: "W"})
    DATA.n.push({t: "Urlaub", a: "Urlaub"})
}
fixVersionRemoveDateRosterPerson = () => {
    DATA.a.forEach(data => {
        delete data.p
    })
}
fixVersionAddDatePersonOvertime = () => {
    DATA.a.forEach(data => {setPersonOvertime(data.d)})
}
fixVersionAddDatePersonOvertimeFixMpaFreeDay = () => {
    DATA.a.forEach(data => {setPersonOvertime(data.d)})
}
fixVersionAddDataPrintMode = () => {
    DATA.m = 0
}
fixVersionAddBettermentsHours = () => {
    DATA.p.forEach(person => {
            person.b.forEach(b => b.push(parseFloat(person.h/DAYS.length.toFixed(2))))
    })
}
fixVersionAddMissingPersonR = () => {
    DATA.p.forEach(person => {
        if (typeof person.r === "undefined") {person.r = false}
    })
}
fixVersionDataRosterTime = () => {
    DATA.a.sort((a, b) => {return getDateOfISOWeek(a.d) - getDateOfISOWeek(b.d)})
    DATA.a.forEach(a => {a.c = []})
    let data_r = DATA.a[0].r

    DATA.a.forEach((data, data_id) => {
        let days = []
        let step = data.t
        let change = false
        data.r.forEach((roster, d_id) => {
                let times = roster.d
                amount = structuredClone(roster.d.map(d => d.a))
                if ((data_id === 0) || (JSON.stringify(times) !== JSON.stringify(DATA.a[data_id-1].r[d_id].d) )) {
                    DATA.a[data_id].c.push({k: "d_"+d_id, s: times[0].t, e: times[times.length-1].t, a: amount})
                }
            })
    })
    DATA.a.forEach(a => {delete a.r})
}
fixVersionAddDataClosingTime = () => {
    DATA.x = []
}
fixVersionDataOvertimeToFixed = () => {
    DATA.a.forEach(data => {
        if (data.s.map(a => a.s).filter(a => a.length > 0).length === 0)  {data.o = []; return}
        setPersonOvertime(data.d)
    })
}
fixVersionDataSortToSetting = () => {
    let sort = structuredClone(DATA.s)
    DATA.s = [{s: [[...sort[0]], [...sort[1]]]}]
}
fixVersionDataAddPrintZoom = () => {
    DATA.s.push({z: [100, 78]})
}
fixVersionDataEditableToR = () => {
    DATA.a.forEach(data => { if (typeof data.e !== "undefined") {let e = structuredClone(data.e); data.e = {r: [...e]}}})
}
fixVersionDataAddEditable = () => {
    DATA.a.forEach(data =>{if (typeof data.e === "undefined") {data.e = {}}})
}
fixVersionDataFixOvertimes = () => {
    DATA.a.forEach(data =>{ 
		data.o.forEach(overtime => setPersonIdOvertime(overtime.p, data.d))
    })
}
fixVersionDataRemovePersonR = () => {
    DATA.p.forEach(p => {delete p.r})
}
fixVersionDataAddPersonShiftSetting = () => {
    DATA.p.forEach(p => {
        p.c.push({d: p.a, k: "sa", v: [{d: 0, a: undefined}, {d: 1, a: undefined}, {d: 2, a: undefined}, {d: 3, a: undefined}, {d: 4, a: undefined} ]})
        let sf_0 = p.f.indexOf(0); if (sf_0 === -1) {sf_0 = false} else {sf_0 = true}
        let sf_1 = p.f.indexOf(1); if (sf_1 === -1) {sf_1 = false} else {sf_1 = true}
        let sf_2 = p.f.indexOf(2); if (sf_2 === -1) {sf_2 = false} else {sf_2 = true}
        let sf_3 = p.f.indexOf(3); if (sf_3 === -1) {sf_3 = false} else {sf_3 = true}
        let sf_4 = p.f.indexOf(4); if (sf_4 === -1) {sf_4 = false} else {sf_4 = true}
        let sl_0 = p.f.indexOf(0); if (sl_0 === -1) {sl_0 = undefined} else {sl_0 = 1}
        let sl_1 = p.f.indexOf(1); if (sl_1 === -1) {sl_1 = undefined} else {sl_1 = 1}
        let sl_2 = p.f.indexOf(2); if (sl_2 === -1) {sl_2 = undefined} else {sl_2 = 1}
        let sl_3 = p.f.indexOf(3); if (sl_3 === -1) {sl_3 = undefined} else {sl_3 = 1}
        let sl_4 = p.f.indexOf(4); if (sl_4 === -1) {sl_4 = undefined} else {sl_4 = 1}
        p.c.push({d: p.a, k: "sl", v: [{d: 0, l: sl_0}, {d: 1, l: sl_1}, {d: 2, l: sl_2}, {d: 3, l: sl_3}, {d: 4, l: sl_4} ]})
        p.c.push({d: p.a, k: "sf", v: [{d: 0, f: sf_0}, {d: 1, f: sf_1}, {d: 2, f: sf_2}, {d: 3, f: sf_3}, {d: 4, f: sf_4} ]})
        p.c.forEach(c => {
            if (c.k === "f") {
                let sf_values = getActivePersonById(p.id, c.d)
                let new_sf = []
                let new_sl = []
                DAYS.forEach((day, day_id) => {
                    if (c.v.indexOf(day_id) > -1) {
                        new_sf.push({d: day_id, f: true})
                        new_sl.push({d: day_id, l: 1})
                    } else {
                        new_sf.push({d: day_id, f: false})
                        new_sl.push({d: day_id, l: undefined})
                    }
                })
                c.k = "sf"
                c.v = structuredClone(new_sf)
                let check_sl = p.c.filter(sl => {return sl.d === c.d && sl.k === "sl"})[0]
                if (typeof check_sl !== "undefined") {
                    check_sl.v = structuredClone(new_sl)
                } else p.c.push({d: c.d, k: "sl", v: structuredClone(new_sl)})
            }
        })
        delete p.f
    })
    DATA.n.splice(0, 1)
    DATA.l = structuredClone(SHIFT_LABELS)
}
fixVersionData22To224 = () => {
    fixVersionDataRemovePersonR()
    fixVersionDataAddPersonShiftSetting()
    fixVersionDataOvertimeToFixed()
    fixVersionDataFixOvertimes()
}
fixVersionDataTo224 = () => {
    fixVersionDataRemovePersonR()
    fixVersionDataAddPersonShiftSetting()
    fixVersionDataFixOvertimes()
}
fixVersionDataAddDisplayOvertime = () => {
    DATA.s.push({d: [{k: "overtime", v: false}]})
}
fixVersionDataAddDisplayEditableWeek = () => {
    DATA.s.filter(s => {return s.d})[0].d.push({k: "editable-cell", v: true})
    DATA.s.filter(s => {return s.d})[0].d.push({k: "editable-row", v: false})
}
fixVersionDataAddClosingTimeX = () => {
   DATA.x.forEach(data => data.d.forEach(d => d.x = false))
}
fixVersionDataRemoveEmptyShiftInfo = () => {
   DATA.a.forEach(a => {
      if (typeof a.i !== "undefined") {
         let new_i = []
         a.i.forEach(i => {if (i.t.length > 0) new_i.push(i)})
         a.i = new_i
      }
   })
}
fixVersionDataFixUnsetSf = () => {
   DATA.p.forEach(person => {
      person.c.forEach(change => {
         if (change.k === "sf") {
            change.v.forEach(v => {if (typeof v.f === "undefined") {v.f = false}})
         }
      })
   })
}
fixVersionDataEditableRowBottom = () => {
   DATA.s[2].d.push({k: 'editable-row-bottom', v: false})
}
fixVersionDataMergeClosingtime = () =>  {
    let all = []
    DATA.x.forEach(x => x.d.forEach(d => all.push(d)))
    DATA.x = structuredClone(all)
}
fixVersionDataSetClosingtimeId = () => {
    DATA.x.forEach((x, x_id) => {x.id = x_id})
}
fixYWTo7 = (yw) => {return yw.length === 6 ? (yw.substring(0,5)+"0"+yw.substring(5)) : yw}
fixVersionDataSetYearWeekTo7 = () => {
    DATA.a.forEach(a => { a.d = fixYWTo7(a.d) })
    DATA.p.forEach(p => {
        p.a = fixYWTo7(p.a)
        p.c.forEach(c => c.d = fixYWTo7(c.d))
    })
}
fixVersionDataNewRosterChangeValue = () => {
    DATA.rc = []
    DATA.a.forEach(a => {a.c.forEach(c => {c.k = parseFloat(c.k.slice(-1)); c.d = a.d; DATA.rc.push(c)}); delete a.c})
    //DATA.a.forEach(a => {a.c.forEach(c => {c.k = parseFloat(c.k.slice(-1))} )})
    //DATA.rs = []
    //let d_id = -1
    //DATA.a.forEach(a => {a.s.forEach(s => s.s.forEach(d => {d_id = d_id+1; d.id = d_id; d.d = a.d; d.k = s.d; DATA.rs.push(d)})); delete a.s})
    DATA.a.forEach(a => {
        let new_s = []
        a.s.forEach(d => { 
            let new_sd = []
            d.s.forEach(s => new_sd.push(s))
            new_s.push(new_sd)
        }) 
        a.s = new_s
    })
}
fixVersionDataNewSettingsValues = () => {
    DATA.sd = DATA.s[0].s[0]
    DATA.sw = DATA.s[0].s[1]
    DATA.zh = DATA.s[1].z[0]
    DATA.zv = DATA.s[1].z[1]
    DATA.so = DATA.s[2].d[0].v
    DATA.secr = DATA.s[2].d[1].v
    DATA.sert = DATA.s[2].d[2].v
    DATA.serb = DATA.s[2].d[3].v
    delete DATA.s
    DATA.n.forEach((n, n_id) => n.id = n_id)
    DATA.a.forEach(a => {let er = []; a.e?.c?.forEach((r, r_id) => er.push({k: r.p.toString(), v: r.t})); if (er.length > 0) {a.ecr = er; delete a.e.c} })
    DATA.a.forEach(a => {let rt = []; a.e?.r?.forEach((r, r_id) => rt.push({k: r_id.toString(), v: r})); if (rt.length > 0) {a.ert = rt; delete a.e.r} })
    DATA.a.forEach(a => {let rb = []; a.e?.rb?.forEach((r, r_id) => rb.push({k: r_id.toString(), v: r})); if (rb.length > 0) {a.erb = rb; delete a.e.rb} })
    DATA.a.forEach(a => {delete a.e})
    DATA.l.forEach(l => {l.id = l.i; delete l.i})
    let dep = [{id: 0, v: ""}]
    DATA.d.forEach((d, id) => dep.push({id: id+1, v: d}))
    DATA.d = dep
    DATA.p.forEach(p => { p.c = p.c.sort((a,b) => a.d.localeCompare(b.d)) })
    DATA.p.forEach(p => {p.d = p.d+1; p.c.forEach(c => {if (c.k === "d") {c.v = c.v+1}})})
    DATA.p.forEach(p => {
        let old_sl
        let sl
        let r_ids = []
        p.c.forEach((c, c_id) => {
            if (c.k === "sl") {
                old_sl = structuredClone(sl); sl = structuredClone(c.v); 
                if (old_sl && JSON.stringify(sl) !== JSON.stringify(old_sl)) {
                    old_sl.forEach(osl => {
                        if (osl.l) { 
                            !c.v.find(cc => cc.d === osl.d).l && (c.v.find(cc => cc.d === osl.d).l = false)
                        }
                    })
                }
                old_sl && JSON.stringify(sl) === JSON.stringify(old_sl) && r_ids.push(c_id)
                old_sl && (c.v = c.v.filter(v => typeof v.l !== "undefined"))
            }
        })
        r_ids.length > 0 && (p.c = p.c.filter((c, c_id) => r_ids.indexOf(c_id) === -1))
    })
    DATA.p.forEach(p => {
        let old_sl
        let sl
        let r_ids = []
        p.c.forEach((c, c_id) => {
            if (c.k === "sf") {
                c.v.forEach(v => !v.f && (delete v.f))
            }
        })
        p.c.forEach((c, c_id) => {
            if (c.k === "sf") {
                old_sl = structuredClone(sl); sl = structuredClone(c.v); 
                if (old_sl && JSON.stringify(sl) !== JSON.stringify(old_sl)) {
                    old_sl.forEach(osl => {
                        if (osl.f) { 
                            !c.v.find(cc => cc.d === osl.d).f && (c.v.find(cc => cc.d === osl.d).f = false)
                        }
                    })
                }
                old_sl && JSON.stringify(sl) === JSON.stringify(old_sl) && r_ids.push(c_id)
                old_sl && (c.v = c.v.filter(v => typeof v.f !== "undefined"))
            }
        })
        r_ids.length > 0 && (p.c = p.c.filter((c, c_id) => r_ids.indexOf(c_id) === -1))
    })
    DATA.p.forEach(p => {
        let old_sl
        let sl
        let r_ids = []
        p.c.forEach((c, c_id) => {
            if (c.k === "sa") {
                old_sl = structuredClone(sl); sl = structuredClone(c.v); 
                if (old_sl && JSON.stringify(sl) !== JSON.stringify(old_sl)) {
                    old_sl.forEach(osl => {
                        if (osl.a) { 
                            !c.v.find(cc => cc.d === osl.d).a && (c.v.find(cc => cc.d === osl.d).a = false)
                        }
                    })
                }
                old_sl && JSON.stringify(sl) === JSON.stringify(old_sl) && r_ids.push(c_id)
                old_sl && (c.v = c.v.filter(v => typeof v.a !== "undefined"))
            }
        })
        r_ids.length > 0 && (p.c = p.c.filter((c, c_id) => r_ids.indexOf(c_id) === -1))
    })
    DATA.p.forEach(p => { p.c.sort((a,b) => b.d.localeCompare(a.d))})
    DATA.p.forEach(p => { p.c.filter(c => c.k === "m").forEach(c => {let new_v = []; c.v.forEach((v, v_id) => new_v.push({d: v_id, v: v}) ); c.v = new_v }) })
    DATA.p.forEach(p => { 
        let old_m = [{d: 0, v: 0}, {d: 1, v: 0}, {d: 2, v: 0}, {d: 3, v: 0}, {d: 4, v: 0} ]
        let new_m
        p.c.filter(c => c.k === "m").forEach(c => {
            c.v = c.v.filter(v => v.v !== old_m.find(o => o.d === v.d).v)
            c.v.forEach(v => old_m.find(o => o.d === v.d).v = v.v)
        }) 
    })
    DATA.p.forEach(p => { p.c = p.c.filter(c => c.v.length > 0)})

    DATA.pc = []
    DATA.p.forEach(p => {
        p.c.forEach(c => {
                c.k === "sl" && c.v.forEach(v => {v.v = v.l; delete v.l; !v.v && (v.v = false)})
                c.k === "sf" && c.v.forEach(v => {v.v = v.f; delete v.f; !v.v && (v.v = false)})
                c.k === "sa" && c.v.forEach(v => {v.v = v.a; delete v.a; !v.v && (v.v = false)})
        })
        p.c.forEach(c => {
            if ((c.k === "sl") || (c.k === "sa") || (c.k === "sf") || (c.k === "m")) {
                c.v.forEach(v => DATA.pc.push({p: p.id, d: c.d, t: v.d, k: c.k, v: v.v}))
            } else { DATA.pc.push({p: p.id, d: c.d, k: c.k, v: c.v})}
        })
        delete p.c
    })
    DATA.rc.sort((a,b) => a.d.localeCompare(b.d))

    let oldest_yw = DATA.pc.map(c => c.d).sort((a,b) => a.localeCompare(b))[0]
    DATA.pc = DATA.pc.filter(c => `${c.d}-${c.k}-${c.v}` !== `${oldest_yw}-sl-false` )
    DATA.pc = DATA.pc.filter(c => `${c.d}-${c.k}-${c.v}` !== `${oldest_yw}-sf-false` )
    DATA.pc = DATA.pc.filter(c => `${c.d}-${c.k}-${c.v}` !== `${oldest_yw}-sa-false` )
    /*DATA.pc.filter(c => c.k === "sl").forEach(c => {
        let free = DATA.pc.find(cf => cf.d === c.d && cf.k === "sf" && cf.t === c.t)?.v || false
        c.f = free
    })
    DATA.pc = DATA.pc.filter(c => c.k !== "sf")*/
    DATA.a.forEach(a => {
        let new_o = []
        a.o.forEach(o => new_o.push([o.p, o.o]))
        a.o = new_o
    })
}

fixDataByVersion = (DATA) => {
    if (typeof dbGet_settings_version() === "undefined") { fixRosterPreVersion(); dbSet_settings_version(1); VERSION = 1;}

    if (dbGet_settings_version() === 1)      { fixVersionAddBreakday(); dbSet_settings_version(1.1); VERSION = 1.1;}
    if (dbGet_settings_version() === 1.1)    { fixVersionNewDatabase(); dbSet_settings_version(1.2); VERSION = 1.2;}
    if (dbGet_settings_version() === 1.2)    { fixVersionAddMpaToPerson(); dbSet_settings_version(1.3); VERSION = 1.3;}
    if (dbGet_settings_version() === 1.3)    { fixVersionAddDataSort(); dbSet_settings_version(1.4); VERSION = 1.4;}
    if (dbGet_settings_version() === 1.4)    { fixVersionAddDataSortUpDown(); fixVersionPersonDepartmentToFloat(); dbSet_settings_version(1.5); VERSION = 1.5;}
    if (dbGet_settings_version() === 1.5)    { fixVersionAddDataZoom(); fixVersionPersonDepartmentToFloat(); dbSet_settings_version(1.6); VERSION = 1.6;}
    if (dbGet_settings_version() === 1.6)    { fixVersionAddDataDepartment(); dbSet_settings_version(1.7); VERSION = 1.7;}
    if (dbGet_settings_version() === 1.7)    { fixVersionAddDataBetterment(); dbSet_settings_version(1.8); VERSION = 1.8;}
    if (dbGet_settings_version() === 1.8)    { fixVersionAddDataRenames(); dbSet_settings_version(1.9); VERSION = 1.9;}
    if (dbGet_settings_version() === 1.9)    { fixVersionRemoveDateRosterPerson(); dbSet_settings_version(1.11); VERSION = 1.11;}
    if (dbGet_settings_version() === 1.11)    { fixVersionAddDatePersonOvertime(); dbSet_settings_version(1.12); VERSION = 1.12;}
    if (dbGet_settings_version() === 1.12)    { fixVersionAddDatePersonOvertimeFixMpaFreeDay(); dbSet_settings_version(1.13); VERSION = 1.13;}
    if (dbGet_settings_version() === 1.13)    { fixVersionAddDataPrintMode(); dbSet_settings_version(1.14); VERSION = 1.14;}
    if (dbGet_settings_version() === 1.14)    { fixVersionAddBettermentsHours(); dbSet_settings_version(1.15); VERSION = 1.15;}
    if (dbGet_settings_version() === 1.15)    { fixVersionAddMissingPersonR(); dbSet_settings_version(1.16); VERSION = 1.16;}
    if (dbGet_settings_version() === 1.16)    { fixVersionDataRosterTime(); dbSet_settings_version(1.17); VERSION = 1.17;}
    if (dbGet_settings_version() === 1.17)    { fixVersionAddDataClosingTime(); dbSet_settings_version(1.18); VERSION = 1.18;}
    if (dbGet_settings_version() === 1.18)    { fixVersionDataOvertimeToFixed(); dbSet_settings_version(1.19); VERSION = 1.19;}
    if (dbGet_settings_version() === 1.19)    { fixVersionDataSortToSetting(); fixVersionDataAddPrintZoom(); dbSet_settings_version(1.21); VERSION = 1.21;}
    if ((dbGet_settings_version() === 1.21) || (dbGet_settings_version() === 2.1)) { fixVersionDataEditableToR(); fixVersionDataAddEditable(); dbSet_settings_version(2.2); VERSION = 2.2;}
    if (dbGet_settings_version() === 2.2)  { fixVersionData22To224(); dbSet_settings_version(2.24); VERSION = 2.24;}
    if (dbGet_settings_version() === 2.21)  { fixVersionDataTo224(); dbSet_settings_version(2.24); VERSION = 2.24;}
    if (dbGet_settings_version() === 2.22)  { fixVersionDataRemovePersonR(); dbSet_settings_version(2.23); VERSION = 2.23;}
    if (dbGet_settings_version() === 2.23)  { fixVersionDataAddPersonShiftSetting(); dbSet_settings_version(2.24); VERSION = 2.24;}
    if (dbGet_settings_version() === 2.24)  { fixVersionDataAddDisplayOvertime(); dbSet_settings_version(2.25); VERSION = 2.25;}
    if (dbGet_settings_version() === 2.25)  { fixVersionDataAddDisplayEditableWeek(); dbSet_settings_version(2.26); VERSION = 2.26;}
    if (dbGet_settings_version() === 2.26)  { fixVersionDataAddClosingTimeX(); dbSet_settings_version(2.27); VERSION = 2.27;}
    if (dbGet_settings_version() === 2.27)  { fixVersionDataRemoveEmptyShiftInfo(); dbSet_settings_version(2.28); VERSION = 2.28;}
    if (dbGet_settings_version() === 2.28)  { fixVersionDataFixUnsetSf(); dbSet_settings_version(2.29); VERSION = 2.29;}
    if (dbGet_settings_version() === 2.29)  { fixVersionDataEditableRowBottom(); dbSet_settings_version(2.3); VERSION = 2.3;}
    if (dbGet_settings_version() === 2.3)  { fixVersionDataMergeClosingtime(); dbSet_settings_version(2.31); VERSION = 2.31;}
    if (dbGet_settings_version() === 2.31)  { fixVersionDataSetClosingtimeId(); dbSet_settings_version(2.32); VERSION = 2.32;}
    if (dbGet_settings_version() === 2.32)  { fixVersionDataSetYearWeekTo7(); dbSet_settings_version(2.33); VERSION = 2.33;}
    if (dbGet_settings_version() === 2.33)  { fixVersionDataNewRosterChangeValue(); dbSet_settings_version(2.34); VERSION = 2.34;}
    if (dbGet_settings_version() === 2.34)  { fixVersionDataNewSettingsValues(); dbSet_settings_version(2.35); VERSION = 2.35;}
}
// <-- FIX FILE_DATA

