

// event listeners
submitButton.addEventListener('click', executeCode)



let codeEditor = ace.edit("editor") 

console.log('editorMethods reached')
let editorMethods = {
    init(){
        // theme
        codeEditor.setTheme('ace/theme/tomorrow_night_blue')
        codeEditor.session.setMode('ace/mode/javasript')
    }

}

editorMethods.init()






