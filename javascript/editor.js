
// event listeners







// let editorOptions = {

// }



let codeEditor = ace.edit("editor") 

let editorMethods = {
    init(){
      
        codeEditor.setTheme('ace/theme/tomorrow_night_blue')
        codeEditor.session.setMode('ace/mode/python')
        // codeEditor.setOptions(0)
    }
}

editorMethods.init()

console.log(codeEditor.getOptions)

submitButton.addEventListener('click', () => {
    let code = codeEditor.getValue()
    if (code === ""){
        terminal.value = "error: no code to execute"
        return
    }
    // user this or original dom selection ('editor')? --
    // let output = executeCode(code).then()
    executeCode(code).then(function(result){terminal.value=result})
    // output = PyPyJsExecute(code).then(function(result){terminal.value=result})
    // output = PyPyJsExecute(code)
    // terminal.innerText = output
    // console.log("output variable value in event listener: ", output)
                                                               

}) 


chooseCoreButton.addEventListener('click', (event) => {
    if (choose.innerText === "Choose") {
        hiddenMenubar.style.display = 'none'
        panel.style.display = 'flex'
        editorAndWidgets.style.gridTemplateColumns = "1fr 4fr"
        choose.textContent = 'Collapse'
        coreText.textContent = 'Menu'
    } else {
        panel.style.display = 'none'
        hiddenMenubar.style.display = 'block'
        editorAndWidgets.style.gridTemplateColumns = ".02fr 4fr"
        choose.textContent = 'Choose'
        coreText.textContent = 'Core'
    }


})