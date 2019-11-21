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
    //console.log(author)
    const roleId = message.guild.roles.find("name", "Muted")
    const { messageMember } = author.lastMessage.member;
    messageMember.addRole(roleId)
        .then(() => console.log(`Muted ${messageMember.displayName}`))
        .catch(console.error);
    setTimeOut( ()=> {
        messageMember.removeRole(roleId)
    },6 * 1000 )

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
handleActions = (message, response) => {
    console.log('[action]: ')
    if(response.result.length > 0) {
        console.log('delete and warning!')
        dangerMessageAction(message, response)
    }
    else {
        console.log('nothing.')
    }
}

module.exports = handleActions
