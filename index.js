const Discord = require("discord.js")
const { TextChannel } = require("discord.js")
const client = new Discord.Client()
const config = require("./config.json")
// const axios = require("axios")
const toneAnalyzer = require("./tone")
const languageTranslator = require("./translator")

client.on('ready', () => {
    console.log('hello world!')
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
