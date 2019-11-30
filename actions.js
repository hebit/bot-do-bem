dangerMessageAction = (message, { author, content, result, result_tags }) => {
    /**
     * Deleta a mensagem se algum resultado suspeito for encontrado
     */
    message.delete()
        .then(() => console.log(`[deleted message] of: ${author.username}`))
        .catch(console.error)

    //debug(message, { author, content, result, result_tags })
    message.channel.send('`Mensagem ofensiva, por favor seja respeitoso <3`')
}

debug = (message, { author, content, result, result_tags }) => {
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
    )   .then(() => console.log(`[sent message] : ${content}`))
        .catch(console.error)
}

muteMemberAction = (message, author) => {
    //console.log(author)
    const messageMember = author.lastMessage.member
    const mutedRole = message.guild.roles.find("name", "Muted")

    if(messageMember.roles.find("name", "Muted") != null){
        messageMember.kick()
    }else{
        messageMember.addRole(mutedRole)
        .then(() => console.log(`Mute ${messageMember.displayName}`))
        .catch(console.error)
    }

    setTimeout( ()=> {
        // messageMember.addRole(everyoneRole)
        // .then(() => console.log(`Unmute ${messageMember.displayName}`))
        // .catch(console.error)
        messageMember.removeRole(mutedRole)
    },60 * 1000 )
}

handleActions = (message, response) => {
    console.log('[action]: ')
    if(response.result.length > 0) {
        console.log('delete and warning!')
        dangerMessageAction(message, response)
        muteMemberAction(message, response.author)
    }
    else {
        console.log('nothing.')
    }
}

module.exports = handleActions
