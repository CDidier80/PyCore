const submitButtonFlexItem = document.querySelector('.submit-button-flex-item')
const submitCircle = document.querySelector("#submit-circle")
const submitWord = document.querySelector("#submit-word")
const output = document.querySelector("#output")
const winSound = document.querySelector(".winSound")


function restoreSubmitDefault() {   
    submitCircle.classList.toggle("clicked")
    submitCircle.style.backgroundImage = 'url("../media/core.png")'
    submitWord.classList.toggle('yellow-text')  
}

submitButtonFlexItem.addEventListener('click', async () => {
    let code = editor.getValue()
    if (code === ""){
        output.value = "error: no code to execute"
        return
    }

    submitCircle.classList.add('clicked')

    const response = await executeCode(code)
    output.value = response
    winSound.play()
    restoreSubmitDefault()   
    return
}) 


submitCircle.addEventListener('mouseover', () => {
    submitCircle.style.backgroundImage = 'url("../media/yellow-core.png")'
    submitWord.classList.toggle('yellow-text')                         
}) 

submitCircle.addEventListener('mouseout', () => {
    submitCircle.style.backgroundImage = 'url("../media/core.png")'
    submitWord.classList.toggle('yellow-text')                         
}) 

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