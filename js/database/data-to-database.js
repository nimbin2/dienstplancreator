
dataToDatabaseCallPeople = async (data) => {
    let labels = await dbGet_shift_labels()
    let departments = await dbGet_departments()
    callP = (p, p_id) => {
        // fix closingtime person ids
        data.x.forEach(x => {
            let xid = x.p.indexOf(p.id) 
            x.p[xid] = p_id
        })
        data.a.forEach(a => {
            if (a.d >= p.a) {
                dbSet_person_hours(p_id, a.d)
            }
            let pos = a.o.filter(o => o[0] === p.id)
            //pos.forEach(o => dbAdd_person_overtime(p_id, a.d, o[1]))
            if (a.i) {
                let pis = a.i.filter(i => i.p === p.id)
                pis?.forEach(i => dbSet_roster_info_where_yearweek_and_day_and_person(a.d, i.d, p_id, i.t)) 
            }
            a.s.forEach((s, sid) => {
                let psds = s.filter(sd => sd.p === p.id)
                let breaks
                let hours = s.e+a.t-s.a
                psds?.forEach(s => dbAdd_shift(a.d, sid, p_id, s.s, s.e+a.t))
            })
            let ecrs = a.ecr?.filter(r => r.k === p.id.toString())
            ecrs?.forEach(d => dbSet_roster_editable_cells_right_where_key(a.d, p_id.toString(), d.v))
        })
        let pcs = data.pc.filter(c => c.p === p.id)
        dbAdd_person_change_where_yearweek_and_day_and_person_and_key(p.a, 999, p_id, "n", p.n) 
        dbAdd_person_change_where_yearweek_and_day_and_person_and_key(p.a, 999, p_id, "d", p.d.toString()) 
        dbAdd_person_change_where_yearweek_and_day_and_person_and_key(p.a, 999, p_id, "h", p.h) 
        pcs.forEach(c => {
            let c_v
            if (c.k === "sl") {
                c_v = labels.find(ll => ll.name === DATA.l.find(l => l.id === c.v)?.n)?.id?.toString() || c.v.toString() 
            } else if (c.k === "d") {
                c_v = departments.find(dd => dd.name === DATA.d.find(l => l.id === c.v)?.v)?.id?.toString() || c.v.toString()
            } else if (c.k === "n") {
                c_v = p.n
            } else {
                c_v = c.v.toString()
            }
            dbAdd_person_change_where_yearweek_and_day_and_person_and_key(c.d, typeof c.t === "undefined" ? 999 : c.t, p_id, c.k, c_v) 
        })
        p.i.forEach(i => dbAdd_person_illnes(p_id, i[0], i[1]))
        p.v.forEach(v => dbAdd_person_vacation(p_id, v[0], v[1]))
        p.b.forEach(b => dbAdd_person_betterment(p_id, b[0], b[1], b[2]))
        if (p.o) p.o.forEach(o => dbAdd_person_overtime_manual(o[0].length === 6 ? (o[0].substring(0,5)+"0"+o[0].substring(5)) : o[0], p_id, o[1])) 

    }
    for (let i=0; i<data.p.length; i++) {
        let p = data.p[i]
        p.n = `person_${i+1}`
        p.d = departments.find(dd => dd.name === DATA.d.find(l => l.id === p.d)?.v)?.id
        dbAdd_person({name: p.n, activated: p.a, department: p.d, hours: p.h, mpa: [...p.m]}).then(p_id => {
            p.newid = p_id
            DATA.p.find(dp => dp.id === p.id).newid = p_id
            callP(p, p_id)
            data.x.forEach(x => {
                x.p.indexOf(p.id > -1) &&
                    dbAdd_closingtime_person(x.id, p_id)
            })
        })
    }
}
dataToDatabase = (data) => {
    fetch("/api/institution/addClean.php", {
        method: "POST",
        body: JSON.stringify({name: "Test_1", yearweek: "2023-05"}),
        headers: {
        "Content-Type": "application/json; charset=UTF-8"
        }
    })  
    dbAdd_settings(data.v, data.so, data.secr, data.sert, data.serb, data.sd, data.sw, data.m, data.z, 100, 100)
    data.n.forEach(label => dbAdd_settings_label(label.id, label.t, label.a) )
    data.d.sort((a, b) => a.id - b.id).forEach(dep => dbAdd_department(dep.v))
    data.l.forEach(l => dbAdd_shift_label(l.n, l.c))
    data.rc.forEach(c=> dbSet_roster_change_where_yearweek_and_day(c.d, c.k, c.s, c.e, c.a.toString()))
    data.a.forEach(a => a.ecr?.forEach(d => {d.k === "i" && dbSet_roster_editable_cells_right_where_key(a.d, d.k, d.v)}) )
    data.a.forEach(a => dbSet_roster(a.d, a.t, a.b) )
    data.a.forEach((a) => a.ert?.forEach(d => dbSet_roster_editable_rows_top_where_key(a.d, d.k, d.v)) )
    data.a.forEach((a) => a.erb?.forEach(d => dbSet_roster_editable_rows_bottom_where_key(a.d, d.k, d.v)) )
    data.x.forEach((x, xi) => {
        dbAdd_closingtime(x.t, x.s, x.e, [], x.x).then((cl_id) => {
            x.id = cl_id
            if (xi === data.x.length-1) {
                dataToDatabaseCallPeople(data).then((person_ids) => {
                    DATA.p.forEach(p => {
                        data.a.forEach(a => {
                            if (a.d >= p.a) {
                                dbSet_person_hours(p.newid, a.d)
                            }
                        })
                    })
                })
            }
        })
    })
}

dataResetAllOvertime = () => {
    DATA.p.forEach(p => {
        DATA.a.forEach(a => {
            if (a.d >= p.a) {
                dbSet_person_hours(p.newid, a.d)
            }
        })
    })
}

/*
fetch('./dienstplan-example')
    .then((response) => response.json())
    .then((json) => {DATA = json.DATA; console.log(DATA)});
    */
