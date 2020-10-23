// Variable declarations for API authentication supplied in private JS file

const API_COMPILER_ENDPOINT = "https://api.jdoodle.com/v1/execute"
const API_USAGE_CHECK_ENDPOINT = "https://cors-anywhere.herokuapp.com/https://api.jdoodle.com/v1/credit-spent"

const executeCode = async(userCode) => {
    try {
        let userCodePayload = {
            script : userCode,
            language : "python3",
            versionIndex : "3",
            clientId : API_CLIENT_ID,
            clientSecret : API_CLIENT_SECRET
        }

        console.log("Code sent to JDoodle: ", userCodePayload.script)
        const response = await axios.post("https://cors-anywhere.herokuapp.com/" + API_COMPILER_ENDPOINT, userCodePayload)
        console.log("Response received from API: ", response)
        let codeOutput = response.data.output
        console.log("Response.output received from API: ", codeOutput)
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
