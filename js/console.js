
devConsole = () => {
   CONSOLE = true
   CONSOLE_INPUT = [{type: "", value: "", name: ""}]
   CONSOLE_OPTIONS = []
   let block = document.getElementById("Console")
   let block_input = block.querySelector("#Console-input")
   block.classList.remove("d-none")
   document.body.setAttribute("onclick", "closeConsole()")
}
closeConsole = () => {
   CONSOLE = false
   document.body.removeAttribute('onclick')
   document.querySelector("#Console").classList.add("d-none")
}
watchConsole = (ev) => {
   console.log(ev.key)
   if ((ev.key === "Enter") || (ev.key === "ArrowRight") || (ev.key === "Tab")) checkConsoleOption()
   if (ev.key === "ArrowUp") consoleSelectNextOption(1)
   if (ev.key === "ArrowDown") consoleSelectNextOption()
   if (ev.key !== "Backspace" && ev.key.length > 1) return
   else if (ev.key === "Backspace") {
      removeConsoleInput()
   } else if (ev.key === " ") {
      checkForType()
   } else {
      CONSOLE_INPUT[CONSOLE_INPUT.length-1].name = CONSOLE_INPUT[CONSOLE_INPUT.length-1].name+ev.key
   }
   renderConsoleInput()
   checkForOptions()
}

removeConsoleInput = () => {
   if (CONSOLE_INPUT.length === 0) return
   last_word = CONSOLE_INPUT[CONSOLE_INPUT.length-1].name
   if (last_word.length === 0) {
      CONSOLE_INPUT.splice(CONSOLE_INPUT.length-1, 1)
      last_word = CONSOLE_INPUT[CONSOLE_INPUT.length-1].name
      last_word = last_word.substring(0, last_word.length-1)
   } else {
      last_word = last_word.substring(0, last_word.length-1)
   }
   CONSOLE_INPUT[CONSOLE_INPUT.length-1].name = last_word
   CONSOLE_INPUT[CONSOLE_INPUT.length-1].type = ""
   CONSOLE_INPUT[CONSOLE_INPUT.length-1].value = ""
}
renderConsoleInput = () => {
   let block_input = document.querySelector("#Console-input")
   block_input.innerHTML = CONSOLE_INPUT.map(c => `<div class="${c.type}">${c.name} </div>`).join(" ")
}
checkConsoleOption = () => {
   checkForAction()
   checkForDays()
   active_block = document.querySelector('#Console-help div.active')
   if (!active_block) {
      removeConsoleInput()
      renderConsoleInput()
      checkForOptions()
      return
   }
   let type = active_block.getAttribute("type")
   let value = active_block.getAttribute("value")
   let name = active_block.innerHTML
   insertConsoleOption(type, value, name)
}
insertConsoleOption = (type, value, name) => {
   CONSOLE_INPUT[CONSOLE_INPUT.length - 1].value = value
   CONSOLE_INPUT[CONSOLE_INPUT.length - 1].type = type
   CONSOLE_INPUT[CONSOLE_INPUT.length - 1].name = name
   CONSOLE_INPUT.push({type: "", value: "", name: ""})
   document.getElementById("Console-help").innerHTML = ""
   renderConsoleInput()
}
consoleSelectDefaultOption = () => {
   let blocks = document.querySelectorAll('#Console-help div')
   if (blocks.length > 0) blocks[blocks.length-1].classList.add("active")
}
consoleSelectNextOption = (direction) => {
   selected="selected"
   let active_option = document.querySelector('#Console-help .active')
   if (!active_option) { consoleSelectDefaultOption(); return }
   active_option.classList.remove("active")
   let next_option = active_option.nextSibling
   if (direction === 1) {
      next_option = active_option.previousSibling
      if (!next_option) {
         let options = document.querySelectorAll('#Console-help div')
         next_option = options[options.length-1]
      }
   } else {
      next_option = active_option.nextSibling
      if (!next_option) { next_option = document.querySelector('#Console-help div') }
   }
   next_option.classList.add("active")
}
checkForType = () => {
   let block_option = document.querySelector("#Console-help .active")
   let type 
   if (!block_option) {
      CONSOLE_INPUT.splice(CONSOLE_INPUT[CONSOLE_INPUT.length-1], 1)
   } else {
      CONSOLE_INPUT[CONSOLE_INPUT.length-1].name = block_option.innerHTML
      CONSOLE_INPUT[CONSOLE_INPUT.length-1].value = block_option.getAttribute("value")
      CONSOLE_INPUT[CONSOLE_INPUT.length-1].type = block_option.getAttribute("type")
   }
   CONSOLE_INPUT.push({type: "", value: "", name: ""})
}
checkForOptions = () => {
   CONSOLE_OPTIONS = []
   let block_help = document.querySelector("#Console-help")

   checkForAction()
   checkForTypes()
   checkForDays()
   checkForName()

   block_help.innerHTML = ""
   CONSOLE_OPTIONS.sort((a, b) => {return b.name.localeCompare(a.name)})
   CONSOLE_OPTIONS.forEach((o) => {
      if (CONSOLE_INPUT.map(c => {return c.name}).indexOf(o.name) > -1 ) return
      let block_option = document.createElement("div")
      block_option.setAttribute("type", o.type)
      block_option.setAttribute("value", o.value)
      block_option.innerHTML = o.name
      block_help.appendChild(block_option)
   })
   consoleSelectDefaultOption()
}
checkForDays = () => {
   let last_word = CONSOLE_INPUT[CONSOLE_INPUT.length-1].name
   let days = DAYS.filter((d) => d.toLocaleLowerCase().includes(last_word.toLocaleLowerCase()))
   DAYS.forEach((d, d_id) => {
      if (days.indexOf(d) > -1) {
         CONSOLE_OPTIONS.push({type: "day", value: d_id, name: d})
      }
   })
}
checkForTypes = () => {
   let last_word = CONSOLE_INPUT[CONSOLE_INPUT.length-1].name
   let default_types = ["shift", "person", "vacation", "mpa", "department"]
   let types = default_types.filter((d) => d.toLocaleLowerCase().includes(last_word.toLocaleLowerCase()))
   let options = ""
   types.forEach(t => {
      CONSOLE_OPTIONS.push({type: "type", value: t, name: t})
   })
}
checkForAction = () => {
   let last_word = CONSOLE_INPUT[CONSOLE_INPUT.length-1].name
   let default_actions = ["add", "remove", "copy"]
   let actions = default_actions.filter((d) => d.toLocaleLowerCase().includes(last_word.toLocaleLowerCase()))
   
   actions.forEach(a => {
      CONSOLE_OPTIONS.push({type: "action", value: a, name: a})
   })
}
checkForName = () => {
   let last_word = CONSOLE_INPUT[CONSOLE_INPUT.length-1].name
   let person_all = PERSONS.filter((p) => p.n.toUpperCase().includes(last_word.toUpperCase()))
   person_all.forEach(p => {
      CONSOLE_OPTIONS.push({type: "person", value: p.id, name: p.n})
   })
}
