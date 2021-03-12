
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

terminalMethods.init()



const submitButtonFlexItem = document.querySelector('.submit-button-flex-item')
const submitCircle = document.querySelector("#submit-circle")
const submitWord = document.querySelector("#submit-word")
const winSound = document.querySelector(".winSound")

// async function simulateRequest() {
//     await new Promise(resolve => setTimeout(resolve, 1000))
//     return "simulated terminal"
// }

let awaitingAPI = false

function yellowize(bool) {
    if (bool){
        submitCircle.classList.add('yellow-circle')
        submitWord.classList.remove('blue-text')                         
        submitWord.classList.add('yellow-text') 
    } else {
        submitCircle.classList.remove('yellow-circle')
        submitWord.classList.remove('yellow-text')                         
        submitWord.classList.add('blue-text')  
    }
}

function setSubmitCircleSpeed(speed){
    let baseClasses = "rotating-cirle smaller rotate-counter-clockwise"
    submitCircle.classList.value = (`${baseClasses} ${speed}`)
}


function hoverSubmit(bool) {
    if (awaitingAPI) return
    if (bool){
        setSubmitCircleSpeed("medium")
        yellowize(true)
    } else {
        setSubmitCircleSpeed("slow")
        yellowize(false)
    }
}

submitCircle.addEventListener('mouseover', () => hoverSubmit(true))
submitWord.addEventListener('mouseover', () => hoverSubmit(true))

submitCircle.addEventListener('mouseout', () => hoverSubmit(false))      
submitWord.addEventListener('mouseout', () => hoverSubmit(false))  


function setSubmissionStyles(bool) {
    if (bool){
        awaitingAPI = true
        setSubmitCircleSpeed("fast")
        yellowize(true)
    } else {
        awaitingAPI = false
        setSubmitCircleSpeed("slow")
        yellowize(false)
    }
}


async function submitCode() {

    try {
        let modifiedShellResponse
        let code = editor.getValue()
        if (code === ""){
            terminal.value = "error: no code to execute"
            return
        }
        setSubmissionStyles(true)
        const [output, status] = await executeCode(code)
        if (status === "timeout") {
            setValueAndClear("PyCore Error: timeout of 5s exceeded")
        } else {
            const errorFound = errorCheck(output)
            if (errorFound) modifiedShellResponse = changeJdoodleError(output)
            setValueAndClear(modifiedShellResponse ? modifiedShellResponse : output)
            winSound.play()
        }
        setSubmissionStyles(false)   
    } catch (error) {
        console.log(error)
        setSubmissionStyles(false)   
    }
    // const response = await simulateRequest()
}

submitButtonFlexItem.addEventListener('click', () => submitCode())
submitWord.addEventListener('click', () => submitCode())


document.body.prepend(particles.canvas)
particles.takeFirstPosition()





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
