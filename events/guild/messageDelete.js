const { MessageEmbed } = require("discord.js")
const ee = require("../../json/embed.json");
const { getChannelLogsMessages, getPrefix, escapeRegex, errorMessageEmbed } = require("../../handlers/functions");

module.exports = async (client, message) => {
    try {
        if (message.author === null) return;
        //if the message is not in a guild (aka in dms),if the message  author is a bot, return aka ignore the inputs
        if (!message.guild || message.author.bot) return;
        //get data of confession cmd
        const cmd = client.commands.get('confession');
        //get the current prefix from the env.prefix or mongodb
        let prefix = await getPrefix(message) || process.env.prefix
        //the prefix can be a Mention of the Bot / The defined Prefix of the Bot
        const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)}|${escapeRegex(prefix).toUpperCase()})\\s*`);
        //now define the right prefix either ping or not ping
        if (prefixRegex.test(message.content)) {
            const [, matchedPrefix] = message.content.match(prefixRegex);
            //create the arguments with sliceing of of the rightprefix length
            const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
            //return if contain name or aliases fo the cmd
            if (cmd.name.toLowerCase() === args[0].toLowerCase()) return
            if (cmd.aliases.includes(args[0].toLowerCase())) return;
        }
        const channelID = await getChannelLogsMessages(message)
        if (channelID === message.channel.id) return;
        const channel = client.channels.cache.get(channelID)

        const embed = new MessageEmbed()
            .setColor(ee.color)
            .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: false, format: 'png' }))
            .setDescription(`Mensaje eliminado en <#${message.channel.id}>`)
            .setTimestamp(message.createdAt)
            .setFooter(`User ID: ${message.author.id} `)
            .addFields(
                { name: 'Contenido', value: `${message.content == '' ? `No tenia texto el mensaje` : message.content}`, inline: false },
            );
        if (message.attachments.size > 0) {
            message.attachments.map(m => embed.setImage(m.url))
        }

        channel.send(embed)
    } catch (e) {
        errorMessageEmbed(e, message)
    }
}