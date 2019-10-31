const Discord = require("discord.js")
const client = new Discord.Client()
const config = require("./config.json")

client.on('ready', () => {
    console.log('hello world!')
    client.user.setGame('hello world!')
})

client.on('message', async message => {

})

client.login(config.token)