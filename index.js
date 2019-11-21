const Discord = require("discord.js")
const { TextChannel } = require("discord.js")
const client = new Discord.Client()
const config = require("./config.json")
// const axios = require("axios")
const toneAnalyzer = require("./tone")
const languageTranslator = require("./translator")

client.on('ready', () => {
    console.log('hello world!')


    /* Cria role de mutado e remove privilégios de fala */
    const guild = client.guilds.first()

    // if(guild.roles.last().name === 'Muted'){
    //     guild.roles.last().delete()
    // }

    // console.log(guild)
    guild.createRole({
        name: 'Muted',
        color: '#8E1600',
        permissions: ['CONNECT', 'VIEW_CHANNEL']
    })
        .then(role => console.log(`Created new role with name ${role.name} and color ${role.color}`))
        .catch(console.error)
    // const mutedRole = guild.roles.last()
    //console.log(mutedRole)
})

client.on('message', async message => {
    /**
     * Pega o conteuto e o autor da menssagem
     */
    const { content, author } = message

    /**
     * verifica se a messagem foi enviada
     * por algum usuário diferente do bot
     * (pra evitar chamadas recursivas infinitas)
     */
    if(author != client.user){

        /**
         * Chama o analisador de tons e caso a
         * analise ocorra normalmente ele
         * verifica sinais suspeitos e caso
         * necessário apaga a mensagem e
         * envia um alerta.
         *
         * caso a analise ocorra normalmente => .then
         * caso a analise tenha algum erro => catch
         *
         */
        const translatedContent = await languageTranslator.translateText(content)
        toneAnalyzer.analyze(translatedContent)
            .then(({ result, result_tags }) => {
                /**
                 * if -> switch pra multiple actions
                 */
                handleActions(message, { author, content, result, result_tags })
            })
            .catch(console.error)

    }
})

client.login(config.token)
