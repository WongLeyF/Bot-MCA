const { MessageEmbed, MessageAttachment } = require('discord.js');
const { getChannelLogsMessages } = require('../../handlers/controllers/settings.controller');
const { webHookErrorMessage } = require('../../handlers/functions');

module.exports = async (client, messages) => {

    const channelID = await getChannelLogsMessages(messages.first())
    if (channelID === messages.first().channel.id) return;
    const channel = await client.channels.cache.get(channelID)
    const fecha = new Date();
    const guildName = await messages.first().channel.guild.name.replace(/\s/g, "-")
    const rand = Math.floor(Math.random() * 99)
    const filepath = `.temp/${fecha.toISOString().slice(0, 10)}_${rand}_${guildName}.txt`
    const fs = require('fs').promises;

    try {
        fs.mkdir('.temp', { recursive: true }, (err) => {
            if (err) throw err;
        });
        const filteredMessages = messages.filter(f => {
            if (f.author) if (f.author.bot === false) return f;
        }).map(fm =>
            `${fm.author.username}#${fm.author.discriminator} (${fm.author})  ${fm.content}\n\n`
        )
        if (filteredMessages.length === 0) throw 'No hay mensajes';
        // write to a new file named 2pac.txt
        await fs.writeFile(filepath, filteredMessages.join(''), (err) => {
            // throws an error, you could also catch it here
            if (err) throw err;
        })

        channel.send({
            content: `${messages.size} Mensajes borrados en <#${messages.first().channel.id}>: `,
            files: [
                new MessageAttachment(filepath)
            ]
        }).then(() => fs.unlink(filepath).catch(e => webHookErrorMessage(e, "messageDeleteBulk.js")))


    } catch (err) {
        if(err === "No hay mensajes"){
            return;
        }
        console.error(String(err.stack).bgRed)
        webHookErrorMessage(err, "messageDeleteBulk.js")
        channel.send({
            embeds: [new MessageEmbed()
                .setColor('RED')
                .setDescription(`❌ No pude guardar los mensajes de: <#${messages.first().channel.id}>\nEran: ${messages.size} mensajes`)
            ]
        })
    }
}