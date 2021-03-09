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


// chooseCoreButton.addEventListener('click', (event) => {
//     if (choose.innerText === "Choose") {
//         hiddenMenubar.style.display = 'none'
//         panel.style.display = 'flex'
//         editorAndWidgets.style.gridTemplateColumns = "1fr 4fr"
//         choose.textContent = 'Collapse'
//         coreText.textContent = 'Menu'
//     } else {
//         panel.style.display = 'none'
//         hiddenMenubar.style.display = 'block'
//         editorAndWidgets.style.gridTemplateColumns = ".02fr 4fr"
//         choose.textContent = 'Choose'
//         coreText.textContent = 'Core'
//     }
// })



