
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



submitButton.addEventListener('click', () => {
    let code = codeEditor.getValue()
    // user this or original dom selection ('editor')? --
    // let output = executeCode(code).then()
    executeCode(code).then(function(result){terminal.value=result})
    // terminal.innerText = output
    // console.log("output variable value in event listener: ", output)
    

}) 


