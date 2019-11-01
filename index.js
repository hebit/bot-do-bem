const Discord = require("discord.js")
const { TextChannel } = require("discord.js")
const client = new Discord.Client()
const config = require("./config.json")
const axios = require("axios")
const toneAnalyzer = require("./api")

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
        toneAnalyzer.analyze(content)
            .then(({ result, result_tags }) =>{
                console.log('result:', result)
                if(result.length >= 1){
                    /**
                     * Deleta a mensagem se algum resultado suspeito for encontrado
                     */
                    message.delete()
                        .then(() => console.log(`[deleted message] of: ${author.username}`))
                        .catch(console.error)

                    /**
                     * Manda uma mensagem de alerta (com debug detalhando a mensagem anteriormente enviada)
                     */
                    message.channel.send(`${author.username} você não deve ser maldoso :/\n`+
                        `debug purpose: \`\`\`\n`+
                        `${JSON.stringify({
                            text: content,
                            tags: result_tags,
                            details: result
                          }, null, 2)}`+
                        `\n\`\`\``
                    )
                        .then(() => console.log(`[sent message] : ${content}`))
                        .catch(console.error)
                }
            })
            .catch(console.error)
    }
})

client.login(config.token)