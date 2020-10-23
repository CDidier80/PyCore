let codeEditor = ace.edit("editor") 

let editorMethods = {
    init(){
        codeEditor.setTheme('ace/theme/tomorrow_night_blue')
        codeEditor.session.setMode('ace/mode/python')
    }
}

editorMethods.init()

submitButton.addEventListener('click', () => {
    let code = codeEditor.getValue()
    
    if (code === ""){
        terminal.value = "error: no code to execute"
        return
    }

    executeCode(code).then(function(result) { terminal.value = result })                                                   
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