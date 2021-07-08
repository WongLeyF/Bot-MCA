const { MessageEmbed } = require('discord.js');
const { getChannelLogsMessages } = require('../../handlers/mongo/controllers');

module.exports = async (client, messages) => {

    const channelID = await getChannelLogsMessages(messages.first())
    if (channelID === messages.first().channel.id) return;
    const channel = client.channels.cache.get(channelID)
    const fecha = new Date();
    const guildName = await messages.first().channel.guild.name.replace(/\s/g, "-")
    const rand = Math.floor(Math.random() * 99)
    const filepath = `${fecha.toISOString().slice(0, 10)}_${rand}_${guildName}`
    const fs = require('fs');
    
    try {
        fs.mkdir('.temp', { recursive: true }, (err) => {
            if (err) throw err;
          });
        const filteredMessages = messages.filter(f => {
            if (f.author) if (f.author.bot === false) return f;
        }).map(fm =>
            `${fm.author.username}#${fm.author.discriminator} (${fm.author})  ${fm.content}\n\n`
        )
        if (filteredMessages.length === 0) throw new Error('No hay mensajes');
        // write to a new file named 2pac.txt
        fs.writeFileSync(`.temp/${filepath}.txt`, filteredMessages.join(''), (err) => {
            // throws an error, you could also catch it here
            if (err) throw err;
        })


        channel.send(`${messages.size} Mensajes borrados en <#${messages.first().channel.id}>: `, {
            files: [
                `.temp/${filepath}.txt`
            ]
        }).then(() => fs.unlinkSync(`.temp/${filepath}.txt`))

    } catch (err) {
        console.error(String(err.stack).bgRed)
        channel.send(new MessageEmbed()
            .setColor('RED')
            .setDescription(`❌ No pude guardar los mensajes de: <#${messages.first().channel.id}>\nEran: ${messages.size} mensajes`)
        )
    }
}