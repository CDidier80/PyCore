

let codeEditor = ace.edit("editor") 


let editorMethods = {
    init(){
        // theme
        codeEditor.setTheme('ace/theme/tomorrow_night_blue')
        codeEditor.session.setMode('ace/mode/javasript')
    }

}

editorMethods.init()