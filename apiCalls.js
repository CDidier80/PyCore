// API Variables

const API_CLIENT_ID = "2eb3d4df0f10dd5c96099c7d10885557"
const API_CLIENT_SECRET = "cc4dea6d1c39a338423ea8c88ee1ccf7af46febb386c2739bc68281b09ea493d"
const API_COMPILER_ENDPOINT = "https://cors-anywhere.herokuapp.com/https://api.jdoodle.com/v1/execute"
const API_USAGE_CHECK_ENDPOINT = "https://cors-anywhere.herokuapp.com/https://api.jdoodle.com/v1/credit-spent"

//  resources
//   http(s)://thingproxy.freeboard.io/fetch/
//  https://nordicapis.com/10-free-to-use-cors-proxies/
//  trello example   https://trello.com/b/g6V7Aji2/battlebrush




// ENDPOINTS only accept POST method supported with Content-Type: application/json

// DOM Query Selections

const editor = document.querySelector('#editor')
const terminal = document.querySelector('#terminal')
const submitButton = document.querySelector('#submit')




const executeCode = async() => {
    try{

        let userCodePayload = {
            script : editor.value,
            language: "python3",
            versionIndex: "3",
            clientId: API_CLIENT_ID,
            clientSecret: API_CLIENT_SECRET
        }

        console.log("Code sent to JDoodle: ", userCodePayload.script)
        const response = await axios.post(API_COMPILER_ENDPOINT, userCodePayload)
        console.log("Response received from API: ", response)
        let codeOutput = response.data.output
        console.log("Response.output received from API: ", codeOutput)
        terminal.innerText = codeOutput

    } catch(error){
        console.log(error)
    }
    
}


const checkRequestCount = async() => {
    try{

        let = counterOptions = {
            clientId: API_CLIENT_ID,
            clientSecret: API_CLIENT_SECRET
        }
        
        const response = await axios.post(API_USAGE_CHECK_ENDPOINT, counterOptions)
        console.log(response)

    } catch(error){
        console.log(error)
    }
    
}

// checkRequestCount()

submitButton.addEventListener('click', executeCode)




// executeCode()
// checkRequestCount()