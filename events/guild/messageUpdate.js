const { MessageEmbed } = require("discord.js");
const ee = require("../../json/embed.json");
const { getChannelLogsMessages, getUpdateMessages } = require("../../handlers/functions");

module.exports = async (client, oldMessage, newMessage) => {
    let status = await getUpdateMessages(newMessage);
    if (status == false) return;
    if (!oldMessage.author) return;
    //if the message is not in a guild (aka in dms),if the message  author is a bot, return aka ignore the inputs
    if (!oldMessage.guild || oldMessage.author.bot) return;
    //if the channel is on partial fetch it
    if (oldMessage.channel.partial) await oldMessage.channel.fetch();
    if (newMessage.channel.partial) await newMessage.channel.fetch();
    //if the message is on partial fetch it
    if (oldMessage.partial) await oldMessage.fetch();
    if (newMessage.partial) await newMessage.fetch();
    //function to count message of users
    const channelID = await getChannelLogsMessages(newMessage)
    if (channelID === newMessage.channel.id) return;
    const channel = client.channels.cache.get(channelID)
    //channel.send(`Old: ${oldMessage}\n New: ${newMessage}`)
    const embed = new MessageEmbed()
        .setColor(ee.color)
        .setAuthor(newMessage.author.tag, newMessage.author.avatarURL({ dynamic: false, format: 'png' }))
        .setDescription(`Mensaje editado en <#${channel.id}>`)
        .setTimestamp(newMessage.createdAt)
        .setFooter(`User ID: ${newMessage.author.id} `)
        .addFields(
            { name: 'Contenido anterior', value: `${oldMessage.content == '' ? `No tenia texto el mensaje` : oldMessage.content}`, inline: false },
            { name: 'Contenido', value: `${newMessage.content == '' ? `No tenia texto el mensaje` : newMessage.content}`, inline: false }
        );
    if (oldMessage.attachments.size > 0) {
        oldMessage.attachments.map(m => embed.setImage(m.url))
    }

    channel.send(embed)
}