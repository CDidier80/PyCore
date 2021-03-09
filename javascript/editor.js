
// requests routed through Collin's proxy server
const executeCode = async(userCode) => {
    const endpoint = "https://collin-didier-proxy.herokuapp.com/pycore/execute"
    try {
        let userCodePayload = {
            script : userCode,
            versionIndex : "3",
            language : "python3",
        }
        const proxyResponse = await axios.post(endpoint, userCodePayload, {timeout: 5000})
        const { output: executedCode } = proxyResponse.data
        return [executedCode, "received"]
    } catch(error) {
        console.log(error)
        return [error, "timeout"]
    }
}


const errorCheck = (shellResponse) => (shellResponse.indexOf(`File "jdoodle.py"`) !== -1)


function changeJdoodleError(shellResponse) {
    let outputMessage = shellResponse.replace("jdoodle.py", "main.py")
    return outputMessage
}


const aceEditor = document.querySelector('#ace-editor')

let greeting = `# write & execute Python code
greeting = ["Welcome", "to", "PyCore"]
for word in greeting: 
    print(word)
`
const editor = ace.edit(aceEditor)

let editorMethods = {
    init(){
        editor.setTheme('ace/theme/tomorrow_night_blue')
        editor.session.setMode('ace/mode/python')
        editor.setValue(greeting)
        editor.clearSelection()
        editor.setShowPrintMargin(false)
    }
}

editorMethods.init()


const aceTerminal = document.querySelector("#terminal")
const terminal = ace.edit(aceTerminal)

function setValueAndClear(value){
    terminal.setValue(value)
    terminal.clearSelection()
}

let terminalMethods = {
    init(){
        terminal.session.setMode('ace/mode/python')
        terminal.setShowPrintMargin(false)
        setValueAndClear(">")
        terminal.renderer.$cursorLayer.element.style.display = "none"
        terminal.setOptions({
            highlightActiveLine: false, 
            readOnly: true,
        })
    }
}

// console.log(terminal.renderer)
terminalMethods.init()




// const checkRequestCount = async() => {
//     try{
//         let = counterOptions = {
//             clientId: API_CLIENT_ID,
//             clientSecret: API_CLIENT_SECRET
//         }
//         const response = await axios.post(API_USAGE_CHECK_ENDPOINT, counterOptions)
//     } catch(error){
//         console.log(error)
//     }
// }
