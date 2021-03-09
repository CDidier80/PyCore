// requests routed through Collin's proxy server
const executeCode = async(userCode) => {
    const endpoint = "https://collin-didier-proxy.herokuapp.com/pycore/execute"
    try {
        let userCodePayload = {
            script : userCode,
            versionIndex : "3",
            language : "python3",
        }
        const proxyResponse = await axios.post(endpoint, userCodePayload)
        const { output: executedCode } = proxyResponse.data
        return executedCode
    } catch(error) {
        console.log(error)
    }
}


const errorCheck = (shellResponse) => (shellResponse.indexOf(`File "jdoodle.py"`) !== -1)


function changeErrorMessage(shellResponse) {
    let outputMessage = shellResponse.replace("jdoodle.py", "main.py")
    return outputMessage
}
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


const aceEditor = document.querySelector('#ace-editor')
let greeting = `# write & execute Python code
greeting = "Welcome to PyCore"
print(greeting)
`

// let greeting = "hello"
const editor = ace.edit(aceEditor)

let editorMethods = {
    init(){
        editor.setTheme('ace/theme/tomorrow_night_blue')
        editor.session.setMode('ace/mode/python')
        editor.setValue(greeting)
        editor.clearSelection()
    }
}

editorMethods.init()



const aceTerminal = document.querySelector("#terminal")
const terminal = ace.edit(aceTerminal)

let terminalMethods = {
    init(){
        editor.setTheme()
        editor.session.setMode('ace/mode/python')
        editor.setValue(">")
        
    }
}
