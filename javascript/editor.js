const API_CLIENT_ID="2eb3d4df0f10dd5c96099c7d10885557"
const API_CLIENT_SECRET="cc4dea6d1c39a338423ea8c88ee1ccf7af46febb386c2739bc68281b09ea493d"
const API_COMPILER_ENDPOINT = "https://api.jdoodle.com/v1/execute"
const API_USAGE_CHECK_ENDPOINT = "https://cors-anywhere.herokuapp.com/https://api.jdoodle.com/v1/credit-spent"

const executeCode = async(userCode) => {
    console.log("reached")
    try {
        let userCodePayload = {
            script : userCode,
            versionIndex : "3",
            language : "python3",
            clientId : API_CLIENT_ID,
            clientSecret : API_CLIENT_SECRET
        }
        // console.log("Code sent to JDoodle: ", userCodePayload.script)
        // const response = await axios.post("https://cors-anywhere.herokuapp.com/" + API_COMPILER_ENDPOINT, userCodePayload)
        const response = await axios.post(API_COMPILER_ENDPOINT, userCodePayload)
        // console.log("Response received from API: ", response)
        let codeOutput = response.data.output
        // console.log("Response.output received from API: ", codeOutput)
        return codeOutput
    } catch(error) {
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


const aceEditor = document.querySelector('#ace-editor')

const editor = ace.edit(aceEditor)


let editorMethods = {
    init(){
        editor.setTheme('ace/theme/tomorrow_night_blue')
        editor.session.setMode('ace/mode/python')
    }
}

editorMethods.init()
