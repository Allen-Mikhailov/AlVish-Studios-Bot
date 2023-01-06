const https = require("https");
const fs = require("fs");
const { resolveSoa } = require("dns");

require('dotenv').config();

const url = `https://discord.com/api/v10/applications/${process.env.APPLICATIONID}/commands`

const headers = {
    "Authorization": `Bot ${process.env.BOTTOKEN}`
}

const commands = []
fs.readdirSync("./commands").map((path) => {
    require("./commands/"+path).cmds.map((command) => {
        commands.push(command)
    })
})

const requestOptions = {
    hostname: 'discord.com',
    port: 443,
    path: `/api/v10/applications/${process.env.APPLICATIONID}/commands`,
    method: 'POST',
    json: commands[0],
    headers: headers,
}

https.request(requestOptions, (res) => {
    res.on("data", (chunk) => {
        console.log("Chunk", chunk)
    })

    res.on("error", (err) => {
        console.log(err)
    })

    res.on("closed", (chunk) => {
        console.log("closed")
    })
})