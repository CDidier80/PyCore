// API Variables
let proxyList = [
    "https://cors-anywhere.herokuapp.com/",
    "https://thingproxy.freeboard.io/",
    "https://cors-proxy.htmldriven.com/",
    "http://anyorigin.com/go?url=",
    "https://api.allorigins.win/post?url="

]
const API_CLIENT_ID = "2eb3d4df0f10dd5c96099c7d10885557"
const API_CLIENT_SECRET = "cc4dea6d1c39a338423ea8c88ee1ccf7af46febb386c2739bc68281b09ea493d"
const API_COMPILER_ENDPOINT = "https://api.jdoodle.com/v1/execute"


const API_USAGE_CHECK_ENDPOINT = "https://cors-anywhere.herokuapp.com/https://api.jdoodle.com/v1/credit-spent"

//  resources
//   http(s)://thingproxy.freeboard.io/fetch/
//  https://nordicapis.com/10-free-to-use-cors-proxies/
//  trello example   https://trello.com/b/g6V7Aji2/battlebrush

// ENDPOINTS only accept POST method supported with Content-Type: application/json

const executeCode = async(userCode) => {
    
    try{

        let userCodePayload = {
            script : userCode,
            language: "python3",
            versionIndex: "3",
            clientId: API_CLIENT_ID,
            clientSecret: API_CLIENT_SECRET
        }

        console.log("Code sent to JDoodle: ", userCodePayload.script)
        const response = await axios.post(proxyList[0]+API_COMPILER_ENDPOINT, userCodePayload)
        // const response = await axios.post(API_COMPILER_ENDPOINT, userCodePayload)
        console.log("Response received from API: ", response)
        let codeOutput = response.data.output
        console.log("Response.output received from API: ", codeOutput)
        return codeOutput

    } catch(error) {
        console.log(error)
        
    }
    
    
}



const PyPyJsExecute = (code) => {
    console.log('reached')
    pypyjs.ready().then(function() {
    //     // return pypyjs.exec(code)
    //     console.log(pypyjs.eval(code))
        return pypyjs.exec(code)
    })}





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

// executeCode()
// checkRequestCount()